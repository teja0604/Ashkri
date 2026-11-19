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
  checkDistributedRateLimit,
  _resetRateLimitStoreForTesting,
} from '@/lib/rate-limit';
import { OutboxDispatcher, transportEmail } from '@/lib/email';
import { executeMalwareScan, updateAttachmentScanResult } from '@/lib/malware-scanner';
import { submitEnquiryAction } from '@/actions/enquiry';
import prisma from '@/lib/prisma';
import * as envModule from '@/lib/env';

/**
 * Binary helper to construct valid and adversarial ZIP buffers for testing
 */
function buildZipBuffer(
  entries: Array<{
    name: string;
    content?: string;
    uncompressedSize?: number;
    compressedSize?: number;
    compressionMethod?: number;
    flags?: number;
    localHeaderSignature?: number;
    localNameOverride?: string;
  }>
): Buffer {
  const localHeaders: Buffer[] = [];
  const cdHeaders: Buffer[] = [];
  let offset = 0;

  for (const entry of entries) {
    const nameBuf = Buffer.from(entry.name, 'utf8');
    const localNameBuf = entry.localNameOverride
      ? Buffer.from(entry.localNameOverride, 'utf8')
      : nameBuf;
    const dataBuf = Buffer.from(entry.content || '', 'utf8');
    const uncompressedSize =
      entry.uncompressedSize !== undefined ? entry.uncompressedSize : dataBuf.length;
    const compressedSize =
      entry.compressedSize !== undefined ? entry.compressedSize : dataBuf.length;
    const method = entry.compressionMethod !== undefined ? entry.compressionMethod : 0;
    const flags = entry.flags !== undefined ? entry.flags : 0;
    const localSig =
      entry.localHeaderSignature !== undefined ? entry.localHeaderSignature : 0x04034b50;

    // Local file header (30 bytes + name + data)
    const lh = Buffer.alloc(30);
    lh.writeUInt32LE(localSig, 0); // Local header signature
    lh.writeUInt16LE(10, 4); // Min version
    lh.writeUInt16LE(flags, 6); // Flags
    lh.writeUInt16LE(method, 8); // Compression method
    lh.writeUInt16LE(0, 10); // Time
    lh.writeUInt16LE(0, 12); // Date
    lh.writeUInt32LE(0, 14); // CRC32
    lh.writeUInt32LE(compressedSize, 18);
    lh.writeUInt32LE(uncompressedSize, 22);
    lh.writeUInt16LE(localNameBuf.length, 26);
    lh.writeUInt16LE(0, 28); // Extra len

    const localEntry = Buffer.concat([lh, localNameBuf, dataBuf]);
    localHeaders.push(localEntry);

    // Central directory header (46 bytes + name)
    const cd = Buffer.alloc(46);
    cd.writeUInt32LE(0x02014b50, 0); // CD signature
    cd.writeUInt16LE(20, 4); // Version made by
    cd.writeUInt16LE(10, 6); // Version needed
    cd.writeUInt16LE(flags, 8); // Flags
    cd.writeUInt16LE(method, 10); // Compression
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

describe('ASHKRI Phase 3 — Second Production Hardening & Security Audit', () => {
  beforeEach(() => {
    _resetRateLimitStoreForTesting();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // =========================================================================
  // 1. DISTRIBUTED RATE LIMITING — FAIL CLOSED SEMANTICS
  // =========================================================================
  describe('1. Distributed Rate Limiter: Fail-Closed Protection', () => {
    it('fails closed and rejects submission with 503 when PostgreSQL encounters an error in production', async () => {
      const originalNodeEnv = process.env.NODE_ENV;
      const originalMock = process.env.ALLOW_MOCKED_SUBMISSIONS;

      try {
        (process.env as any).NODE_ENV = 'production';
        delete process.env.ALLOW_MOCKED_SUBMISSIONS;

        vi.spyOn(envModule, 'isDatabaseConfigured').mockReturnValue(true);
        vi.spyOn(prisma, '$queryRaw').mockRejectedValueOnce(
          new Error('Connection to Neon PostgreSQL pool timed out')
        );

        const result = await checkDistributedRateLimit('test-ip-hash', 5, 60000, false);

        // MUST FAIL CLOSED: never fall back to in-memory bypass
        expect(result.success).toBe(false);
        expect(result.failedClosed).toBe(true);
        expect(result.error).toContain('Rate limiting service is currently unavailable');
      } finally {
        (process.env as any).NODE_ENV = originalNodeEnv;
        if (originalMock !== undefined) {
          process.env.ALLOW_MOCKED_SUBMISSIONS = originalMock;
        }
      }
    });

    it('fails closed when database is unconfigured in production', async () => {
      const originalNodeEnv = process.env.NODE_ENV;
      const originalMock = process.env.ALLOW_MOCKED_SUBMISSIONS;

      try {
        (process.env as any).NODE_ENV = 'production';
        delete process.env.ALLOW_MOCKED_SUBMISSIONS;

        vi.spyOn(envModule, 'isDatabaseConfigured').mockReturnValue(false);

        const result = await checkDistributedRateLimit('test-ip-hash', 5, 60000, false);

        expect(result.success).toBe(false);
        expect(result.failedClosed).toBe(true);
        expect(result.error).toContain('Distributed rate limiting service is unconfigured');
      } finally {
        (process.env as any).NODE_ENV = originalNodeEnv;
        if (originalMock !== undefined) {
          process.env.ALLOW_MOCKED_SUBMISSIONS = originalMock;
        }
      }
    });
  });

  // =========================================================================
  // 2. TRUSTED PROXY BOUNDARY & ANTI-SPOOFING
  // =========================================================================
  describe('2. Trusted Proxy Resolution & Deployment Boundary', () => {
    it('rejects unauthenticated client-supplied x-forwarded-for in production outside edge proxy', () => {
      const originalNodeEnv = process.env.NODE_ENV;
      const originalMock = process.env.ALLOW_MOCKED_SUBMISSIONS;

      try {
        (process.env as any).NODE_ENV = 'production';
        delete process.env.ALLOW_MOCKED_SUBMISSIONS;

        // Attacker directly connects and passes spoofed x-forwarded-for without Vercel edge headers
        const headers = new Headers({
          'x-forwarded-for': '8.8.8.8, 1.1.1.1',
        });

        const extracted = extractClientIp(headers);
        expect(extracted).toBe('untrusted-proxy-boundary');
      } finally {
        (process.env as any).NODE_ENV = originalNodeEnv;
        if (originalMock !== undefined) {
          process.env.ALLOW_MOCKED_SUBMISSIONS = originalMock;
        }
      }
    });

    it('authenticates Vercel-provided x-vercel-forwarded-for in production', () => {
      const originalNodeEnv = process.env.NODE_ENV;

      try {
        (process.env as any).NODE_ENV = 'production';

        const headers = new Headers({
          'x-vercel-forwarded-for': '203.0.113.195',
          'x-forwarded-for': '8.8.8.8', // Ignored spoof attempt
        });

        const extracted = extractClientIp(headers);
        expect(extracted).toBe('203.0.113.195');
      } finally {
        (process.env as any).NODE_ENV = originalNodeEnv;
      }
    });

    it('authenticates Cloudflare-provided cf-connecting-ip', () => {
      const headers = new Headers({
        'cf-connecting-ip': '198.51.100.77',
        'x-forwarded-for': '123.123.123.123',
      });

      const extracted = extractClientIp(headers);
      expect(extracted).toBe('198.51.100.77');
    });
  });

  // =========================================================================
  // 3. REAL ATTACHMENT QUARANTINE & MALWARE SCANNING INTEGRATION
  // =========================================================================
  describe('3. Attachment Quarantine & Malware Scanning Integration', () => {
    it('defaults attachment scan status to PENDING_SCAN on upload', async () => {
      const isConfiguredSpy = vi.spyOn(envModule, 'isDatabaseConfigured').mockReturnValue(true);

      let createdScanStatus: string | undefined;

      vi.spyOn(prisma, '$transaction').mockImplementation(async (callback: any) => {
        return callback({
          enquiry: {
            create: vi.fn().mockResolvedValue({ id: 'enq-uuid-test', referenceNumber: 'ASH-202611-TEST' }),
          },
          enquiryStatusHistory: { create: vi.fn() },
          enquiryAttachment: {
            create: vi.fn().mockImplementation((args: any) => {
              createdScanStatus = args.data.scanStatus;
              return Promise.resolve(args.data);
            }),
          },
          emailOutbox: { create: vi.fn() },
        });
      });

      const fd = new FormData();
      fd.append('studentName', 'Kavitha R');
      fd.append('email', 'kavitha@mitindia.edu');
      fd.append('phone', '+919443212345');
      fd.append('college', 'MIT Campus');
      fd.append('department', 'IT');
      fd.append('domain', 'Information Technology');
      fd.append('service', 'Full-Stack Software Assistance');
      fd.append('description', 'Testing attachment quarantine default.');
      fd.append('consent', 'true');

      const validPdfBuffer = Buffer.from(
        '%PDF-1.4\n1 0 obj\n<<>>\nendobj\ntrailer\n<<>>\nstartxref\n0\n%%EOF\n'
      );
      const testFile = new File([validPdfBuffer], 'specs.pdf', { type: 'application/pdf' });
      fd.append('attachment', testFile);

      await submitEnquiryAction(fd);

      // MUST NOT be marked CLEAN immediately
      expect(createdScanStatus).toBe('PENDING_SCAN');

      isConfiguredSpy.mockRestore();
    });

    it('keeps attachment in QUARANTINED state if scanner times out or fails (fails closed)', async () => {
      process.env.MALWARE_SCANNER_ENDPOINT = 'https://scanner.internal.ashkri.com/scan';

      global.fetch = vi.fn().mockRejectedValueOnce(new Error('Scanner timeout'));

      const scanResult = await executeMalwareScan(Buffer.from('test data'), 'sample.pdf');

      expect(scanResult.scanStatus).toBe('QUARANTINED');
      expect(scanResult.details).toContain('Scan failed or timed out');

      delete process.env.MALWARE_SCANNER_ENDPOINT;
    });

    it('authenticates scan result write-back token and updates attachment status', async () => {
      const isConfiguredSpy = vi.spyOn(envModule, 'isDatabaseConfigured').mockReturnValue(true);
      const validSecret = 'test-scan-secret-min-32-chars-long-for-hmac-auth';
      vi.spyOn(envModule, 'getScanWebhookSecret').mockReturnValue(validSecret);

      vi.spyOn(prisma.enquiryAttachment, 'findUnique').mockResolvedValueOnce({
        id: 'att-123',
        enquiryId: 'enq-123',
        originalName: 'specs.pdf',
      } as any);

      const updateAttachmentMock = vi.fn().mockResolvedValue({});
      const createNoteMock = vi.fn().mockResolvedValue({});

      vi.spyOn(prisma, '$transaction').mockImplementation(async (callback: any) => {
        return callback({
          enquiryAttachment: { update: updateAttachmentMock },
          enquiryNote: { create: createNoteMock },
        });
      });

      // 1. Rejected if token invalid
      const failAuth = await updateAttachmentScanResult(
        'att-123',
        { scanStatus: 'CLEAN', scannerEngine: 'ClamAV', scannedAt: new Date() },
        'invalid-token'
      );
      expect(failAuth.success).toBe(false);
      expect(failAuth.error).toContain('Unauthorized');

      // 2. Accepted if token valid
      const successAuth = await updateAttachmentScanResult(
        'att-123',
        { scanStatus: 'CLEAN', scannerEngine: 'ClamAV', scannedAt: new Date(), details: 'No threat' },
        validSecret
      );
      expect(successAuth.success).toBe(true);
      expect(updateAttachmentMock).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'att-123' },
          data: expect.objectContaining({ scanStatus: 'CLEAN' }),
        })
      );

      isConfiguredSpy.mockRestore();
    });
  });

  // =========================================================================
  // 4. TRANSACTIONAL EMAIL OUTBOX CONCURRENCY & LEASE EXPIRATION
  // =========================================================================
  describe('4. Concurrency-Safe Transactional Email Outbox', () => {
    it('creates enquiry and both notification outbox records atomically within the same transaction', async () => {
      const isConfiguredSpy = vi.spyOn(envModule, 'isDatabaseConfigured').mockReturnValue(true);

      const outboxCreateCalls: any[] = [];

      vi.spyOn(prisma, '$transaction').mockImplementation(async (callback: any) => {
        return callback({
          enquiry: {
            create: vi.fn().mockResolvedValue({ id: 'enq-atom-1', referenceNumber: 'ASH-202611-ATOM' }),
          },
          enquiryStatusHistory: { create: vi.fn() },
          enquiryAttachment: { create: vi.fn() },
          emailOutbox: {
            create: vi.fn().mockImplementation((args: any) => {
              outboxCreateCalls.push(args.data);
              return Promise.resolve(args.data);
            }),
          },
        });
      });

      vi.spyOn(OutboxDispatcher, 'processPending').mockResolvedValue({ dispatched: 2, failed: 0 });

      const fd = new FormData();
      fd.append('studentName', 'Deepak S');
      fd.append('email', 'deepak@annauniv.edu');
      fd.append('phone', '+919443212345');
      fd.append('college', 'Anna University');
      fd.append('department', 'CSE');
      fd.append('domain', 'Cloud & Distributed Systems');
      fd.append('service', 'Full-Stack Software Assistance');
      fd.append('description', 'Testing atomic transaction outbox creation.');
      fd.append('consent', 'true');

      const res = await submitEnquiryAction(fd);
      expect(res.success).toBe(true);

      // Verify BOTH outbox records were created inside the transaction
      expect(outboxCreateCalls.length).toBe(2);
      expect(outboxCreateCalls.some((c) => c.templateName === 'ADMIN_NOTIFICATION')).toBe(true);
      expect(outboxCreateCalls.some((c) => c.templateName === 'STUDENT_ACKNOWLEDGMENT')).toBe(true);

      isConfiguredSpy.mockRestore();
    });

    it('prevents concurrent dispatch by acquiring atomic worker lease (returns claimed: false to second worker)', async () => {
      const isConfiguredSpy = vi.spyOn(envModule, 'isDatabaseConfigured').mockReturnValue(true);

      // First worker acquires lease (executeRaw returns 1 updated row)
      vi.spyOn(prisma, '$executeRaw').mockResolvedValueOnce(1);
      vi.spyOn(prisma.emailOutbox, 'findUnique').mockResolvedValueOnce({
        id: 'outbox-race-1',
        status: 'PROCESSING',
      } as any);

      const worker1Claim = await OutboxDispatcher.claimOutboxRecord('outbox-race-1', 'worker-A');
      expect(worker1Claim.claimed).toBe(true);

      // Second concurrent worker attempts to claim same record (executeRaw returns 0 rows updated)
      vi.spyOn(prisma, '$executeRaw').mockResolvedValueOnce(0);

      const worker2Claim = await OutboxDispatcher.claimOutboxRecord('outbox-race-1', 'worker-B');
      expect(worker2Claim.claimed).toBe(false);

      isConfiguredSpy.mockRestore();
    });
  });

  // =========================================================================
  // 5. ZIP VALIDATION & ADVERSARIAL ARCHIVE TESTS
  // =========================================================================
  describe('5. Hardened ZIP Validation & Adversarial Archives', () => {
    it('detects and rejects ZIP archives with local header signature corruption', () => {
      const corruptedLocalSigZip = buildZipBuffer([
        {
          name: 'valid_first.txt',
          content: 'valid header entry',
        },
        {
          name: 'paper.txt',
          content: 'research paper contents',
          localHeaderSignature: 0x00004b50, // Starts with PK (0x50, 0x4b) but signature is 0x00004b50 instead of 0x04034b50
        },
      ]);

      const result = inspectZipStructure(corruptedLocalSigZip);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Local file header signature mismatch');
    });

    it('detects and rejects ZIP archives with filename mismatch between central directory and local header', () => {
      const mismatchedNameZip = buildZipBuffer([
        {
          name: 'public_name.txt',
          content: 'exploit payload',
          localNameOverride: 'hidden_exploit.sh', // Mismatched local header name
        },
      ]);

      const result = inspectZipStructure(mismatchedNameZip);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Mismatch between central directory name');
    });

    it('rejects encrypted or password-protected ZIP archives', () => {
      const encryptedZip = buildZipBuffer([
        {
          name: 'secret.txt',
          content: 'encrypted bytes',
          flags: 0x0001, // General purpose bit 0 = encrypted
        },
      ]);

      const result = inspectZipStructure(encryptedZip);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Encrypted or password-protected archives are not permitted');
    });

    it('rejects unsupported obsolete compression methods', () => {
      const unsupportedMethodZip = buildZipBuffer([
        {
          name: 'data.bin',
          content: 'lzma compressed bytes',
          compressionMethod: 14, // Method 14 = LZMA (only 0 stored and 8 deflated are accepted)
        },
      ]);

      const result = inspectZipStructure(unsupportedMethodZip);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Unsupported ZIP compression method 14');
    });
  });

  // =========================================================================
  // 6. PRODUCTION SECRETS VALIDATION
  // =========================================================================
  describe('6. Production Security Secrets Validation', () => {
    it('throws fatal error in production when RATE_LIMIT_SALT is missing or shorter than 32 characters', () => {
      const originalNodeEnv = process.env.NODE_ENV;
      const originalSalt = process.env.RATE_LIMIT_SALT;
      const originalMock = process.env.ALLOW_MOCKED_SUBMISSIONS;

      try {
        (process.env as any).NODE_ENV = 'production';
        delete process.env.ALLOW_MOCKED_SUBMISSIONS;

        // 1. Missing salt
        delete process.env.RATE_LIMIT_SALT;
        expect(() => envModule.getRateLimitSalt()).toThrow('FATAL CONFIGURATION ERROR: RATE_LIMIT_SALT');

        // 2. Weak short salt (< 32 chars)
        process.env.RATE_LIMIT_SALT = 'too-short-salt';
        expect(() => envModule.getRateLimitSalt()).toThrow('must be configured and contain at least 32 characters');
      } finally {
        (process.env as any).NODE_ENV = originalNodeEnv;
        if (originalSalt !== undefined) {
          process.env.RATE_LIMIT_SALT = originalSalt;
        } else {
          delete process.env.RATE_LIMIT_SALT;
        }
        if (originalMock !== undefined) {
          process.env.ALLOW_MOCKED_SUBMISSIONS = originalMock;
        }
      }
    });

    it('throws fatal error in production when SCAN_WEBHOOK_SECRET is missing or shorter than 32 characters', () => {
      const originalNodeEnv = process.env.NODE_ENV;
      const originalSecret = process.env.SCAN_WEBHOOK_SECRET;
      const originalMock = process.env.ALLOW_MOCKED_SUBMISSIONS;

      try {
        (process.env as any).NODE_ENV = 'production';
        delete process.env.ALLOW_MOCKED_SUBMISSIONS;

        delete process.env.SCAN_WEBHOOK_SECRET;
        expect(() => envModule.getScanWebhookSecret()).toThrow('FATAL CONFIGURATION ERROR: SCAN_WEBHOOK_SECRET');

        process.env.SCAN_WEBHOOK_SECRET = 'short';
        expect(() => envModule.getScanWebhookSecret()).toThrow('must be configured and contain at least 32 characters');
      } finally {
        (process.env as any).NODE_ENV = originalNodeEnv;
        if (originalSecret !== undefined) {
          process.env.SCAN_WEBHOOK_SECRET = originalSecret;
        } else {
          delete process.env.SCAN_WEBHOOK_SECRET;
        }
        if (originalMock !== undefined) {
          process.env.ALLOW_MOCKED_SUBMISSIONS = originalMock;
        }
      }
    });
  });
});
