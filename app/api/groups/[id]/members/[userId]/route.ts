import { NextRequest, NextResponse } from "next/server";
import { updateMemberRole, removeMember, getMemberRole } from "@/lib/db/groups";
import { getCurrentUser } from "@/lib/auth/user";
import type { CommunityGroupRole } from "@/lib/generated/prisma/client";

// PUT /api/groups/[id]/members/[userId] — change role
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; userId: string }> },
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id, userId: targetUserId } = await params;

    // Only admin/owner can change roles
    const requesterRole = await getMemberRole(id, user.id);
    if (requesterRole !== "OWNER" && requesterRole !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { role } = await req.json();
    if (!role) return NextResponse.json({ error: "role is required" }, { status: 400 });

    const validRoles: CommunityGroupRole[] = ["OWNER", "ADMIN", "MODERATOR", "MEMBER"];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const updated = await updateMemberRole(id, targetUserId, role as CommunityGroupRole);
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

// DELETE /api/groups/[id]/members/[userId] — remove member
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; userId: string }> },
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id, userId: targetUserId } = await params;

    // Only admin/owner can remove members
    const requesterRole = await getMemberRole(id, user.id);
    if (requesterRole !== "OWNER" && requesterRole !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Cannot kick owner
    const targetRole = await getMemberRole(id, targetUserId);
    if (targetRole === "OWNER") {
      return NextResponse.json({ error: "Cannot remove the group owner" }, { status: 403 });
    }

    await removeMember(id, targetUserId);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
