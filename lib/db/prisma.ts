import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@/lib/generated/prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

const createPrismaClient = () => {
  const { Pool } = require('pg');
  const connectionString = process.env.DATABASE_URL!;
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

export const prisma = globalForPrisma.prisma || createPrismaClient();

globalForPrisma.prisma = prisma;

export default prisma;
