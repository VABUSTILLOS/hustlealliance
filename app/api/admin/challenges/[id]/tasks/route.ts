import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, authErrorResponse } from "@/lib/auth/guard";
import { upsertChallengeTasks } from "@/lib/db/challenges";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
  } catch (err) {
    return authErrorResponse(err);
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const tasks = Array.isArray(body.tasks) ? body.tasks : [];
    const result = await upsertChallengeTasks(id, tasks);
    return NextResponse.json({ tasks: result });
  } catch (err) {
    console.error("[PUT /api/admin/challenges/:id/tasks]", err);
    return NextResponse.json({ error: "Failed to save tasks" }, { status: 500 });
  }
}
