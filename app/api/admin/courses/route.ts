import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/user';
import { getAdminCourses, createCourse, getInstructors, getCategoriesForAdmin } from '@/lib/db/admin';
import { CourseStatus } from '@/lib/generated/prisma/client';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = request.nextUrl;
    const search = searchParams.get('search') || undefined;
    const status = searchParams.get('status') as CourseStatus | undefined;
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');

    const [result, instructors, categories] = await Promise.all([
      getAdminCourses({ search, status, limit, offset }),
      getInstructors(),
      getCategoriesForAdmin(),
    ]);

    return NextResponse.json(
      { ...result, instructors, categories },
      { headers: { 'Cache-Control': 'private, no-cache' } }
    );
  } catch (err) {
    console.error('[GET /api/admin/courses]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const course = await createCourse(body);

    return NextResponse.json({ course }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/admin/courses]', err);
    return NextResponse.json({ error: 'Failed to create course' }, { status: 500 });
  }
}
