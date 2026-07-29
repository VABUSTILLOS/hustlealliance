import { NextRequest, NextResponse } from "next/server";
import { addParticipant } from "@/lib/db/messages";
import { getCurrentUser } from "@/lib/auth/user";

// POST /api/messages/conversations/[id]/participants
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const { userId: newUserId } = await req.json();
    if (!newUserId) return NextResponse.json({ error: "userId is required" }, { status: 400 });

    const participant = await addParticipant(id, user.id, newUserId);
    return NextResponse.json(participant, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
