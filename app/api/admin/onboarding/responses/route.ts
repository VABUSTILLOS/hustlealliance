import { NextResponse } from "next/server";
import { requireAdmin, authErrorResponse } from "@/lib/auth/guard";
import { getOnboardingResponses } from "@/lib/db/onboarding";

// GET /api/admin/onboarding/responses
export async function GET() {
  try {
    await requireAdmin();
  } catch (e) {
    return authErrorResponse(e);
  }

  try {
    const responses = await getOnboardingResponses();
    return NextResponse.json({ responses });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
