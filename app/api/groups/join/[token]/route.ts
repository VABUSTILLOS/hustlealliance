import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { joinGroup } from "@/lib/db/groups";
import { getCurrentUser } from "@/lib/auth/user";

// POST /api/groups/join/[token] — join a group via shareable invite link
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { token } = await params;
    const group = await prisma.communityGroup.findUnique({
      where: { inviteToken: token },
      select: { id: true, slug: true, name: true, visibility: true },
    });
    if (!group) return NextResponse.json({ error: "Invalid invite link" }, { status: 404 });

    const existing = await prisma.communityGroupMember.findUnique({
      where: { groupId_userId: { groupId: group.id, userId: user.id } },
    });
    if (existing) {
      return NextResponse.json({ slug: group.slug, status: existing.status, alreadyMember: true });
    }

    const membership = await joinGroup(group.id, user.id);
    return NextResponse.json({ slug: group.slug, status: membership.status }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
