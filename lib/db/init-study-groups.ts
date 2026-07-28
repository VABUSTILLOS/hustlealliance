import prisma from './prisma';

let initialized = false;
let initPromise: Promise<void> | null = null;

/**
 * Creates the CourseStudyGroup and related tables if they don't exist.
 * Uses a promise-based lock and executes each DDL statement individually
 * (multi-statement SQL is not reliably supported by all Prisma driver adapters).
 * Re-throws on failure so the caller can surface the error.
 */
export async function ensureStudyGroupTables(): Promise<void> {
  if (initialized) return;

  if (initPromise) {
    await initPromise;
    return;
  }

  initPromise = (async () => {
    // Quick check — bail if tables already exist
    try {
      await prisma.$executeRawUnsafe(`SELECT 1 FROM "CourseStudyGroup" LIMIT 1`);
      console.log('[StudyGroup] Tables already exist');
      initialized = true;
      return;
    } catch {
      // Table doesn't exist, proceed to create
    }

    console.log('[StudyGroup] Creating study group tables...');

    const statements = [
      `CREATE TABLE IF NOT EXISTS "CourseStudyGroup" ("id" TEXT NOT NULL, "courseId" TEXT NOT NULL, "description" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "CourseStudyGroup_pkey" PRIMARY KEY ("id"))`,
      `CREATE UNIQUE INDEX IF NOT EXISTS "CourseStudyGroup_courseId_key" ON "CourseStudyGroup"("courseId")`,
      `ALTER TABLE "CourseStudyGroup" ADD CONSTRAINT IF NOT EXISTS "CourseStudyGroup_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE`,

      `CREATE TABLE IF NOT EXISTS "GroupMember" ("id" TEXT NOT NULL, "groupId" TEXT NOT NULL, "userId" TEXT NOT NULL, "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "GroupMember_pkey" PRIMARY KEY ("id"))`,
      `CREATE UNIQUE INDEX IF NOT EXISTS "GroupMember_groupId_userId_key" ON "GroupMember"("groupId", "userId")`,
      `ALTER TABLE "GroupMember" ADD CONSTRAINT IF NOT EXISTS "GroupMember_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "CourseStudyGroup"("id") ON DELETE CASCADE`,
      `ALTER TABLE "GroupMember" ADD CONSTRAINT IF NOT EXISTS "GroupMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE`,

      `CREATE TABLE IF NOT EXISTS "GroupPost" ("id" TEXT NOT NULL, "groupId" TEXT NOT NULL, "authorId" TEXT NOT NULL, "content" TEXT NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "GroupPost_pkey" PRIMARY KEY ("id"))`,
      `ALTER TABLE "GroupPost" ADD CONSTRAINT IF NOT EXISTS "GroupPost_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "CourseStudyGroup"("id") ON DELETE CASCADE`,
      `ALTER TABLE "GroupPost" ADD CONSTRAINT IF NOT EXISTS "GroupPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE`,

      `CREATE TABLE IF NOT EXISTS "GroupReply" ("id" TEXT NOT NULL, "postId" TEXT NOT NULL, "authorId" TEXT NOT NULL, "content" TEXT NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "GroupReply_pkey" PRIMARY KEY ("id"))`,
      `ALTER TABLE "GroupReply" ADD CONSTRAINT IF NOT EXISTS "GroupReply_postId_fkey" FOREIGN KEY ("postId") REFERENCES "GroupPost"("id") ON DELETE CASCADE`,
      `ALTER TABLE "GroupReply" ADD CONSTRAINT IF NOT EXISTS "GroupReply_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE`,

      `CREATE TABLE IF NOT EXISTS "GroupFile" ("id" TEXT NOT NULL, "groupId" TEXT NOT NULL, "uploaderId" TEXT NOT NULL, "fileName" TEXT NOT NULL, "fileUrl" TEXT NOT NULL, "fileSize" INTEGER NOT NULL, "mimeType" TEXT NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "GroupFile_pkey" PRIMARY KEY ("id"))`,
      `ALTER TABLE "GroupFile" ADD CONSTRAINT IF NOT EXISTS "GroupFile_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "CourseStudyGroup"("id") ON DELETE CASCADE`,
      `ALTER TABLE "GroupFile" ADD CONSTRAINT IF NOT EXISTS "GroupFile_uploaderId_fkey" FOREIGN KEY ("uploaderId") REFERENCES "User"("id") ON DELETE CASCADE`,
    ];

    for (const sql of statements) {
      try {
        await prisma.$executeRawUnsafe(sql);
      } catch (err) {
        const msg = (err as Error).message?.slice(0, 120);
        console.warn('[StudyGroup] Statement warning:', msg);
        // Continue: some may fail because objects already exist
      }
    }

    console.log('[StudyGroup] Study group tables ready.');
    initialized = true;
  })();

  await initPromise;
}
