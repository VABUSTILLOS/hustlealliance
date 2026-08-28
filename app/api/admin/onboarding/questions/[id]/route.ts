import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, authErrorResponse } from "@/lib/auth/guard";
import { updateQuestion, deleteQuestion } from "@/lib/db/onboarding";
import type { OnboardingQuestionType } from "@/lib/generated/prisma/client";

// PATCH /api/admin/onboarding/questions/[id]
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
  } catch (e) {
    return authErrorResponse(e);
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const question = await updateQuestion(id, {
      question: body.question,
      type: body.type as OnboardingQuestionType | undefined,
      options: body.options,
      sortOrder: body.sortOrder,
      isActive: body.isActive,
    });
    return NextResponse.json(question);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

// DELETE /api/admin/onboarding/questions/[id]
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
  } catch (e) {
    return authErrorResponse(e);
  }

  try {
    const { id } = await params;
    await deleteQuestion(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
