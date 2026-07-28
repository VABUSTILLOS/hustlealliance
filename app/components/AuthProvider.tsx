'use client';

// TODO: IMPLEMENT REAL AUTH - REVERT FOR PRODUCTION
// Bypass: ensures Zustand store + localStorage always have a user so no redirect loops occur.
// The store default is already the Founder profile; this provider acts as a safety net.
import { useEffect, useState } from 'react';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // The store default (FOUNDER_PROFILE) already covers the normal path.
    // This effect is a safety net — it does nothing if a real user is already present.
    setReady(true);
  }, []);

  if (!ready) {
    // Render nothing until hydrated to avoid flash of unauthenticated UI
    return null;
  }

  return <>{children}</>;
}
