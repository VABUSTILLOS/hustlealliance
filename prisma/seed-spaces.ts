/**
 * Seed real DB-backed Spaces (CommunityGroup rows with kind=SPACE).
 *
 * Migrates the 10 curated spaces from lib/data/spaces.ts into the database so
 * member counts and membership are real, replacing the localStorage-only
 * simulation. Demo posts referencing a space by slug keep working because the
 * slug is preserved.
 *
 * Run: `npx tsx prisma/seed-spaces.ts`
 */
import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../lib/generated/prisma/client';
import { spaces } from '../lib/data/spaces';

const adapter = new PrismaPg({
  connectionString: (process.env.DATABASE_URL || '').replace('connect_timeout=0', 'connect_timeout=30'),
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌌 Seeding Spaces...');
  await prisma.$connect();

  // Owner: the platform admin. Spaces are platform-curated.
  const admin = await prisma.user.findUnique({ where: { email: 'admin@hustlealliance.com' } });
  if (!admin) {
    console.error('❌ admin@hustlealliance.com not found. Run `npm run db:seed` first.');
    process.exit(1);
  }

  let created = 0;
  let updated = 0;

  for (const space of spaces) {
    const existing = await prisma.communityGroup.findUnique({ where: { slug: space.slug } });
    await prisma.communityGroup.upsert({
      where: { slug: space.slug },
      update: {
        name: space.name,
        description: space.description,
        memberCount: space.memberCount,
        coverImage: space.image,
        kind: 'SPACE',
      },
      create: {
        name: space.name,
        slug: space.slug,
        description: space.description,
        kind: 'SPACE',
        memberCount: space.memberCount,
        coverImage: space.image,
        avatar: space.image,
        visibility: 'PUBLIC',
        creatorId: admin.id,
        members: {
          create: {
            userId: admin.id,
            role: 'OWNER',
            status: 'ACTIVE',
          },
        },
      },
    });

    if (existing) updated++;
    else created++;
  }

  console.log(`✅ Done. ${created} spaces created, ${updated} updated, ${spaces.length} total.`);
  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error('Seeding failed:', err);
  await prisma.$disconnect();
  process.exit(1);
});
