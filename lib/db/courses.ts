import prisma from '@/lib/db/prisma';
import { Difficulty, CourseStatus, Prisma } from '@/lib/generated/prisma/client';

// ─── Course Types ───────────────────────────────────────────────
export type CourseWithRelations = Prisma.CourseGetPayload<{
  include: {
    category: true;
    instructor: { select: { id: true; name: true; avatar: true; bio: true } };
    modules: {
      include: {
        lessons: { orderBy: { sortOrder: 'asc' } };
      };
      orderBy: { sortOrder: 'asc' };
    };
    _count: { select: { enrollments: true; modules: true } };
  };
}>;

export type CourseListItem = Prisma.CourseGetPayload<{
  include: {
    category: true;
    instructor: { select: { id: true; name: true; avatar: true } };
    _count: { select: { enrollments: true; modules: true } };
  };
}>;

export type LessonDetail = Prisma.LessonGetPayload<{
  include: {
    module: {
      include: {
        course: { select: { id: true; title: true; slug: true } };
      };
    };
    quiz: { select: { id: true; title: true } };
  };
}>;

// ─── Query Functions ────────────────────────────────────────────

/** List courses with optional filters */
export async function getCourses(filters?: {
  categorySlug?: string;
  difficulty?: Difficulty;
  search?: string;
  publishedOnly?: boolean;
  limit?: number;
  offset?: number;
}): Promise<CourseListItem[]> {
  const where: Prisma.CourseWhereInput = {};

  if (filters?.publishedOnly !== false) {
    where.status = CourseStatus.PUBLISHED;
  }
  if (filters?.categorySlug) {
    where.category = { slug: filters.categorySlug };
  }
  if (filters?.difficulty) {
    where.difficulty = filters.difficulty;
  }
  if (filters?.search) {
    where.OR = [
      { title: { contains: filters.search, mode: 'insensitive' } },
      { description: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  return prisma.course.findMany({
    where,
    include: {
      category: true,
      instructor: { select: { id: true, name: true, avatar: true } },
      _count: { select: { enrollments: true, modules: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: filters?.limit ?? 50,
    skip: filters?.offset ?? 0,
  });
}

/** Get a single course with full detail (modules, lessons) */
export async function getCourseBySlug(slug: string): Promise<CourseWithRelations | null> {
  return prisma.course.findUnique({
    where: { slug },
    include: {
      category: true,
      instructor: { select: { id: true, name: true, avatar: true, bio: true } },
      modules: {
        include: {
          lessons: { orderBy: { sortOrder: 'asc' } },
        },
        orderBy: { sortOrder: 'asc' },
      },
      _count: { select: { enrollments: true, modules: true } },
    },
  });
}

/** Get a single course by ID */
export async function getCourseById(id: string): Promise<CourseWithRelations | null> {
  return prisma.course.findUnique({
    where: { id },
    include: {
      category: true,
      instructor: { select: { id: true, name: true, avatar: true, bio: true } },
      modules: {
        include: {
          lessons: { orderBy: { sortOrder: 'asc' } },
        },
        orderBy: { sortOrder: 'asc' },
      },
      _count: { select: { enrollments: true, modules: true } },
    },
  });
}

/** Get a lesson with its module and quiz */
export async function getLessonById(id: string): Promise<LessonDetail | null> {
  return prisma.lesson.findUnique({
    where: { id },
    include: {
      module: {
        include: {
          course: { select: { id: true, title: true, slug: true } },
        },
      },
      quiz: { select: { id: true, title: true } },
    },
  });
}

/** Get a lesson by its slug within a course */
export async function getLessonBySlugs(courseSlug: string, lessonSlug: string): Promise<LessonDetail | null> {
  return prisma.lesson.findFirst({
    where: {
      slug: lessonSlug,
      module: { course: { slug: courseSlug } },
    },
    include: {
      module: {
        include: {
          course: { select: { id: true, title: true, slug: true, accessLevel: true, communitySpaceSlug: true } },
        },
      },
      quiz: { select: { id: true, title: true } },
    },
  });
}

/** Get all categories */
export async function getCategories() {
  return prisma.category.findMany({
    include: {
      _count: { select: { courses: true } },
    },
    orderBy: { name: 'asc' },
  });
}

/** Check if a user is enrolled in a course */
export async function getEnrollment(userId: string, courseId: string) {
  return prisma.enrollment.findUnique({
    where: {
      userId_courseId: { userId, courseId },
    },
    include: {
      course: { select: { id: true, title: true, slug: true } },
    },
  });
}

/** Enroll a user in a course */
export async function enrollUser(userId: string, courseId: string) {
  return prisma.enrollment.create({
    data: {
      userId,
      courseId,
    },
  });
}

/** Get user's enrolled courses with progress */
export async function getUserEnrollments(userId: string) {
  return prisma.enrollment.findMany({
    where: { userId },
    include: {
      course: {
        include: {
          category: true,
          instructor: { select: { id: true, name: true, avatar: true } },
          _count: { select: { modules: true } },
        },
      },
    },
    orderBy: { enrolledAt: 'desc' },
  });
}
