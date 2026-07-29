import { NextRequest, NextResponse } from "next/server";
import { joinGroup, getGroupById } from "@/lib/db/groups";
import { getCurrentUser } from "@/lib/auth/user";

// POST /api/groups/[id]/join
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    // Prevent joining hidden groups directly
    const group = await getGroupById(id);
    if (!group) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (group.visibility === "HIDDEN") {
      return NextResponse.json({ error: "Cannot join hidden groups directly" }, { status: 403 });
    }

    const membership = await joinGroup(id, user.id);
    return NextResponse.json(membership, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
