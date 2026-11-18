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

  it('normalizes valid custom URL by stripping trailing slash', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://custom-domain.com/');
    vi.stubEnv('STRICT_CANONICAL_URL', 'false');
    expect(getCanonicalSiteUrl()).toBe('https://custom-domain.com');
  });

  it('prepends https:// when protocol is omitted from valid domain', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'production-domain.edu');
    vi.stubEnv('STRICT_CANONICAL_URL', 'false');
    expect(getCanonicalSiteUrl()).toBe('https://production-domain.edu');
  });

  it('accepts localhost with custom port for local development', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'http://localhost:3000/');
    vi.stubEnv('STRICT_CANONICAL_URL', 'false');
    expect(getCanonicalSiteUrl()).toBe('http://localhost:3000');
  });

  it('rejects unsupported protocols (e.g. ftp://) in strict mode with fatal error', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'ftp://files.example.com');
    vi.stubEnv('STRICT_CANONICAL_URL', 'true');
    vi.stubEnv('NODE_ENV', 'production');

    expect(() => getCanonicalSiteUrl()).toThrowError(/Unsupported protocol/);
  });

  it('rejects malformed domains in strict mode', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://invalid_no_dot');
    vi.stubEnv('STRICT_CANONICAL_URL', 'true');
    vi.stubEnv('NODE_ENV', 'production');

    expect(() => getCanonicalSiteUrl()).toThrowError(/FATAL: Invalid NEXT_PUBLIC_SITE_URL/);
  });

  it('falls back to default canonical URL with deployment warning in production when non-strict', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', '');
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('STRICT_CANONICAL_URL', 'false');
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const result = getCanonicalSiteUrl();
    expect(result).toBe(DEFAULT_CANONICAL_FALLBACK);
    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it('throws fatal error in production when STRICT_CANONICAL_URL is true and site URL is missing', () => {
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
    vi.stubEnv('STRICT_CANONICAL_URL', 'false');

    expect(getCanonicalSiteUrl()).toBe(DEFAULT_CANONICAL_FALLBACK);
  });
});
