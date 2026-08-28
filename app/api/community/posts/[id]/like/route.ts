import { NextRequest, NextResponse } from "next/server";
import { reactToPost, unreactToPost } from "@/lib/db/reactions";
import { getCurrentUser } from "@/lib/auth/user";
import { fanoutToFollowers } from "@/lib/db/feed";
import type { ReactionType } from "@/lib/generated/prisma/client";

const VALID_TYPES: ReactionType[] = ["LIKE", "LOVE", "FIRE", "CLAP"];

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let type: ReactionType = "LIKE";
  try {
    const body = await req.json();
    if (body?.type && VALID_TYPES.includes(body.type)) type = body.type;
  } catch {
    // No body — plain like
  }

  try {
    const { id } = await params;
    const reaction = await reactToPost(id, user.id, type);

    // Fanout POST_LIKED to followers
    fanoutToFollowers({
      actorId: user.id,
      type: "POST_LIKED",
      entityType: "Post",
      entityId: id,
    }).catch(() => {});

    return NextResponse.json({ liked: true, type: reaction.type });
  } catch {
    return NextResponse.json({ error: "Failed to react" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    await unreactToPost(id, user.id);
    return NextResponse.json({ liked: false });
  } catch {
    return NextResponse.json({ error: "Not liked" }, { status: 404 });
  }
}
