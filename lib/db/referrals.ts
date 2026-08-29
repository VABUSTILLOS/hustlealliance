import prisma from '@/lib/db/prisma';
import { ensureReferralCode } from '@/lib/referrals/code';
import { getReferralReward, type ReferralRewardConfig } from '@/lib/settings';

export type ReferralListItem = {
  id: string;
  status: 'PENDING' | 'CONVERTED' | 'REWARDED';
  createdAt: string;
  convertedAt: string | null;
  refereeName: string | null;
  refereeAvatar: string | null;
};

export type ReferralRewardCoupon = {
  id: string;
  code: string;
  discountType: 'PERCENT' | 'FIXED';
  amount: number;
  isActive: boolean;
  usedCount: number;
  maxUses: number | null;
};

export type ReferralDashboard = {
  referralCode: string;
  stats: {
    invited: number;
    pending: number;
    converted: number;
    rewarded: number;
  };
  referrals: ReferralListItem[];
  rewards: ReferralRewardCoupon[];
  rewardConfig: ReferralRewardConfig;
};

/**
 * Everything the member-facing "Invite & Earn" page needs for one user:
 * their share code, referral stats/list, and earned reward coupons.
 */
export async function getReferralDashboard(userId: string): Promise<ReferralDashboard> {
  const referralCode = await ensureReferralCode(userId);

  const [grouped, referrals, rewardConfig] = await Promise.all([
    prisma.referral.groupBy({
      by: ['status'],
      where: { referrerId: userId },
      _count: { _all: true },
    }),
    prisma.referral.findMany({
      where: { referrerId: userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        referee: { select: { name: true, avatar: true } },
        rewardCoupon: {
          select: { id: true, code: true, discountType: true, amount: true, isActive: true, usedCount: true, maxUses: true },
        },
      },
    }),
    getReferralReward(),
  ]);

  const counts = { PENDING: 0, CONVERTED: 0, REWARDED: 0 } as Record<string, number>;
  for (const row of grouped) counts[row.status] = row._count._all;

  return {
    referralCode,
    stats: {
      invited: counts.PENDING + counts.CONVERTED + counts.REWARDED,
      pending: counts.PENDING,
      converted: counts.CONVERTED,
      rewarded: counts.REWARDED,
    },
    referrals: referrals.map((r) => ({
      id: r.id,
      status: r.status,
      createdAt: r.createdAt.toISOString(),
      convertedAt: r.convertedAt ? r.convertedAt.toISOString() : null,
      refereeName: r.referee?.name ?? null,
      refereeAvatar: r.referee?.avatar ?? null,
    })),
    rewards: referrals
      .filter((r) => r.rewardCoupon)
      .map((r) => r.rewardCoupon!) as ReferralRewardCoupon[],
    rewardConfig,
  };
}
