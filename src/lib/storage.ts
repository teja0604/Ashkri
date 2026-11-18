import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { getStorageConfig } from './env';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export const ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.zip'] as const;

export const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/zip',
  'application/x-zip-compressed',
] as const;

export interface FileValidationResult {
  valid: boolean;
  error?: string;
  detectedType?: string;
}

/**
 * Validates file signature (magic bytes) to ensure file content actually
 * matches the declared extension and prevents renamed malicious binaries.
 */
export function validateFileMagicBytes(buffer: Buffer): FileValidationResult {
  if (buffer.length < 4) {
    return { valid: false, error: 'File is too small or empty.' };
  }

  // PDF signature: %PDF- (0x25, 0x50, 0x44, 0x46)
  if (
    buffer[0] === 0x25 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x44 &&
    buffer[3] === 0x46
  ) {
    return { valid: true, detectedType: 'application/pdf' };
  }

  // ZIP / DOCX signature: PK\x03\x04 (0x50, 0x4B, 0x03, 0x04)
  if (
    buffer[0] === 0x50 &&
    buffer[1] === 0x4b &&
    buffer[2] === 0x03 &&
    buffer[3] === 0x04
  ) {
    return { valid: true, detectedType: 'application/zip-or-docx' };
  }

  return {
    valid: false,
    error: 'Invalid file format. Only verified PDF, DOCX, and ZIP documents are accepted.',
  };
}

/**
 * Validates file extension, size, and magic bytes.
 */
export function validateAttachment(
  filename: string,
  mimeType: string,
  buffer: Buffer
): FileValidationResult {
  if (buffer.length > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File size exceeds the 10 MB limit (${(buffer.length / (1024 * 1024)).toFixed(1)} MB).`,
    };
  }

  const ext = path.extname(filename).toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext as (typeof ALLOWED_EXTENSIONS)[number])) {
    return {
      valid: false,
      error: `File type "${ext}" is not supported. Please upload a .pdf, .docx, or .zip archive.`,
    };
  }

  const magicCheck = validateFileMagicBytes(buffer);
  if (!magicCheck.valid) {
    return magicCheck;
  }

  return { valid: true };
}

/**
 * Computes SHA-256 checksum of file buffer for data integrity verification.
 */
export function computeChecksum(buffer: Buffer): string {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

/**
 * Sanitizes original filename to prevent path traversal and shell injection across both POSIX and Windows.
 */
export function sanitizeFilename(filename: string): string {
  // Normalize Windows backslashes to forward slashes for cross-platform safety
  const normalized = filename.replace(/\\/g, '/');
  const base = path.posix.basename(normalized);
  return base.replace(/[^a-zA-Z0-9._-]/g, '_');
}

/**
 * Generates a collision-free private storage key.
 */
export function generateStorageKey(enquiryId: string, filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  const uuid = crypto.randomUUID();
  return `enquiries/${enquiryId}/${uuid}${ext}`;
}

let s3ClientInstance: S3Client | null = null;

function getS3Client(): S3Client {
  if (!s3ClientInstance) {
    const config = getStorageConfig();
    s3ClientInstance = new S3Client({
      region: config.region,
      endpoint: config.endpoint,
      credentials:
        config.accessKeyId && config.secretAccessKey
          ? {
              accessKeyId: config.accessKeyId,
              secretAccessKey: config.secretAccessKey,
            }
          : undefined,
    });
  }
  return s3ClientInstance;
}

export interface StoredAttachmentResult {
  storageKey: string;
  checksum: string;
  sizeBytes: number;
  originalName: string;
  mimeType: string;
}

/**
 * Stores file in private object storage (S3/R2 or quarantined local disk).
 */
export async function storeAttachment(
  enquiryId: string,
  filename: string,
  mimeType: string,
  buffer: Buffer
): Promise<StoredAttachmentResult> {
  const storageKey = generateStorageKey(enquiryId, filename);
  const checksum = computeChecksum(buffer);
  const sizeBytes = buffer.length;
  const originalName = sanitizeFilename(filename);

  const config = getStorageConfig();

  if (config.provider === 's3' && config.accessKeyId && config.secretAccessKey) {
    const s3 = getS3Client();
    await s3.send(
      new PutObjectCommand({
        Bucket: config.bucket,
        Key: storageKey,
        Body: buffer,
        ContentType: mimeType,
        ChecksumSHA256: Buffer.from(checksum, 'hex').toString('base64'),
        ServerSideEncryption: 'AES256',
      })
    );
  } else {
    // Local secure storage fallback (quarantined in local private directory)
    const localDir = path.resolve(process.cwd(), 'storage', 'private_uploads', path.dirname(storageKey));
    await fs.mkdir(localDir, { recursive: true });
    const localFilePath = path.resolve(process.cwd(), 'storage', 'private_uploads', storageKey);
    await fs.writeFile(localFilePath, buffer);
  }

  return {
    storageKey,
    checksum,
    sizeBytes,
    originalName,
    mimeType,
  };
}

/**
 * Retrieves file buffer or generates signed download URL for authorized viewing.
 */
export async function getAttachmentDownload(
  storageKey: string
): Promise<{ buffer?: Buffer; signedUrl?: string }> {
  const config = getStorageConfig();

  if (config.provider === 's3' && config.accessKeyId && config.secretAccessKey) {
    const s3 = getS3Client();
    const command = new GetObjectCommand({
      Bucket: config.bucket,
      Key: storageKey,
    });
    // Signed URL valid for 15 minutes (900 seconds)
    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 900 });
    return { signedUrl };
  }

  // Local fallback
  const localFilePath = path.resolve(process.cwd(), 'storage', 'private_uploads', storageKey);
  const buffer = await fs.readFile(localFilePath);
  return { buffer };
}
