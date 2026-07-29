import { PrismaPg } from '@prisma/adapter-pg';

let initialized = false;
let initPromise: Promise<void> | null = null;

function getPool() {
  // Access the underlying pg Pool through the global prisma instance
  const globalForPrisma = globalThis as unknown as { __pgPool?: any };
  if (!globalForPrisma.__pgPool) {
    const { Pool } = require('pg');
    const connectionString = process.env.DATABASE_URL!;
    const urlWithTimeout = connectionString.includes('?')
      ? `${connectionString}&connect_timeout=10`
      : `${connectionString}?connect_timeout=10`;
    globalForPrisma.__pgPool = new Pool({
      connectionString: urlWithTimeout,
      max: 3,
      connectionTimeoutMillis: 10000,
      idleTimeoutMillis: 30000,
    });
  }
  return globalForPrisma.__pgPool;
}

/**
 * Creates the CourseStudyGroup and related tables if they don't exist.
 * Uses raw pg Pool because Prisma's $executeRawUnsafe mangles DDL statements
 * when used with the driver adapter.
 */
export async function ensureStudyGroupTables(): Promise<void> {
  if (initialized) return;

  if (initPromise) {
    await initPromise;
    return;
  }

  initPromise = (async () => {
    const pool = getPool();

    // Quick check — bail if tables already exist
    try {
      const result = await pool.query(`SELECT 1 FROM "CourseStudyGroup" LIMIT 1`);
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
      `ALTER TABLE "CourseStudyGroup" ADD CONSTRAINT IF NOT EXISTS "CourseStudyGroup_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
      `CREATE TABLE IF NOT EXISTS "CourseGroupMember" ("id" TEXT NOT NULL, "groupId" TEXT NOT NULL, "userId" TEXT NOT NULL, "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "CourseGroupMember_pkey" PRIMARY KEY ("id"))`,
      `CREATE UNIQUE INDEX IF NOT EXISTS "CourseGroupMember_groupId_userId_key" ON "CourseGroupMember"("groupId", "userId")`,
      `ALTER TABLE "CourseGroupMember" ADD CONSTRAINT IF NOT EXISTS "CourseGroupMember_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "CourseStudyGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
      `ALTER TABLE "CourseGroupMember" ADD CONSTRAINT IF NOT EXISTS "CourseGroupMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
      `CREATE TABLE IF NOT EXISTS "CourseGroupPost" ("id" TEXT NOT NULL, "groupId" TEXT NOT NULL, "authorId" TEXT NOT NULL, "content" TEXT NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "CourseGroupPost_pkey" PRIMARY KEY ("id"))`,
      `ALTER TABLE "CourseGroupPost" ADD CONSTRAINT IF NOT EXISTS "CourseGroupPost_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "CourseStudyGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
      `ALTER TABLE "CourseGroupPost" ADD CONSTRAINT IF NOT EXISTS "CourseGroupPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
      `CREATE TABLE IF NOT EXISTS "CourseGroupReply" ("id" TEXT NOT NULL, "postId" TEXT NOT NULL, "authorId" TEXT NOT NULL, "content" TEXT NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "CourseGroupReply_pkey" PRIMARY KEY ("id"))`,
      `ALTER TABLE "CourseGroupReply" ADD CONSTRAINT IF NOT EXISTS "CourseGroupReply_postId_fkey" FOREIGN KEY ("postId") REFERENCES "CourseGroupPost"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
      `ALTER TABLE "CourseGroupReply" ADD CONSTRAINT IF NOT EXISTS "CourseGroupReply_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
      `CREATE TABLE IF NOT EXISTS "CourseGroupFile" ("id" TEXT NOT NULL, "groupId" TEXT NOT NULL, "uploaderId" TEXT NOT NULL, "fileName" TEXT NOT NULL, "fileUrl" TEXT NOT NULL, "fileSize" INTEGER NOT NULL, "mimeType" TEXT NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "CourseGroupFile_pkey" PRIMARY KEY ("id"))`,
      `ALTER TABLE "CourseGroupFile" ADD CONSTRAINT IF NOT EXISTS "CourseGroupFile_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "CourseStudyGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
      `ALTER TABLE "CourseGroupFile" ADD CONSTRAINT IF NOT EXISTS "CourseGroupFile_uploaderId_fkey" FOREIGN KEY ("uploaderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    ];

    for (const sql of statements) {
      try {
        await pool.query(sql);
      } catch (err) {
        const msg = (err as Error).message?.slice(0, 120);
        console.error('[StudyGroup] SQL error:', msg);
        throw err;
      }
    }

    // Disable RLS on study group tables so all authenticated users can read/write
    // (site is in open pre-paywall mode)
    const rlsTables = ['CourseStudyGroup', 'CourseGroupMember', 'CourseGroupPost', 'CourseGroupReply', 'CourseGroupFile'];
    for (const table of rlsTables) {
      try {
        await pool.query(`ALTER TABLE "${table}" DISABLE ROW LEVEL SECURITY`);
        console.log(`[StudyGroup] RLS disabled on ${table}`);
      } catch (err) {
        console.warn(`[StudyGroup] Could not disable RLS on ${table}:`, (err as Error).message?.slice(0, 100));
      }
    }

    console.log('[StudyGroup] Study group tables created.');
    initialized = true;
  })();

  await initPromise;
}
