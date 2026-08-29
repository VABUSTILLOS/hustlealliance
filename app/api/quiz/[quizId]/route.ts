import { NextRequest, NextResponse } from 'next/server';
import { getQuizById, getUserQuizAttempts } from '@/lib/db/quizzes';
// TODO: IMPLEMENT REAL AUTH - REVERT FOR PRODUCTION
import { getCurrentUser } from "@/lib/auth/user";

// GET /api/quiz/[quizId] — get quiz questions (without answer keys)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ quizId: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { quizId } = await params;
    const [quiz, attempts] = await Promise.all([
      getQuizById(quizId),
      getUserQuizAttempts(user.id, quizId),
    ]);

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    return NextResponse.json({ quiz, attempts });
  } catch (error) {
    console.error('[GET /api/quiz] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch quiz' }, { status: 500 });
  }
}
