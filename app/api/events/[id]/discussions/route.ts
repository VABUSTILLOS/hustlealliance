import { NextRequest, NextResponse } from "next/server";
import { addEventDiscussion, getEventDiscussions } from "@/lib/db/events";
import { getCurrentUser } from "@/lib/auth/user";

// GET /api/events/[id]/discussions
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor") ?? undefined;
    const limit = parseInt(searchParams.get("limit") ?? "20");
    const result = await getEventDiscussions(id, limit, cursor);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

// POST /api/events/[id]/discussions
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await params;
    const { content } = await req.json();
    if (!content || typeof content !== "string" || !content.trim()) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }
    const discussion = await addEventDiscussion(id, user.id, content.trim());
    return NextResponse.json(discussion, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
