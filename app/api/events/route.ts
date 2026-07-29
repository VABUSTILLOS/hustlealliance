import { NextRequest, NextResponse } from "next/server";
import { listEvents, createEvent, getUpcomingEvents } from "@/lib/db/events";
import { getCurrentUser } from "@/lib/auth/user";

// GET /api/events
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const groupId = searchParams.get("groupId") ?? undefined;
  const type = searchParams.get("type") ?? undefined;
  const limit = parseInt(searchParams.get("limit") ?? "20");

  try {
    if (type === "upcoming") {
      const events = await getUpcomingEvents(limit);
      return NextResponse.json(events);
    }
    const events = await listEvents({ groupId, limit });
    return NextResponse.json(events);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

// POST /api/events
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const event = await createEvent({ ...body, creatorId: user.id });
    return NextResponse.json(event, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
