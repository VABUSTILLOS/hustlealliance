import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/user";
import { getSpaceBySlug } from "@/lib/db/spaces";
import { leaveGroup } from "@/lib/db/groups";

// POST /api/spaces/[slug]/leave — idempotent leave.
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { slug } = await params;
    const space = await getSpaceBySlug(slug);
    if (!space) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const existing = await prisma.communityGroupMember.findUnique({
      where: { groupId_userId: { groupId: space.id, userId: user.id } },
    });
    if (!existing) {
      return NextResponse.json({ ok: true }); // Nothing to leave.
    }

    await leaveGroup(space.id, user.id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
