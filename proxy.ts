import { NextResponse, type NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  // Auth is handled client-side via localStorage + Zustand.
  // The proxy just passes through — no server-side redirects needed.
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
