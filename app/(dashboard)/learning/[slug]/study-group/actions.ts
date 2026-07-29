'use server';

import prisma from '@/lib/db/prisma';
import { revalidatePath } from 'next/cache';
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js';
import { Pool } from 'pg';
import { cuid } from '@/lib/seed/utils';

const SUPABASE_URL = 'https://yftgdtdvmvvqyzcdntge.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_sY8NIgcLzNcLUGx2Swl9BA_yqf9NIc8';

function getPool() {
  return new Pool({
    connectionString: (process.env.DATABASE_URL || '').replace('connect_timeout=0', 'connect_timeout=30'),
    max: 1,
    connectionTimeoutMillis: 10000,
  });
}

// ── Types ─────────────────────────────────────────────────────────

export type StudyGroupWithMembers = NonNullable<
  Awaited<ReturnType<typeof getStudyGroup>>
>;

// ── Enrollment Gate ───────────────────────────────────────────────

/** Look up (or auto-create) a Prisma User by email, then verify course exists. */
async function requireEnrollment(email: string, courseSlug: string) {
  let dbUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (!dbUser) {
    const isGuest = email.startsWith('guest+');
    dbUser = await prisma.user.create({
      data: {
        email,
        name: isGuest ? 'Guest' : email.split('@')[0],
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

export async function ensureGroupMembership(email: string, courseSlug: string) {
  const { userId: uid, courseId } = await requireEnrollment(email, courseSlug);

  const pool = getPool();
  try {
    // Find or create the study group (uses raw Pool to bypass RLS)
    let { rows: groups } = await pool.query(
      `SELECT id FROM "CourseStudyGroup" WHERE "courseId" = $1`, [courseId]
    );
    let groupId: string;
    if (groups.length === 0) {
      groupId = cuid();
      await pool.query(
        `INSERT INTO "CourseStudyGroup" (id, "courseId", description, "createdAt", "updatedAt") VALUES ($1, $2, NULL, NOW(), NOW())`,
        [groupId, courseId]
      );
    } else {
      groupId = groups[0].id;
    }

    // Ensure membership
    await pool.query(
      `INSERT INTO "GroupMember" (id, "groupId", "userId", "joinedAt") VALUES ($1, $2, $3, NOW()) ON CONFLICT ("groupId", "userId") DO NOTHING`,
      [cuid(), groupId, uid]
    );
  } finally {
    await pool.end();
  }

  revalidatePath(`/learning/${courseSlug}/study-group`);
  return { id: '', courseId, description: null, createdAt: new Date(), updatedAt: new Date() };
}

// ── Post ──────────────────────────────────────────────────────────

export async function createGroupPost(
  email: string,
  courseSlug: string,
  content: string
) {
  if (!content || content.trim().length === 0) {
    throw new Error('Content cannot be empty');
  }

  const { userId: uid, courseId } = await requireEnrollment(email, courseSlug);

  const pool = getPool();
  try {
    const { rows: groups } = await pool.query(
      `SELECT id FROM "CourseStudyGroup" WHERE "courseId" = $1`, [courseId]
    );
    if (groups.length === 0) throw new Error('Study group not found');
    const groupId = groups[0].id;

    const postId = cuid();
    const now = new Date();
    await pool.query(
      `INSERT INTO "GroupPost" (id, "groupId", "authorId", content, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $5)`,
      [postId, groupId, uid, content.trim(), now]
    );

    // Return the created post shape for client
    const post = {
      id: postId,
      groupId,
      authorId: uid,
      content: content.trim(),
      createdAt: now,
      updatedAt: now,
      author: { id: uid, name: null, avatar: null, username: null } as any,
      replies: [] as any[],
    };

    revalidatePath(`/learning/${courseSlug}/study-group`);
    return post;
  } finally {
    await pool.end();
  }
}

// ── Reply ─────────────────────────────────────────────────────────

export async function createGroupReply(
  email: string,
  courseSlug: string,
  postId: string,
  content: string
) {
  if (!content || content.trim().length === 0) {
    throw new Error('Reply cannot be empty');
  }

  const { userId: uid } = await requireEnrollment(email, courseSlug);

  const pool = getPool();
  try {
    const replyId = cuid();
    const now = new Date();
    await pool.query(
      `INSERT INTO "GroupReply" (id, "postId", "authorId", content, "createdAt") VALUES ($1, $2, $3, $4, $5)`,
      [replyId, postId, uid, content.trim(), now]
    );

    const reply = {
      id: replyId,
      postId,
      authorId: uid,
      content: content.trim(),
      createdAt: now,
      author: { id: uid, name: null, avatar: null } as any,
    };

    revalidatePath(`/learning/${courseSlug}/study-group`);
    return reply;
  } finally {
    await pool.end();
  }
}

// ── File Upload ───────────────────────────────────────────────────

export async function uploadGroupFile(
  email: string,
  courseSlug: string,
  formData: FormData
) {
  const { userId: uid, courseId } = await requireEnrollment(email, courseSlug);

  const file = formData.get('file') as File;
  if (!file || !(file instanceof File)) {
    throw new Error('No file provided');
  }

  if (file.size > 10 * 1024 * 1024) {
    throw new Error('File too large (max 10 MB)');
  }

  const pool = getPool();
  try {
    const { rows: groups } = await pool.query(
      `SELECT id FROM "CourseStudyGroup" WHERE "courseId" = $1`, [courseId]
    );
    if (groups.length === 0) throw new Error('Study group not found');
    const groupId = groups[0].id;

    const supabase = createSupabaseAdmin(SUPABASE_URL, SUPABASE_ANON_KEY);
    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = `study-groups/${groupId}/${Date.now()}-${file.name}`;

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

    const fileId = cuid();
    await pool.query(
      `INSERT INTO "GroupFile" (id, "groupId", "uploaderId", "fileName", "fileUrl", "fileSize", "mimeType", "createdAt") VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
      [fileId, groupId, uid, file.name, publicUrl, file.size, file.type]
    );

    const groupFile = {
      id: fileId,
      groupId,
      uploaderId: uid,
      fileName: file.name,
      fileUrl: publicUrl,
      fileSize: file.size,
      mimeType: file.type,
      createdAt: new Date(),
      uploader: { id: uid, name: null, avatar: null } as any,
    };

    revalidatePath(`/learning/${courseSlug}/study-group`);
    return groupFile;
  } finally {
    await pool.end();
  }
}

// ── Fetch Group Data ──────────────────────────────────────────────

export async function getStudyGroup(email: string, courseSlug: string) {
  const { courseId } = await requireEnrollment(email, courseSlug);

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

export async function canAccessStudyGroup(email: string, courseSlug: string) {
  try {
    await requireEnrollment(email, courseSlug);
    return true;
  } catch {
    return false;
  }
}
