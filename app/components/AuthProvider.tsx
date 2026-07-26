'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store/useStore';

const AUTH_STORAGE_KEY = 'sb-yftgdtdvmvvqyzcdntge-auth-token';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Check for existing session in localStorage
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const session = JSON.parse(stored);
        const isValid = session.access_token && session.expires_at > Date.now();
        useStore.setState({ isAuthenticated: isValid });
      }
    } catch {
      // Invalid session data — ignore
    }
    setReady(true);
  }, []);

  if (!ready) return null;

  return <>{children}</>;
}
