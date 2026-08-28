import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/user";
import { completeOnboarding } from "@/lib/db/onboarding";

// POST /api/onboarding/complete
export async function POST() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await completeOnboarding(user.id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
