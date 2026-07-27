import { NextRequest, NextResponse } from 'next/server';
import { markLessonComplete, awardXP, updateStreak } from '@/lib/db/progress';
import { createClient } from '@/lib/supabase/server';

// POST /api/progress/lesson-complete — mark a lesson as complete
// Body: { lessonId: string }
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { lessonId } = await request.json();
    if (!lessonId || typeof lessonId !== 'string') {
      return NextResponse.json({ error: 'lessonId is required' }, { status: 400 });
    }

    const progress = await markLessonComplete(user.id, lessonId);

    // Award XP and update streak asynchronously
    await Promise.all([
      awardXP(user.id, 10, `Completed lesson: ${lessonId}`),
      updateStreak(user.id),
    ]);

    return NextResponse.json({ progress });
  } catch (error) {
    console.error('[POST /api/progress/lesson-complete] Error:', error);
    return NextResponse.json({ error: 'Failed to mark lesson complete' }, { status: 500 });
  }
}
