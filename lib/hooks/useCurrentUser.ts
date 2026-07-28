'use client';

import { useStore, type UserInfo } from '@/lib/store/useStore';
import { FOUNDER_PROFILE } from '@/lib/auth/mock';

const USER_INFO_KEY = 'hustle_user_info';

/**
 * Reads the current user from Zustand (persisted) or localStorage fallback.
 * Always returns a user — falls back to the generic Founder profile so
 * unauthenticated visitors see the full dashboard without redirect loops.
 */
export function useCurrentUser(): UserInfo {
  const storeUser = useStore((s) => s.currentUser);
  if (storeUser && storeUser.email && storeUser.id !== FOUNDER_PROFILE.id) return storeUser;

  // Fallback: try localStorage directly (for SSR hydration edge cases)
  if (typeof window === 'undefined') return FOUNDER_PROFILE;
  try {
    const raw = localStorage.getItem(USER_INFO_KEY);
    if (raw) {
      const user: UserInfo = JSON.parse(raw);
      if (user.email && user.id !== FOUNDER_PROFILE.id) {
        // Sync back to store
        useStore.getState().setCurrentUser(user);
        return user;
      }
    }
  } catch { /* ignore */ }

  // Ensure store is synced to founder profile
  if (!storeUser || !storeUser.email) {
    useStore.getState().setCurrentUser(FOUNDER_PROFILE);
  }
  return FOUNDER_PROFILE;
}

/**
 * Derives a DiceBear avatar URL from a name or email.
 */
export function getAvatarUrl(name?: string, email?: string): string {
  const seed = name || email || 'User';
  return `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(seed)}&backgroundColor=ea580c`;
}

/**
 * Extracts first name from a full name.
 */
export function getFirstName(name?: string): string {
  if (!name) return 'Founder';
  return name.split(' ')[0];
}

/**
 * Saves user info to both Zustand store and localStorage.
 */
export function saveUserInfo(user: UserInfo): void {
  if (!user.email) return;
  // Ensure avatar is set
  if (!user.avatar) {
    user.avatar = getAvatarUrl(user.name, user.email);
  }
  // Username fallback
  if (!user.username) {
    user.username = user.email.split('@')[0] || 'member';
  }
  // Save to localStorage
  try {
    localStorage.setItem(USER_INFO_KEY, JSON.stringify(user));
  } catch { /* ignore */ }
  // Update Zustand store
  useStore.getState().setCurrentUser(user);
}
