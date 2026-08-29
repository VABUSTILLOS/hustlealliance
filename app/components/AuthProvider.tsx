'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useStore } from '@/lib/store/useStore';
import { getInitialsAvatarUrl } from '@/lib/utils/avatar';
import type { UserInfo } from '@/lib/store/useStore';

/**
 * Bridges Supabase auth state into the Zustand store.
 *
 * On any auth state change (sign-in, sign-out, token refresh) it refreshes the
 * store's currentUser from `/api/me` so role + membershipTier stay authoritative.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    const supabase = createClient();
    const { setCurrentUser, setAuthState } = useStore.getState();

    const syncFromApi = async () => {
      try {
        const res = await fetch('/api/me', { cache: 'no-store' });
        if (res.ok) {
          const { user } = (await res.json()) as { user: UserInfo | null };
          if (active) setCurrentUser(user);
          if (active) setAuthState(!!user);
        } else {
          // 401 — not signed in. Keep the store fallback so the demo shell
          // still renders for visitors; real route protection happens server-side.
          if (active) setCurrentUser(null);
          if (active) setAuthState(false);
        }
      } catch {
        // Network error — leave current store user untouched.
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!active) return;
      if (session?.user) {
        const meta = session.user.user_metadata ?? {};
        const fallback: UserInfo = {
          id: session.user.id,
          email: session.user.email ?? undefined,
          name:
            meta.full_name || meta.name || session.user.email?.split('@')[0] || 'Member',
          avatar: meta.avatar_url || getInitialsAvatarUrl(session.user.email || 'Member'),
          role: 'STUDENT',
          membershipTier: 'FREE',
        };
        setCurrentUser(fallback);
        setAuthState(true);
        // Fetch authoritative role/tier from the DB.
        void syncFromApi();
      } else {
        void syncFromApi();
      }
      if (active) setReady(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      if (session?.user) {
        const meta = session.user.user_metadata ?? {};
        const fallback: UserInfo = {
          id: session.user.id,
          email: session.user.email ?? undefined,
          name:
            meta.full_name || meta.name || session.user.email?.split('@')[0] || 'Member',
          avatar: meta.avatar_url || getInitialsAvatarUrl(session.user.email || 'Member'),
          role: 'STUDENT',
          membershipTier: 'FREE',
        };
        setCurrentUser(fallback);
        setAuthState(true);
        void syncFromApi();
      } else {
        setCurrentUser(null);
        setAuthState(false);
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  if (!ready) {
    // Render nothing until we've resolved the initial auth state to avoid a
    // flash of unauthenticated UI.
    return null;
  }

  return <>{children}</>;
}
