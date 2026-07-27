import prisma from '@/lib/db/prisma';
import { DripScheduleType } from '@/lib/generated/prisma/client';

// ─── Types ───────────────────────────────────────────────────────

export type DripStatus = {
  allowed: boolean;
  reason: 'released' | 'drip_locked' | 'prerequisite_locked';
  releasesAt: Date | null;
  missingPrerequisites: { id: string; title: string }[];
};

// ─── Compute Release Date ────────────────────────────────────────

export async function computeCourseReleaseDate(userId: string, courseId: string): Promise<Date | null> {
  const dripSettings = await prisma.courseDripSettings.findUnique({
    where: { courseId },
  });

  if (!dripSettings?.enabled) return null;

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
    select: { enrolledAt: true },
  });

  if (!enrollment) return null;

  const enrolledAt = enrollment.enrolledAt;

  switch (dripSettings.type) {
    case DripScheduleType.CALENDAR:
      return dripSettings.startDate ?? enrolledAt;
    case DripScheduleType.INTERVAL_DAYS:
      return new Date(enrolledAt.getTime() + dripSettings.intervalDays * 24 * 60 * 60 * 1000);
    case DripScheduleType.INTERVAL_LESSONS:
      // Course-level interval-lessons makes less sense; fall back to enrolled date
      return enrolledAt;
    default:
      return enrolledAt;
  }
}

// ─── Compute Lesson Release Date ─────────────────────────────────

export async function computeLessonReleaseDate(
  userId: string,
  lessonId: string,
  courseId: string
): Promise<Date | null> {
  // Check for per-lesson override first
  const override = await prisma.lessonDripOverride.findUnique({
    where: { lessonId },
  });

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
    select: { enrolledAt: true },
  });

  if (!enrollment) return null;
  const enrolledAt = enrollment.enrolledAt;

  // Check course-level drip settings
  const courseDrip = await prisma.courseDripSettings.findUnique({
    where: { courseId },
  });

  // Only CourseDripSettings has an `enabled` flag; overrides are implicitly enabled
  if (!override && (!courseDrip || !courseDrip.enabled)) return null;
  const dripConfig = override ?? courseDrip!;

  // Get the lesson's position in the course
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    select: {
      sortOrder: true,
      module: { select: { sortOrder: true, courseId: true } },
    },
  });

  if (!lesson) return null;

  const lessonPosition = lesson.module.sortOrder * 100 + lesson.sortOrder;

  switch (dripConfig.type) {
    case DripScheduleType.CALENDAR:
      if (override?.unlockAt) return override.unlockAt;
      if (courseDrip?.startDate) {
        // Schedule each lesson based on its position from start date
        return new Date(
          courseDrip.startDate.getTime() +
            lessonPosition * 24 * 60 * 60 * 1000
        );
      }
      return enrolledAt;

    case DripScheduleType.INTERVAL_DAYS: {
      const intervalDays = override?.intervalDays ?? courseDrip?.intervalDays ?? 3;
      return new Date(enrolledAt.getTime() + lessonPosition * intervalDays * 24 * 60 * 60 * 1000);
    }

    case DripScheduleType.INTERVAL_LESSONS: {
      const minDone = override?.minLessonsDone ?? 1;
      // This is handled differently — check completed lessons count
      return null; // Special case: check completed count at access time
    }

    default:
      return null;
  }
}

// ─── Content Release Management ──────────────────────────────────

export async function ensureContentRelease(
  userId: string,
  lessonId: string,
  courseId: string
): Promise<void> {
  const existing = await prisma.contentRelease.findUnique({
    where: { userId_lessonId: { userId, lessonId } },
  });

  if (existing) {
    // Update release flag if date has passed
    if (!existing.isReleased && existing.releasesAt <= new Date()) {
      await prisma.contentRelease.update({
        where: { id: existing.id },
        data: { isReleased: true },
      });
    }
    return;
  }

  const releaseDate = await computeLessonReleaseDate(userId, lessonId, courseId);

  await prisma.contentRelease.create({
    data: {
      userId,
      lessonId,
      releasesAt: releaseDate ?? new Date(0),
      isReleased: releaseDate === null || releaseDate <= new Date(),
    },
  });
}

export async function getContentRelease(userId: string, lessonId: string) {
  return prisma.contentRelease.findUnique({
    where: { userId_lessonId: { userId, lessonId } },
  });
}

// ─── Prerequisite Check ──────────────────────────────────────────

export async function getMissingPrerequisites(
  userId: string,
  lessonId: string
): Promise<{ id: string; title: string }[]> {
  const prerequisites = await prisma.lessonPrerequisite.findMany({
    where: { lessonId },
    include: {
      prerequisite: { select: { id: true, title: true, slug: true } },
    },
  });

  if (prerequisites.length === 0) return [];

  const prerequisiteIds = prerequisites.map((p) => p.prerequisiteLessonId);

  // Check which prerequisites are completed
  const completed = await prisma.lessonProgress.findMany({
    where: {
      userId,
      lessonId: { in: prerequisiteIds },
      completed: true,
    },
    select: { lessonId: true },
  });

  const completedIds = new Set(completed.map((c) => c.lessonId));

  return prerequisites
    .filter((p) => !completedIds.has(p.prerequisiteLessonId))
    .map((p) => ({
      id: p.prerequisite.id,
      title: p.prerequisite.title,
    }));
}

// ─── Main Drip Status Check ──────────────────────────────────────

export async function checkDripStatus(
  userId: string,
  lessonId: string,
  courseId: string
): Promise<DripStatus> {
  // 1. Check prerequisites
  const missingPrereqs = await getMissingPrerequisites(userId, lessonId);
  if (missingPrereqs.length > 0) {
    return {
      allowed: false,
      reason: 'prerequisite_locked',
      releasesAt: null,
      missingPrerequisites: missingPrereqs,
    };
  }

  // 2. Check drip/interval locks
  await ensureContentRelease(userId, lessonId, courseId);

  const release = await getContentRelease(userId, lessonId);
  if (!release) {
    // No drip configured — allowed immediately
    return {
      allowed: true,
      reason: 'released',
      releasesAt: null,
      missingPrerequisites: [],
    };
  }

  // Check INTERVAL_LESSONS type manually
  const override = await prisma.lessonDripOverride.findUnique({
    where: { lessonId },
    select: { type: true, minLessonsDone: true },
  });

  if (override?.type === DripScheduleType.INTERVAL_LESSONS && override.minLessonsDone) {
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select: { module: { select: { courseId: true } } },
    });
    if (lesson) {
      const completedCount = await prisma.lessonProgress.count({
        where: {
          userId,
          completed: true,
          lesson: { module: { courseId: lesson.module.courseId } },
        },
      });
      if (completedCount < override.minLessonsDone) {
        return {
          allowed: false,
          reason: 'drip_locked',
          releasesAt: null,
          missingPrerequisites: [],
        };
      }
    }
  }

  if (release.isReleased) {
    return {
      allowed: true,
      reason: 'released',
      releasesAt: null,
      missingPrerequisites: [],
    };
  }

  return {
    allowed: false,
    reason: 'drip_locked',
    releasesAt: release.releasesAt,
    missingPrerequisites: [],
  };
}

// ─── Batch: Release all due content for a user ───────────────────

export async function releaseDueContent(userId: string): Promise<number> {
  const result = await prisma.contentRelease.updateMany({
    where: {
      userId,
      isReleased: false,
      releasesAt: { lte: new Date() },
    },
    data: { isReleased: true },
  });

  return result.count;
}

// ─── Course Drip Settings CRUD ────────────────────────────────────

export async function getCourseDripSettings(courseId: string) {
  return prisma.courseDripSettings.findUnique({ where: { courseId } });
}

export async function upsertCourseDripSettings(
  courseId: string,
  data: {
    enabled: boolean;
    type?: DripScheduleType;
    intervalDays?: number;
    startDate?: Date;
  }
) {
  return prisma.courseDripSettings.upsert({
    where: { courseId },
    create: { courseId, ...data },
    update: data,
  });
}

// ─── Lesson Prerequisites CRUD ────────────────────────────────────

export async function addLessonPrerequisite(lessonId: string, prerequisiteLessonId: string) {
  return prisma.lessonPrerequisite.create({
    data: { lessonId, prerequisiteLessonId },
  });
}

export async function removeLessonPrerequisite(id: string) {
  return prisma.lessonPrerequisite.delete({ where: { id } });
}

export async function getLessonPrerequisites(lessonId: string) {
  return prisma.lessonPrerequisite.findMany({
    where: { lessonId },
    include: { prerequisite: { select: { id: true, title: true, slug: true } } },
  });
}
