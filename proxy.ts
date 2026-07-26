import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const SUPABASE_URL = 'https://yftgdtdvmvvqyzcdntge.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_sY8NIgcLzNcLUGx2Swl9BA_yqf9NIc8';

function getSupabaseConfig() {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || SUPABASE_URL,
    key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || SUPABASE_ANON_KEY,
  };
}

export async function proxy(request: NextRequest) {
  const { url, key } = getSupabaseConfig();

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(url, key, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session
  const { data: { session } } = await supabase.auth.getSession();

  const { pathname } = request.nextUrl;

  // Public routes that don't require auth
  const publicPaths = ['/', '/login', '/signup', '/preview'];
  const isPublic = publicPaths.some(
    (p) => pathname === p || pathname.startsWith(p + '/')
  );

  // Auth pages — redirect to dashboard if already logged in
  if ((pathname === '/login' || pathname === '/signup') && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Protected routes — redirect to login if not authenticated
  if (!isPublic && !session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
