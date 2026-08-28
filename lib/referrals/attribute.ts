import prisma from '@/lib/db/prisma';
import { generateUniqueReferralCode } from './code';
import { getReferralReward } from '@/lib/settings';

/**
 * Attribute a converted purchase to a referral, if the buyer was referred.
 *
 * INTEGRATION NOTE FOR THE STRIPE WEBHOOK / ORDER FULFILLMENT OWNER:
 * Call this once, right after a `StoreOrder` transitions to PAID (or FULFILLED),
 * passing the buyer's userId and the paid StoreOrder's id:
 *
 *   import { attributeReferralConversion } from '@/lib/referrals/attribute';
 *   await attributeReferralConversion(order.userId, order.id);
 *
 * It is a no-op (safe to call unconditionally) when:
 *  - the buyer has no pending Referral row (was never referred, or already converted), or
 *  - the referral is already CONVERTED/REWARDED (idempotent against webhook retries).
 *
 * On first successful conversion it:
 *  1. Marks the Referral CONVERTED (sets convertedAt).
 *  2. Issues a Coupon reward (configured in Admin → Settings → Referral Reward) to the referrer.
 *  3. Marks the Referral REWARDED and links `rewardCouponId`.
 */
export async function attributeReferralConversion(refereeUserId: string, orderId: string): Promise<void> {
  void orderId; // reserved for future audit trail linking the reward to the triggering order
  const referral = await prisma.referral.findUnique({
    where: { refereeId: refereeUserId },
  });

  if (!referral || referral.status !== 'PENDING') return;

  await prisma.referral.update({
    where: { id: referral.id },
    data: { status: 'CONVERTED', convertedAt: new Date() },
  });

  const reward = await getReferralReward();
  const rewardCode = `REF-${(await generateUniqueReferralCode()).slice(0, 8)}`;
  const coupon = await prisma.coupon.create({
    data: {
      code: rewardCode,
      description: 'Referral reward — thanks for spreading the word!',
      discountType: 'PERCENT',
      amount: reward.percentOff,
      maxUses: reward.maxUses,
      isActive: true,
    },
  });

  await prisma.referral.update({
    where: { id: referral.id },
    data: { status: 'REWARDED', rewardCouponId: coupon.id },
  });
}

/**
 * Record a new referral relationship when a referred user signs up.
 * Call this from the signup flow after creating the new user, passing the referral
 * code captured from the `/r/[code]` cookie and the new user's id.
 */
export async function recordReferralSignup(referralCode: string, newUserId: string): Promise<void> {
  const referrer = await prisma.user.findUnique({
    where: { referralCode },
    select: { id: true },
  });
  if (!referrer || referrer.id === newUserId) return;

  const existing = await prisma.referral.findUnique({ where: { refereeId: newUserId } });
  if (existing) return;

  await prisma.referral.create({
    data: { code: referralCode, referrerId: referrer.id, refereeId: newUserId },
  });
}
