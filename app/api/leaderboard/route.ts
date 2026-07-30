import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { normalizeAvatarUrl } from '@/lib/utils/avatar';

// GET /api/leaderboard?period=weekly|monthly
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rawPeriod = searchParams.get('period') || 'weekly';
    const period = rawPeriod === 'monthly' ? 'monthly' : 'weekly';
    const days = period === 'monthly' ? 30 : 7;

    const since = new Date();
    since.setDate(since.getDate() - days);
    since.setHours(0, 0, 0, 0);

    // Aggregate XP by user for the period
    const xpAgg = await prisma.xPTransaction.groupBy({
      by: ['userId'],
      where: { createdAt: { gte: since } },
      _sum: { amount: true },
    });

    if (xpAgg.length === 0) {
      return NextResponse.json({ entries: [], period });
    }

    const userIds = xpAgg.map((x) => x.userId);

    // Fetch user profiles + streaks in parallel.
    // The DB stores external URLs (DiceBear, Unsplash) — we normalize them to
    // local JPEG portraits below and filter out users with no real photo.
    const [users, streaks, badges] = await Promise.all([
      prisma.user.findMany({
        where: {
          id: { in: userIds },
          AND: [
            { avatar: { not: null } },
            { avatar: { not: '' } },
          ],
        },
        select: { id: true, name: true, avatar: true, username: true },
      }),
      prisma.streak.findMany({
        where: { userId: { in: userIds } },
        select: { userId: true, currentStreak: true },
      }),
      prisma.earnedBadge.findMany({
        where: { userId: { in: userIds } },
        select: { userId: true, badge: { select: { icon: true, name: true } } },
        orderBy: { earnedAt: 'desc' },
      }),
    ]);

    // Build a map of userId → normalized avatar URL (local JPEG path).
    // Users whose avatar doesn't resolve to a local photo are excluded.
    const userMap = new Map<string, { name: string; avatar: string; username: string | null }>();
    for (const u of users) {
      const normalized = normalizeAvatarUrl(u.avatar);
      if (normalized && normalized.startsWith('/')) {
        userMap.set(u.id, {
          name: u.name,
          avatar: normalized,
          username: u.username,
        });
      }
    }

    const streakMap = new Map(streaks.map((s) => [s.userId, s.currentStreak]));
    const badgeMap = new Map<string, { icon: string; name: string }[]>();
    for (const b of badges) {
      if (!badgeMap.has(b.userId)) badgeMap.set(b.userId, []);
      badgeMap.get(b.userId)!.push({ icon: b.badge.icon, name: b.badge.name });
    }

    // Sort by XP descending, build entries, and filter to users with real local photos.
    // Ranks are reassigned after filtering to ensure sequential ordering.
    const rawEntries = xpAgg
      .sort((a, b) => (b._sum.amount ?? 0) - (a._sum.amount ?? 0))
      .slice(0, 20)
      .map((x) => {
        const u = userMap.get(x.userId);
        if (!u) return null;
        const userBadges = badgeMap.get(x.userId) || [];
        return {
          username: u.username ?? x.userId,
          name: u.name,
          avatar: u.avatar,
          xp: x._sum.amount ?? 0,
          streak: streakMap.get(x.userId) ?? 0,
          badges: userBadges,
        };
      })
      .filter((e): e is NonNullable<typeof e> => e !== null);

    const entries = rawEntries.map((e, i) => ({ rank: i + 1, ...e }));

    console.log('[GET /api/leaderboard] period=%s rawUsers=%d normalizedUsers=%d entries=%d',
      period, users.length, userMap.size, entries.length);

    return NextResponse.json(
      { entries, period },
      { headers: { 'Cache-Control': 'public, max-age=60, stale-while-revalidate=120' } }
    );
  } catch (error) {
    console.error('[GET /api/leaderboard]', error);
    return NextResponse.json({ error: 'Failed to load leaderboard' }, { status: 500 });
  }
}
