import { NextResponse } from 'next/server';
import { requireAdmin, authErrorResponse } from '@/lib/auth/guard';
import { prisma } from '@/lib/db/prisma';

/**
 * GET /api/admin/store/affiliates
 * Per-referrer stats: referral code, conversions, attributed revenue, payout totals.
 */
export async function GET() {
  try {
    await requireAdmin();

    const referrers = await prisma.referral.findMany({
      select: {
        id: true,
        code: true,
        status: true,
        createdAt: true,
        convertedAt: true,
        referrer: { select: { id: true, name: true, email: true } },
        storeOrders: {
          where: { status: { in: ['PAID', 'FULFILLED'] } },
          select: { totalAmount: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });

    // Roll up by referrer (one user can have several referral rows/codes).
    const byReferrer = new Map<string, {
      referrerId: string;
      name: string | null;
      email: string;
      codes: string[];
      conversions: number;
      revenue: number;
    }>();

    for (const r of referrers) {
      const entry = byReferrer.get(r.referrer.id) ?? {
        referrerId: r.referrer.id,
        name: r.referrer.name,
        email: r.referrer.email,
        codes: [],
        conversions: 0,
        revenue: 0,
      };
      if (!entry.codes.includes(r.code)) entry.codes.push(r.code);
      if (r.status === 'CONVERTED' || r.convertedAt) entry.conversions += 1;
      entry.revenue += r.storeOrders.reduce((s, o) => s + o.totalAmount, 0);
      byReferrer.set(r.referrer.id, entry);
    }

    const payouts = await prisma.affiliatePayout.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: { referrer: { select: { id: true, name: true, email: true } } },
    });

    const paidByReferrer = new Map<string, number>();
    const pendingByReferrer = new Map<string, number>();
    for (const p of payouts) {
      const map = p.status === 'PAID' ? paidByReferrer : pendingByReferrer;
      map.set(p.referrerId, (map.get(p.referrerId) ?? 0) + p.amountCents);
    }

    return NextResponse.json({
      affiliates: [...byReferrer.values()]
        .map((a) => ({
          ...a,
          paidCents: paidByReferrer.get(a.referrerId) ?? 0,
          pendingCents: pendingByReferrer.get(a.referrerId) ?? 0,
        }))
        .sort((a, b) => b.revenue - a.revenue),
      payouts: payouts.map((p) => ({
        id: p.id,
        referrerId: p.referrerId,
        referrerName: p.referrer.name,
        referrerEmail: p.referrer.email,
        amountCents: p.amountCents,
        status: p.status,
        periodLabel: p.periodLabel,
        createdAt: p.createdAt,
        paidAt: p.paidAt,
      })),
    });
  } catch (error) {
    return authErrorResponse(error);
  }
}
