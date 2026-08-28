import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, authErrorResponse } from "@/lib/auth/guard";
import { duplicateChallenge } from "@/lib/db/challenges";

export async function POST(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  let admin;
  try {
    admin = await requireAdmin();
  } catch (err) {
    return authErrorResponse(err);
  }

  try {
    const { id } = await params;
    const copy = await duplicateChallenge(id, admin.id);
    return NextResponse.json({ challenge: copy }, { status: 201 });
  } catch (err) {
    const message = (err as Error).message;
    const status = message === "Challenge not found" ? 404 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
