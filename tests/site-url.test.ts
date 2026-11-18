import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getCanonicalSiteUrl, DEFAULT_CANONICAL_FALLBACK } from '@/lib/site-url';

describe('getCanonicalSiteUrl', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('returns sanitized custom URL without trailing slash', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://custom-domain.com/');
    expect(getCanonicalSiteUrl()).toBe('https://custom-domain.com');
  });

  it('prepends https:// if protocol is omitted from custom URL', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'production-domain.edu');
    expect(getCanonicalSiteUrl()).toBe('https://production-domain.edu');
  });

  it('falls back to default canonical URL with deployment warning in production', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', '');
    vi.stubEnv('NODE_ENV', 'production');
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const result = getCanonicalSiteUrl();
    expect(result).toBe(DEFAULT_CANONICAL_FALLBACK);
    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it('throws fatal error in production when STRICT_CANONICAL_URL is true', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', '');
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('STRICT_CANONICAL_URL', 'true');

    expect(() => getCanonicalSiteUrl()).toThrowError(
      /FATAL: NEXT_PUBLIC_SITE_URL is required in production/
    );
  });

  it('returns default fallback without error in non-production environments', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', '');
    vi.stubEnv('NODE_ENV', 'development');

    expect(getCanonicalSiteUrl()).toBe(DEFAULT_CANONICAL_FALLBACK);
  });
});
