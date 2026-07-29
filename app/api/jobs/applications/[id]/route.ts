import { NextRequest, NextResponse } from "next/server";
import { updateApplicationStatus } from "@/lib/db/jobs";
import { getCurrentUser } from "@/lib/auth/user";
import type { ApplicationStatus } from "@/lib/generated/prisma/client";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const { status, notes } = await req.json();

    if (!status || !["SUBMITTED", "REVIEWING", "INTERVIEW", "OFFERED", "REJECTED", "WITHDRAWN"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const application = await updateApplicationStatus(id, user.id, status as ApplicationStatus, notes);
    return NextResponse.json(application);
  } catch (err) {
    const message = (err as Error).message;
    if (message.includes("Not authorized")) return NextResponse.json({ error: message }, { status: 403 });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
