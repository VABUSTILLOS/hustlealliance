import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, authErrorResponse } from "@/lib/auth/guard";
import { getAdminProductById, updateAdminProduct, deleteAdminProduct, isUniqueConstraintError } from "@/lib/db/admin-store";
import { logAdminActivity } from "@/lib/activity";

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
    const product = await getAdminProductById(id);
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });
    return NextResponse.json({ product });
  } catch (err) {
    console.error("[GET /api/admin/products/[id]]", err);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let user;
  try {
    user = await requireAdmin();
  } catch (err) {
    return authErrorResponse(err);
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const product = await updateAdminProduct(id, body);
    await logAdminActivity({ actorId: user.id, action: 'product.update', entity: 'Product', entityId: id, meta: { fields: Object.keys(body || {}) } });
    return NextResponse.json({ product });
  } catch (err) {
    console.error("[PUT /api/admin/products/[id]]", err);
    if (isUniqueConstraintError(err)) {
      return NextResponse.json({ error: "A product with this slug already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let user;
  try {
    user = await requireAdmin();
  } catch (err) {
    return authErrorResponse(err);
  }

  try {
    const { id } = await params;
    await deleteAdminProduct(id);
    await logAdminActivity({ actorId: user.id, action: 'product.delete', entity: 'Product', entityId: id });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/admin/products/[id]]", err);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
