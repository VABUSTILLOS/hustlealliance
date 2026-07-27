import { NextResponse } from 'next/server';
import dns from 'dns';
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
  dns.resolve6(hostname, (err6, addrs6) => {
    if (!err6 && addrs6?.length) return cb(null, addrs6[0], 6);
    dns.resolve4(hostname, (err4, addrs4) => {
      if (!err4 && addrs4?.length) return cb(null, addrs4[0], 4);
      cb(err4 || err6);
    });
  });
}

export async function GET() {
  let dns4: string | null = null;
  let dns6: string | null = null;
  try {
    const hostname = 'db.yftgdtdvmvvqyzcdntge.supabase.co';
    const r4 = await dns.promises.resolve4(hostname).catch(() => null);
    const r6 = await dns.promises.resolve6(hostname).catch(() => null);
    dns4 = r4 ? r4.join(', ') : null;
    dns6 = r6 ? r6.join(', ') : null;
  } catch {}

  const tcp5432 = await testTcp('db.yftgdtdvmvvqyzcdntge.supabase.co', 5432, 5000);

  // Test net.createConnection with custom lookup
  let netResult = 'not_tested';
  try {
    await new Promise<void>((resolve, reject) => {
      const sock = net.createConnection({
        host: 'db.yftgdtdvmvvqyzcdntge.supabase.co',
        port: 6543,
        lookup: (hostname: string, _opts: any, cb: Function) => createLookup(hostname, cb),
        timeout: 5000,
      }, () => {
        netResult = 'connected';
        sock.destroy();
        resolve();
      });
      sock.on('error', (e: any) => {
        netResult = `error: ${e.code || e.message}`;
        sock.destroy();
        resolve();
      });
      sock.on('timeout', () => {
        netResult = 'timeout';
        sock.destroy();
        resolve();
      });
    });
  } catch {}

  // Test pg Pool
  let pgResult = 'not_tested';
  try {
    const { Pool } = require('pg');
    const pool = new Pool({ connectionString: process.env.DATABASE_URL!, connectionTimeoutMillis: 5000 });
    const res = await pool.query('SELECT 1 as val');
    pgResult = `ok: ${JSON.stringify(res.rows)}`;
    await pool.end();
  } catch (e: any) {
    pgResult = `error: ${e.message || e.code}`;
  }

  return NextResponse.json({
    dns4, dns6,
    tcp5432,
    netResult,
    pgResult,
    nodeVersion: process.version,
  });
}
