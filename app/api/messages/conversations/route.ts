import { NextRequest, NextResponse } from "next/server";
import { getConversations, createConversation } from "@/lib/db/messages";
import { getCurrentUser } from "@/lib/auth/user";

// GET /api/messages/conversations?cursor=&limit=
export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor") ?? undefined;
    const limit = Math.min(Number(searchParams.get("limit")) || 20, 50);

    const result = await getConversations(user.id, cursor, limit);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

// POST /api/messages/conversations — create conversation
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { participantIds, title, isGroup } = body;

    if (!participantIds || !Array.isArray(participantIds) || participantIds.length === 0) {
      return NextResponse.json({ error: "participantIds is required" }, { status: 400 });
    }

    const conv = await createConversation(user.id, participantIds, title, isGroup ?? participantIds.length > 1);
    return NextResponse.json(conv, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
