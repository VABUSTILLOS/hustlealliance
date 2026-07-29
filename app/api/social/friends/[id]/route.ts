import { NextRequest, NextResponse } from "next/server";
import { respondToFriendRequest } from "@/lib/db/social";
import { getCurrentUser } from "@/lib/auth/user";

// PUT /api/social/friends/[id] — accept or reject { accept: boolean }
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const { accept } = await req.json();
    const friendship = await respondToFriendRequest(id, accept);
    return NextResponse.json(friendship);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
