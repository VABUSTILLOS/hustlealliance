import { NextRequest, NextResponse } from "next/server";
import { listChallenges } from "@/lib/db/challenges";
import { getCurrentUser } from "@/lib/auth/user";
import type { ChallengeStatus } from "@/lib/generated/prisma/client";

// GET /api/challenges
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const status = (searchParams.get("status") as ChallengeStatus | null) ?? undefined;
  const search = searchParams.get("search") ?? undefined;
  const cursor = searchParams.get("cursor") ?? undefined;
  const limit = parseInt(searchParams.get("limit") ?? "20");

  try {
    const user = await getCurrentUser();
    const result = await listChallenges({
      status,
      search,
      cursor,
      limit,
      userId: user?.id,
    });
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
