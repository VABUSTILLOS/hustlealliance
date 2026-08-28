import { NextRequest, NextResponse } from "next/server";
import { getChallengeLeaderboard } from "@/lib/db/challenges";
import { getCurrentUser } from "@/lib/auth/user";
import prisma from "@/lib/db/prisma";

// GET /api/challenges/[slug]/leaderboard
export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { slug } = await params;
    const challenge = await prisma.challenge.findUnique({ where: { slug }, select: { id: true } });
    if (!challenge) return NextResponse.json({ error: "Challenge not found" }, { status: 404 });

    const leaderboard = await getChallengeLeaderboard(challenge.id, user.id);
    return NextResponse.json(leaderboard);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
