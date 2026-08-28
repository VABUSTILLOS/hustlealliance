import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, authErrorResponse } from "@/lib/auth/guard";
import { getAdminCoupons, createAdminCoupon, isUniqueConstraintError } from "@/lib/db/admin-store";
import { syncCouponToStripe } from "@/lib/stripe/coupons";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
  } catch (err) {
    return authErrorResponse(err);
  }

  try {
    const { searchParams } = request.nextUrl;
    const search = searchParams.get("search") ?? undefined;
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
    const offset = parseInt(searchParams.get("offset") || "0");

    const result = await getAdminCoupons({ search, limit, offset });
    return NextResponse.json(result, { headers: { "Cache-Control": "private, no-cache" } });
  } catch (err) {
    console.error("[GET /api/admin/coupons]", err);
    return NextResponse.json({ error: "Failed to fetch coupons" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
  } catch (err) {
    return authErrorResponse(err);
  }

  try {
    const body = await request.json();
    if (!body.code || !body.discountType || body.amount === undefined) {
      return NextResponse.json({ error: "code, discountType, and amount are required" }, { status: 400 });
    }

    const stripePromotionCodeId = await syncCouponToStripe({
      code: body.code.toUpperCase(),
      discountType: body.discountType,
      amount: body.amount,
      currency: body.currency,
      maxUses: body.maxUses,
      expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
    });

    const coupon = await createAdminCoupon(body, stripePromotionCodeId);
    return NextResponse.json({ coupon }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/admin/coupons]", err);
    if (isUniqueConstraintError(err)) {
      return NextResponse.json({ error: "A coupon with this code already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create coupon" }, { status: 500 });
  }
}
