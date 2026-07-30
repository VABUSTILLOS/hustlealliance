#!/usr/bin/env node

/**
 * Downloads real portrait photos from randomuser.me for all Hustle Alliance
 * members and saves them as JPEG files in public/images/avatars/.
 *
 * Each member gets a deterministic, consistent portrait based on their username.
 *
 * Usage: node scripts/download-real-avatars.mjs
 */

import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = resolve(__dirname, '..', 'public', 'images', 'avatars');

// ── All members ─────────────────────────────────────────────────────────────
// Matches the member list from scripts/generate-avatars.mjs plus extra
// MemberSpotlight members

const members = [
  // Hero users (instructors + admins)
  { username: 'admin',    name: 'Admin' },
  { username: 'marcuschen', name: 'Marcus Chen' },
  { username: 'priyap',   name: 'Priya Patel' },
  { username: 'devonm',   name: 'Devon Mitchell' },
  { username: 'sarahk',   name: 'Sarah Okonkwo' },
  { username: 'jameso',   name: 'James Okafor' },
  { username: 'maya',     name: 'Maya Rodriguez' },
  { username: 'alexk',    name: 'Alex Kowalski' },
  { username: 'elenak',   name: 'Elena Kim' },
  { username: 'davidl',   name: 'David Liu' },
  { username: 'mariat',   name: 'Maria Torres' },
  { username: 'tomb',     name: 'Tom Baker' },

  // Member users (students)
  { username: 'annaw',       name: 'Anna Williams' },
  { username: 'carlosm',     name: 'Carlos Mendez' },
  { username: 'fatimaa',     name: 'Fatima Al-Rashid' },
  { username: 'ryanp',       name: 'Ryan Park' },
  { username: 'yukit',       name: 'Yuki Tanaka' },
  { username: 'oliviac',     name: 'Olivia Chen' },
  { username: 'kwamea',      name: 'Kwame Asante' },
  { username: 'sofial',      name: 'Sofia Lindqvist' },
  { username: 'rajp',        name: 'Raj Patel' },
  { username: 'hannahw',     name: 'Hannah Weiss' },
  { username: 'omarh',       name: 'Omar Hassan' },
  { username: 'lunap',       name: 'Luna Park' },
  { username: 'viktorp',     name: 'Viktor Petrov' },
  { username: 'jiwook',      name: 'Jiwoo Kim' },
  { username: 'ameliab',     name: 'Amelia Brooks' },
  { username: 'kenjin',      name: 'Kenji Nakamura' },
  { username: 'zarao',       name: 'Zara Osei' },
  { username: 'nadiap',      name: 'Nadia Petrova' },
  { username: 'leof',        name: 'Leo Fernandez' },
  { username: 'anyas',       name: 'Anya Sharma' },
  { username: 'felixb',      name: 'Félix Bauer' },
  { username: 'priyankad',   name: 'Priyanka Das' },
  { username: 'maxa',        name: 'Max Andersson' },
  { username: 'isabellem',   name: 'Isabelle Moreau' },
  { username: 'camn',        name: 'Cam Nguyen' },
  { username: 'graceo',      name: 'Grace Okafor' },
  { username: 'dmitriv',     name: 'Dmitri Volkov' },
  { username: 'meil',        name: 'Mei Lin' },
  { username: 'hasany',      name: 'Hasan Yilmaz' },
  { username: 'chiarar',     name: 'Chiara Rossi' },
  { username: 'tongw',       name: 'Tong Wei' },
  { username: 'aspenw',      name: 'Aspen Wright' },
  { username: 'karimb',      name: 'Karim Benali' },
  { username: 'miraj',       name: 'Mira Joshi' },
  { username: 'erikj',       name: 'Erik Johansson' },
  { username: 'tosina',      name: 'Tosin Adebayo' },
  { username: 'samo',        name: "Sam O'Brien" },
  { username: 'luciav',      name: 'Lucia Vargas' },
  { username: 'arjunm',      name: 'Arjun Mehta' },
  { username: 'leilah',      name: 'Leila Haddad' },
  { username: 'harukis',     name: 'Haruki Sato' },
  { username: 'noora',       name: 'Noor Ali' },
  { username: 'mateog',      name: 'Mateo Garcia' },
  { username: 'linab',       name: 'Lina Bergström' },
  { username: 'tyronej',     name: 'Tyrone Jackson' },
  { username: 'sakuray',     name: 'Sakura Yamamoto' },
  { username: 'ibrahimk',    name: 'Ibrahim Khoury' },
  { username: 'chantalm',    name: 'Chantal Mukamana' },
  { username: 'jonasm',      name: 'Jonas Mueller' },
  { username: 'aishab',      name: 'Aisha Bello' },

  // Novice users
  { username: 'taylorr',     name: 'Taylor Reed' },
  { username: 'jordanb',     name: 'Jordan Blake' },
  { username: 'rileym',      name: 'Riley Morgan' },
  { username: 'caseyk',      name: 'Casey Kim' },
  { username: 'drewp',       name: 'Drew Patterson' },
  { username: 'averys',      name: 'Avery Santos' },
  { username: 'quinnf',      name: 'Quinn Foster' },
  { username: 'morgany',     name: 'Morgan Yu' },

  // Extra MemberSpotlight members not in main seed
  { username: 'devonw',      name: 'Devon Wright' },
  { username: 'elenat',      name: 'Elena Torres' },
  { username: 'amarao',      name: 'Amara Obi' },
  { username: 'kevinl',      name: 'Kevin Li' },
  { username: 'ninak',       name: 'Nina Kapoor' },
];

// ── Gender determination ────────────────────────────────────────────────────
// Based on first name for consistent portrait assignment

const FEMALE_NAMES = new Set([
  'priya', 'sarah', 'maya', 'elena', 'maria', 'anna', 'fatima', 'yuki',
  'olivia', 'sofia', 'hannah', 'luna', 'jiwoo', 'amelia', 'zara', 'nadia',
  'anya', 'priyanka', 'isabelle', 'cam', 'grace', 'mei', 'chiara', 'aspen',
  'mira', 'lucia', 'leila', 'noor', 'lina', 'sakura', 'chantal', 'aisha',
  'taylor', 'riley', 'casey', 'avery', 'quinn', 'morgan', 'nina', 'amara',
]);

function isFemale(name) {
  const first = name.split(' ')[0].toLowerCase();
  return FEMALE_NAMES.has(first);
}

// ── URL generation ──────────────────────────────────────────────────────────

function getPortraitUrl(username, name) {
  const female = isFemale(name);
  const gender = female ? 'women' : 'men';
  // Deterministic index from username hash
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = ((hash << 5) - hash) + username.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % 100;
  return `https://randomuser.me/api/portraits/${gender}/${index}.jpg`;
}

// ── Download helper ─────────────────────────────────────────────────────────

async function download(url, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buffer = await res.arrayBuffer();
      return Buffer.from(buffer);
    } catch (err) {
      if (attempt === retries) throw err;
      console.warn(`  ⚠️  Retry ${attempt}/${retries} for ${url}: ${err.message}`);
      await new Promise(r => setTimeout(r, 500));
    }
  }
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  if (!existsSync(OUT_DIR)) {
    mkdirSync(OUT_DIR, { recursive: true });
    console.log(`📁 Created ${OUT_DIR}`);
  }

  let downloaded = 0;
  let failed = 0;
  let totalSize = 0;

  for (const { username, name } of members) {
    const url = getPortraitUrl(username, name);
    const outPath = resolve(OUT_DIR, `${username}.jpg`);
    const gender = isFemale(name) ? '♀' : '♂';

    try {
      process.stdout.write(`  ${gender} ${name.padEnd(22)} → ${username}.jpg ... `);
      const data = await download(url);
      writeFileSync(outPath, data);
      const kb = (data.length / 1024).toFixed(1);
      totalSize += data.length;
      console.log(`✅ ${kb} KB`);
      downloaded++;
    } catch (err) {
      console.error(`❌ failed: ${err.message}`);
      failed++;
    }

    // Be polite — small delay between requests
    await new Promise(r => setTimeout(r, 150));
  }

  console.log(`\n✅ Downloaded ${downloaded} avatars (${(totalSize / 1024).toFixed(1)} KB total)`);
  if (failed > 0) console.log(`⚠️  ${failed} failed`);
}

main().catch((err) => {
  console.error('❌ Failed:', err);
  process.exit(1);
});
