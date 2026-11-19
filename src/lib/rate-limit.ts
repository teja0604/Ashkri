import crypto from 'node:crypto';
import prisma from './prisma';
import { getRateLimitSalt, isDatabaseConfigured } from './env';

interface MemoryRateLimitRecord {
  count: number;
  resetAt: number;
}

// In-memory sliding window cache for rate limiting fallback and unit testing
const ipRateLimitStore = new Map<string, MemoryRateLimitRecord>();

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
 * Synchronous in-memory rate limiting check.
 * Default: 5 requests per 15-minute window for public IPs; 100 for localhost / test suites.
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

/**
 * Distributed, atomic rate limiting mechanism backed by PostgreSQL RateLimitRecord.
 * In a multi-instance serverless environment (e.g. Vercel Lambdas), this guarantees
 * atomic counting and prevents bypassing limits via concurrent or distributed requests.
 */
export async function checkDistributedRateLimit(
  ipHash: string,
  limit: number = 5,
  windowMs: number = 15 * 60 * 1000,
  isLocalhost: boolean = false
): Promise<RateLimitResult> {
  const effectiveLimit = isLocalhost ? 100 : limit;
  const now = new Date();
  const resetDate = new Date(now.getTime() + windowMs);

  if (isDatabaseConfigured()) {
    try {
      // Atomic upsert with conditional window reset in PostgreSQL
      const result: Array<{ count: number; expiresAt: Date }> = await prisma.$queryRaw`
        INSERT INTO "RateLimitRecord" ("key", "count", "expiresAt", "createdAt", "updatedAt")
        VALUES (${ipHash}, 1, ${resetDate}, NOW(), NOW())
        ON CONFLICT ("key") DO UPDATE
        SET 
          "count" = CASE 
            WHEN "RateLimitRecord"."expiresAt" <= NOW() THEN 1 
            ELSE "RateLimitRecord"."count" + 1 
          END,
          "expiresAt" = CASE 
            WHEN "RateLimitRecord"."expiresAt" <= NOW() THEN ${resetDate} 
            ELSE "RateLimitRecord"."expiresAt" 
          END,
          "updatedAt" = NOW()
        RETURNING "count", "expiresAt";
      `;

      if (result && result.length > 0) {
        const { count, expiresAt } = result[0];
        const remainingMs = Math.max(0, new Date(expiresAt).getTime() - Date.now());
        const resetSeconds = Math.ceil(remainingMs / 1000);

        if (count > effectiveLimit) {
          return {
            success: false,
            remaining: 0,
            resetSeconds,
            error: `Too many consultation requests. Please try again in ${Math.ceil(resetSeconds / 60)} minutes.`,
          };
        }

        return {
          success: true,
          remaining: Math.max(0, effectiveLimit - count),
          resetSeconds,
        };
      }
    } catch (err) {
      console.error('[RateLimit DB Error - Falling back to local store]', (err as Error).message);
    }
  }

  // Fallback to local memory store when database is not configured or during testing
  return checkRateLimit(ipHash, limit, windowMs, isLocalhost);
}

/**
 * Multi-instance simulator for testing distributed rate limiting without requiring a live PostgreSQL instance.
 */
export class SimulatedDistributedRateLimiter {
  private sharedStore = new Map<string, { count: number; expiresAt: number }>();

  async check(key: string, limit: number, windowMs: number): Promise<RateLimitResult> {
    const now = Date.now();
    const existing = this.sharedStore.get(key);

    if (!existing || existing.expiresAt <= now) {
      this.sharedStore.set(key, { count: 1, expiresAt: now + windowMs });
      return {
        success: true,
        remaining: limit - 1,
        resetSeconds: Math.ceil(windowMs / 1000),
      };
    }

    if (existing.count >= limit) {
      const resetSeconds = Math.ceil((existing.expiresAt - now) / 1000);
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
      remaining: limit - existing.count,
      resetSeconds: Math.ceil((existing.expiresAt - now) / 1000),
    };
  }

  reset(): void {
    this.sharedStore.clear();
  }
}

// Reset store helper for test isolation
export function _resetRateLimitStoreForTesting(): void {
  ipRateLimitStore.clear();
}
