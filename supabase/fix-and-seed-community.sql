-- ================================================================
-- FIX RLS + SEED CommunityPost (90 posts across 9 spaces)
-- Run this ENTIRE file in Supabase SQL Editor
-- (SQL Editor runs as postgres superuser, bypassing RLS)
-- ================================================================

-- STEP 1: Fix SELECT policy so the app can READ posts
-- (CommunityPost is a public feed — it should be readable by everyone)
DROP POLICY IF EXISTS "auth_read_community_post" ON "CommunityPost";
CREATE POLICY "auth_read_community_post" ON "CommunityPost" FOR SELECT USING (true);

-- STEP 2: Clean up any existing posts for these spaces (idempotent)
DELETE FROM "CommunityPost" WHERE space IN (
  'the-fire','the-idea-vault','building-the-machine','ai-power',
  'the-acquisition-machine','scaling-and-systems','the-firing-squad',
  'mexico-operations','wealth-and-investments'
);

-- Confirm starting point
DO $$ BEGIN RAISE NOTICE 'Cleared existing posts. Starting seed...'; END $$;

-- ================================================================
-- SPACE 1: The Fire (10 posts)
-- ================================================================
INSERT INTO "CommunityPost" (id, "authorId", content, space, "imageUrls", "isPinned", "isEdited", "isDeleted", visibility, "createdAt")
VALUES ('7588c026-6441-48d2-bc9b-eba86e856f16', '598162fe-b45b-4441-9485-265c7381a9c5', '**15,000 steps before 8 AM changed everything**

For the past 60 days I haven''t missed a single morning. 15k steps, matcha, 40g protein before touching Slack. My CAC dropped 18% and I closed 3 enterprise deals. The correlation between physical discipline and sales performance is real.', 'the-fire', '{}', false, false, false, 'PUBLIC', '2026-07-14T10:00:00-06:00');

INSERT INTO "CommunityPost" (id, "authorId", content, space, "imageUrls", "isPinned", "isEdited", "isDeleted", visibility, "createdAt")
VALUES ('ffab4a91-5ee9-4c2e-9ab2-0ce1c2827918', '4c9bda80-2c6c-4ae4-9115-dec99fe5823a', '**Cold plunge accountability thread — Day 1/30**

Starting today. 3 minutes at 5°C every morning. Building a B2B SaaS is mentally brutal and I''ve noticed my decision fatigue kicking in hard after 3 PM. Read that cold exposure increases dopamine 250% for hours. If I don''t post here tomorrow, call me out publicly.', 'the-fire', '{}', false, false, false, 'PUBLIC', '2026-07-15T13:07:00-06:00');

INSERT INTO "CommunityPost" (id, "authorId", content, space, "imageUrls", "isPinned", "isEdited", "isDeleted", visibility, "createdAt")
VALUES ('1aedd7c9-96d0-49da-9d69-abfb54ad8a24', '79f0c752-2205-4674-916a-91e35b0a5f11', '**The 5 AM club is not a flex — it''s a necessity in LATAM**

Here in CDMX, if you''re not done with your deep work by 11 AM, the city swallows you whole. Traffic, trámites, family obligations. I''ve been doing 5 AM to 11 AM as my sacred building block for 14 months. Revenue is up 3.2x.', 'the-fire', '{}', false, false, false, 'PUBLIC', '2026-07-16T16:14:00-06:00');

INSERT INTO "CommunityPost" (id, "authorId", content, space, "imageUrls", "isPinned", "isEdited", "isDeleted", visibility, "createdAt")
VALUES ('fb1da4a1-a865-461e-936c-2b96cdf44db4', 'a35cd1f8-3d9e-4656-9f39-511fd886d009', '**Burnt out at $8K MRR — how I rebuilt from zero**

November last year: 4 clients, $8K MRR, and a complete mental breakdown. I was sleeping 4 hours, eating garbage, and my code was becoming spaghetti. Took December completely off. Rebuilt my entire routine: 7 hours sleep minimum, Brazilian Jiu-Jitsu 3x/week, Sunday meal prep. Came back in January and hit $14K MRR by March.', 'the-fire', '{}', false, false, false, 'PUBLIC', '2026-07-17T19:21:00-06:00');

INSERT INTO "CommunityPost" (id, "authorId", content, space, "imageUrls", "isPinned", "isEdited", "isDeleted", visibility, "createdAt")
VALUES ('e812b49a-685b-460b-b2b3-bcfa190afb4f', 'eedd3834-090c-436e-8a65-9ea1afabb543', '**Duolingo streaks and startup discipline are the same muscle**

986-day Duolingo streak. 847-day GitHub commit streak. The people who dismiss streaks as vanity metrics don''t understand compounding. Every day you show up to something small, you''re reinforcing the identity of someone who finishes what they start.', 'the-fire', '{}', false, false, false, 'PUBLIC', '2026-07-18T22:28:00-06:00');

INSERT INTO "CommunityPost" (id, "authorId", content, space, "imageUrls", "isPinned", "isEdited", "isDeleted", visibility, "createdAt")
VALUES ('9825e29a-72b4-468b-9538-a17fcc8f4332', 'a35cd1f8-3d9e-4656-9f39-511fd886d009', '**Walking meetings are underrated for technical founders**

Started doing all 1:1s as walking meetings. 45 minutes, AirPods, no screen. Three things happened: (1) my average daily steps went from 6K to 14K, (2) engineers started being more honest without a screen between us, (3) I started solving architecture problems mid-walk that I''d been stuck on for days.', 'the-fire', '{}', false, false, false, 'PUBLIC', '2026-07-19T01:35:00-06:00');

INSERT INTO "CommunityPost" (id, "authorId", content, space, "imageUrls", "isPinned", "isEdited", "isDeleted", visibility, "createdAt")
VALUES ('789c07d1-1038-4699-ac97-f317dcbd16b2', '7de693f3-7551-458f-9df6-02cb227c0217', '**Weekly fitness challenge: 100 pull-ups every day this week**

Posting this publicly so I don''t back out. 100 pull-ups every day for 7 days. Why? Because building a startup is 90% mental and 10% skill. Training your mind to do hard things on demand is the single most transferable skill.', 'the-fire', '{}', false, false, false, 'PUBLIC', '2026-07-20T04:42:00-06:00');

INSERT INTO "CommunityPost" (id, "authorId", content, space, "imageUrls", "isPinned", "isEdited", "isDeleted", visibility, "createdAt")
VALUES ('4ab79067-eedd-47c7-a0f3-2adc9536c9c7', 'eedd3834-090c-436e-8a65-9ea1afabb543', '**Sleep tracking revealed my biggest productivity leak**

Three months of Whoop data. On nights I slept < 6 hours, my next-day close rate was 4%. On 7.5+ hours: 23%. Not a typo. I was essentially working twice as hard for 1/6 the result on bad sleep days. Now I treat 10 PM as a hard cutoff.', 'the-fire', '{}', false, false, false, 'PUBLIC', '2026-07-21T07:49:00-06:00');

INSERT INTO "CommunityPost" (id, "authorId", content, space, "imageUrls", "isPinned", "isEdited", "isDeleted", visibility, "createdAt")
VALUES ('9f8d1373-5f8b-4316-a663-e0b6e38b5b88', 'b84e46a6-71d0-4e5e-9f7b-ca9ddeb41fa3', '**Fasted training and cognitive performance for devs**

Been experimenting with fasted morning workouts followed by a high-protein breakfast before coding. The difference in mental clarity during my 8 AM-noon block is night and day. Blood sugar stability = fewer bugs. Tested across 3 sprints: 42% fewer production incidents.', 'the-fire', '{}', false, false, false, 'PUBLIC', '2026-07-22T10:56:00-06:00');

INSERT INTO "CommunityPost" (id, "authorId", content, space, "imageUrls", "isPinned", "isEdited", "isDeleted", visibility, "createdAt")
VALUES ('d5f9cc17-3d81-4982-8801-9c641db44691', '184612a1-99ab-4f41-85d3-1e321a029367', '**No alcohol for 100 days — what it did to my MRR**

Documented this publicly on X. Days 1-30: nothing noticeable. Days 30-60: sleep HRV improved 22%, started waking up naturally at 5:45 without alarm. Days 60-100: shipped 4 features, closed 7 deals, $4K to $11K MRR.', 'the-fire', '{}', false, false, false, 'PUBLIC', '2026-07-23T13:03:00-06:00');

-- ================================================================
-- SPACE 2: The Idea Vault (10 posts)
-- ================================================================
INSERT INTO "CommunityPost" (id, "authorId", content, space, "imageUrls", "isPinned", "isEdited", "isDeleted", visibility, "createdAt")
VALUES ('60001a2b-3c4d-5e6f-7a8b-9c0d1e2f3a4b', 'e73457a2-6fab-4c46-a3f7-7803932004fb', '**Validated my SaaS idea with $0 spent — here''s the exact playbook**

1. Found 15 people in my target niche on X (Next.js devs building B2B tools). 2. Cold DMed each with a Notion doc link, not a pitch. 3. Got 11 responses, 7 agreed to a 15-min call. 4. Found the exact pain point (API rate limit management). Built a waitlist with 43 signups before writing a single line of code.', 'the-idea-vault', '{}', false, false, false, 'PUBLIC', '2026-07-14T08:30:00-06:00');

INSERT INTO "CommunityPost" (id, "authorId", content, space, "imageUrls", "isPinned", "isEdited", "isDeleted", visibility, "createdAt")
VALUES ('60002a2b-3c4d-5e6f-7a8b-9c0d1e2f3a4b', '943a4a0d-39df-4bce-a5a2-a7a2217e62db', '**Co-founder search: I need a technical partner who breathes Supabase**

I''m a GTM specialist — 7 years in LATAM fintech sales, $2.3M in closed deals last year. I have a validated concept for compliance automation for Mexican SMEs (interviewed 23 business owners). I need someone who can build the MVP with Next.js + Supabase. 50/50 equity split, no BS. DM me if you''ve shipped before.', 'the-idea-vault', '{}', false, false, false, 'PUBLIC', '2026-07-15T11:45:00-06:00');

INSERT INTO "CommunityPost" (id, "authorId", content, space, "imageUrls", "isPinned", "isEdited", "isDeleted", visibility, "createdAt")
VALUES ('60003a2b-3c4d-5e6f-7a8b-9c0d1e2f3a4b', 'cfe9468f-ff41-4008-be79-46af133a209a', '**The 30-second pitch framework that got me 5 angel meetings**

Pattern: "You know how [specific audience] struggles with [acute pain]? [Your solution] fixes this by [unique mechanism]. We''re already at [traction metric]." That''s it. No buzzwords. No TAM slides. I used this exact format in 12 cold emails and got a 41% response rate. The specificity is what sells.', 'the-idea-vault', '{}', false, false, false, 'PUBLIC', '2026-07-16T14:20:00-06:00');

INSERT INTO "CommunityPost" (id, "authorId", content, space, "imageUrls", "isPinned", "isEdited", "isDeleted", visibility, "createdAt")
VALUES ('60004a2b-3c4d-5e6f-7a8b-9c0d1e2f3a4b', '646b38e8-0293-4168-861c-420542d91595', '**Why I abandoned my first 3 ideas (and why that was the right call)**

Idea 1: AI meal planner — too competitive, CAC would be $40+. Idea 2: Local services marketplace — chicken-and-egg problem. Idea 3: Crypto tax tool — regulatory nightmare in Mexico. Current idea: B2B procurement automation for mid-market LATAM. Customer LTV is 22x CAC. The lesson: kill your darlings fast. Each dead idea taught me exactly what to avoid.', 'the-idea-vault', '{}', false, false, false, 'PUBLIC', '2026-07-17T09:10:00-06:00');

INSERT INTO "CommunityPost" (id, "authorId", content, space, "imageUrls", "isPinned", "isEdited", "isDeleted", visibility, "createdAt")
VALUES ('60005a2b-3c4d-5e6f-7a8b-9c0d1e2f3a4b', '7bcf906c-d4cd-4518-b842-0435a1d200b2', '**Building permissionless leverage through a niche newsletter**

Started a weekly newsletter 8 months ago on biotech x AI intersection. 1,240 subscribers today. I''ve published zero ads and made zero cold pitches. Yet I''ve had 3 founders reach out asking me to advise, and 1 offered equity. This is the power of specific knowledge compounded by media. You don''t need a massive audience — you need the RIGHT audience.', 'the-idea-vault', '{}', false, false, false, 'PUBLIC', '2026-07-18T16:55:00-06:00');

INSERT INTO "CommunityPost" (id, "authorId", content, space, "imageUrls", "isPinned", "isEdited", "isDeleted", visibility, "createdAt")
VALUES ('60006a2b-3c4d-5e6f-7a8b-9c0d1e2f3a4b', '5959be0a-c062-4220-819a-6eda4a693af3', '**Pivoted from B2C to B2B — here''s the data that forced my hand**

B2C metrics at month 6: 1,800 users, $320 MRR, 3.1% conversion. Churn was 12% monthly. Pivoted to B2B version of the same core tech: 14 customers, $8,400 MRR, < 2% churn. Same product, different buyer. B2B isn''t sexier, but the unit economics don''t lie.', 'the-idea-vault', '{}', false, false, false, 'PUBLIC', '2026-07-19T21:30:00-06:00');

INSERT INTO "CommunityPost" (id, "authorId", content, space, "imageUrls", "isPinned", "isEdited", "isDeleted", visibility, "createdAt")
VALUES ('60007a2b-3c4d-5e6f-7a8b-9c0d1e2f3a4b', 'e8397942-26b7-4285-8949-aee5afdded4f', '**The "mom test" completely changed how I validate ideas**

Instead of asking "Would you use this?" I now ask "When was the last time you searched for a solution to X?" The difference is night and day. When I pitched my idea to 10 people, 9 said "that sounds great!" When I asked the Mom Test questions, only 2 had actually tried to solve the problem. Saved me 6 months of building the wrong thing.', 'the-idea-vault', '{}', false, false, false, 'PUBLIC', '2026-07-20T07:15:00-06:00');

INSERT INTO "CommunityPost" (id, "authorId", content, space, "imageUrls", "isPinned", "isEdited", "isDeleted", visibility, "createdAt")
VALUES ('60008a2b-3c4d-5e6f-7a8b-9c0d1e2f3a4b', '184612a1-99ab-4f41-85d3-1e321a029367', '**Building an audience before building the product — case study**

Spent 60 days posting daily on X about API development pain points. Grew from 200 to 3,400 followers. When I launched my API testing tool, 78 people signed up on day 1. CAC: $0. Customer quality: off the charts. The audience IS the moat. Build distribution before you build product.', 'the-idea-vault', '{}', false, false, false, 'PUBLIC', '2026-07-21T12:40:00-06:00');

INSERT INTO "CommunityPost" (id, "authorId", content, space, "imageUrls", "isPinned", "isEdited", "isDeleted", visibility, "createdAt")
VALUES ('60009a2b-3c4d-5e6f-7a8b-9c0d1e2f3a4b', 'b84e46a6-71d0-4e5e-9f7b-ca9ddeb41fa3', '**Free idea with traction data: remote dev onboarding platform**

Problem: 73% of remote devs say their first 2 weeks are wasted on setup. Existing tools (Notion, Confluence) are too generic. Opportunity: interactive dev environment provisioning with company-specific config. I interviewed 14 CTOs — 9 said they''d pay $49/dev/month. I''m not building this (working on something else), so someone please steal it.', 'the-idea-vault', '{}', false, false, false, 'PUBLIC', '2026-07-22T18:25:00-06:00');

INSERT INTO "CommunityPost" (id, "authorId", content, space, "imageUrls", "isPinned", "isEdited", "isDeleted", visibility, "createdAt")
VALUES ('60010a2b-3c4d-5e6f-7a8b-9c0d1e2f3a4b', '598162fe-b45b-4441-9485-265c7381a9c5', '**The permissionless leverage stack: media + code + capital**

Naval was right but incomplete. The modern version: (1) Build a niche media asset — newsletter or podcast with 500 true fans. (2) Code the minimum viable automation for that niche. (3) Use revenue to deploy capital. I''ve seen 4 founders in this community execute this exact playbook. The first 500 subscribers are harder than the next 5,000 — but that''s the moat.', 'the-idea-vault', '{}', false, false, false, 'PUBLIC', '2026-07-23T05:50:00-06:00');

-- ================================================================
-- SPACE 3: Building the Machine (10 posts)
-- ================================================================
INSERT INTO "CommunityPost" (id, "authorId", content, space, "imageUrls", "isPinned", "isEdited", "isDeleted", visibility, "createdAt")
VALUES ('70001a2b-3c4d-5e6f-7a8b-9c0d1e2f3a4b', 'cfe9468f-ff41-4008-be79-46af133a209a', '**Growth experiment: Reddit as an acquisition channel — results after 30 days**

Posted 47 comments (NOT posts) in r/SaaS, r/startups, r/webdev. Each comment genuinely helpful, no links. Profile has a link to our landing page. Results: 1,240 profile views, 89 site visits, 14 signups, 3 paying customers. CAC: $0. Lesson: Reddit hates promotion but rewards expertise. Give value first.', 'building-the-machine', '{}', false, false, false, 'PUBLIC', '2026-07-14T06:20:00-06:00');

INSERT INTO "CommunityPost" (id, "authorId", content, space, "imageUrls", "isPinned", "isEdited", "isDeleted", visibility, "createdAt")
VALUES ('70002a2b-3c4d-5e6f-7a8b-9c0d1e2f3a4b', 'e73457a2-6fab-4c46-a3f7-7803932004fb', '**We A/B tested our pricing page and increased conversion 37%**

Original: $29/mo flat. Variant: $19/mo annual, $29 monthly, with "most popular" badge on annual. Result: 37% more conversions to annual, 22% more total revenue. Second test: adding a "$199 lifetime" option captured 8% of buyers and became 31% of revenue. Don''t guess — test.', 'building-the-machine', '{}', false, false, false, 'PUBLIC', '2026-07-15T13:45:00-06:00');

INSERT INTO "CommunityPost" (id, "authorId", content, space, "imageUrls", "isPinned", "isEdited", "isDeleted", visibility, "createdAt")
VALUES ('70003a2b-3c4d-5e6f-7a8b-9c0d1e2f3a4b', '646b38e8-0293-4168-861c-420542d91595', '**Guerrilla marketing: We put QR codes on coffee sleeves at 3 co-working spaces**

Printed 500 sleeves, $87 total. Each QR led to a "free Next.js boilerplate" landing page. Results: 62 scans, 21 email signups, 4 demos, 1 enterprise deal ($12K ACV). The math: $87 for $12K pipeline. The adjacent attention is real — people at co-working spaces are your exact ICP.', 'building-the-machine', '{}', false, false, false, 'PUBLIC', '2026-07-16T09:30:00-06:00');

INSERT INTO "CommunityPost" (id, "authorId", content, space, "imageUrls", "isPinned", "isEdited", "isDeleted", visibility, "createdAt")
VALUES ('70004a2b-3c4d-5e6f-7a8b-9c0d1e2f3a4b', '4c9bda80-2c6c-4ae4-9115-dec99fe5823a', '**Cold email masterclass: 47% open rate, 11% positive reply rate**

Setup: Apollo.io for leads, Instantly for sending, custom HTML signature with social proof. 3-email sequence. Email 1: Pure value (link to our free ROI calculator). Email 2: Social proof (case study with namedrop). Email 3: Direct ask. Subject lines under 40 chars, no ALL CAPS. 1,200 emails sent, 47% open, 132 positive replies, 11 deals closed.', 'building-the-machine', '{}', false, false, false, 'PUBLIC', '2026-07-17T15:10:00-06:00');

INSERT INTO "CommunityPost" (id, "authorId", content, space, "imageUrls", "isPinned", "isEdited", "isDeleted", visibility, "createdAt")
VALUES ('70005a2b-3c4d-5e6f-7a8b-9c0d1e2f3a4b', 'a35cd1f8-3d9e-4656-9f39-511fd886d009', '**How we hit $10K MRR in 5 months with zero ad spend**

Month 1-2: Built in public on X, 50 posts, grew to 800 followers. Month 3: Launched Product Hunt, #2 of the day, 200 signups. Month 4: Launched free tool (API tester) as lead magnet, 1,400 emails collected. Month 5: Launched paid tier, 34 conversions. Total ad spend: $0. Total time invested: ~400 hours. The content flywheel is real.', 'building-the-machine', '{}', false, false, false, 'PUBLIC', '2026-07-18T11:25:00-06:00');

INSERT INTO "CommunityPost" (id, "authorId", content, space, "imageUrls", "isPinned", "isEdited", "isDeleted", visibility, "createdAt")
VALUES ('70006a2b-3c4d-5e6f-7a8b-9c0d1e2f3a4b', 'eedd3834-090c-436e-8a65-9ea1afabb543', '**Built our MVP in 14 days with Cursor + v0 + Supabase**

Day 1-3: v0 generated UI screens from wireframes. Day 4-7: Cursor wrote backend routes with Supabase row-level security. Day 8-11: Stripe integration and auth flow. Day 12-14: Testing and deployment. Total cost: $40 (Cursor Pro, 1 month). The tooling available right now is absolutely insane. A solo dev can compete with funded teams.', 'building-the-machine', '{}', false, false, false, 'PUBLIC', '2026-07-19T20:05:00-06:00');

INSERT INTO "CommunityPost" (id, "authorId", content, space, "imageUrls", "isPinned", "isEdited", "isDeleted", visibility, "createdAt")
VALUES ('70007a2b-3c4d-5e6f-7a8b-9c0d1e2f3a4b', '943a4a0d-39df-4bce-a5a2-a7a2217e62db', '**The $0 marketing stack that generated our first 100 customers**

(1) Answering questions on Stack Overflow and Reddit — 40 customers. (2) Publishing case studies on Medium — 25 customers. (3) Speaking at 3 local tech meetups in CDMX — 20 customers. (4) Referral program ($10 credit) — 15 customers. Total cost: $150 for referral credits. The common thread: being genuinely helpful before selling.', 'building-the-machine', '{}', false, false, false, 'PUBLIC', '2026-07-20T04:50:00-06:00');

INSERT INTO "CommunityPost" (id, "authorId", content, space, "imageUrls", "isPinned", "isEdited", "isDeleted", visibility, "createdAt")
VALUES ('70008a2b-3c4d-5e6f-7a8b-9c0d1e2f3a4b', '5959be0a-c062-4220-819a-6eda4a693af3', '**Partnership marketing: How we 3x''d signups with zero ad budget**

Partnered with a complementary tool (API documentation generator). Cross-promoted each other in onboarding emails. Their users needed our testing tool, our users needed their docs tool. Results: 3x signups for both companies in 60 days. Best part? It cost us nothing. Find your non-competitive complement and propose a cross-promotion.', 'building-the-machine', '{}', false, false, false, 'PUBLIC', '2026-07-21T16:35:00-06:00');

INSERT INTO "CommunityPost" (id, "authorId", content, space, "imageUrls", "isPinned", "isEdited", "isDeleted", visibility, "createdAt")
VALUES ('70009a2b-3c4d-5e6f-7a8b-9c0d1e2f3a4b', '7de693f3-7551-458f-9df6-02cb227c0217', '**The "unfair advantage" framework for indie hackers**

Every founder has at least one: (1) Industry experience — you know the pain points first-hand. (2) Network — 5-10 people who will be your first customers. (3) Skill stack — you can build what others can''t. (4) Audience — even 100 followers is a distribution advantage. List yours explicitly. If you have none, build #2 first.', 'building-the-machine', '{}', false, false, false, 'PUBLIC', '2026-07-22T08:15:00-06:00');

INSERT INTO "CommunityPost" (id, "authorId", content, space, "imageUrls", "isPinned", "isEdited", "isDeleted", visibility, "createdAt")
VALUES ('70010a2b-3c4d-5e6f-7a8b-9c0d1e2f3a4b', 'b84e46a6-71d0-4e5e-9f7b-ca9ddeb41fa3', '**Sales for technical founders: Stop selling features, start selling outcomes**

Biggest mistake I see: dev-founders pitching "we use React Server Components and edge functions." Customers don''t care. What they care about: "We reduce your page load by 40%, which A/B tests show increases conversion by 12%." Always translate tech specs into business outcomes. Practice in this thread — pitch your product in one outcome-focused sentence.', 'building-the-machine', '{}', false, false, false, 'PUBLIC', '2026-07-23T19:40:00-06:00');

-- ================================================================
-- SPACE 4: AI Power (10 posts)
-- ================================================================
INSERT INTO "CommunityPost" (id, "authorId", content, space, "imageUrls", "isPinned", "isEdited", "isDeleted", visibility, "createdAt")
VALUES ('80001a2b-3c4d-5e6f-7a8b-9c0d1e2f3a4b', 'e73457a2-6fab-4c46-a3f7-7803932004fb', '**My Cursor setup that 4x''d my shipping speed**

Rules for AI: (1) Project-specific .cursorrules file — 200 lines of conventions, stack details, and patterns. (2) Always use @codebase references for context. (3) Prompt in small chunks — one component per request. (4) Review every AI-generated line — it saves 80% of typing but requires 100% of thinking. (5) Copy-paste error messages back into Cursor for instant debugging.', 'ai-power', '{}', false, false, false, 'PUBLIC', '2026-07-14T05:30:00-06:00');

INSERT INTO "CommunityPost" (id, "authorId", content, space, "imageUrls", "isPinned", "isEdited", "isDeleted", visibility, "createdAt")
VALUES ('80002a2b-3c4d-5e6f-7a8b-9c0d1e2f3a4b', 'a35cd1f8-3d9e-4656-9f39-511fd886d009', '**Running Ollama locally to keep my AI costs at exactly $0**

Setup: MacBook M3 Pro, Ollama with Llama 3.1 8B and Qwen 2.5 Coder 7B. Use cases: Llama for content generation, Qwen for code completion (via Continue.dev plugin). Latency is 2-3x slower than GPT-4o, but the cost is literally zero. For a bootstrapped startup, that''s $200-400/month saved. The open-source models are catching up FAST.', 'ai-power', '{}', false, false, false, 'PUBLIC', '2026-07-15T10:15:00-06:00');

INSERT INTO "CommunityPost" (id, "authorId", content, space, "imageUrls", "isPinned", "isEdited", "isDeleted", visibility, "createdAt")
VALUES ('80003a2b-3c4d-5e6f-7a8b-9c0d1e2f3a4b', '7de693f3-7551-458f-9df6-02cb227c0217', '**Prompt engineering is a dead end — here''s what actually works**

Hot take: spending hours crafting the "perfect prompt" is 2023 thinking. The real unlock in 2026 is (1) fine-tuning small models on your specific domain data, (2) RAG pipelines with high-quality chunking, and (3) multi-agent orchestration where each agent has a narrow, well-defined task. I replaced a 200-token mega-prompt with 4 agents of 50 tokens each — accuracy went from 67% to 94%.', 'ai-power', '{}', false, false, false, 'PUBLIC', '2026-07-16T14:50:00-06:00');

INSERT INTO "CommunityPost" (id, "authorId", content, space, "imageUrls", "isPinned", "isEdited", "isDeleted", visibility, "createdAt")
VALUES ('80004a2b-3c4d-5e6f-7a8b-9c0d1e2f3a4b', '4c9bda80-2c6c-4ae4-9115-dec99fe5823a', '**Supabase Edge Functions + embeddings = my entire AI backend for $25/month**

Architecture: (1) Content ingested via Edge Function → embedded with Supabase''s pgvector. (2) Semantic search returns top 5 chunks. (3) Those chunks + user query → Claude Haiku for final response. Latency: 800ms end-to-end. Cost: $25/month for 15,000 queries. No GPU, no dedicated AI infra. Serverless AI is here.', 'ai-power', '{}', false, false, false, 'PUBLIC', '2026-07-17T08:40:00-06:00');

INSERT INTO "CommunityPost" (id, "authorId", content, space, "imageUrls", "isPinned", "isEdited", "isDeleted", visibility, "createdAt")
VALUES ('80005a2b-3c4d-5e6f-7a8b-9c0d1e2f3a4b', 'cfe9468f-ff41-4008-be79-46af133a209a', '**Building a customer support agent that handles 73% of tickets autonomously**

Stack: RAG on our docs + product data, fine-tuned on 1,200 past support tickets, deployed as a chat widget. Metrics: 73% auto-resolution rate, average response time 4 seconds, CSAT score 4.2/5 (human agents are 4.5/5). The remaining 27% get escalated with full context. We went from 4 support agents to 1.5. Cost: $180/month in AI API calls.', 'ai-power', '{}', false, false, false, 'PUBLIC', '2026-07-18T17:25:00-06:00');

INSERT INTO "CommunityPost" (id, "authorId", content, space, "imageUrls", "isPinned", "isEdited", "isDeleted", visibility, "createdAt")
VALUES ('80006a2b-3c4d-5e6f-7a8b-9c0d1e2f3a4b', 'eedd3834-090c-436e-8a65-9ea1afabb543', '**Benchmark: 5 local models for code generation tested on real tasks**

Tested on 12 real Next.js tasks (CRUD APIs, auth, form validation). Rankings: (1) DeepSeek Coder V2 16B — 9/12 tasks correct, fastest. (2) Qwen 2.5 Coder 32B — 8/12, slightly slower. (3) CodeLlama 34B — 7/12, VRAM hungry. (4) StarCoder2 15B — 6/12. (5) Mistral 7B — 5/12. For production work, DeepSeek + Ollama on an M3 Max is genuinely competitive with GPT-4o for structured tasks.', 'ai-power', '{}', false, false, false, 'PUBLIC', '2026-07-19T12:10:00-06:00');

INSERT INTO "CommunityPost" (id, "authorId", content, space, "imageUrls", "isPinned", "isEdited", "isDeleted", visibility, "createdAt")
VALUES ('80007a2b-3c4d-5e6f-7a8b-9c0d1e2f3a4b', '646b38e8-0293-4168-861c-420542d91595', '**How I use Claude Projects to manage 3 different codebases simultaneously**

Setup: 3 Claude Projects — Mobile App (React Native), API (Next.js), Admin Dashboard (Next.js). Each project has: full repo context docs, coding conventions, DB schema reference, and 10 examples of "good code." When I context-switch, I just switch projects. No more reminding the AI what framework I''m using. 40% less context-switching overhead.', 'ai-power', '{}', false, false, false, 'PUBLIC', '2026-07-20T06:55:00-06:00');

INSERT INTO "CommunityPost" (id, "authorId", content, space, "imageUrls", "isPinned", "isEdited", "isDeleted", visibility, "createdAt")
VALUES ('80008a2b-3c4d-5e6f-7a8b-9c0d1e2f3a4b', '184612a1-99ab-4f41-85d3-1e321a029367', '**Migrated 80K lines of PHP to Next.js in 3 weeks with AI assistance**

Breakdown: Used GPT-4o + Cursor in tandem. GPT-4o analyzed PHP code and generated migration specs. Cursor executed the actual TypeScript refactoring with those specs as context. Day 1-7: Data layer + auth. Day 8-14: API routes. Day 15-21: Frontend + testing. 80,000 lines. 3 weeks. 2 devs. Pre-AI estimate was 6 months x 4 devs. The productivity multiplier is not hype.', 'ai-power', '{}', false, false, false, 'PUBLIC', '2026-07-21T21:20:00-06:00');

INSERT INTO "CommunityPost" (id, "authorId", content, space, "imageUrls", "isPinned", "isEdited", "isDeleted", visibility, "createdAt")
VALUES ('80009a2b-3c4d-5e6f-7a8b-9c0d1e2f3a4b', '943a4a0d-39df-4bce-a5a2-a7a2217e62db', '**Non-technical founder here: how AI made me dangerous enough to launch**

Zero coding experience 4 months ago. Now: I built a working MVP with v0 (UI), Cursor (logic), and Supabase (backend). Is it production-grade? No. Is it good enough to get 14 paying customers? Yes. AI didn''t make me an engineer, but it lowered the barrier from "find a technical co-founder or die" to "build a functional prototype and prove demand." That shift is everything.', 'ai-power', '{}', false, false, false, 'PUBLIC', '2026-07-22T03:45:00-06:00');

INSERT INTO "CommunityPost" (id, "authorId", content, space, "imageUrls", "isPinned", "isEdited", "isDeleted", visibility, "createdAt")
VALUES ('80010a2b-3c4d-5e6f-7a8b-9c0d1e2f3a4b', 'b84e46a6-71d0-4e5e-9f7b-ca9ddeb41fa3', '**The AI-powered PR review pipeline that caught 23 bugs before production**

Setup: GitHub Action triggers on PR → sends diff to an AI agent with our coding standards doc → agent reviews for security, performance, and style → posts inline comments. In 30 days: caught 23 bugs, 14 SQL injection risks, and 8 N+1 queries. Human reviewers now focus on architecture and intent. The AI handles syntax, patterns, and anti-patterns. 90% faster review cycle.', 'ai-power', '{}', false, false, false, 'PUBLIC', '2026-07-23T14:30:00-06:00');

-- ================================================================
-- SPACE 5: The Acquisition Machine (10 posts)
-- ================================================================
INSERT INTO "CommunityPost" (id, "authorId", content, space, "imageUrls", "isPinned", "isEdited", "isDeleted", visibility, "createdAt")
VALUES ('90001a2b-3c4d-5e6f-7a8b-9c0d1e2f3a4b', '646b38e8-0293-4168-861c-420542d91595', '**Raw CPA data: LinkedIn Ads vs Meta Ads for B2B SaaS**

LinkedIn: $87 CPA, lead quality 8/10, 22% conversion to demo. Meta: $34 CPA, lead quality 4/10, 6% conversion to demo. Winner: LinkedIn for high-ticket ($2K+/mo), Meta for freemium top-of-funnel. Total spend for this test: $1,240. If you''re selling B2B SaaS under $100/mo, don''t bother with LinkedIn — you''ll never make the unit economics work.', 'the-acquisition-machine', '{}', false, false, false, 'PUBLIC', '2026-07-14T07:00:00-06:00');

INSERT INTO "CommunityPost" (id, "authorId", content, space, "imageUrls", "isPinned", "isEdited", "isDeleted", visibility, "createdAt")
VALUES ('90002a2b-3c4d-5e6f-7a8b-9c0d1e2f3a4b', '4c9bda80-2c6c-4ae4-9115-dec99fe5823a', '**Raised prices 3x and churn actually decreased — here''s why**

Was at $49/mo with 6% monthly churn. Moved to $149/mo with a 30-day money-back guarantee. Churn dropped to 2.8%. Reason: low prices attract tire-kickers. Higher prices attract serious buyers who actually implement your product. The guarantee removes the risk. Total revenue: up 4.2x even after losing 22% of customers. Don''t compete on price.', 'the-acquisition-machine', '{}', false, false, false, 'PUBLIC', '2026-07-15T09:45:00-06:00');

INSERT INTO "CommunityPost" (id, "authorId", content, space, "imageUrls", "isPinned", "isEdited", "isDeleted", visibility, "createdAt")
VALUES ('90003a2b-3c4d-5e6f-7a8b-9c0d1e2f3a4b', 'cfe9468f-ff41-4008-be79-46af133a209a', '**The "irresistible guarantee" that doubled our close rate**

Standard: "30-day money-back guarantee." Improved: "If you don''t see a 20% improvement in [specific metric] within 90 days, we''ll refund 100% AND give you $500 for wasting your time." Results: Close rate went from 18% to 37%. Actual refund requests: 2 out of 84 customers. The bolder the guarantee, the lower the risk for the buyer — and the more you stand out.', 'the-acquisition-machine', '{}', false, false, false, 'PUBLIC', '2026-07-16T15:30:00-06:00');

INSERT INTO "CommunityPost" (id, "authorId", content, space, "imageUrls", "isPinned", "isEdited", "isDeleted", visibility, "createdAt")
VALUES ('90004a2b-3c4d-5e6f-7a8b-9c0d1e2f3a4b', 'a35cd1f8-3d9e-4656-9f39-511fd886d009', '**Cold outreach funnel: 1,500 emails → 47 demos → 14 closed deals**

Segment: CTOs at Series A companies (50-200 employees). Tool stack: Apollo (leads), Instantly (send), Calendly (book). Sequence: Email 1 (value), Email 2 (case study), Email 3 (direct CTA). Key metric: 32% of replies came after Email 2. Don''t stop at 1 touchpoint. The fortune is in the follow-up.', 'the-acquisition-machine', '{}', false, false, false, 'PUBLIC', '2026-07-17T11:15:00-06:00');

INSERT INTO "CommunityPost" (id, "authorId", content, space, "imageUrls", "isPinned", "isEdited", "isDeleted", visibility, "createdAt")
VALUES ('90005a2b-3c4d-5e6f-7a8b-9c0d1e2f3a4b', 'e8397942-26b7-4285-8949-aee5afdded4f', '**Roast my pricing page — I''ll implement the best suggestions**

Current: 3 tiers ($29/mo Starter, $79/mo Pro, $199/mo Enterprise). Conversion rate: 2.1%. I know this can be better. My hypothesis: the jump from $79 to $199 is too steep, and "Enterprise" is vague. Thinking of adding a $49 "Growth" tier and renaming Enterprise to "Team." What would you change? Brutal honesty appreciated.', 'the-acquisition-machine', '{}', false, false, false, 'PUBLIC', '2026-07-18T16:00:00-06:00');

INSERT INTO "CommunityPost" (id, "authorId", content, space, "imageUrls", "isPinned", "isEdited", "isDeleted", visibility, "createdAt")
VALUES ('90006a2b-3c4d-5e6f-7a8b-9c0d1e2f3a4b', '7de693f3-7551-458f-9df6-02cb227c0217', '**High-ticket packaging: How we went from $79 to $2,500 per client**

Step 1: Moved from tool to service — instead of selling the analytics dashboard, we sell "CRO-as-a-Service" that INCLUDES the dashboard. Step 2: Added a dedicated account manager. Step 3: Quarterly strategy calls with a senior analyst. Step 4: Priced at $2,500/mo with a 6-month minimum. Same core product, 31x revenue per client. Conclusion: sell outcomes, not software.', 'the-acquisition-machine', '{}', false, false, false, 'PUBLIC', '2026-07-19T20:45:00-06:00');

INSERT INTO "CommunityPost" (id, "authorId", content, space, "imageUrls", "isPinned", "isEdited", "isDeleted", visibility, "createdAt")
VALUES ('90007a2b-3c4d-5e6f-7a8b-9c0d1e2f3a4b', '598162fe-b45b-4441-9485-265c7381a9c5', '**LTV:CAC ratio of 14:1 — here''s exactly how we got there**

CAC breakdown: Content marketing ($12/customer), referrals ($8/customer), organic search ($5/customer). Blended CAC: $9.20. LTV: $128 (average customer stays 11 months at $49/mo, 24% annual discount). The secret isn''t cheap acquisition — it''s retention. We send hand-written onboarding notes, monthly value reports, and proactive churn detection emails. Keeping a customer is 5-7x cheaper than acquiring one.', 'the-acquisition-machine', '{}', false, false, false, 'PUBLIC', '2026-07-20T05:30:00-06:00');

INSERT INTO "CommunityPost" (id, "authorId", content, space, "imageUrls", "isPinned", "isEdited", "isDeleted", visibility, "createdAt")
VALUES ('90008a2b-3c4d-5e6f-7a8b-9c0d1e2f3a4b', '184612a1-99ab-4f41-85d3-1e321a029367', '**Zero-BS accountability: Post your CPA and channel, I''ll post mine**

Google Ads: $42 CPA (search only, long-tail keywords). Content/SEO: $6 CPA (6-month lag). Cold email: $31 CPA. Referral: $4 CPA (highest quality). Your turn. No vanity metrics, no "we''re crushing it" posts. Raw numbers only. This is how we all get better.', 'the-acquisition-machine', '{}', false, false, false, 'PUBLIC', '2026-07-21T13:10:00-06:00');

INSERT INTO "CommunityPost" (id, "authorId", content, space, "imageUrls", "isPinned", "isEdited", "isDeleted", visibility, "createdAt")
VALUES ('90009a2b-3c4d-5e6f-7a8b-9c0d1e2f3a4b', 'eedd3834-090c-436e-8a65-9ea1afabb543', '**The "value-first" webinar funnel that generates $18K/month**

Monthly live webinar on "API Performance Optimization." 45 min teaching, 15 min Q&A, 5 min soft pitch at the end. Registration: 200-300 per event. Attendees: 80-120. Conversion to paid: 8-12%. No hard sell, no countdown timers. Just genuine education. People buy from people they trust, and nothing builds trust faster than teaching for free.', 'the-acquisition-machine', '{}', false, false, false, 'PUBLIC', '2026-07-22T18:25:00-06:00');

INSERT INTO "CommunityPost" (id, "authorId", content, space, "imageUrls", "isPinned", "isEdited", "isDeleted", visibility, "createdAt")
VALUES ('90010a2b-3c4d-5e6f-7a8b-9c0d1e2f3a4b', '5959be0a-c062-4220-819a-6eda4a693af3', '**Split test results: Annual vs monthly pricing — the data is clear**

Tested on 4,200 visitors over 60 days. Monthly-only landing page: 3.1% conversion, $49 avg. Monthly + Annual (20% discount): 2.8% conversion, $67 avg (annual users prorated). ARPU difference: $18 higher with annual option. But the KILLER stat: annual subscribers have 1.9% monthly churn vs 7.2% for monthly. Annual isn''t just more revenue — it''s dramatically more retention.', 'the-acquisition-machine', '{}', false, false, false, 'PUBLIC', '2026-07-23T09:55:00-06:00');

-- ================================================================
-- SPACE 6: Scaling & Systems (10 posts)
-- ================================================================
INSERT INTO "CommunityPost" (id, "authorId", content, space, "imageUrls", "isPinned", "isEdited", "isDeleted", visibility, "createdAt")
VALUES ('a0001a2b-3c4d-5e6f-7a8b-9c0d1e2f3a4b', 'cfe9468f-ff41-4008-be79-46af133a209a', '**The 100 Tasks Framework: How I extracted myself from 80% of daily ops**

Step 1: Logged every task for 2 weeks — 127 distinct tasks. Step 2: Categorized into "CEO-only," "teachable," and "automate." Step 3: 42 tasks automated with Make/Zapier. Step 4: 38 tasks documented as SOPs and delegated. Step 5: 20 tasks remain with me. Time saved: 32 hours/week. Revenue impact: freed capacity to close 3 enterprise deals.', 'scaling-and-systems', '{}', false, false, false, 'PUBLIC', '2026-07-14T06:30:00-06:00');

INSERT INTO "CommunityPost" (id, "authorId", content, space, "imageUrls", "isPinned", "isEdited", "isDeleted", visibility, "createdAt")
VALUES ('a0002a2b-3c4d-5e6f-7a8b-9c0d1e2f3a4b', '4c9bda80-2c6c-4ae4-9115-dec99fe5823a', '**Our Make.com automation saves 120 hours/month — full blueprint**

Automations: (1) New Stripe subscription → Make creates Notion client page + Slack notification + welcome email sequence. (2) Support ticket tagged "bug" → Make creates Linear issue + notifies eng channel. (3) Churn survey → Make logs to Airtable + sends weekly digest to CEO. Total automations: 14. Monthly hours saved: 120. Setup time: ~40 hours. ROI: infinite.', 'scaling-and-systems', '{}', false, false, false, 'PUBLIC', '2026-07-15T11:20:00-06:00');

INSERT INTO "CommunityPost" (id, "authorId", content, space, "imageUrls", "isPinned", "isEdited", "isDeleted", visibility, "createdAt")
VALUES ('a0003a2b-3c4d-5e6f-7a8b-9c0d1e2f3a4b', '646b38e8-0293-4168-861c-420542d91595', '**SOPs aren''t documentation — they''re a hiring superpower**

Every role in my company has an SOP before we hire for it. Result: new hires reach full productivity in 14 days vs industry average of 90 days. Our customer support SOP is 47 pages with video walkthroughs for every edge case. Our first support hire resolved 89% of tickets in week 1 without asking a single question. Build the system, then hire for the system.', 'scaling-and-systems', '{}', false, false, false, 'PUBLIC', '2026-07-16T15:45:00-06:00');

INSERT INTO "CommunityPost" (id, "authorId", content, space, "imageUrls", "isPinned", "isEdited", "isDeleted", visibility, "createdAt")
VALUES ('a0004a2b-3c4d-5e6f-7a8b-9c0d1e2f3a4b', 'a35cd1f8-3d9e-4656-9f39-511fd886d009', '**How we landed our first B2B partnership ($50K deal) with 0 outbound**

Published a detailed case study on our blog about a problem in our industry. A VP at a complementary company found it via Google, reached out, 3 Zoom calls later we had a co-marketing deal. 6 months later it evolved into a $50K reseller partnership. The lesson: inbound works when you create genuine intellectual property. Stop writing "10 tips" articles and start publishing original research.', 'scaling-and-systems', '{}', false, false, false, 'PUBLIC', '2026-07-17T09:10:00-06:00');

INSERT INTO "CommunityPost" (id, "authorId", content, space, "imageUrls", "isPinned", "isEdited", "isDeleted", visibility, "createdAt")
VALUES ('a0005a2b-3c4d-5e6f-7a8b-9c0d1e2f3a4b', 'eedd3834-090c-436e-8a65-9ea1afabb543', '**From 0 to 15 employees: the exact delegation playbook**

First hire: VA for email/scheduling (month 3). Second: customer support (month 6). Third: junior dev (month 9). Key rule: never delegate strategy, always delegate execution. I still write the first draft of every important email and product spec — but I never touch implementation. Leadership is about clarity, not control.', 'scaling-and-systems', '{}', false, false, false, 'PUBLIC', '2026-07-18T14:30:00-06:00');

INSERT INTO "CommunityPost" (id, "authorId", content, space, "imageUrls", "isPinned", "isEdited", "isDeleted", visibility, "createdAt")
VALUES ('a0006a2b-3c4d-5e6f-7a8b-9c0d1e2f3a4b', '943a4a0d-39df-4bce-a5a2-a7a2217e62db', '**Our Zapier → Make migration saved $800/month and unlocked 3x more automations**

Zapier pricing at 40K tasks: $800/month. Make: $200/month for equivalent. But the real value: Make''s visual editor lets you build complex branching logic that Zapier can''t. We recreated all 22 Zaps as Make scenarios in 3 days. Now running 67 automations for 1/4 the cost. If you''re still on Zapier at scale, you''re leaving money on the table.', 'scaling-and-systems', '{}', false, false, false, 'PUBLIC', '2026-07-19T19:15:00-06:00');

INSERT INTO "CommunityPost" (id, "authorId", content, space, "imageUrls", "isPinned", "isEdited", "isDeleted", visibility, "createdAt")
VALUES ('a0007a2b-3c4d-5e6f-7a8b-9c0d1e2f3a4b', '7de693f3-7551-458f-9df6-02cb227c0217', '**KPI dashboard we built in 2 hours that replaced 4 weekly meetings**

Supabase + Metabase + cron job. Pulls: MRR, churn, CAC, support ticket volume, NPS, and feature adoption. Updates hourly. Slack notification on anomalies (e.g. churn spike > 2%). Replaced: Monday standup, Wednesday metrics review, Friday pipeline review, and monthly board prep. Team loves it — async data beats synchronous meetings.', 'scaling-and-systems', '{}', false, false, false, 'PUBLIC', '2026-07-20T07:40:00-06:00');

INSERT INTO "CommunityPost" (id, "authorId", content, space, "imageUrls", "isPinned", "isEdited", "isDeleted", visibility, "createdAt")
VALUES ('a0008a2b-3c4d-5e6f-7a8b-9c0d1e2f3a4b', 'b84e46a6-71d0-4e5e-9f7b-ca9ddeb41fa3', '**Notion is our entire company OS — here''s the template**

Wiki: Company vision, coding standards, deployment checklist. Projects: Timeline + owner for every initiative. Clients: CRM with deal stages + automated follow-up reminders. Hiring: Interview scorecards + onboarding checklist. Weekly: Async standup doc where everyone posts wins/blockers/priorities. 15 people, zero internal email. Notion is free for startups under 10 employees.', 'scaling-and-systems', '{}', false, false, false, 'PUBLIC', '2026-07-21T12:05:00-06:00');

INSERT INTO "CommunityPost" (id, "authorId", content, space, "imageUrls", "isPinned", "isEdited", "isDeleted", visibility, "createdAt")
VALUES ('a0009a2b-3c4d-5e6f-7a8b-9c0d1e2f3a4b', '598162fe-b45b-4441-9485-265c7381a9c5', '**How we handle client delivery at scale: the 80/20 rule applied to services**

Rule: 80% of clients have the same 20% of needs. We productized those into fixed-price packages with clear scope. The remaining 20% get custom proposals at 3x the price. Result: 80% of revenue is predictable, scoped, and delivered by junior team members following SOPs. The 20% custom work keeps things interesting and feeds product improvements.', 'scaling-and-systems', '{}', false, false, false, 'PUBLIC', '2026-07-22T16:50:00-06:00');

INSERT INTO "CommunityPost" (id, "authorId", content, space, "imageUrls", "isPinned", "isEdited", "isDeleted", visibility, "createdAt")
VALUES ('a0010a2b-3c4d-5e6f-7a8b-9c0d1e2f3a4b', 'e8397942-26b7-4285-8949-aee5afdded4f', '**Single best decision this year: hiring a fractional COO at $1,500/month**

90 days in: (1) Weekly metrics cadence established — I see numbers I never tracked before. (2) Hired 3 people with zero founder involvement. (3) Renegotiated vendor contracts, saving $2,100/month. (4) Created 14 SOPs. Net financial impact: $600/month saved + I reclaimed 25 hours/week. If you''ve hit $15K MRR and still do everything, you need an operator.', 'scaling-and-systems', '{}', false, false, false, 'PUBLIC', '2026-07-23T21:15:00-06:00');

-- ================================================================
-- SPACE 7: The Firing Squad (10 posts)
-- ================================================================
INSERT INTO "CommunityPost" (id, "authorId", content, space, "imageUrls", "isPinned", "isEdited", "isDeleted", visibility, "createdAt")
VALUES ('b0001a2b-3c4d-5e6f-7a8b-9c0d1e2f3a4b', 'e73457a2-6fab-4c46-a3f7-7803932004fb', '**Just launched my MVP — destroy it before I spend another dollar**

InvoiceAI: automated invoice processing for Mexican SMEs. Next.js + Supabase + Tesseract OCR. Landing: invoiceai.mx. Known issues: mobile is janky, onboarding takes 4 steps (should be 2), and I haven''t optimized the OCR for handwritten invoices yet. Be brutal — I need to know what kills conversions before I invest in marketing. 50 free beta spots for feedback.', 'the-firing-squad', '{}', false, false, false, 'PUBLIC', '2026-07-14T08:15:00-06:00');

INSERT INTO "CommunityPost" (id, "authorId", content, space, "imageUrls", "isPinned", "isEdited", "isDeleted", visibility, "createdAt")
VALUES ('b0002a2b-3c4d-5e6f-7a8b-9c0d1e2f3a4b', 'cfe9468f-ff41-4008-be79-46af133a209a', '**I will review your landing page and tell you exactly why people bounce**

Post your URL. I''ll give you: (1) The 5-second test — what I understand in 5 seconds. (2) The objection list — what''s stopping me from converting. (3) The fix — exact copy/design changes. I''ve done this for 47 sites in this community and the average conversion improvement after implementing feedback is 2.8x. First 10 URLs get reviewed today.', 'the-firing-squad', '{}', false, true, false, 'PUBLIC', '2026-07-15T10:30:00-06:00');

INSERT INTO "CommunityPost" (id, "authorId", content, space, "imageUrls", "isPinned", "isEdited", "isDeleted", visibility, "createdAt")
VALUES ('b0003a2b-3c4d-5e6f-7a8b-9c0d1e2f3a4b', 'b84e46a6-71d0-4e5e-9f7b-ca9ddeb41fa3', '**Beta testers needed: API monitoring tool — get lifetime free access**

Building an uptime + latency monitor specifically for REST APIs. Features: (1) Multi-region checks, (2) Custom assertion scripting, (3) Supabase webhook integration, (4) Public status page. Looking for 20 beta testers. Requirements: you run a SaaS with at least 2 active API endpoints. Compensation: lifetime free access (when we''re at $29/mo, you''re at $0).', 'the-firing-squad', '{}', false, false, false, 'PUBLIC', '2026-07-16T13:45:00-06:00');

INSERT INTO "CommunityPost" (id, "authorId", content, space, "imageUrls", "isPinned", "isEdited", "isDeleted", visibility, "createdAt")
VALUES ('b0004a2b-3c4d-5e6f-7a8b-9c0d1e2f3a4b', '943a4a0d-39df-4bce-a5a2-a7a2217e62db', '**Honest post-launch retro: what I got wrong (and right)**

Wrong: (1) Spent 3 months on features nobody asked for. (2) Launched without analytics — flew blind for 2 weeks. (3) No onboarding emails — 40% of signups never logged in twice. Right: (1) Launched with a waitlist of 200. (2) Priced higher than competitors ($79 vs $29). (3) Responded to every support email personally for 90 days. Net result: $6K MRR at month 4. But it could have been $10K without the mistakes.', 'the-firing-squad', '{}', false, false, false, 'PUBLIC', '2026-07-17T16:20:00-06:00');

INSERT INTO "CommunityPost" (id, "authorId", content, space, "imageUrls", "isPinned", "isEdited", "isDeleted", visibility, "createdAt")
VALUES ('b0005a2b-3c4d-5e6f-7a8b-9c0d1e2f3a4b', '646b38e8-0293-4168-861c-420542d91595', '**Rate my SaaS idea: 0 to 10 on viability, market, and execution**

Idea: "Certify" — automated SOC 2 and ISO 27001 compliance for startups. Market: every B2B SaaS eventually needs this. Viability: high (compliance is rule-based, perfect for automation). Competition: Vanta, Secureframe (both $6K+/year). My angle: $199/mo flat, built on Supabase, targeting LATAM and SEA startups ignored by incumbents. 0 = terrible, 10 = quit your job tomorrow.', 'the-firing-squad', '{}', false, false, false, 'PUBLIC', '2026-07-18T09:55:00-06:00');

INSERT INTO "CommunityPost" (id, "authorId", content, space, "imageUrls", "isPinned", "isEdited", "isDeleted", visibility, "createdAt")
VALUES ('b0006a2b-3c4d-5e6f-7a8b-9c0d1e2f3a4b', '4c9bda80-2c6c-4ae4-9115-dec99fe5823a', '**UX roast: Our signup flow is converting at 8% — something is broken**

Signup requires: email → password → company name → role → team size → phone number. That''s 6 steps. I know it''s too many, but our sales team insists on qualifying leads upfront. The tension: marketing wants 2-step signup, sales wants the data. I need objective eyes — what would YOU remove? Post your own signup flows for mutual review.', 'the-firing-squad', '{}', false, false, false, 'PUBLIC', '2026-07-19T14:30:00-06:00');

INSERT INTO "CommunityPost" (id, "authorId", content, space, "imageUrls", "isPinned", "isEdited", "isDeleted", visibility, "createdAt")
VALUES ('b0007a2b-3c4d-5e6f-7a8b-9c0d1e2f3a4b', 'a35cd1f8-3d9e-4656-9f39-511fd886d009', '**Conversion bottleneck: 23% click CTA but only 3% complete checkout**

Built a heatmap + session recording analysis. Finding: users spend 45+ seconds on the pricing page, click "Start Free Trial," then abandon at the credit card form. Hypothesis: asking for a card before they''ve experienced value is killing conversions. Testing a "no card required" trial this week. What''s your checkout conversion? Let''s compare benchmarks.', 'the-firing-squad', '{}', false, false, false, 'PUBLIC', '2026-07-20T18:10:00-06:00');

INSERT INTO "CommunityPost" (id, "authorId", content, space, "imageUrls", "isPinned", "isEdited", "isDeleted", visibility, "createdAt")
VALUES ('b0008a2b-3c4d-5e6f-7a8b-9c0d1e2f3a4b', '598162fe-b45b-4441-9485-265c7381a9c5', '**Launched on Product Hunt, got #4 — here''s the unvarnished truth**

Day 1: 87 upvotes, 23 comments. Day 2: ended at 312 upvotes, #4. Traffic: 2,400 site visits. Signups: 89. Paying: 4. Was it worth it? Honestly: barely. The traffic spike lasted 48 hours and 95% of signups never returned. PH is great for backlinks and social proof, terrible for sustainable growth. My advice: launch on PH, but treat it as a checkbox, not a strategy.', 'the-firing-squad', '{}', false, false, false, 'PUBLIC', '2026-07-21T07:25:00-06:00');

INSERT INTO "CommunityPost" (id, "authorId", content, space, "imageUrls", "isPinned", "isEdited", "isDeleted", visibility, "createdAt")
VALUES ('b0009a2b-3c4d-5e6f-7a8b-9c0d1e2f3a4b', 'eedd3834-090c-436e-8a65-9ea1afabb543', '**Teardown request: My dashboard UI — too complex or just right?**

Screenshot in thread. 4 charts, 6 metrics cards, 3 tables. I''m worried it''s overwhelming for new users who just want to see "is my API up or down?" The power users love the detail, but new user activation is below target. Thinking of adding a "simple mode" toggle. Has anyone solved the progressive disclosure problem elegantly? Show me your dashboards.', 'the-firing-squad', '{}', false, false, false, 'PUBLIC', '2026-07-22T11:40:00-06:00');

INSERT INTO "CommunityPost" (id, "authorId", content, space, "imageUrls", "isPinned", "isEdited", "isDeleted", visibility, "createdAt")
VALUES ('b0010a2b-3c4d-5e6f-7a8b-9c0d1e2f3a4b', '7de693f3-7551-458f-9df6-02cb227c0217', '**Unpopular opinion: MVPs should be embarrassing**

If you''re not slightly ashamed of your MVP, you launched too late. I see founders "polishing" for months before launch — that''s fear masquerading as perfectionism. My first version had broken auth and a hardcoded dashboard. It got 3 paying customers who gave me the roadmap. Launch ugly, get customers, then build what they actually want. The market is the only validator that matters.', 'the-firing-squad', '{}', false, false, false, 'PUBLIC', '2026-07-23T15:55:00-06:00');

-- ================================================================
-- SPACE 8: Mexico Operations (10 posts)
-- ================================================================
INSERT INTO "CommunityPost" (id, "authorId", content, space, "imageUrls", "isPinned", "isEdited", "isDeleted", visibility, "createdAt")
VALUES ('c0001a2b-3c4d-5e6f-7a8b-9c0d1e2f3a4b', '184612a1-99ab-4f41-85d3-1e321a029367', '**RESICO vs Persona Física for SaaS founders — my accountant''s breakdown**

RESICO: 1-2.5% effective rate on revenue, no deductions needed, quarterly filings. Persona Física: up to 35% on profit but you can deduct expenses (servers, software, home office). My case: $8K MRR SaaS. RESICO = ~$200/mo tax. Persona Física with deductions = ~$800/mo. RESICO saves me $7K/year. But there''s a catch: you can''t hold shares in other companies under RESICO. Get professional advice.', 'mexico-operations', '{}', false, false, false, 'PUBLIC', '2026-07-14T07:30:00-06:00');

INSERT INTO "CommunityPost" (id, "authorId", content, space, "imageUrls", "isPinned", "isEdited", "isDeleted", visibility, "createdAt")
VALUES ('c0002a2b-3c4d-5e6f-7a8b-9c0d1e2f3a4b', '943a4a0d-39df-4bce-a5a2-a7a2217e62db', '**Hiring first employee in Mexico — IMSS + Infonavit costs explained**

Base salary: $15,000 MXN/month. IMSS employer contribution: ~$3,200 MXN (health + disability + retirement). Infonavit: ~$750 MXN (housing fund). SAR: ~$300 MXN. Total employer cost: ~$19,250 MXN/month per employee. Also mandatory: quarterly IMSS filings (SUA), annual profit sharing (PTU = 10% of taxable profits distributed to employees), and Aguinaldo (15 days minimum). Budget 28-30% above base salary.', 'mexico-operations', '{}', false, false, false, 'PUBLIC', '2026-07-15T14:00:00-06:00');

INSERT INTO "CommunityPost" (id, "authorId", content, space, "imageUrls", "isPinned", "isEdited", "isDeleted", visibility, "createdAt")
VALUES ('c0003a2b-3c4d-5e6f-7a8b-9c0d1e2f3a4b', '79f0c752-2205-4674-916a-91e35b0a5f11', '**Service contracts in Mexico: the 6 clauses you absolutely need**

(1) Jurisdiction clause — specify which state''s courts handle disputes. (2) Payment terms in MXN, not USD, with exchange rate adjustment mechanism. (3) Intellectual property assignment — Mexican law requires explicit IP transfer language. (4) Confidentiality with penalty clause (pena convencional). (5) Termination notice period (minimum 30 days for services). (6) Force majeure adapted to local context (earthquakes, apagones). Template in thread.', 'mexico-operations', '{}', false, false, false, 'PUBLIC', '2026-07-16T10:45:00-06:00');

INSERT INTO "CommunityPost" (id, "authorId", content, space, "imageUrls", "isPinned", "isEdited", "isDeleted", visibility, "createdAt")
VALUES ('c0004a2b-3c4d-5e6f-7a8b-9c0d1e2f3a4b', 'e73457a2-6fab-4c46-a3f7-7803932004fb', '**SAT facturación electrónica for SaaS subscriptions — setup guide**

SaaS companies selling to Mexican clients MUST issue CFDIs (facturas). Setup: (1) Get your e.firma (formerly FIEL) from SAT. (2) Choose a PAC (I use Facturama, $199 MXN/month for 50 facturas). (3) Integrate via REST API — Facturama has a Node.js SDK. (4) Timbrar each factura within 24 hours of payment. (5) Store XML + PDF for 5 years. Non-compliance penalty: up to $80,000 MXN. Don''t skip this.', 'mexico-operations', '{}', false, false, false, 'PUBLIC', '2026-07-17T16:30:00-06:00');

INSERT INTO "CommunityPost" (id, "authorId", content, space, "imageUrls", "isPinned", "isEdited", "isDeleted", visibility, "createdAt")
VALUES ('c0005a2b-3c4d-5e6f-7a8b-9c0d1e2f3a4b', 'cfe9468f-ff41-4008-be79-46af133a209a', '**Mexico LLC: why I chose S.A.S. over S.A. de C.V. for my startup**

S.A.S. (Sociedad por Acciones Simplificada): (1) Can be formed entirely online via tuempresa.gob.mx. (2) No minimum capital requirement. (3) Single shareholder allowed. (4) Annual revenues capped at ~$5M MXN (can convert to S.A. later). S.A. de C.V.: requires notary ($15-25K MXN), minimum 2 shareholders, more prestige for enterprise. For an MVP-stage startup: S.A.S., 100%. Upgrade later when revenue demands it.', 'mexico-operations', '{}', false, false, false, 'PUBLIC', '2026-07-18T09:15:00-06:00');

INSERT INTO "CommunityPost" (id, "authorId", content, space, "imageUrls", "isPinned", "isEdited", "isDeleted", visibility, "createdAt")
VALUES ('c0006a2b-3c4d-5e6f-7a8b-9c0d1e2f3a4b', 'a35cd1f8-3d9e-4656-9f39-511fd886d009', '**Cross-border payments: receiving USD in Mexico without losing 3% to FX**

Strategy: Wise Business (formerly TransferWise) for receiving USD. Their FX fee is 0.4-0.6% vs 2-3% for Mexican banks. Then transfer MXN to your local account. Alternative: DolarApp for holding USD directly with a US routing number — useful if you pay contractors in USD. Stack: Stripe (collect USD) → Wise (convert) → BBVA Mexico (spend). My effective FX loss is now 0.8% total.', 'mexico-operations', '{}', false, false, false, 'PUBLIC', '2026-07-19T13:20:00-06:00');

INSERT INTO "CommunityPost" (id, "authorId", content, space, "imageUrls", "isPinned", "isEdited", "isDeleted", visibility, "createdAt")
VALUES ('c0007a2b-3c4d-5e6f-7a8b-9c0d1e2f3a4b', '646b38e8-0293-4168-861c-420542d91595', '**Contabilidad electrónica: don''t ignore this SAT requirement**

If your SaaS has any Mexican-sourced income, you must submit contabilidad electrónica monthly. This includes: (1) Catálogo de cuentas (chart of accounts). (2) Balanza de comprobación (trial balance). (3) Pólizas contables (journal entries). All submitted as XML via the SAT portal. I use Contpaq i (cloud version, $499 MXN/month). It automates 80% of this. Penalty for non-compliance: $5,000-15,000 MXN per month.', 'mexico-operations', '{}', false, false, false, 'PUBLIC', '2026-07-20T11:00:00-06:00');

INSERT INTO "CommunityPost" (id, "authorId", content, space, "imageUrls", "isPinned", "isEdited", "isDeleted", visibility, "createdAt")
VALUES ('c0008a2b-3c4d-5e6f-7a8b-9c0d1e2f3a4b', '4c9bda80-2c6c-4ae4-9115-dec99fe5823a', '**Mexican banks for startups: BBVA vs Hey Banco vs Nu — my experience**

BBVA: best for business accounts, API access via BBVA Open API (great for automating payments), but $600 MXN/month for the business plan. Hey Banco: decent digital experience, good for personal + business hybrid, $0 fees. Nu: best UX by far, great for holding MXN with daily liquidity + 15% annual yield, but NO business accounts yet. My stack: BBVA for operations, Nu for holding reserves.', 'mexico-operations', '{}', false, false, false, 'PUBLIC', '2026-07-21T15:35:00-06:00');

INSERT INTO "CommunityPost" (id, "authorId", content, space, "imageUrls", "isPinned", "isEdited", "isDeleted", visibility, "createdAt")
VALUES ('c0009a2b-3c4d-5e6f-7a8b-9c0d1e2f3a4b', 'b84e46a6-71d0-4e5e-9f7b-ca9ddeb41fa3', '**IVA on digital services: what changed in 2025 and how it affects your SaaS**

Starting 2025, 16% IVA applies to ALL digital services sold IN Mexico (even if your company is abroad). If you sell to Mexican customers, you MUST collect and remit IVA. Practical impact: your $29/mo subscription = $33.64 MXN-equivalent. Key exception: services exported from Mexico to foreign customers are IVA at 0% (tasa cero). This means Mexican SaaS companies selling globally have a massive tax advantage.', 'mexico-operations', '{}', false, false, false, 'PUBLIC', '2026-07-22T08:50:00-06:00');

INSERT INTO "CommunityPost" (id, "authorId", content, space, "imageUrls", "isPinned", "isEdited", "isDeleted", visibility, "createdAt")
VALUES ('c0010a2b-3c4d-5e6f-7a8b-9c0d1e2f3a4b', 'e8397942-26b7-4285-8949-aee5afdded4f', '**Recommended accountant in CDMX who understands tech startups**

Marco Contreras, despacho Contreras & Asociados. Works with 14 tech startups in CDMX. Services: monthly accounting ($3,500 MXN), RESICO setup ($6,000 one-time), annual declaración ($8,000), IMSS registration ($2,000). Speaks English. Understands SaaS metrics (MRR, churn, LTV). WhatsApp: +52 55 XXXX XXXX (DM for full number). Not an ad — he literally saved me $42,000 MXN in my first year by catching deductions I missed.', 'mexico-operations', '{}', false, false, false, 'PUBLIC', '2026-07-23T17:15:00-06:00');

-- ================================================================
-- SPACE 9: Wealth & Investments (10 posts)
-- ================================================================
INSERT INTO "CommunityPost" (id, "authorId", content, space, "imageUrls", "isPinned", "isEdited", "isDeleted", visibility, "createdAt")
VALUES ('d0001a2b-3c4d-5e6f-7a8b-9c0d1e2f3a4b', 'cfe9468f-ff41-4008-be79-46af133a209a', '**My portfolio allocation at $15K MRR: 40% GBM, 30% SOFIPOs, 20% crypto, 10% cash**

GBM strategy: 60% VOO (S&P 500), 25% QQQ (Nasdaq), 15% individual Mexican stocks (Walmex, Femsa). SOFIPOs: staggered across Nu (15%), Klar (14.5%), and Finsus (15.5%) — stay under the $195K MXN PROSOFIPO insurance limit per institution. Crypto: BTC/ETH only, cold wallet. Cash: 6-month runway in Nu''s cuenta a la vista. Rebalance quarterly. Not investment advice — just what I do.', 'wealth-and-investments', '{}', false, false, false, 'PUBLIC', '2026-07-14T08:00:00-06:00');

INSERT INTO "CommunityPost" (id, "authorId", content, space, "imageUrls", "isPinned", "isEdited", "isDeleted", visibility, "createdAt")
VALUES ('d0002a2b-3c4d-5e6f-7a8b-9c0d1e2f3a4b', '4c9bda80-2c6c-4ae4-9115-dec99fe5823a', '**Segubeca: the most underrated wealth-building tool for Mexican founders**

Segubeca is a tax-advantaged education savings plan. Contributions grow tax-free and withdrawals for education expenses are untaxed. Max annual contribution: ~$150K MXN. If you start when your kid is born, $10K MXN/month at 8% annual = ~$3.5M MXN by age 18. The tax savings alone are worth ~$200K MXN over the life of the plan. I set one up for each of my kids before upgrading my car.', 'wealth-and-investments', '{}', false, false, false, 'PUBLIC', '2026-07-15T12:30:00-06:00');

INSERT INTO "CommunityPost" (id, "authorId", content, space, "imageUrls", "isPinned", "isEdited", "isDeleted", visibility, "createdAt")
VALUES ('d0003a2b-3c4d-5e6f-7a8b-9c0d1e2f3a4b', '184612a1-99ab-4f41-85d3-1e321a029367', '**Peer-to-peer lending returns: 18 months of data on Prestadero and YoTePresto**

Prestadero: 38 loans, average 13.2% annual return (after defaults). YoTePresto: 24 loans, average 11.8%. Default rate across both: 4.2%. Strategy: only lend to A/B credit grades, max 2% of portfolio per loan, auto-invest tool with these filters. Monthly passive income: ~$4,200 MXN from ~$380K MXN invested. Not life-changing, but 3x better than leaving cash in a 0.1% savings account.', 'wealth-and-investments', '{}', false, false, false, 'PUBLIC', '2026-07-16T16:15:00-06:00');

INSERT INTO "CommunityPost" (id, "authorId", content, space, "imageUrls", "isPinned", "isEdited", "isDeleted", visibility, "createdAt")
VALUES ('d0004a2b-3c4d-5e6f-7a8b-9c0d1e2f3a4b', 'a35cd1f8-3d9e-4656-9f39-511fd886d009', '**Why I''m keeping 30% of net worth in SOFIPOs despite the fintech risk**

SOFIPO returns: 14-15% annual vs 4-5% in traditional bank Cetes. Yes, there''s risk — they''re not IPAB-insured. Mitigation: (1) Max $195K MXN per SOFIPO (PROSOFIPO insurance limit). (2) Spread across 4 institutions. (3) Only use SOFIPOs with 3+ year operating history. (4) Monthly interest withdrawal to reduce compounding risk. Worst case: 1 institution fails, I lose $195K of a multi-million portfolio. That''s a managed risk for 14% yield.', 'wealth-and-investments', '{}', false, false, false, 'PUBLIC', '2026-07-17T09:45:00-06:00');

INSERT INTO "CommunityPost" (id, "authorId", content, space, "imageUrls", "isPinned", "isEdited", "isDeleted", visibility, "createdAt")
VALUES ('d0005a2b-3c4d-5e6f-7a8b-9c0d1e2f3a4b', 'eedd3834-090c-436e-8a65-9ea1afabb543', '**GBM Trading account setup: step-by-step from $0 to first investment**

(1) Download GBM+ app, create account with INE + CURP + comprobante de domicilio. (2) Fund via SPEI transfer (takes 2 hours). (3) Start with GBMF2 (S&P 500 ETF, 0.09% expense ratio). (4) Set up monthly automatic investment of fixed MXN amount — dollar-cost averaging removes timing anxiety. (5) DO NOT check daily. Set a quarterly calendar reminder to review. The hardest part is doing nothing.', 'wealth-and-investments', '{}', false, false, false, 'PUBLIC', '2026-07-18T14:20:00-06:00');

INSERT INTO "CommunityPost" (id, "authorId", content, space, "imageUrls", "isPinned", "isEdited", "isDeleted", visibility, "createdAt")
VALUES ('d0006a2b-3c4d-5e6f-7a8b-9c0d1e2f3a4b', 'e8397942-26b7-4285-8949-aee5afdded4f', '**The founder''s guide to FIBRAs: real estate investing without the headaches**

Top FIBRAs on BMV: (1) FUNO 11 — industrial/commercial, 7% dividend yield. (2) FIBRA Macquarie — industrial, 8% yield. (3) FIBRA Prologis — logistics, 4% yield but higher growth. Tax advantage: FIBRA dividends are tax-free for Mexican residents (they''re technically capital reimbursements, not dividends). Strategy: 10% of portfolio in FIBRAs for cash flow + inflation hedge. Average total return: 12-15% annually.', 'wealth-and-investments', '{}', false, false, false, 'PUBLIC', '2026-07-19T10:30:00-06:00');

INSERT INTO "CommunityPost" (id, "authorId", content, space, "imageUrls", "isPinned", "isEdited", "isDeleted", visibility, "createdAt")
VALUES ('d0007a2b-3c4d-5e6f-7a8b-9c0d1e2f3a4b', '646b38e8-0293-4168-861c-420542d91595', '**Crypto in Mexico: legal framework, taxes, and best exchanges**

Legal status: crypto is NOT legal tender but IS legal to hold and trade. Tax treatment: gains taxed as "enajenación de bienes" — effectively income tax at your marginal rate (1-35%). Keep meticulous records of every trade (date, MXN value at time, gain/loss). Best exchanges: Bitso (Mexican, direct MXN deposits), Binance (global, more pairs). Reporting: declare crypto holdings in annual declaración if total assets exceed $2M MXN.', 'wealth-and-investments', '{}', false, false, false, 'PUBLIC', '2026-07-20T17:55:00-06:00');

INSERT INTO "CommunityPost" (id, "authorId", content, space, "imageUrls", "isPinned", "isEdited", "isDeleted", visibility, "createdAt")
VALUES ('d0008a2b-3c4d-5e6f-7a8b-9c0d1e2f3a4b', '598162fe-b45b-4441-9485-265c7381a9c5', '**The financial independence number for a Mexican founder: $15M MXN**

Calculated as: monthly expenses ($50K MXN comfortable lifestyle in CDMX) × 12 months × 25 (4% rule) = $15M MXN. At $15M MXN invested at 10% average return (SOFIPOs + GBM portfolio mix), that''s $1.5M MXN/year pre-tax passive income. For a LATAM SaaS founder charging in USD at $5K MRR, saving 60% post-tax, you hit this in ~5-7 years. The math is radically different when you earn in USD and spend in MXN.', 'wealth-and-investments', '{}', false, false, false, 'PUBLIC', '2026-07-21T06:40:00-06:00');

INSERT INTO "CommunityPost" (id, "authorId", content, space, "imageUrls", "isPinned", "isEdited", "isDeleted", visibility, "createdAt")
VALUES ('d0009a2b-3c4d-5e6f-7a8b-9c0d1e2f3a4b', '7de693f3-7551-458f-9df6-02cb227c0217', '**Asset protection 101 for Mexican entrepreneurs: separate personal from business**

Non-negotiable rules: (1) Separate bank accounts — personal at BBVA, business at BBVA but different account. (2) Business operates under a legal entity (S.A.S. or S.A. de C.V.), NEVER as persona física with business activity. (3) Don''t use personal assets as collateral for business debt. (4) Keep 6 months of personal expenses in an account your business can''t touch. The entity structure isn''t just for taxes — it''s a liability firewall.', 'wealth-and-investments', '{}', false, false, false, 'PUBLIC', '2026-07-22T13:15:00-06:00');

INSERT INTO "CommunityPost" (id, "authorId", content, space, "imageUrls", "isPinned", "isEdited", "isDeleted", visibility, "createdAt")
VALUES ('d0010a2b-3c4d-5e6f-7a8b-9c0d1e2f3a4b', '943a4a0d-39df-4bce-a5a2-a7a2217e62db', '**Monthly net worth tracking template — 36 months of data, sharing anonymized**

Built a simple Google Sheet: Assets (cash, investments, crypto, business equity estimate) minus Liabilities (loans, credit cards). Updated monthly for 3 years. Key learnings: (1) Months 1-12: net worth flat (reinvesting everything). (2) Months 13-24: hockey stick starts (SOFIPO compound interest kicking in). (3) Months 25-36: 45% growth rate as business equity compounds. Template link in thread — make a copy and track yours.', 'wealth-and-investments', '{}', false, false, false, 'PUBLIC', '2026-07-23T20:30:00-06:00');

-- ================================================================
-- VERIFICATION
-- ================================================================
DO $$
DECLARE
  post_count integer;
  space_record record;
BEGIN
  SELECT count(*) INTO post_count FROM "CommunityPost" WHERE space IN (
    'the-fire','the-idea-vault','building-the-machine','ai-power',
    'the-acquisition-machine','scaling-and-systems','the-firing-squad',
    'mexico-operations','wealth-and-investments'
  );
  RAISE NOTICE 'Total posts inserted: %', post_count;
  FOR space_record IN
    SELECT space, count(*) as cnt FROM "CommunityPost"
    WHERE space IN ('the-fire','the-idea-vault','building-the-machine','ai-power','the-acquisition-machine','scaling-and-systems','the-firing-squad','mexico-operations','wealth-and-investments')
    GROUP BY space ORDER BY space
  LOOP
    RAISE NOTICE '  %: % posts', space_record.space, space_record.cnt;
  END LOOP;
END $$;
