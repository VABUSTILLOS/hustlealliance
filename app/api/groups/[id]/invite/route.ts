import { NextRequest, NextResponse } from "next/server";
import { inviteToGroup, getMemberRole } from "@/lib/db/groups";
import { getCurrentUser } from "@/lib/auth/user";

// POST /api/groups/[id]/invite
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
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { userId } = await req.json();
    if (!userId) return NextResponse.json({ error: "userId is required" }, { status: 400 });

    const invite = await inviteToGroup(id, userId);
    return NextResponse.json(invite, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
