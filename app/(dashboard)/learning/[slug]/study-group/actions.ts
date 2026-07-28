'use server';

import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/db/prisma';
import { revalidatePath } from 'next/cache';

// ── Types ─────────────────────────────────────────────────────────

export type StudyGroupWithMembers = NonNullable<
  Awaited<ReturnType<typeof getStudyGroup>>
>;

// ── Enrollment Gate (reused by every action) ──────────────────────

async function requireEnrollment(courseSlug: string) {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) throw new Error('Unauthorized');

  const course = await prisma.course.findUnique({
    where: { slug: courseSlug },
    select: { id: true, accessLevel: true },
  });
  if (!course) throw new Error('Course not found');

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: user.id, courseId: course.id } },
  });
  if (!enrollment) throw new Error('Not enrolled in this course');

  return { userId: user.id, courseId: course.id };
}

// ── Auto-join Group ───────────────────────────────────────────────

export async function ensureGroupMembership(courseSlug: string) {
  const { userId, courseId } = await requireEnrollment(courseSlug);

  const group = await prisma.courseStudyGroup.upsert({
    where: { courseId },
    create: { courseId, description: null },
    update: {},
  });

  await prisma.groupMember.upsert({
    where: { groupId_userId: { groupId: group.id, userId } },
    create: { groupId: group.id, userId },
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

  const { userId, courseId } = await requireEnrollment(courseSlug);

  const group = await prisma.courseStudyGroup.findUniqueOrThrow({
    where: { courseId },
  });

  const post = await prisma.groupPost.create({
    data: { groupId: group.id, authorId: userId, content: content.trim() },
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

  const { userId } = await requireEnrollment(courseSlug);

  const reply = await prisma.groupReply.create({
    data: { postId, authorId: userId, content: content.trim() },
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
  const { userId, courseId } = await requireEnrollment(courseSlug);

  const file = formData.get('file') as File;
  if (!file || !(file instanceof File)) {
    throw new Error('No file provided');
  }

  // 10 MB limit
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('File too large (max 10 MB)');
  }

  const group = await prisma.courseStudyGroup.findUniqueOrThrow({
    where: { courseId },
  });

  const supabase = await createClient();
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
      uploaderId: userId,
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

// ── Check Access (used by the page before rendering) ──────────────

export async function canAccessStudyGroup(courseSlug: string) {
  try {
    await requireEnrollment(courseSlug);
    return true;
  } catch {
    return false;
  }
}
