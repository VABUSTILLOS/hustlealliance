import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { sendEmail } from '@/lib/email/resend';
import { enrollUserInAutomations } from '@/lib/email/automation-triggers';

// GET /api/cron/abandoned-cart
// Finds store orders stuck in PENDING for over an hour (checkout started but never paid)
// and emails the buyer a recovery link, at most once per order.
const ABANDONED_AFTER_MS = 60 * 60 * 1000;

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const cutoff = new Date(Date.now() - ABANDONED_AFTER_MS);
    const abandoned = await prisma.storeOrder.findMany({
      where: {
        status: 'PENDING',
        createdAt: { lte: cutoff },
        abandonedEmailSentAt: null,
        user: { emailUnsubscribed: false },
      },
      include: {
        user: { select: { email: true, name: true } },
        items: { include: { product: { select: { title: true } } } },
      },
      take: 100,
    });

    let sent = 0;
    for (const order of abandoned) {
      const itemList = order.items.map((i) => i.product.title).join(', ');
      const html = `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
        <h1 style="color:#FF3B30">Hustle Alliance</h1>
        <h2>You left something behind, ${order.user.name}!</h2>
        <p>Your order (${itemList}) is still waiting. Complete your purchase before it's gone.</p>
        <a href="https://www.hustlealliance.com/store" style="display:inline-block;padding:12px 24px;background:#FF3B30;color:#fff;text-decoration:none;border-radius:8px;font-weight:bold;margin:16px 0">Complete Your Order →</a>
      </div>`;

      await sendEmail({
        to: order.user.email,
        subject: 'You left something in your cart 🛒',
        html,
      });
      await prisma.storeOrder.update({
        where: { id: order.id },
        data: { abandonedEmailSentAt: new Date() },
      });
      // Enroll into any active ABANDONED_CART automations for follow-up sequences.
      await enrollUserInAutomations(order.userId, 'ABANDONED_CART', order.createdAt);
      sent++;
    }

    return NextResponse.json({ ok: true, found: abandoned.length, sent });
  } catch (err) {
    console.error('[Cron] abandoned-cart failed:', err);
    return NextResponse.json({ error: 'Abandoned cart sweep failed' }, { status: 500 });
  }
}
