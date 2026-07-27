import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/user';
import { createLesson, updateLesson, deleteLesson } from '@/lib/db/admin';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; moduleId: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { moduleId } = await params;
    const body = await request.json();
    const lesson = await createLesson(moduleId, body);

    return NextResponse.json({ lesson }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/admin/courses/[id]/modules/[moduleId]/lessons]', err);
    return NextResponse.json({ error: 'Failed to create lesson' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; moduleId: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const lesson = await updateLesson(body.lessonId, body);

    return NextResponse.json({ lesson });
  } catch (err) {
    console.error('[PUT /api/admin/courses/[id]/modules/[moduleId]/lessons]', err);
    return NextResponse.json({ error: 'Failed to update lesson' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; moduleId: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const { searchParams } = request.nextUrl;
    const lessonId = searchParams.get('lessonId');
    if (!lessonId) {
      return NextResponse.json({ error: 'lessonId required' }, { status: 400 });
    }

    await deleteLesson(lessonId);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[DELETE /api/admin/courses/[id]/modules/[moduleId]/lessons]', err);
    return NextResponse.json({ error: 'Failed to delete lesson' }, { status: 500 });
  }
}
