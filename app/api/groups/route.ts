import { NextRequest, NextResponse } from "next/server";
import { listGroups, createGroup, searchGroups, getUserGroups } from "@/lib/db/groups";
import { getCurrentUser } from "@/lib/auth/user";
import type { GroupVisibility } from "@/lib/generated/prisma/client";

// GET /api/groups
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");
  const visibility = searchParams.get("visibility");
  const my = searchParams.get("my");
  const limit = parseInt(searchParams.get("limit") ?? "20");
  const cursor = searchParams.get("cursor") ?? undefined;

  try {
    const user = await getCurrentUser();

    if (my === "true" && user) {
      const memberships = await getUserGroups(user.id);
      return NextResponse.json(memberships);
    }

    if (query) {
      const groups = await searchGroups(query, limit);
      return NextResponse.json(groups);
    }

    const groups = await listGroups({
      visibility: visibility as GroupVisibility | undefined,
      limit,
      cursor,
    });
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
