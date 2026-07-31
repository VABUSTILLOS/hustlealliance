import prisma from '@/lib/db/prisma';
import { Prisma, CourseStatus, UserRole, MembershipTier } from '@/lib/generated/prisma/client';

// ─── Types ───────────────────────────────────────────────────────

export type AdminStats = {
  totalUsers: number;
  totalCourses: number;
  totalEnrollments: number;
  totalRevenue: number;
  recentEnrollments: Array<{
    id: string;
    user: { name: string; email: string };
    course: { title: string; slug: string };
    enrolledAt: Date;
    progressPct: number;
  }>;
  usersByRole: { role: UserRole; count: number }[];
  usersByTier: { tier: MembershipTier; count: number }[];
};

export type AdminUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  membershipTier: MembershipTier;
  membershipExpiresAt: Date | null;
  avatar: string | null;
  createdAt: Date;
  _count: { enrollments: number };
};

export type AdminEnrollment = {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: Date;
  expiresAt: Date | null;
  progressPct: number;
  completedAt: Date | null;
  user: { name: string; email: string };
  course: { title: string; slug: string };
};

export type AnalyticsData = {
  enrollmentsByMonth: Array<{ month: string; count: number }>;
  completionsByMonth: Array<{ month: string; count: number }>;
  revenueByMonth: Array<{ month: string; amount: number }>;
  topCourses: Array<{ title: string; enrollments: number; completions: number }>;
  courseCompletionRates: Array<{ title: string; enrolled: number; completed: number; rate: number }>;
};

// ─── Stats ────────────────────────────────────────────────────────

export async function getAdminStats(): Promise<AdminStats> {
  const [
    totalUsers, totalCourses, totalEnrollments, revenueResult,
    recentEnrollments, usersByRole, usersByTier,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.course.count(),
    prisma.enrollment.count(),
    prisma.order.aggregate({
      where: { status: 'COMPLETED' },
      _sum: { amount: true },
    }),
    prisma.enrollment.findMany({
      take: 10,
      orderBy: { enrolledAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } },
        course: { select: { title: true, slug: true } },
      },
    }),
    prisma.user.groupBy({
      by: ['role'],
      _count: { role: true },
    }),
    prisma.user.groupBy({
      by: ['membershipTier'],
      _count: { membershipTier: true },
    }),
  ]);

  return {
    totalUsers,
    totalCourses,
    totalEnrollments,
    totalRevenue: revenueResult._sum.amount || 0,
    recentEnrollments: recentEnrollments.map((e) => ({
      id: e.userId + '_' + e.courseId,
      user: { name: e.user.name || 'Unknown', email: e.user.email },
      course: { title: e.course.title, slug: e.course.slug },
      enrolledAt: e.enrolledAt,
      progressPct: e.progressPct,
    })),
    usersByRole: usersByRole.map((r) => ({ role: r.role, count: r._count.role })),
    usersByTier: usersByTier.map((t) => ({
      tier: t.membershipTier,
      count: t._count.membershipTier,
    })),
  };
}

// ─── Users ────────────────────────────────────────────────────────

export async function getAdminUsers(filters?: {
  search?: string;
  role?: UserRole;
  tier?: MembershipTier;
  limit?: number;
  offset?: number;
}): Promise<{ users: AdminUser[]; total: number }> {
  const where: Prisma.UserWhereInput = {};

  if (filters?.search) {
    where.OR = [
      { name: { contains: filters.search, mode: 'insensitive' } },
      { email: { contains: filters.search, mode: 'insensitive' } },
    ];
  }
  if (filters?.role) where.role = filters.role;
  if (filters?.tier) where.membershipTier = filters.tier;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        membershipTier: true,
        membershipExpiresAt: true,
        avatar: true,
        createdAt: true,
        _count: { select: { enrollments: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: filters?.limit ?? 20,
      skip: filters?.offset ?? 0,
    }),
    prisma.user.count({ where }),
  ]);

  return { users, total };
}

export async function updateUserRole(
  userId: string,
  data: { role?: UserRole; membershipTier?: MembershipTier }
) {
  return prisma.user.update({
    where: { id: userId },
    data,
    select: { id: true, email: true, name: true, role: true, membershipTier: true },
  });
}

// ─── Courses CRUD ─────────────────────────────────────────────────

export async function getAdminCourses(filters?: {
  search?: string;
  status?: CourseStatus;
  limit?: number;
  offset?: number;
}) {
  const where: Prisma.CourseWhereInput = {};

  if (filters?.search) {
    where.title = { contains: filters.search, mode: 'insensitive' };
  }
  if (filters?.status) where.status = filters.status;

  const [courses, total] = await Promise.all([
    prisma.course.findMany({
      where,
      include: {
        category: true,
        instructor: { select: { id: true, name: true } },
        _count: { select: { enrollments: true, modules: true } },
      },
      orderBy: { updatedAt: 'desc' },
      take: filters?.limit ?? 20,
      skip: filters?.offset ?? 0,
    }),
    prisma.course.count({ where }),
  ]);

  return { courses, total };
}

export async function createCourse(data: {
  title: string;
  slug: string;
  tagline?: string;
  description?: string;
  thumbnail?: string;
  difficulty: string;
  accessLevel: string;
  price?: number;
  categoryId: string;
  instructorId: string;
  status?: CourseStatus;
}) {
  const course = await prisma.course.create({
    data: {
      title: data.title,
      slug: data.slug,
      tagline: data.tagline || '',
      description: data.description || '',
      thumbnail: data.thumbnail || '',
      difficulty: data.difficulty as any,
      accessLevel: data.accessLevel as any,
      price: data.price || 0,
      categoryId: data.categoryId,
      instructorId: data.instructorId,
      status: data.status || CourseStatus.DRAFT,
    },
    include: {
      category: true,
      instructor: { select: { id: true, name: true } },
    },
  });

  // Auto-provision a study group (1:1 universal — every course gets one)
  await prisma.courseStudyGroup.create({
    data: { courseId: course.id, description: null },
  });

  return course;
}

export async function updateCourse(
  courseId: string,
  data: {
    title?: string;
    slug?: string;
    tagline?: string;
    description?: string;
    thumbnail?: string;
    difficulty?: string;
    accessLevel?: string;
    price?: number;
    categoryId?: string | null;
    instructorId?: string | null;
    status?: CourseStatus;
    durationWeeks?: number;
    totalMinutes?: number;
  }
) {
  return prisma.course.update({
    where: { id: courseId },
    data: data as any,
    include: {
      category: true,
      instructor: { select: { id: true, name: true } },
      modules: {
        include: { lessons: { orderBy: { sortOrder: 'asc' } } },
        orderBy: { sortOrder: 'asc' },
      },
    },
  });
}

export async function deleteCourse(courseId: string) {
  return prisma.course.delete({ where: { id: courseId } });
}

// ─── Modules & Lessons CRUD ───────────────────────────────────────

export async function createModule(courseId: string, data: { title: string; sortOrder?: number }) {
  const maxSort = await prisma.module.aggregate({
    where: { courseId },
    _max: { sortOrder: true },
  });
  return prisma.module.create({
    data: {
      courseId,
      title: data.title,
      sortOrder: data.sortOrder ?? (maxSort._max.sortOrder ?? -1) + 1,
    },
  });
}

export async function updateModule(moduleId: string, data: { title?: string; sortOrder?: number }) {
  return prisma.module.update({ where: { id: moduleId }, data });
}

export async function deleteModule(moduleId: string) {
  return prisma.module.delete({ where: { id: moduleId } });
}

export async function createLesson(
  moduleId: string,
  data: {
    title: string;
    slug: string;
    content?: string;
    videoUrl?: string;
    durationMinutes?: number;
    sortOrder?: number;
    isPreview?: boolean;
    lessonType?: string;
    accessLevel?: string | null;
  }
) {
  const maxSort = await prisma.lesson.aggregate({
    where: { moduleId },
    _max: { sortOrder: true },
  });
  return prisma.lesson.create({
    data: {
      moduleId,
      title: data.title,
      slug: data.slug,
      content: data.content || '',
      videoUrl: data.videoUrl || '',
      durationMinutes: data.durationMinutes || 0,
      sortOrder: data.sortOrder ?? (maxSort._max.sortOrder ?? -1) + 1,
      isPreview: data.isPreview || false,
      lessonType: (data.lessonType as any) || 'ARTICLE',
      accessLevel: (data.accessLevel as any) || undefined,
    },
  });
}

export async function updateLesson(
  lessonId: string,
  data: {
    title?: string;
    slug?: string;
    content?: string;
    videoUrl?: string;
    durationMinutes?: number;
    sortOrder?: number;
    isPreview?: boolean;
    lessonType?: string;
    accessLevel?: string | null;
  }
) {
  return prisma.lesson.update({
    where: { id: lessonId },
    data: data as any,
  });
}

export async function deleteLesson(lessonId: string) {
  return prisma.lesson.delete({ where: { id: lessonId } });
}

// ─── Enrollments ──────────────────────────────────────────────────

export async function getAdminEnrollments(filters?: {
  courseId?: string;
  search?: string;
  limit?: number;
  offset?: number;
}): Promise<{ enrollments: AdminEnrollment[]; total: number }> {
  const where: Prisma.EnrollmentWhereInput = {};

  if (filters?.courseId) where.courseId = filters.courseId;
  if (filters?.search) {
    where.OR = [
      { user: { name: { contains: filters.search, mode: 'insensitive' } } },
      { user: { email: { contains: filters.search, mode: 'insensitive' } } },
      { course: { title: { contains: filters.search, mode: 'insensitive' } } },
    ];
  }

  const [enrollments, total] = await Promise.all([
    prisma.enrollment.findMany({
      where,
      include: {
        user: { select: { name: true, email: true } },
        course: { select: { title: true, slug: true } },
      },
      orderBy: { enrolledAt: 'desc' },
      take: filters?.limit ?? 20,
      skip: filters?.offset ?? 0,
    }),
    prisma.enrollment.count({ where }),
  ]);

  return { enrollments, total };
}

// ─── Analytics ────────────────────────────────────────────────────

export async function getAnalytics(): Promise<AnalyticsData> {
  const now = new Date();
  const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

  // Enrollment and completion by month
  const [enrollments, completions] = await Promise.all([
    prisma.enrollment.findMany({
      where: { enrolledAt: { gte: twelveMonthsAgo } },
      select: { enrolledAt: true },
      orderBy: { enrolledAt: 'asc' },
    }),
    prisma.enrollment.findMany({
      where: { completedAt: { gte: twelveMonthsAgo, not: null } },
      select: { completedAt: true },
      orderBy: { completedAt: 'asc' },
    }),
  ]);

  // Revenue by month
  const completedOrders = await prisma.order.findMany({
    where: {
      createdAt: { gte: twelveMonthsAgo },
      status: 'COMPLETED',
    },
    select: { amount: true, createdAt: true },
    orderBy: { createdAt: 'asc' },
  });

  // Top courses
  const topCourses = await prisma.course.findMany({
    select: {
      title: true,
      _count: { select: { enrollments: true } },
    },
    orderBy: { enrollments: { _count: 'desc' } },
    take: 10,
  });

  // Course completion rates
  const coursesWithStats = await prisma.course.findMany({
    select: {
      title: true,
      _count: { select: { enrollments: true } },
      enrollments: {
        where: { completedAt: { not: null } },
        select: { id: true },
      },
    },
    take: 20,
  });

  // Build month-by-month arrays
  const months: string[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  }

  const groupByMonth = (items: Array<{ createdAt?: Date | null; enrolledAt?: Date | null; completedAt?: Date | null }>, dateField: 'createdAt' | 'enrolledAt' | 'completedAt') => {
    const map = new Map<string, number>();
    months.forEach((m) => map.set(m, 0));
    items.forEach((item) => {
      const d = item[dateField];
      if (d) {
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        map.set(key, (map.get(key) || 0) + 1);
      }
    });
    return months.map((m) => ({ month: m, count: map.get(m) || 0 }));
  };

  const revenueByMonthMap = new Map<string, number>();
  months.forEach((m) => revenueByMonthMap.set(m, 0));
  completedOrders.forEach((o) => {
    const key = `${o.createdAt.getFullYear()}-${String(o.createdAt.getMonth() + 1).padStart(2, '0')}`;
    revenueByMonthMap.set(key, (revenueByMonthMap.get(key) || 0) + o.amount);
  });

  return {
    enrollmentsByMonth: groupByMonth(enrollments, 'enrolledAt'),
    completionsByMonth: groupByMonth(completions, 'completedAt'),
    revenueByMonth: months.map((m) => ({
      month: m,
      amount: Math.round((revenueByMonthMap.get(m) || 0) * 100) / 100,
    })),
    topCourses: topCourses.map((c) => ({
      title: c.title,
      enrollments: c._count.enrollments,
      completions: 0,
    })),
    courseCompletionRates: coursesWithStats.map((c) => ({
      title: c.title,
      enrolled: c._count.enrollments,
      completed: c.enrollments.length,
      rate: c._count.enrollments > 0
        ? Math.round((c.enrollments.length / c._count.enrollments) * 100)
        : 0,
    })),
  };
}

// ─── Instructors & Categories (for course form dropdowns) ─────────

export async function getInstructors() {
  return prisma.user.findMany({
    where: { role: { in: ['INSTRUCTOR', 'ADMIN'] } },
    select: { id: true, name: true, email: true },
    orderBy: { name: 'asc' },
  });
}

export async function getCategoriesForAdmin() {
  return prisma.category.findMany({ orderBy: { name: 'asc' } });
}
