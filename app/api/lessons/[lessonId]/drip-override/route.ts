import { NextRequest, NextResponse } from 'next/server';
// TODO: IMPLEMENT REAL AUTH - REVERT FOR PRODUCTION
import { getCurrentUser } from "@/lib/auth/user";
import prisma from '@/lib/db/prisma';

export async function PUT(
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

  const override = await prisma.lessonDripOverride.upsert({
    where: { lessonId },
    create: {
      lessonId,
      type: body.type,
      intervalDays: body.intervalDays,
      unlockAt: body.unlockAt ? new Date(body.unlockAt) : null,
      minLessonsDone: body.minLessonsDone,
    },
    update: {
      type: body.type,
      intervalDays: body.intervalDays ?? null,
      unlockAt: body.unlockAt ? new Date(body.unlockAt) : null,
      minLessonsDone: body.minLessonsDone ?? null,
    },
  });

  return NextResponse.json({ override });
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

  await prisma.lessonDripOverride.deleteMany({ where: { lessonId } });
  return NextResponse.json({ success: true });
}
