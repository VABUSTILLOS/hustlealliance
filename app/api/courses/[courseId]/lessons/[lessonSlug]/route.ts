import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

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

  return NextResponse.json(
    {
      lesson: {
        id: lesson.id,
        title: lesson.title,
        slug: lesson.slug,
        content: lesson.content,
        videoUrl: lesson.videoUrl,
        durationMinutes: lesson.durationMinutes,
        sortOrder: lesson.sortOrder,
        lessonType: lesson.lessonType,
        accessLevel: lesson.accessLevel,
        module: {
          id: lesson.module.id,
          title: lesson.module.title,
          course: lesson.module.course,
        },
        quiz: lesson.quiz
          ? {
              id: lesson.quiz.id,
              title: lesson.quiz.title,
              passingScore: lesson.quiz.passingScore,
              timeLimitMinutes: lesson.quiz.timeLimitMinutes,
              randomizeOrder: lesson.quiz.randomizeOrder,
              maxAttempts: lesson.quiz.maxAttempts,
              questions: lesson.quiz.questions,
              _count: { questions: lesson.quiz.questions.length },
            }
          : null,
      },
    },
    {
      headers: { 'Cache-Control': 'public, max-age=60, stale-while-revalidate=300' },
    }
  );
}
