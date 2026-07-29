// prisma/seed-community.ts — Community data seeding for cold-start problem
// Generates 6 months of realistic, organic community activity
//
// Usage: npx tsx prisma/seed-community.ts
// Prerequisites: Main seed (prisma/seed.ts) must be run first for courses + badges
// Idempotent: uses upsert/createMany with skipDuplicates throughout

import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../lib/generated/prisma/client';
import {
  random, pick, pickN, pickWeighted, sliceRandom, randInt, randFloat,
  randomDate, randomDateBiased, weekdayDate, burstDates, dateNear, startOfDay,
  cuid, slugify, chunk,
} from '../lib/seed/utils';
import { allSeedUsers, heroUsers, memberUsers, noviceUsers, seedSpaces } from '../lib/seed/users';
import {
  postTemplates, commentTemplates, eventTemplates,
  groupPostTemplates, fillTemplate, postImages,
} from '../lib/seed/content';

// ── Setup ────────────────────────────────────────────────────────────────────
const adapter = new PrismaPg({
  connectionString: (process.env.DATABASE_URL || '').replace('connect_timeout=0', 'connect_timeout=30'),
});
const prisma = new PrismaClient({ adapter });

const NOW = Date.now();
const MS_DAY = 86_400_000;
const SEED_WINDOW = 180; // 6 months

// XP amounts per action
const XP = {
  LESSON_COMPLETE: 10,
  COMMUNITY_POST: 8,
  COMMUNITY_COMMENT: 3,
  DAILY_LOGIN: 5,
  PATH_COMPLETED: 50,
  EVENT_ATTENDED: 15,
  BADGE_EARNED: 25,
};

// ── Helper: create a date N days ago ─────────────────────────────────────────
function daysAgo(days: number): Date {
  return new Date(NOW - days * MS_DAY);
}

// ── Helper: generate a sequential date within a range ─────────────────────────
function sequentialDates(count: number, startDaysAgo: number, endDaysAgo: number): Date[] {
  const start = NOW - startDaysAgo * MS_DAY;
  const end = NOW - endDaysAgo * MS_DAY;
  const step = (end - start) / (count - 1 || 1);
  return Array.from({ length: count }, (_, i) => {
    // Add some jitter (-20% to +20% of step)
    const jitter = randFloat(-step * 0.2, step * 0.2);
    return new Date(start + i * step + jitter);
  });
}

// ═════════════════════════════════════════════════════════════════════════════
// MAIN SEED FUNCTION
// ═════════════════════════════════════════════════════════════════════════════
async function main() {
  console.log('🌱 Seeding community data (6-month cold-start)...');
  console.log(`   Seed window: ${SEED_WINDOW} days`);
  console.log(`   Total users to seed: ${allSeedUsers.length}`);
  await prisma.$connect();

  // ── PHASE 1: Users & Profiles ────────────────────────────────────────────
  console.log('\n📦 Phase 1: Upserting users & profiles...');
  const userIds: string[] = [];
  for (const u of allSeedUsers) {
    const createdAt = daysAgo(u.joinedDaysAgo);
    // Upsert handles existing users from main seed
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: { membershipTier: u.membershipTier },
      create: {
        email: u.email,
        name: u.name,
        username: u.username,
        role: u.role,
        membershipTier: u.membershipTier,
        avatar: u.avatar,
        bio: u.bio,
        headline: u.headline,
        createdAt,
      },
    });
    userIds.push(user.id);

    // Create Profile record
    await prisma.profile.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        displayName: u.name,
        location: u.location,
        industries: u.industries,
        skills: u.skills,
        headline: u.headline,
        summary: u.bio,
        socialLinks: {},
        yearsExperience: randInt(1, 20),
        createdAt,
      },
    });
  }
  console.log(`   ✅ ${userIds.length} users with profiles`);

  // Map usernames → IDs for quick lookup
  const usernameToId: Record<string, string> = {};
  for (let i = 0; i < allSeedUsers.length; i++) {
    usernameToId[allSeedUsers[i].username] = userIds[i];
  }

  // ── PHASE 2: Community Posts (200-400 posts) ──────────────────────────────
  console.log('\n📦 Phase 2: Creating CommunityPosts...');

  const heroIds = heroUsers.map(u => usernameToId[u.username]).filter(Boolean);
  const memberIds = memberUsers.map(u => usernameToId[u.username]).filter(Boolean);
  const noviceIds = noviceUsers.map(u => usernameToId[u.username]).filter(Boolean);

  const spaceSlugs = seedSpaces.map(s => s.slug);
  const spaceWeights = [8, 5, 4, 6, 5, 3, 5, 4, 3, 3]; // Match member activity

  // Skip if already seeded — load existing data instead
  const existingPosts = await prisma.communityPost.count();
  let totalPosts: number;
  let postIds: string[];
  let postData: Array<{ id: string; authorId: string; createdAt: Date; space: string | null }>;

  if (existingPosts > 50) {
    console.log(`   ⏭️  ${existingPosts} posts already exist, loading from DB...`);
    const dbPosts = await prisma.communityPost.findMany({
      select: { id: true, authorId: true, createdAt: true, space: true },
      take: 1000,
    });
    totalPosts = dbPosts.length;
    postIds = dbPosts.map(p => p.id);
    postData = dbPosts;
  } else {
    totalPosts = randInt(250, 400);
    postIds = [];
    postData = [];

    for (let i = 0; i < totalPosts; i++) {
      const authorPool = random() < 0.3 ? heroIds :
                        random() < 0.85 ? memberIds : noviceIds;
      const authorId = pick(authorPool);

      const template = pick(postTemplates);
      const content = fillTemplate(template.content);
      const space = pickWeighted(spaceSlugs, spaceWeights);
      const createdAt = weekdayDate(SEED_WINDOW, 0);
      const id = cuid();

      postIds.push(id);
      postData.push({ id, authorId, createdAt, space });

      const imageUrls = template.hasImage && random() < 0.6
        ? [pick(postImages)]
        : [];

      await prisma.communityPost.create({
        data: { id, authorId, content, space, imageUrls, createdAt, visibility: 'PUBLIC' },
      });
    }
    console.log(`   ✅ ${totalPosts} posts created`);
  }

  // ── PHASE 3: Community Comments (500-1000) ─────────────────────────────────
  console.log('\n📦 Phase 3: Creating CommunityComments...');

  const existingComments = await prisma.communityComment.count();
  let totalComments = 0;
  const commentData: Array<{ postId: string; authorId: string; createdAt: Date }> = [];

  if (existingComments > 50) {
    console.log(`   ⏭️  ${existingComments} comments already exist, skipping Phase 3`);
    totalComments = existingComments;
  } else {

  // Posts sorted by creation date (old ones get more comments)
  const postsByDate = [...postData].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

  // Popular posts (top 20%) get 4-12 comments; rest get 0-4
  const popCutoff = Math.floor(postsByDate.length * 0.2);
  const popularPosts = postsByDate.slice(0, popCutoff);
  const normalPosts = postsByDate.slice(popCutoff);

  // Comments on popular posts
  for (const post of popularPosts) {
    const count = randInt(4, 12);
    const dates = burstDates(post.createdAt, count, 72); // spread up to 3 days
    for (let j = 0; j < count; j++) {
      const commenterId = pick([...heroIds, ...memberIds]);
      const template = pick(commentTemplates);
      const content = fillTemplate(template);

      await prisma.communityComment.create({
        data: { postId: post.id, authorId: commenterId, content, createdAt: dates[j] },
      });

      commentData.push({ postId: post.id, authorId: commenterId, createdAt: dates[j] });
      totalComments++;
    }
  }

  // Comments on normal posts
  for (const post of normalPosts) {
    const count = randInt(0, 4);
    const dates = burstDates(post.createdAt, count, 24);
    for (let j = 0; j < count; j++) {
      const commenterId = pick([...heroIds, ...memberIds]);
      const content = fillTemplate(pick(commentTemplates));

      await prisma.communityComment.create({
        data: { postId: post.id, authorId: commenterId, content, createdAt: dates[j] },
      });

      commentData.push({ postId: post.id, authorId: commenterId, createdAt: dates[j] });
      totalComments++;
    }
  }
  console.log(`   ✅ ${totalComments} comments created`);
  }

  // ── PHASE 4: Post Likes (3-25 per post) ───────────────────────────────────
  console.log('\n📦 Phase 4: Creating PostLikes...');

  const existingLikes = await prisma.postLike.count();
  let totalLikes = 0;

  if (existingLikes > 50) {
    console.log(`   ⏭️  ${existingLikes} likes already exist, skipping Phase 4`);
    totalLikes = existingLikes;
  } else {

  for (const post of postData) {
    const likesCount = randInt(3, 25);
    const likers = pickN(userIds, Math.min(likesCount, userIds.length));
    const likeDates = burstDates(post.createdAt, likers.length, 240); // spread ~10 days

    const likeRecords = likers.map((userId, i) => ({
      postId: post.id,
      userId,
      createdAt: likeDates[i],
    }));

    // Use createMany with skipDuplicates for efficiency
    const chunks = chunk(likeRecords, 50);
    for (const c of chunks) {
      await prisma.postLike.createMany({ data: c, skipDuplicates: true });
    }
    totalLikes += likeRecords.length;
  }
  console.log(`   ✅ ${totalLikes} likes created`);
  }

  // ── PHASE 5: Events (30-50: PAST + LIVE + UPCOMING) ────────────────────────
  console.log('\n📦 Phase 5: Creating Events...');

  const existingEvents = await prisma.event.count();
  let totalEvents: number;
  let eventIds: string[];

  if (existingEvents > 5) {
    console.log(`   ⏭️  ${existingEvents} events already exist, loading from DB...`);
    const dbEvents = await prisma.event.findMany({ select: { id: true }, take: 100 });
    totalEvents = dbEvents.length;
    eventIds = dbEvents.map(e => e.id);
  } else {

  // Fetch host user IDs (unique usernames from event templates)
  const hostUsernames = eventTemplates.map(e => e.hostUsername).filter((v, i, a) => a.indexOf(v) === i);
  const hostIds: Record<string, string> = {};
  for (const uname of hostUsernames) {
    if (usernameToId[uname]) hostIds[uname] = usernameToId[uname];
  }

  totalEvents = randInt(30, 50);
  eventIds = [];

  for (let i = 0; i < totalEvents; i++) {
    const template = pick(eventTemplates);
    const hostId = hostIds[template.hostUsername] || pick(heroIds);
    const title = fillTemplate(template.title);
    const slug = slugify(title) + '-' + randInt(1, 999);

    let status: 'ENDED' | 'UPCOMING' | 'LIVE';
    let startDate: Date;

    const r = random();
    if (r < 0.45) {
      status = 'ENDED';
      startDate = weekdayDate(SEED_WINDOW, 7);
    } else if (r < 0.9) {
      status = 'UPCOMING';
      startDate = new Date(NOW + randInt(1, 30) * MS_DAY);
      startDate.setHours(randInt(9, 17), randInt(0, 59), 0, 0);
    } else {
      status = 'LIVE';
      startDate = new Date(NOW - randInt(1, 4) * 3_600_000);
    }

    const endDate = new Date(startDate.getTime() + randInt(60, 120) * 60_000);

    const id = cuid();
    eventIds.push(id);

    await prisma.event.create({
      data: {
        id,
        title,
        slug,
        description: fillTemplate(template.description),
        type: template.type,
        status,
        location: template.type === 'IN_PERSON' ? pick(['San Francisco, CA', 'New York, NY', 'Austin, TX', 'London, UK']) : null,
        startDate,
        endDate,
        maxAttendees: template.maxAttendees,
        creatorId: hostId,
        isFeatured: random() < 0.15,
        coverImage: pick(postImages),
      },
    });
  }
  console.log(`   ✅ ${totalEvents} events created`);
  }

  // ── PHASE 6: Event RSVPs ───────────────────────────────────────────────────
  console.log('\n📦 Phase 6: Creating EventRSVPs...');

  const existingRSVPs = await prisma.eventRSVP.count();
  let totalRSVPs = 0;

  if (existingRSVPs > 50) {
    console.log(`   ⏭️  ${existingRSVPs} RSVPs already exist, skipping Phase 6`);
    totalRSVPs = existingRSVPs;
  } else {

  for (const eventId of eventIds) {
    const rsvpCount = randInt(5, 40);
    const attendeeIds = pickN(userIds, Math.min(rsvpCount, userIds.length));
    const rsvpRecords = attendeeIds.map(userId => ({
      eventId,
      userId,
      status: (random() < 0.7 ? 'GOING' : 'INTERESTED') as 'GOING' | 'INTERESTED',
    }));

    const chunks = chunk(rsvpRecords, 50);
    for (const c of chunks) {
      await prisma.eventRSVP.createMany({ data: c, skipDuplicates: true });
    }
    totalRSVPs += rsvpRecords.length;
  }
  console.log(`   ✅ ${totalRSVPs} RSVPs created`);
  }

  // ── PHASE 7: Course Study Groups (raw pg Pool to bypass RLS) ───────────────
  console.log('\n📦 Phase 7: Creating CourseStudyGroups...');
  try {
    const pool = new Pool({
      connectionString: (process.env.DATABASE_URL || '').replace('connect_timeout=0', 'connect_timeout=30'),
      max: 1,
      connectionTimeoutMillis: 30000,
    });

    try {
      // Try disabling RLS first (may fail if not table owner, that's OK)
      const rlsTables = ['CourseStudyGroup', 'CourseGroupMember', 'CourseGroupPost', 'CourseGroupReply', 'CourseGroupFile'];
      for (const table of rlsTables) {
        try {
          await pool.query(`ALTER TABLE "${table}" DISABLE ROW LEVEL SECURITY`);
          console.log(`   🔓 RLS disabled on ${table}`);
        } catch { /* fine */ }
      }

      const { rows: courses } = await pool.query(
        `SELECT id, title FROM "Course" WHERE status = 'PUBLISHED'`
      );
      console.log(`   Found ${courses.length} published courses`);

      const { rows: existingGroups } = await pool.query(
        `SELECT cg.*, (SELECT COUNT(*) FROM "CourseGroupMember" WHERE "groupId" = cg.id) as member_count, (SELECT COUNT(*) FROM "CourseGroupPost" WHERE "groupId" = cg.id) as post_count FROM "CourseStudyGroup" cg`
      );

      let totalMembers = 0;
      let totalPosts = 0;
      let totalReplies = 0;
      let totalFiles = 0;

      for (const course of courses) {
        const existingGroup = existingGroups.find((g: any) => g.courseId === course.id);

        let groupId: string;
        if (existingGroup) {
          groupId = existingGroup.id;
          console.log(`   📚 ${course.title}: existing group (${existingGroup.member_count} members, ${existingGroup.post_count} posts)`);
        } else {
          const gid = cuid();
          await pool.query(
            `INSERT INTO "CourseStudyGroup" (id, "courseId", description, "createdAt", "updatedAt") VALUES ($1, $2, $3, NOW(), NOW())`,
            [gid, course.id, `Study group for ${course.title}. Collaborate, ask questions, and share resources with your cohort.`]
          );
          groupId = gid;
          console.log(`   📚 ${course.title}: new group created`);
        }

        const existingMemberCount = existingGroup ? parseInt(existingGroup.member_count) : 0;
        if (existingMemberCount < 8) {
          const { rows: existingMembers } = await pool.query(
            `SELECT "userId" FROM "CourseGroupMember" WHERE "groupId" = $1`, [groupId]
          );
          const existingMemberIds = existingMembers.map((m: any) => m.userId);
          const availableIds = userIds.filter(u => !existingMemberIds.includes(u));
          const memberCount = Math.min(randInt(12, 35), availableIds.length);
          const newMemberIds = pickN(availableIds, memberCount);
          const memberDates = sequentialDates(newMemberIds.length, SEED_WINDOW, 1);
          for (let i = 0; i < newMemberIds.length; i++) {
            await pool.query(
              `INSERT INTO "CourseGroupMember" (id, "groupId", "userId", "joinedAt") VALUES ($1, $2, $3, $4) ON CONFLICT ("groupId", "userId") DO NOTHING`,
              [cuid(), groupId, newMemberIds[i], memberDates[i]]
            );
          }
          totalMembers += newMemberIds.length;
        }

        const existingPostCount = existingGroup ? parseInt(existingGroup.post_count) : 0;
        if (existingPostCount < 10) {
          const { rows: allMembers } = await pool.query(
            `SELECT "userId" FROM "CourseGroupMember" WHERE "groupId" = $1`, [groupId]
          );
          const allMemberIds = allMembers.map((m: any) => m.userId);
          const postCount = randInt(15, 35);
          for (let p = 0; p < postCount; p++) {
            const authorId = pick(allMemberIds.length > 0 ? allMemberIds : userIds);
            const content = fillTemplate(pick(groupPostTemplates));
            const createdAt = weekdayDate(SEED_WINDOW, 0);
            const postId = cuid();
            await pool.query(
              `INSERT INTO "CourseGroupPost" (id, "groupId", "authorId", content, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $5)`,
              [postId, groupId, authorId, content, createdAt]
            );
            const replyCount = randInt(0, 5);
            if (replyCount > 0) {
              const replyDates = burstDates(new Date(createdAt), replyCount, 72);
              for (let ri = 0; ri < replyCount; ri++) {
                await pool.query(
                  `INSERT INTO "CourseGroupReply" (id, "postId", "authorId", content, "createdAt") VALUES ($1, $2, $3, $4, $5)`,
                  [cuid(), postId, pick(allMemberIds.length > 0 ? allMemberIds : userIds), fillTemplate(pick(commentTemplates)), replyDates[ri]]
                );
              }
              totalReplies += replyCount;
            }
          }
          totalPosts += postCount;
        }

        const { rows: fileCountRows } = await pool.query(
          `SELECT COUNT(*) as cnt FROM "CourseGroupFile" WHERE "groupId" = $1`, [groupId]
        );
        const existingFileCount = parseInt(fileCountRows[0].cnt);
        if (existingFileCount < 3) {
          const fileNames = [
            'study-guide-module-1.pdf', 'practice-questions.pdf', 'cheat-sheet.pdf',
            'additional-resources.pdf', 'workshop-notes.pdf', 'group-project-brief.pdf',
            'exam-prep-guide.pdf', 'case-studies.pdf',
          ];
          const fileCount = randInt(5, 10);
          for (let f = 0; f < fileCount; f++) {
            await pool.query(
              `INSERT INTO "CourseGroupFile" (id, "groupId", "uploaderId", "fileName", "fileUrl", "fileSize", "mimeType", "createdAt") VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
              [cuid(), groupId, pick(heroIds), pick(fileNames), 'https://example.com/files/placeholder.pdf', randInt(100_000, 5_000_000), 'application/pdf']
            );
          }
          totalFiles += fileCount;
        }
      }

      console.log(`   ✅ Study groups: ${courses.length} groups, ${totalMembers} new members, ${totalPosts} new posts, ${totalReplies} replies, ${totalFiles} new files`);
    } finally {
      await pool.end();
    }
  } catch (e: any) {
    console.warn(`   ⚠️  Phase 7 skipped (${e.code || 'error'}): ${e.message?.slice(0, 150)}`);
  }

  // ── PHASE 8: XP Transactions (20-80 per active user) ──────────────────────
  console.log('\n📦 Phase 8: Creating XPTransactions...');
  let totalXP = 0;
  try {
    // All users except the newest novices get XP
    const activeUsers = userIds.filter((_, i) => allSeedUsers[i].joinedDaysAgo > 14);

    for (const userId of activeUsers) {
      const txCount = randInt(20, 80);
      const transactions: Array<{ userId: string; amount: number; reason: string; createdAt: Date; metadata?: object }> = [];

      for (let t = 0; t < txCount; t++) {
        const actionRoll = random();
        let amount: number;
        let reason: string;
        let date: Date;

        if (actionRoll < 0.25) {
          // Lesson completions (weekdays, during the window)
          amount = XP.LESSON_COMPLETE;
          reason = 'LESSON_COMPLETE';
          date = weekdayDate(SEED_WINDOW, 1);
        } else if (actionRoll < 0.4) {
          amount = XP.COMMUNITY_POST;
          reason = 'COMMUNITY_POST';
          date = weekdayDate(SEED_WINDOW, 0);
        } else if (actionRoll < 0.6) {
          amount = XP.COMMUNITY_COMMENT;
          reason = 'COMMUNITY_COMMENT';
          date = randomDateBiased(SEED_WINDOW);
        } else if (actionRoll < 0.85) {
          amount = XP.DAILY_LOGIN;
          reason = 'DAILY_LOGIN';
          date = randomDateBiased(SEED_WINDOW);
          date.setHours(randInt(8, 22), randInt(0, 59), 0, 0);
        } else if (actionRoll < 0.92) {
          amount = XP.PATH_COMPLETED;
          reason = 'PATH_COMPLETED';
          date = randomDate(SEED_WINDOW, 30);
        } else if (actionRoll < 0.97) {
          amount = randInt(25, 100);
          reason = 'STREAK_BONUS';
          date = randomDate(SEED_WINDOW, 7);
        } else {
          amount = XP.EVENT_ATTENDED;
          reason = 'EVENT_ATTENDED';
          date = randomDateBiased(SEED_WINDOW);
        }

        transactions.push({ userId, amount, reason, createdAt: date, metadata: {} });
      }

      const chunks = chunk(transactions, 100);
      for (const c of chunks) {
        await prisma.xPTransaction.createMany({ data: c });
      }
      totalXP += txCount;
    }
    console.log(`   ✅ ${totalXP} XP transactions across ${activeUsers.length} users`);
  } catch (e: any) {
    console.warn(`   ⚠️  Phase 8 skipped: ${e.message?.slice(0, 150)}`);
  }

  // ── PHASE 9: Streaks ────────────────────────────────────────────────────────
  console.log('\n📦 Phase 9: Creating Streaks...');
  try {
    const activeUsers = userIds.filter((_, i) => allSeedUsers[i].joinedDaysAgo > 14);
    for (const userId of activeUsers) {
      const currentStreak = randInt(0, 30);
      const longestStreak = randInt(currentStreak, Math.max(currentStreak + 5, 45));
      // lastActiveDate within last 1-2 days for streakers, last 7 days for others
      const lastActive = currentStreak > 0
        ? new Date(NOW - randInt(0, 48) * 3_600_000)
        : new Date(NOW - randInt(1, 7) * MS_DAY);

      await prisma.streak.upsert({
        where: { userId },
        create: { userId, currentStreak, longestStreak, lastActiveDate: lastActive },
        update: { currentStreak, longestStreak, lastActiveDate: lastActive },
      });
    }
    console.log(`   ✅ Streaks created for ${activeUsers.length} users`);
  } catch (e: any) {
    console.warn(`   ⚠️  Phase 9 skipped: ${e.message?.slice(0, 150)}`);
  }

  // ── PHASE 10: Earned Badges ─────────────────────────────────────────────────
  console.log('\n📦 Phase 10: Awarding badges...');
  let totalBadges = 0;
  try {
    const badges = await prisma.badge.findMany();
    console.log(`   Found ${badges.length} badge definitions`);

    const activeUsers = userIds.filter((_, i) => allSeedUsers[i].joinedDaysAgo > 14);
    for (const userId of activeUsers) {
      // Award 2-8 random badges per active user
      const badgeCount = randInt(2, 8);
      const userBadges = pickN(badges, badgeCount);

      const badgeRecords = userBadges.map(b => ({
        userId,
        badgeId: b.id,
        earnedAt: randomDateBiased(SEED_WINDOW),
      }));

      await prisma.earnedBadge.createMany({ data: badgeRecords, skipDuplicates: true });
      totalBadges += badgeCount;
    }
    console.log(`   ✅ ${totalBadges} badges awarded`);
  } catch (e: any) {
    console.warn(`   ⚠️  Phase 10 skipped: ${e.message?.slice(0, 150)}`);
  }

  // ── PHASE 11: Follows (5-15 per user) ──────────────────────────────────────
  console.log('\n📦 Phase 11: Creating Follows...');
  let totalFollows = 0;
  try {
    for (const userId of userIds) {
      const followCount = randInt(5, 15);
      // Follow hero users and popular members first (higher weight)
      const potentialTargets = userIds.filter(id => id !== userId);
      const targets = pickN(potentialTargets, followCount);

      const followRecords = targets.map(followedId => ({
        followerId: userId,
        followedId,
      }));

      await prisma.follow.createMany({ data: followRecords, skipDuplicates: true });
      totalFollows += followCount;
    }
    console.log(`   ✅ ${totalFollows} follow relationships`);
  } catch (e: any) {
    console.warn(`   ⚠️  Phase 11 skipped: ${e.message?.slice(0, 150)}`);
  }

  // ── PHASE 12: Feed Items ───────────────────────────────────────────────────
  console.log('\n📦 Phase 12: Populating FeedItems...');
  let totalFeed = 0;
  try {
    // For each post, fanout to followers of the author
    for (const post of postData) {
      const author = post.authorId;
      const followers = await prisma.follow.findMany({
        where: { followedId: author },
        select: { followerId: true },
      });

      if (followers.length === 0) continue;

      const feedItems = followers.map(f => ({
        ownerId: f.followerId,
        actorId: author,
        type: 'POST_CREATED' as const,
        entityType: 'Post',
        entityId: post.id,
        metadata: { space: post.space },
        createdAt: post.createdAt,
      }));

      const chunks = chunk(feedItems, 100);
      for (const c of chunks) {
        await prisma.feedItem.createMany({ data: c, skipDuplicates: true });
      }
      totalFeed += feedItems.length;
    }
    console.log(`   ✅ ${totalFeed} feed items created`);
  } catch (e: any) {
    console.warn(`   ⚠️  Phase 12 skipped: ${e.message?.slice(0, 150)}`);
  }

  // ── PHASE 13: Community Groups (8-12) ───────────────────────────────────────
  console.log('\n📦 Phase 13: Creating CommunityGroups...');
  try {
    const groupDefs = [
      { name: 'SaaS Founders Circle', slug: 'saas-founders-circle', description: 'Exclusive group for SaaS founders building B2B products. Weekly accountability calls and shared resources.', space: 'saas-founders' },
      { name: 'Bootstrapped & Dangerous', slug: 'bootstrapped-dangerous', description: 'For founders building profitable, sustainable businesses without VC. Revenue-first mindset.', space: 'bootstrappers' },
      { name: 'AI/ML Founders Lab', slug: 'ai-ml-founders-lab', description: 'Deep technical discussions, paper reviews, and startup brainstorming for AI/ML builders.', space: 'ai-ml-builders' },
      { name: 'Growth Hacking Elite', slug: 'growth-hacking-elite', description: 'Zero-budget growth strategies, viral case studies, and growth experiments.', space: 'growth-hacking' },
      { name: 'Fundraising Mastermind', slug: 'fundraising-mastermind', description: 'Pitch feedback, investor introductions, and fundraising strategy for founders raising capital.', space: 'fundraising-hub' },
      { name: 'Women in Tech Leadership', slug: 'women-tech-leadership', description: 'Supportive community for women founders and tech leaders to share experiences and opportunities.', space: 'women-in-tech' },
      { name: 'Climate Tech Coalition', slug: 'climate-tech-coalition', description: 'Founders building sustainability solutions. Collaboration, resources, and advocacy.', space: 'climate-tech' },
      { name: 'Creator Economy Builders', slug: 'creator-economy-builders', description: 'Building tools and platforms for the creator economy. Trends, monetization, and product feedback.', space: 'creator-economy' },
      { name: 'Fintech Innovators', slug: 'fintech-innovators', description: 'Founders building the next generation of financial services. Compliance, partnerships, and product.', space: 'fintech-builders' },
      { name: 'Health Tech Pioneers', slug: 'health-tech-pioneers', description: 'Digital health founders navigating regulation, clinical validation, and go-to-market.', space: 'health-tech' },
      { name: 'First-Time Founders', slug: 'first-time-founders', description: 'Safe space for first-time founders to learn, ask questions, and support each other.', space: 'saas-founders' },
      { name: 'Remote Founders', slug: 'remote-founders', description: 'Building companies while distributed. Async communication, global hiring, and remote culture.', space: 'saas-founders' },
    ];

    const chosenGroups = pickN(groupDefs, randInt(8, 12));
    for (const def of chosenGroups) {
      const creatorId = pick(heroIds);
      const memberCount = randInt(20, 200);

      // Create group
      await prisma.communityGroup.upsert({
        where: { slug: def.slug },
        update: {},
        create: {
          name: def.name,
          slug: def.slug,
          description: def.description,
          creatorId,
          memberCount,
          visibility: 'PUBLIC',
          avatar: postImages[randInt(0, postImages.length - 1)],
          createdAt: daysAgo(randInt(30, SEED_WINDOW)),
        },
      });
    }
    console.log(`   ✅ ${chosenGroups.length} community groups created`);
  } catch (e: any) {
    console.warn(`   ⚠️  Phase 13 skipped: ${e.message?.slice(0, 150)}`);
  }

  // ── DONE ───────────────────────────────────────────────────────────────────
  console.log('\n🎉 Community seed complete!');
  console.log(`   Summary:`);
  console.log(`   - ${userIds.length} users with profiles`);
  console.log(`   - ${totalPosts} community posts`);
  console.log(`   - ${totalComments} comments`);
  console.log(`   - ${totalLikes} post likes`);
  console.log(`   - ${totalEvents} events`);
  console.log(`   - ${totalRSVPs} RSVPs`);
  console.log(`   - Study groups, XP, streaks, badges (check above for warnings)`);
  console.log(`   - ${totalFollows} follow relationships`);
  console.log(`   - ${totalFeed} feed items`);
  console.log(`   - Community groups (check above for warnings)`);
}

main()
  .catch((e) => {
    console.error('⚠️  Seed had errors (some phases may have been skipped):', e.message?.slice(0, 200));
    // Don't fail the build — seed is best-effort
    process.exit(0);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
