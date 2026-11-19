import net from 'node:net';

/**
 * ASHKRI Academic Solutions — Trusted Proxy Resolution & Anti-Spoofing Architecture
 * 
 * Deployment Boundary Specification (Vercel Edge Network):
 * When deployed on Vercel:
 * 1. `x-vercel-forwarded-for`: Authenticated and injected by the Vercel Edge proxy layer.
 *    Vercel overrides or populates this header with the verified TCP remote IP of the client.
 *    Untrusted visitors cannot spoof or inject this header.
 * 2. `cf-connecting-ip`: When DNS is proxied via Cloudflare Enterprise / Pro, Cloudflare
 *    authenticates and sets `cf-connecting-ip` to the client's verified connection IP.
 * 3. In production (`NODE_ENV === 'production'`), generic unauthenticated headers such as
 *    arbitrary client-supplied `x-forwarded-for` or `x-real-ip` MUST NOT be trusted
 *    without the platform edge header being present.
 * 
 * Local Development & Testing Boundary:
 * For Vitest and Playwright test runners running locally, fallback to loopback `127.0.0.1`
 * or explicitly mocked test headers is permitted.
 */

export interface HeaderSource {
  get(name: string): string | null;
}

export function normalizeIp(rawIp: string): string {
  let ip = rawIp.trim();

  // Strip IPv6 enclosing brackets if present (e.g. [::1]:8080)
  if (ip.startsWith('[') && ip.includes(']')) {
    ip = ip.replace(/^\[/, '').replace(/\](?::\d+)?$/, '');
  }

  // Strip port if IPv4 with port (e.g., 192.168.1.1:3000)
  if (ip.includes(':') && !ip.includes('::') && ip.indexOf(':') === ip.lastIndexOf(':')) {
    ip = ip.split(':')[0];
  }

  // Strip IPv4-mapped IPv6 prefix (e.g., ::ffff:127.0.0.1 -> 127.0.0.1)
  if (ip.startsWith('::ffff:')) {
    ip = ip.substring(7);
  }

  return ip;
}

export function isValidIp(ip: string): boolean {
  return net.isIP(ip) !== 0;
}

export function isLocalhostIp(ip: string): boolean {
  const normalized = normalizeIp(ip);
  return (
    normalized === '127.0.0.1' ||
    normalized === '::1' ||
    normalized === 'localhost' ||
    normalized === '0.0.0.0' ||
    normalized.startsWith('127.')
  );
}

export interface ClientIpResult {
  ip: string;
  isTrusted: boolean;
  sourceHeader: string;
}

/**
 * Extracts and strictly authenticates client IP against the verified deployment platform boundary.
 */
export function extractClientIp(
  headers: HeaderSource | Headers | Record<string, string | string[] | undefined>
): string {
  const getHeader = (name: string): string | null => {
    if ('get' in headers && typeof headers.get === 'function') {
      return headers.get(name);
    }
    const val =
      (headers as Record<string, string | string[] | undefined>)[name.toLowerCase()] ??
      (headers as Record<string, string | string[] | undefined>)[name];
    if (Array.isArray(val)) return val[0] || null;
    return typeof val === 'string' ? val : null;
  };

  const isProduction =
    process.env.NODE_ENV === 'production' && !process.env.ALLOW_MOCKED_SUBMISSIONS;

  // 1. Primary Vercel-authenticated Edge Header (Guaranteed on Vercel infrastructure)
  const vercelForwarded = getHeader('x-vercel-forwarded-for');
  if (vercelForwarded) {
    const candidate = normalizeIp(vercelForwarded.split(',')[0]);
    if (isValidIp(candidate)) {
      return candidate;
    }
  }

  // 2. Cloudflare-authenticated Edge Header
  const cfConnecting = getHeader('cf-connecting-ip');
  if (cfConnecting) {
    const candidate = normalizeIp(cfConnecting);
    if (isValidIp(candidate)) {
      return candidate;
    }
  }

  // 3. Vercel deployment real-ip (populated by Vercel edge proxy)
  if (process.env.VERCEL) {
    const realIp = getHeader('x-real-ip');
    if (realIp) {
      const candidate = normalizeIp(realIp);
      if (isValidIp(candidate)) {
        return candidate;
      }
    }
  }

  // In production outside verified edge headers:
  // Reject unauthenticated client-supplied x-forwarded-for to prevent spoofing
  if (isProduction) {
    // If running in production but without platform edge headers (e.g. direct untrusted probe),
    // return a sentinel unverified IP hash rather than trusting forged client headers.
    return 'untrusted-proxy-boundary';
  }

  // 4. Local Development & Test Execution Boundary
  const xRealIp = getHeader('x-real-ip');
  if (xRealIp) {
    const candidate = normalizeIp(xRealIp);
    if (isValidIp(candidate)) return candidate;
  }

  const forwardedFor = getHeader('x-forwarded-for');
  if (forwardedFor) {
    const parts = forwardedFor.split(',').map((p) => normalizeIp(p)).filter(Boolean);
    // Take rightmost in test proxies
    for (let i = parts.length - 1; i >= 0; i--) {
      if (isValidIp(parts[i])) {
        return parts[i];
      }
    }
  }

  // Default fallback for unit test harnesses
  return '127.0.0.1';
}
