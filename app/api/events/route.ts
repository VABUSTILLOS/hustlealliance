import { NextRequest, NextResponse } from "next/server";
import { listEvents, createEvent } from "@/lib/db/events";
import { getCurrentUser } from "@/lib/auth/user";
import prisma from "@/lib/db/prisma";
import type { EventType, EventStatus } from "@/lib/generated/prisma/client";

async function isActiveGroupMember(groupId: string, userId: string) {
  const membership = await prisma.communityGroupMember.findUnique({
    where: { groupId_userId: { groupId, userId } },
    select: { status: true },
  });
  return membership?.status === "ACTIVE";
}

// GET /api/events
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const groupId = searchParams.get("groupId") ?? undefined;
  const status = (searchParams.get("status") as EventStatus) ?? undefined;
  const type = (searchParams.get("type") as EventType) ?? undefined;
  const search = searchParams.get("search") ?? undefined;
  const startDateFrom = searchParams.get("startDateFrom");
  const startDateTo = searchParams.get("startDateTo");
  const cursor = searchParams.get("cursor") ?? undefined;
  const limit = parseInt(searchParams.get("limit") ?? "20");

  try {
    if (groupId) {
      const group = await prisma.communityGroup.findUnique({
        where: { id: groupId },
        select: { visibility: true },
      });
      if (!group) return NextResponse.json({ error: "Group not found" }, { status: 404 });
      if (group.visibility !== "PUBLIC") {
        const user = await getCurrentUser();
        if (!user || !(await isActiveGroupMember(groupId, user.id))) {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
      }
    }

    const result = await listEvents({
      groupId,
      status,
      type,
      search,
      startDateFrom: startDateFrom ? new Date(startDateFrom) : undefined,
      startDateTo: startDateTo ? new Date(startDateTo) : undefined,
      cursor,
      limit,
    });
    return NextResponse.json(result);
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
    if (body.groupId && !(await isActiveGroupMember(body.groupId, user.id))) {
      return NextResponse.json(
        { error: "Only group members can create group events" },
        { status: 403 },
      );
    }
    const event = await createEvent({
      ...body,
      startDate: new Date(body.startDate),
      endDate: body.endDate ? new Date(body.endDate) : undefined,
      creatorId: user.id,
    });
    return NextResponse.json(event, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
