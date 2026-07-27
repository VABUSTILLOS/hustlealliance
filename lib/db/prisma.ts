import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@/lib/generated/prisma/client';
import dns from 'dns';
import net from 'net';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// Vercel functions use getaddrinfo which can't resolve IPv6-only hostnames.
// We override DNS lookup to try resolve6 first, then fall back to resolve4.
function createLookup(hostname: string, cb: Function) {
  dns.resolve6(hostname, (err6, addrs6) => {
    if (!err6 && addrs6?.length) {
      return cb(null, addrs6[0], 6);
    }
    dns.resolve4(hostname, (err4, addrs4) => {
      if (!err4 && addrs4?.length) {
        return cb(null, addrs4[0], 4);
      }
      cb(err4 || err6);
    });
  });
}

const createPrismaClient = () => {
  const { Pool } = require('pg');
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL!,
    lookup: (hostname: string, _opts: any, cb: Function) => createLookup(hostname, cb),
  });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
};

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
