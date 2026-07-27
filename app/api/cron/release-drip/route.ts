import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { releaseDueContent } from '@/lib/db/drip';
import { notifyContentUnlocked } from '@/lib/notifications/service';

// GET /api/cron/release-drip
// Called by Vercel Cron every day at midnight to release drip-feed content
export async function GET(request: NextRequest) {
  // Verify CRON secret to prevent unauthorized access
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Find all users who have unreleased content past its release date
    const pendingReleases = await prisma.contentRelease.findMany({
      where: {
        isReleased: false,
        releasesAt: { lte: new Date() },
      },
      select: { userId: true },
      distinct: ['userId'],
    });

    let totalReleased = 0;
    let totalEmailsSent = 0;

    for (const { userId } of pendingReleases) {
      try {
        // Fetch released lessons before updating to capture lesson details
        const dueReleases = await prisma.contentRelease.findMany({
          where: {
            userId,
            isReleased: false,
            releasesAt: { lte: new Date() },
          },
          include: {
            lesson: {
              select: {
                id: true,
                title: true,
                module: { select: { course: { select: { title: true, slug: true } } } },
              },
            },
          },
        });

        const count = await releaseDueContent(userId);
        totalReleased += count;

        if (count > 0) {
          // Get user email for notification emails
          const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { email: true },
          });

          // Create DB notification
          await prisma.notification.create({
            data: {
              userId,
              type: 'CONTENT_UNLOCKED',
              title: 'New content unlocked!',
              body: `${count} new lesson${count > 1 ? 's' : ''} unlocked!`,
              metadata: { unlockedCount: count },
            },
          });

          // Send per-lesson email notifications
          if (user?.email) {
            for (const release of dueReleases) {
              const lessonTitle = release.lesson?.title ?? 'New lesson';
              const courseTitle = release.lesson?.module?.course?.title ?? 'your course';
              const courseSlug = release.lesson?.module?.course?.slug ?? '';

              notifyContentUnlocked(
                userId,
                user.email,
                lessonTitle,
                courseTitle,
                courseSlug,
              ).catch((err) => console.error(`[CRON] Content unlocked email failed for user ${userId}:`, err));

              totalEmailsSent++;
            }
          }
        }
      } catch (err) {
        console.error(`[CRON] releaseDueContent failed for user ${userId}:`, err);
      }
    }

    return NextResponse.json({
      success: true,
      usersProcessed: pendingReleases.length,
      totalReleased,
      totalEmailsSent,
    });
  } catch (error) {
    console.error('[CRON /release-drip] Error:', error);
    return NextResponse.json({ error: 'Cron job failed' }, { status: 500 });
  }
}
