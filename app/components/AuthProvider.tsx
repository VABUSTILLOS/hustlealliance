'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store/useStore';

const AUTH_STORAGE_KEY = 'sb-yftgdtdvmvvqyzcdntge-auth-token';

function getTokenFromUrl(): { access_token?: string; refresh_token?: string; expires_at?: string } | null {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  const token = params.get('access_token');
  const refresh = params.get('refresh_token');
  const expires = params.get('expires_at');
  if (token && refresh && expires) return { access_token: token, refresh_token: refresh, expires_at: expires };
  return null;
}

function cleanUrl() {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  url.searchParams.delete('access_token');
  url.searchParams.delete('refresh_token');
  url.searchParams.delete('expires_at');
  window.history.replaceState({}, '', url.pathname + url.search + url.hash);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // 1. Check for token from callback redirect (email confirmation, OAuth)
    const tokenData = getTokenFromUrl();
    if (tokenData) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        expires_at: parseInt(tokenData.expires_at || '0', 10),
      }));
      useStore.setState({ isAuthenticated: true });
      cleanUrl();
      setReady(true);
      return;
    }

    // 2. Check for existing session in localStorage
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const session = JSON.parse(stored);
        if (session.access_token && session.expires_at > Date.now()) {
          useStore.setState({ isAuthenticated: true });
        } else {
          localStorage.removeItem(AUTH_STORAGE_KEY);
        }
      }
    } catch {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }

    setReady(true);
  }, []);

  if (!ready) return null;

  return <>{children}</>;
}
