import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";

// GET /api/profile/[username]
export async function GET(_req: NextRequest, { params }: { params: Promise<{ username: string }> }) {
  try {
    const { username } = await params;
    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        profile: true,
        posts: { take: 5, orderBy: { createdAt: "desc" } },
      },
    });
    if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const publicUser = user;
    return NextResponse.json(publicUser);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
