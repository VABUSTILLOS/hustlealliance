import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/user";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: commentId } = await params;

  try {
    await prisma.commentLike.create({
      data: { commentId, userId: user.id },
    });
    return NextResponse.json({ liked: true });
  } catch {
    return NextResponse.json({ error: "Already liked" }, { status: 409 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: commentId } = await params;

  try {
    await prisma.commentLike.delete({
      where: { commentId_userId: { commentId, userId: user.id } },
    });
    return NextResponse.json({ liked: false });
  } catch {
    return NextResponse.json({ error: "Not liked" }, { status: 404 });
  }
}
