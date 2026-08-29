import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, authErrorResponse } from '@/lib/auth/guard';
import { prisma } from '@/lib/db/prisma';

/** Lists the saved block-tree snapshots for a page (newest first, max 10). */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const versions = await prisma.landingPageVersion.findMany({
      where: { pageId: id },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    return NextResponse.json({
      versions: versions.map((v) => ({
        id: v.id,
        createdAt: v.createdAt,
        blockCount: Array.isArray(v.blocks) ? v.blocks.length : 0,
      })),
    });
  } catch (err) {
    try {
      return authErrorResponse(err);
    } catch {
      console.error('[GET /api/admin/pages/[id]/versions]', err);
      return NextResponse.json({ error: 'Failed to load versions' }, { status: 500 });
    }
  }
}
