import { NextRequest, NextResponse } from "next/server";
import { leaveGroup } from "@/lib/db/groups";
import { getCurrentUser } from "@/lib/auth/user";

// POST /api/groups/[id]/leave
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    await leaveGroup(id, user.id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
