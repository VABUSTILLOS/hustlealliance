import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import prisma from "@/lib/db/prisma";
import { getMemberRole } from "@/lib/db/groups";
import { getCurrentUser } from "@/lib/auth/user";

// GET /api/groups/[id]/invite-link — members can read the current invite link
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const role = await getMemberRole(id, user.id);
    if (!role) return NextResponse.json({ error: "Members only" }, { status: 403 });

    const group = await prisma.communityGroup.findUnique({
      where: { id },
      select: { inviteToken: true },
    });
    if (!group) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const url = `${req.nextUrl.origin}/groups/join/${group.inviteToken}`;
    return NextResponse.json({ url });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

// POST /api/groups/[id]/invite-link — OWNER/ADMIN regenerates the invite token
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const role = await getMemberRole(id, user.id);
    if (role !== "OWNER" && role !== "ADMIN") {
      return NextResponse.json({ error: "Admins only" }, { status: 403 });
    }

    const group = await prisma.communityGroup.update({
      where: { id },
      data: { inviteToken: randomBytes(16).toString("hex") },
      select: { inviteToken: true },
    });
    const url = `${req.nextUrl.origin}/groups/join/${group.inviteToken}`;
    return NextResponse.json({ url });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
