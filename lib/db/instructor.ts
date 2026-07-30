import prisma from '@/lib/db/prisma';
import { Prisma } from '@/lib/generated/prisma/client';
import { normalizeAvatarUrl } from '@/lib/utils/avatar';

// ─── Types ───────────────────────────────────────────────────────

export type InstructorCourseSummary = {
  id: string;
  title: string;
  slug: string;
  status: string;
  thumbnail: string | null;
  studentCount: number;
  avgProgress: number;
  totalLessons: number;
  lastActivity: Date | null;
};

export type StudentProgressEntry = {
  userId: string;
  userName: string;
  userEmail: string;
  avatar: string | null;
  enrolledAt: Date;
  progressPct: number;
  completedAt: Date | null;
  lastActiveAt: Date | null;
  completedLessons: number;
  totalLessons: number;
};

export type StudentLessonDetail = {
  lessonId: string;
  title: string;
  moduleTitle: string;
  sortOrder: number;
  completed: boolean;
  completedAt: Date | null;
  videoPosition: number;
  lastAccessedAt: Date | null;
};

export type QuizResultSummary = {
  quizId: string;
  lessonTitle: string;
  moduleTitle: string;
  totalAttempts: number;
  avgScore: number;
  passRate: number;
  passCount: number;
  failCount: number;
};

export type StudentQuizAttempt = {
  attemptId: string;
  userId: string;
  userName: string;
  userEmail: string;
  score: number;
  passed: boolean;
  submittedAt: Date;
};

// ─── Instructor Courses ──────────────────────────────────────────

export async function getInstructorCourses(userId: string): Promise<InstructorCourseSummary[]> {
  const courses = await prisma.course.findMany({
    where: { instructorId: userId },
    include: {
      _count: { select: { enrollments: true } },
      enrollments: {
        select: { progressPct: true, userId: true },
      },
      modules: {
        select: {
          _count: { select: { lessons: true } },
        },
      },
    },
    orderBy: { updatedAt: 'desc' },
  });

  // Get last activity for each course
  const courseIds = courses.map((c) => c.id);
  const lastProgress = await prisma.lessonProgress.groupBy({
    by: ['lessonId'],
    where: {
      lesson: { module: { courseId: { in: courseIds } } },
    },
    _max: { lastAccessedAt: true },
  });

  // Build a map of courseId → latest lastAccessedAt
  const lessonToCourseMap = new Map<string, string>();
  const courseModules = await prisma.module.findMany({
    where: { courseId: { in: courseIds } },
    select: { id: true, courseId: true, lessons: { select: { id: true } } },
  });
  for (const mod of courseModules) {
    for (const lesson of mod.lessons) {
      lessonToCourseMap.set(lesson.id, mod.courseId);
    }
  }

  const courseLastActive = new Map<string, Date>();
  for (const lp of lastProgress) {
    if (lp._max.lastAccessedAt) {
      const courseId = lessonToCourseMap.get(lp.lessonId);
      if (courseId) {
        const current = courseLastActive.get(courseId);
        if (!current || lp._max.lastAccessedAt > current) {
          courseLastActive.set(courseId, lp._max.lastAccessedAt);
        }
      }
    }
  }

  return courses.map((c) => {
    const totalLessons = c.modules.reduce((sum, m) => sum + m._count.lessons, 0);
    const avgProgress = c._count.enrollments > 0
      ? Math.round(c.enrollments.reduce((sum, e) => sum + e.progressPct, 0) / c._count.enrollments)
      : 0;

    return {
      id: c.id,
      title: c.title,
      slug: c.slug,
      status: c.status,
      thumbnail: c.thumbnail,
      studentCount: c._count.enrollments,
      avgProgress,
      totalLessons,
      lastActivity: courseLastActive.get(c.id) || null,
    };
  });
}

// ─── Course Students ─────────────────────────────────────────────

export async function getCourseStudents(courseId: string): Promise<{
  course: { id: string; title: string; slug: string };
  students: StudentProgressEntry[];
}> {
  const [course, enrollments] = await Promise.all([
    prisma.course.findUnique({
      where: { id: courseId },
      select: { id: true, title: true, slug: true },
    }),
    prisma.enrollment.findMany({
      where: { courseId },
      include: {
        user: { select: { id: true, name: true, email: true, avatar: true } },
      },
      orderBy: { enrolledAt: 'desc' },
    }),
  ]);

  if (!course) throw new Error('Course not found');

  // Count total lessons in course
  const totalLessons = await prisma.lesson.count({
    where: { module: { courseId } },
  });

  // Get last activity per student
  const userIds = enrollments.map((e) => e.userId);
  const progressEntries = await prisma.lessonProgress.groupBy({
    by: ['userId'],
    where: {
      userId: { in: userIds },
      lesson: { module: { courseId } },
    },
    _max: { lastAccessedAt: true },
  });

  const lastActiveMap = new Map<string, Date>();
  for (const p of progressEntries) {
    if (p._max.lastAccessedAt) lastActiveMap.set(p.userId, p._max.lastAccessedAt);
  }

  // Count completed lessons per student
  const completedCounts = await prisma.lessonProgress.groupBy({
    by: ['userId'],
    where: {
      userId: { in: userIds },
      lesson: { module: { courseId } },
      completed: true,
    },
    _count: { completed: true },
  });

  const completedMap = new Map<string, number>();
  for (const c of completedCounts) {
    completedMap.set(c.userId, c._count.completed);
  }

  return {
    course,
    students: enrollments.map((e) => ({
      userId: e.userId,
      userName: e.user.name || 'Unknown',
      userEmail: e.user.email,
      avatar: normalizeAvatarUrl(e.user.avatar),
      enrolledAt: e.enrolledAt,
      progressPct: e.progressPct,
      completedAt: e.completedAt,
      lastActiveAt: lastActiveMap.get(e.userId) || null,
      completedLessons: completedMap.get(e.userId) || 0,
      totalLessons,
    })),
  };
}

// ─── Student Course Detail ───────────────────────────────────────

export async function getStudentCourseDetail(
  userId: string,
  courseId: string
): Promise<{
  student: { name: string; email: string; avatar: string | null };
  course: { title: string; slug: string };
  lessons: StudentLessonDetail[];
  progressPct: number;
}> {
  const [student, course, enrollment, modules] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true, avatar: true },
    }),
    prisma.course.findUnique({
      where: { id: courseId },
      select: { title: true, slug: true },
    }),
    prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
      select: { progressPct: true },
    }),
    prisma.module.findMany({
      where: { courseId },
      include: {
        lessons: {
          orderBy: { sortOrder: 'asc' },
          select: { id: true, title: true, sortOrder: true },
        },
      },
      orderBy: { sortOrder: 'asc' },
    }),
  ]);

  if (!student || !course) throw new Error('Not found');

  const lessonIds = modules.flatMap((m) => m.lessons.map((l) => l.id));
  const progressRecords = await prisma.lessonProgress.findMany({
    where: { userId, lessonId: { in: lessonIds } },
    select: { lessonId: true, completed: true, completedAt: true, videoPositionSeconds: true, lastAccessedAt: true },
  });

  const progressMap = new Map(progressRecords.map((p) => [p.lessonId, p]));

  const lessons: StudentLessonDetail[] = [];
  for (const mod of modules) {
    for (const lesson of mod.lessons) {
      const prog = progressMap.get(lesson.id);
      lessons.push({
        lessonId: lesson.id,
        title: lesson.title,
        moduleTitle: mod.title,
        sortOrder: lesson.sortOrder,
        completed: prog?.completed || false,
        completedAt: prog?.completedAt || null,
        videoPosition: prog?.videoPositionSeconds || 0,
        lastAccessedAt: prog?.lastAccessedAt || null,
      });
    }
  }

  return {
    student,
    course,
    lessons,
    progressPct: enrollment?.progressPct || 0,
  };
}

// ─── Quiz Results ────────────────────────────────────────────────

export async function getCourseQuizResults(courseId: string): Promise<{
  quizzes: QuizResultSummary[];
  attempts: StudentQuizAttempt[];
}> {
  const quizzes = await prisma.quiz.findMany({
    where: { lesson: { module: { courseId } } },
    include: {
      lesson: {
        select: { title: true, module: { select: { title: true } } },
      },
      attempts: {
        select: { score: true, passed: true },
      },
    },
  });

  const quizSummaries: QuizResultSummary[] = quizzes.map((q) => ({
    quizId: q.id,
    lessonTitle: q.lesson.title,
    moduleTitle: q.lesson.module.title,
    totalAttempts: q.attempts.length,
    avgScore: q.attempts.length > 0
      ? Math.round(q.attempts.reduce((sum, a) => sum + (a.score ?? 0), 0) / q.attempts.length)
      : 0,
    passRate: q.attempts.length > 0
      ? Math.round((q.attempts.filter((a) => a.passed).length / q.attempts.length) * 100)
      : 0,
    passCount: q.attempts.filter((a) => a.passed).length,
    failCount: q.attempts.filter((a) => !a.passed).length,
  }));

  // Get recent attempts with user info
  const quizIds = quizzes.map((q) => q.id);
  const recentAttempts = await prisma.quizAttempt.findMany({
    where: { quizId: { in: quizIds } },
    include: {
      user: { select: { id: true, name: true, email: true } },
      quiz: { select: { id: true } },
    },
    orderBy: { submittedAt: 'desc' },
    take: 100,
  });

  const attempts: StudentQuizAttempt[] = recentAttempts.map((a) => ({
    attemptId: a.id,
    userId: a.userId,
    userName: a.user.name || 'Unknown',
    userEmail: a.user.email,
    score: a.score ?? 0,
    passed: a.passed ?? false,
    submittedAt: a.submittedAt || a.startedAt,
  }));

  return { quizzes: quizSummaries, attempts };
}

// ─── Live Classes ────────────────────────────────────────────────

export async function getInstructorLiveClasses(userId: string) {
  return prisma.liveClass.findMany({
    where: { instructorId: userId },
    include: {
      course: { select: { id: true, title: true } },
      _count: { select: { registrations: true } },
      registrations: {
        include: { user: { select: { id: true, name: true, email: true } } },
      },
    },
    orderBy: { startsAt: 'asc' },
  });
}

export async function createLiveClass(data: {
  instructorId: string;
  title: string;
  description?: string;
  courseId?: string;
  platform?: string;
  meetingUrl?: string;
  roomName?: string;
  startsAt: string;
  endsAt?: string;
  maxAttendees?: number;
}) {
  return prisma.liveClass.create({
    data: {
      title: data.title,
      description: data.description || '',
      instructorId: data.instructorId,
      courseId: data.courseId || undefined,
      platform: data.platform || 'JITSI',
      meetingUrl: data.meetingUrl || '',
      roomName: data.roomName || `class-${Date.now()}`,
      startsAt: new Date(data.startsAt),
      endsAt: data.endsAt ? new Date(data.endsAt) : new Date(new Date(data.startsAt).getTime() + 60 * 60 * 1000),
      maxAttendees: data.maxAttendees || 100,
    },
    include: {
      course: { select: { id: true, title: true } },
      _count: { select: { registrations: true } },
    },
  });
}

export async function updateLiveClass(
  classId: string,
  data: {
    title?: string;
    description?: string;
    courseId?: string | null;
    platform?: string;
    meetingUrl?: string;
    roomName?: string;
    startsAt?: string;
    endsAt?: string;
    maxAttendees?: number;
  }
) {
  const updateData: any = { ...data };
  if (data.startsAt) updateData.startsAt = new Date(data.startsAt);
  if (data.endsAt) updateData.endsAt = new Date(data.endsAt);
  if (data.meetingUrl === '') updateData.meetingUrl = '';
  if (data.roomName === '') updateData.roomName = '';

  return prisma.liveClass.update({
    where: { id: classId },
    data: updateData,
    include: {
      course: { select: { id: true, title: true } },
      _count: { select: { registrations: true } },
    },
  });
}

export async function deleteLiveClass(classId: string) {
  return prisma.liveClass.delete({ where: { id: classId } });
}
