import { NextResponse, type NextRequest } from 'next/server';

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

  // Auth is handled client-side via localStorage + Zustand.
  // The proxy just passes through — no server-side redirects needed.
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
