/**
 * ASHKRI Academic Solutions — Server Environment Configuration & Secrets Validation
 * 
 * Centralizes server-side configuration, ensures secrets are NEVER bundled into
 * client code, strictly rejects predictable fallbacks in production, and provides
 * safe mock-isolated fallbacks exclusively for local development and test runners.
 */

export interface StorageConfig {
  provider: 'local' | 's3';
  bucket: string;
  region: string;
  endpoint?: string;
  accessKeyId?: string;
  secretAccessKey?: string;
}

export interface EmailConfig {
  adminEmail: string;
  fromEmail: string;
  resendApiKey?: string;
  smtp?: {
    host: string;
    port: number;
    user?: string;
    pass?: string;
  };
}

export function getDatabaseUrl(): string | undefined {
  return process.env.DATABASE_URL;
}

export function getDirectUrl(): string | undefined {
  return process.env.DIRECT_URL || process.env.DATABASE_URL;
}

export function isDatabaseConfigured(): boolean {
  const url = getDatabaseUrl();
  return Boolean(url && url.trim().length > 0 && !url.includes('npg_placeholder'));
}

export function getStorageConfig(): StorageConfig {
  const provider = (process.env.STORAGE_PROVIDER === 's3' ? 's3' : 'local') as 'local' | 's3';
  const bucket = process.env.STORAGE_BUCKET || 'ashkri-enquiry-documents-private';
  const region = process.env.STORAGE_REGION || 'ap-southeast-1';
  const endpoint = process.env.STORAGE_ENDPOINT;
  const accessKeyId = process.env.STORAGE_ACCESS_KEY_ID;
  const secretAccessKey = process.env.STORAGE_SECRET_ACCESS_KEY;

  if (process.env.NODE_ENV === 'production' && !process.env.ALLOW_MOCKED_SUBMISSIONS) {
    if (provider === 's3') {
      if (!accessKeyId || !secretAccessKey) {
        throw new Error(
          'FATAL CONFIGURATION ERROR: S3 storage provider is configured in production, but STORAGE_ACCESS_KEY_ID or STORAGE_SECRET_ACCESS_KEY is missing.'
        );
      }
    }
  }

  return {
    provider,
    bucket,
    region,
    endpoint,
    accessKeyId,
    secretAccessKey,
  };
}

export function getEmailConfig(): EmailConfig {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || 'contact@ashkri.com';
  const fromEmail = process.env.EMAIL_FROM || 'ASHKRI Academic Solutions <no-reply@ashkri.com>';
  const resendApiKey = process.env.RESEND_API_KEY;

  let smtp: EmailConfig['smtp'] = undefined;
  if (process.env.SMTP_HOST && process.env.SMTP_PORT) {
    smtp = {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10) || 587,
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    };
  }

  return {
    adminEmail,
    fromEmail,
    resendApiKey,
    smtp,
  };
}

/**
 * Returns salt used for one-way IP hashing.
 * In production, strictly requires a non-empty, cryptographically strong salt (>= 32 chars).
 * Predictable fallbacks are forbidden outside explicit test/development environments.
 */
export function getRateLimitSalt(): string {
  const salt = process.env.RATE_LIMIT_SALT;

  if (process.env.NODE_ENV === 'production' && !process.env.ALLOW_MOCKED_SUBMISSIONS) {
    if (!salt || salt.trim().length < 32) {
      throw new Error(
        'FATAL CONFIGURATION ERROR: RATE_LIMIT_SALT must be configured and contain at least 32 characters in production environments.'
      );
    }
    return salt.trim();
  }

  // Development and test fallback
  return salt || 'ashkri-dev-test-only-salt-min-32-chars-for-hash-calc';
}

/**
 * Authenticated token secret for malware scanning write-back webhook.
 */
export function getScanWebhookSecret(): string {
  const secret = process.env.SCAN_WEBHOOK_SECRET;

  if (process.env.NODE_ENV === 'production' && !process.env.ALLOW_MOCKED_SUBMISSIONS) {
    if (!secret || secret.trim().length < 32) {
      throw new Error(
        'FATAL CONFIGURATION ERROR: SCAN_WEBHOOK_SECRET must be configured and contain at least 32 characters in production environments.'
      );
    }
    return secret.trim();
  }

  return secret || 'ashkri-dev-test-scan-webhook-secret-min-32-chars';
}
