import { NextRequest, NextResponse } from "next/server";
import { listProducts, createProduct } from "@/lib/db/store";
import { getCurrentUser } from "@/lib/auth/user";
import { ProductType } from "@/lib/generated/prisma/client";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") ?? undefined;
  const limit = parseInt(searchParams.get("limit") ?? "20");
  const cursor = searchParams.get("cursor") ?? undefined;

  try {
    const products = await listProducts({ type: type as ProductType, limit, cursor });
    return NextResponse.json(products);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const product = await createProduct(body);
    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
