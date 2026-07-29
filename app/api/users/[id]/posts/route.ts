import { NextRequest, NextResponse } from "next/server";
import { getUserPosts } from "@/lib/db/social";

// GET /api/users/[id]/posts — paginated user posts
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") ?? "20");
    const cursor = searchParams.get("cursor") ?? undefined;

    const posts = await getUserPosts(id, limit, cursor);
    return NextResponse.json(posts);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
