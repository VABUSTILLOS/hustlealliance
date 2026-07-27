import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

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
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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
      lineItems = [{ price: PRICE_IDS[`${tier}_monthly`], quantity: 1 }];
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
