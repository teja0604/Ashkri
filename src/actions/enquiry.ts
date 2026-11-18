'use server';

import { headers } from 'next/headers';
import prisma from '@/lib/prisma';
import { hashIp, checkRateLimit } from '@/lib/rate-limit';
import { EnquiryInputSchema, generateReferenceNumber } from '@/lib/validation/enquiry';
import { validateAttachment, storeAttachment } from '@/lib/storage';
import { sendEnquiryNotifications } from '@/lib/email';
import { isDatabaseConfigured } from '@/lib/env';

export interface ActionResponse {
  success: boolean;
  referenceNumber?: string;
  error?: string;
  issues?: Record<string, string>;
}

export async function submitEnquiryAction(formData: FormData): Promise<ActionResponse> {
  try {
    // 1. Extract client IP securely
    let clientIp = '127.0.0.1';
    try {
      const headerList = await headers();
      const forwarded = headerList.get('x-forwarded-for');
      if (forwarded) {
        clientIp = forwarded.split(',')[0].trim();
      } else {
        clientIp = headerList.get('x-real-ip') || '127.0.0.1';
      }
    } catch {
      // In non-request execution contexts (e.g. unit tests), fallback to localhost
      clientIp = '127.0.0.1';
    }

    const normalizedIp = clientIp.replace(/^::ffff:/, '');
    const ipHash = hashIp(normalizedIp);
    const isLocalhost =
      normalizedIp === '127.0.0.1' ||
      normalizedIp === '::1' ||
      normalizedIp === 'localhost' ||
      normalizedIp.startsWith('192.168.') ||
      normalizedIp.startsWith('10.');

    // 2. Enforce token-bucket rate limiting (5 submissions / 15 minutes for public visitors, 100 for localhost / automated tests)
    const rateLimit = checkRateLimit(ipHash, 5, 15 * 60 * 1000, isLocalhost);
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

    // 5. Bot honeypot check (silently drop or reject bot submissions)
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
      // In dev, test suites, or pre-delegation CI before Neon production database credentials are attached
      if (process.env.VERCEL_ENV !== 'production') {
        console.info(
          `[LOCAL/TEST DATABASE NOTICE] DATABASE_URL not configured. Processed enquiry for ${validData.studentName} (${referenceNumber}).`
        );
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

    // 8. Check for duplicate submission (same email + same description in last 15 minutes)
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    const existingDuplicate = await prisma.enquiry.findFirst({
      where: {
        email: validData.email,
        description: validData.description,
        createdAt: { gte: fifteenMinutesAgo },
      },
    });

    if (existingDuplicate) {
      return {
        success: true,
        referenceNumber: existingDuplicate.referenceNumber,
      };
    }

    // 9. Persist enquiry inside a Prisma transaction
    const newEnquiry = await prisma.$transaction(async (tx) => {
      const enquiry = await tx.enquiry.create({
        data: {
          referenceNumber,
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

      // Store attachment if present
      if (attachmentBuffer && originalFilename) {
        const stored = await storeAttachment(
          enquiry.id,
          originalFilename,
          mimeType,
          attachmentBuffer
        );

        await tx.enquiryAttachment.create({
          data: {
            enquiryId: enquiry.id,
            originalName: stored.originalName,
            storageKey: stored.storageKey,
            mimeType: stored.mimeType,
            sizeBytes: stored.sizeBytes,
            checksum: stored.checksum,
          },
        });
      }

      return enquiry;
    });

    // 10. Dispatch asynchronous email notifications
    sendEnquiryNotifications({
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
    }).catch((err) => {
      console.error('[Async Email Error]', (err as Error).message);
    });

    return {
      success: true,
      referenceNumber: newEnquiry.referenceNumber,
    };
  } catch (error) {
    // Avoid exposing raw database errors or stack traces to client
    console.error('[Enquiry Submission Error]', error);
    return {
      success: false,
      error: 'We were unable to process your enquiry at this moment. Please try again or reach out directly to contact@ashkri.com.',
    };
  }
}
