import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, authErrorResponse } from '@/lib/auth/guard';
import { getBroadcast, createBroadcast } from '@/lib/db/broadcasts';
import type { BroadcastSegmentFilter } from '@/lib/db/broadcasts';
import type { BroadcastChannel } from '@/lib/generated/prisma/client';

// POST /api/admin/broadcasts/[id]/duplicate — clone any broadcast into a new DRAFT.
export async function POST(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  let admin;
  try {
    admin = await requireAdmin();
  } catch (err) {
    return authErrorResponse(err);
  }

  try {
    const { id } = await params;
    const source = await getBroadcast(id);
    if (!source) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const copy = await createBroadcast({
      name: `${source.name} (Copy)`,
      subject: source.subject,
      body: source.body,
      channels: source.channels as BroadcastChannel[],
      segmentFilter: (source.segmentFilter as BroadcastSegmentFilter | null) ?? null,
      createdById: admin.id,
    });
    return NextResponse.json({ broadcast: copy }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/admin/broadcasts/:id/duplicate]', err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
