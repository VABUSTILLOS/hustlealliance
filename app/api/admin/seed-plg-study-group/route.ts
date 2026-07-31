import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

// ── Realistic mock member profiles with Unsplash face photos ──
const MOCK_MEMBERS = [
  {
    id: 'mock-plg-sarah',
    name: 'Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face&auto=format',
    username: 'sarahchen',
  },
  {
    id: 'mock-plg-marcus',
    name: 'Marcus Rivera',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&auto=format',
    username: 'marcusrivera',
  },
  {
    id: 'mock-plg-elena',
    name: 'Elena Kowalski',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face&auto=format',
    username: 'elenak',
  },
  {
    id: 'mock-plg-james',
    name: 'James Oduya',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face&auto=format',
    username: 'jamesoduya',
  },
  {
    id: 'mock-plg-priya',
    name: 'Priya Patel',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face&auto=format',
    username: 'priyapatel',
  },
  {
    id: 'mock-plg-alex',
    name: 'Alex Torrevilla',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format',
    username: 'alext',
  },
  {
    id: 'mock-plg-naomi',
    name: 'Naomi Griffiths',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop&crop=face&auto=format',
    username: 'naomig',
  },
  {
    id: 'mock-plg-david',
    name: 'David Okonkwo',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face&auto=format',
    username: 'davido',
  },
];

// ── Discussion threads (parent posts) ──
const MOCK_POSTS = [
  {
    id: 'mock-post-1',
    authorId: 'mock-plg-sarah',
    content: `I've been experimenting with PLG at my SaaS startup for about 6 months now, and I wanted to share what's actually working vs what the blog posts say.

**What's working:**
• Time-to-value under 3 minutes — we rebuilt onboarding to get users to the "aha moment" before asking for anything
• Product-qualified leads (PQLs) — tracking feature adoption as a signal is WAY more predictive than demo requests
• Free tier with usage-based upgrade triggers

**What's NOT working (yet):**
• Viral loops — hard to engineer unless your product is inherently collaborative
• Self-serve enterprise — big accounts still want a human

Would love to hear what's working for others here. Anyone else seeing similar patterns?`,
    createdAt: new Date('2026-07-28T14:30:00Z'),
  },
  {
    id: 'mock-post-2',
    authorId: 'mock-plg-marcus',
    content: `Hot take: most "PLG" advice online is just B2C growth tactics repackaged for B2B.

Real PLG in B2B requires:
1. A product that literally cannot be sold top-down (too complex to demo, need hands-on)
2. A free tier generous enough that users form habits before hitting limits
3. Organizational virality — one team adopts, and adjacent teams notice

If you need sales to close every deal, you're not PLG. You're just doing inbound marketing with a free trial.

Change my mind. 🔥`,
    createdAt: new Date('2026-07-28T16:45:00Z'),
  },
  {
    id: 'mock-post-3',
    authorId: 'mock-plg-elena',
    content: `Question for the group — how are you handling the **product-led vs sales-led handoff**?

We're seeing a pattern where PQLs convert to opportunities but then stall in the pipeline. Our theory is that the champion who signed up for the free tier doesn't have the authority to push through an enterprise purchase.

We're considering:
→ Adding a "request admin approval" flow inside the product
→ Having sales reach out with a pre-built business case PDF

Anyone solved this already?`,
    createdAt: new Date('2026-07-29T09:15:00Z'),
  },
  {
    id: 'mock-post-4',
    authorId: 'mock-plg-james',
    content: `Just wrapped up a PLG metrics review with our board. Sharing the 5 KPIs they actually care about (and the 3 we convinced them to stop tracking):

**Track these:**
✅ Monthly Active Users (MAU) — broken down by free vs paid
✅ Time-to-PQL — from signup to product-qualified lead
✅ PQL-to-Paid conversion rate (30/60/90 day cohorts)
✅ Net Revenue Retention (NRR) — expansion is everything in PLG
✅ CAC payback period — must be under 12 months

**Stop tracking:**
❌ Total signups (vanity metric — bots, students, tire-kickers)
❌ Page views (unless tied to a specific activation flow)
❌ NPS in free tier (meaningless before value delivery)

What metrics is everyone else reporting up?`,
    createdAt: new Date('2026-07-29T11:00:00Z'),
  },
  {
    id: 'mock-post-5',
    authorId: 'mock-plg-priya',
    content: `Resource drop: I compiled a comparison of PLG pricing models across 50+ SaaS companies. Sharing the key patterns:

**Most common hybrid model:** Free tier → Usage-based Pro → Flat Enterprise
**Average free-to-paid conversion:** 4.2% (but top quartile hits 12%+)
**Sweet spot for pricing page:** Show 3 tiers, anchor high

Attaching the full breakdown in the files section. Happy to answer questions about any specific company's model — I've studied Slack, Figma, Notion, Miro, and Datadog pretty deeply.`,
    createdAt: new Date('2026-07-30T08:30:00Z'),
  },
];

// ── Replies to discussion threads ──
const MOCK_REPLIES = [
  // Replies to post 1 (Sarah — what's working / not working)
  {
    id: 'mock-reply-1a',
    postId: 'mock-post-1',
    authorId: 'mock-plg-james',
    content: `Totally agree on the viral loops point. We spent 3 months building a referral program and it drove... 7 signups. 🫠

What DID work for us was making the product embeddable — when a user shares a link and the recipient sees the product in action without signing up, that's our best organic channel now.`,
    createdAt: new Date('2026-07-28T15:00:00Z'),
  },
  {
    id: 'mock-reply-1b',
    postId: 'mock-post-1',
    authorId: 'mock-plg-naomi',
    content: `Sarah — on the self-serve enterprise point, we've had some success with a "team plan" that sits between Pro and Enterprise. $299/mo, up to 20 seats, credit card only. Captures the mid-market that's too small for a sales cycle but too big for individual plans.`,
    createdAt: new Date('2026-07-28T15:45:00Z'),
  },
  {
    id: 'mock-reply-1c',
    postId: 'mock-post-1',
    authorId: 'mock-plg-sarah',
    content: `@Naomi that team plan idea is genius — stealing that! Do you gate any features behind it or is it purely seat-based?`,
    createdAt: new Date('2026-07-28T17:00:00Z'),
  },
  // Replies to post 2 (Marcus — hot take)
  {
    id: 'mock-reply-2a',
    postId: 'mock-post-2',
    authorId: 'mock-plg-alex',
    content: `Counterpoint: I think there's a spectrum. We're hybrid PLG — marketing drives signups, product converts to PQLs, but we still have AEs handling $20k+ deals. The product is the qualification engine, not the closer. And that's OK.`,
    createdAt: new Date('2026-07-28T17:30:00Z'),
  },
  {
    id: 'mock-reply-2b',
    postId: 'mock-post-2',
    authorId: 'mock-plg-david',
    content: `I actually agree with Marcus but I'd reframe it: pure PLG = the product IS the moat. If a competitor can out-sell you, you don't have PLG. If they'd need to out-build you, that's PLG.`,
    createdAt: new Date('2026-07-29T07:00:00Z'),
  },
  // Replies to post 3 (Elena — handoff)
  {
    id: 'mock-reply-3a',
    postId: 'mock-post-3',
    authorId: 'mock-plg-marcus',
    content: `We solved this by having the product generate a "team adoption report" that the champion can send to their boss. Shows active users, features used, time saved. Makes the internal sale 10x easier because the data comes from the product, not from a sales deck.`,
    createdAt: new Date('2026-07-29T10:00:00Z'),
  },
  {
    id: 'mock-reply-3b',
    postId: 'mock-post-3',
    authorId: 'mock-plg-sarah',
    content: `+1 to the adoption report idea. We also added an "invite your manager" button that triggers a tailored email with a 1-page exec summary. Conversion from PQL to opportunity jumped 34% after we launched it.`,
    createdAt: new Date('2026-07-29T12:30:00Z'),
  },
  // Replies to post 4 (James — metrics)
  {
    id: 'mock-reply-4a',
    postId: 'mock-post-4',
    authorId: 'mock-plg-elena',
    content: `Great list. I'd add one more: **activation rate by acquisition channel**. We found that organic signups activated at 3x the rate of paid — completely changed our marketing mix.`,
    createdAt: new Date('2026-07-29T14:00:00Z'),
  },
  {
    id: 'mock-reply-4b',
    postId: 'mock-post-4',
    authorId: 'mock-plg-priya',
    content: `How are you calculating CAC payback in a PLG model? Are you including free users in the denominator or only paid conversions? We've seen it calculated both ways and it makes a massive difference.`,
    createdAt: new Date('2026-07-29T16:00:00Z'),
  },
  // Replies to post 5 (Priya — resource drop)
  {
    id: 'mock-reply-5a',
    postId: 'mock-post-5',
    authorId: 'mock-plg-naomi',
    content: `This is gold — the Slack vs Figma vs Notion comparison alone is worth the read. One thing I'd note: Figma's model works because design is inherently collaborative. Not every product can pull off seat-based pricing that way.`,
    createdAt: new Date('2026-07-30T09:00:00Z'),
  },
  {
    id: 'mock-reply-5b',
    postId: 'mock-post-5',
    authorId: 'mock-plg-alex',
    content: `Priya, do you have any data on the freemium-to-paid conversion curve over time? We're debating whether to cap the free tier at 30 days or make it truly unlimited with feature gates.`,
    createdAt: new Date('2026-07-30T10:30:00Z'),
  },
];

// ── Shared Resources (files) ──
const MOCK_FILES = [
  {
    id: 'mock-file-1',
    uploaderId: 'mock-plg-priya',
    fileName: 'PLG_Pricing_Models_Benchmark_2026.pdf',
    fileUrl: '/resources/plg-pricing-benchmark-2026.pdf',
    fileSize: 2400000,
    mimeType: 'application/pdf',
    createdAt: new Date('2026-07-30T09:00:00Z'),
  },
  {
    id: 'mock-file-2',
    uploaderId: 'mock-plg-sarah',
    fileName: 'Time_to_Value_Playbook.pdf',
    fileUrl: '/resources/time-to-value-playbook.pdf',
    fileSize: 1800000,
    mimeType: 'application/pdf',
    createdAt: new Date('2026-07-29T14:00:00Z'),
  },
  {
    id: 'mock-file-3',
    uploaderId: 'mock-plg-james',
    fileName: 'PLG_KPI_Dashboard_Template.xlsx',
    fileUrl: '/resources/plg-kpi-dashboard-template.xlsx',
    fileSize: 950000,
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    createdAt: new Date('2026-07-29T16:30:00Z'),
  },
  {
    id: 'mock-file-4',
    uploaderId: 'mock-plg-marcus',
    fileName: 'Product_Led_Growth_Framework_Canvas.pdf',
    fileUrl: '/resources/plg-framework-canvas.pdf',
    fileSize: 3200000,
    mimeType: 'application/pdf',
    createdAt: new Date('2026-07-28T18:00:00Z'),
  },
  {
    id: 'mock-file-5',
    uploaderId: 'mock-plg-elena',
    fileName: 'PQL_to_Paid_Handoff_Process_Guide.pdf',
    fileUrl: '/resources/pql-handoff-guide.pdf',
    fileSize: 1500000,
    mimeType: 'application/pdf',
    createdAt: new Date('2026-07-30T08:00:00Z'),
  },
];

export async function GET() {
  try {
    const course = await prisma.course.findUnique({
      where: { slug: 'product-led-growth' },
      select: { id: true, title: true },
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Fetch real users from the database
    const realUsers = await prisma.user.findMany({
      select: { id: true, name: true, avatar: true, username: true },
      take: 8,
    });

    if (realUsers.length === 0) {
      return NextResponse.json({ error: 'No users found in database' }, { status: 400 });
    }

    // Create a lookup: mock member index → real user
    const memberMap = MOCK_MEMBERS.map((mock, i) => {
      const realUser = realUsers[i % realUsers.length];
      return {
        ...mock,
        realId: realUser.id,
        realUserId: realUser.id,
      };
    });

    const results: Record<string, number> = {};

    // Map author IDs: mock-plg-sarah → real user 0, mock-plg-marcus → real user 1, etc.
    const authorLookup = new Map<string, string>();
    memberMap.forEach((m) => authorLookup.set(m.id, m.realUserId));

    // Update real users' avatars and names with mock personas for the PLG demo
    let avatarsUpdated = 0;
    for (const m of memberMap) {
      await prisma.user.update({
        where: { id: m.realUserId },
        data: { avatar: m.avatar, name: m.name },
      });
      avatarsUpdated++;
    }
    results.avatarsUpdated = avatarsUpdated;

    // Ensure study group exists
    let group = await prisma.courseStudyGroup.findUnique({
      where: { courseId: course.id },
    });

    if (!group) {
      group = await prisma.courseStudyGroup.create({
        data: { courseId: course.id },
      });
    }

    // Upsert members with REAL user IDs
    let membersCreated = 0;
    for (const m of memberMap) {
      const existing = await prisma.courseGroupMember.findFirst({
        where: { groupId: group.id, userId: m.realId },
      });
      if (!existing) {
        await prisma.courseGroupMember.create({
          data: { groupId: group.id, userId: m.realUserId },
        });
        membersCreated++;
      }
    }
    results.members = membersCreated;

    // Upsert posts — remap authorId to real user ID
    let postsCreated = 0;
    for (const p of MOCK_POSTS) {
      const existing = await prisma.courseGroupPost.findUnique({ where: { id: p.id } });
      if (!existing) {
        const realAuthorId = authorLookup.get(p.authorId);
        if (!realAuthorId) continue;
        await prisma.courseGroupPost.create({
          data: {
            id: p.id,
            groupId: group.id,
            authorId: realAuthorId,
            content: p.content,
            createdAt: p.createdAt,
          },
        });
        postsCreated++;
      }
    }
    results.posts = postsCreated;

    // Upsert replies — remap authorId to real user ID
    let repliesCreated = 0;
    for (const r of MOCK_REPLIES) {
      const existing = await prisma.courseGroupReply.findUnique({ where: { id: r.id } });
      if (!existing) {
        const realAuthorId = authorLookup.get(r.authorId);
        if (!realAuthorId) continue;
        await prisma.courseGroupReply.create({
          data: {
            id: r.id,
            postId: r.postId,
            authorId: realAuthorId,
            content: r.content,
            createdAt: r.createdAt,
          },
        });
        repliesCreated++;
      }
    }
    results.replies = repliesCreated;

    // Upsert files — remap uploaderId to real user ID
    let filesCreated = 0;
    for (const f of MOCK_FILES) {
      const existing = await prisma.courseGroupFile.findUnique({ where: { id: f.id } });
      if (!existing) {
        const realUploaderId = authorLookup.get(f.uploaderId);
        if (!realUploaderId) continue;
        await prisma.courseGroupFile.create({
          data: {
            id: f.id,
            groupId: group.id,
            uploaderId: realUploaderId,
            fileName: f.fileName,
            fileUrl: f.fileUrl,
            fileSize: f.fileSize,
            mimeType: f.mimeType,
            createdAt: f.createdAt,
          },
        });
        filesCreated++;
      }
    }
    results.files = filesCreated;

    // Update the study group description
    await prisma.courseStudyGroup.update({
      where: { id: group.id },
      data: { description: 'Discuss Product-Led Growth strategies, share frameworks, and learn from founders scaling with a product-first approach.' },
    });

    return NextResponse.json({
      success: true,
      course: course.title,
      groupId: group.id,
      realUsersUsed: realUsers.length,
      ...results,
      total: membersCreated + postsCreated + repliesCreated + filesCreated,
    });
  } catch (error: any) {
    console.error('[SeedPLG] Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Seed failed' },
      { status: 500 }
    );
  }
}
