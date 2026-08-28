import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, authErrorResponse } from "@/lib/auth/guard";
import { getAdminOrders } from "@/lib/db/admin-store";

// GET /api/admin/store/orders — paginated list of store orders for the admin orders table.
export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
  } catch (err) {
    return authErrorResponse(err);
  }

  try {
    const { searchParams } = request.nextUrl;
    const status = searchParams.get("status") ?? undefined;
    const search = searchParams.get("search") ?? undefined;
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
    const offset = parseInt(searchParams.get("offset") || "0");

    const result = await getAdminOrders({ status, search, limit, offset });
    return NextResponse.json(result, { headers: { "Cache-Control": "private, no-cache" } });
  } catch (err) {
    console.error("[GET /api/admin/store/orders]", err);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
