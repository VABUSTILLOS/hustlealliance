import { NextRequest, NextResponse } from "next/server";
import { getUpcomingEvents } from "@/lib/db/events";

// GET /api/events/upcoming
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") ?? "10");
    const events = await getUpcomingEvents(limit);
    return NextResponse.json(events);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
