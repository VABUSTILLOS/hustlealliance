import prisma from '@/lib/db/prisma';

// ─── Quiz Types ──────────────────────────────────────────────────

export type QuizWithQuestions = Awaited<ReturnType<typeof getQuizById>>;

// ─── Query Functions ────────────────────────────────────────────

/** Get a quiz with all questions and answers */
export async function getQuizById(quizId: string) {
  return prisma.quiz.findUnique({
    where: { id: quizId },
    include: {
      questions: {
        orderBy: { sortOrder: 'asc' },
        include: {
          answers: {
            orderBy: { sortOrder: 'asc' },
            select: {
              id: true,
              answerText: true,
              sortOrder: true,
              // isCorrect is excluded — only sent for grading on the server
            },
          },
        },
      },
      lesson: {
        select: {
          id: true,
          title: true,
          module: {
            select: {
              id: true,
              courseId: true,
              course: { select: { id: true, title: true, slug: true } },
            },
          },
        },
      },
    },
  });
}

/** Get quiz with answer keys for grading (server-only) */
export async function getQuizWithAnswerKeys(quizId: string) {
  return prisma.quiz.findUnique({
    where: { id: quizId },
    include: {
      questions: {
        orderBy: { sortOrder: 'asc' },
        include: {
          answers: {
            orderBy: { sortOrder: 'asc' },
            select: { id: true, isCorrect: true },
          },
        },
      },
    },
  });
}

/** Get user's quiz attempts for a quiz */
export async function getUserQuizAttempts(userId: string, quizId: string) {
  return prisma.quizAttempt.findMany({
    where: { userId, quizId },
    orderBy: { startedAt: 'desc' },
    take: 10,
  });
}

/** Submit a quiz attempt */
export async function submitQuizAttempt(
  userId: string,
  quizId: string,
  answers: Record<string, string | string[]>
) {
  // Grade the quiz
  const quiz = await getQuizWithAnswerKeys(quizId);
  if (!quiz) throw new Error('Quiz not found');

  let correctCount = 0;
  const totalQuestions = quiz.questions.length;

  for (const question of quiz.questions) {
    const userAnswer = answers[question.id];
    const correctAnswers = question.answers
      .filter((a) => a.isCorrect)
      .map((a) => a.id);

    if (Array.isArray(userAnswer)) {
      // Multiple correct answers — all must match exactly
      const sortedUser = [...userAnswer].sort();
      const sortedCorrect = [...correctAnswers].sort();
      if (
        sortedUser.length === sortedCorrect.length &&
        sortedUser.every((v, i) => v === sortedCorrect[i])
      ) {
        correctCount++;
      }
    } else {
      // Single answer
      if (correctAnswers.includes(userAnswer)) {
        correctCount++;
      }
    }
  }

  const score = (correctCount / totalQuestions) * 100;
  const passed = score >= quiz.passingScore;

  return prisma.quizAttempt.create({
    data: {
      userId,
      quizId,
      submittedAt: new Date(),
      score,
      passed,
      answers: answers as any,
    },
  });
}
