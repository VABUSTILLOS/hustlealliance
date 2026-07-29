import { NextRequest, NextResponse } from "next/server";
import { sharePost } from "@/lib/db/posts";
import { getCurrentUser } from "@/lib/auth/user";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const share = await sharePost(id, user.id, body.content);
    return NextResponse.json(share, { status: 201 });
  } catch (err) {
    const msg = (err as Error).message;
    if (msg.includes("not found")) return NextResponse.json({ error: msg }, { status: 404 });
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
