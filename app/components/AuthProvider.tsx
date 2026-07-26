'use client';

import { useEffect, useState } from 'react';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { useStore } from '@/lib/store/useStore';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      // Supabase isn't configured yet — keep the default auth state.
      // The app will work with mock data but redirected to login for protected routes.
      setReady(true);
      return;
    }

    const supabase = createClient();

    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      useStore.setState({ isAuthenticated: !!session });
      setReady(true);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      useStore.setState({ isAuthenticated: !!session });
    });

    return () => subscription.unsubscribe();
  }, []);

  // Don't render children until we've checked the session.
  // This prevents a flash of unauthenticated content.
  if (!ready && isSupabaseConfigured()) {
    return null;
  }

  return <>{children}</>;
}
