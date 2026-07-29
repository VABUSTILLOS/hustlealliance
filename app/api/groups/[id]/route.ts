import { NextRequest, NextResponse } from "next/server";
import { getGroupBySlug, getGroupById, updateGroup, deleteGroup } from "@/lib/db/groups";
import { getCurrentUser } from "@/lib/auth/user";

// GET /api/groups/[id]
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    // Accept either slug or ID
    const group = id.includes("-") && !id.match(/^[0-9a-f-]{36}$/)
      ? await getGroupBySlug(id)
      : await getGroupById(id);
    if (!group) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(group);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

// PUT /api/groups/[id]
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await params;
    const body = await req.json();
    const group = await updateGroup(id, body);
    return NextResponse.json(group);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

// DELETE /api/groups/[id]
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await params;
    await deleteGroup(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
