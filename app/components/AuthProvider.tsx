'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store/useStore';
import { saveUserInfo, getAvatarUrl } from '@/lib/hooks/useCurrentUser';

const AUTH_STORAGE_KEY = 'sb-yftgdtdvmvvqyzcdntge-auth-token';
const SUPABASE_URL = 'https://yftgdtdvmvvqyzcdntge.supabase.co';
const SUPABASE_KEY = 'sb_publishable_sY8NIgcLzNcLUGx2Swl9BA_yqf9NIc8';

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

async function fetchUser(accessToken: string): Promise<{ email: string; name?: string } | null> {
  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return {
      email: data.email || '',
      name: data.user_metadata?.full_name || data.email?.split('@')[0] || '',
    };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function initAuth() {
      // 1. Check for token from callback redirect (email confirmation, OAuth)
      const tokenData = getTokenFromUrl();
      if (tokenData?.access_token) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token,
          expires_at: parseInt(tokenData.expires_at || '0', 10),
        }));
        useStore.setState({ isAuthenticated: true });
        cleanUrl();

        // Fetch user info
        const profile = await fetchUser(tokenData.access_token);
        if (profile) {
          saveUserInfo({
            email: profile.email,
            name: profile.name || profile.email.split('@')[0],
            avatar: getAvatarUrl(profile.name, profile.email),
          });
        }
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

            // If no user info stored yet, fetch it
            const userRaw = localStorage.getItem('hustle_user_info');
            if (!userRaw) {
              const profile = await fetchUser(session.access_token);
              if (profile) {
                saveUserInfo({
                  email: profile.email,
                  name: profile.name || profile.email.split('@')[0],
                  avatar: getAvatarUrl(profile.name, profile.email),
                });
              }
            } else {
              try {
                const existing = JSON.parse(userRaw);
                if (existing.email) {
                  useStore.getState().setCurrentUser(existing);
                }
              } catch { /* ignore */ }
            }
          } else {
            localStorage.removeItem(AUTH_STORAGE_KEY);
          }
        }
      } catch {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }

      setReady(true);
    }

    initAuth();
  }, []);

  if (!ready) return null;

  return <>{children}</>;
}
