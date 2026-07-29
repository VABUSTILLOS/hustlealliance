import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@/lib/generated/prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

const createPrismaClient = () => {
  const { Pool } = require('pg');
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set');
  }
  // Add connect_timeout to avoid hanging on cold starts
  const urlWithTimeout = connectionString.includes('?')
    ? `${connectionString}&connect_timeout=10`
    : `${connectionString}?connect_timeout=10`;
  const pool = new Pool({
    connectionString: urlWithTimeout,
    max: 1, // single connection per serverless function instance
    connectionTimeoutMillis: 10000, // fail fast (10s) instead of hanging
    idleTimeoutMillis: 30000,
  });
  pool.on('error', (err: Error) => {
    console.error('[Prisma] Unexpected pool error:', err.message);
  });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
};

let _prisma: PrismaClient | undefined;

// Lazy initialization: PrismaClient is only created on first access, not at
// import time. This prevents build-time crashes when DATABASE_URL is unset.
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop: string | symbol, receiver: unknown) {
    if (!_prisma) {
      _prisma = globalForPrisma.prisma || createPrismaClient();
      globalForPrisma.prisma = _prisma;
    }
    return Reflect.get(_prisma as object, prop, receiver);
  },
});

export default prisma;
