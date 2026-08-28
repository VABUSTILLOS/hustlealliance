import { NextRequest, NextResponse } from "next/server";
import { getChallengeBySlug } from "@/lib/db/challenges";
import { getCurrentUser } from "@/lib/auth/user";

// GET /api/challenges/[slug]
export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { slug } = await params;
    const challenge = await getChallengeBySlug(slug, user.id);
    if (!challenge) return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
    return NextResponse.json(challenge);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
