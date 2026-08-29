import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { sendEmail } from '@/lib/email/resend';
import { weeklyDigestEmail, type DigestPost } from '@/lib/email/templates';

// Sending digests to hundreds of users takes longer than the default
// serverless timeout — allow up to 5 minutes.
export const maxDuration = 300;

// GET /api/cron/weekly-digest
// Called by Vercel Cron weekly to send each opted-in user a summary of the
// week's top community posts plus their unread notification count.
export async function GET(request: NextRequest) {
  // Verify CRON secret to prevent unauthorized access
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    // Top posts of the past week by engagement (likes + comments)
    const topPostsRaw = await prisma.communityPost.findMany({
      where: { isDeleted: false, createdAt: { gte: weekAgo } },
      select: {
        id: true,
        content: true,
        space: true,
        author: { select: { name: true, email: true } },
        _count: { select: { likes: true, comments: true } },
      },
      take: 40,
      orderBy: [{ likes: { _count: 'desc' } }, { comments: { _count: 'desc' } }],
    });

    // Candidate pool for both global top posts and per-user picks
    const candidatePosts: DigestPost[] = topPostsRaw.map((p) => ({
      id: p.id,
      authorName: p.author.name || p.author.email || 'Member',
      excerpt: p.content.slice(0, 140) + (p.content.length > 140 ? '…' : ''),
      likeCount: p._count.likes,
      commentCount: p._count.comments,
      space: p.space ?? undefined,
    }));

    const topPosts = candidatePosts
      .slice()
      .sort((a, b) => (b.likeCount + b.commentCount) - (a.likeCount + a.commentCount))
      .slice(0, 5);

    // Users eligible for the digest: have an email, not opted out
    const optedOut = await prisma.notificationPreference.findMany({
      select: { userId: true, preferences: true },
    });
    const optedOutIds = new Set(
      optedOut
        .filter((r) => {
          const prefs = r.preferences as Record<string, unknown> | null;
          return prefs && prefs['email_digest'] === false;
        })
        .map((r) => r.userId),
    );

    const users = await prisma.user.findMany({
      where: {
        email: { not: '' },
        id: { notIn: [...optedOutIds] },
      },
      select: { id: true, email: true, name: true },
      take: 500,
    });

    // All unread counts in one query instead of one per user
    const unreadByUser = new Map<string, number>(
      (
        await prisma.notification.groupBy({
          by: ['userId'],
          where: { userId: { in: users.map((u) => u.id) }, read: false },
          _count: { _all: true },
        })
      ).map((r) => [r.userId, r._count._all]),
    );

    // Per-user interest tokens (onboarding answers + joined spaces) for the
    // "Picked for you" section. Batch-fetched so the cron stays fast.
    const [allAnswers, allMemberships] = await Promise.all([
      prisma.onboardingAnswer.findMany({
        where: { userId: { in: users.map((u) => u.id) } },
        select: { userId: true, answer: true },
      }),
      prisma.communityGroupMember.findMany({
        where: { userId: { in: users.map((u) => u.id) }, status: 'ACTIVE' },
        select: { userId: true, group: { select: { slug: true, name: true } } },
      }),
    ]);
    const tokensByUser = new Map<string, Set<string>>();
    for (const a of allAnswers) {
      let tokens = tokensByUser.get(a.userId);
      if (!tokens) { tokens = new Set(); tokensByUser.set(a.userId, tokens); }
      try {
        const parsed = JSON.parse(a.answer);
        if (Array.isArray(parsed)) parsed.forEach((v) => typeof v === 'string' && tokens.add(v.toLowerCase()));
        else if (typeof parsed === 'string') tokens.add(parsed.toLowerCase());
      } catch {
        tokens.add(a.answer.toLowerCase());
      }
    }
    for (const m of allMemberships) {
      let tokens = tokensByUser.get(m.userId);
      if (!tokens) { tokens = new Set(); tokensByUser.set(m.userId, tokens); }
      if (m.group.slug) tokens.add(m.group.slug.toLowerCase());
      if (m.group.name) tokens.add(m.group.name.toLowerCase());
    }

    // Score a candidate post against a user's interests (words + joined space slug).
    const scoreForUser = (post: DigestPost, tokens: Set<string>): number => {
      if (post.space && tokens.has(post.space.toLowerCase())) return 10;
      const haystack = post.excerpt.toLowerCase();
      let score = 0;
      for (const t of tokens) {
        if (t.length >= 3 && haystack.includes(t)) score += 2;
      }
      return score;
    };

    let digestsSent = 0;

    const sendToUser = async (user: (typeof users)[number]) => {
      if (!user.email) return;
      try {
        const unreadCount = unreadByUser.get(user.id) ?? 0;

        // Skip users with nothing new and no community activity to report
        if (unreadCount === 0 && topPosts.length === 0) return;

        // Personalized picks: rank candidates by interest score, exclude global top 5
        const tokens = tokensByUser.get(user.id) ?? new Set<string>();
        const topIds = new Set(topPosts.map((p) => p.id));
        const personalizedPosts = candidatePosts
          .filter((p) => !topIds.has(p.id))
          .map((p) => ({ p, score: scoreForUser(p, tokens) }))
          .filter((x) => x.score > 0)
          .sort((a, b) => b.score - a.score)
          .slice(0, 3)
          .map((x) => x.p);

        const { subject, html } = weeklyDigestEmail(
          user.name || 'Hustler',
          topPosts,
          unreadCount,
          personalizedPosts,
        );
        await sendEmail({ to: user.email, subject, html });
        digestsSent++;
      } catch (err) {
        console.error(`[CRON] Weekly digest failed for user ${user.id}:`, err);
      }
    };

    // Bounded concurrency to stay within the function timeout
    const CHUNK = 10;
    for (let i = 0; i < users.length; i += CHUNK) {
      await Promise.all(users.slice(i, i + CHUNK).map(sendToUser));
    }

    return NextResponse.json({
      success: true,
      usersProcessed: users.length,
      digestsSent,
      topPostsIncluded: topPosts.length,
    });
  } catch (error) {
    console.error('[CRON /weekly-digest] Error:', error);
    return NextResponse.json({ error: 'Cron job failed' }, { status: 500 });
  }
}
