import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { releaseDueContent } from '@/lib/db/drip';

// GET /api/cron/release-drip
// Called by Vercel Cron every 5 minutes to release drip-feed content
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

    for (const { userId } of pendingReleases) {
      try {
        const count = await releaseDueContent(userId);
        totalReleased += count;

        if (count > 0) {
          await prisma.notification.create({
            data: {
              userId,
              type: 'CONTENT_UNLOCKED',
              title: 'New content unlocked!',
              body: `${count} new lesson${count > 1 ? 's' : ''} unlocked!`,
              metadata: { unlockedCount: count },
            },
          });
        }
      } catch (err) {
        console.error(`[CRON] releaseDueContent failed for user ${userId}:`, err);
      }
    }

    return NextResponse.json({
      success: true,
      usersProcessed: pendingReleases.length,
      totalReleased,
    });
  } catch (error) {
    console.error('[CRON /release-drip] Error:', error);
    return NextResponse.json({ error: 'Cron job failed' }, { status: 500 });
  }
}
