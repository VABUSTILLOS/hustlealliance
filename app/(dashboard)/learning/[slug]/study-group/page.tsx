import prisma from '@/lib/db/prisma';
import { StudyGroupClient } from './client';
import { ensureStudyGroupTables } from '@/lib/db/init-study-groups';

export default async function StudyGroupPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  try {
    // Ensure study group tables exist in the database
    await ensureStudyGroupTables();

    // Fetch course + study group server-side — no auth required
    const course = await prisma.course.findUnique({
      where: { slug },
      select: { id: true, title: true },
    });

    if (!course) {
      return (
        <div className="min-h-screen p-8 text-center">
          <h1 className="text-xl font-bold text-red-500">Course not found</h1>
          <p className="text-muted mt-2">The course &quot;{slug}&quot; does not exist.</p>
        </div>
      );
    }

    // Upsert study group
    const group = await prisma.courseStudyGroup.upsert({
      where: { courseId: course.id },
      create: { courseId: course.id, description: null },
      update: {},
      include: {
        members: {
          include: {
            user: {
              select: { id: true, name: true, avatar: true, username: true },
            },
          },
          orderBy: { joinedAt: 'asc' },
        },
        posts: {
          include: {
            author: {
              select: { id: true, name: true, avatar: true, username: true },
            },
            replies: {
              include: {
                author: { select: { id: true, name: true, avatar: true } },
              },
              orderBy: { createdAt: 'asc' },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 50,
        },
        files: {
          include: {
            uploader: { select: { id: true, name: true, avatar: true } },
          },
          orderBy: { createdAt: 'desc' },
          take: 50,
        },
      },
    });

    return <StudyGroupClient slug={slug} group={group} />;
  } catch (error) {
    console.error(
      '[StudyGroup] Failed to load study group for slug:',
      slug,
      error instanceof Error ? error.message : error
    );
    throw new Error(
      error instanceof Error ? error.message : 'Failed to load study group'
    );
  }
}
