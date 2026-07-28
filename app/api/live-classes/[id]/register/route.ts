import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
// TODO: IMPLEMENT REAL AUTH - REVERT FOR PRODUCTION
import { getCurrentUser } from "@/lib/auth/user";

// POST /api/live-classes/[id]/register — register for a live class
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();

    const { id } = await params;

    const liveClass = await prisma.liveClass.findUnique({
      where: { id },
      select: { id: true, maxAttendees: true, _count: { select: { registrations: true } } },
    });

    if (!liveClass) {
      return NextResponse.json({ error: 'Live class not found' }, { status: 404 });
    }

    if (liveClass.maxAttendees && liveClass._count.registrations >= liveClass.maxAttendees) {
      return NextResponse.json({ error: 'Class is full' }, { status: 400 });
    }

    try {
      const registration = await prisma.liveClassRegistration.create({
        data: { userId: user.id, liveClassId: id },
        include: {
          liveClass: {
            select: { title: true, meetingUrl: true, startsAt: true, roomName: true },
          },
        },
      });

      return NextResponse.json({ registration }, { status: 201 });
    } catch (e: any) {
      if (e?.code === 'P2002') {
        return NextResponse.json({ error: 'Already registered' }, { status: 409 });
      }
      throw e;
    }
  } catch (error) {
    console.error('[POST /api/live-classes/register] Error:', error);
    return NextResponse.json({ error: 'Failed to register' }, { status: 500 });
  }
}
