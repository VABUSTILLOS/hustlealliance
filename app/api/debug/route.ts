import { NextResponse } from 'next/server';

export async function GET() {
  const dbUrl = process.env.DATABASE_URL || '';
  // Redact password for safety
  const redacted = dbUrl.replace(/\/\/[^:]+:[^@]+@/, '//[USER]:[REDACTED]@');
  return NextResponse.json({
    hasDbUrl: !!dbUrl,
    port: dbUrl.match(/:(\d+)\//)?.[1] || 'unknown',
    prefix: dbUrl.substring(0, 30),
    redacted,
    nodeVersion: process.version,
  });
}
