import { NextResponse } from 'next/server';
import { isDatabaseConfigured } from '@/lib/env';

export async function GET() {
  return NextResponse.json(
    {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'ASHKRI Academic Solutions Backend Engine',
      environment: process.env.NODE_ENV,
      region: 'ap-southeast-1',
      databaseConfigured: isDatabaseConfigured(),
    },
    { status: 200 }
  );
}
