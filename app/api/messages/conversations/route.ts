import { NextRequest, NextResponse } from "next/server";
import { getUserConversations, getOrCreateDirectConversation, createGroupConversation } from "@/lib/db/messages";
import { getCurrentUser } from "@/lib/auth/user";

// GET /api/messages/conversations
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {

    const conversations = await getUserConversations(user.id);
    return NextResponse.json(conversations);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

// POST /api/messages/conversations — create or get
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    if (body.isGroup) {
      const conv = await createGroupConversation(body.name, user.id, body.participantIds);
      return NextResponse.json(conv, { status: 201 });
    }
    const conv = await getOrCreateDirectConversation(user.id, body.userId);
    return NextResponse.json(conv);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
