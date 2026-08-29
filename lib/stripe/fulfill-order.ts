// Shared store-order fulfillment logic used by both the Stripe webhook
// (checkout.session.completed) and the one-click post-purchase upsell route.
// Creates a PAID StoreOrder (with items), grants entitlements/enrollments for
// COURSE/CHALLENGE products (including nested BUNDLE items), upgrades the
// user's membership tier for recurring MEMBERSHIP products, records coupon
// redemptions, and attributes referral conversions.
import prisma from '@/lib/db/prisma';
import { MembershipTier, Prisma } from '@/lib/generated/prisma/client';
import { attributeReferralConversion } from '@/lib/referrals/attribute';
import { awardLeadScore } from '@/lib/scoring';
import type { UtmParams } from '@/lib/track';

export interface FulfillOrderItemInput {
  productId: string;
  quantity: number;
  unitPrice?: number;
}

export interface FulfillAttribution {
  sessionId?: string | null;
  utm?: UtmParams | null;
  landingPageId?: string | null;
  referralCode?: string | null;
  path?: string | null;
}

export interface FulfillStoreOrderInput {
  userId: string;
  items: FulfillOrderItemInput[];
  currency?: string;
  stripePaymentIntentId?: string | null;
  couponCode?: string | null;
  attribution?: FulfillAttribution;
}

/**
 * Grants an Entitlement/Enrollment for COURSE products (linked via metadata.courseId),
 * creates a ChallengeEnrollment for CHALLENGE products (linked via Challenge.productId),
 * and marks other product types simply fulfilled (StoreOrderItem already records the purchase).
 */
export async function fulfillProduct(
  product: { id: string; type: string; metadata: unknown; price: number },
  userId: string,
  orderId?: string,
) {
  if (product.type === 'CHALLENGE') {
    if (!orderId) return;
    const challenge = await prisma.challenge.findUnique({ where: { productId: product.id } });
    if (!challenge) return;
    const { enrollFromPaidOrder } = await import('@/lib/db/challenges');
    await enrollFromPaidOrder({ challengeId: challenge.id, userId, storeOrderId: orderId });
    return;
  }

  if (product.type !== 'COURSE') return;
  const meta = (product.metadata as Record<string, unknown> | null) ?? {};
  const courseId = typeof meta.courseId === 'string' ? meta.courseId : undefined;
  if (!courseId) return;

  await prisma.entitlement.upsert({
    where: { userId_courseId: { userId, courseId } },
    create: { userId, courseId, price: product.price },
    update: { price: product.price },
  });
  await prisma.enrollment.upsert({
    where: { userId_courseId: { userId, courseId } },
    create: { userId, courseId },
    update: {},
  });
}

/**
 * Creates a PAID StoreOrder for the given cart of products and runs full
 * fulfillment (entitlements, bundle expansion, membership upgrade, coupon
 * redemption, referral attribution). Idempotent on stripePaymentIntentId when
 * provided — callers that may retry should always pass one.
 */
export async function createAndFulfillStoreOrder(input: FulfillStoreOrderInput) {
  const { userId, items, currency = 'USD', stripePaymentIntentId, couponCode, attribution } = input;
  if (items.length === 0) throw new Error('Cannot fulfill an empty cart');

  if (stripePaymentIntentId) {
    const existing = await prisma.storeOrder.findFirst({ where: { stripePaymentIntentId } });
    if (existing) return existing;
  }

  const products = await prisma.product.findMany({
    where: { id: { in: items.map((i) => i.productId) } },
    include: { bundleItems: { include: { product: true } } },
  });
  const productMap = new Map(products.map((p) => [p.id, p]));

  // Resolve affiliate referral code to a Referral row (best-effort).
  let referralId: string | null = null;
  if (attribution?.referralCode) {
    const referral = await prisma.referral.findFirst({ where: { code: attribution.referralCode } });
    referralId = referral?.id ?? null;
  }

  const totalAmount = items.reduce((sum, item) => {
    const product = productMap.get(item.productId);
    const unitPrice = item.unitPrice ?? product?.price ?? 0;
    return sum + unitPrice * item.quantity;
  }, 0);

  const order = await prisma.storeOrder.create({
    data: {
      userId,
      status: 'PAID',
      totalAmount,
      currency: currency.toUpperCase(),
      stripePaymentIntentId: stripePaymentIntentId ?? null,
      paidAt: new Date(),
      landingPageId: attribution?.landingPageId ?? null,
      referralId,
      utm: attribution?.utm ? (attribution.utm as unknown as Prisma.InputJsonValue) : undefined,
      items: {
        create: items.map((item) => {
          const product = productMap.get(item.productId);
          const unitPrice = item.unitPrice ?? product?.price ?? 0;
          return { productId: item.productId, quantity: item.quantity, unitPrice, totalPrice: unitPrice * item.quantity };
        }),
      },
    },
  });

  for (const item of items) {
    const product = productMap.get(item.productId);
    if (!product) continue;

    await fulfillProduct(product, userId, order.id);

    if (product.type === 'BUNDLE' && product.bundleItems.length > 0) {
      for (const bundleItem of product.bundleItems) {
        await fulfillProduct(bundleItem.product, userId, order.id);
      }
    }

    // Recurring membership products upgrade the user's tier immediately.
    if (product.type === 'MEMBERSHIP' && product.recurringInterval) {
      const meta = (product.metadata as Record<string, unknown> | null) ?? {};
      const productTier = meta.tier === 'PRO' ? MembershipTier.PRO : MembershipTier.BASIC;
      const days = product.recurringInterval === 'year' ? 365 : 30;
      await prisma.user.update({
        where: { id: userId },
        data: { membershipTier: productTier, membershipExpiresAt: new Date(Date.now() + days * 86400000) },
      });
    }
  }

  if (couponCode) {
    const coupon = await prisma.coupon.findUnique({ where: { code: couponCode } });
    if (coupon) {
      await prisma.couponRedemption.upsert({
        where: { couponId_orderId: { couponId: coupon.id, orderId: order.id } },
        create: { couponId: coupon.id, orderId: order.id, userId },
        update: {},
      });
      await prisma.coupon.update({ where: { id: coupon.id }, data: { usedCount: { increment: 1 } } });
    }
  }

  try {
    await attributeReferralConversion(userId, order.id);
  } catch (e) {
    console.error('[fulfill-order] Referral attribution failed (non-fatal)', e);
  }

  // Decrement tracked inventory (never below zero; untracked products are unlimited).
  for (const item of items) {
    const product = productMap.get(item.productId);
    if (!product?.trackStock) continue;
    try {
      await prisma.product.update({
        where: { id: product.id },
        data: { stock: Math.max(0, product.stock - item.quantity) },
      });
    } catch (e) {
      console.error('[fulfill-order] Stock decrement failed (non-fatal)', e);
    }
  }

  // SALE page event + lead score — attribution must never break fulfillment.
  try {
    const { recordPageEvent } = await import('@/lib/track');
    await recordPageEvent({
      type: 'SALE',
      path: attribution?.path || (attribution?.landingPageId ? `/pay` : '/store'),
      sessionId: attribution?.sessionId || `order-${order.id}`,
      landingPageId: attribution?.landingPageId ?? null,
      utm: attribution?.utm ?? null,
    });
    await awardLeadScore(userId, 50); // purchase
  } catch (e) {
    console.error('[fulfill-order] Sale tracking failed (non-fatal)', e);
  }

  return order;
}
