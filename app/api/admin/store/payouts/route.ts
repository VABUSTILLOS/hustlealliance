import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, authErrorResponse } from '@/lib/auth/guard';
import { prisma } from '@/lib/db/prisma';
import { logAdminActivity } from '@/lib/activity';

/**
 * POST /api/admin/store/payouts — record a manual affiliate payout.
 * Body: { referrerId, amountCents, periodLabel }
 */
export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin();
    const body = await request.json();

    const referrerId = typeof body.referrerId === 'string' ? body.referrerId : '';
    const amountCents = Number(body.amountCents);
    const periodLabel = typeof body.periodLabel === 'string' ? body.periodLabel.trim() : '';

    if (!referrerId || !Number.isFinite(amountCents) || amountCents <= 0 || !periodLabel) {
      return NextResponse.json({ error: 'referrerId, positive amountCents, and periodLabel are required' }, { status: 400 });
    }

    const referrer = await prisma.user.findUnique({ where: { id: referrerId }, select: { id: true } });
    if (!referrer) {
      return NextResponse.json({ error: 'Referrer not found' }, { status: 404 });
    }

    const payout = await prisma.affiliatePayout.create({
      data: { referrerId, amountCents: Math.round(amountCents), periodLabel },
    });

    await logAdminActivity({
      actorId: admin.id,
      action: 'payout.create',
      entity: 'AffiliatePayout',
      entityId: payout.id,
      meta: { referrerId, amountCents: payout.amountCents, periodLabel },
    });

    return NextResponse.json({ payout }, { status: 201 });
  } catch (error) {
    return authErrorResponse(error);
  }
}
