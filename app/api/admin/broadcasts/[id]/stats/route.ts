import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, authErrorResponse } from '@/lib/auth/guard';
import { getBroadcast } from '@/lib/db/broadcasts';

// GET /api/admin/broadcasts/[id]/stats — per-channel counts.
// Only reports counts we actually have (emailCount/inAppCount/feed post presence);
// no fabricated open/click tracking for broadcasts.
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const broadcast = await getBroadcast(id);
    if (!broadcast) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    return NextResponse.json({
      stats: {
        status: broadcast.status,
        sentAt: broadcast.sentAt,
        channels: broadcast.channels,
        emailCount: broadcast.emailCount,
        inAppCount: broadcast.inAppCount,
        feedPostId: broadcast.feedPostId,
      },
    });
  } catch (err) {
    return authErrorResponse(err);
  }
}
