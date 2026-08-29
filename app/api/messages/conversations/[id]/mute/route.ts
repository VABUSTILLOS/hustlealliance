import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/user";

// POST /api/messages/conversations/[id]/mute — toggle mute for current user
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const participant = await prisma.conversationParticipant.findUnique({
      where: { conversationId_userId: { conversationId: id, userId: user.id } },
      select: { mutedAt: true },
    });
    if (!participant) return NextResponse.json({ error: "Not a participant" }, { status: 403 });

    const updated = await prisma.conversationParticipant.update({
      where: { conversationId_userId: { conversationId: id, userId: user.id } },
      data: { mutedAt: participant.mutedAt ? null : new Date() },
      select: { mutedAt: true },
    });
    return NextResponse.json({ muted: !!updated.mutedAt });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
