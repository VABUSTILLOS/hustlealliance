import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, authErrorResponse } from "@/lib/auth/guard";
import { adminListChallenges, createChallenge } from "@/lib/db/challenges";
import { Prisma } from "@/lib/generated/prisma/client";
import type { ChallengeStatus } from "@/lib/generated/prisma/client";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
  } catch (err) {
    return authErrorResponse(err);
  }

  try {
    const { searchParams } = request.nextUrl;
    const status = (searchParams.get("status") as ChallengeStatus | null) ?? undefined;
    const search = searchParams.get("search") ?? undefined;
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
    const offset = parseInt(searchParams.get("offset") || "0");

    const result = await adminListChallenges({ status, search, limit, offset });
    return NextResponse.json(result, { headers: { "Cache-Control": "private, no-cache" } });
  } catch (err) {
    console.error("[GET /api/admin/challenges]", err);
    return NextResponse.json({ error: "Failed to fetch challenges" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  let admin;
  try {
    admin = await requireAdmin();
  } catch (err) {
    return authErrorResponse(err);
  }

  try {
    const body = await request.json();
    if (!body.title || !body.slug || !body.startDate || !body.endDate) {
      return NextResponse.json(
        { error: "title, slug, startDate, and endDate are required" },
        { status: 400 },
      );
    }
    const challenge = await createChallenge(body, admin.id);
    return NextResponse.json({ challenge }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/admin/challenges]", err);
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return NextResponse.json({ error: "A challenge with this slug already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create challenge" }, { status: 500 });
  }
}
