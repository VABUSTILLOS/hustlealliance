import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, authErrorResponse } from '@/lib/auth/guard';
import prisma from '@/lib/db/prisma';

// GET /api/admin/analytics/community?range=7d|30d|90d|all
// Community engagement analytics: top posts, top hashtags, referral funnel.
export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
  } catch (err) {
    return authErrorResponse(err);
  }

  const { searchParams } = request.nextUrl;
  // Accept either ?days=30 (page convention) or ?range=7d|30d|90d|all
  const daysParam = searchParams.get('days');
  const rangeParam = searchParams.get('range') || '30d';
  const days = daysParam ? Number(daysParam) || 30 : rangeParam === '7d' ? 7 : rangeParam === '90d' ? 90 : rangeParam === 'all' ? null : 30;
  const since = days ? new Date(Date.now() - days * 86400000) : null;

  try {
    const [topPosts, topHashtags, referralData, totals] = await Promise.all([
      // Top posts by engagement (likes + comments + shares)
      prisma.communityPost.findMany({
        where: {
          isDeleted: false,
          ...(since ? { createdAt: { gte: since } } : {}),
        },
        select: {
          id: true,
          content: true,
          excerpt: true,
          createdAt: true,
          space: true,
          author: { select: { name: true, avatar: true } },
          _count: { select: { likes: true, comments: true, shares: true, bookmarks: true } },
        },
        orderBy: [
          { likes: { _count: 'desc' } },
          { comments: { _count: 'desc' } },
        ],
        take: 10,
      }),
      // Top hashtags by post count
      prisma.hashtag.findMany({
        orderBy: { postCount: 'desc' },
        take: 15,
        select: { name: true, postCount: true },
      }),
      // Referral funnel
      prisma.referral.groupBy({
        by: ['status'],
        _count: { _all: true },
      }),
      // Totals for the range
      prisma.$transaction([
        prisma.communityPost.count({ where: { isDeleted: false, ...(since ? { createdAt: { gte: since } } : {}) } }),
        prisma.communityComment.count({ where: since ? { createdAt: { gte: since } } : {} }),
        prisma.postLike.count({ where: since ? { createdAt: { gte: since } } : {} }),
        prisma.communityShare.count({ where: since ? { createdAt: { gte: since } } : {} }),
        prisma.postBookmark.count({ where: since ? { createdAt: { gte: since } } : {} }),
      ]),
    ]);

    const referralMap: Record<string, number> = {};
    for (const r of referralData) referralMap[r.status] = r._count._all;
    const total = Object.values(referralMap).reduce((a, b) => a + b, 0);

    return NextResponse.json({
      range: days ? `${days}d` : 'all',
      totals: {
        posts: totals[0],
        comments: totals[1],
        likes: totals[2],
        shares: totals[3],
        bookmarks: totals[4],
      },
      topPosts: topPosts.map((p) => ({
        id: p.id,
        text: p.excerpt || p.content?.slice(0, 120) || '',
        author: p.author.name,
        avatar: p.author.avatar,
        space: p.space,
        createdAt: p.createdAt.toISOString(),
        likes: p._count.likes,
        comments: p._count.comments,
        shares: p._count.shares,
        bookmarks: p._count.bookmarks,
      })),
      topHashtags: topHashtags.map((h) => ({ name: h.name, postCount: h.postCount })),
      referralFunnel: {
        total,
        pending: referralMap.PENDING || 0,
        converted: referralMap.CONVERTED || 0,
        rewarded: referralMap.REWARDED || 0,
        byStatus: referralMap,
      },
    });
  } catch (err) {
    console.error('[GET /api/admin/analytics/community]', err);
    return NextResponse.json({ error: 'Failed to fetch community analytics' }, { status: 500 });
  }
}
