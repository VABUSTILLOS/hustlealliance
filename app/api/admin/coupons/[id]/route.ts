import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, authErrorResponse } from "@/lib/auth/guard";
import {
  getAdminCouponById,
  updateAdminCoupon,
  deleteAdminCoupon,
  isUniqueConstraintError,
} from "@/lib/db/admin-store";
import { syncCouponToStripe, deactivateStripePromotionCode } from "@/lib/stripe/coupons";

export async function GET(
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
    const coupon = await getAdminCouponById(id);
    if (!coupon) return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    return NextResponse.json({ coupon });
  } catch (err) {
    console.error("[GET /api/admin/coupons/[id]]", err);
    return NextResponse.json({ error: "Failed to fetch coupon" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
  } catch (err) {
    return authErrorResponse(err);
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const existing = await getAdminCouponById(id);
    if (!existing) return NextResponse.json({ error: "Coupon not found" }, { status: 404 });

    // Re-sync to Stripe: deactivate old promotion code, create a new one if
    // discount-affecting fields changed.
    await deactivateStripePromotionCode(existing.stripePromotionCodeId);
    const stripePromotionCodeId = await syncCouponToStripe({
      code: (body.code ?? existing.code).toUpperCase(),
      discountType: body.discountType ?? existing.discountType,
      amount: body.amount ?? existing.amount,
      currency: body.currency ?? existing.currency,
      maxUses: body.maxUses !== undefined ? body.maxUses : existing.maxUses,
      expiresAt: body.expiresAt ? new Date(body.expiresAt) : existing.expiresAt,
    });

    const coupon = await updateAdminCoupon(id, body, stripePromotionCodeId);
    return NextResponse.json({ coupon });
  } catch (err) {
    console.error("[PUT /api/admin/coupons/[id]]", err);
    if (isUniqueConstraintError(err)) {
      return NextResponse.json({ error: "A coupon with this code already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to update coupon" }, { status: 500 });
  }
}

export async function DELETE(
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
    const existing = await getAdminCouponById(id);
    if (existing) await deactivateStripePromotionCode(existing.stripePromotionCodeId);
    await deleteAdminCoupon(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/admin/coupons/[id]]", err);
    return NextResponse.json({ error: "Failed to delete coupon" }, { status: 500 });
  }
}
