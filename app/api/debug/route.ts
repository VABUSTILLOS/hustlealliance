import { NextResponse } from 'next/server';
import dns from 'dns/promises';
import net from 'net';

function testTcp(host: string, port: number, timeout = 5000): Promise<string> {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(timeout);
    socket.on('connect', () => { socket.destroy(); resolve('connected'); });
    socket.on('timeout', () => { socket.destroy(); resolve('timeout'); });
    socket.on('error', (e: any) => { socket.destroy(); resolve(`error: ${e.code || e.message}`); });
    socket.connect(port, host);
  });
}

function createLookup(hostname: string, cb: Function) {
  dns.resolve6(hostname).then((addrs6) => {
    if (addrs6?.length) return cb(null, addrs6[0], 6);
    return dns.resolve4(hostname).then((addrs4) => {
      if (addrs4?.length) return cb(null, addrs4[0], 4);
      cb(new Error('No addresses found'));
    });
  }).catch((err6: any) => {
    dns.resolve4(hostname).then((addrs4) => {
      if (addrs4?.length) return cb(null, addrs4[0], 4);
      cb(err6);
    }).catch((err4: any) => cb(err4));
  });
}

export async function GET() {
  const dbUrl = process.env.DATABASE_URL || '';
  const redacted = dbUrl.replace(/\/\/[^:]+:[^@]+@/, '//[USER]:[REDACTED]@');

  let dns4: string | null = null;
  let dns6: string | null = null;

  try {
    const hostname = 'db.yftgdtdvmvvqyzcdntge.supabase.co';
    const r4 = await dns.resolve4(hostname).catch(() => null);
    const r6 = await dns.resolve6(hostname).catch(() => null);
    dns4 = r4 ? r4.join(', ') : null;
    dns6 = r6 ? r6.join(', ') : null;
  } catch {}

  const tcp5432 = await testTcp('db.yftgdtdvmvvqyzcdntge.supabase.co', 5432, 5000);
  const tcp6543 = await testTcp('db.yftgdtdvmvvqyzcdntge.supabase.co', 6543, 5000);

  // Test pg Pool with custom lookup
  let pgResult = 'not_tested';
  try {
    const { Pool } = require('pg');
    const pool = new Pool({
      connectionString: dbUrl,
      lookup: (hostname: string, _opts: any, cb: Function) => createLookup(hostname, cb),
      connectionTimeoutMillis: 5000,
    });
    const res = await pool.query('SELECT 1 as val');
    pgResult = `ok: ${JSON.stringify(res.rows)}`;
    await pool.end();
  } catch (e: any) {
    pgResult = `error: ${e.message || e.code}`;
  }

  return NextResponse.json({
    hasDbUrl: !!dbUrl,
    port: dbUrl.match(/:(\d+)\//)?.[1] || 'unknown',
    dns4, dns6,
    tcp5432, tcp6543,
    pgResult,
    nodeVersion: process.version,
  });
}
