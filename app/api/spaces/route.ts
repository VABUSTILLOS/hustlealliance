import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/user";
import { listSpaces } from "@/lib/db/spaces";

// GET /api/spaces — list all curated spaces with real member counts.
export async function GET(_req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const spaces = await listSpaces({ userId: user?.id });
    return NextResponse.json({ spaces });
  } catch (err) {
    console.error("[GET /api/spaces]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
