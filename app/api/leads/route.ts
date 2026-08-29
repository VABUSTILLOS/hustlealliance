import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { enrollUserInAutomations } from '@/lib/email/automation-triggers';
import { awardLeadScore, LEAD_SCORE_RULES } from '@/lib/scoring';
import { recordPageEvent, type UtmParams } from '@/lib/track';

// POST /api/leads
// Public endpoint hit by the lead-form block on published landing pages.
// Finds-or-creates a contact (User) and merges any tags from the form.
// Also records funnel attribution (LEAD PageEvent), awards lead score, and
// enrolls the contact into LEAD_CAPTURED automations.
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

    // Attribution payload (optional, sent by the lead-form block / PageTracker).
    const sessionId = typeof body.sessionId === 'string' ? body.sessionId.slice(0, 128) : '';
    const path = typeof body.path === 'string' ? body.path.slice(0, 500) : '';
    let landingPageId = typeof body.landingPageId === 'string' ? body.landingPageId : null;
    // Resolve the landing page from a /p/[slug] path when the id wasn't sent.
    if (!landingPageId && path.startsWith('/p/')) {
      const slug = path.slice(3).split(/[/?#]/)[0];
      if (slug) {
        const page = await prisma.landingPage.findUnique({ where: { slug }, select: { id: true } });
        landingPageId = page?.id ?? null;
      }
    }
    const rawUtm = body.utm && typeof body.utm === 'object' ? (body.utm as Record<string, unknown>) : null;
    const utm: UtmParams | null = rawUtm
      ? {
          source: typeof rawUtm.source === 'string' ? rawUtm.source : undefined,
          medium: typeof rawUtm.medium === 'string' ? rawUtm.medium : undefined,
          campaign: typeof rawUtm.campaign === 'string' ? rawUtm.campaign : undefined,
          term: typeof rawUtm.term === 'string' ? rawUtm.term : undefined,
          content: typeof rawUtm.content === 'string' ? rawUtm.content : undefined,
        }
      : null;

    const existing = await prisma.user.findUnique({ where: { email } });
    let contactId: string;
    if (existing) {
      const merged = Array.from(new Set([...existing.tags, sourceTag, ...tags]));
      await prisma.user.update({ where: { id: existing.id }, data: { tags: merged } });
      contactId = existing.id;
    } else {
      const contact = await prisma.user.create({
        data: { email, name, tags: [sourceTag, ...tags] },
      });
      contactId = contact.id;
    }

    await Promise.all([
      awardLeadScore(contactId, LEAD_SCORE_RULES.leadCaptured),
      enrollUserInAutomations(contactId, 'LEAD_CAPTURED'),
      sessionId && path
        ? recordPageEvent({ type: 'LEAD', path, sessionId, landingPageId, utm })
        : Promise.resolve(),
    ]);

    return NextResponse.json({ ok: true, contactId, created: !existing });
  } catch (err) {
    console.error('[Leads] capture failed:', err);
    return NextResponse.json({ error: 'Could not save lead' }, { status: 500 });
  }
}
