import { NextResponse } from "next/server";
import { getUnreadCount } from "@/lib/db/messages";
import { getCurrentUser } from "@/lib/auth/user";

// GET /api/messages/unread-count
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const count = await getUnreadCount(user.id);
    return NextResponse.json({ count });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
