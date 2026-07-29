import { NextRequest, NextResponse } from "next/server";
import { togglePinPost } from "@/lib/db/posts";
import { getCurrentUser } from "@/lib/auth/user";

export async function PUT(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const post = await togglePinPost(id, user.id);
    return NextResponse.json(post);
  } catch (err) {
    const msg = (err as Error).message;
    if (msg.includes("not found")) return NextResponse.json({ error: msg }, { status: 404 });
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
