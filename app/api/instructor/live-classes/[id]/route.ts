import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/user';
import { updateLiveClass, deleteLiveClass } from '@/lib/db/instructor';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'INSTRUCTOR' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const updated = await updateLiveClass(id, body);
    return NextResponse.json({ class: updated });
  } catch (err) {
    console.error('[PUT /api/instructor/live-classes/[id]]', err);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'INSTRUCTOR' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    await deleteLiveClass(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[DELETE /api/instructor/live-classes/[id]]', err);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
