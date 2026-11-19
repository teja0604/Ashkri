import { z } from 'zod';
import crypto from 'node:crypto';

/**
 * Sanitizes user-entered text to prevent HTML injection and malicious formatting.
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Strip script tags and executable contents
    .replace(/<[^>]*>/g, '') // Strip any other HTML tags
    .replace(/[<>]/g, '') // Strip remaining stray brackets
    .replace(/\s+/g, ' ') // Normalize internal whitespace
    .trim();
}

/**
 * Generates an official, collision-resistant reference number.
 * Format: ASH-YYYYMM-XXXX (e.g. ASH-202611-K9X2)
 */
export function generateReferenceNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const randomSuffix = crypto.randomBytes(3).toString('hex').toUpperCase().slice(0, 4);
  return `ASH-${year}${month}-${randomSuffix}`;
}

export const ALLOWED_DEPARTMENTS = [
  'CSE',
  'IT',
  'AI_DS',
  'ECE',
  'EEE',
  'Mechanical',
  'Other',
] as const;

export const ALLOWED_DOMAINS = [
  'Computer Science & Engineering',
  'Information Technology',
  'Artificial Intelligence & Data Science',
  'Electronics & Communication',
  'Electrical & Electronics',
  'Internet of Things',
  'Embedded Systems & Hardware',
] as const;

export const ALLOWED_SERVICES = [
  'Project Consultation & Planning',
  'Full-Stack Software Assistance',
  'AI / ML Guidance',
  'Data Science & Analytics',
  'Hardware, Embedded & IoT',
  'Documentation & Paper Drafting',
  'Viva Coaching & Code Walkthrough',
] as const;

export const EnquiryInputSchema = z.object({
  studentName: z
    .string()
    .trim()
    .min(2, 'Student full name must be at least 2 characters.')
    .max(120, 'Student name cannot exceed 120 characters.')
    .transform(sanitizeInput),

  email: z
    .string()
    .trim()
    .min(1, 'Email address is required.')
    .email('Please provide a valid email address.')
    .max(255, 'Email address cannot exceed 255 characters.')
    .toLowerCase(),

  phone: z
    .string()
    .trim()
    .min(1, 'Phone / WhatsApp number is required.')
    .regex(
      /^\+?[0-9]{10,14}$/,
      'Please provide a valid 10 to 14 digit mobile number (with optional country code).'
    )
    .max(20, 'Phone number is too long.'),

  college: z
    .string()
    .trim()
    .min(2, 'College name must be at least 2 characters.')
    .max(200, 'College name cannot exceed 200 characters.')
    .transform(sanitizeInput),

  department: z
    .string()
    .trim()
    .min(1, 'Department is required.')
    .max(100)
    .default('CSE'),

  domain: z
    .string()
    .trim()
    .min(1, 'Technical domain is required.')
    .max(100)
    .default('Computer Science & Engineering'),

  service: z
    .string()
    .trim()
    .min(1, 'Required service is required.')
    .max(100)
    .default('Full-Stack Software Assistance'),

  projectTitle: z
    .string()
    .trim()
    .max(255, 'Project title cannot exceed 255 characters.')
    .transform(sanitizeInput)
    .optional()
    .nullable(),

  approxBudget: z
    .string()
    .trim()
    .max(50, 'Budget description is too long.')
    .optional()
    .nullable(),

  expectedDeadline: z
    .string()
    .trim()
    .max(50)
    .optional()
    .nullable()
    .transform((val) => {
      if (!val || val.trim().length === 0) return null;
      const parsed = new Date(val);
      return isNaN(parsed.getTime()) ? null : parsed;
    }),

  description: z
    .string()
    .trim()
    .min(20, 'Please provide at least 20 characters describing your project.')
    .max(3000, 'Project description cannot exceed 3,000 characters.')
    .transform(sanitizeInput),

  consent: z
    .boolean()
    .refine((val) => val === true, {
      message: 'You must acknowledge the academic integrity policy to submit.',
    }),

  honeypot: z
    .string()
    .optional()
    .nullable(),
});

export type ValidatedEnquiryInput = z.infer<typeof EnquiryInputSchema>;
