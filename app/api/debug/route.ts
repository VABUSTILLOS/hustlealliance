import { NextResponse } from 'next/server';
import dns from 'dns/promises';

export async function GET() {
  const dbUrl = process.env.DATABASE_URL || '';
  const redacted = dbUrl.replace(/\/\/[^:]+:[^@]+@/, '//[USER]:[REDACTED]@');

  let dns4: string | null = null;
  let dns6: string | null = null;
  let dnsError: string | null = null;

  try {
    const hostname = 'db.yftgdtdvmvvqyzcdntge.supabase.co';
    const results4 = await dns.resolve4(hostname).catch(() => null);
    const results6 = await dns.resolve6(hostname).catch(() => null);
    dns4 = results4 ? results4.join(', ') : null;
    dns6 = results6 ? results6.join(', ') : null;
  } catch (e: any) {
    dnsError = e.message;
  }

  return NextResponse.json({
    hasDbUrl: !!dbUrl,
    port: dbUrl.match(/:(\d+)\//)?.[1] || 'unknown',
    redacted,
    dns4,
    dns6,
    dnsError,
    nodeVersion: process.version,
  });
}
