import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, authErrorResponse } from "@/lib/auth/guard";
import { getAdminChallengeById, updateChallenge, deleteChallenge } from "@/lib/db/challenges";
import { Prisma } from "@/lib/generated/prisma/client";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
  } catch (err) {
    return authErrorResponse(err);
  }

  try {
    const { id } = await params;
    const challenge = await getAdminChallengeById(id);
    if (!challenge) return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
    return NextResponse.json({ challenge });
  } catch (err) {
    console.error("[GET /api/admin/challenges/:id]", err);
    return NextResponse.json({ error: "Failed to fetch challenge" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
  } catch (err) {
    return authErrorResponse(err);
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const challenge = await updateChallenge(id, body);
    return NextResponse.json({ challenge });
  } catch (err) {
    console.error("[PATCH /api/admin/challenges/:id]", err);
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return NextResponse.json({ error: "A challenge with this slug already exists" }, { status: 409 });
    }
    const message = (err as Error).message;
    if (message.includes("not found")) return NextResponse.json({ error: message }, { status: 404 });
    return NextResponse.json({ error: "Failed to update challenge" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
  } catch (err) {
    return authErrorResponse(err);
  }

  try {
    const { id } = await params;
    await deleteChallenge(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/admin/challenges/:id]", err);
    return NextResponse.json({ error: "Failed to delete challenge" }, { status: 500 });
  }
}
