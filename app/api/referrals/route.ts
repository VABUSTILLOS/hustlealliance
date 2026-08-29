import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/user";
import { getReferralDashboard } from "@/lib/db/referrals";

// GET /api/referrals — member's referral dashboard data
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const dashboard = await getReferralDashboard(user.id);
    return NextResponse.json(dashboard);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
