/**
 * Migrate mock/test users into the real database.
 *
 * Upserts every seed user (lib/seed/users.ts) as a real `User` row so demo
 * content stays attributed to stable DB records instead of ephemeral mock
 * IDs. Supabase auth is linked automatically by `getCurrentUser()` →
 * `ensureDbUser()`, which matches on `email` and stamps `authId` on first
 * real login.
 *
 * Run: `npx tsx scripts/migrate-mock-users.ts`
 */
import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../lib/generated/prisma/client';
import { allSeedUsers } from '../lib/seed/users';

const adapter = new PrismaPg({
  connectionString: (process.env.DATABASE_URL || '').replace('connect_timeout=0', 'connect_timeout=30'),
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🔁 Migrating mock/seed users into the database...');
  await prisma.$connect();

  let created = 0;
  let updated = 0;

  for (const seed of allSeedUsers) {
    const existing = await prisma.user.findUnique({ where: { email: seed.email } });
    await prisma.user.upsert({
      where: { email: seed.email },
      update: {
        name: seed.name,
        username: seed.username,
        role: seed.role,
        membershipTier: seed.membershipTier,
        avatar: seed.avatar,
        bio: seed.bio,
        headline: seed.headline,
        tags: seed.skills,
      },
      create: {
        email: seed.email,
        name: seed.name,
        username: seed.username,
        role: seed.role,
        membershipTier: seed.membershipTier,
        avatar: seed.avatar,
        bio: seed.bio,
        headline: seed.headline,
        tags: seed.skills,
      },
    });

    if (existing) updated++;
    else created++;
  }

  console.log(`✅ Done. ${created} created, ${updated} updated, ${allSeedUsers.length} total seed users.`);
  console.log('💡 Supabase auth links automatically on first login via ensureDbUser (email match → authId stamp).');
  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error('Migration failed:', err);
  await prisma.$disconnect();
  process.exit(1);
});
