import prisma from '@/lib/db/prisma';
import { getServerT } from '@/lib/i18n/server';
import { StudyGroupClient } from './client';
import { ensureStudyGroupTables, ensureStudyGroupForCourse } from '@/lib/db/init-study-groups';

export const dynamic = 'force-dynamic';

export default async function StudyGroupPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { t } = await getServerT();

  try {
    // Ensure study group tables exist before querying
    await ensureStudyGroupTables();

    // Fetch course first — we need its id to provision the study group
    const course = await prisma.course.findUnique({
      where: { slug },
      select: { id: true, title: true },
    });

    if (!course) {
      return (
        <div className="min-h-screen p-8 text-center">
          <h1 className="text-xl font-bold text-red-500">{t.studyGroup.notFound}</h1>
          <p className="text-muted mt-2">{t.studyGroup.notFoundSubtitle.replace('{slug}', slug)}</p>
        </div>
      );
    }

    // Auto-provision a study group for this course if one doesn't exist yet
    await ensureStudyGroupForCourse(course.id);

    // Find existing study group
    let raw = await prisma.courseStudyGroup.findUnique({
      where: { courseId: course.id },
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

    if (!raw) {
      return <StudyGroupClient slug={slug} group={null} />;
    }

    // Serialize to plain JSON to break any shared object references
    // (Prisma adapters can return the same User object in multiple includes,
    // causing React Flight serialization to fail with circular references)
    const group = JSON.parse(JSON.stringify(raw)) as typeof raw;

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
