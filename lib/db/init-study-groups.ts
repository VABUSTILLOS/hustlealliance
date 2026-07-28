import prisma from './prisma';

let initialized = false;
let initPromise: Promise<void> | null = null;

/**
 * Creates the CourseStudyGroup and related tables if they don't exist.
 * Uses a promise-based lock to prevent concurrent initialization races.
 */
export async function ensureStudyGroupTables(): Promise<void> {
  if (initialized) return;

  // If another request is already initializing, wait for it
  if (initPromise) {
    await initPromise;
    return;
  }

  initPromise = (async () => {
    try {
      await prisma.$queryRawUnsafe(
        `SELECT 1 FROM "CourseStudyGroup" LIMIT 1`
      );
      initialized = true;
      return;
    } catch (err) {
      // Only proceed with table creation if the error is "table doesn't exist"
      const msg = err instanceof Error ? err.message : String(err);
      if (
        !msg.includes('does not exist') &&
        !msg.includes('relation "CourseStudyGroup" does not exist')
      ) {
        console.error('[StudyGroup] Unexpected error checking table existence:', msg);
        throw err;
      }
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

      CREATE UNIQUE INDEX IF NOT EXISTS "CourseStudyGroup_courseId_key"
        ON "CourseStudyGroup"("courseId");

      CREATE TABLE IF NOT EXISTS "GroupMember" (
        "id" TEXT NOT NULL,
        "groupId" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "GroupMember_pkey" PRIMARY KEY ("id")
      );

      CREATE UNIQUE INDEX IF NOT EXISTS "GroupMember_groupId_userId_key"
        ON "GroupMember"("groupId", "userId");

      CREATE TABLE IF NOT EXISTS "GroupPost" (
        "id" TEXT NOT NULL,
        "groupId" TEXT NOT NULL,
        "authorId" TEXT NOT NULL,
        "content" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "GroupPost_pkey" PRIMARY KEY ("id")
      );

      CREATE TABLE IF NOT EXISTS "GroupReply" (
        "id" TEXT NOT NULL,
        "postId" TEXT NOT NULL,
        "authorId" TEXT NOT NULL,
        "content" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "GroupReply_pkey" PRIMARY KEY ("id")
      );

      CREATE TABLE IF NOT EXISTS "GroupFile" (
        "id" TEXT NOT NULL,
        "groupId" TEXT NOT NULL,
        "uploaderId" TEXT NOT NULL,
        "fileName" TEXT NOT NULL,
        "fileUrl" TEXT NOT NULL,
        "fileSize" INTEGER NOT NULL,
        "mimeType" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "GroupFile_pkey" PRIMARY KEY ("id")
      );

      ALTER TABLE "CourseStudyGroup"
        ADD CONSTRAINT IF NOT EXISTS "CourseStudyGroup_courseId_fkey"
        FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE;

      ALTER TABLE "GroupMember"
        ADD CONSTRAINT IF NOT EXISTS "GroupMember_groupId_fkey"
        FOREIGN KEY ("groupId") REFERENCES "CourseStudyGroup"("id") ON DELETE CASCADE;

      ALTER TABLE "GroupMember"
        ADD CONSTRAINT IF NOT EXISTS "GroupMember_userId_fkey"
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE;

      ALTER TABLE "GroupPost"
        ADD CONSTRAINT IF NOT EXISTS "GroupPost_groupId_fkey"
        FOREIGN KEY ("groupId") REFERENCES "CourseStudyGroup"("id") ON DELETE CASCADE;

      ALTER TABLE "GroupPost"
        ADD CONSTRAINT IF NOT EXISTS "GroupPost_authorId_fkey"
        FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE;

      ALTER TABLE "GroupReply"
        ADD CONSTRAINT IF NOT EXISTS "GroupReply_postId_fkey"
        FOREIGN KEY ("postId") REFERENCES "GroupPost"("id") ON DELETE CASCADE;

      ALTER TABLE "GroupReply"
        ADD CONSTRAINT IF NOT EXISTS "GroupReply_authorId_fkey"
        FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE;

      ALTER TABLE "GroupFile"
        ADD CONSTRAINT IF NOT EXISTS "GroupFile_groupId_fkey"
        FOREIGN KEY ("groupId") REFERENCES "CourseStudyGroup"("id") ON DELETE CASCADE;

      ALTER TABLE "GroupFile"
        ADD CONSTRAINT IF NOT EXISTS "GroupFile_uploaderId_fkey"
        FOREIGN KEY ("uploaderId") REFERENCES "User"("id") ON DELETE CASCADE;
    `);

    console.log('[StudyGroup] Study group tables created successfully.');
    initialized = true;
  })();

  await initPromise;
}
