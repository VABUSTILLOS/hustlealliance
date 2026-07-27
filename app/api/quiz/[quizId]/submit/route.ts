import { NextRequest, NextResponse } from 'next/server';
import { submitQuizAttempt, getUserQuizAttempts } from '@/lib/db/quizzes';
import { awardXP } from '@/lib/db/progress';
import { createClient } from '@/lib/supabase/server';

// POST /api/quiz/[quizId]/submit — submit quiz answers for grading
// Body: { answers: Record<string, string | string[]> }
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ quizId: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { quizId } = await params;
    const { answers } = await request.json();

    if (!answers || typeof answers !== 'object') {
      return NextResponse.json(
        { error: 'answers object is required' },
        { status: 400 }
      );
    }

    const attempt = await submitQuizAttempt(user.id, quizId, answers);

    // Award XP for quiz attempt
    const xpAmount = attempt.passed ? 50 : 10;
    await awardXP(user.id, xpAmount, `Quiz attempt: ${attempt.passed ? 'passed' : 'failed'}`);

    return NextResponse.json({ attempt }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/quiz/submit] Error:', error);
    return NextResponse.json(
      { error: 'Failed to submit quiz' },
      { status: 500 }
    );
  }
}
