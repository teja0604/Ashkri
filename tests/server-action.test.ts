import { describe, it, expect, beforeEach, vi } from 'vitest';
import { submitEnquiryAction } from '@/actions/enquiry';
import { _resetRateLimitStoreForTesting } from '@/lib/rate-limit';

// Mock next/headers
vi.mock('next/headers', () => ({
  headers: vi.fn(async () => ({
    get: (name: string) => {
      if (name === 'x-forwarded-for') return '192.168.1.100';
      return null;
    },
  })),
}));

describe('Server Action: submitEnquiryAction', () => {
  beforeEach(() => {
    _resetRateLimitStoreForTesting();
    vi.clearAllMocks();
  });

  function createValidFormData(): FormData {
    const fd = new FormData();
    fd.append('studentName', 'Kavitha R');
    fd.append('email', 'kavitha@mitindia.edu');
    fd.append('phone', '+919443212345');
    fd.append('college', 'Madras Institute of Technology');
    fd.append('department', 'IT');
    fd.append('domain', 'Information Technology');
    fd.append('service', 'Full-Stack Software Assistance');
    fd.append('approxBudget', '₹6,000 – ₹10,000');
    fd.append('expectedDeadline', '2026-11-30');
    fd.append('description', 'Building a distributed event-driven microservices architecture for university elections.');
    fd.append('consent', 'true');
    return fd;
  }

  it('successfully processes valid FormData and returns official reference number', async () => {
    const fd = createValidFormData();
    const result = await submitEnquiryAction(fd);

    expect(result.success).toBe(true);
    expect(result.referenceNumber).toBeDefined();
    expect(result.referenceNumber).toMatch(/^ASH-\d{6}-[A-F0-9]{4}$/);
  });

  it('returns field-specific errors when required inputs are missing or invalid', async () => {
    const fd = new FormData();
    fd.append('studentName', 'A'); // Too short
    fd.append('email', 'not-an-email');
    fd.append('phone', '123'); // Invalid phone
    fd.append('description', 'Too short');
    fd.append('consent', 'false');

    const result = await submitEnquiryAction(fd);
    expect(result.success).toBe(false);
    expect(result.issues).toBeDefined();
    expect(result.issues?.studentName).toBeDefined();
    expect(result.issues?.email).toBeDefined();
    expect(result.issues?.phone).toBeDefined();
    expect(result.issues?.description).toBeDefined();
    expect(result.issues?.consent).toBeDefined();
  });

  it('rejects bot submission when honeypot field is filled', async () => {
    const fd = createValidFormData();
    fd.append('website_verification', 'spam-bot-value');

    const result = await submitEnquiryAction(fd);
    expect(result.success).toBe(false);
    expect(result.error).toContain('Automated submission');
  });

  it('rejects submission with invalid file attachment format', async () => {
    const fd = createValidFormData();
    const badFile = new File(['echo malicious'], 'exploit.sh', { type: 'text/x-sh' });
    fd.append('attachment', badFile);

    const result = await submitEnquiryAction(fd);
    expect(result.success).toBe(false);
    expect(result.error).toContain('not supported');
  });
});
