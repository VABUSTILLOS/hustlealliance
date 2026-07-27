import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { createClient } from '@/lib/supabase/server';

// GET /api/certificates/[id]/download — redirect to certificate URL or render HTML
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const cert = await prisma.certificate.findUnique({
      where: { id },
      select: { userId: true, certificateUrl: true, course: { select: { title: true } } },
    });

    if (!cert) return NextResponse.json({ error: 'Certificate not found' }, { status: 404 });
    if (cert.userId !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    if (cert.certificateUrl) return NextResponse.redirect(cert.certificateUrl);

    const name = user.email || 'Student';
    const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Certificate - ${cert.course.title}</title>
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Georgia,serif;background:#0A0A0A;display:flex;justify-content:center;align-items:center;min-height:100vh;padding:40px}
.cert{max-width:800px;width:100%;background:#111;border:3px solid #FF3B30;border-radius:16px;padding:60px 40px;text-align:center;color:#fff;position:relative;overflow:hidden}
.cert::before{content:'';position:absolute;top:0;left:0;right:0;bottom:0;background:radial-gradient(ellipse at top,rgba(255,59,48,0.08),transparent 70%)}
h1{font-size:42px;color:#FF3B30;text-transform:uppercase;letter-spacing:4px;margin-bottom:8px}
h2{font-size:20px;color:#8A8A8A;font-weight:400;margin-bottom:40px}
.name{font-size:36px;font-weight:bold;margin-bottom:16px}
.course{font-size:22px;color:#FF6B35;margin-bottom:40px}
.divider{width:120px;height:2px;background:#FF3B30;margin:0 auto 30px}
.id{font-size:12px;color:#555;font-family:monospace}
@media print{body{background:#fff}.cert{background:#fff;color:#111;border-color:#c00}h1{color:#c00}}</style></head>
<body><div class="cert"><div style="font-size:48px;margin-bottom:20px">🎓</div>
<h1>Certificate of Completion</h1><h2>This certifies that</h2>
<div class="name">${name}</div><div class="divider"></div>
<div class="course">has successfully completed<br><strong>${cert.course.title}</strong></div>
<p class="id">Certificate ID: ${id}</p></div></body></html>`;

    return new NextResponse(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  } catch (err) {
    console.error('[GET /api/certificates]', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
