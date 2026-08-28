import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { notifyEventReminder } from '@/lib/notifications/service';

export const maxDuration = 300;

// GET /api/cron/event-reminders
// Hourly cron: notify RSVP'd users 24h and 1h before events start.
// Deduped via notification sourceId: `${eventId}:reminder:${window}`.
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const now = new Date();
    const windows = [
      { tag: '24h', from: new Date(now.getTime() + 23.5 * 3600_000), to: new Date(now.getTime() + 24.5 * 3600_000) },
      { tag: '1h', from: now, to: new Date(now.getTime() + 70 * 60_000) },
    ];

    let sent = 0;

    for (const win of windows) {
      const events = await prisma.event.findMany({
        where: {
          status: 'UPCOMING',
          startDate: { gte: win.from, lte: win.to },
        },
        select: {
          id: true,
          title: true,
          startDate: true,
          rsvps: {
            where: { status: { in: ['GOING', 'INTERESTED'] } },
            select: { userId: true, user: { select: { id: true, email: true } } },
          },
        },
      });

      for (const event of events) {
        if (event.rsvps.length === 0) continue;
        const sourceId = `${event.id}:reminder:${win.tag}`;

        // Which attendees were already reminded for this window?
        const alreadySent = await prisma.notification.findMany({
          where: {
            type: 'EVENT_REMINDER',
            sourceId,
            userId: { in: event.rsvps.map((r) => r.userId) },
          },
          select: { userId: true },
        });
        const sentSet = new Set(alreadySent.map((n) => n.userId));
        const pending = event.rsvps.filter((r) => !sentSet.has(r.userId) && r.user.email);

        // Send in chunks of 10 to stay within timeouts
        for (let i = 0; i < pending.length; i += 10) {
          await Promise.all(
            pending.slice(i, i + 10).map(async (rsvp) => {
              try {
                await notifyEventReminder(
                  rsvp.user.id,
                  rsvp.user.email!,
                  event.title,
                  sourceId,
                  event.startDate,
                );
                sent++;
              } catch (err) {
                console.error(`[CRON] Event reminder failed for user ${rsvp.userId}, event ${event.id}:`, err);
              }
            }),
          );
        }
      }
    }

    return NextResponse.json({ sent });
  } catch (err) {
    console.error('[CRON] Event reminders failed:', err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
