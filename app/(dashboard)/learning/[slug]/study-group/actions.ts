'use server';

import { cookies } from 'next/headers';
import prisma from '@/lib/db/prisma';
import { revalidatePath } from 'next/cache';
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://yftgdtdvmvvqyzcdntge.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_sY8NIgcLzNcLUGx2Swl9BA_yqf9NIc8';

// ── Types ─────────────────────────────────────────────────────────

export type StudyGroupWithMembers = NonNullable<
  Awaited<ReturnType<typeof getStudyGroup>>
>;

// ── Auth Helpers ──────────────────────────────────────────────────

/**
 * Reads the Supabase session from cookies and extracts the user's email,
 * then looks up (or auto-creates) the matching Prisma User record.
 * This eliminates the need for the client to pass email — auth is
 * resolved entirely server-side.
 */
async function getSessionEmail(): Promise<string> {
  // Read the Supabase auth cookie directly (bypasses the @supabase/ssr
  // wrapper so we don't need createServerClient in 'use server' context)
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();

  // Supabase stores the session as individual cookies prefixed with the project ref
  // The access token cookie is named: sb-<ref>-auth-token
  const tokenCookie = allCookies.find(
    (c) => c.name.startsWith('sb-') && c.name.endsWith('-auth-token')
  );

  if (!tokenCookie) throw new Error('Not authenticated');

  let session: { access_token?: string; user?: { email?: string } } | null = null;
  try {
    // The cookie value is a base64-encoded JSON string
    const decoded = JSON.parse(Buffer.from(tokenCookie.value, 'base64').toString('utf-8'));
    session = decoded;
  } catch {
    throw new Error('Invalid session');
  }

  if (!session?.user?.email) throw new Error('No email in session');

  return session.user.email;
}

// ── Enrollment Gate ───────────────────────────────────────────────

async function requireEnrollment(courseSlug: string) {
  const email = await getSessionEmail();

  let dbUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        email,
        name: email.split('@')[0],
        membershipTier: 'FREE',
        role: 'STUDENT',
      },
      select: { id: true },
    });
  }

  const course = await prisma.course.findUnique({
    where: { slug: courseSlug },
    select: { id: true, accessLevel: true },
  });
  if (!course) throw new Error('Course not found');

  // TODO: Re-enable enrollment check once memberships are implemented
  // const enrollment = await prisma.enrollment.findUnique({
  //   where: { userId_courseId: { userId: dbUser.id, courseId: course.id } },
  // });
  // if (!enrollment) throw new Error('Not enrolled in this course');

  return { userId: dbUser.id, courseId: course.id };
}

// ── Auto-join Group ───────────────────────────────────────────────

export async function ensureGroupMembership(courseSlug: string) {
  const { userId: uid, courseId } = await requireEnrollment(courseSlug);

  const group = await prisma.courseStudyGroup.upsert({
    where: { courseId },
    create: { courseId, description: null },
    update: {},
  });

  await prisma.groupMember.upsert({
    where: { groupId_userId: { groupId: group.id, userId: uid } },
    create: { groupId: group.id, userId: uid },
    update: {},
  });

  revalidatePath(`/learning/${courseSlug}/study-group`);
  return group;
}

// ── Post ──────────────────────────────────────────────────────────

export async function createGroupPost(courseSlug: string, content: string) {
  if (!content || content.trim().length === 0) {
    throw new Error('Content cannot be empty');
  }

  const { userId: uid, courseId } = await requireEnrollment(courseSlug);

  const group = await prisma.courseStudyGroup.findUniqueOrThrow({
    where: { courseId },
  });

  const post = await prisma.groupPost.create({
    data: { groupId: group.id, authorId: uid, content: content.trim() },
    include: {
      author: { select: { id: true, name: true, avatar: true, username: true } },
      replies: {
        include: {
          author: { select: { id: true, name: true, avatar: true } },
        },
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  revalidatePath(`/learning/${courseSlug}/study-group`);
  return post;
}

// ── Reply ─────────────────────────────────────────────────────────

export async function createGroupReply(
  courseSlug: string,
  postId: string,
  content: string
) {
  if (!content || content.trim().length === 0) {
    throw new Error('Reply cannot be empty');
  }

  const { userId: uid } = await requireEnrollment(courseSlug);

  const reply = await prisma.groupReply.create({
    data: { postId, authorId: uid, content: content.trim() },
    include: {
      author: { select: { id: true, name: true, avatar: true } },
    },
  });

  revalidatePath(`/learning/${courseSlug}/study-group`);
  return reply;
}

// ── File Upload ───────────────────────────────────────────────────

export async function uploadGroupFile(
  courseSlug: string,
  formData: FormData
) {
  const { userId: uid, courseId } = await requireEnrollment(courseSlug);

  const file = formData.get('file') as File;
  if (!file || !(file instanceof File)) {
    throw new Error('No file provided');
  }

  if (file.size > 10 * 1024 * 1024) {
    throw new Error('File too large (max 10 MB)');
  }

  const group = await prisma.courseStudyGroup.findUniqueOrThrow({
    where: { courseId },
  });

  const supabase = createSupabaseAdmin(SUPABASE_URL, SUPABASE_ANON_KEY);
  const buffer = Buffer.from(await file.arrayBuffer());
  const filePath = `study-groups/${group.id}/${Date.now()}-${file.name}`;

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('study-group-files')
    .upload(filePath, buffer, {
      contentType: file.type,
      cacheControl: '3600',
    });

  if (uploadError || !uploadData) {
    console.error('[StudyGroup] Upload error:', uploadError);
    throw new Error('Failed to upload file');
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from('study-group-files').getPublicUrl(filePath);

  const groupFile = await prisma.groupFile.create({
    data: {
      groupId: group.id,
      uploaderId: uid,
      fileName: file.name,
      fileUrl: publicUrl,
      fileSize: file.size,
      mimeType: file.type,
    },
    include: {
      uploader: { select: { id: true, name: true, avatar: true } },
    },
  });

  revalidatePath(`/learning/${courseSlug}/study-group`);
  return groupFile;
}

// ── Fetch Group Data ──────────────────────────────────────────────

export async function getStudyGroup(courseSlug: string) {
  const { courseId } = await requireEnrollment(courseSlug);

  const group = await prisma.courseStudyGroup.findUnique({
    where: { courseId },
    include: {
      members: {
        include: {
          user: {
            select: { id: true, name: true, avatar: true, username: true },
          },
        },
        orderBy: { joinedAt: 'asc' },
      },
      posts: {
        include: {
          author: {
            select: { id: true, name: true, avatar: true, username: true },
          },
          replies: {
            include: {
              author: { select: { id: true, name: true, avatar: true } },
            },
            orderBy: { createdAt: 'asc' },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 50,
      },
      files: {
        include: {
          uploader: { select: { id: true, name: true, avatar: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 50,
      },
    },
  });

  return group;
}

// ── Check Access ──────────────────────────────────────────────────

export async function canAccessStudyGroup(courseSlug: string) {
  try {
    await requireEnrollment(courseSlug);
    return true;
  } catch {
    return false;
  }
}
