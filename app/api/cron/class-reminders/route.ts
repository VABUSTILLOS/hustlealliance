import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { notifyLiveClassReminder } from '@/lib/notifications/service';

// GET /api/cron/class-reminders
// Called by Vercel Cron every hour to send reminders for upcoming live classes
export async function GET(request: NextRequest) {
  // Verify CRON secret to prevent unauthorized access
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const now = new Date();
    // Find live classes starting in the next 60 minutes that haven't had reminders sent
    const upcomingClasses = await prisma.liveClass.findMany({
      where: {
        startsAt: { gte: now, lte: new Date(now.getTime() + 60 * 60 * 1000) },
        endsAt: { gt: now },
      },
      include: {
        registrations: {
          include: {
            user: { select: { id: true, email: true } },
          },
        },
        instructor: { select: { name: true } },
      },
    });

    let remindersSent = 0;

    for (const liveClass of upcomingClasses) {
      for (const reg of liveClass.registrations) {
        if (!reg.user.email) continue;

        try {
          await notifyLiveClassReminder(
            reg.user.id,
            reg.user.email,
            liveClass.title,
            liveClass.startsAt,
            liveClass.meetingUrl ?? '',
          );
          remindersSent++;
        } catch (err) {
          console.error(
            `[CRON] Live class reminder failed for user ${reg.user.id}, class ${liveClass.id}:`,
            err,
          );
        }
      }
    }

    return NextResponse.json({
      success: true,
      classesProcessed: upcomingClasses.length,
      remindersSent,
    });
  } catch (error) {
    console.error('[CRON /class-reminders] Error:', error);
    return NextResponse.json({ error: 'Cron job failed' }, { status: 500 });
  }
}
