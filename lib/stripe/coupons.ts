// Stripe Promotion Code sync helper — mirrors Coupon records to Stripe.
// Tolerates a missing STRIPE_SECRET_KEY (demo mode), matching the pattern
// used in lib/email/resend.ts.

import type Stripe from "stripe";

let stripe: Stripe | null = null;
async function getStripe(): Promise<Stripe | null> {
  if (!stripe && process.env.STRIPE_SECRET_KEY) {
    const { default: StripeClient } = await import("stripe");
    stripe = new StripeClient(process.env.STRIPE_SECRET_KEY, { apiVersion: "2025-06-01" as Stripe.LatestApiVersion });
  }
  return stripe;
}

export const STRIPE_DEMO_MODE = !process.env.STRIPE_SECRET_KEY;

export interface StripeCouponSyncInput {
  code: string;
  discountType: "PERCENT" | "FIXED";
  amount: number;
  currency?: string;
  maxUses?: number | null;
  expiresAt?: Date | null;
}

/**
 * Creates (or recreates) a Stripe Coupon + Promotion Code for a given coupon.
 * Returns the Stripe promotion code ID, or a demo ID when Stripe isn't configured.
 */
export async function syncCouponToStripe(input: StripeCouponSyncInput): Promise<string | null> {
  const client = await getStripe();
  if (!client) {
    console.log(`[Stripe] DEMO → promotion code sync for "${input.code}"`);
    return `demo_promo_${Date.now()}`;
  }

  try {
    const couponParams: Stripe.CouponCreateParams = {
      name: input.code,
      ...(input.discountType === "PERCENT"
        ? { percent_off: input.amount }
        : { amount_off: Math.round(input.amount * 100), currency: (input.currency || "usd").toLowerCase() }),
    };
    const stripeCoupon = await client.coupons.create(couponParams);

    const promoParams: Stripe.PromotionCodeCreateParams = {
      promotion: { type: 'coupon', coupon: stripeCoupon.id },
      code: input.code,
      ...(input.maxUses ? { max_redemptions: input.maxUses } : {}),
      ...(input.expiresAt ? { expires_at: Math.floor(input.expiresAt.getTime() / 1000) } : {}),
    };
    const promotionCode = await client.promotionCodes.create(promoParams);
    return promotionCode.id;
  } catch (err) {
    console.error("[Stripe] Failed to sync promotion code:", err);
    return null;
  }
}

/**
 * Deactivates a Stripe promotion code (Stripe does not support deleting them).
 */
export async function deactivateStripePromotionCode(promotionCodeId: string | null | undefined) {
  if (!promotionCodeId || promotionCodeId.startsWith("demo_")) return;
  const client = await getStripe();
  if (!client) return;
  try {
    await client.promotionCodes.update(promotionCodeId, { active: false });
  } catch (err) {
    console.error("[Stripe] Failed to deactivate promotion code:", err);
  }
}
