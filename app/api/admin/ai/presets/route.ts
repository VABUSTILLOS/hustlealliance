import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { requireAdmin, authErrorResponse } from '@/lib/auth/guard';

// GET /api/admin/ai/presets?kind=<kind> — list saved prompt presets, optionally by kind.
export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    const kind = request.nextUrl.searchParams.get('kind');
    const presets = await prisma.aiPromptPreset.findMany({
      where: kind ? { kind } : undefined,
      orderBy: { updatedAt: 'desc' },
      take: 100,
    });
    return NextResponse.json({ presets });
  } catch (err) {
    return authErrorResponse(err);
  }
}

// POST /api/admin/ai/presets — Body: { name, kind, prompt }
export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const { name, kind, prompt } = (await request.json()) as {
      name?: string;
      kind?: string;
      prompt?: string;
    };
    if (!name?.trim() || !kind?.trim() || !prompt?.trim()) {
      return NextResponse.json({ error: 'name, kind, and prompt are required' }, { status: 400 });
    }
    const preset = await prisma.aiPromptPreset.create({
      data: { name: name.trim().slice(0, 120), kind: kind.trim().slice(0, 60), prompt: prompt.slice(0, 8000) },
    });
    return NextResponse.json({ preset }, { status: 201 });
  } catch (err) {
    return authErrorResponse(err);
  }
}
