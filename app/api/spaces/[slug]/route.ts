import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/user";
import { getSpaceBySlug } from "@/lib/db/spaces";

// GET /api/spaces/[slug] — single space with membership status.
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const user = await getCurrentUser();
    const space = await getSpaceBySlug(slug, user?.id);
    if (!space) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ space });
  } catch (err) {
    console.error("[GET /api/spaces/[slug]]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
