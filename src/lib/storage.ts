import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { getStorageConfig } from './env';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
export const MAX_ZIP_UNCOMPRESSED_BYTES = 50 * 1024 * 1024; // 50 MB total decompressed
export const MAX_ZIP_ENTRIES = 250; // Maximum archive entries
export const MAX_COMPRESSION_RATIO = 10; // Maximum allowable compression ratio (prevents zip bombs)

export const ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.zip'] as const;

export const BLOCKED_ARCHIVE_EXTENSIONS = [
  '.exe',
  '.dll',
  '.bat',
  '.cmd',
  '.sh',
  '.vbs',
  '.ps1',
  '.scr',
  '.jar',
  '.com',
  '.pif',
  '.msi',
] as const;

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
  details?: string;
}

/**
 * Validates PDF structural integrity:
 * 1. %PDF- header magic bytes
 * 2. %%EOF trailer marker within last 2048 bytes
 * 3. Scans for malicious script/executable launch actions (/JavaScript, /Launch)
 */
export function validatePdfStructure(buffer: Buffer): FileValidationResult {
  // Check header
  if (
    buffer.length < 8 ||
    buffer[0] !== 0x25 || // %
    buffer[1] !== 0x50 || // P
    buffer[2] !== 0x44 || // D
    buffer[3] !== 0x46 || // F
    buffer[4] !== 0x2d    // -
  ) {
    return { valid: false, error: 'Invalid PDF header signature.' };
  }

  // Check EOF trailer marker within the last 2048 bytes
  const tailLength = Math.min(buffer.length, 2048);
  const tail = buffer.subarray(buffer.length - tailLength).toString('latin1');
  if (!tail.includes('%%EOF')) {
    return { valid: false, error: 'Malformed PDF: Missing standard %%EOF trailer marker.' };
  }

  // Scan full document content for active script / launch exploits
  const docText = buffer.toString('latin1');
  if (/\/JavaScript[\s/<]/i.test(docText) || /\/JS[\s/<]/i.test(docText)) {
    return {
      valid: false,
      error: 'Security violation: PDF contains embedded JavaScript actions.',
    };
  }

  if (/\/Launch[\s/<]/i.test(docText)) {
    return {
      valid: false,
      error: 'Security violation: PDF contains executable launch actions.',
    };
  }

  return { valid: true, detectedType: 'application/pdf' };
}

interface ZipInspectionResult {
  valid: boolean;
  error?: string;
  entryNames: string[];
  totalUncompressedSize: number;
  totalCompressedSize: number;
}

/**
 * Parses and verifies ZIP central directory headers safely from buffer.
 * Enforces entry count, uncompressed size limits, compression ratios, and blocks path traversal / executables.
 */
export function inspectZipStructure(buffer: Buffer): ZipInspectionResult {
  if (buffer.length < 22) {
    return { valid: false, error: 'Corrupt or incomplete ZIP archive.', entryNames: [], totalUncompressedSize: 0, totalCompressedSize: 0 };
  }

  // Must start with PK signature
  if (buffer[0] !== 0x50 || buffer[1] !== 0x4b) {
    return { valid: false, error: 'Invalid ZIP archive header.', entryNames: [], totalUncompressedSize: 0, totalCompressedSize: 0 };
  }

  // Locate End of Central Directory (EOCD) signature (0x06054b50)
  let eocdOffset = -1;
  const searchStart = buffer.length - 22;
  const searchEnd = Math.max(0, buffer.length - 65557);

  for (let i = searchStart; i >= searchEnd; i--) {
    if (
      buffer[i] === 0x50 &&
      buffer[i + 1] === 0x4b &&
      buffer[i + 2] === 0x05 &&
      buffer[i + 3] === 0x06
    ) {
      eocdOffset = i;
      break;
    }
  }

  if (eocdOffset === -1) {
    return { valid: false, error: 'Corrupt ZIP archive: End of Central Directory record not found.', entryNames: [], totalUncompressedSize: 0, totalCompressedSize: 0 };
  }

  const totalEntries = buffer.readUInt16LE(eocdOffset + 10);
  const cdSize = buffer.readUInt32LE(eocdOffset + 12);
  const cdOffset = buffer.readUInt32LE(eocdOffset + 16);

  if (totalEntries > MAX_ZIP_ENTRIES) {
    return {
      valid: false,
      error: `ZIP archive contains ${totalEntries} entries, exceeding the maximum limit of ${MAX_ZIP_ENTRIES}.`,
      entryNames: [],
      totalUncompressedSize: 0,
      totalCompressedSize: 0,
    };
  }

  if (cdOffset + cdSize > buffer.length) {
    return { valid: false, error: 'Corrupt ZIP archive: Central Directory bounds exceed file size.', entryNames: [], totalUncompressedSize: 0, totalCompressedSize: 0 };
  }

  let currentOffset = cdOffset;
  let totalUncompressed = 0;
  let totalCompressed = 0;
  const entryNames: string[] = [];

  for (let i = 0; i < totalEntries; i++) {
    if (currentOffset + 46 > buffer.length) {
      return { valid: false, error: 'Corrupt ZIP archive: Truncated directory record.', entryNames, totalUncompressedSize: totalUncompressed, totalCompressedSize: totalCompressed };
    }

    // Verify Central Directory File Header signature (0x02014b50)
    if (
      buffer[currentOffset] !== 0x50 ||
      buffer[currentOffset + 1] !== 0x4b ||
      buffer[currentOffset + 2] !== 0x01 ||
      buffer[currentOffset + 3] !== 0x02
    ) {
      return { valid: false, error: 'Corrupt ZIP archive: Invalid central directory signature.', entryNames, totalUncompressedSize: totalUncompressed, totalCompressedSize: totalCompressed };
    }

    const compressedSize = buffer.readUInt32LE(currentOffset + 20);
    const uncompressedSize = buffer.readUInt32LE(currentOffset + 24);
    const fileNameLength = buffer.readUInt16LE(currentOffset + 28);
    const extraFieldLength = buffer.readUInt16LE(currentOffset + 30);
    const fileCommentLength = buffer.readUInt16LE(currentOffset + 32);

    if (currentOffset + 46 + fileNameLength > buffer.length) {
      return { valid: false, error: 'Corrupt ZIP archive: Entry filename extends beyond bounds.', entryNames, totalUncompressedSize: totalUncompressed, totalCompressedSize: totalCompressed };
    }

    const entryName = buffer.toString('utf8', currentOffset + 46, currentOffset + 46 + fileNameLength);
    entryNames.push(entryName);

    // Path traversal check
    if (
      entryName.includes('../') ||
      entryName.includes('..\\') ||
      entryName.startsWith('/') ||
      entryName.startsWith('\\') ||
      /^[a-zA-Z]:/.test(entryName)
    ) {
      return {
        valid: false,
        error: `Security violation: Path traversal detected in archive entry "${entryName}".`,
        entryNames,
        totalUncompressedSize: totalUncompressed,
        totalCompressedSize: totalCompressed,
      };
    }

    // Disallowed executable extensions inside archive
    const entryExt = path.extname(entryName).toLowerCase();
    if (BLOCKED_ARCHIVE_EXTENSIONS.includes(entryExt as (typeof BLOCKED_ARCHIVE_EXTENSIONS)[number])) {
      return {
        valid: false,
        error: `Security violation: Disallowed executable file "${entryName}" detected in archive.`,
        entryNames,
        totalUncompressedSize: totalUncompressed,
        totalCompressedSize: totalCompressed,
      };
    }

    // Individual entry zip bomb check
    if (compressedSize > 1024 && uncompressedSize / compressedSize > MAX_COMPRESSION_RATIO) {
      return {
        valid: false,
        error: `Security violation: Abnormally high compression ratio in entry "${entryName}" (potential zip bomb).`,
        entryNames,
        totalUncompressedSize: totalUncompressed,
        totalCompressedSize: totalCompressed,
      };
    }

    totalCompressed += compressedSize;
    totalUncompressed += uncompressedSize;

    if (totalUncompressed > MAX_ZIP_UNCOMPRESSED_BYTES) {
      return {
        valid: false,
        error: `Archive decompressed size exceeds maximum limit of 50 MB (found ${(totalUncompressed / (1024 * 1024)).toFixed(1)} MB).`,
        entryNames,
        totalUncompressedSize: totalUncompressed,
        totalCompressedSize: totalCompressed,
      };
    }

    currentOffset += 46 + fileNameLength + extraFieldLength + fileCommentLength;
  }

  return {
    valid: true,
    entryNames,
    totalUncompressedSize: totalUncompressed,
    totalCompressedSize: totalCompressed,
  };
}

/**
 * Validates DOCX structure:
 * Confirms valid OpenXML container and presence of required package parts.
 */
export function validateDocxStructure(buffer: Buffer): FileValidationResult {
  const zipCheck = inspectZipStructure(buffer);
  if (!zipCheck.valid) {
    return { valid: false, error: zipCheck.error || 'Invalid DOCX container format.' };
  }

  // Must contain OpenXML manifest parts
  const hasContentTypes = zipCheck.entryNames.some((name) => name === '[Content_Types].xml');
  const hasWordDocument = zipCheck.entryNames.some(
    (name) => name === 'word/document.xml' || name.startsWith('word/document')
  );

  if (!hasContentTypes || !hasWordDocument) {
    return {
      valid: false,
      error: 'Malformed DOCX: Missing required Microsoft Word OpenXML structural components ([Content_Types].xml or word/document.xml).',
    };
  }

  // Check for malicious macros or script components inside docx
  const hasMacro = zipCheck.entryNames.some(
    (name) => name.toLowerCase().includes('vbaproject.bin') || name.toLowerCase().endsWith('.vbs')
  );
  if (hasMacro) {
    return {
      valid: false,
      error: 'Security violation: DOCX document contains embedded VBA macros or scripts.',
    };
  }

  return {
    valid: true,
    detectedType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  };
}

/**
 * Validates file magic bytes.
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
 * Validates file extension, size, magic bytes, and deep structure.
 */
export function validateAttachment(
  filename: string,
  _mimeType: string,
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

  // Deep structural validation
  if (ext === '.pdf') {
    return validatePdfStructure(buffer);
  }

  if (ext === '.docx') {
    return validateDocxStructure(buffer);
  }

  if (ext === '.zip') {
    const zipCheck = inspectZipStructure(buffer);
    if (!zipCheck.valid) {
      return { valid: false, error: zipCheck.error };
    }
    return { valid: true, detectedType: 'application/zip' };
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
 * Compensating deletion helper:
 * Deletes stored object if database transaction fails after upload.
 */
export async function deleteStoredAttachment(storageKey: string): Promise<void> {
  const config = getStorageConfig();

  if (config.provider === 's3' && config.accessKeyId && config.secretAccessKey) {
    const s3 = getS3Client();
    await s3.send(
      new DeleteObjectCommand({
        Bucket: config.bucket,
        Key: storageKey,
      })
    );
    return;
  }

  // Local storage cleanup
  try {
    const localFilePath = path.resolve(process.cwd(), 'storage', 'private_uploads', storageKey);
    await fs.unlink(localFilePath);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== 'ENOENT') {
      console.warn('[Storage Cleanup Warning]', (err as Error).message);
    }
  }
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
