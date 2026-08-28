import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/user";
import prisma from "@/lib/db/prisma";
import { createAndFulfillStoreOrder } from "@/lib/stripe/fulfill-order";

let stripe: any = null;
function getStripe() {
  if (!stripe && process.env.STRIPE_SECRET_KEY) {
    const Stripe = require("stripe");
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2025-06-01" as any });
  }
  return stripe;
}

const DEMO_MODE = !process.env.STRIPE_SECRET_KEY;

// POST /api/store/upsell {orderId} — one-click post-purchase upsell.
// Looks up the upsellProductId from the first purchased product on the order,
// and attempts an off-session charge against the user's saved Stripe payment
// method. Falls back to a fresh Checkout Session when no saved method exists.
export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const orderId: string | undefined = body.orderId;
    if (!orderId) return NextResponse.json({ error: "orderId is required" }, { status: 400 });

    const order = await prisma.storeOrder.findUnique({
      where: { id: orderId },
      include: { items: { include: { product: { include: { upsellProduct: true } } } } },
    });
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    if (order.userId !== user.id) return NextResponse.json({ error: "Not authorized to view this order" }, { status: 403 });

    const upsellProduct = order.items.map((i) => i.product.upsellProduct).find(Boolean);
    if (!upsellProduct) return NextResponse.json({ error: "No upsell offer available for this order" }, { status: 404 });

    const origin = request.nextUrl.origin;

    if (DEMO_MODE) {
      const demoOrder = await createAndFulfillStoreOrder({
        userId: user.id,
        items: [{ productId: upsellProduct.id, quantity: 1 }],
        currency: upsellProduct.currency,
        stripePaymentIntentId: `demo_upsell_${Date.now()}`,
      });
      return NextResponse.json({ success: true, orderId: demoOrder.id, demo: true });
    }

    const client = getStripe();
    if (!client) return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });

    const dbUser = await prisma.user.findUnique({ where: { id: user.id }, select: { stripeCustomerId: true } });
    const customerId = dbUser?.stripeCustomerId;

    let defaultPaymentMethodId: string | null = null;
    if (customerId) {
      try {
        const customer = await client.customers.retrieve(customerId);
        defaultPaymentMethodId =
          (typeof customer.invoice_settings?.default_payment_method === "string"
            ? customer.invoice_settings.default_payment_method
            : customer.invoice_settings?.default_payment_method?.id) || null;
      } catch (err) {
        console.error("[POST /api/store/upsell] Failed to retrieve Stripe customer:", err);
      }
    }

    if (customerId && defaultPaymentMethodId) {
      try {
        const paymentIntent = await client.paymentIntents.create({
          amount: Math.round(upsellProduct.price * 100),
          currency: (upsellProduct.currency || "usd").toLowerCase(),
          customer: customerId,
          payment_method: defaultPaymentMethodId,
          off_session: true,
          confirm: true,
          metadata: { userId: user.id, type: "store-upsell", upsellProductId: upsellProduct.id, orderId },
        });

        if (paymentIntent.status === "succeeded") {
          const fulfilled = await createAndFulfillStoreOrder({
            userId: user.id,
            items: [{ productId: upsellProduct.id, quantity: 1 }],
            currency: upsellProduct.currency,
            stripePaymentIntentId: paymentIntent.id,
          });
          return NextResponse.json({ success: true, orderId: fulfilled.id });
        }

        return NextResponse.json({ error: "Payment did not succeed" }, { status: 402 });
      } catch (err: any) {
        // Off-session charges can be declined (e.g. requires re-authentication) —
        // fall back to a fresh checkout session in that case.
        console.error("[POST /api/store/upsell] Off-session charge failed, falling back:", err.message);
      }
    }

    // No saved payment method (or off-session charge failed) — offer a fresh checkout session.
    const session = await client.checkout.sessions.create({
      mode: "payment",
      line_items: [{
        price_data: {
          currency: (upsellProduct.currency || "usd").toLowerCase(),
          product_data: { name: upsellProduct.title },
          unit_amount: Math.round(upsellProduct.price * 100),
        },
        quantity: 1,
      }],
      success_url: `${origin}/store/orders?checkout=success`,
      cancel_url: `${origin}/store/orders`,
      metadata: { userId: user.id, type: "store", productIds: upsellProduct.id, quantities: "1" },
      customer_email: user.email,
    });

    return NextResponse.json({ requiresCheckout: true, url: session.url });
  } catch (err) {
    console.error("[POST /api/store/upsell]", err);
    return NextResponse.json({ error: "Failed to process upsell" }, { status: 500 });
  }
}
