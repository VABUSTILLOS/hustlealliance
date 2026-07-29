import { NextRequest, NextResponse } from "next/server";
import { getUserOrders, createOrder } from "@/lib/db/store";
import { getCurrentUser } from "@/lib/auth/user";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const orders = await getUserOrders(user.id);
    return NextResponse.json(orders);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { items, currency } = await req.json();
    const order = await createOrder({ userId: user.id, items, currency });
    return NextResponse.json(order, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
