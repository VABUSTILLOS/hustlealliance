import { NextRequest, NextResponse } from "next/server";
import { getOrder } from "@/lib/db/store";
import { getCurrentUser } from "@/lib/auth/user";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const order = await getOrder(id, user.id);
    return NextResponse.json(order);
  } catch (err) {
    const message = (err as Error).message;
    if (message.includes("Not found")) return NextResponse.json({ error: message }, { status: 404 });
    if (message.includes("Not authorized")) return NextResponse.json({ error: message }, { status: 403 });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
