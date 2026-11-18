/**
 * ASHKRI Academic Solutions — Server Environment Configuration
 * 
 * Centralizes server-side configuration, ensures secrets are NEVER bundled into
 * client code, and provides strongly-typed fallbacks for development.
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
  return {
    provider,
    bucket: process.env.STORAGE_BUCKET || 'ashkri-enquiry-documents-private',
    region: process.env.STORAGE_REGION || 'ap-southeast-1',
    endpoint: process.env.STORAGE_ENDPOINT,
    accessKeyId: process.env.STORAGE_ACCESS_KEY_ID,
    secretAccessKey: process.env.STORAGE_SECRET_ACCESS_KEY,
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

export function getRateLimitSalt(): string {
  return process.env.RATE_LIMIT_SALT || 'ashkri-academic-solutions-default-salt-2026';
}
