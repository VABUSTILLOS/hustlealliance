import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

// GET /api/email/unsubscribe?u=<userId>
// Public, unauthenticated endpoint linked from every outgoing email footer.
export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('u');

  if (userId) {
    await prisma.user.update({
      where: { id: userId },
      data: { emailUnsubscribed: true },
    }).catch(() => null);
  }

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /><title>Unsubscribed</title></head>
<body style="font-family:system-ui,sans-serif;text-align:center;padding:64px 24px;color:#111">
  <h1 style="font-size:20px">You've been unsubscribed</h1>
  <p style="color:#666;font-size:14px">You will no longer receive marketing emails from HustleAlliance.</p>
</body>
</html>`;

  return new NextResponse(html, { headers: { 'Content-Type': 'text/html' } });
}
