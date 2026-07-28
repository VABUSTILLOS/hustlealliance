import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
// TODO: IMPLEMENT REAL AUTH - REVERT FOR PRODUCTION
import { getCurrentUser } from "@/lib/auth/user";

// GET /api/live-classes — list upcoming live classes
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const courseId = searchParams.get('courseId');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);

    const where: any = {
      startsAt: { gte: new Date() },
    };
    if (courseId) where.courseId = courseId;

    const classes = await prisma.liveClass.findMany({
      where,
      include: {
        instructor: { select: { id: true, name: true, avatar: true } },
        course: { select: { id: true, title: true, slug: true } },
        _count: { select: { registrations: true } },
      },
      orderBy: { startsAt: 'asc' },
      take: limit,
    });

    return NextResponse.json(
      { classes },
      { headers: { 'Cache-Control': 'public, max-age=30, s-maxage=60' } }
    );
  } catch (error) {
    console.error('[GET /api/live-classes] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch live classes' }, { status: 500 });
  }
}

// POST /api/live-classes — create a new live class (instructors only)
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    });

    if (!dbUser || (dbUser.role !== 'INSTRUCTOR' && dbUser.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Only instructors can create live classes' }, { status: 403 });
    }

    const { title, description, courseId, startsAt, endsAt, maxAttendees } = await request.json();

    if (!title || !startsAt || !endsAt) {
      return NextResponse.json({ error: 'title, startsAt, endsAt are required' }, { status: 400 });
    }

    const roomName = `hustle-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const meetingUrl = `https://meet.jit.si/${roomName}`;

    const liveClass = await prisma.liveClass.create({
      data: {
        title,
        description,
        instructorId: user.id,
        courseId: courseId || null,
        platform: 'JITSI',
        meetingUrl,
        roomName,
        startsAt: new Date(startsAt),
        endsAt: new Date(endsAt),
        maxAttendees: maxAttendees || null,
      },
      include: {
        instructor: { select: { id: true, name: true, avatar: true } },
        course: { select: { id: true, title: true, slug: true } },
      },
    });

    return NextResponse.json({ class: liveClass }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/live-classes] Error:', error);
    return NextResponse.json({ error: 'Failed to create live class' }, { status: 500 });
  }
}
