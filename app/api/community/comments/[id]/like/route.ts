import { NextRequest, NextResponse } from "next/server";
import { reactToComment, unreactToComment } from "@/lib/db/reactions";
import { getCurrentUser } from "@/lib/auth/user";
import type { ReactionType } from "@/lib/generated/prisma/client";

const VALID_TYPES: ReactionType[] = ["LIKE", "LOVE", "FIRE", "CLAP"];

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: commentId } = await params;

  let type: ReactionType = "LIKE";
  try {
    const body = await req.json();
    if (body?.type && VALID_TYPES.includes(body.type)) type = body.type;
  } catch {
    // No body — plain like
  }

  try {
    const reaction = await reactToComment(commentId, user.id, type);
    return NextResponse.json({ liked: true, type: reaction.type });
  } catch {
    return NextResponse.json({ error: "Failed to react" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: commentId } = await params;

  try {
    await unreactToComment(commentId, user.id);
    return NextResponse.json({ liked: false });
  } catch {
    return NextResponse.json({ error: "Not liked" }, { status: 404 });
  }
}
