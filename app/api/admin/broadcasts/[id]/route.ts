import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, authErrorResponse, AuthError } from '@/lib/auth/guard';
import { getBroadcast, updateBroadcast, deleteBroadcast, validateBroadcastInput } from '@/lib/db/broadcasts';
import type { CreateBroadcastInput } from '@/lib/db/broadcasts';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const broadcast = await getBroadcast(id);
    if (!broadcast) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ broadcast });
  } catch (err) {
    return authErrorResponse(err);
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();
    const { name, subject, body: content, channels, segmentFilter } = body as Partial<CreateBroadcastInput>;

    if (channels !== undefined) {
      const error = validateBroadcastInput({ name, subject, body: content, channels });
      if (error) return NextResponse.json({ error }, { status: 400 });
    }

    const broadcast = await updateBroadcast(id, { name, subject, body: content, channels, segmentFilter });
    return NextResponse.json({ broadcast });
  } catch (err) {
    if (err instanceof AuthError) return authErrorResponse(err);
    if (err instanceof Error) return NextResponse.json({ error: err.message }, { status: 400 });
    throw err;
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    await deleteBroadcast(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof AuthError) return authErrorResponse(err);
    if (err instanceof Error) return NextResponse.json({ error: err.message }, { status: 400 });
    throw err;
  }
}
