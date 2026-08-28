import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { enrollInChallenge } from "@/lib/db/challenges";
import { getCurrentUser } from "@/lib/auth/user";

// POST /api/challenges/[slug]/enroll
export async function POST(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { slug } = await params;
    const challenge = await prisma.challenge.findUnique({
      where: { slug },
      include: { product: { select: { slug: true } } },
    });
    if (!challenge) return NextResponse.json({ error: "Challenge not found" }, { status: 404 });

    if (challenge.price > 0) {
      return NextResponse.json(
        { error: "payment_required", productSlug: challenge.product?.slug ?? null },
        { status: 402 },
      );
    }

    const enrollment = await enrollInChallenge(challenge.id, user.id);
    return NextResponse.json(enrollment, { status: 201 });
  } catch (err) {
    const message = (err as Error).message;
    const status = message.includes("full") ? 409 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
