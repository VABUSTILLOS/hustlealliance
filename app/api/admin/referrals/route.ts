import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { requireAdmin, authErrorResponse } from '@/lib/auth/guard';

// GET /api/admin/referrals — table data + conversion stats for the admin dashboard.
export async function GET() {
  try {
    await requireAdmin();

    const referrals = await prisma.referral.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        referrer: { select: { id: true, name: true, email: true } },
        referee: { select: { id: true, name: true, email: true } },
        rewardCoupon: { select: { code: true, amount: true, discountType: true } },
      },
      take: 200,
    });

    const [total, converted, rewarded] = await Promise.all([
      prisma.referral.count(),
      prisma.referral.count({ where: { status: 'CONVERTED' } }),
      prisma.referral.count({ where: { status: 'REWARDED' } }),
    ]);

    const stats = {
      total,
      pending: total - converted - rewarded,
      converted,
      rewarded,
      conversionRate: total > 0 ? Math.round(((converted + rewarded) / total) * 1000) / 10 : 0,
    };

    return NextResponse.json({ referrals, stats });
  } catch (err) {
    return authErrorResponse(err);
  }
}
