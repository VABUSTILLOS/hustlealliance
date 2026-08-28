import { NextRequest, NextResponse } from "next/server";
import { getTrendingHashtags } from "@/lib/hashtags/parser";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "5"), 20);

  try {
    const trending = await getTrendingHashtags(limit);
    return NextResponse.json(trending);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
