import { NextRequest, NextResponse } from "next/server";
import { rsvp, getEventAttendees } from "@/lib/db/events";
import { getCurrentUser } from "@/lib/auth/user";
import type { RSVPStatus } from "@/lib/generated/prisma/client";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const status = (searchParams.get("status") as RSVPStatus) ?? undefined;
    const cursor = searchParams.get("cursor") ?? undefined;
    const limit = parseInt(searchParams.get("limit") ?? "50");
    const attendees = await getEventAttendees(id, status, limit, cursor);
    return NextResponse.json(attendees);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await params;
    const { status } = await req.json();
    const validStatuses: RSVPStatus[] = ["GOING", "INTERESTED", "NOT_GOING"];
    const rsvpStatus = validStatuses.includes(status) ? status : "GOING";
    const r = await rsvp(id, user.id, rsvpStatus);
    return NextResponse.json(r, { status: 201 });
  } catch (err) {
    const msg = (err as Error).message;
    if (msg === "Event is at capacity") return NextResponse.json({ error: msg }, { status: 409 });
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
