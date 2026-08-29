import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, authErrorResponse } from '@/lib/auth/guard';
import { prisma } from '@/lib/db/prisma';
import { sendEmail } from '@/lib/email/resend';
import { logAdminActivity } from '@/lib/activity';

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}

/**
 * POST /api/admin/store/orders/[id]/resend-receipt
 * Sends a receipt email for a paid order to the customer's address.
 */
export async function POST(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requireAdmin();
    const { id } = await params;

    const order = await prisma.storeOrder.findUnique({
      where: { id },
      include: {
        user: { select: { email: true, name: true } },
        items: { include: { product: { select: { title: true } } } },
      },
    });
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    if (!order.user?.email) return NextResponse.json({ error: 'Order has no customer email' }, { status: 400 });
    if (order.status !== 'PAID' && order.status !== 'FULFILLED') {
      return NextResponse.json({ error: 'Only paid orders have receipts' }, { status: 400 });
    }

    const rows = order.items
      .map(
        (i) => `<tr>
          <td style="padding:8px 0;color:#fff">${escapeHtml(i.product?.title ?? 'Item')} × ${i.quantity}</td>
          <td style="padding:8px 0;color:#fff;text-align:right">$${i.totalPrice.toFixed(2)}</td>
        </tr>`,
      )
      .join('');

    const result = await sendEmail({
      to: order.user.email,
      subject: `Your receipt — order #${order.id.slice(0, 8)}`,
      html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#0A0A0A;color:#fff;border-radius:12px">
        <h1 style="color:#FF3B30;margin-top:0">Hustle Alliance</h1>
        <h2>Thanks for your purchase${order.user.name ? `, ${escapeHtml(order.user.name)}` : ''}!</h2>
        <table style="width:100%;border-collapse:collapse;margin:16px 0">${rows}</table>
        <p style="border-top:1px solid #333;padding-top:12px"><strong>Total: $${order.totalAmount.toFixed(2)} ${order.currency}</strong></p>
        <p style="color:#8A8A8A;font-size:13px;margin-top:32px">Order #${order.id.slice(0, 8)} · Hustle Alliance</p></div>`,
    });

    const demo = !process.env.RESEND_API_KEY;

    await logAdminActivity({
      actorId: admin.id,
      action: 'order.resend_receipt',
      entity: 'StoreOrder',
      entityId: id,
      meta: { to: order.user.email, demo },
    });

    return NextResponse.json({ sent: true, demo });
  } catch (error) {
    return authErrorResponse(error);
  }
}
