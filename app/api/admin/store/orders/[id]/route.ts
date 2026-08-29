import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, authErrorResponse } from "@/lib/auth/guard";
import { getAdminOrderById } from "@/lib/db/admin-store";
import { prisma } from "@/lib/db/prisma";
import { logAdminActivity } from "@/lib/activity";

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

// PATCH /api/admin/store/orders/[id] — update internal notes and/or mark fulfilled.
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin();
    const { id } = await params;
    const body = await request.json();

    const data: { notes?: string | null; status?: "FULFILLED" } = {};
    if (typeof body.notes === "string" || body.notes === null) {
      data.notes = typeof body.notes === "string" ? body.notes.slice(0, 2000) : null;
    }
    if (body.markFulfilled === true) {
      data.status = "FULFILLED";
    }
    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
    }

    const order = await prisma.storeOrder.update({ where: { id }, data });

    await logAdminActivity({
      actorId: admin.id,
      action: data.status ? "order.mark_fulfilled" : "order.update_notes",
      entity: "StoreOrder",
      entityId: id,
    });

    return NextResponse.json({ order });
  } catch (err) {
    return authErrorResponse(err);
  }
}
