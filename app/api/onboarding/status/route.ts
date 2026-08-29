import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/user";
import { isOnboardingComplete, ensureDbUser } from "@/lib/db/onboarding";

// GET /api/onboarding/status
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const dbUser = await ensureDbUser(user);
    const completed = await isOnboardingComplete(dbUser.id);
    return NextResponse.json({ completed });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
