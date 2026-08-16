/**
 * Test-mode user resolution.
 * When the `ha_test_user_email` cookie is set, resolves the matching seed user
 * and constructs an AuthUser for the mock auth system.
 *
 * Remove this file before deploying to production.
 */

import { cookies } from 'next/headers';
import type { AuthUser } from './user';
import { allSeedUsers } from '@/lib/seed/users';
import { MOCK_USER } from './mock';
import { TEST_USER_COOKIE } from './test-user-constants';

/**
 * Check whether we're in test-user mode (cookie is set).
 */
export async function isTestMode(): Promise<boolean> {
  try {
    const jar = await cookies();
    return jar.has(TEST_USER_COOKIE);
  } catch {
    return false;
  }
}

/**
 * Resolve the current test user from the cookie.
 * Returns null if the cookie isn't set or the email doesn't match any seed user.
 */
export async function resolveTestUser(): Promise<AuthUser | null> {
  try {
    const jar = await cookies();
    const email = jar.get(TEST_USER_COOKIE)?.value;
    if (!email) return null;

    const seedUser = allSeedUsers.find((u) => u.email === email);
    if (!seedUser) return null;

    return {
      id: generateMockId(seedUser.email),
      email: seedUser.email,
      name: seedUser.name,
      role: seedUser.role,
      membershipTier: seedUser.membershipTier,
      avatar: seedUser.avatar,
    };
  } catch {
    return null;
  }
}

/**
 * Generate a deterministic mock ID from an email.
 * Keeps IDs stable across requests so likes/posts are attributed consistently.
 */
function generateMockId(email: string): string {
  let hash = 0;
  for (let i = 0; i < email.length; i++) {
    hash = ((hash << 5) - hash + email.charCodeAt(i)) | 0;
  }
  // Format as UUID-like string
  const hex = (hash >>> 0).toString(16).padStart(8, '0');
  return `00000000-0000-0000-0000-${hex.padStart(12, '0')}`;
}

/**
 * Get seed user metadata for client-side display (name, avatar, etc.).
 */
export function getSeedUserByEmail(email: string) {
  return allSeedUsers.find((u) => u.email === email) ?? null;
}

export { allSeedUsers };
