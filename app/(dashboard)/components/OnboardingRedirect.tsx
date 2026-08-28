"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

// Sends brand-new members to the onboarding wizard on their first visit.
// Loop-safe: skips /onboarding itself, and tolerates 401 (e.g. localStorage/mock users).
export default function OnboardingRedirect() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/onboarding") return;

    let cancelled = false;
    fetch("/api/onboarding/status")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled || !data) return;
        if (data.completed === false) router.replace("/onboarding");
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [pathname, router]);

  return null;
}
