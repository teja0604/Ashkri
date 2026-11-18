/**
 * Canonical Site URL Resolution Utility
 * 
 * Manages resolution and strict validation of the canonical public base URL
 * for SEO artifacts (sitemap.ts, robots.ts, OpenGraph metadata).
 * 
 * Safety Policy:
 * - Sanitizes trailing slashes and validates HTTP/HTTPS protocol.
 * - In production environments, alerts with a prominent deployment warning if
 *   NEXT_PUBLIC_SITE_URL is omitted to prevent silent misconfiguration.
 * - If STRICT_CANONICAL_URL=true, throws a build-halting error to enforce
 *   explicit environment configuration in production CI/CD pipelines.
 */

export const DEFAULT_CANONICAL_FALLBACK = 'https://ashkri.com';

export function getCanonicalSiteUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (envUrl && envUrl.trim().length > 0) {
    let sanitized = envUrl.trim().replace(/\/+$/, '');
    if (!/^https?:\/\//i.test(sanitized)) {
      sanitized = `https://${sanitized}`;
    }
    return sanitized;
  }

  // Handle missing environment configuration
  const isProduction = process.env.NODE_ENV === 'production';
  const isStrict = process.env.STRICT_CANONICAL_URL === 'true';

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

