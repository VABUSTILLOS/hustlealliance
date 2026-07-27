import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string; lessonSlug: string }> }
) {
  const { courseId, lessonSlug } = await params;

  // Find the course first (by slug or ID)
  const course = await prisma.course.findFirst({
    where: {
      OR: [{ id: courseId }, { slug: courseId }],
    },
    select: {
      id: true,
      title: true,
      slug: true,
      accessLevel: true,
      communitySpaceSlug: true,
    },
  });

  if (!course) {
    return NextResponse.json({ error: 'Course not found' }, { status: 404 });
  }

  // Find the lesson by slug within this course's modules
  const module = await prisma.courseModule.findFirst({
    where: {
      courseId: course.id,
      lessons: { some: { slug: lessonSlug } },
    },
    select: {
      id: true,
      title: true,
      lessons: {
        where: { slug: lessonSlug },
        take: 1,
        select: {
          id: true,
          title: true,
          slug: true,
          content: true,
          videoUrl: true,
          durationMinutes: true,
          sortOrder: true,
          accessLevel: true,
        },
      },
    },
  });

  if (!module || module.lessons.length === 0) {
    return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
  }

  const lesson = module.lessons[0];

  return NextResponse.json(
    {
      lesson: {
        ...lesson,
        module: {
          id: module.id,
          title: module.title,
          course: {
            id: course.id,
            title: course.title,
            slug: course.slug,
            accessLevel: course.accessLevel,
            communitySpaceSlug: course.communitySpaceSlug,
          },
        },
      },
    },
    {
      headers: { 'Cache-Control': 'public, max-age=60, stale-while-revalidate=300' },
    }
  );
}
