import { NextRequest, NextResponse } from "next/server";
import {
  getGroupBySlug,
  getGroupById,
  updateGroup,
  deleteGroup,
  getMemberRole,
} from "@/lib/db/groups";
import { getCurrentUser } from "@/lib/auth/user";

// GET /api/groups/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();

    // Accept either slug or ID
    const group = id.includes("-") && !id.match(/^[0-9a-f-]{36}$/)
      ? await getGroupBySlug(id)
      : await getGroupById(id);

    if (!group) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Attach current user's membership status
    let currentUserRole = null;
    let currentUserMember = false;
    if (user) {
      const role = await getMemberRole(group.id, user.id);
      currentUserRole = role;
      currentUserMember = role !== null;
    }

    return NextResponse.json({ ...group, currentUserRole, currentUserMember });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

// PUT /api/groups/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const role = await getMemberRole(id, user.id);
    if (role !== "OWNER" && role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const group = await updateGroup(id, body);
    return NextResponse.json(group);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

// DELETE /api/groups/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const role = await getMemberRole(id, user.id);
    if (role !== "OWNER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await deleteGroup(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
