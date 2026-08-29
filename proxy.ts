import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { getSupabaseUrl, getSupabaseAnonKey } from '@/lib/supabase/config';

const PROTECTED_PREFIXES = [
  '/admin',
  '/instructor',
  '/dashboard',
  '/member',
  '/community',
  '/messages',
];

export async function proxy(request: NextRequest) {
  const host = request.headers.get('host') || '';
  const url = request.nextUrl;

  // Redirect apex domain to www so HSTS preload covers both
  if (host === 'hustlealliance.com') {
    const wwwUrl = new URL(url.pathname + url.search, 'https://www.hustlealliance.com');
    const response = NextResponse.redirect(wwwUrl, 308);
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=63072000; includeSubDomains; preload'
    );
    return response;
  }

  const path = request.nextUrl.pathname;
  const isProtected =
    !path.startsWith('/api') &&
    PROTECTED_PREFIXES.some((p) => path === p || path.startsWith(`${p}/`));

  // Only do the Supabase SSR session check for protected page routes.
  // Skip when the env holds a placeholder (local dev without Supabase creds) —
  // server-side auth (getCurrentUser) falls back to the dev mock in that case.
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseUrl = getSupabaseUrl();
  if (isProtected && rawUrl && /^https?:\/\//.test(rawUrl)) {
    let response = NextResponse.next({ request });

    const supabase = createServerClient(
      supabaseUrl,
      getSupabaseAnonKey(),
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            response = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    await supabase.auth.getSession();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', path);
      return NextResponse.redirect(loginUrl);
    }

    return response;
  }

  // Apply CDN caching headers at the edge
  const response = NextResponse.next();

  // Community feed API — real-time feel with brief CDN cache
  if (path.startsWith('/api/community')) {
    response.headers.set(
      'Cache-Control',
      'public, s-maxage=10, stale-while-revalidate=30',
    );
  }

  // Avatar proxy — long-lived cache
  if (path.startsWith('/api/avatar')) {
    response.headers.set(
      'Cache-Control',
      'public, max-age=2592000, s-maxage=2592000, stale-while-revalidate=86400',
    );
  }

  // Leaderboard / public data — 60s CDN cache
  if (path.startsWith('/api/leaderboard') || path.startsWith('/api/courses')) {
    response.headers.set(
      'Cache-Control',
      'public, max-age=30, s-maxage=60, stale-while-revalidate=300',
    );
  }

  // Auth / private endpoints — never cache
  if (path.startsWith('/api/me') || path.startsWith('/api/dashboard')) {
    response.headers.set(
      'Cache-Control',
      'private, no-cache, no-store, must-revalidate',
    );
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
