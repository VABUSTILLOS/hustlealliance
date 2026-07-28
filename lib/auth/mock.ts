// TODO: IMPLEMENT REAL AUTH - REVERT FOR PRODUCTION
// Centralized mock user for development — bypasses all authentication checks.
// Remove this file and all references before deploying to production.

import type { AuthUser } from './user';

export const MOCK_USER_ID = '00000000-0000-0000-0000-000000000001';

export const MOCK_USER: AuthUser = {
  id: MOCK_USER_ID,
  email: 'test@hustlealliance.com',
  name: 'Test User',
  role: 'ADMIN',
  membershipTier: 'PRO',
  avatar: 'https://api.dicebear.com/9.x/initials/svg?seed=Test+User&backgroundColor=ea580c',
};

// Client-side mock (matches UserInfo interface from useStore)
export const MOCK_USER_INFO = {
  id: MOCK_USER_ID,
  email: 'test@hustlealliance.com',
  name: 'Test User',
  username: 'testuser',
  role: 'ADMIN' as const,
  membershipTier: 'PRO' as const,
  avatar: 'https://api.dicebear.com/9.x/initials/svg?seed=Test+User&backgroundColor=ea580c',
};
