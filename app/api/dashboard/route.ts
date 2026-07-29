import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
// TODO: IMPLEMENT REAL AUTH - REVERT FOR PRODUCTION
import { getCurrentUser } from "@/lib/auth/user";
import { getUserAccessSummary } from '@/lib/auth/accessControl';

// GET /api/dashboard — student dashboard summary (courses, gamification, community)
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { id: true, name: true, avatar: true, membershipTier: true },
    });

    if (!dbUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // Fetch all dashboard data in parallel — courses, gamification, community
    const [
      enrollments,
      accessSummary,
      xpTotal,
      badges,
      streak,
      certificates,
      upcomingClasses,
      // Community data
      trendingPosts,
      upcomingEvents,
      studyGroupProgress,
      communityStats,
      recentFeed,
    ] =
      await Promise.all([
        // ── Courses ──
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

        // ── Community: Trending Posts ──
        // Top 3 posts from the last 7 days with most likes, across all spaces
        prisma.communityPost.findMany({
          where: {
            isDeleted: false,
            visibility: 'PUBLIC',
            createdAt: { gte: new Date(Date.now() - 7 * 86_400_000) },
          },
          include: {
            author: { select: { id: true, name: true, username: true, avatar: true, headline: true } },
            _count: { select: { likes: true, comments: true } },
          },
          orderBy: { likes: { _count: 'desc' } },
          take: 5,
        }),

        // ── Community: Upcoming Events ──
        // Next 5 events user RSVP'd to (GOING status)
        prisma.eventRSVP.findMany({
          where: {
            userId: user.id,
            status: 'GOING',
            event: { startDate: { gte: new Date() } },
          },
          include: {
            event: {
              include: {
                creator: { select: { id: true, name: true, username: true, avatar: true } },
                _count: { select: { rsvps: true } },
              },
            },
          },
          orderBy: { event: { startDate: 'asc' } },
          take: 5,
        }),

        // ── Community: Study Group Progress ──
        prisma.courseGroupMember.findMany({
          where: { userId: user.id },
          include: {
            group: {
              include: {
                course: { select: { id: true, title: true, slug: true, thumbnail: true } },
                _count: { select: { members: true, posts: true } },
                posts: {
                  orderBy: { createdAt: 'desc' },
                  take: 3,
                  include: { author: { select: { id: true, name: true, avatar: true } } },
                },
              },
            },
          },
        }),

        // ── Community: Stats ──
        Promise.all([
          prisma.follow.count({ where: { followedId: user.id } }),
          prisma.follow.count({ where: { followerId: user.id } }),
          prisma.communityGroupMember.count({
            where: { userId: user.id, status: 'ACTIVE' },
          }),
          prisma.communityPost.count({ where: { authorId: user.id, isDeleted: false } }),
          prisma.communityComment.count({ where: { authorId: user.id } }),
        ]).then(([followers, following, groups, posts, comments]) => ({
          followers, following, groups, posts, comments,
        })),

        // ── Community: Recent Feed ──
        prisma.feedItem.findMany({
          where: { ownerId: user.id },
          include: {
            actor: { select: { id: true, name: true, username: true, avatar: true } },
          },
          orderBy: { createdAt: 'desc' },
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
        // ── Community ──
        trendingPosts: trendingPosts.map((p) => ({
          id: p.id,
          content: p.content.slice(0, 200), // Preview only
          space: p.space,
          createdAt: p.createdAt,
          author: p.author,
          likeCount: p._count.likes,
          commentCount: p._count.comments,
        })),
        upcomingEvents: upcomingEvents.map((r) => ({
          id: r.event.id,
          title: r.event.title,
          slug: r.event.slug,
          type: r.event.type,
          status: r.event.status,
          startDate: r.event.startDate,
          endDate: r.event.endDate,
          location: r.event.location,
          creator: r.event.creator,
          rsvpCount: r.event._count.rsvps,
        })),
        studyGroupProgress: studyGroupProgress.map((m) => ({
          groupId: m.group.id,
          courseId: m.group.course.id,
          courseTitle: m.group.course.title,
          courseSlug: m.group.course.slug,
          courseThumbnail: m.group.course.thumbnail,
          memberCount: m.group._count.members,
          postCount: m.group._count.posts,
          joinedAt: m.joinedAt,
          recentPosts: m.group.posts.map((p) => ({
            id: p.id,
            content: p.content.slice(0, 150),
            createdAt: p.createdAt,
            author: p.author,
          })),
        })),
        communityStats,
        recentFeed: recentFeed.map((fi) => ({
          id: fi.id,
          type: fi.type,
          entityType: fi.entityType,
          entityId: fi.entityId,
          metadata: fi.metadata,
          createdAt: fi.createdAt,
          actor: fi.actor,
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
