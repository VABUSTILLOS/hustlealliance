import { NextRequest, NextResponse } from "next/server";
import { getUserGroups } from "@/lib/db/groups";

// GET /api/users/[id]/groups
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const groups = await getUserGroups(id);
    return NextResponse.json(groups);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
