import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/user';
import { getCourseStudents, getStudentCourseDetail } from '@/lib/db/instructor';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'INSTRUCTOR' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id: courseId } = await params;
    const { searchParams } = request.nextUrl;
    const studentId = searchParams.get('studentId');

    if (studentId) {
      const detail = await getStudentCourseDetail(studentId, courseId);
      return NextResponse.json(detail, {
        headers: { 'Cache-Control': 'private, no-cache' },
      });
    }

    const result = await getCourseStudents(courseId);
    return NextResponse.json(result, {
      headers: { 'Cache-Control': 'private, no-cache' },
    });
  } catch (err) {
    console.error('[GET /api/instructor/courses/[id]/students]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
