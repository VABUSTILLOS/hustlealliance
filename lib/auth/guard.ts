import { NextResponse } from 'next/server';
import { getCurrentUser, type AuthUser } from './user';

export class AuthError extends Error {
  constructor(
    public readonly status: 401 | 403,
    message: string,
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

/**
 * Require the current request to be authenticated as an ADMIN.
 * Throws AuthError(401) when unauthenticated, AuthError(403) when not admin.
 */
export async function requireAdmin(): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user) throw new AuthError(401, 'Unauthorized');
  if (user.role !== 'ADMIN') throw new AuthError(403, 'Admin access required');
  return user;
}

/**
 * Convert an AuthError into a NextResponse; rethrows anything else.
 * Use in route handlers:
 *   try { await requireAdmin(); } catch (e) { return authErrorResponse(e); }
 */
export function authErrorResponse(err: unknown): NextResponse {
  if (err instanceof AuthError) {
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
  throw err;
}
