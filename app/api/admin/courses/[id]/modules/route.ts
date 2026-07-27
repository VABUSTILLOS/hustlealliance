import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/user';
import { createModule, updateModule, deleteModule } from '@/lib/db/admin';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id: courseId } = await params;
    const body = await request.json();
    const module = await createModule(courseId, body);

    return NextResponse.json({ module }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/admin/courses/[id]/modules]', err);
    return NextResponse.json({ error: 'Failed to create module' }, { status: 500 });
  }
}

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
    const module_ = await updateModule(body.moduleId, body);

    return NextResponse.json({ module: module_ });
  } catch (err) {
    console.error('[PUT /api/admin/courses/[id]/modules]', err);
    return NextResponse.json({ error: 'Failed to update module' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const { searchParams } = request.nextUrl;
    const moduleId = searchParams.get('moduleId');
    if (!moduleId) {
      return NextResponse.json({ error: 'moduleId required' }, { status: 400 });
    }

    await deleteModule(moduleId);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[DELETE /api/admin/courses/[id]/modules]', err);
    return NextResponse.json({ error: 'Failed to delete module' }, { status: 500 });
  }
}
