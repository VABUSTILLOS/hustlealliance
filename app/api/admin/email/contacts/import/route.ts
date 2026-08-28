import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { requireAdmin, authErrorResponse } from '@/lib/auth/guard';

/** Minimal CSV line splitter supporting double-quoted fields with embedded commas/quotes. */
function parseCsvLine(line: string): string[] {
  const fields: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (inQuotes) {
      if (char === '"' && line[i + 1] === '"') {
        current += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        current += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ',') {
      fields.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  fields.push(current);
  return fields;
}

// POST /api/admin/email/contacts/import
// Body: raw CSV text with header `email,name?,tags?` (tags pipe- or comma-separated).
// Existing users have their tags merged; unknown emails become minimal STUDENT users.
export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const text = await request.text();
    const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length === 0) {
      return NextResponse.json({ error: 'Empty CSV body' }, { status: 400 });
    }

    const header = parseCsvLine(lines[0]).map((h) => h.trim().toLowerCase());
    const emailIdx = header.indexOf('email');
    const nameIdx = header.indexOf('name');
    const tagsIdx = header.indexOf('tags');

    if (emailIdx === -1) {
      return NextResponse.json({ error: 'CSV must include an "email" column' }, { status: 400 });
    }

    let created = 0;
    let updated = 0;
    let skipped = 0;

    for (const line of lines.slice(1)) {
      const fields = parseCsvLine(line);
      const email = fields[emailIdx]?.trim().toLowerCase();
      if (!email) {
        skipped++;
        continue;
      }
      const name = nameIdx !== -1 ? fields[nameIdx]?.trim() : '';
      const newTags = tagsIdx !== -1 ? fields[tagsIdx].split(/[|,]/).map((t) => t.trim()).filter(Boolean) : [];

      const existing = await prisma.user.findUnique({ where: { email }, select: { id: true, tags: true } });
      if (existing) {
        const mergedTags = Array.from(new Set([...existing.tags, ...newTags]));
        await prisma.user.update({ where: { id: existing.id }, data: { tags: mergedTags } });
        updated++;
      } else {
        await prisma.user.create({
          data: {
            email,
            name: name || email.split('@')[0],
            role: 'STUDENT',
            tags: newTags,
          },
        });
        created++;
      }
    }

    return NextResponse.json({ created, updated, skipped });
  } catch (err) {
    return authErrorResponse(err);
  }
}
