import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/user";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { pollId, optionId } = await req.json();
    if (!pollId || !optionId) {
      return NextResponse.json({ error: "pollId and optionId required" }, { status: 400 });
    }

    const poll = await prisma.poll.findUnique({
      where: { id: pollId },
      include: { options: { select: { id: true } } },
    });
    if (!poll) return NextResponse.json({ error: "Poll not found" }, { status: 404 });
    if (poll.expiresAt && poll.expiresAt < new Date()) {
      return NextResponse.json({ error: "Poll has ended" }, { status: 410 });
    }
    if (!poll.options.some((o) => o.id === optionId)) {
      return NextResponse.json({ error: "Option does not belong to this poll" }, { status: 400 });
    }

    // One vote per user per poll; re-voting switches the choice
    await prisma.pollVote.upsert({
      where: { pollId_userId: { pollId, userId: user.id } },
      create: { pollId, optionId, userId: user.id },
      update: { optionId },
    });

    const options = await prisma.pollOption.findMany({
      where: { pollId },
      orderBy: { order: "asc" },
      include: { _count: { select: { votes: true } } },
    });

    return NextResponse.json({
      myVoteOptionId: optionId,
      totalVotes: options.reduce((sum, o) => sum + o._count.votes, 0),
      options: options.map((o) => ({ id: o.id, text: o.text, votes: o._count.votes })),
    });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
