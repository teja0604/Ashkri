import net from 'node:net';

/**
 * Extracts and sanitizes the true client IP from incoming request headers.
 * 
 * Security Consideration (Anti-Spoofing):
 * Naive implementations often parse `x-forwarded-for` from left to right.
 * An attacker can trivially send `X-Forwarded-For: 8.8.8.8` to spoof their client IP
 * and bypass IP-based rate limiting if intermediate proxies append rather than overwrite.
 * 
 * In production on Vercel or Cloudflare:
 * 1. `x-vercel-forwarded-for` is set and authenticated by the Vercel Edge network.
 * 2. `cf-connecting-ip` is set and authenticated by the Cloudflare Edge network.
 * 3. `x-real-ip` is set by standard reverse proxies (Nginx/Traefik).
 * 4. For generic `x-forwarded-for`, if trusted proxies are in place, the rightmost IP
 *    closest to the proxy is the most reliable when proxy hops are known, or we pick
 *    the first strictly validated public IP while rejecting malformed inputs.
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

/**
 * Extract trusted client IP from Headers object or dictionary.
 */
export function extractClientIp(
  headers: HeaderSource | Headers | Record<string, string | string[] | undefined>
): string {
  const getHeader = (name: string): string | null => {
    if ('get' in headers && typeof headers.get === 'function') {
      return headers.get(name);
    }
    const val = (headers as Record<string, string | string[] | undefined>)[name.toLowerCase()] ??
      (headers as Record<string, string | string[] | undefined>)[name];
    if (Array.isArray(val)) return val[0] || null;
    return typeof val === 'string' ? val : null;
  };

  // 1. Trusted provider platform-specific headers (highest precedence)
  const vercelForwarded = getHeader('x-vercel-forwarded-for');
  if (vercelForwarded) {
    const candidate = normalizeIp(vercelForwarded.split(',')[0]);
    if (isValidIp(candidate)) return candidate;
  }

  const cfConnecting = getHeader('cf-connecting-ip');
  if (cfConnecting) {
    const candidate = normalizeIp(cfConnecting);
    if (isValidIp(candidate)) return candidate;
  }

  const realIp = getHeader('x-real-ip');
  if (realIp) {
    const candidate = normalizeIp(realIp);
    if (isValidIp(candidate)) return candidate;
  }

  // 2. Standard X-Forwarded-For
  // Note on anti-spoofing: If a user sends "X-Forwarded-For: 1.2.3.4, 198.51.100.1",
  // in a standard reverse proxy (like Vercel / Nginx), the proxy appends the client IP to the end.
  // When multiple comma-separated IPs exist and no platform header is trusted, taking the right-most
  // entry represents the peer IP that connected directly to the outermost proxy layer.
  const forwardedFor = getHeader('x-forwarded-for');
  if (forwardedFor) {
    const parts = forwardedFor.split(',').map((p) => normalizeIp(p)).filter(Boolean);
    // Scan from rightmost (nearest upstream proxy) to leftmost for valid IP
    for (let i = parts.length - 1; i >= 0; i--) {
      if (isValidIp(parts[i])) {
        return parts[i];
      }
    }
  }

  // 3. Fallback to localhost if no proxy headers are present (local dev / testing)
  return '127.0.0.1';
}
