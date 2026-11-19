import { describe, it, expect, beforeEach } from 'vitest';
import {
  EnquiryInputSchema,
  sanitizeInput,
  generateReferenceNumber,
} from '@/lib/validation/enquiry';
import {
  hashIp,
  checkRateLimit,
  _resetRateLimitStoreForTesting,
} from '@/lib/rate-limit';

describe('Enquiry Input Validation & Sanitization', () => {
  const validPayload = {
    studentName: 'Priya Sharma',
    email: 'priya@annauniv.edu',
    phone: '+919876543210',
    college: 'Anna University, Chennai',
    department: 'CSE',
    domain: 'Artificial Intelligence & Data Science',
    service: 'AI / ML Guidance',
    approxBudget: '₹7,000 – ₹15,000',
    expectedDeadline: '2026-12-15',
    description: 'We need guidance on implementing a federated learning architecture for healthcare data.',
    consent: true,
  };

  it('accepts a fully valid submission payload', () => {
    const result = EnquiryInputSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.studentName).toBe('Priya Sharma');
      expect(result.data.email).toBe('priya@annauniv.edu');
      expect(result.data.consent).toBe(true);
      expect(result.data.expectedDeadline).toBeInstanceOf(Date);
    }
  });

  it('rejects studentName with fewer than 2 characters', () => {
    const result = EnquiryInputSchema.safeParse({ ...validPayload, studentName: 'A' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('at least 2 characters');
    }
  });

  it('rejects invalid email formats', () => {
    const invalidEmails = ['invalid-email', 'priya@', 'priya@domain', '@annauniv.edu'];
    for (const email of invalidEmails) {
      const result = EnquiryInputSchema.safeParse({ ...validPayload, email });
      expect(result.success).toBe(false);
    }
  });

  it('rejects malformed phone numbers', () => {
    const invalidPhones = ['123', 'abcde12345', '12345'];
    for (const phone of invalidPhones) {
      const result = EnquiryInputSchema.safeParse({ ...validPayload, phone });
      expect(result.success).toBe(false);
    }
  });

  it('rejects project description shorter than 20 characters', () => {
    const result = EnquiryInputSchema.safeParse({ ...validPayload, description: 'Short idea' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('at least 20 characters');
    }
  });

  it('rejects submission when academic consent is false', () => {
    const result = EnquiryInputSchema.safeParse({ ...validPayload, consent: false });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('academic integrity');
    }
  });

  it('captures honeypot field when filled by bot for server-level rejection', () => {
    const result = EnquiryInputSchema.safeParse({
      ...validPayload,
      honeypot: 'http://spam-link.com',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.honeypot).toBe('http://spam-link.com');
    }
  });

  it('sanitizes malicious HTML script tags from input strings', () => {
    const dirty = '<script>alert("xss")</script>Autonomous Rover Project';
    const clean = sanitizeInput(dirty);
    expect(clean).not.toContain('<script>');
    expect(clean).not.toContain('</script>');
    expect(clean).toBe('Autonomous Rover Project');
  });

  it('generates collision-resistant reference numbers matching ASH-YYYYMM-XXXX format', () => {
    const ref1 = generateReferenceNumber();
    const ref2 = generateReferenceNumber();

    expect(ref1).toMatch(/^ASH-\d{6}-[A-F0-9]{4}$/);
    expect(ref2).toMatch(/^ASH-\d{6}-[A-F0-9]{4}$/);
    expect(ref1).not.toBe(ref2);
  });
});

describe('Rate Limiting & Privacy IP Hashing', () => {
  beforeEach(() => {
    _resetRateLimitStoreForTesting();
  });

  it('generates consistent one-way SHA-256 IP hash without exposing raw IP', () => {
    const rawIp = '203.0.113.195';
    const hash1 = hashIp(rawIp);
    const hash2 = hashIp(rawIp);

    expect(hash1).toHaveLength(64);
    expect(hash1).toBe(hash2);
    expect(hash1).not.toContain(rawIp);
  });

  it('enforces request limit threshold and blocks exceeding submissions', () => {
    const testHash = 'test-ip-hash-abc-123';
    const limit = 3;
    const windowMs = 60 * 1000;

    // Requests 1, 2, 3 should succeed
    expect(checkRateLimit(testHash, limit, windowMs).success).toBe(true);
    expect(checkRateLimit(testHash, limit, windowMs).success).toBe(true);
    expect(checkRateLimit(testHash, limit, windowMs).success).toBe(true);

    // Request 4 should be rate-limited
    const blocked = checkRateLimit(testHash, limit, windowMs);
    expect(blocked.success).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.error).toContain('Too many consultation requests');
  });
});
