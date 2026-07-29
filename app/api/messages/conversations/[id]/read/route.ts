import { NextRequest, NextResponse } from "next/server";
import { markRead } from "@/lib/db/messages";
import { getCurrentUser } from "@/lib/auth/user";

// POST /api/messages/conversations/[id]/read
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const { messageId } = await req.json();
    if (!messageId) return NextResponse.json({ error: "messageId is required" }, { status: 400 });

    await markRead(id, user.id, messageId);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
