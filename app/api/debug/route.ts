import { NextResponse } from 'next/server';
import dns from 'dns';
import net from 'net';

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

  // Direct IPv6 connection
  let directIpv6 = 'not_tested';
  try {
    await new Promise<void>((resolve) => {
      const sock = net.createConnection({ host: '2600:1f18:45ac:6d00:5c76:f39b:a986:f215', port: 6543, timeout: 5000 }, () => {
        directIpv6 = 'connected';
        sock.destroy();
        resolve();
      });
      sock.on('error', (e: any) => { directIpv6 = `error: ${e.code || e.message}`; sock.destroy(); resolve(); });
      sock.on('timeout', () => { directIpv6 = 'timeout'; sock.destroy(); resolve(); });
    });
  } catch {}

  // Direct IPv6 + SSL
  let directIpv6Tls = 'not_tested';
  try {
    const tls = require('tls');
    await new Promise<void>((resolve) => {
      const sock = tls.connect({ host: '2600:1f18:45ac:6d00:5c76:f39b:a986:f215', port: 6543, rejectUnauthorized: false, timeout: 5000 }, () => {
        directIpv6Tls = 'connected';
        sock.destroy();
        resolve();
      });
      sock.on('error', (e: any) => { directIpv6Tls = `error: ${e.code || e.message}`; sock.destroy(); resolve(); });
      sock.on('timeout', () => { directIpv6Tls = 'timeout'; sock.destroy(); resolve(); });
    });
  } catch {}

  // pg with IPv6 address directly in connection string
  let pgDirectIpv6 = 'not_tested';
  try {
    const { Pool } = require('pg');
    const url = process.env.DATABASE_URL!;
    // Replace hostname with IPv6
    const ipv6Url = url.replace('db.yftgdtdvmvvqyzcdntge.supabase.co', '2600:1f18:45ac:6d00:5c76:f39b:a986:f215');
    const pool = new Pool({ connectionString: ipv6Url, connectionTimeoutMillis: 5000 });
    const res = await pool.query('SELECT 1 as val');
    pgDirectIpv6 = `ok: ${JSON.stringify(res.rows)}`;
    await pool.end();
  } catch (e: any) {
    pgDirectIpv6 = `error: ${e.message || e.code}`;
  }

  // pg with hostaddr parameter
  let pgHostaddr = 'not_tested';
  try {
    const { Pool } = require('pg');
    const pool = new Pool({
      host: 'db.yftgdtdvmvvqyzcdntge.supabase.co',
      port: 6543,
      user: 'app_user',
      password: 'HustleAlliance2024!',
      database: 'postgres',
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 5000,
    });
    const res = await pool.query('SELECT 1 as val');
    pgHostaddr = `ok: ${JSON.stringify(res.rows)}`;
    await pool.end();
  } catch (e: any) {
    pgHostaddr = `error: ${e.message || e.code}`;
  }

  return NextResponse.json({ dns4, dns6, directIpv6, directIpv6Tls, pgDirectIpv6, pgHostaddr, nodeVersion: process.version });
}
