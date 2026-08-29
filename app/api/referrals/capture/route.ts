import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/user";
import { recordReferralSignup } from "@/lib/referrals/attribute";

// POST /api/referrals/capture
// Records a referral signup from the `referral_code` cookie set by /r/[code].
// Called once by the ReferralCapture component on a member's first app visit.
// Idempotent and tolerant: recordReferralSignup no-ops on self-referral,
// unknown code, or an already-attributed referee; the cookie is always cleared.
export async function POST(request: NextRequest) {
  const response = NextResponse.json({ ok: true });

  const code = request.cookies.get("referral_code")?.value;
  if (!code) return response;

  // Clear the cookie so we don't retry on every visit.
  response.cookies.set("referral_code", "", { path: "/", maxAge: 0 });

  const user = await getCurrentUser();
  if (!user) return response;

  try {
    await recordReferralSignup(code, user.id);
  } catch {
    // Never block the member experience on attribution failures.
  }
  return response;
}
