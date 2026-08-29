"use client";

import { useEffect } from "react";

// Records referral attribution on a member's first app visit after arriving
// via an /r/[code] link. The capture endpoint reads + clears the referral
// cookie server-side and no-ops when there's nothing to attribute.
export default function ReferralCapture() {
  useEffect(() => {
    fetch("/api/referrals/capture", { method: "POST" }).catch(() => {});
  }, []);

  return null;
}
