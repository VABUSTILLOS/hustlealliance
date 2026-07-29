import { NextRequest, NextResponse } from "next/server";
import { listGroups, createGroup } from "@/lib/db/groups";
import { getCurrentUser } from "@/lib/auth/user";

// GET /api/groups
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");
  const limit = parseInt(searchParams.get("limit") ?? "20");

  try {
    if (query) {
      const { searchGroups } = await import("@/lib/db/groups");
      const groups = await searchGroups(query, limit);
      return NextResponse.json(groups);
    }
    const groups = await listGroups({ limit });
    return NextResponse.json(groups);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

// POST /api/groups
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const group = await createGroup({ ...body, creatorId: user.id });
    return NextResponse.json(group, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
