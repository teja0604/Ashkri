'use server';

import crypto from 'node:crypto';
import { headers } from 'next/headers';
import prisma from '@/lib/prisma';
import { hashIp, checkDistributedRateLimit } from '@/lib/rate-limit';
import { extractClientIp, isLocalhostIp } from '@/lib/trusted-proxy';
import { EnquiryInputSchema, generateReferenceNumber } from '@/lib/validation/enquiry';
import {
  validateAttachment,
  storeAttachment,
  deleteStoredAttachment,
  StoredAttachmentResult,
} from '@/lib/storage';
import { sendEnquiryNotifications } from '@/lib/email';
import { isDatabaseConfigured } from '@/lib/env';

export interface ActionResponse {
  success: boolean;
  referenceNumber?: string;
  error?: string;
  issues?: Record<string, string>;
}

export async function submitEnquiryAction(formData: FormData): Promise<ActionResponse> {
  let storedAttachment: StoredAttachmentResult | null = null;

  try {
    // 1. Extract client IP securely using trusted proxy resolution
    let clientIp = '127.0.0.1';
    try {
      const headerList = await headers();
      clientIp = extractClientIp(headerList);
    } catch {
      // In non-request execution contexts (e.g. unit tests), fallback to localhost
      clientIp = '127.0.0.1';
    }

    const isLocalhost = isLocalhostIp(clientIp);
    const ipHash = hashIp(clientIp);

    // 2. Enforce distributed atomic rate limiting
    // (5 submissions / 15 minutes for public visitors, 100 for localhost / automated tests)
    const rateLimit = await checkDistributedRateLimit(ipHash, 5, 15 * 60 * 1000, isLocalhost);
    if (!rateLimit.success) {
      return {
        success: false,
        error: rateLimit.error || 'Too many submissions. Please try again later.',
      };
    }

    // 3. Extract and parse form fields
    const honeypotVal = formData.get('website_verification') || formData.get('honeypot');
    if (honeypotVal && typeof honeypotVal === 'string' && honeypotVal.trim().length > 0) {
      return {
        success: false,
        error: 'Automated submission rejected.',
      };
    }

    const rawData = {
      studentName: formData.get('studentName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      college: formData.get('college'),
      department: formData.get('department'),
      domain: formData.get('domain'),
      service: formData.get('service'),
      approxBudget: formData.get('approxBudget'),
      expectedDeadline: formData.get('expectedDeadline'),
      description: formData.get('description'),
      consent: formData.get('consent') === 'true' || formData.get('consent') === 'on',
      honeypot: honeypotVal,
    };

    // 4. Validate with Zod schema
    const validationResult = EnquiryInputSchema.safeParse(rawData);
    if (!validationResult.success) {
      const issues: Record<string, string> = {};
      for (const issue of validationResult.error.issues) {
        const fieldName = issue.path[0]?.toString() || 'general';
        if (!issues[fieldName]) {
          issues[fieldName] = issue.message;
        }
      }
      return {
        success: false,
        error: 'Please correct the highlighted errors in the form.',
        issues,
      };
    }

    const validData = validationResult.data;

    // 5. Bot honeypot check
    if (validData.honeypot && validData.honeypot.trim().length > 0) {
      return {
        success: false,
        error: 'Automated submission rejected.',
      };
    }

    // 6. Handle optional file attachment
    const file = formData.get('attachment');
    let attachmentBuffer: Buffer | null = null;
    let originalFilename = '';
    let mimeType = '';

    if (file && typeof file === 'object' && 'arrayBuffer' in file && (file as File).size > 0) {
      const uploadedFile = file as File;
      originalFilename = uploadedFile.name;
      mimeType = uploadedFile.type || 'application/octet-stream';

      const arrayBuf = await uploadedFile.arrayBuffer();
      attachmentBuffer = Buffer.from(arrayBuf);

      const fileValidation = validateAttachment(originalFilename, mimeType, attachmentBuffer);
      if (!fileValidation.valid) {
        return {
          success: false,
          error: fileValidation.error || 'Uploaded file failed security validation.',
          issues: { attachment: fileValidation.error || 'Invalid file format or size.' },
        };
      }
    }

    // Generate unique reference number
    const referenceNumber = generateReferenceNumber();

    // 7. Check database configuration
    if (!isDatabaseConfigured()) {
      const isAllowedMock =
        process.env.NODE_ENV === 'test' || process.env.ALLOW_MOCKED_SUBMISSIONS === 'true';

      if (isAllowedMock) {
        return {
          success: true,
          referenceNumber,
        };
      }

      return {
        success: false,
        error: 'Database service is currently unavailable. Please contact us directly via email or Telegram.',
      };
    }

    // 8. Calculate deterministic idempotency key for atomic duplicate prevention
    const clientToken = formData.get('idempotencyKey')?.toString().trim();
    const payloadFingerprint = crypto
      .createHash('sha256')
      .update(
        [
          validData.email.toLowerCase().trim(),
          validData.phone.trim(),
          validData.domain,
          validData.service,
          validData.description.trim(),
        ].join('|')
      )
      .digest('hex');

    const idempotencyKey = clientToken
      ? `${clientToken.slice(0, 64)}_${payloadFingerprint.slice(0, 32)}`
      : `idem_${payloadFingerprint}`;

    // 9. Pre-upload file to storage if present (before DB transaction)
    const enquiryId = crypto.randomUUID();

    if (attachmentBuffer && originalFilename) {
      storedAttachment = await storeAttachment(
        enquiryId,
        originalFilename,
        mimeType,
        attachmentBuffer
      );
    }

    // 10. Persist enquiry inside a Prisma transaction with compensating rollback
    try {
      const newEnquiry = await prisma.$transaction(async (tx) => {
        const enquiry = await tx.enquiry.create({
          data: {
            id: enquiryId,
            referenceNumber,
            idempotencyKey,
            studentName: validData.studentName,
            email: validData.email,
            phone: validData.phone,
            college: validData.college,
            department: validData.department,
            domain: validData.domain,
            service: validData.service,
            projectTitle: validData.projectTitle ?? null,
            description: validData.description,
            approxBudget: validData.approxBudget ?? null,
            expectedDeadline: validData.expectedDeadline ?? null,
            consentGiven: validData.consent,
            ipHash,
          },
        });

        // Record initial status history
        await tx.enquiryStatusHistory.create({
          data: {
            enquiryId: enquiry.id,
            fromStatus: 'NEW',
            toStatus: 'NEW',
            reason: 'Initial student consultation submission via website',
          },
        });

        // Store attachment record if present
        if (storedAttachment) {
          await tx.enquiryAttachment.create({
            data: {
              enquiryId: enquiry.id,
              originalName: storedAttachment.originalName,
              storageKey: storedAttachment.storageKey,
              mimeType: storedAttachment.mimeType,
              sizeBytes: storedAttachment.sizeBytes,
              checksum: storedAttachment.checksum,
              scanStatus: 'CLEAN',
            },
          });
        }

        return enquiry;
      });

      // 11. Dispatch durable outbox notifications
      await sendEnquiryNotifications({
        enquiryId: newEnquiry.id,
        referenceNumber: newEnquiry.referenceNumber,
        studentName: newEnquiry.studentName,
        email: newEnquiry.email,
        phone: newEnquiry.phone,
        college: newEnquiry.college,
        department: newEnquiry.department,
        domain: newEnquiry.domain,
        service: newEnquiry.service,
        approxBudget: newEnquiry.approxBudget,
        expectedDeadline: newEnquiry.expectedDeadline,
        description: newEnquiry.description,
        attachmentName: originalFilename || null,
      });

      return {
        success: true,
        referenceNumber: newEnquiry.referenceNumber,
      };
    } catch (dbError) {
      // Compensating storage cleanup: if DB transaction fails, delete any uploaded object
      if (storedAttachment) {
        try {
          await deleteStoredAttachment(storedAttachment.storageKey);
        } catch (cleanupErr) {
          console.warn('[Storage Cleanup Failed]', (cleanupErr as Error).message);
        }
      }

      // Check for concurrent duplicate submission (PostgreSQL P2002 on idempotencyKey)
      const prismaErr = dbError as { code?: string };
      if (prismaErr.code === 'P2002') {
        const existing = await prisma.enquiry.findUnique({
          where: { idempotencyKey },
          select: { referenceNumber: true },
        });

        if (existing) {
          return {
            success: true,
            referenceNumber: existing.referenceNumber,
          };
        }
      }

      console.error('[Enquiry DB Transaction Error]', (dbError as Error).message);
      return {
        success: false,
        error: 'Failed to record enquiry due to a database error. Please try again.',
      };
    }
  } catch (error) {
    // If any failure occurred outside transaction but after storage upload, clean up
    if (storedAttachment) {
      try {
        await deleteStoredAttachment(storedAttachment.storageKey);
      } catch (cleanupErr) {
        console.warn('[Storage Cleanup Failed]', (cleanupErr as Error).message);
      }
    }

    console.error('[Enquiry Submission Error]', error);
    return {
      success: false,
      error: 'We were unable to process your enquiry at this moment. Please try again or reach out directly to contact@ashkri.com.',
    };
  }
}
