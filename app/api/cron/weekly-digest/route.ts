import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { sendEmail } from '@/lib/email/resend';
import { weeklyDigestEmail, type DigestPost } from '@/lib/email/templates';

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
        author: { select: { name: true, email: true } },
        _count: { select: { likes: true, comments: true } },
      },
      take: 20,
      orderBy: [{ likes: { _count: 'desc' } }, { comments: { _count: 'desc' } }],
    });

    const topPosts: DigestPost[] = topPostsRaw
      .sort((a, b) => (b._count.likes + b._count.comments) - (a._count.likes + a._count.comments))
      .slice(0, 5)
      .map((p) => ({
        id: p.id,
        authorName: p.author.name || p.author.email || 'Member',
        excerpt: p.content.slice(0, 140) + (p.content.length > 140 ? '…' : ''),
        likeCount: p._count.likes,
        commentCount: p._count.comments,
      }));

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

    let digestsSent = 0;

    for (const user of users) {
      if (!user.email) continue;
      try {
        const unreadCount = await prisma.notification.count({
          where: { userId: user.id, read: false },
        });

        // Skip users with nothing new and no community activity to report
        if (unreadCount === 0 && topPosts.length === 0) continue;

        const { subject, html } = weeklyDigestEmail(
          user.name || 'Hustler',
          topPosts,
          unreadCount,
        );
        await sendEmail({ to: user.email, subject, html });
        digestsSent++;
      } catch (err) {
        console.error(`[CRON] Weekly digest failed for user ${user.id}:`, err);
      }
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
