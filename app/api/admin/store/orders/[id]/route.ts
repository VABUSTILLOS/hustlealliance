import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, authErrorResponse } from "@/lib/auth/guard";
import { getAdminOrderById } from "@/lib/db/admin-store";

// GET /api/admin/store/orders/[id] — order detail for the admin order page.
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
    const order = await getAdminOrderById(id);
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    return NextResponse.json({ order });
  } catch (err) {
    console.error("[GET /api/admin/store/orders/[id]]", err);
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}
