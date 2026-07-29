import { NextRequest, NextResponse } from "next/server";
import { acceptGroupInvite, rejectGroupInvite } from "@/lib/db/groups";
import { getCurrentUser } from "@/lib/auth/user";

// PUT /api/groups/invites/[id] — accept or reject invite
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const { action } = await req.json();

    if (action === "accept") {
      const result = await acceptGroupInvite(id, user.id);
      return NextResponse.json(result);
    }

    if (action === "reject") {
      await rejectGroupInvite(id);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action. Use 'accept' or 'reject'." }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
