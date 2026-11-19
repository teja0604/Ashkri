import { describe, it, expect, vi } from 'vitest';
import { GET as getAppHealth } from '@/app/api/health/route';
import { GET as getDbHealth } from '@/app/api/health/db/route';

describe('Health Check Endpoints', () => {
  it('GET /api/health returns healthy status with environment info and ap-southeast-1 region', async () => {
    const res = await getAppHealth();
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.status).toBe('healthy');
    expect(body.region).toBe('ap-southeast-1');
    expect(body.service).toBe('ASHKRI Academic Solutions Backend Engine');
    expect(body.timestamp).toBeDefined();
  });

  it('GET /api/health/db safely handles unconfigured database without exposing credentials', async () => {
    const res = await getDbHealth();
    // When DATABASE_URL is not set or placeholder, returns 200 with status 'degraded'
    const body = await res.json();
    expect(body.region).toBe('ap-southeast-1');
    expect(body.status).toBeDefined();
    // Ensures no connection string, username, or password is leaked
    expect(JSON.stringify(body)).not.toContain('postgresql://');
    expect(JSON.stringify(body)).not.toContain('password');
  });
});
