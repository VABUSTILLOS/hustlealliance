import { NextRequest, NextResponse } from "next/server";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";
import prisma from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/user";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://yftgdtdvmvvqyzcdntge.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_sY8NIgcLzNcLUGx2Swl9BA_yqf9NIc8';
const BUCKET = 'study-group-files';
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

async function getMembership(groupId: string, userId: string) {
  return prisma.communityGroupMember.findUnique({
    where: { groupId_userId: { groupId, userId } },
    select: { role: true, status: true },
  });
}

// GET /api/groups/[id]/files — list group files (members only for non-public groups)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: groupId } = await params;
    const user = await getCurrentUser();

    const group = await prisma.communityGroup.findUnique({
      where: { id: groupId },
      select: { id: true, visibility: true },
    });
    if (!group) return NextResponse.json({ error: "Group not found" }, { status: 404 });

    if (group.visibility !== 'PUBLIC') {
      const membership = await getMembership(groupId, user.id);
      if (!membership || membership.status !== 'ACTIVE') {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    const files = await prisma.communityGroupFile.findMany({
      where: { groupId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        fileName: true,
        fileUrl: true,
        fileSize: true,
        mimeType: true,
        createdAt: true,
        uploaderId: true,
        uploader: { select: { id: true, name: true, avatar: true } },
      },
      take: 200,
    });

    return NextResponse.json(
      { files, currentUserId: user.id },
      { headers: { 'Cache-Control': 'private, no-cache' } },
    );
  } catch (err) {
    console.error('[GET /api/groups/[id]/files]', err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/groups/[id]/files — upload a file (active members only)
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: groupId } = await params;
    const user = await getCurrentUser();

    const membership = await getMembership(groupId, user.id);
    if (!membership || membership.status !== 'ACTIVE') {
      return NextResponse.json({ error: "Only group members can upload files" }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File too large (max 10 MB)" }, { status: 400 });
    }

    const supabase = createSupabaseAdmin(SUPABASE_URL, SUPABASE_ANON_KEY);
    const buffer = Buffer.from(await file.arrayBuffer());
    const safeName = file.name.replace(/[^\w.\- ]/g, '_');
    const filePath = `community-groups/${groupId}/${Date.now()}-${safeName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(filePath, buffer, { contentType: file.type, cacheControl: '3600' });

    if (uploadError || !uploadData) {
      console.error('[GroupFiles] Upload error:', uploadError);
      return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
    }

    const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(filePath);

    const record = await prisma.communityGroupFile.create({
      data: {
        groupId,
        uploaderId: user.id,
        fileName: file.name,
        fileUrl: publicUrl,
        fileSize: file.size,
        mimeType: file.type || 'application/octet-stream',
      },
      select: {
        id: true,
        fileName: true,
        fileUrl: true,
        fileSize: true,
        mimeType: true,
        createdAt: true,
        uploaderId: true,
        uploader: { select: { id: true, name: true, avatar: true } },
      },
    });

    return NextResponse.json({ file: record }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/groups/[id]/files]', err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/groups/[id]/files?fileId= — uploader, group admin/owner, or site admin
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: groupId } = await params;
    const user = await getCurrentUser();
    const fileId = new URL(req.url).searchParams.get('fileId');
    if (!fileId) return NextResponse.json({ error: "fileId is required" }, { status: 400 });

    const file = await prisma.communityGroupFile.findUnique({
      where: { id: fileId },
      select: { id: true, groupId: true, uploaderId: true },
    });
    if (!file || file.groupId !== groupId) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const membership = await getMembership(groupId, user.id);
    const canDelete =
      file.uploaderId === user.id ||
      user.role === 'ADMIN' ||
      membership?.role === 'OWNER' ||
      membership?.role === 'ADMIN';
    if (!canDelete) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await prisma.communityGroupFile.delete({ where: { id: fileId } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[DELETE /api/groups/[id]/files]', err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
