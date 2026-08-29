import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/user";
import { getWeeklySpotlight } from "@/lib/db/spotlight";

// GET /api/community/spotlight — weekly most-active member
export async function GET() {
  try {
    const user = await getCurrentUser();
    const spotlight = await getWeeklySpotlight(user?.id);
    return NextResponse.json({ spotlight });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
