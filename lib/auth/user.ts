import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/db/prisma';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import type { UserRole, MembershipTier } from '@/lib/generated/prisma/client';

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  membershipTier: MembershipTier;
  avatar: string;
};

/**
 * Fetch the currently authenticated user from Supabase + database.
 *
 * Resolution order:
 *  1. (dev only) test-user switcher cookie via `ha_test_user_email`.
 *  2. Real Supabase session → DB `User` record (looked up by `authId`, then email).
 *     A minimal `User` row is upserted on first login so every authenticated
 *     actor is real before onboarding completes.
 *  3. No session:
 *       - development → `MOCK_USER` so the local demo keeps rendering.
 *       - production → `null` (callers must handle with 401/redirect).
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  // Dev-only: test-user switcher cookie
  if (process.env.NODE_ENV !== 'production') {
    const { resolveTestUser } = await import('@/lib/auth/test-user');
    const testUser = await resolveTestUser();
    if (testUser) return testUser;
  }

  // No real Supabase credentials configured — dev falls back to mock, prod bails.
  if (!isSupabaseConfigured()) {
    if (process.env.NODE_ENV !== 'production') {
      const { MOCK_USER } = await import('@/lib/auth/mock');
      return MOCK_USER;
    }
    return null;
  }

  try {
    const supabase = await createClient();
    const { data: { user: authUser }, error } = await supabase.auth.getUser();
    if (error || !authUser) {
      // Authenticated as far as cookies go, but the token is invalid/expired.
      if (process.env.NODE_ENV !== 'production') {
        const { MOCK_USER } = await import('@/lib/auth/mock');
        return MOCK_USER;
      }
      return null;
    }

    const dbUser = await ensureDbUser(authUser);
    if (!dbUser) return null;

    return {
      id: dbUser.id,
      email: dbUser.email,
      name: dbUser.name,
      role: dbUser.role,
      membershipTier: dbUser.membershipTier,
      avatar: dbUser.avatar ?? '',
    };
  } catch (err) {
    // During static prerender, `cookies()` throws "Dynamic server usage" —
    // Next.js uses this to opt the route into dynamic rendering. That is
    // expected, not a failure, so don't log it. Supabase unreachable (e.g.
    // local dev without network) is logged so transient failures are visible.
    const msg = (err as Error)?.message ?? '';
    if (msg && !msg.includes('Dynamic server usage')) {
      console.error('[Auth] getUser failed:', msg);
    }
    if (process.env.NODE_ENV !== 'production') {
      const { MOCK_USER } = await import('@/lib/auth/mock');
      return MOCK_USER;
    }
    return null;
  }
}

/**
 * Find the DB User matching a Supabase auth user, creating a minimal record
 * on first login. Uses the deterministic Supabase `id` as the stable `authId`.
 */
async function ensureDbUser(authUser: {
  id: string;
  email?: string;
  user_metadata?: { full_name?: string; name?: string; avatar_url?: string } | null;
}): Promise<{ id: string; email: string; name: string; role: UserRole; membershipTier: MembershipTier; avatar: string | null } | null> {
  const email = authUser.email?.toLowerCase();
  if (!email) return null;

  const existing = await prisma.user.findFirst({
    where: { OR: [{ authId: authUser.id }, { email }] },
  });

  if (existing) {
    // Link authId on older accounts created before the field existed.
    if (!existing.authId && existing.email === email) {
      return prisma.user.update({
        where: { id: existing.id },
        data: { authId: authUser.id },
      });
    }
    return existing;
  }

  const meta = authUser.user_metadata ?? {};
  const name =
    meta.full_name ||
    meta.name ||
    email.split('@')[0] ||
    'Member';
  const avatar = meta.avatar_url || '';

  return prisma.user.create({
    data: { authId: authUser.id, email, name, avatar },
  });
}

/**
 * Require a specific role — throws if user doesn't have it.
 * Use in API routes and server components to enforce access.
 */
export function requireRole(user: AuthUser | null, ...roles: UserRole[]): AuthUser {
  if (!user) throw new Error('Unauthorized');
  if (!roles.includes(user.role)) throw new Error('Forbidden');
  return user;
}

/**
 * Check if user has at least the given role.
 */
export function hasRole(user: AuthUser | null, role: UserRole): boolean {
  if (!user) return false;
  if (user.role === 'ADMIN') return true; // ADMIN has access to everything
  if (role === 'INSTRUCTOR') return user.role === 'INSTRUCTOR';
  return true; // STUDENT and above can access student-level features
}
