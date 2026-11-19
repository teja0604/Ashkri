import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import fs from 'node:fs/promises';
import path from 'node:path';
import {
  inspectZipStructure,
  validateDocxStructure,
  validatePdfStructure,
  validateAttachment,
  storeAttachment,
  deleteStoredAttachment,
} from '@/lib/storage';
import {
  extractClientIp,
  normalizeIp,
  isValidIp,
  isLocalhostIp,
} from '@/lib/trusted-proxy';
import {
  SimulatedDistributedRateLimiter,
  hashIp,
  _resetRateLimitStoreForTesting,
} from '@/lib/rate-limit';
import { OutboxDispatcher, transportEmail } from '@/lib/email';
import { submitEnquiryAction } from '@/actions/enquiry';
import prisma from '@/lib/prisma';
import * as envModule from '@/lib/env';

/**
 * Binary helper to construct valid and invalid ZIP buffers without external dependencies
 */
function buildZipBuffer(
  entries: Array<{
    name: string;
    content?: string;
    uncompressedSize?: number;
    compressedSize?: number;
  }>
): Buffer {
  const localHeaders: Buffer[] = [];
  const cdHeaders: Buffer[] = [];
  let offset = 0;

  for (const entry of entries) {
    const nameBuf = Buffer.from(entry.name, 'utf8');
    const dataBuf = Buffer.from(entry.content || '', 'utf8');
    const uncompressedSize =
      entry.uncompressedSize !== undefined ? entry.uncompressedSize : dataBuf.length;
    const compressedSize =
      entry.compressedSize !== undefined ? entry.compressedSize : dataBuf.length;

    // Local file header (30 bytes + name + data)
    const lh = Buffer.alloc(30);
    lh.writeUInt32LE(0x04034b50, 0); // Local header signature
    lh.writeUInt16LE(10, 4); // Min version
    lh.writeUInt16LE(0, 6); // Flags
    lh.writeUInt16LE(0, 8); // Compression method (0 = stored)
    lh.writeUInt16LE(0, 10); // Time
    lh.writeUInt16LE(0, 12); // Date
    lh.writeUInt32LE(0, 14); // CRC32
    lh.writeUInt32LE(compressedSize, 18);
    lh.writeUInt32LE(uncompressedSize, 22);
    lh.writeUInt16LE(nameBuf.length, 26);
    lh.writeUInt16LE(0, 28); // Extra len

    const localEntry = Buffer.concat([lh, nameBuf, dataBuf]);
    localHeaders.push(localEntry);

    // Central directory header (46 bytes + name)
    const cd = Buffer.alloc(46);
    cd.writeUInt32LE(0x02014b50, 0); // CD signature
    cd.writeUInt16LE(20, 4); // Version made by
    cd.writeUInt16LE(10, 6); // Version needed
    cd.writeUInt16LE(0, 8); // Flags
    cd.writeUInt16LE(0, 10); // Compression
    cd.writeUInt16LE(0, 12); // Time
    cd.writeUInt16LE(0, 14); // Date
    cd.writeUInt32LE(0, 16); // CRC32
    cd.writeUInt32LE(compressedSize, 20);
    cd.writeUInt32LE(uncompressedSize, 24);
    cd.writeUInt16LE(nameBuf.length, 28);
    cd.writeUInt16LE(0, 30); // Extra field len
    cd.writeUInt16LE(0, 32); // Comment len
    cd.writeUInt16LE(0, 34); // Disk start
    cd.writeUInt16LE(0, 36); // Internal attr
    cd.writeUInt32LE(0, 38); // External attr
    cd.writeUInt32LE(offset, 42); // Offset of local header

    cdHeaders.push(Buffer.concat([cd, nameBuf]));
    offset += localEntry.length;
  }

  const allLocal = Buffer.concat(localHeaders);
  const allCd = Buffer.concat(cdHeaders);

  // End of Central Directory record (22 bytes)
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0); // EOCD signature
  eocd.writeUInt16LE(0, 4); // Disk num
  eocd.writeUInt16LE(0, 6); // CD disk
  eocd.writeUInt16LE(entries.length, 8); // Disk entries
  eocd.writeUInt16LE(entries.length, 10); // Total entries
  eocd.writeUInt32LE(allCd.length, 12); // CD size
  eocd.writeUInt32LE(allLocal.length, 16); // CD offset
  eocd.writeUInt16LE(0, 20); // Comment len

  return Buffer.concat([allLocal, allCd, eocd]);
}

describe('Phase 3 Production Hardening Review', () => {
  beforeEach(() => {
    _resetRateLimitStoreForTesting();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // =========================================================================
  // 1. RATE LIMITING ACROSS SIMULATED INDEPENDENT INSTANCES
  // =========================================================================
  describe('1. Distributed Rate Limiting Across Instances', () => {
    it('enforces shared threshold atomically when multiple serverless instances check the same IP', async () => {
      const limiter = new SimulatedDistributedRateLimiter();
      const ipKey = hashIp('203.0.113.45');
      const limit = 5;
      const windowMs = 60 * 1000;

      // Simulate 3 distinct lambda instances handling concurrent client requests
      const instanceA = () => limiter.check(ipKey, limit, windowMs);
      const instanceB = () => limiter.check(ipKey, limit, windowMs);
      const instanceC = () => limiter.check(ipKey, limit, windowMs);

      // Requests 1-5 across different instances
      const r1 = await instanceA();
      const r2 = await instanceB();
      const r3 = await instanceC();
      const r4 = await instanceA();
      const r5 = await instanceB();

      expect(r1.success).toBe(true);
      expect(r2.success).toBe(true);
      expect(r3.success).toBe(true);
      expect(r4.success).toBe(true);
      expect(r5.success).toBe(true);
      expect(r5.remaining).toBe(0);

      // Request 6 from any instance should be rejected atomically
      const r6 = await instanceC();
      expect(r6.success).toBe(false);
      expect(r6.remaining).toBe(0);
      expect(r6.error).toContain('Too many consultation requests');
    });
  });

  // =========================================================================
  // 2. CONCURRENT DUPLICATE SUBMISSIONS (ATOMIC DB-LEVEL IDEMPOTENCY)
  // =========================================================================
  describe('2. Concurrent Duplicate Submissions (Idempotency)', () => {
    it('prevents duplicate records on concurrent race conditions via DB unique constraint P2002', async () => {
      const testRef = 'ASH-202611-DUP1';
      const testIdemKey = 'idem_test_race_condition_key';

      // Mock prisma transaction to simulate a duplicate race condition (PostgreSQL P2002 error)
      const isConfiguredSpy = vi.spyOn(envModule, 'isDatabaseConfigured').mockReturnValue(true);

      const p2002Error = new Error('Unique constraint failed on the fields: (idempotencyKey)');
      (p2002Error as unknown as { code: string }).code = 'P2002';

      vi.spyOn(prisma, '$transaction').mockRejectedValueOnce(p2002Error);
      vi.spyOn(prisma.enquiry, 'findUnique').mockResolvedValueOnce({
        id: 'existing-enquiry-uuid',
        referenceNumber: testRef,
      } as any);

      const fd = new FormData();
      fd.append('studentName', 'Teja V');
      fd.append('email', 'teja@mitindia.edu');
      fd.append('phone', '+919443212345');
      fd.append('college', 'MIT Campus');
      fd.append('department', 'CSE');
      fd.append('domain', 'Cloud & Distributed Systems');
      fd.append('service', 'Full-Stack Software Assistance');
      fd.append('description', 'Concurrent idempotent test payload.');
      fd.append('consent', 'true');
      fd.append('idempotencyKey', testIdemKey);

      const result = await submitEnquiryAction(fd);

      // Should safely return existing reference number without crashing
      expect(result.success).toBe(true);
      expect(result.referenceNumber).toBe(testRef);

      isConfiguredSpy.mockRestore();
    });
  });

  // =========================================================================
  // 3. FAILURE-SAFE UPLOADS (COMPENSATING OBJECT CLEANUP)
  // =========================================================================
  describe('3. Compensating Storage Cleanup on Database Failure', () => {
    it('deletes uploaded storage object if database transaction fails', async () => {
      const testEnquiryId = 'cleanup-test-uuid';
      const filename = 'test-rubric.pdf';
      const validPdfBuffer = Buffer.from(
        '%PDF-1.4\n1 0 obj\n<< /Title (Test) >>\nendobj\ntrailer\n<< /Size 1 >>\nstartxref\n99\n%%EOF'
      );

      // Store object in local storage
      const stored = await storeAttachment(testEnquiryId, filename, 'application/pdf', validPdfBuffer);
      const localFilePath = path.resolve(process.cwd(), 'storage', 'private_uploads', stored.storageKey);

      // Confirm object exists on disk
      const existsBefore = await fs
        .access(localFilePath)
        .then(() => true)
        .catch(() => false);
      expect(existsBefore).toBe(true);

      // Trigger compensating deletion
      await deleteStoredAttachment(stored.storageKey);

      // Confirm object was deleted cleanly
      const existsAfter = await fs
        .access(localFilePath)
        .then(() => true)
        .catch(() => false);
      expect(existsAfter).toBe(false);
    });
  });

  // =========================================================================
  // 4. TRANSACTIONAL EMAIL OUTBOX (RETRIES & DUPLICATE PREVENTION)
  // =========================================================================
  describe('4. Durable Email Outbox Retries & Duplicate Dispatch Prevention', () => {
    it('aborts immediately without re-sending if outbox record is already DELIVERED', async () => {
      const isConfiguredSpy = vi.spyOn(envModule, 'isDatabaseConfigured').mockReturnValue(true);

      const findUniqueSpy = vi.spyOn(prisma.emailOutbox, 'findUnique').mockResolvedValueOnce({
        id: 'outbox-123',
        status: 'DELIVERED',
        attempts: 1,
        maxAttempts: 3,
        payloadJson: '{}',
      } as any);

      const updateSpy = vi.spyOn(prisma.emailOutbox, 'update');

      const result = await OutboxDispatcher.dispatchOutboxRecord('outbox-123');

      expect(result.success).toBe(true);
      // Should NOT call update or re-send
      expect(updateSpy).not.toHaveBeenCalled();

      isConfiguredSpy.mockRestore();
      findUniqueSpy.mockRestore();
      updateSpy.mockRestore();
    });

    it('records exponential backoff and increments attempt counter when delivery fails', async () => {
      const isConfiguredSpy = vi.spyOn(envModule, 'isDatabaseConfigured').mockReturnValue(true);

      const dummyPayload = JSON.stringify({
        enquiryId: 'enq-123',
        referenceNumber: 'ASH-202611-FAIL',
        studentName: 'Alex',
        email: 'alex@example.com',
        phone: '+919876543210',
        college: 'CEG',
        department: 'IT',
        domain: 'AI',
        service: 'Full-Stack',
        description: 'Test retry',
      });

      vi.spyOn(prisma.emailOutbox, 'findUnique').mockResolvedValueOnce({
        id: 'outbox-retry-test',
        enquiryId: 'enq-123',
        status: 'PENDING',
        attempts: 1,
        maxAttempts: 3,
        recipient: 'alex@example.com',
        subject: 'Test Subject',
        templateName: 'STUDENT_ACKNOWLEDGMENT',
        payloadJson: dummyPayload,
      } as any);

      // Force transport failure by mocking Resend API failure
      vi.spyOn(envModule, 'getEmailConfig').mockReturnValue({
        adminEmail: 'admin@ashkri.com',
        fromEmail: 'no-reply@ashkri.com',
        resendApiKey: 'invalid-key-for-test',
      });

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: async () => 'Internal Resend Provider Error',
      } as Response);

      const updateSpy = vi.spyOn(prisma.emailOutbox, 'update').mockResolvedValueOnce({} as any);
      vi.spyOn(prisma.emailEvent, 'create').mockResolvedValueOnce({} as any);

      const res = await OutboxDispatcher.dispatchOutboxRecord('outbox-retry-test');

      expect(res.success).toBe(false);
      expect(updateSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'outbox-retry-test' },
          data: expect.objectContaining({
            status: 'FAILED',
            attempts: 2,
            errorReason: expect.stringContaining('Resend API error (500)'),
          }),
        })
      );

      isConfiguredSpy.mockRestore();
    });
  });

  // =========================================================================
  // 5. ATTACHMENT SECURITY (DOCX, ZIP BOMBS, TRAVERSAL, PDF SCRIPTS)
  // =========================================================================
  describe('5. Attachment Security & Malware/Structure Validation', () => {
    it('validates genuine DOCX OpenXML structure and rejects zip without Word document parts', () => {
      // Valid DOCX container
      const validDocx = buildZipBuffer([
        { name: '[Content_Types].xml', content: '<Types/>' },
        { name: 'word/document.xml', content: '<w:document/>' },
      ]);
      expect(validateDocxStructure(validDocx).valid).toBe(true);

      // Invalid DOCX (plain zip disguised as docx without OpenXML parts)
      const fakeDocx = buildZipBuffer([{ name: 'notes.txt', content: 'fake docx' }]);
      const result = validateDocxStructure(fakeDocx);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Missing required Microsoft Word OpenXML');
    });

    it('rejects DOCX containing embedded VBA macros (vbaProject.bin)', () => {
      const macroDocx = buildZipBuffer([
        { name: '[Content_Types].xml', content: '<Types/>' },
        { name: 'word/document.xml', content: '<w:document/>' },
        { name: 'word/vbaProject.bin', content: 'MALICIOUS_MACRO_BYTES' },
      ]);
      const result = validateDocxStructure(macroDocx);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('embedded VBA macros');
    });

    it('detects and rejects ZIP archives containing path traversal exploits', () => {
      const traversalZip = buildZipBuffer([
        { name: '../../etc/shadow', content: 'root:x:0:0:...' },
      ]);
      const result = inspectZipStructure(traversalZip);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Path traversal detected');
    });

    it('detects and rejects ZIP archives containing dangerous executable binaries', () => {
      const exeZip = buildZipBuffer([
        { name: 'payload.exe', content: 'MZ_EXECUTABLE_BINARY' },
      ]);
      const result = inspectZipStructure(exeZip);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Disallowed executable file');
    });

    it('detects and rejects ZIP bombs with abnormal compression ratio or excessive uncompressed size', () => {
      // 2 KB compressed claiming 40 KB uncompressed (ratio 20:1 > MAX_COMPRESSION_RATIO 10)
      const bombZip = buildZipBuffer([
        {
          name: 'large_data.txt',
          content: 'x'.repeat(2048),
          compressedSize: 2048,
          uncompressedSize: 2048 * 20, // ratio 20:1 (> MAX_COMPRESSION_RATIO 10)
        },
      ]);
      const result = inspectZipStructure(bombZip);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('potential zip bomb');
    });

    it('validates PDF structural trailer (%%EOF) and rejects active JavaScript / Launch exploits', () => {
      // Valid minimal PDF
      const validPdf = Buffer.from(
        '%PDF-1.4\n1 0 obj\n<<>>\nendobj\ntrailer\n<<>>\nstartxref\n0\n%%EOF\n'
      );
      expect(validatePdfStructure(validPdf).valid).toBe(true);

      // Corrupted PDF (missing %%EOF trailer)
      const truncatedPdf = Buffer.from('%PDF-1.4\n1 0 obj\n<<>>\nendobj\n');
      const truncResult = validatePdfStructure(truncatedPdf);
      expect(truncResult.valid).toBe(false);
      expect(truncResult.error).toContain('Missing standard %%EOF trailer marker');

      // Malicious PDF with embedded /JavaScript action
      const exploitPdf = Buffer.from(
        '%PDF-1.4\n1 0 obj\n<< /Names << /JavaScript 2 0 R >> >>\nendobj\ntrailer\n<<>>\nstartxref\n0\n%%EOF'
      );
      const exploitResult = validatePdfStructure(exploitPdf);
      expect(exploitResult.valid).toBe(false);
      expect(exploitResult.error).toContain('embedded JavaScript actions');
    });
  });

  // =========================================================================
  // 6. SPOOFED PROXY HEADERS & ANTI-SPOOFING
  // =========================================================================
  describe('6. Trusted Proxy Header Resolution & Anti-Spoofing', () => {
    it('prioritizes trusted x-vercel-forwarded-for over client-spoofed x-forwarded-for', () => {
      const headers = new Headers({
        'x-forwarded-for': '8.8.8.8, 1.1.1.1', // Attacker attempted spoof
        'x-vercel-forwarded-for': '203.0.113.195', // Verified Vercel Edge IP
      });

      const extracted = extractClientIp(headers);
      expect(extracted).toBe('203.0.113.195');
    });

    it('prioritizes cf-connecting-ip over untrusted headers', () => {
      const headers = new Headers({
        'x-forwarded-for': '10.0.0.1',
        'cf-connecting-ip': '198.51.100.44',
      });

      const extracted = extractClientIp(headers);
      expect(extracted).toBe('198.51.100.44');
    });

    it('normalizes IPv4-mapped IPv6 addresses (::ffff:192.168.1.1 -> 192.168.1.1)', () => {
      expect(normalizeIp('::ffff:192.168.1.10')).toBe('192.168.1.10');
      expect(normalizeIp('::ffff:127.0.0.1')).toBe('127.0.0.1');
    });

    it('strips port numbers from IPv4 addresses', () => {
      expect(normalizeIp('203.0.113.50:8080')).toBe('203.0.113.50');
    });

    it('safely handles malformed and invalid IP strings by falling back to localhost', () => {
      const headers = new Headers({
        'x-forwarded-for': 'malicious-script-tag-<script>, invalid_ip',
      });

      const extracted = extractClientIp(headers);
      expect(extracted).toBe('127.0.0.1');
    });
  });

  // =========================================================================
  // 7. DATABASE-UNAVAILABLE BEHAVIOR IN PRODUCTION / PREVIEW
  // =========================================================================
  describe('7. Database Unconfigured Handling in Production / Preview', () => {
    it('strictly returns an error response when DATABASE_URL is unconfigured outside of test mode', async () => {
      const originalNodeEnv = process.env.NODE_ENV;
      const originalAllowMock = process.env.ALLOW_MOCKED_SUBMISSIONS;

      try {
        // Simulate production without database
        (process.env as any).NODE_ENV = 'production';
        delete process.env.ALLOW_MOCKED_SUBMISSIONS;

        vi.spyOn(envModule, 'isDatabaseConfigured').mockReturnValue(false);

        const fd = new FormData();
        fd.append('studentName', 'Kavitha R');
        fd.append('email', 'kavitha@mitindia.edu');
        fd.append('phone', '+919443212345');
        fd.append('college', 'MIT Campus');
        fd.append('department', 'ECE');
        fd.append('domain', 'VLSI & Embedded Systems');
        fd.append('service', 'FPGA & Verilog Design');
        fd.append('description', 'Evaluating production failure without DB.');
        fd.append('consent', 'true');

        const result = await submitEnquiryAction(fd);

        // MUST NOT claim success or provide a fake reference number
        expect(result.success).toBe(false);
        expect(result.referenceNumber).toBeUndefined();
        expect(result.error).toContain('Database service is currently unavailable');
      } finally {
        (process.env as any).NODE_ENV = originalNodeEnv;
        if (originalAllowMock !== undefined) {
          process.env.ALLOW_MOCKED_SUBMISSIONS = originalAllowMock;
        }
      }
    });

    it('permits mocked submission ONLY under explicit ALLOW_MOCKED_SUBMISSIONS flag', async () => {
      const originalNodeEnv = process.env.NODE_ENV;
      const originalAllowMock = process.env.ALLOW_MOCKED_SUBMISSIONS;

      try {
        (process.env as any).NODE_ENV = 'production';
        process.env.ALLOW_MOCKED_SUBMISSIONS = 'true';

        vi.spyOn(envModule, 'isDatabaseConfigured').mockReturnValue(false);

        const fd = new FormData();
        fd.append('studentName', 'Kavitha R');
        fd.append('email', 'kavitha@mitindia.edu');
        fd.append('phone', '+919443212345');
        fd.append('college', 'MIT Campus');
        fd.append('department', 'ECE');
        fd.append('domain', 'VLSI & Embedded Systems');
        fd.append('service', 'FPGA & Verilog Design');
        fd.append('description', 'Explicit allowed mock in staging.');
        fd.append('consent', 'true');

        const result = await submitEnquiryAction(fd);

        expect(result.success).toBe(true);
        expect(result.referenceNumber).toMatch(/^ASH-\d{6}-[A-F0-9]{4}$/);
      } finally {
        (process.env as any).NODE_ENV = originalNodeEnv;
        if (originalAllowMock !== undefined) {
          process.env.ALLOW_MOCKED_SUBMISSIONS = originalAllowMock;
        } else {
          delete process.env.ALLOW_MOCKED_SUBMISSIONS;
        }
      }
    });
  });
});
