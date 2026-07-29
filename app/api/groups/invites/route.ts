import { NextResponse } from "next/server";
import { getGroupInvites } from "@/lib/db/groups";
import { getCurrentUser } from "@/lib/auth/user";

// GET /api/groups/invites
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const invites = await getGroupInvites(user.id);
    return NextResponse.json(invites);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
