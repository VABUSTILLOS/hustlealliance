import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/user';
import { getInstructorCourses } from '@/lib/db/instructor';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'INSTRUCTOR' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const courses = await getInstructorCourses(user.id);
    return NextResponse.json({ courses }, {
      headers: { 'Cache-Control': 'private, no-cache' },
    });
  } catch (err) {
    console.error('[GET /api/instructor/courses]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
