import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/user";
import { validateAndComputeCoupon } from "@/lib/db/admin-store";

// POST /api/store/coupons/apply — validate a coupon code against the current
// cart and compute the discounted total.
export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const { code, subtotal, productIds } = body as {
      code?: string;
      subtotal?: number;
      productIds?: string[];
    };

    if (!code || subtotal === undefined) {
      return NextResponse.json({ error: "code and subtotal are required" }, { status: 400 });
    }

    const result = await validateAndComputeCoupon({ code, subtotal, productIds });
    if (!result.valid) {
      return NextResponse.json({ valid: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      valid: true,
      code: result.coupon!.code,
      discountType: result.coupon!.discountType,
      discountAmount: result.discountAmount,
      newTotal: result.newTotal,
    });
  } catch (err) {
    console.error("[POST /api/store/coupons/apply]", err);
    return NextResponse.json({ error: "Failed to apply coupon" }, { status: 500 });
  }
}
