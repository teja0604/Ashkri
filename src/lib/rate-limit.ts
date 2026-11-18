import crypto from 'node:crypto';
import { getRateLimitSalt } from './env';

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

// In-memory sliding window cache for rate limiting
const ipRateLimitStore = new Map<string, RateLimitRecord>();

// Clean up expired records every 5 minutes to avoid memory leaks
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
let lastCleanup = Date.now();

function purgeExpiredRecords(): void {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;

  for (const [key, record] of ipRateLimitStore.entries()) {
    if (record.resetAt <= now) {
      ipRateLimitStore.delete(key);
    }
  }
}

/**
 * Creates a one-way, salted SHA-256 hash of an IP address.
 * Ensures visitor IPs are never stored in raw form in the database or logs.
 */
export function hashIp(ip: string): string {
  const salt = getRateLimitSalt();
  return crypto.createHash('sha256').update(`${ip}:${salt}`).digest('hex');
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetSeconds: number;
  error?: string;
}

/**
 * Rate limit requests by hashed IP identifier.
 * Default: 5 requests per 15-minute window (900 seconds) for public IPs;
 * 100 requests for localhost / automated testing suites.
 */
export function checkRateLimit(
  ipHash: string,
  limit: number = 5,
  windowMs: number = 15 * 60 * 1000,
  isLocalhost: boolean = false
): RateLimitResult {
  purgeExpiredRecords();

  const effectiveLimit = isLocalhost ? 100 : limit;
  const now = Date.now();
  const existing = ipRateLimitStore.get(ipHash);

  if (!existing || existing.resetAt <= now) {
    ipRateLimitStore.set(ipHash, {
      count: 1,
      resetAt: now + windowMs,
    });
    return {
      success: true,
      remaining: effectiveLimit - 1,
      resetSeconds: Math.ceil(windowMs / 1000),
    };
  }

  if (existing.count >= effectiveLimit) {
    const resetSeconds = Math.ceil((existing.resetAt - now) / 1000);
    return {
      success: false,
      remaining: 0,
      resetSeconds,
      error: `Too many consultation requests. Please try again in ${Math.ceil(resetSeconds / 60)} minutes.`,
    };
  }

  existing.count += 1;
  return {
    success: true,
    remaining: effectiveLimit - existing.count,
    resetSeconds: Math.ceil((existing.resetAt - now) / 1000),
  };
}

// Reset store helper for test isolation
export function _resetRateLimitStoreForTesting(): void {
  ipRateLimitStore.clear();
}
