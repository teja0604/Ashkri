/**
 * Canonical Site URL Resolution Utility
 * 
 * Manages resolution, normalization, and strict validation of the canonical public base URL
 * for SEO artifacts (sitemap.ts, robots.ts, OpenGraph metadata).
 * 
 * Acceptance Rules:
 * 1. Normalize valid URLs (strip trailing slashes, enforce http/https protocol).
 * 2. Reject invalid URLs (throw in strict mode or production; warn in development).
 * 3. In production, warn if missing to prevent silent publishing; fail if STRICT_CANONICAL_URL=true.
 */

export const DEFAULT_CANONICAL_FALLBACK = 'https://ashkri.com';

export function getCanonicalSiteUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const isProduction = process.env.NODE_ENV === 'production';
  const isStrict = process.env.STRICT_CANONICAL_URL === 'true';

  if (envUrl && envUrl.trim().length > 0) {
    let sanitized = envUrl.trim().replace(/\/+$/, '');
    const hasProtocol = /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(sanitized);
    if (!hasProtocol) {
      sanitized = `https://${sanitized}`;
    }

    try {
      const parsed = new URL(sanitized);
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        throw new Error(`Unsupported protocol "${parsed.protocol}". Only http: and https: are supported.`);
      }
      if (!parsed.hostname || !parsed.hostname.includes('.')) {
        // Must have at least a dot unless localhost
        if (parsed.hostname !== 'localhost') {
          throw new Error(`Invalid hostname "${parsed.hostname}".`);
        }
      }

      // Return normalized base without trailing slash
      const pathname = parsed.pathname === '/' ? '' : parsed.pathname.replace(/\/+$/, '');
      return `${parsed.protocol}//${parsed.host}${pathname}`;
    } catch (err) {
      const errorMsg = `Invalid NEXT_PUBLIC_SITE_URL ("${envUrl}"): ${(err as Error).message}`;
      if (isStrict || isProduction) {
        throw new Error(`FATAL: ${errorMsg}`);
      }
      console.warn(`[CONFIG WARNING] ${errorMsg}. Falling back to "${DEFAULT_CANONICAL_FALLBACK}".`);
      return DEFAULT_CANONICAL_FALLBACK;
    }
  }

  // Handle missing environment configuration
  if (isProduction) {
    if (isStrict) {
      throw new Error(
        'FATAL: NEXT_PUBLIC_SITE_URL is required in production when STRICT_CANONICAL_URL=true. ' +
        'Set NEXT_PUBLIC_SITE_URL in your hosting provider environment variables before building.'
      );
    }

    // Prominent build/runtime warning to prevent silent publishing of unverified domain
    console.warn(
      '\n\x1b[33m%s\x1b[0m\n\x1b[33m%s\x1b[0m\n\x1b[33m%s\x1b[0m\n',
      '⚠️  [DEPLOYMENT WARNING: CANONICAL DOMAIN NOT CONFIGURED]',
      `   NEXT_PUBLIC_SITE_URL is undefined. Canonical sitemap and robots are falling back to "${DEFAULT_CANONICAL_FALLBACK}".`,
      '   Configure NEXT_PUBLIC_SITE_URL in your hosting provider to ensure verified search engine indexing.'
    );
  }

  return DEFAULT_CANONICAL_FALLBACK;
}
