import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

// POST /api/leads
// Public endpoint hit by the lead-form block on published landing pages.
// Finds-or-creates a contact (User) and merges any tags from the form.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'A valid email is required' }, { status: 400 });
    }

    const name = typeof body.name === 'string' && body.name.trim() ? body.name.trim() : email.split('@')[0];
    const tags: string[] = Array.isArray(body.tags)
      ? body.tags.filter((t: unknown) => typeof t === 'string')
      : [];
    const sourceTag = typeof body.source === 'string' && body.source ? `lead:${body.source}` : 'lead';

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      const merged = Array.from(new Set([...existing.tags, sourceTag, ...tags]));
      await prisma.user.update({ where: { id: existing.id }, data: { tags: merged } });
      return NextResponse.json({ ok: true, contactId: existing.id, created: false });
    }

    const contact = await prisma.user.create({
      data: { email, name, tags: [sourceTag, ...tags] },
    });
    return NextResponse.json({ ok: true, contactId: contact.id, created: true });
  } catch (err) {
    console.error('[Leads] capture failed:', err);
    return NextResponse.json({ error: 'Could not save lead' }, { status: 500 });
  }
}
