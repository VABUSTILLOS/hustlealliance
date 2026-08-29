import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, authErrorResponse } from '@/lib/auth/guard';
import { prisma } from '@/lib/db/prisma';
import { logAdminActivity } from '@/lib/activity';

/**
 * Toggle a landing page's publish state.
 * POST body: { publish: boolean } — publish=true sets status PUBLISHED and
 * stamps publishedAt (first time only); publish=false reverts to DRAFT.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAdmin();
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const publish = body?.publish !== false;

    const existing = await prisma.landingPage.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const page = await prisma.landingPage.update({
      where: { id },
      data: publish
        ? { status: 'PUBLISHED', publishedAt: existing.publishedAt ?? new Date() }
        : { status: 'DRAFT' },
    });

    await logAdminActivity({
      actorId: user.id,
      action: publish ? 'page.publish' : 'page.unpublish',
      entity: 'LandingPage',
      entityId: id,
      meta: { slug: page.slug },
    });

    return NextResponse.json({ page });
  } catch (err) {
    try {
      return authErrorResponse(err);
    } catch {
      console.error('[POST /api/admin/pages/[id]/publish]', err);
      return NextResponse.json({ error: 'Failed to update publish state' }, { status: 500 });
    }
  }
}
