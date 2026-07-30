#!/usr/bin/env node

/**
 * Updates all user avatars in the database to use local SVG paths.
 *
 * Usage: node scripts/update-avatars-db.mjs
 */

import { PrismaClient } from '../lib/generated/prisma/client/index.js';
import { PrismaPg } from '@prisma/adapter-pg';

// Map usernames to SVG paths
const usernameToPath = new Map([
  ['admin', '/images/avatars/admin.svg'],
  ['marcuschen', '/images/avatars/marcuschen.svg'],
  ['priyap', '/images/avatars/priyap.svg'],
  ['devonm', '/images/avatars/devonm.svg'],
  ['sarahk', '/images/avatars/sarahk.svg'],
  ['jameso', '/images/avatars/jameso.svg'],
  ['maya', '/images/avatars/maya.svg'],
  ['alexk', '/images/avatars/alexk.svg'],
  ['elenak', '/images/avatars/elenak.svg'],
  ['davidl', '/images/avatars/davidl.svg'],
  ['mariat', '/images/avatars/mariat.svg'],
  ['tomb', '/images/avatars/tomb.svg'],
  ['annaw', '/images/avatars/annaw.svg'],
  ['carlosm', '/images/avatars/carlosm.svg'],
  ['fatimaa', '/images/avatars/fatimaa.svg'],
  ['ryanp', '/images/avatars/ryanp.svg'],
  ['yukit', '/images/avatars/yukit.svg'],
  ['oliviac', '/images/avatars/oliviac.svg'],
  ['kwamea', '/images/avatars/kwamea.svg'],
  ['sofial', '/images/avatars/sofial.svg'],
  ['rajp', '/images/avatars/rajp.svg'],
  ['hannahw', '/images/avatars/hannahw.svg'],
  ['omarh', '/images/avatars/omarh.svg'],
  ['lunap', '/images/avatars/lunap.svg'],
  ['viktorp', '/images/avatars/viktorp.svg'],
  ['jiwook', '/images/avatars/jiwook.svg'],
  ['ameliab', '/images/avatars/ameliab.svg'],
  ['kenjin', '/images/avatars/kenjin.svg'],
  ['zarao', '/images/avatars/zarao.svg'],
  ['nadiap', '/images/avatars/nadiap.svg'],
  ['leof', '/images/avatars/leof.svg'],
  ['anyas', '/images/avatars/anyas.svg'],
  ['felixb', '/images/avatars/felixb.svg'],
  ['priyankad', '/images/avatars/priyankad.svg'],
  ['maxa', '/images/avatars/maxa.svg'],
  ['isabellem', '/images/avatars/isabellem.svg'],
  ['camn', '/images/avatars/camn.svg'],
  ['graceo', '/images/avatars/graceo.svg'],
  ['dmitriv', '/images/avatars/dmitriv.svg'],
  ['meil', '/images/avatars/meil.svg'],
  ['hasany', '/images/avatars/hasany.svg'],
  ['chiarar', '/images/avatars/chiarar.svg'],
  ['tongw', '/images/avatars/tongw.svg'],
  ['aspenw', '/images/avatars/aspenw.svg'],
  ['karimb', '/images/avatars/karimb.svg'],
  ['miraj', '/images/avatars/miraj.svg'],
  ['erikj', '/images/avatars/erikj.svg'],
  ['tosina', '/images/avatars/tosina.svg'],
  ['samo', '/images/avatars/samo.svg'],
  ['luciav', '/images/avatars/luciav.svg'],
  ['arjunm', '/images/avatars/arjunm.svg'],
  ['leilah', '/images/avatars/leilah.svg'],
  ['harukis', '/images/avatars/harukis.svg'],
  ['noora', '/images/avatars/noora.svg'],
  ['mateog', '/images/avatars/mateog.svg'],
  ['linab', '/images/avatars/linab.svg'],
  ['tyronej', '/images/avatars/tyronej.svg'],
  ['sakuray', '/images/avatars/sakuray.svg'],
  ['ibrahimk', '/images/avatars/ibrahimk.svg'],
  ['chantalm', '/images/avatars/chantalm.svg'],
  ['jonasm', '/images/avatars/jonasm.svg'],
  ['aishab', '/images/avatars/aishab.svg'],
  ['taylorr', '/images/avatars/taylorr.svg'],
  ['jordanb', '/images/avatars/jordanb.svg'],
  ['rileym', '/images/avatars/rileym.svg'],
  ['caseyk', '/images/avatars/caseyk.svg'],
  ['drewp', '/images/avatars/drewp.svg'],
  ['averys', '/images/avatars/averys.svg'],
  ['quinnf', '/images/avatars/quinnf.svg'],
  ['morgany', '/images/avatars/morgany.svg'],
]);

async function main() {
  const adapter = new PrismaPg({
    connectionString: (process.env.DATABASE_URL || '').replace('connect_timeout=0', 'connect_timeout=30'),
  });
  const prisma = new PrismaClient({ adapter });

  console.log('🔄 Updating user avatars in database...');

  let updated = 0;
  let skipped = 0;

  for (const [username, newPath] of usernameToPath) {
    const user = await prisma.user.findUnique({ where: { username }, select: { id: true, avatar: true } });
    if (!user) {
      skipped++;
      continue;
    }
    // Only update if it's still using an external URL
    if (user.avatar && (user.avatar.includes('dicebear.com') || user.avatar.includes('unsplash.com') || user.avatar !== newPath)) {
      await prisma.user.update({ where: { username }, data: { avatar: newPath } });
      updated++;
    }
  }

  console.log(`✅ Updated ${updated} user avatars, skipped ${skipped} (not found)`);
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error('❌ Failed:', err);
  process.exit(1);
});
