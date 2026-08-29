import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
// TODO: IMPLEMENT REAL AUTH - REVERT FOR PRODUCTION
import { getCurrentUser } from "@/lib/auth/user";

// GET /api/live-classes — list live classes (default: upcoming)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const courseId = searchParams.get('courseId');
    const scope = searchParams.get('scope') || 'upcoming'; // 'upcoming' | 'past'
    const registeredOnly = searchParams.get('registered') === 'true';
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const user = await getCurrentUser();

    const now = new Date();
    const where: any = {
      ...(scope === 'past' ? { endsAt: { lt: now } } : { startsAt: { gte: now } }),
    };
    if (courseId) where.courseId = courseId;
    if (registeredOnly) {
      if (!user) return NextResponse.json({ classes: [] });
      where.registrations = { some: { userId: user.id } };
    }

    const classes = await prisma.liveClass.findMany({
      where,
      include: {
        instructor: { select: { id: true, name: true, avatar: true } },
        course: { select: { id: true, title: true, slug: true } },
        recordings: { select: { id: true, title: true, url: true, durationSec: true }, take: 5 },
        _count: { select: { registrations: true } },
      },
      orderBy: scope === 'past' ? { startsAt: 'desc' } : { startsAt: 'asc' },
      take: limit,
    });

    // Attach per-user registration state
    let registeredIds = new Set<string>();
    if (user) {
      const regs = await prisma.liveClassRegistration.findMany({
        where: { userId: user.id, liveClassId: { in: classes.map((c) => c.id) } },
        select: { liveClassId: true },
      });
      registeredIds = new Set(regs.map((r) => r.liveClassId));
    }

    const result = classes.map((c) => ({
      ...c,
      isRegistered: registeredIds.has(c.id),
    }));

    return NextResponse.json(
      { classes: result },
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
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

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
