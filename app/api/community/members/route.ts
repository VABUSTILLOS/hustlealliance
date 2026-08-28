import { NextRequest, NextResponse } from "next/server";
import { getCommunityMembers } from "@/lib/db/community";
import type { GetCommunityMembersOpts } from "@/lib/db/community";

const VALID_SORTS = ["activity", "newest", "name"] as const;
const VALID_ROLES = ["STUDENT", "INSTRUCTOR", "ADMIN"] as const;
const VALID_TIERS = ["FREE", "BASIC", "PRO"] as const;

// GET /api/community/members?sort=&role=&tier=&search=&cursor=&limit=
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const rawSort = searchParams.get("sort") ?? "activity";
  const sort = (VALID_SORTS as readonly string[]).includes(rawSort)
    ? (rawSort as GetCommunityMembersOpts["sort"])
    : "activity";

  const rawRole = searchParams.get("role");
  const role = rawRole && (VALID_ROLES as readonly string[]).includes(rawRole)
    ? (rawRole as GetCommunityMembersOpts["role"])
    : undefined;

  const rawTier = searchParams.get("tier");
  const tier = rawTier && (VALID_TIERS as readonly string[]).includes(rawTier)
    ? (rawTier as GetCommunityMembersOpts["tier"])
    : undefined;

  const search = searchParams.get("search") || undefined;
  const cursor = searchParams.get("cursor") ?? undefined;
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "36") || 36, 100);
  const online = searchParams.get("online") === "1";

  try {
    const result = await getCommunityMembers({ sort, role, tier, search, cursor, limit, online });
    return NextResponse.json(result);
  } catch (err) {
    console.error("[api/community/members] Error:", (err as Error).message);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
