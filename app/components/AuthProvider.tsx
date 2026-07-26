'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useStore } from '@/lib/store/useStore';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClient();

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      useStore.setState({ isAuthenticated: !!session });
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      useStore.setState({ isAuthenticated: !!session });
    });

    return () => subscription.unsubscribe();
  }, []);

  return <>{children}</>;
}
