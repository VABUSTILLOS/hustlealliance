import { prisma } from './prisma';

let initialized = false;
let initPromise: Promise<void> | null = null;
let seededPromise: Promise<void> | null = null;

// Per-course provisioning — lightweight, idempotent, called on every page visit
const provisionedCourses = new Set<string>();
const provisionPromises = new Map<string, Promise<void>>();

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

    // ── Check if tables already exist ──
    let tablesExist = false;
    try {
      await pool.query(`SELECT 1 FROM "CourseStudyGroup" LIMIT 1`);
      tablesExist = true;
      console.log('[StudyGroup] Tables already exist');
    } catch {
      // Table doesn't exist, will create below
    }

    // ── Create tables if needed ──
    if (!tablesExist) {
      console.log('[StudyGroup] Creating study group tables...');

      const statements = [
        `CREATE TABLE "CourseStudyGroup" ("id" TEXT NOT NULL, "courseId" TEXT NOT NULL, "description" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "CourseStudyGroup_pkey" PRIMARY KEY ("id"))`,
        `CREATE UNIQUE INDEX "CourseStudyGroup_courseId_key" ON "CourseStudyGroup"("courseId")`,
        `ALTER TABLE "CourseStudyGroup" ADD CONSTRAINT "CourseStudyGroup_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
        `CREATE TABLE "CourseGroupMember" ("id" TEXT NOT NULL, "groupId" TEXT NOT NULL, "userId" TEXT NOT NULL, "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "CourseGroupMember_pkey" PRIMARY KEY ("id"))`,
        `CREATE UNIQUE INDEX "CourseGroupMember_groupId_userId_key" ON "CourseGroupMember"("groupId", "userId")`,
        `ALTER TABLE "CourseGroupMember" ADD CONSTRAINT "CourseGroupMember_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "CourseStudyGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
        `ALTER TABLE "CourseGroupMember" ADD CONSTRAINT "CourseGroupMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
        `CREATE TABLE "CourseGroupPost" ("id" TEXT NOT NULL, "groupId" TEXT NOT NULL, "authorId" TEXT NOT NULL, "content" TEXT NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "CourseGroupPost_pkey" PRIMARY KEY ("id"))`,
        `ALTER TABLE "CourseGroupPost" ADD CONSTRAINT "CourseGroupPost_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "CourseStudyGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
        `ALTER TABLE "CourseGroupPost" ADD CONSTRAINT "CourseGroupPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
        `CREATE TABLE "CourseGroupReply" ("id" TEXT NOT NULL, "postId" TEXT NOT NULL, "authorId" TEXT NOT NULL, "content" TEXT NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "CourseGroupReply_pkey" PRIMARY KEY ("id"))`,
        `ALTER TABLE "CourseGroupReply" ADD CONSTRAINT "CourseGroupReply_postId_fkey" FOREIGN KEY ("postId") REFERENCES "CourseGroupPost"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
        `ALTER TABLE "CourseGroupReply" ADD CONSTRAINT "CourseGroupReply_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
        `CREATE TABLE "CourseGroupFile" ("id" TEXT NOT NULL, "groupId" TEXT NOT NULL, "uploaderId" TEXT NOT NULL, "fileName" TEXT NOT NULL, "fileUrl" TEXT NOT NULL, "fileSize" INTEGER NOT NULL, "mimeType" TEXT NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "CourseGroupFile_pkey" PRIMARY KEY ("id"))`,
        `ALTER TABLE "CourseGroupFile" ADD CONSTRAINT "CourseGroupFile_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "CourseStudyGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
        `ALTER TABLE "CourseGroupFile" ADD CONSTRAINT "CourseGroupFile_uploaderId_fkey" FOREIGN KEY ("uploaderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
      ];

      for (const sql of statements) {
        try {
          await pool.query(sql);
        } catch (err) {
          const msg = (err as Error).message?.slice(0, 120);
          // Non-fatal: table/index/constraint already exists (race condition)
          if (msg?.includes('already exists') || msg?.includes('duplicate key') || msg?.includes('must be owner')) {
            console.warn('[StudyGroup] Skipping DDL (exists/not owner):', msg);
            continue;
          }
          console.error('[StudyGroup] SQL error:', msg);
          throw err;
        }
      }
      console.log('[StudyGroup] Study group tables created.');
    }

    // ── Always disable RLS (tables may exist from prior deploys where this step was skipped) ──
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

/**
 * Lightweight per-course provisioning — creates a study group for a specific
 * course if one doesn't exist yet. Called on every study group page visit.
 * Idempotent and cheap (single findUnique + optional create).
 */
export async function ensureStudyGroupForCourse(courseId: string): Promise<void> {
  // Skip if already provisioned in this process lifetime
  if (provisionedCourses.has(courseId)) return;

  // Deduplicate concurrent calls for the same courseId
  const existing = provisionPromises.get(courseId);
  if (existing) {
    await existing;
    return;
  }

  const promise = (async () => {
    await ensureStudyGroupTables();

    // Check via Prisma (read-only — fine even with RLS)
    const group = await prisma.courseStudyGroup.findUnique({ where: { courseId } });
    if (group) {
      provisionedCourses.add(courseId);
      return;
    }

    // Use Prisma directly now that the table is owned by prisma and RLS is off
    try {
      const created = await prisma.courseStudyGroup.create({
        data: { courseId },
      });
      console.log('[StudyGroup] Provisioned study group for course', courseId, 'id:', created.id);
      provisionedCourses.add(courseId);
    } catch (err: any) {
      // Duplicate = another request raced us, that's fine
      if (err?.code === 'P2002' || err?.message?.includes('Unique constraint')) {
        console.log('[StudyGroup] Study group already exists (race).');
        provisionedCourses.add(courseId);
        return;
      }
      console.error('[StudyGroup] Failed to provision study group for', courseId, ':', err?.message);
    }
  })();

  provisionPromises.set(courseId, promise);
  await promise;
}

/**
 * Seeds study group data (groups, members, posts, replies) for all courses.
 * Idempotent — skips if study groups already exist.
 * Must be called after ensureStudyGroupTables().
 */
export async function ensureStudyGroupsSeeded(): Promise<void> {
  if (seededPromise) {
    await seededPromise;
    return;
  }

  seededPromise = (async () => {
    await ensureStudyGroupTables();

    // Check if demo posts have already been seeded
    const existingPostCount = await prisma.courseGroupPost.count();
    if (existingPostCount > 0) {
      console.log('[StudyGroup] Study groups already seeded, skipping.');
      return;
    }

    console.log('[StudyGroup] Seeding study groups...');

    // ── 1. Ensure EVERY course has a study group (1:1 universal) ──
    const allCourses = await prisma.course.findMany({
      select: { id: true, slug: true, instructorId: true },
    });

    const existingGroups = await prisma.courseStudyGroup.findMany({
      select: { courseId: true },
    });
    const existingCourseIds = new Set(existingGroups.map(g => g.courseId));

    let createdCount = 0;
    for (const course of allCourses) {
      if (existingCourseIds.has(course.id)) continue;
      await prisma.courseStudyGroup.create({
        data: { courseId: course.id, description: null },
      });
      createdCount++;
    }
    if (createdCount > 0) {
      console.log(`[StudyGroup] Created ${createdCount} missing study groups`);
    }

    // ── 2. Seed sample members + discussion posts for demo courses ──
    const marcus = await prisma.user.findUnique({ where: { email: 'marcus@hustlealliance.com' } });
    const priya  = await prisma.user.findUnique({ where: { email: 'priya@hustlealliance.com' } });
    const devon  = await prisma.user.findUnique({ where: { email: 'devon@hustlealliance.com' } });
    const sarah  = await prisma.user.findUnique({ where: { email: 'sarah@hustlealliance.com' } });
    const demo   = await prisma.user.findUnique({ where: { email: 'alex@hustlealliance.com' } });

    if (!marcus || !priya || !devon || !sarah || !demo) {
      console.warn('[StudyGroup] Not all seed users found, skipping demo posts seeding.');
      return;
    }

    const instructors = [marcus, priya, devon, sarah];

    const allCourseSlugs = [
      'fundraising-101', 'growth-marketing', 'product-led-growth',
      'leadership-foundations', 'sales-for-founders', 'startup-finance-101',
      'ai-tools-for-founders', 'design-thinking', 'remote-leadership',
      'content-marketing-mastery',
    ];

    const postsData: Record<string, { authorId: string; content: string; replies: { authorId: string; content: string }[] }[]> = {
      'fundraising-101': [
        { authorId: marcus.id, content: "Welcome to the Fundraising 101 study group! 👋 I'm Marcus, your instructor. Drop your pitch deck questions here and I'll give live feedback. What's the #1 thing you're struggling with in your fundraise?", replies: [
          { authorId: demo.id, content: "Thanks Marcus! I'm struggling with valuation — how do you determine a fair pre-money valuation for a pre-revenue startup?" },
          { authorId: marcus.id, content: "Great question Alex! For pre-revenue, it's mostly about comparable deals and team strength. Look at recent rounds in your sector at your stage. If you have strong founder-market fit and a big TAM, you can command a premium. I'd target $6-10M for a strong pre-seed." },
        ]},
        { authorId: demo.id, content: "Just finished the 'Building the 12-Slide Deck' lesson. The framework is super clear. Anyone want to do a mutual pitch deck review?", replies: [
          { authorId: priya.id, content: "I love this idea! Peer review is one of the most underrated fundraising tactics. Happy to give feedback when you share." },
        ]},
        { authorId: devon.id, content: "For those asking about warm intros — I swear by the double opt-in method. Always ask your connector before sending the blurb. It respects their relationship and dramatically increases the yes rate.", replies: [] },
      ],
      'growth-marketing': [
        { authorId: priya.id, content: "Hey growth hackers! 👋 I'm Priya, your instructor for Growth Marketing. Let's kick things off: what's your current MRR and what channel is working best for you right now?", replies: [
          { authorId: demo.id, content: "We're at $2K MRR, mostly from direct outreach. Looking to add a content engine to get more inbound. Any tips on where to start?" },
          { authorId: priya.id, content: "Start with one long-form pillar post per week targeting your highest-intent keyword. Repurpose it into 5-7 social posts. Consistency beats perfection — it took me 4 months to see real SEO traction." },
        ]},
      ],
      'product-led-growth': [
        { authorId: devon.id, content: "Welcome to PLG! The biggest mistake I see founders make is trying to bolt on PLG to a sales-led motion. You have to commit fully. What's your product's 'aha moment'?", replies: [
          { authorId: sarah.id, content: "So true. At my last company, we found our aha moment wasn't even a feature — it was when users saw their team's activity dashboard for the first time." },
        ]},
      ],
      'leadership-foundations': [
        { authorId: sarah.id, content: "Leadership is the hardest transition in a founder's journey. Going from doing everything to enabling others is uncomfortable but necessary. What's been your biggest leadership challenge so far?", replies: [
          { authorId: demo.id, content: "Delegation. I still catch myself doing things my team could handle because 'it's faster if I just do it.' How do you break that habit?" },
          { authorId: sarah.id, content: "Set a rule: if someone on your team can do it 70% as well as you, delegate it. Your job is to make that 70% become 90% through coaching." },
        ]},
      ],
      'sales-for-founders': [
        { authorId: marcus.id, content: "Founders who sell have an unfair advantage — you can change the product roadmap mid-conversation based on what you hear. No salesperson can do that. What's your biggest fear about doing sales calls?", replies: [
          { authorId: priya.id, content: "Honestly, the fear of sounding salesy. I don't want to be that pushy person. How do you sell without feeling like you're selling?" },
          { authorId: marcus.id, content: "Reframe it: you're not selling, you're diagnosing. Ask questions, listen, and only pitch if your product actually solves their problem." },
        ]},
      ],
      'startup-finance-101': [
        { authorId: devon.id, content: "Finance fluency is a superpower. When you can walk into a board meeting and talk cap tables, burn multiples, and unit economics, investors take you seriously. What finance topic scares you most?", replies: [
          { authorId: demo.id, content: "Cap tables. I get the basics but once you add convertible notes, SAFEs, and option pools I'm lost. Is there a good template?" },
          { authorId: devon.id, content: "Check out the cap table lesson in Module 3 — I included a Google Sheet template. The key is to model dilution at each round." },
        ]},
      ],
      'ai-tools-for-founders': [
        { authorId: devon.id, content: "AI is moving so fast — this course is my attempt to cut through the noise and give you the 20% of tools that create 80% of the value. What AI tool has made the biggest impact on your workflow so far?", replies: [
          { authorId: priya.id, content: "Claude for writing first drafts of blog posts and email sequences. I still edit heavily but it cuts my writing time by 60%." },
          { authorId: demo.id, content: "Cursor for coding! I'm not technical but I built a landing page in 2 hours. Mind-blowing." },
        ]},
      ],
      'design-thinking': [
        { authorId: priya.id, content: "Design thinking isn't about making things pretty — it's about making things that work for real humans. Who's tried talking to users this week? What surprised you?", replies: [
          { authorId: sarah.id, content: "I interviewed 5 users yesterday and every single one used our product differently than we intended. We were optimizing for the wrong workflow entirely." },
        ]},
      ],
      'remote-leadership': [
        { authorId: sarah.id, content: "Remote leadership done right can be more effective than in-office. But done wrong, it's a retention disaster. What's your remote team setup — fully remote, hybrid, or async-first?", replies: [
          { authorId: devon.id, content: "Async-first with quarterly offsites. Writing culture is everything — if it's not documented, it didn't happen. We use Notion for all decision-making and Loom for walkthroughs." },
        ]},
      ],
      'content-marketing-mastery': [
        { authorId: priya.id, content: "Content marketing is the most underrated growth lever for bootstrapped startups. It compounds. The blog post you write today will bring traffic for years. What's your content strategy right now?", replies: [
          { authorId: demo.id, content: "Honestly, we don't have one. We post randomly on Twitter when we remember. Where should we start?" },
          { authorId: priya.id, content: "Pick ONE platform and ONE format. Master it before expanding. For B2B SaaS, I'd start with LinkedIn + a weekly newsletter. Block 2 hours every Monday morning to write." },
        ]},
      ],
    };

    for (const slug of allCourseSlugs) {
      const course = await prisma.course.findUnique({
        where: { slug },
        select: { id: true, instructorId: true },
      });
      if (!course) { console.log(`  ⚠ Course ${slug} not found`); continue; }

      let group = await prisma.courseStudyGroup.findUnique({ where: { courseId: course.id } });
      if (!group) {
        group = await prisma.courseStudyGroup.create({
          data: { courseId: course.id, description: `Study group for ${slug}` },
        });
      }

      // Add members: instructor + demo + other instructors (up to 5)
      const memberIds = new Set<string>();
      if (course.instructorId) memberIds.add(course.instructorId);
      memberIds.add(demo.id);
      for (const inst of instructors) {
        if (memberIds.size >= 5) break;
        memberIds.add(inst.id);
      }
      for (const userId of memberIds) {
        await prisma.courseGroupMember.upsert({
          where: { groupId_userId: { groupId: group.id, userId } },
          update: {},
          create: { groupId: group.id, userId },
        });
      }

      // Add discussion posts
      const posts = postsData[slug] || [];
      for (const pd of posts) {
        const post = await prisma.courseGroupPost.create({
          data: {
            groupId: group.id,
            authorId: pd.authorId,
            content: pd.content,
            createdAt: new Date(Date.now() - Math.floor(Math.random() * 14 * 24 * 60 * 60 * 1000)),
          },
        });
        for (const rd of pd.replies) {
          await prisma.courseGroupReply.create({
            data: {
              postId: post.id,
              authorId: rd.authorId,
              content: rd.content,
              createdAt: new Date(post.createdAt.getTime() + Math.floor(Math.random() * 4 + 1) * 60 * 60 * 1000),
            },
          });
        }
      }
      console.log(`  📚 ${slug}: group + ${memberIds.size} members + ${posts.length} threads`);
    }

    console.log('[StudyGroup] Study groups seeded.');
  })();

  await seededPromise;
}
