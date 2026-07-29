import { NextRequest, NextResponse } from "next/server";
import { createReview, getProductReviews } from "@/lib/db/store";
import { getCurrentUser } from "@/lib/auth/user";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const reviews = await getProductReviews(id);
    return NextResponse.json(reviews);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await params;
    const { rating, body } = await req.json();
    const review = await createReview({ productId: id, userId: user.id, rating, body });
    return NextResponse.json(review, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
