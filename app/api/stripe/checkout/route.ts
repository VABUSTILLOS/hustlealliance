import { NextRequest, NextResponse } from 'next/server';
// TODO: IMPLEMENT REAL AUTH - REVERT FOR PRODUCTION
import { getCurrentUser } from "@/lib/auth/user";

// ─── Stripe lazy init ───────────────────────────────────────────────
let stripe: any = null;
function getStripe() {
  if (!stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (key) {
      const Stripe = require('stripe');
      stripe = new Stripe(key, { apiVersion: '2025-06-01' as any });
    }
  }
  return stripe;
}

// ─── Price IDs ──────────────────────────────────────────────────────

const PRICE_IDS: Record<string, string> = {
  basic_monthly: process.env.STRIPE_PRICE_BASIC_MONTHLY || 'price_basic_monthly',
  pro_monthly: process.env.STRIPE_PRICE_PRO_MONTHLY || 'price_pro_monthly',
  basic_yearly: process.env.STRIPE_PRICE_BASIC_YEARLY || 'price_basic_yearly',
  pro_yearly: process.env.STRIPE_PRICE_PRO_YEARLY || 'price_pro_yearly',
};

const DEMO_MODE = !process.env.STRIPE_SECRET_KEY;

// POST /api/stripe/checkout — create a Stripe Checkout Session
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    const body = await request.json();
    const origin = request.nextUrl.origin;
    const successUrl = body.successUrl || `${origin}/learning?checkout=success`;
    const cancelUrl = body.cancelUrl || `${origin}/pricing?checkout=cancelled`;

    if (DEMO_MODE) {
      const demoSessionId = `demo_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      return NextResponse.json({
        url: `${successUrl}?session_id=${demoSessionId}&demo=true`,
        sessionId: demoSessionId,
        demo: true,
      });
    }

    const stripeClient = getStripe();
    if (!stripeClient) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
    }

    let lineItems: any[];
    let mode: 'subscription' | 'payment';
    const metadata: Record<string, string> = {
      userId: user.id,
      type: body.type || 'course',
      courseId: body.courseId || '',
      lessonId: body.lessonId || '',
      tier: body.tier || '',
    };

    if (body.type === 'subscription') {
      mode = 'subscription';
      const tier = body.tier === 'BASIC' ? 'basic' : 'pro';
      const interval = body.interval === 'yearly' ? 'yearly' : 'monthly';
      lineItems = [{ price: PRICE_IDS[`${tier}_${interval}`], quantity: 1 }];
    } else if (body.type === 'store') {
      // ── Store checkout: cart of Product records, optional coupon + bump ──
      const { default: db } = await import('@/lib/db/prisma');
      const items: { productId: string; quantity: number }[] = Array.isArray(body.items) ? body.items : [];
      if (items.length === 0) {
        return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
      }

      // If a bump/upsell product was accepted, fold it into the cart.
      if (body.bumpProductId && !items.some((i) => i.productId === body.bumpProductId)) {
        items.push({ productId: body.bumpProductId, quantity: 1 });
      }

      const products = await db.product.findMany({
        where: { id: { in: items.map((i) => i.productId) } },
      });
      if (products.length !== new Set(items.map((i) => i.productId)).size) {
        return NextResponse.json({ error: 'One or more products not found' }, { status: 404 });
      }

      const productMap = new Map(products.map((p) => [p.id, p]));
      const subscriptionProduct = products.find((p) => p.type === 'MEMBERSHIP' && p.recurringInterval);

      metadata.productIds = items.map((i) => i.productId).join(',');
      metadata.quantities = items.map((i) => i.quantity).join(',');
      metadata.type = 'store';

      if (subscriptionProduct) {
        // Membership products are billed as recurring subscriptions; keep the
        // cart to a single subscription item for simplicity.
        mode = 'subscription';
        metadata.membershipProductId = subscriptionProduct.id;
        lineItems = [{
          price_data: {
            currency: (subscriptionProduct.currency || 'usd').toLowerCase(),
            product_data: { name: subscriptionProduct.title },
            unit_amount: Math.round(subscriptionProduct.price * 100),
            recurring: { interval: subscriptionProduct.recurringInterval === 'year' ? 'year' : 'month' },
          },
          quantity: 1,
        }];
      } else {
        mode = 'payment';
        lineItems = items.map((item) => {
          const product = productMap.get(item.productId)!;
          return {
            price_data: {
              currency: (product.currency || 'usd').toLowerCase(),
              product_data: { name: product.title },
              unit_amount: Math.round(product.price * 100),
            },
            quantity: item.quantity,
          };
        });
      }

      let stripePromotionCodeId: string | null | undefined;
      if (body.couponCode) {
        const { validateAndComputeCoupon } = await import('@/lib/db/admin-store');
        const subtotal = items.reduce((sum, item) => {
          const product = productMap.get(item.productId)!;
          return sum + product.price * item.quantity;
        }, 0);
        const result = await validateAndComputeCoupon({
          code: body.couponCode,
          subtotal,
          productIds: items.map((i) => i.productId),
        });
        if (result.valid) {
          metadata.couponCode = result.coupon!.code;
          stripePromotionCodeId = result.coupon!.stripePromotionCodeId;
        }
      }

      const usePromotionCode = stripePromotionCodeId && !stripePromotionCodeId.startsWith('demo_');

      // Installments (Klarna/Afterpay) for one-time store purchases — gated by a
      // SiteSetting so it can be toggled without a deploy once currency/country
      // eligibility has been verified; Stripe only surfaces them when eligible.
      let installmentsEnabled = false;
      if (mode === 'payment') {
        const installmentsSetting = await db.siteSetting.findUnique({ where: { key: 'installmentsEnabled' } });
        installmentsEnabled = installmentsSetting?.value === true;
      }

      const session = await stripeClient.checkout.sessions.create({
        mode,
        line_items: lineItems,
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata,
        customer_email: user.email,
        allow_promotion_codes: !usePromotionCode,
        ...(usePromotionCode ? { discounts: [{ promotion_code: stripePromotionCodeId }] } : {}),
        ...(mode === 'subscription' && subscriptionProduct?.trialDays
          ? { subscription_data: { trial_period_days: subscriptionProduct.trialDays } }
          : {}),
        ...(installmentsEnabled ? { payment_method_types: ['card', 'klarna', 'afterpay_clearpay'] } : {}),
      });

      return NextResponse.json({ url: session.url, sessionId: session.id });
    } else {
      mode = 'payment';
      const { default: db } = await import('@/lib/db/prisma');
      let price: number | null = null;
      let productName = '';

      if (body.courseId) {
        const course = await db.course.findUnique({
          where: { id: body.courseId },
          select: { title: true, price: true },
        });
        if (!course) return NextResponse.json({ error: 'Course not found' }, { status: 404 });
        price = course.price;
        productName = course.title;
      } else if (body.lessonId) {
        const lesson = await db.lesson.findUnique({
          where: { id: body.lessonId },
          select: {
            title: true,
            module: { select: { course: { select: { price: true, title: true } } } },
          },
        });
        if (!lesson) return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
        price = lesson.module.course.price;
        productName = `${lesson.module.course.title} – ${lesson.title}`;
      }

      if (!price || price <= 0) {
        return NextResponse.json({ error: 'Content not available for purchase' }, { status: 400 });
      }

      lineItems = [{
        price_data: {
          currency: 'usd',
          product_data: { name: productName },
          unit_amount: Math.round(price * 100),
        },
        quantity: 1,
      }];
    }

    const session = await stripeClient.checkout.sessions.create({
      mode,
      line_items: lineItems,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata,
      customer_email: user.email,
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (error: any) {
    console.error('[POST /api/stripe/checkout] Error:', error);
    return NextResponse.json({ error: error.message || 'Checkout failed' }, { status: 500 });
  }
}
