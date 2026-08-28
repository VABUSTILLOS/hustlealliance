import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, authErrorResponse } from "@/lib/auth/guard";
import { getAdminProducts, createAdminProduct, isUniqueConstraintError } from "@/lib/db/admin-store";
import { ProductType } from "@/lib/generated/prisma/client";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
  } catch (err) {
    return authErrorResponse(err);
  }

  try {
    const { searchParams } = request.nextUrl;
    const type = (searchParams.get("type") as ProductType | null) ?? undefined;
    const search = searchParams.get("search") ?? undefined;
    const publishedParam = searchParams.get("published");
    const isPublished = publishedParam === null ? undefined : publishedParam === "true";
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
    const offset = parseInt(searchParams.get("offset") || "0");

    const result = await getAdminProducts({ type, search, isPublished, limit, offset });
    return NextResponse.json(result, { headers: { "Cache-Control": "private, no-cache" } });
  } catch (err) {
    console.error("[GET /api/admin/products]", err);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
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
    if (!body.title || !body.slug || !body.description || body.price === undefined) {
      return NextResponse.json({ error: "title, slug, description, and price are required" }, { status: 400 });
    }
    const product = await createAdminProduct(body);
    return NextResponse.json({ product }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/admin/products]", err);
    if (isUniqueConstraintError(err)) {
      return NextResponse.json({ error: "A product with this slug already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
