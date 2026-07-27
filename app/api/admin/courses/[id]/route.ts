import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/user';
import { updateCourse, deleteCourse } from '@/lib/db/admin';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const course = await updateCourse(id, body);

    return NextResponse.json({ course });
  } catch (err) {
    console.error('[PUT /api/admin/courses/[id]]', err);
    return NextResponse.json({ error: 'Failed to update course' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    await deleteCourse(id);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[DELETE /api/admin/courses/[id]]', err);
    return NextResponse.json({ error: 'Failed to delete course' }, { status: 500 });
  }
}
