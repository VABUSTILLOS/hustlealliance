import { NextRequest, NextResponse } from "next/server";
import { getUserEvents } from "@/lib/db/events";
import type { RSVPStatus } from "@/lib/generated/prisma/client";

// GET /api/users/[id]/events
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const status = (searchParams.get("status") as RSVPStatus) ?? undefined;
    const limit = parseInt(searchParams.get("limit") ?? "20");
    const events = await getUserEvents(id, status, limit);
    return NextResponse.json(events);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
