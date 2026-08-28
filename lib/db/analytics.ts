import prisma from '@/lib/db/prisma';
import { MembershipTier } from '@/lib/generated/prisma/client';

// ─── Shared helpers ─────────────────────────────────────────────────

/** Clamp a requested day-range to a sane window. */
export function clampDays(raw: string | null, fallback = 90): number {
  const n = Number(raw);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(365, Math.max(7, Math.trunc(n)));
}

function sinceDate(days: number): Date {
  const since = new Date();
  since.setDate(since.getDate() - days);
  since.setHours(0, 0, 0, 0);
  return since;
}

type DailyCountRow = { bucket: Date; count: bigint };
type WeeklyCountRow = { bucket: Date; count: bigint };

function toDaySeries(rows: DailyCountRow[]): Array<{ date: string; count: number }> {
  return rows.map((r) => ({ date: new Date(r.bucket).toISOString().slice(0, 10), count: Number(r.count) }));
}

// ─── Growth ─────────────────────────────────────────────────────────

export type GrowthData = {
  series: Array<{ date: string; count: number }>;
  cumulative: Array<{ date: string; total: number }>;
  totals: {
    totalMembers: number;
    newThisWeek: number;
    byTier: Array<{ tier: MembershipTier; count: number }>;
  };
};

export async function getGrowthAnalytics(days: number): Promise<GrowthData> {
  const since = sinceDate(days);
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const [dailyRows, totalMembers, newThisWeek, byTierRaw, priorTotal] = await Promise.all([
    prisma.$queryRaw<DailyCountRow[]>`
      SELECT date_trunc('day', "createdAt") AS bucket, COUNT(*) AS count
      FROM "User"
      WHERE "createdAt" >= ${since}
      GROUP BY bucket
      ORDER BY bucket ASC
    `,
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: weekAgo } } }),
    prisma.user.groupBy({ by: ['membershipTier'], _count: { _all: true } }),
    prisma.user.count({ where: { createdAt: { lt: since } } }),
  ]);

  const series = toDaySeries(dailyRows);

  let running = priorTotal;
  const cumulative = series.map((point) => {
    running += point.count;
    return { date: point.date, total: running };
  });

  return {
    series,
    cumulative,
    totals: {
      totalMembers,
      newThisWeek,
      byTier: byTierRaw.map((t) => ({ tier: t.membershipTier, count: t._count._all })),
    },
  };
}

// ─── Retention (DAU/WAU/MAU via activity proxies) ──────────────────

export type RetentionData = {
  activitySource: string;
  series: Array<{ date: string; dau: number; wau: number; mau: number }>;
  cohorts: Array<{ signupWeek: string; cohortSize: number; retention: number[] }> | null;
};

/**
 * DAU/WAU/MAU are approximated from engagement events since User has no
 * lastActiveAt column. "Active" = created a CommunityPost, CommunityComment,
 * PostLike, Message, or LessonProgress update in the window.
 */
const ACTIVITY_SOURCE = 'engagement_events(post,comment,like,message,lesson_progress)';

async function getActiveUserIdsSince(since: Date): Promise<Array<{ userId: string; at: Date }>> {
  const [posts, comments, likes, messages, lessons] = await Promise.all([
    prisma.communityPost.findMany({ where: { createdAt: { gte: since } }, select: { authorId: true, createdAt: true } }),
    prisma.communityComment.findMany({ where: { createdAt: { gte: since } }, select: { authorId: true, createdAt: true } }),
    prisma.postLike.findMany({ where: { createdAt: { gte: since } }, select: { userId: true, createdAt: true } }),
    prisma.message.findMany({ where: { createdAt: { gte: since } }, select: { senderId: true, createdAt: true } }),
    prisma.lessonProgress.findMany({ where: { lastAccessedAt: { gte: since } }, select: { userId: true, lastAccessedAt: true } }),
  ]);

  return [
    ...posts.map((p) => ({ userId: p.authorId, at: p.createdAt })),
    ...comments.map((c) => ({ userId: c.authorId, at: c.createdAt })),
    ...likes.map((l) => ({ userId: l.userId, at: l.createdAt })),
    ...messages.map((m) => ({ userId: m.senderId, at: m.createdAt })),
    ...lessons.map((l) => ({ userId: l.userId, at: l.lastAccessedAt })),
  ];
}

export async function getRetentionAnalytics(days: number): Promise<RetentionData> {
  const since = sinceDate(days);
  const events = await getActiveUserIdsSince(since);

  // Build weekly buckets across the range.
  const weeks: Date[] = [];
  const cursor = new Date(since);
  // Align to start-of-week (Sunday) for stable buckets.
  cursor.setDate(cursor.getDate() - cursor.getDay());
  const end = new Date();
  while (cursor <= end) {
    weeks.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 7);
  }

  const series = weeks.map((weekStart) => {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);
    const dayStart = new Date(weekEnd);
    dayStart.setDate(dayStart.getDate() - 1);

    const dau = new Set(events.filter((e) => e.at >= dayStart && e.at < weekEnd).map((e) => e.userId)).size;
    const wau = new Set(events.filter((e) => e.at >= weekStart && e.at < weekEnd).map((e) => e.userId)).size;
    const monthStart = new Date(weekEnd);
    monthStart.setDate(monthStart.getDate() - 28);
    const mau = new Set(events.filter((e) => e.at >= monthStart && e.at < weekEnd).map((e) => e.userId)).size;

    return { date: weekStart.toISOString().slice(0, 10), dau, wau, mau };
  });

  // 4-week cohort retention: for each signup week, % of new users active in weeks 1..4 after signup.
  let cohorts: RetentionData['cohorts'] = null;
  if (events.length > 0) {
    const signupWeeks = weeks.slice(0, Math.max(0, weeks.length - 4)); // need 4 following weeks of data
    if (signupWeeks.length > 0) {
      const cohortUsers = await prisma.user.findMany({
        where: { createdAt: { gte: since } },
        select: { id: true, createdAt: true },
      });

      const eventsByUser = new Map<string, Date[]>();
      for (const e of events) {
        const arr = eventsByUser.get(e.userId) ?? [];
        arr.push(e.at);
        eventsByUser.set(e.userId, arr);
      }

      cohorts = signupWeeks.map((weekStart) => {
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 7);
        const cohortUserIds = cohortUsers
          .filter((u) => u.createdAt >= weekStart && u.createdAt < weekEnd)
          .map((u) => u.id);

        const retention = [1, 2, 3, 4].map((offset) => {
          if (cohortUserIds.length === 0) return 0;
          const winStart = new Date(weekEnd);
          winStart.setDate(winStart.getDate() + (offset - 1) * 7);
          const winEnd = new Date(winStart);
          winEnd.setDate(winEnd.getDate() + 7);

          const activeInWindow = cohortUserIds.filter((uid) => {
            const times = eventsByUser.get(uid);
            if (!times) return false;
            return times.some((t) => t >= winStart && t < winEnd);
          }).length;

          return cohortUserIds.length > 0 ? Number(((activeInWindow / cohortUserIds.length) * 100).toFixed(1)) : 0;
        });

        return {
          signupWeek: weekStart.toISOString().slice(0, 10),
          cohortSize: cohortUserIds.length,
          retention,
        };
      }).filter((c) => c.cohortSize > 0);

      if (cohorts.length === 0) cohorts = null;
    }
  }

  return { activitySource: ACTIVITY_SOURCE, series, cohorts };
}

// ─── Engagement ──────────────────────────────────────────────────────

export type EngagementData = {
  series: Array<{
    date: string;
    posts: number;
    comments: number;
    likes: number;
    messages: number;
    lessonCompletions: number;
  }>;
  totals: {
    posts: number;
    comments: number;
    likes: number;
    messages: number;
    lessonCompletions: number;
  };
  /** Percent change vs the immediately preceding window of the same length. */
  deltas: {
    posts: number | null;
    comments: number | null;
    likes: number | null;
    messages: number | null;
    lessonCompletions: number | null;
  };
};

function pctChange(current: number, prior: number): number | null {
  if (prior === 0) return current > 0 ? 100 : null;
  return Number((((current - prior) / prior) * 100).toFixed(1));
}

export async function getEngagementAnalytics(days: number): Promise<EngagementData> {
  const since = sinceDate(days);
  const priorSince = sinceDate(days * 2);

  const [postsRows, commentsRows, likesRows, messagesRows, lessonRows] = await Promise.all([
    prisma.$queryRaw<WeeklyCountRow[]>`
      SELECT date_trunc('week', "createdAt") AS bucket, COUNT(*) AS count
      FROM "CommunityPost" WHERE "createdAt" >= ${since} GROUP BY bucket ORDER BY bucket ASC
    `,
    prisma.$queryRaw<WeeklyCountRow[]>`
      SELECT date_trunc('week', "createdAt") AS bucket, COUNT(*) AS count
      FROM "CommunityComment" WHERE "createdAt" >= ${since} GROUP BY bucket ORDER BY bucket ASC
    `,
    prisma.$queryRaw<WeeklyCountRow[]>`
      SELECT date_trunc('week', "createdAt") AS bucket, COUNT(*) AS count
      FROM "PostLike" WHERE "createdAt" >= ${since} GROUP BY bucket ORDER BY bucket ASC
    `,
    prisma.$queryRaw<WeeklyCountRow[]>`
      SELECT date_trunc('week', "createdAt") AS bucket, COUNT(*) AS count
      FROM "Message" WHERE "createdAt" >= ${since} GROUP BY bucket ORDER BY bucket ASC
    `,
    prisma.$queryRaw<WeeklyCountRow[]>`
      SELECT date_trunc('week', "completedAt") AS bucket, COUNT(*) AS count
      FROM "LessonProgress" WHERE "completed" = true AND "completedAt" >= ${since} GROUP BY bucket ORDER BY bucket ASC
    `,
  ]);

  // Prior-window totals (the `days` period ending at `since`) for deltas.
  const [priorPosts, priorComments, priorLikes, priorMessages, priorLessons] = await Promise.all([
    prisma.communityPost.count({ where: { createdAt: { gte: priorSince, lt: since } } }),
    prisma.communityComment.count({ where: { createdAt: { gte: priorSince, lt: since } } }),
    prisma.postLike.count({ where: { createdAt: { gte: priorSince, lt: since } } }),
    prisma.message.count({ where: { createdAt: { gte: priorSince, lt: since } } }),
    prisma.lessonProgress.count({ where: { completed: true, completedAt: { gte: priorSince, lt: since } } }),
  ]);

  const buckets = new Map<string, { posts: number; comments: number; likes: number; messages: number; lessonCompletions: number }>();

  function merge(rows: WeeklyCountRow[], key: 'posts' | 'comments' | 'likes' | 'messages' | 'lessonCompletions') {
    for (const r of rows) {
      const date = new Date(r.bucket).toISOString().slice(0, 10);
      const entry = buckets.get(date) ?? { posts: 0, comments: 0, likes: 0, messages: 0, lessonCompletions: 0 };
      entry[key] = Number(r.count);
      buckets.set(date, entry);
    }
  }

  merge(postsRows, 'posts');
  merge(commentsRows, 'comments');
  merge(likesRows, 'likes');
  merge(messagesRows, 'messages');
  merge(lessonRows, 'lessonCompletions');

  const series = Array.from(buckets.entries())
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([date, v]) => ({ date, ...v }));

  const totals = series.reduce(
    (acc, v) => ({
      posts: acc.posts + v.posts,
      comments: acc.comments + v.comments,
      likes: acc.likes + v.likes,
      messages: acc.messages + v.messages,
      lessonCompletions: acc.lessonCompletions + v.lessonCompletions,
    }),
    { posts: 0, comments: 0, likes: 0, messages: 0, lessonCompletions: 0 },
  );

  return {
    series,
    totals,
    deltas: {
      posts: pctChange(totals.posts, priorPosts),
      comments: pctChange(totals.comments, priorComments),
      likes: pctChange(totals.likes, priorLikes),
      messages: pctChange(totals.messages, priorMessages),
      lessonCompletions: pctChange(totals.lessonCompletions, priorLessons),
    },
  };
}

// ─── Revenue ─────────────────────────────────────────────────────────

export type RevenueData = {
  series: Array<{ date: string; amount: number }>;
  byType: Array<{ type: string; amount: number }>;
  topProducts: Array<{ title: string; revenue: number; units: number }>;
  totals: { total: number };
  /** Percent change vs the immediately preceding window of the same length. */
  deltas: { total: number | null };
};

export async function getRevenueAnalytics(days: number): Promise<RevenueData> {
  const since = sinceDate(days);
  const priorSince = sinceDate(days * 2);

  const [orderRows, storeOrderRows, storeItemsByType, courseOrders, topStoreProducts, priorOrders, priorStoreOrders] = await Promise.all([
    prisma.$queryRaw<Array<{ bucket: Date; amount: number | null }>>`
      SELECT date_trunc('day', "createdAt") AS bucket, SUM("amount") AS amount
      FROM "Order" WHERE status = 'COMPLETED' AND "createdAt" >= ${since}
      GROUP BY bucket ORDER BY bucket ASC
    `,
    prisma.$queryRaw<Array<{ bucket: Date; amount: number | null }>>`
      SELECT date_trunc('day', "createdAt") AS bucket, SUM("totalAmount") AS amount
      FROM "StoreOrder" WHERE status = 'PAID' AND "createdAt" >= ${since}
      GROUP BY bucket ORDER BY bucket ASC
    `,
    prisma.$queryRaw<Array<{ type: string; amount: number | null }>>`
      SELECT p."type" AS type, SUM(soi."totalPrice") AS amount
      FROM "StoreOrderItem" soi
      JOIN "StoreOrder" so ON so.id = soi."orderId"
      JOIN "Product" p ON p.id = soi."productId"
      WHERE so.status = 'PAID' AND so."createdAt" >= ${since}
      GROUP BY p."type"
    `,
    prisma.order.aggregate({
      where: { status: 'COMPLETED', createdAt: { gte: since }, courseId: { not: null } },
      _sum: { amount: true },
    }),
    prisma.$queryRaw<Array<{ title: string; revenue: number | null; units: bigint | null }>>`
      SELECT p."title" AS title, SUM(soi."totalPrice") AS revenue, SUM(soi."quantity") AS units
      FROM "StoreOrderItem" soi
      JOIN "StoreOrder" so ON so.id = soi."orderId"
      JOIN "Product" p ON p.id = soi."productId"
      WHERE so.status = 'PAID' AND so."createdAt" >= ${since}
      GROUP BY p."title"
      ORDER BY revenue DESC
      LIMIT 5
    `,
    // Prior-window totals for the delta.
    prisma.order.aggregate({
      where: { status: 'COMPLETED', createdAt: { gte: priorSince, lt: since } },
      _sum: { amount: true },
    }),
    prisma.storeOrder.aggregate({
      where: { status: 'PAID', createdAt: { gte: priorSince, lt: since } },
      _sum: { totalAmount: true },
    }),
  ]);

  const byDate = new Map<string, number>();
  for (const r of orderRows) {
    const date = new Date(r.bucket).toISOString().slice(0, 10);
    byDate.set(date, (byDate.get(date) ?? 0) + Number(r.amount ?? 0));
  }
  for (const r of storeOrderRows) {
    const date = new Date(r.bucket).toISOString().slice(0, 10);
    byDate.set(date, (byDate.get(date) ?? 0) + Number(r.amount ?? 0));
  }
  const series = Array.from(byDate.entries())
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([date, amount]) => ({ date, amount }));

  const byType = storeItemsByType.map((r) => ({ type: r.type, amount: Number(r.amount ?? 0) }));
  const courseRevenue = Number(courseOrders._sum.amount ?? 0);
  if (courseRevenue > 0) byType.push({ type: 'COURSE (direct)', amount: courseRevenue });

  const topProducts = topStoreProducts.map((p) => ({
    title: p.title,
    revenue: Number(p.revenue ?? 0),
    units: Number(p.units ?? 0),
  }));

  const total = series.reduce((sum, s) => sum + s.amount, 0);
  const priorTotal = Number(priorOrders._sum.amount ?? 0) + Number(priorStoreOrders._sum.totalAmount ?? 0);

  return { series, byType, topProducts, totals: { total }, deltas: { total: pctChange(total, priorTotal) } };
}

// ─── Funnel ──────────────────────────────────────────────────────────

export type FunnelData = {
  steps: Array<{ label: string; count: number }>;
};

export async function getFunnelAnalytics(): Promise<FunnelData> {
  const [totalSignups, onboarded, firstPostUsers, challengeParticipants, orderBuyers, storeBuyers] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { onboardedAt: { not: null } } }),
    prisma.communityPost.groupBy({ by: ['authorId'] }),
    prisma.challengeEnrollment.groupBy({ by: ['userId'] }),
    prisma.order.groupBy({ by: ['userId'], where: { status: 'COMPLETED' } }),
    prisma.storeOrder.groupBy({ by: ['userId'], where: { status: 'PAID' } }),
  ]);

  const buyerIds = new Set<string>([...orderBuyers.map((o) => o.userId), ...storeBuyers.map((o) => o.userId)]);

  return {
    steps: [
      { label: 'Total signups', count: totalSignups },
      { label: 'Onboarded', count: onboarded },
      { label: 'First post', count: firstPostUsers.length },
      { label: 'Joined a challenge', count: challengeParticipants.length },
      { label: 'First purchase', count: buyerIds.size },
    ],
  };
}
