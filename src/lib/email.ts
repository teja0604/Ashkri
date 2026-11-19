import { getEmailConfig, isDatabaseConfigured } from './env';
import prisma from './prisma';
import nodemailer from 'nodemailer';

export interface EnquiryEmailData {
  enquiryId: string;
  referenceNumber: string;
  studentName: string;
  email: string;
  phone: string;
  college: string;
  department: string;
  domain: string;
  service: string;
  approxBudget?: string | null;
  expectedDeadline?: Date | null;
  description: string;
  attachmentName?: string | null;
}

export interface SendEmailResult {
  success: boolean;
  error?: string;
  providerMessageId?: string;
}

/**
 * Renders HTML email template for Admin Notification
 */
export function renderAdminNotificationHtml(data: EnquiryEmailData): string {
  const deadlineStr = data.expectedDeadline
    ? new Date(data.expectedDeadline).toISOString().split('T')[0]
    : 'Flexible / Not Specified';

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Project Consultation Request - ${data.referenceNumber}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #0b0f19; color: #f1f5f9; padding: 24px; margin: 0; }
    .card { background: #111827; border: 1px solid #1f2937; border-radius: 8px; max-width: 600px; margin: 0 auto; padding: 32px; }
    .badge { display: inline-block; padding: 4px 10px; font-size: 12px; font-weight: bold; background: #c29b38; color: #0b0f19; border-radius: 4px; margin-bottom: 16px; }
    h1 { font-size: 20px; margin: 0 0 16px 0; color: #ffffff; }
    .meta-table { width: 100%; border-collapse: collapse; margin-top: 16px; margin-bottom: 24px; font-size: 14px; }
    .meta-table td { padding: 8px 0; border-bottom: 1px solid #1f2937; }
    .meta-label { color: #94a3b8; width: 35%; font-weight: 500; }
    .meta-value { color: #f8fafc; font-weight: 600; }
    .description-box { background: #1a2234; border-left: 3px solid #c29b38; padding: 14px; border-radius: 4px; font-size: 14px; color: #e2e8f0; white-space: pre-wrap; line-height: 1.6; }
    .footer { margin-top: 24px; font-size: 12px; color: #64748b; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <span class="badge">NEW ENQUIRY</span>
    <h1>Project Consultation Request</h1>
    <table class="meta-table">
      <tr><td class="meta-label">Reference ID:</td><td class="meta-value">${data.referenceNumber}</td></tr>
      <tr><td class="meta-label">Student Name:</td><td class="meta-value">${data.studentName}</td></tr>
      <tr><td class="meta-label">Email:</td><td class="meta-value">${data.email}</td></tr>
      <tr><td class="meta-label">Phone / WhatsApp:</td><td class="meta-value">${data.phone}</td></tr>
      <tr><td class="meta-label">College / University:</td><td class="meta-value">${data.college}</td></tr>
      <tr><td class="meta-label">Department:</td><td class="meta-value">${data.department}</td></tr>
      <tr><td class="meta-label">Domain:</td><td class="meta-value">${data.domain}</td></tr>
      <tr><td class="meta-label">Required Service:</td><td class="meta-value">${data.service}</td></tr>
      <tr><td class="meta-label">Estimated Budget:</td><td class="meta-value">${data.approxBudget || 'Standard Pricing'}</td></tr>
      <tr><td class="meta-label">Target Deadline:</td><td class="meta-value">${deadlineStr}</td></tr>
      ${data.attachmentName ? `<tr><td class="meta-label">Attachment:</td><td class="meta-value">${data.attachmentName}</td></tr>` : ''}
    </table>
    <div style="font-weight: 600; font-size: 13px; color: #94a3b8; margin-bottom: 8px;">Project Scope & Proposal:</div>
    <div class="description-box">${data.description}</div>
    <div class="footer">ASHKRI Academic Solutions — Commercial Engineering Mentoring Platform</div>
  </div>
</body>
</html>`;
}

/**
 * Renders HTML email template for Student Acknowledgment
 */
export function renderStudentAcknowledgmentHtml(data: EnquiryEmailData): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Enquiry Received - ${data.referenceNumber}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #f8fafc; color: #1e293b; padding: 24px; margin: 0; }
    .card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; max-width: 580px; margin: 0 auto; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
    .header { border-bottom: 2px solid #0f172a; padding-bottom: 16px; margin-bottom: 20px; }
    .brand { font-size: 16px; font-weight: 800; letter-spacing: 0.05em; color: #0f172a; text-transform: uppercase; }
    .subbrand { font-size: 12px; color: #64748b; font-weight: 500; }
    h1 { font-size: 20px; color: #0f172a; margin-top: 16px; }
    p { font-size: 14px; line-height: 1.6; color: #334155; }
    .ref-box { background: #f1f5f9; border-radius: 6px; padding: 16px; margin: 20px 0; text-align: center; }
    .ref-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #64748b; font-weight: bold; }
    .ref-number { font-size: 22px; font-weight: bold; font-family: monospace; color: #0f172a; margin-top: 4px; }
    .sla-badge { display: inline-block; background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; border-radius: 4px; padding: 4px 8px; font-size: 12px; font-weight: 600; margin-top: 8px; }
    .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="brand">ASHKRI Academic Solutions</div>
      <div class="subbrand">Commercial Engineering Mentoring & Project Architecture</div>
    </div>
    <h1>Dear ${data.studentName},</h1>
    <p>We have successfully received your project consultation request. An engineering coordinator is currently evaluating your technical scope, rubrics, and deliverables.</p>
    
    <div class="ref-box">
      <div class="ref-label">Your Tracking Reference Number</div>
      <div class="ref-number">${data.referenceNumber}</div>
      <div class="sla-badge">✓ Review Within 24 Business Hours (Mon – Sat, 9:00 AM – 6:00 PM IST)</div>
    </div>

    <p><strong>Next Steps:</strong></p>
    <ul style="font-size: 14px; color: #334155; line-height: 1.6;">
      <li>Our technical lead will review your requirements against academic standards.</li>
      <li>We will contact you via WhatsApp (<code>${data.phone}</code>) or email with an initial feasibility roadmap and milestone quotation.</li>
    </ul>

    <p>If you have urgent queries or additional IEEE reference papers, you can reach out directly via Telegram at <a href="https://t.me/Ashkri_Technologies" style="color: #0284c7;">@Ashkri_Technologies</a> citing your reference number above.</p>

    <div class="footer">
      ASHKRI Academic Solutions · A division of ASHKRI Technologies<br>
      Strict Academic Confidentiality & Ethical Integrity Assured
    </div>
  </div>
</body>
</html>`;
}

/**
 * Dispatches an email via Resend API or SMTP.
 * Supports provider-level idempotency key to prevent double delivery on transport retries.
 */
export async function transportEmail(
  to: string,
  subject: string,
  html: string,
  idempotencyKey?: string
): Promise<SendEmailResult> {
  const config = getEmailConfig();

  // 1. If Resend API Key is provided, use Resend HTTP API with Idempotency-Key
  if (config.resendApiKey) {
    try {
      const headers: Record<string, string> = {
        Authorization: `Bearer ${config.resendApiKey}`,
        'Content-Type': 'application/json',
      };
      if (idempotencyKey) {
        headers['Idempotency-Key'] = idempotencyKey;
      }

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          from: config.fromEmail,
          to: [to],
          subject,
          html,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        return { success: false, error: `Resend API error (${res.status}): ${text}` };
      }

      const resJson = (await res.json().catch(() => ({}))) as { id?: string };
      return { success: true, providerMessageId: resJson.id };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  }

  // 2. If SMTP is configured, use Nodemailer
  if (config.smtp) {
    try {
      const transporter = nodemailer.createTransport({
        host: config.smtp.host,
        port: config.smtp.port,
        secure: config.smtp.port === 465,
        auth:
          config.smtp.user && config.smtp.pass
            ? {
                user: config.smtp.user,
                pass: config.smtp.pass,
              }
            : undefined,
      });

      const info = await transporter.sendMail({
        from: config.fromEmail,
        to,
        subject,
        html,
        headers: idempotencyKey ? { 'X-Idempotency-Key': idempotencyKey } : undefined,
      });

      return { success: true, providerMessageId: info.messageId };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  }

  // 3. Dev / Test fallback: Log cleanly without failing
  if (process.env.NODE_ENV !== 'production') {
    console.info(`[EMAIL SIMULATION] Sent to: ${to} | Subject: "${subject}"`);
  }
  return { success: true, providerMessageId: `sim-${Date.now()}` };
}

/**
 * Concurrency-Safe Transactional Outbox Dispatcher
 * 
 * Delivery Semantics:
 * At-least-once delivery with atomic database lease claiming, worker concurrency protection,
 * provider-level idempotency headers, bounded retries (max 3), exponential backoff,
 * lease expiration for interrupted worker recovery, and dead-letter tracking.
 */
export class OutboxDispatcher {
  /**
   * Atomically claims an outbox record with a worker lease to guarantee that
   * two concurrent serverless workers cannot dispatch the same record simultaneously.
   */
  static async claimOutboxRecord(
    outboxId: string,
    workerId: string = `worker-${Math.random().toString(36).substring(2, 9)}`
  ): Promise<{ claimed: boolean; record?: any }> {
    if (!isDatabaseConfigured()) {
      return { claimed: false };
    }

    try {
      // 5-minute worker lease expiry
      const leaseExpiry = new Date(Date.now() - 5 * 60 * 1000);

      // Atomic conditional update
      const updated = await prisma.$executeRaw`
        UPDATE "EmailOutbox"
        SET 
          "status" = 'PROCESSING'::"OutboxStatus",
          "lockedAt" = NOW(),
          "lockedBy" = ${workerId},
          "updatedAt" = NOW()
        WHERE "id" = ${outboxId}
          AND (
            "status" = 'PENDING'::"OutboxStatus"
            OR ("status" = 'FAILED'::"OutboxStatus" AND "nextRetryAt" <= NOW())
            OR ("status" = 'PROCESSING'::"OutboxStatus" AND "lockedAt" <= ${leaseExpiry})
          );
      `;

      if (updated > 0) {
        const record = await prisma.emailOutbox.findUnique({
          where: { id: outboxId },
        });
        return { claimed: true, record };
      }

      return { claimed: false };
    } catch (err) {
      console.error('[Outbox Claim Error]', (err as Error).message);
      return { claimed: false };
    }
  }

  /**
   * Dispatches a single claimed outbox record idempotently.
   */
  static async dispatchOutboxRecord(
    outboxId: string,
    workerId: string = `worker-${Math.random().toString(36).substring(2, 9)}`
  ): Promise<SendEmailResult> {
    if (!isDatabaseConfigured()) {
      return { success: true };
    }

    // 1. Atomically claim record
    const { claimed, record } = await OutboxDispatcher.claimOutboxRecord(outboxId, workerId);
    if (!claimed || !record) {
      // Already delivered, claimed by another worker, or retry not due
      return { success: true };
    }

    // 2. Render payload
    let html = '';
    const payload: EnquiryEmailData = JSON.parse(record.payloadJson);

    if (record.templateName === 'ADMIN_NOTIFICATION') {
      html = renderAdminNotificationHtml(payload);
    } else if (record.templateName === 'STUDENT_ACKNOWLEDGMENT') {
      html = renderStudentAcknowledgmentHtml(payload);
    } else {
      await prisma.emailOutbox.update({
        where: { id: outboxId },
        data: {
          status: 'DEAD_LETTER',
          errorReason: `Unknown template: ${record.templateName}`,
          lockedAt: null,
          lockedBy: null,
        },
      });
      return { success: false, error: `Unknown template: ${record.templateName}` };
    }

    // 3. Attempt transport with provider idempotency key
    const sendResult = await transportEmail(
      record.recipient,
      record.subject,
      html,
      record.idempotencyKey
    );

    const now = new Date();
    const newAttempts = record.attempts + 1;

    // 4. Update state based on outcome
    if (sendResult.success) {
      await prisma.emailOutbox.update({
        where: { id: outboxId },
        data: {
          status: 'DELIVERED',
          deliveredAt: now,
          attempts: newAttempts,
          lockedAt: null,
          lockedBy: null,
          errorReason: null,
        },
      });

      // Record EmailEvent
      try {
        await prisma.emailEvent.create({
          data: {
            enquiryId: record.enquiryId,
            recipient: record.recipient,
            subject: record.subject,
            templateName: record.templateName,
            delivered: true,
            errorReason: null,
          },
        });
      } catch (err) {
        console.warn('[EmailEvent Log Warning]', (err as Error).message);
      }

      return { success: true };
    }

    // Provider failed: exponential backoff (2^newAttempts minutes)
    const backoffMs = Math.pow(2, newAttempts) * 60 * 1000;
    const nextRetry = new Date(now.getTime() + backoffMs);
    const finalStatus = newAttempts >= record.maxAttempts ? 'DEAD_LETTER' : 'FAILED';

    await prisma.emailOutbox.update({
      where: { id: outboxId },
      data: {
        status: finalStatus,
        attempts: newAttempts,
        nextRetryAt: nextRetry,
        lockedAt: null,
        lockedBy: null,
        errorReason: sendResult.error || 'Transport failed',
      },
    });

    try {
      await prisma.emailEvent.create({
        data: {
          enquiryId: record.enquiryId,
          recipient: record.recipient,
          subject: record.subject,
          templateName: record.templateName,
          delivered: false,
          errorReason: sendResult.error || 'Transport failed',
        },
      });
    } catch (err) {
      console.warn('[EmailEvent Log Warning]', (err as Error).message);
    }

    return { success: false, error: sendResult.error };
  }

  /**
   * Scans and dispatches all pending or retryable outbox items.
   */
  static async processPending(enquiryId?: string): Promise<{ dispatched: number; failed: number }> {
    if (!isDatabaseConfigured()) {
      return { dispatched: 0, failed: 0 };
    }

    const now = new Date();
    const pendingItems = await prisma.emailOutbox.findMany({
      where: {
        ...(enquiryId ? { enquiryId } : {}),
        status: { in: ['PENDING', 'FAILED'] },
        nextRetryAt: { lte: now },
        attempts: { lt: 3 },
      },
      take: 20,
    });

    let dispatched = 0;
    let failed = 0;

    for (const item of pendingItems) {
      const res = await OutboxDispatcher.dispatchOutboxRecord(item.id);
      if (res.success) {
        dispatched++;
      } else {
        failed++;
      }
    }

    return { dispatched, failed };
  }
}
