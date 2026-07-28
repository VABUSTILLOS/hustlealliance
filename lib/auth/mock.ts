// TODO: IMPLEMENT REAL AUTH - REVERT FOR PRODUCTION
// Centralized mock user for development — bypasses all authentication checks.
// Remove this file and all references before deploying to production.

import type { AuthUser } from './user';
import type { UserInfo } from '@/lib/store/useStore';

export const MOCK_USER_ID = '00000000-0000-0000-0000-000000000001';

export const MOCK_USER: AuthUser = {
  id: MOCK_USER_ID,
  email: 'founder@hustlealliance.com',
  name: 'Founder',
  role: 'ADMIN',
  membershipTier: 'PRO',
  avatar: 'https://api.dicebear.com/9.x/initials/svg?seed=Founder&backgroundColor=ea580c',
};

// Client-side mock (matches UserInfo interface from useStore)
export const MOCK_USER_INFO = {
  id: MOCK_USER_ID,
  email: 'founder@hustlealliance.com',
  name: 'Founder',
  username: 'founder',
  role: 'ADMIN' as const,
  membershipTier: 'PRO' as const,
  avatar: 'https://api.dicebear.com/9.x/initials/svg?seed=Founder&backgroundColor=ea580c',
};

/**
 * Generic "Founder" fallback profile for unauthenticated visitors.
 * Used as the default state so the dashboard renders fully without a logged-in user.
 */
export const FOUNDER_PROFILE: UserInfo = {
  id: '00000000-0000-0000-0000-000000000000',
  email: 'founder@hustlealliance.com',
  name: 'Founder',
  username: 'founder',
  role: 'STUDENT',
  membershipTier: 'FREE',
  avatar: 'https://api.dicebear.com/9.x/initials/svg?seed=Founder&backgroundColor=ea580c',
};
