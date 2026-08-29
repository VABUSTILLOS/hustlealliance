import { NextResponse } from 'next/server';
import { requireAdmin, authErrorResponse } from '@/lib/auth/guard';
import { prisma } from '@/lib/db/prisma';
import { logAdminActivity } from '@/lib/activity';

/**
 * PATCH /api/admin/store/payouts/[id] — mark a payout as PAID.
 */
export async function PATCH(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requireAdmin();
    const { id } = await params;

    const payout = await prisma.affiliatePayout.findUnique({ where: { id } });
    if (!payout) return NextResponse.json({ error: 'Payout not found' }, { status: 404 });
    if (payout.status === 'PAID') return NextResponse.json({ payout });

    const updated = await prisma.affiliatePayout.update({
      where: { id },
      data: { status: 'PAID', paidAt: new Date() },
    });

    await logAdminActivity({
      actorId: admin.id,
      action: 'payout.mark_paid',
      entity: 'AffiliatePayout',
      entityId: id,
      meta: { amountCents: payout.amountCents, referrerId: payout.referrerId },
    });

    return NextResponse.json({ payout: updated });
  } catch (error) {
    return authErrorResponse(error);
  }
}
