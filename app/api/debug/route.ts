import { NextResponse } from 'next/server';
import dns from 'dns';
import { requireAdmin, authErrorResponse } from '@/lib/auth/guard';

// Pooler diagnostic — credentials come from env, never hardcoded.
const POOLER_HOST = process.env.POOLER_HOST || 'aws-0-us-east-1.pooler.supabase.com';
const POOLER_PORT = parseInt(process.env.POOLER_PORT || '6543', 10);
const POOLER_USER = process.env.POOLER_USER || '';
const POOLER_PASSWORD = process.env.POOLER_PASSWORD || '';
const POOLER_DB = process.env.POOLER_DB || 'postgres';

export async function GET() {
  try {
    await requireAdmin();
  } catch (err) {
    return authErrorResponse(err);
  }

  // DNS check on pooler host (should be IPv4 on Vercel)
  let dns4: string | null = null;
  let dns6: string | null = null;
  try {
    const r4 = await dns.promises.resolve4(POOLER_HOST).catch(() => null);
    const r6 = await dns.promises.resolve6(POOLER_HOST).catch(() => null);
    dns4 = r4 ? r4.join(', ') : null;
    dns6 = r6 ? r6.join(', ') : null;
  } catch {}

  // pg to pooler (IPv4)
  let pgResult = 'not_tested';
  let tableCount: number | null = null;
  if (POOLER_USER && POOLER_PASSWORD) {
    try {
      const { Pool } = require('pg');
      const pool = new Pool({
        host: POOLER_HOST,
        port: POOLER_PORT,
        user: POOLER_USER,
        password: POOLER_PASSWORD,
        database: POOLER_DB,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 8000,
      });
      const res = await pool.query('SELECT 1 as val');
      pgResult = `ok: ${JSON.stringify(res.rows)}`;
      const tc = await pool.query("SELECT count(*) as c FROM information_schema.tables WHERE table_schema = 'public'");
      tableCount = parseInt(tc.rows[0].c);
      await pool.end();
    } catch (e: any) {
      pgResult = `error: ${e.message || e.code}`;
    }
  } else {
    pgResult = 'skipped (POOLER_USER/POOLER_PASSWORD not set)';
  }

  // Check if env DATABASE_URL uses pooler
  const dbUrl = process.env.DATABASE_URL || 'NOT SET';

  return NextResponse.json({
    dns4,
    dns6,
    pgResult,
    tableCount,
    nodeVersion: process.version,
    dbUrlPreview: dbUrl ? dbUrl.substring(0, 80) + '...' : 'NONE',
  });
}
