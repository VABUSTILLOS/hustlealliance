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
        body: JSON.stringify({ code }),
      });

      if (res.ok) {
        const data = await res.json();
        // Pass token via URL fragment so client can save to localStorage
        const baseUrl = new URL(next, origin.startsWith('http') ? origin : `https://${origin}`);
        // Use access_token + refresh_token as query params for client-side storage
        baseUrl.searchParams.set('access_token', data.access_token);
        baseUrl.searchParams.set('refresh_token', data.refresh_token);
        baseUrl.searchParams.set('expires_at', String(Date.now() + (data.expires_in || 3600) * 1000));

        return NextResponse.redirect(baseUrl);
      }
    } catch (err) {
      console.error('[Auth Callback] Error:', err);
    }
  }

  const errorUrl = new URL('/login?error=auth_callback_failed', origin.startsWith('http') ? origin : `https://${origin}`);
  return NextResponse.redirect(errorUrl);
}
