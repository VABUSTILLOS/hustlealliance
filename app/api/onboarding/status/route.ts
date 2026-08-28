import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/user";
import { isOnboardingComplete } from "@/lib/db/onboarding";

// GET /api/onboarding/status
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const completed = await isOnboardingComplete(user.id);
    return NextResponse.json({ completed });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
