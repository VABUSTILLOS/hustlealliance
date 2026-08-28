import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/user";
import { getChecklistState } from "@/lib/db/onboarding";

// GET /api/onboarding/checklist
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const state = await getChecklistState(user.id);
    return NextResponse.json(state);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
