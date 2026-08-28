import { NextRequest, NextResponse } from 'next/server';

// GET /r/[code]
// Captures a referral code into a cookie (read by the signup flow via
// `recordReferralSignup` in lib/referrals/attribute.ts) and redirects to signup.
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params;
  const url = new URL('/signup', request.url);

  const response = NextResponse.redirect(url, { status: 307 });
  response.cookies.set('referral_code', code, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
  return response;
}
