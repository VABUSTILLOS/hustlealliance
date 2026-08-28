import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, authErrorResponse } from "@/lib/auth/guard";
import { adminListQuestions, createQuestion } from "@/lib/db/onboarding";
import type { OnboardingQuestionType } from "@/lib/generated/prisma/client";

// GET /api/admin/onboarding/questions
export async function GET() {
  try {
    await requireAdmin();
  } catch (e) {
    return authErrorResponse(e);
  }

  try {
    const questions = await adminListQuestions();
    return NextResponse.json({ questions });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

// POST /api/admin/onboarding/questions
export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
  } catch (e) {
    return authErrorResponse(e);
  }

  try {
    const body = await req.json();
    const question = await createQuestion({
      question: body.question,
      type: body.type as OnboardingQuestionType | undefined,
      options: body.options,
      sortOrder: body.sortOrder,
      isActive: body.isActive,
    });
    return NextResponse.json(question, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
