import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { MembershipTier } from '@/lib/generated/prisma/client';
import { attributeReferralConversion } from '@/lib/referrals/attribute';

let stripe: any = null;
function getStripe() {
  if (!stripe && process.env.STRIPE_SECRET_KEY) {
    const Stripe = require('stripe');
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2025-06-01' as any });
  }
  return stripe;
}

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

// POST /api/stripe/webhook
export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature') || '';

  if (!WEBHOOK_SECRET || !process.env.STRIPE_SECRET_KEY) {
    // Demo mode: try processing from raw body
    try {
      const parsed = JSON.parse(body);
      if (parsed.type === 'checkout.session.completed') {
        await processCompletedCheckout(parsed.data?.object || parsed);
      }
    } catch { /* ignore */ }
    return NextResponse.json({ received: true, demo: true });
  }

  const stripeClient = getStripe();
  if (!stripeClient) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
  }

  let event;
  try {
    event = stripeClient.webhooks.constructEvent(body, signature, WEBHOOK_SECRET);
  } catch (err: any) {
    console.error('[Stripe Webhook] Invalid signature:', err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await processCompletedCheckout(event.data.object);
        break;
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        await handleSubscriptionChange(event.data.object);
        break;
      default:
        console.log(`[Stripe Webhook] Unhandled: ${event.type}`);
    }
  } catch (err: any) {
    console.error(`[Stripe Webhook] Error:`, err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function processCompletedCheckout(session: any) {
  const { userId, type, courseId, lessonId, tier } = session.metadata || {};
  const email = session.customer_email || session.customer_details?.email;

  if (!userId && email) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) { console.error('[Webhook] User not found:', email); return; }
    return processCompletedCheckout({
      ...session, metadata: { ...session.metadata, userId: user.id },
    });
  }
  if (!userId) { console.error('[Webhook] No userId'); return; }

  const amount = session.amount_total ? session.amount_total / 100 : 0;

  if (type === 'store') {
    await processStoreCheckout(session, userId, amount);
  } else if (type === 'subscription') {
    const newTier = tier === 'PRO' ? MembershipTier.PRO : MembershipTier.BASIC;
    await prisma.user.update({
      where: { id: userId },
      data: { membershipTier: newTier, membershipExpiresAt: new Date(Date.now() + 30 * 86400000) },
    });
    console.log(`[Webhook] Upgraded ${userId} to ${newTier}`);
  } else {
    await prisma.order.create({
      data: { userId, amount, currency: (session.currency || 'usd').toUpperCase(), status: 'COMPLETED', stripeSessionId: session.id, courseId: courseId || null, lessonId: lessonId || null },
    });

    if (courseId) {
      await prisma.entitlement.upsert({
        where: { userId_courseId: { userId, courseId } },
        create: { userId, courseId, price: amount },
        update: { price: amount },
      });
      await prisma.enrollment.upsert({
        where: { userId_courseId: { userId, courseId } },
        create: { userId, courseId },
        update: {},
      });
    }
    if (lessonId) {
      await prisma.entitlement.upsert({
        where: { userId_lessonId: { userId, lessonId } },
        create: { userId, lessonId, price: amount },
        update: { price: amount },
      });
    }
    console.log(`[Webhook] Entitlement granted to ${userId} for ${type} ${courseId || lessonId}`);
  }
}

// ── Store checkout: creates StoreOrder + StoreOrderItems, fulfills bundle
// items (course entitlements / nested products), records coupon redemption,
// and upgrades membership tier for MEMBERSHIP products with a recurring interval.
interface StripeCheckoutSession {
  id: string;
  currency?: string;
  metadata?: Record<string, string>;
}

async function processStoreCheckout(session: StripeCheckoutSession, userId: string, amount: number) {
  const metadata = session.metadata || {};
  const productIds: string[] = (metadata.productIds || '').split(',').filter(Boolean);
  const quantities: number[] = (metadata.quantities || '').split(',').filter(Boolean).map(Number);
  if (productIds.length === 0) { console.error('[Webhook] Store checkout with no productIds'); return; }

  // Idempotency: skip if we've already recorded this Stripe session.
  const existing = await prisma.storeOrder.findFirst({ where: { stripePaymentIntentId: session.id } });
  if (existing) { console.log('[Webhook] Store order already processed for session', session.id); return; }

  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    include: { bundleItems: { include: { product: true } } },
  });
  const productMap = new Map(products.map((p) => [p.id, p]));

  const order = await prisma.storeOrder.create({
    data: {
      userId,
      status: 'PAID',
      totalAmount: amount,
      currency: (session.currency || 'usd').toUpperCase(),
      stripePaymentIntentId: session.id,
      paidAt: new Date(),
      items: {
        create: productIds.map((productId, idx) => {
          const product = productMap.get(productId);
          const quantity = quantities[idx] || 1;
          const unitPrice = product?.price ?? 0;
          return { productId, quantity, unitPrice, totalPrice: unitPrice * quantity };
        }),
      },
    },
  });

  for (const productId of productIds) {
    const product = productMap.get(productId);
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

  if (metadata.couponCode) {
    const coupon = await prisma.coupon.findUnique({ where: { code: metadata.couponCode } });
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
    console.error('[Webhook] Referral attribution failed (non-fatal)', e);
  }

  console.log(`[Webhook] Store order ${order.id} fulfilled for ${userId}`);
}

// Grants an Entitlement/Enrollment for COURSE products (linked via metadata.courseId),
// creates a ChallengeEnrollment for CHALLENGE products (linked via Challenge.productId),
// and marks other product types simply fulfilled (StoreOrderItem already records the purchase).
async function fulfillProduct(
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

async function handleSubscriptionChange(subscription: any) {
  const customerId = subscription.customer;
  if (!customerId) return;
  const user = await prisma.user.findFirst({ where: { stripeCustomerId: customerId } });
  if (!user) return;

  const status = subscription.status;
  if (status === 'active' || status === 'trialing') {
    const priceId = subscription.items?.data?.[0]?.price?.id || '';
    const tier = priceId.includes('pro') ? MembershipTier.PRO : MembershipTier.BASIC;
    await prisma.user.update({
      where: { id: user.id },
      data: { membershipTier: tier, membershipExpiresAt: subscription.current_period_end ? new Date(subscription.current_period_end * 1000) : undefined },
    });
  } else {
    await prisma.user.update({
      where: { id: user.id },
      data: { membershipTier: MembershipTier.FREE, membershipExpiresAt: null },
    });
  }
}
