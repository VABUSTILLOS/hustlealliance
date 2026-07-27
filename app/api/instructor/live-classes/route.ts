import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/user';
import { getInstructorLiveClasses, createLiveClass } from '@/lib/db/instructor';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'INSTRUCTOR' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const classes = await getInstructorLiveClasses(user.id);
    return NextResponse.json({ classes }, {
      headers: { 'Cache-Control': 'private, no-cache' },
    });
  } catch (err) {
    console.error('[GET /api/instructor/live-classes]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'INSTRUCTOR' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const liveClass = await createLiveClass({ ...body, instructorId: user.id });
    return NextResponse.json({ class: liveClass }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/instructor/live-classes]', err);
    return NextResponse.json({ error: 'Failed to create live class' }, { status: 500 });
  }
}
