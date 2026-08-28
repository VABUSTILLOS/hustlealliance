import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { requireAdmin, authErrorResponse } from '@/lib/auth/guard';
import { resolveSegmentFilter, type SegmentFilter } from '@/lib/email/segments';

// POST /api/admin/email/segment-preview
// Body: { segmentFilter: SegmentFilter } -> returns live recipient count for the composer.
export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    const segmentFilter = body?.segmentFilter as SegmentFilter | undefined;
    const where = resolveSegmentFilter(segmentFilter);
    const count = await prisma.user.count({ where });
    return NextResponse.json({ count });
  } catch (err) {
    return authErrorResponse(err);
  }
}
