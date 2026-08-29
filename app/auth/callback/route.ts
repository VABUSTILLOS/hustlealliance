import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * OAuth / magic-link callback. Exchanges the `code` for a session using the
 * `@supabase/ssr` client (writes httpOnly cookies) instead of passing tokens
 * through the URL query string.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    try {
      const supabase = await createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        const forwardedHost = request.headers.get('x-forwarded-host');
        const isLocalEnv = process.env.NODE_ENV === 'development';
        const target = isLocalEnv ? new URL(next, origin) : forwardedHost ? new URL(`https://${forwardedHost}${next}`) : new URL(next, origin);
        return NextResponse.redirect(target);
      }
      console.error('[Auth Callback] exchangeCodeForSession error:', error.message);
    } catch (err) {
      console.error('[Auth Callback] Error:', err);
    }
  }

  const errorUrl = new URL('/login?error=auth_callback_failed', origin.startsWith('http') ? origin : `https://${origin}`);
  return NextResponse.redirect(errorUrl);
}
