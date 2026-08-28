import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";

// GET /api/community/users/search?q=&limit=
// Lightweight username/name lookup for @mention autocomplete.
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") ?? "").trim();
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "5") || 5, 20);

  if (q.length < 2) {
    return NextResponse.json({ users: [] });
  }

  try {
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { username: { contains: q, mode: "insensitive" } },
          { name: { contains: q, mode: "insensitive" } },
        ],
      },
      select: { id: true, name: true, username: true, avatar: true },
      orderBy: { username: "asc" },
      take: limit,
    });

    return NextResponse.json({ users });
  } catch (err) {
    console.error("[community/users/search] Error:", err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
