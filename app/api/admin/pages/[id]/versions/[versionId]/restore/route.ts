import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, authErrorResponse } from '@/lib/auth/guard';
import { prisma } from '@/lib/db/prisma';
import { Prisma } from '@/lib/generated/prisma/client';

/**
 * Restores a saved snapshot: the current blocks are snapshotted first (so the
 * restore itself is undoable), then the page's blocks are replaced.
 */
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; versionId: string }> }
) {
  try {
    await requireAdmin();
    const { id, versionId } = await params;

    const [page, version] = await Promise.all([
      prisma.landingPage.findUnique({ where: { id } }),
      prisma.landingPageVersion.findFirst({ where: { id: versionId, pageId: id } }),
    ]);
    if (!page || !version) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    await prisma.landingPageVersion.create({
      data: { pageId: id, blocks: page.blocks as Prisma.InputJsonValue },
    });

    const updated = await prisma.landingPage.update({
      where: { id },
      data: { blocks: version.blocks as Prisma.InputJsonValue },
    });

    return NextResponse.json({ page: updated });
  } catch (err) {
    try {
      return authErrorResponse(err);
    } catch {
      console.error('[POST /api/admin/pages/[id]/versions/restore]', err);
      return NextResponse.json({ error: 'Failed to restore version' }, { status: 500 });
    }
  }
}
