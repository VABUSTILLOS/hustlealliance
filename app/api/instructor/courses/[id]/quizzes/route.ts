import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/user';
import { getCourseQuizResults } from '@/lib/db/instructor';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'INSTRUCTOR' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id: courseId } = await params;
    const results = await getCourseQuizResults(courseId);
    return NextResponse.json(results, {
      headers: { 'Cache-Control': 'private, no-cache' },
    });
  } catch (err) {
    console.error('[GET /api/instructor/courses/[id]/quizzes]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
