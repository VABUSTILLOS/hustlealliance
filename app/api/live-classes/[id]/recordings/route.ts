import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { getCurrentUser } from '@/lib/auth/user';

// POST /api/live-classes/[id]/recordings — add a recording (instructor of class, or ADMIN)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;

    const liveClass = await prisma.liveClass.findUnique({
      where: { id },
      select: { instructorId: true },
    });
    if (!liveClass) return NextResponse.json({ error: 'Live class not found' }, { status: 404 });

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    });

    const isOwner = liveClass.instructorId === user.id;
    const isAdmin = dbUser?.role === 'ADMIN';
    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: 'Only the class instructor or an admin can add recordings' }, { status: 403 });
    }

    const { title, url, durationSec } = await request.json();
    if (!title || !url) {
      return NextResponse.json({ error: 'title and url are required' }, { status: 400 });
    }

    const recording = await prisma.liveClassRecording.create({
      data: {
        liveClassId: id,
        title,
        url,
        durationSec: durationSec ? Number(durationSec) : null,
      },
    });

    return NextResponse.json({ recording }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/live-classes/[id]/recordings] Error:', error);
    return NextResponse.json({ error: 'Failed to add recording' }, { status: 500 });
  }
}

// DELETE /api/live-classes/[id]/recordings — remove a recording (owner/admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const { searchParams } = request.nextUrl;
    const recordingId = searchParams.get('recordingId');
    if (!recordingId) return NextResponse.json({ error: 'recordingId is required' }, { status: 400 });

    const liveClass = await prisma.liveClass.findUnique({
      where: { id },
      select: { instructorId: true },
    });
    if (!liveClass) return NextResponse.json({ error: 'Live class not found' }, { status: 404 });

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    });

    const isOwner = liveClass.instructorId === user.id;
    const isAdmin = dbUser?.role === 'ADMIN';
    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: 'Only the class instructor or an admin can remove recordings' }, { status: 403 });
    }

    await prisma.liveClassRecording.delete({
      where: { id: recordingId, liveClassId: id },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[DELETE /api/live-classes/[id]/recordings] Error:', error);
    return NextResponse.json({ error: 'Failed to remove recording' }, { status: 500 });
  }
}
