import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, authErrorResponse } from "@/lib/auth/guard";
import prisma from "@/lib/db/prisma";

// ─── Stripe lazy init (matches lib/stripe/coupons.ts pattern) ───────────
let stripe: any = null;
function getStripe() {
  if (!stripe && process.env.STRIPE_SECRET_KEY) {
    const Stripe = require("stripe");
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2025-06-01" as any });
  }
  return stripe;
}

// POST /api/admin/store/orders/[id]/refund — full refund for the order's
// Stripe payment intent, marks the order REFUNDED, and revokes course
// enrollment for any COURSE line items. Idempotent: returns 409 if already
// refunded.
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
  } catch (err) {
    return authErrorResponse(err);
  }

  try {
    const { id } = await params;
    const order = await prisma.storeOrder.findUnique({
      where: { id },
      include: { items: { include: { product: true } } },
    });
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    if (order.status === "REFUNDED") {
      return NextResponse.json({ error: "Order already refunded" }, { status: 409 });
    }

    if (order.stripePaymentIntentId && !order.stripePaymentIntentId.startsWith("demo_")) {
      const client = getStripe();
      if (client) {
        try {
          await client.refunds.create({ payment_intent: order.stripePaymentIntentId });
        } catch (err: any) {
          console.error("[POST /api/admin/store/orders/[id]/refund] Stripe refund failed:", err);
          return NextResponse.json({ error: err.message || "Stripe refund failed" }, { status: 502 });
        }
      }
    }

    await prisma.storeOrder.update({ where: { id }, data: { status: "REFUNDED" } });

    // Revoke course access for any COURSE line items linked via metadata.courseId.
    for (const item of order.items) {
      if (item.product.type !== "COURSE") continue;
      const meta = (item.product.metadata as Record<string, unknown> | null) ?? {};
      const courseId = typeof meta.courseId === "string" ? meta.courseId : undefined;
      if (!courseId) continue;
      await prisma.enrollment
        .delete({ where: { userId_courseId: { userId: order.userId, courseId } } })
        .catch(() => {});
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[POST /api/admin/store/orders/[id]/refund]", err);
    return NextResponse.json({ error: "Failed to process refund" }, { status: 500 });
  }
}
