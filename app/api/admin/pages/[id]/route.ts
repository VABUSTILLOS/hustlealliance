import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, authErrorResponse } from '@/lib/auth/guard';
import { prisma } from '@/lib/db/prisma';
import { Prisma } from '@/lib/generated/prisma/client';
import { safeParsePageDocument, ThemeSchema } from '@/lib/pages/blocks';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const page = await prisma.landingPage.findUnique({ where: { id } });
    if (!page) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    return NextResponse.json({ page });
  } catch (err) {
    try {
      return authErrorResponse(err);
    } catch {
      console.error('[GET /api/admin/pages/[id]]', err);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json().catch(() => ({}));

    const existing = await prisma.landingPage.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const data: {
      title?: string;
      slug?: string;
      blocks?: Prisma.InputJsonValue;
      seo?: Prisma.InputJsonValue;
      theme?: Prisma.InputJsonValue;
    } = {};

    if (typeof body.title === 'string' && body.title.trim()) {
      data.title = body.title.trim();
    }

    if (typeof body.slug === 'string' && body.slug.trim()) {
      const slug = body.slug
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 80);
      if (slug && slug !== existing.slug) {
        const clash = await prisma.landingPage.findUnique({ where: { slug } });
        if (clash) {
          return NextResponse.json({ error: 'Slug already in use' }, { status: 409 });
        }
        data.slug = slug;
      }
    }

    if (body.blocks !== undefined) {
      const blocksResult = safeParsePageDocument(body.blocks);
      if (!blocksResult.success) {
        return NextResponse.json({ error: 'Invalid blocks', issues: blocksResult.error.issues }, { status: 400 });
      }
      data.blocks = blocksResult.data as unknown as Prisma.InputJsonValue;
    }

    if (body.seo !== undefined) {
      data.seo = body.seo as Prisma.InputJsonValue;
    }

    if (body.theme !== undefined) {
      const themeResult = ThemeSchema.safeParse(body.theme);
      if (!themeResult.success) {
        return NextResponse.json({ error: 'Invalid theme', issues: themeResult.error.issues }, { status: 400 });
      }
      data.theme = (themeResult.data ?? null) as Prisma.InputJsonValue;
    }

    const page = await prisma.landingPage.update({ where: { id }, data });

    return NextResponse.json({ page });
  } catch (err) {
    try {
      return authErrorResponse(err);
    } catch {
      console.error('[PUT /api/admin/pages/[id]]', err);
      return NextResponse.json({ error: 'Failed to update page' }, { status: 500 });
    }
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    await prisma.landingPage.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (err) {
    try {
      return authErrorResponse(err);
    } catch {
      console.error('[DELETE /api/admin/pages/[id]]', err);
      return NextResponse.json({ error: 'Failed to delete page' }, { status: 500 });
    }
  }
}
