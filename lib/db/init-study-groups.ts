import prisma from './prisma';

let initialized = false;
let initPromise: Promise<void> | null = null;

/**
 * Checks whether study group tables exist, with a single retry on connection errors.
 */
async function checkTableExists(): Promise<boolean> {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      await prisma.$queryRawUnsafe(
        `SELECT 1 FROM "CourseStudyGroup" LIMIT 1`
      );
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (
        msg.includes('does not exist') ||
        msg.includes('relation "CourseStudyGroup" does not exist')
      ) {
        return false;
      }
      if (
        (msg.includes('connect') || msg.includes('timeout') || msg.includes('ECONN')) &&
        attempt === 0
      ) {
        console.warn('[StudyGroup] Connection error checking tables, retrying...');
        await new Promise((r) => setTimeout(r, 2000));
        continue;
      }
      throw err;
    }
  }
  return false;
}

/**
 * Creates the CourseStudyGroup and related tables if they don't exist.
 * Uses a promise-based lock to prevent concurrent initialization races.
 * Falls through gracefully on unexpected errors so the actual query
 * surfaces a more useful error.
 */
export async function ensureStudyGroupTables(): Promise<void> {
  if (initialized) return;

  if (initPromise) {
    await initPromise;
    return;
  }

  initPromise = (async () => {
    try {
      const exists = await checkTableExists();
      if (exists) {
        initialized = true;
        return;
      }

      console.log('[StudyGroup] Creating study group tables...');

      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "CourseStudyGroup" (
          "id" TEXT NOT NULL,
          "courseId" TEXT NOT NULL,
          "description" TEXT,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "CourseStudyGroup_pkey" PRIMARY KEY ("id")
        );
        CREATE UNIQUE INDEX IF NOT EXISTS "CourseStudyGroup_courseId_key" ON "CourseStudyGroup"("courseId");
        CREATE TABLE IF NOT EXISTS "GroupMember" (
          "id" TEXT NOT NULL, "groupId" TEXT NOT NULL, "userId" TEXT NOT NULL,
          "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "GroupMember_pkey" PRIMARY KEY ("id")
        );
        CREATE UNIQUE INDEX IF NOT EXISTS "GroupMember_groupId_userId_key" ON "GroupMember"("groupId", "userId");
        CREATE TABLE IF NOT EXISTS "GroupPost" (
          "id" TEXT NOT NULL, "groupId" TEXT NOT NULL, "authorId" TEXT NOT NULL,
          "content" TEXT NOT NULL,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "GroupPost_pkey" PRIMARY KEY ("id")
        );
        CREATE TABLE IF NOT EXISTS "GroupReply" (
          "id" TEXT NOT NULL, "postId" TEXT NOT NULL, "authorId" TEXT NOT NULL,
          "content" TEXT NOT NULL,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "GroupReply_pkey" PRIMARY KEY ("id")
        );
        CREATE TABLE IF NOT EXISTS "GroupFile" (
          "id" TEXT NOT NULL, "groupId" TEXT NOT NULL, "uploaderId" TEXT NOT NULL,
          "fileName" TEXT NOT NULL, "fileUrl" TEXT NOT NULL,
          "fileSize" INTEGER NOT NULL, "mimeType" TEXT NOT NULL,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "GroupFile_pkey" PRIMARY KEY ("id")
        );
        ALTER TABLE "CourseStudyGroup" ADD CONSTRAINT IF NOT EXISTS "CourseStudyGroup_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE;
        ALTER TABLE "GroupMember" ADD CONSTRAINT IF NOT EXISTS "GroupMember_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "CourseStudyGroup"("id") ON DELETE CASCADE;
        ALTER TABLE "GroupMember" ADD CONSTRAINT IF NOT EXISTS "GroupMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE;
        ALTER TABLE "GroupPost" ADD CONSTRAINT IF NOT EXISTS "GroupPost_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "CourseStudyGroup"("id") ON DELETE CASCADE;
        ALTER TABLE "GroupPost" ADD CONSTRAINT IF NOT EXISTS "GroupPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE;
        ALTER TABLE "GroupReply" ADD CONSTRAINT IF NOT EXISTS "GroupReply_postId_fkey" FOREIGN KEY ("postId") REFERENCES "GroupPost"("id") ON DELETE CASCADE;
        ALTER TABLE "GroupReply" ADD CONSTRAINT IF NOT EXISTS "GroupReply_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE;
        ALTER TABLE "GroupFile" ADD CONSTRAINT IF NOT EXISTS "GroupFile_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "CourseStudyGroup"("id") ON DELETE CASCADE;
        ALTER TABLE "GroupFile" ADD CONSTRAINT IF NOT EXISTS "GroupFile_uploaderId_fkey" FOREIGN KEY ("uploaderId") REFERENCES "User"("id") ON DELETE CASCADE;
      `);

      console.log('[StudyGroup] Study group tables created successfully.');
      initialized = true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('[StudyGroup] Failed to ensure study group tables:', msg);
      // Don't rethrow — let the actual query below surface a more useful error
    }
  })();

  await initPromise.catch(() => {
    // Swallow — promise already handled above
  });
}
