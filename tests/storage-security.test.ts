import { describe, it, expect } from 'vitest';
import {
  validateFileMagicBytes,
  validateAttachment,
  computeChecksum,
  sanitizeFilename,
  generateStorageKey,
  MAX_FILE_SIZE_BYTES,
} from '@/lib/storage';

describe('Document Upload Validation & Security', () => {
  it('correctly verifies PDF magic bytes (%PDF-)', () => {
    // 0x25 0x50 0x44 0x46 = %PDF
    const pdfBuffer = Buffer.from([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x37]);
    const result = validateFileMagicBytes(pdfBuffer);
    expect(result.valid).toBe(true);
    expect(result.detectedType).toBe('application/pdf');
  });

  it('correctly verifies ZIP / DOCX magic bytes (PK\\x03\\x04)', () => {
    // 0x50 0x4B 0x03 0x04 = PK\x03\x04
    const zipBuffer = Buffer.from([0x50, 0x4b, 0x03, 0x04, 0x14, 0x00, 0x06, 0x00]);
    const result = validateFileMagicBytes(zipBuffer);
    expect(result.valid).toBe(true);
    expect(result.detectedType).toBe('application/zip-or-docx');
  });

  it('rejects executable binaries (MZ header) disguised as .pdf', () => {
    // Windows PE executable signature: 0x4D, 0x5A ("MZ")
    const exeBuffer = Buffer.from([0x4d, 0x5a, 0x90, 0x00, 0x03, 0x00, 0x00, 0x00]);
    const result = validateAttachment('malware.pdf', 'application/pdf', exeBuffer);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Invalid file format');
  });

  it('rejects shell scripts disguised as .docx', () => {
    const shBuffer = Buffer.from('#!/bin/bash\nrm -rf /\n');
    const result = validateAttachment('exploit.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', shBuffer);
    expect(result.valid).toBe(false);
  });

  it('rejects files exceeding the 10 MB size limit', () => {
    // Fake buffer slightly above 10MB
    const oversizedBuffer = Buffer.alloc(MAX_FILE_SIZE_BYTES + 1024);
    // Add PDF magic bytes
    oversizedBuffer[0] = 0x25;
    oversizedBuffer[1] = 0x50;
    oversizedBuffer[2] = 0x44;
    oversizedBuffer[3] = 0x46;

    const result = validateAttachment('large_thesis.pdf', 'application/pdf', oversizedBuffer);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('exceeds the 10 MB limit');
  });

  it('rejects unapproved file extensions (e.g. .exe, .js, .tar, .html)', () => {
    const pdfBytes = Buffer.from([0x25, 0x50, 0x44, 0x46, 0x00]);
    expect(validateAttachment('app.exe', 'application/octet-stream', pdfBytes).valid).toBe(false);
    expect(validateAttachment('script.js', 'text/javascript', pdfBytes).valid).toBe(false);
    expect(validateAttachment('page.html', 'text/html', pdfBytes).valid).toBe(false);
  });

  it('sanitizes dangerous characters and directory traversal from filenames', () => {
    expect(sanitizeFilename('../../../etc/passwd')).toBe('passwd');
    expect(sanitizeFilename('..\\..\\boot.ini')).toBe('boot.ini');
    expect(sanitizeFilename('My Project (Final) [Draft]!@#.pdf')).toBe('My_Project__Final___Draft____.pdf');
  });

  it('computes exact SHA-256 checksum for integrity verification', () => {
    const buffer = Buffer.from('ASHKRI Academic Solutions Test Document');
    const checksum = computeChecksum(buffer);
    expect(checksum).toHaveLength(64);
    expect(checksum).toBe('18275fcdc5991b0dc06ce8bd22edca4c1cacfe49ecbaf518e67aeff608ed7afb');
  });

  it('generates private scoped storage keys containing enquiryId and UUID', () => {
    const enquiryId = 'enq-uuid-777';
    const key = generateStorageKey(enquiryId, 'synopsis.pdf');
    expect(key).toMatch(/^enquiries\/enq-uuid-777\/[a-f0-9-]+\.pdf$/);
    expect(key).not.toContain('..');
  });
});
