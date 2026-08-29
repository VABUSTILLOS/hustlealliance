import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, authErrorResponse } from '@/lib/auth/guard';
import { prisma } from '@/lib/db/prisma';
import { logAdminActivity } from '@/lib/activity';

/** Duplicates a landing page as a new DRAFT with a "-copy" slug suffix. */
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAdmin();
    const { id } = await params;

    const existing = await prisma.landingPage.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    let slug = `${existing.slug}-copy`;
    let n = 2;
    while (await prisma.landingPage.findUnique({ where: { slug } })) {
      slug = `${existing.slug}-copy-${n++}`;
    }

    const page = await prisma.landingPage.create({
      data: {
        title: `${existing.title} (Copy)`,
        slug,
        status: 'DRAFT',
        blocks: existing.blocks as object,
        seo: existing.seo ?? undefined,
        theme: existing.theme ?? undefined,
      },
    });

    await logAdminActivity({ actorId: user.id, action: 'page.duplicate', entity: 'LandingPage', entityId: page.id, meta: { from: id, slug: page.slug } });

    return NextResponse.json({ page }, { status: 201 });
  } catch (err) {
    try {
      return authErrorResponse(err);
    } catch {
      console.error('[POST /api/admin/pages/[id]/duplicate]', err);
      return NextResponse.json({ error: 'Failed to duplicate page' }, { status: 500 });
    }
  }
}
