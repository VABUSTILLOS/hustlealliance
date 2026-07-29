import { NextRequest, NextResponse } from "next/server";
import { getMessages, sendMessage } from "@/lib/db/messages";
import { getCurrentUser } from "@/lib/auth/user";

// GET /api/messages/conversations/[id]/messages
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const { searchParams } = new URL(_req.url);
    const limit = parseInt(searchParams.get("limit") ?? "50");
    const cursor = searchParams.get("cursor") ?? undefined;
    const messages = await getMessages(id, limit, cursor);
    return NextResponse.json(messages);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

// POST /api/messages/conversations/[id]/messages
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const body = await req.json();
    const message = await sendMessage({ conversationId: id, senderId: user.id, ...body });
    return NextResponse.json(message, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
