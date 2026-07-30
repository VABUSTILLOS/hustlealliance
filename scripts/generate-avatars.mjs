#!/usr/bin/env node

/**
 * Generates compressed SVG avatars for all Hustle Alliance members.
 *
 * Each avatar is a circular SVG with the member's initials on a colored
 * background, then compressed with SVGO.
 *
 * Usage: node scripts/generate-avatars.mjs
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { optimize } from 'svgo';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = resolve(__dirname, '..', 'public', 'images', 'avatars');

// ── All members ──────────────────────────────────────────────────────────────
// Extracted from lib/seed/users.ts and prisma/seed.ts
// Format: { username, name, color }

const members = [
  // Hero users (instructors + admins)
  { username: 'admin',    name: 'Admin',           color: 'dc2626' },
  { username: 'marcuschen', name: 'Marcus Chen',    color: 'b45309' },
  { username: 'priyap',   name: 'Priya Patel',     color: 'db2777' },
  { username: 'devonm',   name: 'Devon Mitchell',  color: '0891b2' },
  { username: 'sarahk',   name: 'Sarah Okonkwo',   color: '7c3aed' },
  { username: 'jameso',   name: 'James Okafor',    color: 'dc2626' },
  { username: 'maya',     name: 'Maya Rodriguez',  color: '9333ea' },
  { username: 'alexk',    name: 'Alex Kowalski',   color: 'ea580c' },
  { username: 'elenak',   name: 'Elena Kim',       color: '2563eb' },
  { username: 'davidl',   name: 'David Liu',       color: '0d9488' },
  { username: 'mariat',   name: 'Maria Torres',    color: 'ca8a04' },
  { username: 'tomb',     name: 'Tom Baker',       color: '4f46e5' },

  // Member users (students)
  { username: 'annaw',       name: 'Anna Williams',      color: 'db2777' },
  { username: 'carlosm',     name: 'Carlos Mendez',      color: '059669' },
  { username: 'fatimaa',     name: 'Fatima Al-Rashid',   color: 'b45309' },
  { username: 'ryanp',       name: 'Ryan Park',          color: '0891b2' },
  { username: 'yukit',       name: 'Yuki Tanaka',        color: 'c026d3' },
  { username: 'oliviac',     name: 'Olivia Chen',        color: 'e11d48' },
  { username: 'kwamea',      name: 'Kwame Asante',       color: '65a30d' },
  { username: 'sofial',      name: 'Sofia Lindqvist',    color: '0ea5e9' },
  { username: 'rajp',        name: 'Raj Patel',          color: 'f97316' },
  { username: 'hannahw',     name: 'Hannah Weiss',       color: 'a855f7' },
  { username: 'omarh',       name: 'Omar Hassan',        color: '84cc16' },
  { username: 'lunap',       name: 'Luna Park',          color: 'd946ef' },
  { username: 'viktorp',     name: 'Viktor Petrov',      color: '64748b' },
  { username: 'jiwook',      name: 'Jiwoo Kim',          color: 'ec4899' },
  { username: 'ameliab',     name: 'Amelia Brooks',      color: '06b6d4' },
  { username: 'kenjin',      name: 'Kenji Nakamura',     color: '14b8a6' },
  { username: 'zarao',       name: 'Zara Osei',          color: 'f43f5e' },
  { username: 'nadiap',      name: 'Nadia Petrova',      color: '8b5cf6' },
  { username: 'leof',        name: 'Leo Fernandez',      color: 'ca8a04' },
  { username: 'anyas',       name: 'Anya Sharma',        color: '7c3aed' },
  { username: 'felixb',      name: 'Félix Bauer',        color: '78716c' },
  { username: 'priyankad',   name: 'Priyanka Das',       color: 'db2777' },
  { username: 'maxa',        name: 'Max Andersson',      color: '0284c7' },
  { username: 'isabellem',   name: 'Isabelle Moreau',    color: 'be185d' },
  { username: 'camn',        name: 'Cam Nguyen',         color: 'ea580c' },
  { username: 'graceo',      name: 'Grace Okafor',       color: '22c55e' },
  { username: 'dmitriv',     name: 'Dmitri Volkov',      color: '334155' },
  { username: 'meil',        name: 'Mei Lin',            color: 'd946ef' },
  { username: 'hasany',      name: 'Hasan Yilmaz',       color: 'b91c1c' },
  { username: 'chiarar',     name: 'Chiara Rossi',       color: 'c084fc' },
  { username: 'tongw',       name: 'Tong Wei',           color: '0ea5e9' },
  { username: 'aspenw',      name: 'Aspen Wright',       color: '84cc16' },
  { username: 'karimb',      name: 'Karim Benali',       color: '92400e' },
  { username: 'miraj',       name: 'Mira Joshi',         color: 'a21caf' },
  { username: 'erikj',       name: 'Erik Johansson',     color: '0369a1' },
  { username: 'tosina',      name: 'Tosin Adebayo',      color: '16a34a' },
  { username: 'samo',        name: "Sam O'Brien",        color: '0d9488' },
  { username: 'luciav',      name: 'Lucia Vargas',       color: 'ec4899' },
  { username: 'arjunm',      name: 'Arjun Mehta',        color: '0d9488' },
  { username: 'leilah',      name: 'Leila Haddad',       color: 'b45309' },
  { username: 'harukis',     name: 'Haruki Sato',        color: '2563eb' },
  { username: 'noora',       name: 'Noor Ali',           color: '9333ea' },
  { username: 'mateog',      name: 'Mateo Garcia',       color: 'dc2626' },
  { username: 'linab',       name: 'Lina Bergström',     color: '059669' },
  { username: 'tyronej',     name: 'Tyrone Jackson',     color: 'ea580c' },
  { username: 'sakuray',     name: 'Sakura Yamamoto',    color: 'db2777' },
  { username: 'ibrahimk',    name: 'Ibrahim Khoury',     color: '78716c' },
  { username: 'chantalm',    name: 'Chantal Mukamana',   color: 'ca8a04' },
  { username: 'jonasm',      name: 'Jonas Mueller',      color: '0284c7' },
  { username: 'aishab',      name: 'Aisha Bello',        color: '7c3aed' },

  // Novice users
  { username: 'taylorr',     name: 'Taylor Reed',        color: '94a3b8' },
  { username: 'jordanb',     name: 'Jordan Blake',       color: '94a3b8' },
  { username: 'rileym',      name: 'Riley Morgan',       color: '94a3b8' },
  { username: 'caseyk',      name: 'Casey Kim',          color: '94a3b8' },
  { username: 'drewp',       name: 'Drew Patterson',     color: '94a3b8' },
  { username: 'averys',      name: 'Avery Santos',       color: '94a3b8' },
  { username: 'quinnf',      name: 'Quinn Foster',       color: '94a3b8' },
  { username: 'morgany',     name: 'Morgan Yu',          color: '94a3b8' },
];

// ── SVG template ─────────────────────────────────────────────────────────────

function getInitials(name) {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function generateSvg(username, name, color) {
  const initials = getInitials(name);
  const fill = `#${color}`;
  const textColor = '#ffffff';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <circle cx="50" cy="50" r="50" fill="${fill}"/>
  <text x="50" y="50" text-anchor="middle" dominant-baseline="central"
        font-family="system-ui,-apple-system,sans-serif" font-weight="600"
        font-size="36" fill="${textColor}" letter-spacing="1">
    ${initials}
  </text>
</svg>`;
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  if (!existsSync(OUT_DIR)) {
    mkdirSync(OUT_DIR, { recursive: true });
    console.log(`📁 Created ${OUT_DIR}`);
  }

  let generated = 0;
  let totalOriginal = 0;
  let totalCompressed = 0;

  for (const { username, name, color } of members) {
    const rawSvg = generateSvg(username, name, color);
    totalOriginal += Buffer.byteLength(rawSvg, 'utf8');

    const result = optimize(rawSvg, {
      multipass: true,
      plugins: [
        'preset-default',
        'removeDimensions',
        'removeScripts',
        'removeStyleElement',
        { name: 'removeAttrs', params: { attrs: '(data-*)' } },
      ],
    });

    const compressed = result.data;
    totalCompressed += Buffer.byteLength(compressed, 'utf8');

    const outPath = resolve(OUT_DIR, `${username}.svg`);
    writeFileSync(outPath, compressed, 'utf8');
    generated++;
  }

  const reduction = totalOriginal > 0
    ? ((1 - totalCompressed / totalOriginal) * 100).toFixed(1)
    : 0;

  console.log(`✅ Generated ${generated} avatars in ${OUT_DIR}`);
  console.log(`📦 ${(totalOriginal / 1024).toFixed(1)} KB → ${(totalCompressed / 1024).toFixed(1)} KB (${reduction}% smaller)`);
}

main().catch((err) => {
  console.error('❌ Failed:', err);
  process.exit(1);
});
