import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/db/prisma';
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
 * Returns null if not authenticated or user not found in DB.
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user?.email) return null;

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      membershipTier: true,
      avatar: true,
    },
  });

  if (!dbUser) return null;

  return {
    id: dbUser.id,
    email: dbUser.email,
    name: dbUser.name || user.email.split('@')[0],
    role: dbUser.role,
    membershipTier: dbUser.membershipTier,
    avatar: dbUser.avatar || `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(dbUser.name || user.email)}`,
  };
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
