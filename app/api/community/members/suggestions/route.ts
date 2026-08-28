import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/user";
import { getMemberSuggestions } from "@/lib/db/suggestions";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "6"), 20);

  try {
    const suggestions = await getMemberSuggestions(user.id, limit);
    return NextResponse.json({ items: suggestions });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
