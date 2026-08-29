import { NextRequest, NextResponse } from 'next/server';
// TODO: IMPLEMENT REAL AUTH - REVERT FOR PRODUCTION
import { getCurrentUser } from "@/lib/auth/user";
import { getLessonPrerequisites, addLessonPrerequisite, removeLessonPrerequisite } from '@/lib/db/drip';
import prisma from '@/lib/db/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  const { lessonId } = await params;
  const prerequisites = await getLessonPrerequisites(lessonId);
  return NextResponse.json({ prerequisites });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true },
  });
  if (!dbUser || (dbUser.role !== 'INSTRUCTOR' && dbUser.role !== 'ADMIN')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { lessonId } = await params;
  const body = await request.json();
  const { prerequisiteLessonId } = body;

  if (!prerequisiteLessonId) {
    return NextResponse.json({ error: 'prerequisiteLessonId is required' }, { status: 400 });
  }

  const result = await addLessonPrerequisite(lessonId, prerequisiteLessonId);
  return NextResponse.json({ prerequisite: result }, { status: 201 });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true },
  });
  if (!dbUser || (dbUser.role !== 'INSTRUCTOR' && dbUser.role !== 'ADMIN')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { lessonId } = await params;
  const { searchParams } = new URL(request.url);
  const prerequisiteId = searchParams.get('prerequisiteId');
  if (!prerequisiteId) {
    return NextResponse.json({ error: 'prerequisiteId query param is required' }, { status: 400 });
  }

  await removeLessonPrerequisite(prerequisiteId);
  return NextResponse.json({ success: true });
}
