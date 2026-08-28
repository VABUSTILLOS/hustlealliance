import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/user";
import { getActiveQuestions, getAnswersForUser } from "@/lib/db/onboarding";

// GET /api/onboarding/questions
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const [questions, answers] = await Promise.all([
      getActiveQuestions(),
      getAnswersForUser(user.id),
    ]);
    return NextResponse.json({ questions, answers });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
