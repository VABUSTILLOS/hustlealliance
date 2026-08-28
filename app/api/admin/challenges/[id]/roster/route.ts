import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, authErrorResponse } from "@/lib/auth/guard";
import { getChallengeRoster } from "@/lib/db/challenges";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
  } catch (err) {
    return authErrorResponse(err);
  }

  try {
    const { id } = await params;
    const roster = await getChallengeRoster(id);
    return NextResponse.json(roster);
  } catch (err) {
    console.error("[GET /api/admin/challenges/:id/roster]", err);
    return NextResponse.json({ error: "Failed to fetch roster" }, { status: 500 });
  }
}
