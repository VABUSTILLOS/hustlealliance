import { NextRequest, NextResponse } from "next/server";
import { reportPost } from "@/lib/db/posts";
import { getCurrentUser } from "@/lib/auth/user";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const body = await req.json();
    if (!body.reason || typeof body.reason !== "string") {
      return NextResponse.json({ error: "Reason is required" }, { status: 400 });
    }
    const report = await reportPost(id, user.id, body.reason);
    return NextResponse.json(report, { status: 201 });
  } catch (err) {
    const msg = (err as Error).message;
    if (msg.includes("not found")) return NextResponse.json({ error: msg }, { status: 404 });
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
