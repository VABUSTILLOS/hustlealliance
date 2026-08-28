import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, authErrorResponse, AuthError } from '@/lib/auth/guard';
import {
  listBroadcasts,
  createBroadcast,
  validateBroadcastInput,
  type CreateBroadcastInput,
} from '@/lib/db/broadcasts';
import type { BroadcastChannel } from '@/lib/generated/prisma/client';

// GET /api/admin/broadcasts — list all broadcasts with per-broadcast stats.
export async function GET() {
  try {
    await requireAdmin();
    const broadcasts = await listBroadcasts();
    const withStats = broadcasts.map((b) => ({
      ...b,
      stats: {
        emailCount: b.emailCount,
        inAppCount: b.inAppCount,
        hasFeedPost: !!b.feedPostId,
      },
    }));
    return NextResponse.json({ broadcasts: withStats });
  } catch (err) {
    return authErrorResponse(err);
  }
}

// POST /api/admin/broadcasts — create a new draft broadcast.
export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin();
    const body = await request.json();
    const { name, subject, body: content, channels, segmentFilter } = body as Partial<CreateBroadcastInput>;

    const error = validateBroadcastInput({ name, subject, body: content, channels });
    if (error) return NextResponse.json({ error }, { status: 400 });

    const broadcast = await createBroadcast({
      name: name!,
      subject: subject!,
      body: content!,
      channels: channels as BroadcastChannel[],
      segmentFilter,
      createdById: admin.id,
    });

    return NextResponse.json({ broadcast }, { status: 201 });
  } catch (err) {
    if (err instanceof AuthError) return authErrorResponse(err);
    if (err instanceof Error) return NextResponse.json({ error: err.message }, { status: 400 });
    throw err;
  }
}
