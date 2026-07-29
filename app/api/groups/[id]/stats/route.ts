import { NextRequest, NextResponse } from "next/server";
import { getGroupStats } from "@/lib/db/groups";

// GET /api/groups/[id]/stats
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const stats = await getGroupStats(id);
    return NextResponse.json(stats);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
