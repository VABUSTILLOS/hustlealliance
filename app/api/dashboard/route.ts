import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { createClient } from '@/lib/supabase/server';
import { getUserAccessSummary } from '@/lib/auth/accessControl';

// GET /api/dashboard — student dashboard summary
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { id: true, name: true, avatar: true, membershipTier: true },
    });

    if (!dbUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // Fetch all dashboard data in parallel
    const [enrollments, accessSummary, xpTotal, badges, streak, certificates, upcomingClasses] =
      await Promise.all([
        // Enrolled courses with progress
        prisma.enrollment.findMany({
          where: { userId: user.id },
          include: {
            course: {
              include: {
                category: true,
                instructor: { select: { id: true, name: true, avatar: true } },
                modules: {
                  include: {
                    lessons: {
                      include: {
                        progress: { where: { userId: user.id }, select: { completed: true } },
                      },
                    },
                  },
                },
              },
            },
          },
          orderBy: { enrolledAt: 'desc' },
        }),
        // Access summary (tier + entitlements)
        getUserAccessSummary(user.id),
        // XP total
        prisma.xPTransaction.aggregate({
          where: { userId: user.id },
          _sum: { amount: true },
        }),
        // Badges
        prisma.earnedBadge.findMany({
          where: { userId: user.id },
          include: { badge: true },
          orderBy: { earnedAt: 'desc' },
        }),
        // Streak
        prisma.streak.findUnique({ where: { userId: user.id } }),
        // Certificates
        prisma.certificate.findMany({
          where: { userId: user.id },
          include: { course: { select: { title: true, slug: true } } },
          orderBy: { issuedAt: 'desc' },
        }),
        // Upcoming live classes user registered for
        prisma.liveClassRegistration.findMany({
          where: {
            userId: user.id,
            liveClass: { startsAt: { gte: new Date() } },
          },
          include: {
            liveClass: {
              include: {
                instructor: { select: { name: true } },
              },
            },
          },
          orderBy: { liveClass: { startsAt: 'asc' } },
          take: 5,
        }),
      ]);

    // Calculate progress for each enrollment
    const courses = enrollments.map((enrollment) => {
      const totalLessons = enrollment.course.modules.reduce((s, m) => s + m.lessons.length, 0);
      const completedLessons = enrollment.course.modules.reduce(
        (s, m) => s + m.lessons.filter((l) => l.progress.length > 0 && l.progress[0].completed).length,
        0
      );
      return {
        id: enrollment.course.id,
        title: enrollment.course.title,
        slug: enrollment.course.slug,
        tagline: enrollment.course.tagline,
        difficulty: enrollment.course.difficulty,
        accessLevel: enrollment.course.accessLevel,
        thumbnail: enrollment.course.thumbnail,
        instructor: enrollment.course.instructor,
        category: enrollment.course.category,
        totalLessons,
        completedLessons,
        percentage: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
        enrolledAt: enrollment.enrolledAt,
        completedAt: enrollment.completedAt,
      };
    });

    return NextResponse.json(
      {
        user: dbUser,
        courses,
        access: accessSummary,
        gamification: {
          totalXP: xpTotal._sum.amount ?? 0,
          badges: badges.map((eb) => ({ ...eb.badge, earnedAt: eb.earnedAt })),
          streak: streak ?? { currentStreak: 0, longestStreak: 0 },
          certificates,
        },
        upcomingClasses: upcomingClasses.map((r) => ({
          id: r.liveClass.id,
          title: r.liveClass.title,
          startsAt: r.liveClass.startsAt,
          meetingUrl: r.liveClass.meetingUrl,
          roomName: r.liveClass.roomName,
          instructor: r.liveClass.instructor.name,
        })),
      },
      {
        headers: { 'Cache-Control': 'private, max-age=10, stale-while-revalidate=30' },
      }
    );
  } catch (error) {
    console.error('[GET /api/dashboard] Error:', error);
    return NextResponse.json({ error: 'Failed to load dashboard' }, { status: 500 });
  }
}
