import { NextRequest, NextResponse } from 'next/server';
import { getUserProgress, getCourseProgress } from '@/lib/db/progress';
import { createClient } from '@/lib/supabase/server';

// GET /api/progress?courseId=xxx — get user's progress (optionally filtered by course)
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = request.nextUrl;
    const courseId = searchParams.get('courseId');

    if (courseId) {
      const progress = await getCourseProgress(user.id, courseId);
      if (!progress) {
        return NextResponse.json({ error: 'Course not found' }, { status: 404 });
      }
      return NextResponse.json({ progress });
    }

    const allProgress = await getUserProgress(user.id);
    return NextResponse.json({ progress: allProgress });
  } catch (error) {
    console.error('[GET /api/progress] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 });
  }
}
