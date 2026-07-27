import prisma from '@/lib/db/prisma';

// ─── Lesson Progress ────────────────────────────────────────────

export async function getLessonProgress(userId: string, lessonId: string) {
  return prisma.lessonProgress.findUnique({
    where: { userId_lessonId: { userId, lessonId } },
  });
}

export async function markLessonComplete(userId: string, lessonId: string) {
  return prisma.lessonProgress.upsert({
    where: { userId_lessonId: { userId, lessonId } },
    create: {
      userId,
      lessonId,
      completed: true,
      completedAt: new Date(),
    },
    update: {
      completed: true,
      completedAt: new Date(),
    },
  });
}

export async function updateVideoPosition(userId: string, lessonId: string, positionSeconds: number) {
  return prisma.lessonProgress.upsert({
    where: { userId_lessonId: { userId, lessonId } },
    create: {
      userId,
      lessonId,
      videoPositionSeconds: positionSeconds,
    },
    update: {
      videoPositionSeconds: positionSeconds,
      lastAccessedAt: new Date(),
    },
  });
}

/** Get all progress for a user across all courses */
export async function getUserProgress(userId: string) {
  return prisma.lessonProgress.findMany({
    where: { userId },
    include: {
      lesson: {
        select: {
          id: true,
          title: true,
          sortOrder: true,
          module: {
            select: {
              id: true,
              title: true,
              courseId: true,
              course: { select: { id: true, title: true, slug: true } },
            },
          },
        },
      },
    },
    orderBy: { lastAccessedAt: 'desc' },
  });
}

/** Get progress for a specific course */
export async function getCourseProgress(userId: string, courseId: string) {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      modules: {
        include: {
          lessons: {
            include: {
              progress: {
                where: { userId },
                select: { completed: true, videoPositionSeconds: true, lastAccessedAt: true },
              },
            },
            orderBy: { sortOrder: 'asc' },
          },
        },
        orderBy: { sortOrder: 'asc' },
      },
    },
  });

  if (!course) return null;

  const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const completedLessons = course.modules.reduce(
    (sum, m) => sum + m.lessons.filter((l) => l.progress.length > 0 && l.progress[0].completed).length,
    0
  );

  return {
    courseId: course.id,
    title: course.title,
    slug: course.slug,
    totalLessons,
    completedLessons,
    percentage: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
    modules: course.modules.map((m) => ({
      id: m.id,
      title: m.title,
      lessons: m.lessons.map((l) => ({
        id: l.id,
        title: l.title,
        completed: l.progress.length > 0 && l.progress[0].completed,
        videoPositionSeconds: l.progress[0]?.videoPositionSeconds ?? 0,
        lastAccessedAt: l.progress[0]?.lastAccessedAt ?? null,
      })),
    })),
  };
}

// ─── Gamification ────────────────────────────────────────────────

export async function getUserGamification(userId: string) {
  const [xpTotal, badges, streak] = await Promise.all([
    prisma.xPTransaction.aggregate({
      where: { userId },
      _sum: { amount: true },
    }),
    prisma.earnedBadge.findMany({
      where: { userId },
      include: { badge: true },
      orderBy: { earnedAt: 'desc' },
    }),
    prisma.streak.findUnique({ where: { userId } }),
  ]);

  return {
    totalXP: xpTotal._sum.amount ?? 0,
    badges: badges.map((eb) => ({
      ...eb.badge,
      earnedAt: eb.earnedAt,
    })),
    streak: streak ?? { currentStreak: 0, longestStreak: 0 },
  };
}

export async function awardXP(userId: string, amount: number, reason: string) {
  return prisma.xPTransaction.create({
    data: { userId, amount, reason },
  });
}

export async function updateStreak(userId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const streak = await prisma.streak.findUnique({ where: { userId } });
  if (!streak) {
    return prisma.streak.create({
      data: { userId, currentStreak: 1, longestStreak: 1, lastActiveDate: today },
    });
  }

  const lastActive = new Date(streak.lastActiveDate);
  lastActive.setHours(0, 0, 0, 0);
  const diffDays = Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));

  let currentStreak: number;
  if (diffDays === 0) {
    currentStreak = streak.currentStreak; // Already active today
  } else if (diffDays === 1) {
    currentStreak = streak.currentStreak + 1; // Consecutive day
  } else {
    currentStreak = 1; // Streak broken
  }

  const longestStreak = Math.max(streak.longestStreak, currentStreak);

  return prisma.streak.update({
    where: { userId },
    data: { currentStreak, longestStreak, lastActiveDate: today },
  });
}

// ─── Certificates ────────────────────────────────────────────────

export async function awardCertificate(userId: string, courseId: string) {
  const existing = await prisma.certificate.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });
  if (existing) return existing;

  return prisma.certificate.create({
    data: { userId, courseId },
  });
}

export async function getUserCertificates(userId: string) {
  return prisma.certificate.findMany({
    where: { userId },
    include: { course: { select: { id: true, title: true, slug: true } } },
    orderBy: { issuedAt: 'desc' },
  });
}
