import { NextRequest, NextResponse } from "next/server";
import { removeParticipant } from "@/lib/db/messages";
import { getCurrentUser } from "@/lib/auth/user";

// DELETE /api/messages/conversations/[id]/participants/[userId]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; userId: string }> },
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id, userId: targetUserId } = await params;
    await removeParticipant(id, user.id, targetUserId);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
