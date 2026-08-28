import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { sendBroadcast } from '@/lib/db/broadcasts';

// GET /api/cron/broadcasts
// Runs every 5 minutes (see vercel.json). Finds Broadcasts with status SCHEDULED
// whose scheduledAt has passed, and sends them.
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const now = new Date();
    const due = await prisma.broadcast.findMany({
      where: { status: 'SCHEDULED', scheduledAt: { lte: now } },
      select: { id: true },
    });

    let sentCount = 0;
    let failedCount = 0;

    for (const { id } of due) {
      try {
        await sendBroadcast(id);
        sentCount++;
      } catch (err) {
        console.error(`[CRON /broadcasts] Send failed for broadcast ${id}:`, err);
        failedCount++;
      }
    }

    return NextResponse.json({ success: true, sentCount, failedCount, total: due.length });
  } catch (error) {
    console.error('[CRON /broadcasts] Error:', error);
    return NextResponse.json({ error: 'Cron job failed' }, { status: 500 });
  }
}
