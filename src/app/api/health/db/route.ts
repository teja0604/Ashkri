import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { isDatabaseConfigured } from '@/lib/env';

export async function GET() {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      {
        status: 'degraded',
        database: 'unconfigured',
        region: 'ap-southeast-1',
        message: 'DATABASE_URL is not configured in environment variables.',
      },
      { status: 200 }
    );
  }

  try {
    const startTime = performance.now();
    await prisma.$queryRaw`SELECT 1`;
    const latencyMs = Math.round(performance.now() - startTime);

    return NextResponse.json(
      {
        status: 'healthy',
        database: 'connected',
        region: 'ap-southeast-1',
        latencyMs,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    // Avoid leaking credentials, hosts, or raw stack traces in public health endpoint
    console.error('[Database Health Check Failure]', (error as Error).message);
    return NextResponse.json(
      {
        status: 'unhealthy',
        database: 'disconnected',
        region: 'ap-southeast-1',
        error: 'Unable to establish connection to PostgreSQL instance.',
      },
      { status: 503 }
    );
  }
}
