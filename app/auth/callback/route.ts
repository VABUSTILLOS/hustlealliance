import { NextResponse } from 'next/server';

const SUPABASE_URL = 'https://yftgdtdvmvvqyzcdntge.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_sY8NIgcLzNcLUGx2Swl9BA_yqf9NIc8';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    try {
      const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=authorization_code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({
          code,
          redirect_to: `${origin}/auth/callback`,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const response = NextResponse.redirect(
          new URL(next, origin.startsWith('http') ? origin : `https://${origin}`)
        );

        // Set auth tokens as cookies so middleware can read them
        if (data.access_token) {
          response.cookies.set('sb-yftgdtdvmvvqyzcdntge-auth-token', JSON.stringify({
            access_token: data.access_token,
            refresh_token: data.refresh_token,
            expires_at: Date.now() + (data.expires_in || 3600) * 1000,
          }), {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            maxAge: data.expires_in || 3600,
          });
        }

        return response;
      }
    } catch (err) {
      console.error('[Auth Callback] Error:', err);
    }
  }

  const errorUrl = new URL('/login?error=auth_callback_failed', origin.startsWith('http') ? origin : `https://${origin}`);
  return NextResponse.redirect(errorUrl);
}
