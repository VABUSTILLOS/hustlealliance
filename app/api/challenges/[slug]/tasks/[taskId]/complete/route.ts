import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { completeChallengeTask } from "@/lib/db/challenges";
import { getCurrentUser } from "@/lib/auth/user";

// POST /api/challenges/[slug]/tasks/[taskId]/complete
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string; taskId: string }> },
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { slug, taskId } = await params;
    const challenge = await prisma.challenge.findUnique({ where: { slug }, select: { id: true } });
    if (!challenge) return NextResponse.json({ error: "Challenge not found" }, { status: 404 });

    const body = await req.json().catch(() => ({}));
    const proofText = typeof body?.proofText === "string" ? body.proofText : undefined;

    const completion = await completeChallengeTask({
      challengeId: challenge.id,
      userId: user.id,
      taskId,
      proofText,
    });
    return NextResponse.json(completion, { status: 201 });
  } catch (err) {
    const message = (err as Error).message;
    const status = message.includes("not enrolled") ? 403 : message.includes("not found") ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
