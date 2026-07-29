import { NextRequest, NextResponse } from "next/server";
import { addToCart, getCart } from "@/lib/db/store";
import { getCurrentUser } from "@/lib/auth/user";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const cart = await getCart(user.id);
    return NextResponse.json(cart);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { productId, quantity } = await req.json();
    if (!productId || !quantity || quantity < 1) {
      return NextResponse.json({ error: "Invalid product or quantity" }, { status: 400 });
    }

    const item = await addToCart(user.id, productId, quantity);
    return NextResponse.json(item, { status: 201 });
  } catch (err) {
    const message = (err as Error).message;
    if (message.includes("not available")) return NextResponse.json({ error: message }, { status: 404 });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
