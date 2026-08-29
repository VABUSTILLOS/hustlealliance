import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { getCurrentUser } from '@/lib/auth/user';
import { authErrorResponse } from '@/lib/auth/guard';

// GET /api/recommendations — personalized suggestions for the dashboard.
// Uses onboarding answers + leadScore + enrolled course categories to match
// courses, spaces (SPACE groups), and upcoming events the user isn't in yet.
export async function GET(_request: NextRequest) {
  let user;
  try {
    user = await getCurrentUser();
  } catch (err) {
    return authErrorResponse(err);
  }
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    // Gather the user's interests
    const [answers, enrollments, memberships, rsvps] = await Promise.all([
      prisma.onboardingAnswer.findMany({
        where: { userId: user.id },
        include: { question: { select: { question: true } } },
      }),
      prisma.enrollment.findMany({ where: { userId: user.id }, select: { courseId: true } }),
      prisma.communityGroupMember.findMany({ where: { userId: user.id }, select: { groupId: true } }),
      prisma.eventRSVP.findMany({ where: { userId: user.id }, select: { eventId: true } }),
    ]);

    const enrolledIds = new Set(enrollments.map((e) => e.courseId));
    const joinedGroupIds = new Set(memberships.map((m) => m.groupId));
    const rsvpEventIds = new Set(rsvps.map((r) => r.eventId));

    // Extract interest keywords from answers (plain text + JSON arrays)
    const interestTokens = new Set<string>();
    for (const a of answers) {
      try {
        const parsed = JSON.parse(a.answer);
        if (Array.isArray(parsed)) parsed.forEach((v) => typeof v === 'string' && interestTokens.add(v.toLowerCase()));
        else if (typeof parsed === 'string') interestTokens.add(parsed.toLowerCase());
      } catch {
        interestTokens.add(a.answer.toLowerCase());
      }
    }
    // Fall back to broad terms when no onboarding answers exist yet
    if (interestTokens.size === 0) {
      ['business', 'mindset', 'sales', 'marketing', 'fitness'].forEach((k) => interestTokens.add(k));
    }

    const tokenList = Array.from(interestTokens);

    // ── Courses: prefer same categories as enrolled, exclude already-enrolled ──
    const enrolledCategoryRows = await prisma.enrollment.findMany({
      where: { userId: user.id },
      select: { course: { select: { categoryId: true } } },
    });
    const categoryIds = Array.from(new Set(enrolledCategoryRows.map((e) => e.course.categoryId)));
    const categoryFilter =
      categoryIds.length > 0 ? { categoryId: { in: categoryIds } } : {};

    const courses = await prisma.course.findMany({
      where: { ...categoryFilter, id: { notIn: Array.from(enrolledIds) } },
      select: {
        id: true,
        title: true,
        slug: true,
        tagline: true,
        thumbnail: true,
        difficulty: true,
        accessLevel: true,
        category: { select: { name: true } },
      },
      orderBy: [{ enrollments: { _count: 'desc' } }, { createdAt: 'desc' }],
      take: 6,
    });

    // ── Spaces: SPACE-kind groups not yet joined, score by tag match ──
    const groups = await prisma.communityGroup.findMany({
      where: { kind: 'SPACE', id: { notIn: Array.from(joinedGroupIds) } },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        avatar: true,
        memberCount: true,
      },
      orderBy: { memberCount: 'desc' },
      take: 12,
    });
    const spaces = groups
      .map((g) => {
        const haystack = `${g.name} ${g.description ?? ''}`.toLowerCase();
        const score = tokenList.reduce((s, t) => s + (haystack.includes(t) ? 1 : 0), 0);
        return { ...g, _score: score };
      })
      .sort((a, b) => b._score - a._score)
      .slice(0, 4)
      .map(({ _score: _s, ...g }) => g);

    // ── Events: upcoming, not RSVP'd, prefer featured ──
    const events = await prisma.event.findMany({
      where: {
        status: 'UPCOMING',
        startDate: { gte: new Date() },
        id: { notIn: Array.from(rsvpEventIds) },
      },
      select: {
        id: true,
        title: true,
        slug: true,
        type: true,
        startDate: true,
        location: true,
        isFeatured: true,
      },
      orderBy: [{ isFeatured: 'desc' }, { startDate: 'asc' }],
      take: 4,
    });

    return NextResponse.json({
      interests: tokenList.slice(0, 8),
      courses,
      spaces,
      events: events.map((e) => ({
        ...e,
        startDate: e.startDate.toISOString(),
      })),
    });
  } catch (err) {
    console.error('[GET /api/recommendations]', err);
    return NextResponse.json({ error: 'Failed to load recommendations' }, { status: 500 });
  }
}
