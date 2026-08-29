import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { getCurrentUser } from '@/lib/auth/user';
import { checkAccess } from '@/lib/auth/accessControl';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string; lessonSlug: string }> }
) {
  const { courseId, lessonSlug } = await params;

  // Find the lesson by slug, scoped to the course
  const lesson = await prisma.lesson.findFirst({
    where: {
      slug: lessonSlug,
      module: {
        course: {
          OR: [{ id: courseId }, { slug: courseId }],
        },
      },
    },
    include: {
      module: {
        include: {
          course: {
            select: { id: true, title: true, slug: true, accessLevel: true, communitySpaceSlug: true },
          },
        },
      },
      quiz: {
        include: {
          questions: {
            orderBy: { sortOrder: 'asc' },
            include: {
              answers: {
                orderBy: { sortOrder: 'asc' },
                select: { id: true, answerText: true, sortOrder: true },
              },
            },
          },
        },
      },
    },
  });

  if (!lesson) {
    return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
  }

  // ── Access enforcement: gate lesson content behind entitlements ──
  const user = await getCurrentUser();
  const access = await checkAccess({
    userId: user?.id ?? null,
    lessonId: lesson.id,
    courseId: lesson.module.course.id,
  });

  const isAuthorized = access.allowed;

  // For anonymous/unauthorized users the lesson page renders a paywall,
  // so metadata is enough — never ship premium content to the client.
  const authorizedQuiz = lesson.quiz
    ? {
        id: lesson.quiz.id,
        title: lesson.quiz.title,
        passingScore: lesson.quiz.passingScore,
        timeLimitMinutes: lesson.quiz.timeLimitMinutes,
        randomizeOrder: lesson.quiz.randomizeOrder,
        maxAttempts: lesson.quiz.maxAttempts,
        questions: isAuthorized
          ? lesson.quiz.questions
          : lesson.quiz.questions.map((q) => ({
              ...q,
              answers: q.answers.map(() => ({ id: '', answerText: '', sortOrder: 0 })),
            })),
        _count: { questions: lesson.quiz.questions.length },
      }
    : null;

  return NextResponse.json(
    {
      lesson: {
        id: lesson.id,
        title: lesson.title,
        slug: lesson.slug,
        content: isAuthorized ? lesson.content : null,
        videoUrl: isAuthorized ? lesson.videoUrl : null,
        durationMinutes: lesson.durationMinutes,
        sortOrder: lesson.sortOrder,
        lessonType: lesson.lessonType,
        accessLevel: lesson.accessLevel,
        module: {
          id: lesson.module.id,
          title: lesson.module.title,
          course: lesson.module.course,
        },
        quiz: authorizedQuiz,
      },
    },
    {
      headers: { 'Cache-Control': 'private, no-cache' },
    }
  );
}
