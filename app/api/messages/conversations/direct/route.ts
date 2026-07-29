import { NextRequest, NextResponse } from "next/server";
import { getOrCreateDirectConversation } from "@/lib/db/messages";
import { getCurrentUser } from "@/lib/auth/user";

// POST /api/messages/conversations/direct
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { userId: otherUserId } = await req.json();
    if (!otherUserId) return NextResponse.json({ error: "userId is required" }, { status: 400 });
    if (otherUserId === user.id) return NextResponse.json({ error: "Cannot message yourself" }, { status: 400 });

    const conv = await getOrCreateDirectConversation(user.id, otherUserId);
    return NextResponse.json(conv);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
