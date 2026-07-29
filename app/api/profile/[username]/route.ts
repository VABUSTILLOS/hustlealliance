import { NextRequest, NextResponse } from "next/server";
import { getUserProfileData } from "@/lib/db/social";

// GET /api/profile/[username] — full profile data
export async function GET(_req: NextRequest, { params }: { params: Promise<{ username: string }> }) {
  try {
    const { username } = await params;
    const profile = await getUserProfileData(username);
    if (!profile) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json(profile);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
