import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

const MOCK_MEMBERS = [
  { id: 'mock-sarah', name: 'Sarah Chen', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face&auto=format', username: 'sarahchen' },
  { id: 'mock-marcus', name: 'Marcus Rivera', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&auto=format', username: 'marcusrivera' },
  { id: 'mock-elena', name: 'Elena Kowalski', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face&auto=format', username: 'elenak' },
  { id: 'mock-james', name: 'James Oduya', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face&auto=format', username: 'jamesoduya' },
  { id: 'mock-priya', name: 'Priya Patel', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face&auto=format', username: 'priyapatel' },
  { id: 'mock-alex', name: 'Alex Torrevilla', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format', username: 'alext' },
  { id: 'mock-naomi', name: 'Naomi Griffiths', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop&crop=face&auto=format', username: 'naomig' },
  { id: 'mock-david', name: 'David Okonkwo', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face&auto=format', username: 'davido' },
];

interface CourseSeed {
  description: string;
  posts: { id: string; authorId: string; content: string }[];
  replies: { id: string; postId: string; authorId: string; content: string }[];
  files: { id: string; uploaderId: string; fileName: string; fileUrl: string; fileSize: number; mimeType: string }[];
}

const COURSE_SEEDS: Record<string, CourseSeed> = {
  'fundraising-101': {
    description: 'Discuss pitch strategies, investor outreach, term sheet negotiation, and fundraising war stories from fellow founders.',
    posts: [
      { id: 'seed-fundraising-1', authorId: 'mock-marcus',
        content: `Just closed our seed round after 47 investor meetings. Sharing what actually moved the needle:\n\n**Pitch deck changes that made a difference:**\n• Led with retention metrics on slide 2 (not TAM)\n• Replaced "we believe" with "we measured" everywhere\n• Added a competitive landscape slide that showed WHY we win, not just who competitors are\n\n**The thing nobody tells you:** investor updates before you've even pitched are powerful. We sent a monthly "what we shipped" email to 20 target investors for 3 months before asking for a meeting. 14 of them took the first call.\n\nWhat's working for everyone else right now? Market feels different than Q1.` },
      { id: 'seed-fundraising-2', authorId: 'mock-elena',
        content: `Question for those who've been through it: **How do you decide between a priced round and a SAFE?**\n\nWe have two term sheets — one lead wants a priced Series A, another is pushing for a post-money SAFE with a higher cap.\n\nMy read:\n→ SAFE = faster, less legal fees, no board yet\n→ Priced = governance structure, more credibility with later investors, but 3-4 month process\n\nWe're at $35K MRR growing 15% MoM. Would love to hear how others made this call.` },
      { id: 'seed-fundraising-3', authorId: 'mock-priya',
        content: `Resource dump from our fundraise: I tracked every single investor interaction in a Notion database. Sharing the stats:\n\n• 312 initial emails sent (warm intros only)\n• 89 first meetings\n• 34 second meetings\n• 7 partner meetings\n• 3 term sheets\n• 1 closed\n\n**The conversion funnel is brutal.** If you're starting a raise, the best advice I can give is: build a pipeline 3x bigger than you think you need, and keep filling top-of-funnel even after you get a term sheet. Deals fall through.\n\nHappy to share the tracking template if anyone wants it.` },
    ],
    replies: [
      { id: 'seed-fundraising-r1', postId: 'seed-fundraising-1', authorId: 'mock-sarah', content: `That monthly update strategy is genius. We did something similar but with a private Twitter list — way less work to maintain. 8 of our 12 investor meetings came from people who were already following along.` },
      { id: 'seed-fundraising-r2', postId: 'seed-fundraising-1', authorId: 'mock-david', content: `+1 on leading with retention. Our lead investor told us point-blank: "I can fix go-to-market, I can't fix churn." That one slide got us the term sheet.` },
      { id: 'seed-fundraising-r3', postId: 'seed-fundraising-2', authorId: 'mock-marcus', content: `At $35K MRR with 15% MoM you're in priced round territory. But — if you can close the SAFE in 2 weeks vs 4 months for a priced round, the time saved might be worth more than the governance headache later. We went SAFE at $28K and don't regret it.` },
      { id: 'seed-fundraising-r4', postId: 'seed-fundraising-2', authorId: 'mock-alex', content: `Counterpoint: a priced round forces you to build the governance muscle early. We did a priced seed and having a board with actual fiduciary duties made us WAY more disciplined.` },
      { id: 'seed-fundraising-r5', postId: 'seed-fundraising-3', authorId: 'mock-naomi', content: `Would LOVE that tracking template. We're starting outreach next week and this funnel data is incredibly helpful for setting expectations.` },
      { id: 'seed-fundraising-r6', postId: 'seed-fundraising-3', authorId: 'mock-james', content: `312 to 1 is actually a solid ratio. We were closer to 500 to 1 on our first raise. The key is not taking rejections personally — most investors are just pattern-matching and you might not fit their thesis.` },
    ],
    files: [
      { id: 'seed-fundraising-f1', uploaderId: 'mock-marcus', fileName: 'Seed_Pitch_Deck_Template_2026.pptx', fileUrl: '/resources/seed-pitch-deck-template.pptx', fileSize: 4200000, mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' },
      { id: 'seed-fundraising-f2', uploaderId: 'mock-priya', fileName: 'Investor_CRM_Tracking_Template.xlsx', fileUrl: '/resources/investor-crm-template.xlsx', fileSize: 680000, mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
      { id: 'seed-fundraising-f3', uploaderId: 'mock-elena', fileName: 'Term_Sheet_Comparison_Guide.pdf', fileUrl: '/resources/term-sheet-comparison.pdf', fileSize: 1800000, mimeType: 'application/pdf' },
    ],
  },
  'growth-marketing': {
    description: 'Share growth experiments, marketing playbooks, and zero-budget acquisition strategies. What\'s working right now?',
    posts: [
      { id: 'seed-gmkt-1', authorId: 'mock-naomi',
        content: `We hit $10K MRR with $0 marketing spend. Here's the exact playbook:\n\n**Month 1-2: Content-led SEO**\n• Published 8 long-form guides targeting bottom-of-funnel keywords\n• NOT generic "what is X" — specific "how to do X with Y tool"\n• Each post had a free template/calculator as a lead magnet\n\n**Month 3-4: Community distribution**\n• Joined 12 Slack communities + 6 subreddits\n• Answered questions genuinely for 2 weeks before ever mentioning our product\n• Built a "helpful answers" doc so we could answer fast\n\n**Month 5-6: Cold email with value**\n• Scraped companies using competitor tools (BuiltWith)\n• Sent personalized audits of their current setup\n• 18% reply rate, 6% conversion\n\nAnyone else running lean marketing — what channels are outperforming for you?` },
      { id: 'seed-gmkt-2', authorId: 'mock-alex',
        content: `Hot take: most startup marketing advice is optimized for $50M+ companies. If you're under $1M ARR, here's what actually matters:\n\n1. **One channel, done well.** Not 5 channels done poorly. Pick the one where your customers already hang out.\n2. **Talk to 10 customers a week.** Not surveys. Real conversations. The marketing insights from those calls beat any playbook.\n3. **Your product is your best marketing.** If your activation rate is under 30%, fix the product before pouring money into acquisition.\n\nEverything else — attribution models, brand guidelines, multi-touch campaigns — that's for later.` },
      { id: 'seed-gmkt-3', authorId: 'mock-sarah',
        content: `We just ran a 30-day LinkedIn content experiment and the results surprised me:\n\n**What we tried:** Daily posts from the founder's personal account. Mix of stories, lessons learned, and contrarian takes.\n\n**Results:**\n→ 22K → 89K profile views (30 days)\n→ 312 → 4,800 followers\n→ 47 demo requests directly from LinkedIn\n→ 11 closed deals ($82K total)\n\n**The winning format:** "Here's something I believed 2 years ago that I now know is wrong" — these consistently got 50K+ impressions.\n\nFounders sleeping on LinkedIn are leaving money on the table.` },
    ],
    replies: [
      { id: 'seed-gmkt-r1', postId: 'seed-gmkt-1', authorId: 'mock-priya', content: `The BuiltWith scraping idea is clever. Any issues with GDPR or CAN-SPAM? We've been hesitant to do cold outreach for that reason.` },
      { id: 'seed-gmkt-r2', postId: 'seed-gmkt-1', authorId: 'mock-david', content: `Agree on the "not generic" point. Our top-performing post ranks #1 for "startup cap table template" and drives 2,000 visitors/month. Specific > comprehensive.` },
      { id: 'seed-gmkt-r3', postId: 'seed-gmkt-2', authorId: 'mock-james', content: `"One channel done well" should be framed on every marketer's wall. We spent 6 months mediocre at 4 channels. 6 months excellent at 1 channel got us to $25K MRR.` },
      { id: 'seed-gmkt-r4', postId: 'seed-gmkt-2', authorId: 'mock-elena', content: `The "talk to 10 customers a week" point is underrated. We started doing this and discovered our best marketing angle wasn't even on our website. Completely changed our positioning.` },
      { id: 'seed-gmkt-r5', postId: 'seed-gmkt-3', authorId: 'mock-marcus', content: `LinkedIn is wild right now. The algorithm is favoring personal stories over corporate content. We're seeing 10x the engagement compared to company page posts.` },
      { id: 'seed-gmkt-r6', postId: 'seed-gmkt-3', authorId: 'mock-naomi', content: `Do you script the founder's posts or do they write them naturally? We tried founder-led content but the founder "didn't have time" after week 2.` },
    ],
    files: [
      { id: 'seed-gmkt-f1', uploaderId: 'mock-naomi', fileName: 'Zero_Budget_Marketing_Playbook.pdf', fileUrl: '/resources/zero-budget-marketing-playbook.pdf', fileSize: 3200000, mimeType: 'application/pdf' },
      { id: 'seed-gmkt-f2', uploaderId: 'mock-alex', fileName: 'Content_Calendar_Template.xlsx', fileUrl: '/resources/content-calendar-template.xlsx', fileSize: 450000, mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
      { id: 'seed-gmkt-f3', uploaderId: 'mock-sarah', fileName: 'LinkedIn_Growth_Experiment_Results.pdf', fileUrl: '/resources/linkedin-growth-experiment.pdf', fileSize: 2100000, mimeType: 'application/pdf' },
    ],
  },
  'leadership-foundations': {
    description: 'Build your leadership toolkit — hiring, culture, feedback, and scaling yourself as your startup grows.',
    posts: [
      { id: 'seed-leadf-1', authorId: 'mock-david',
        content: `Hardest lesson from going 2 → 20 people: **what got you here won't get you there.**\n\nAs a founder, I was great at shipping. As a manager, I had to unlearn shipping and learn enabling.\n\nThree things that saved me:\n1. Weekly 1:1s with a shared doc — async prep, sync discussion\n2. "What would you do?" instead of "Here's what to do" — builds decision-making muscle\n3. Public praise, private feedback — always\n\nThe transition from maker to manager is brutal. Anyone else in the messy middle?` },
      { id: 'seed-leadf-2', authorId: 'mock-priya',
        content: `We just ran our first performance review cycle and I have thoughts:\n\n**What went well:**\n• Self-reviews before manager reviews — surfaced gaps I didn't know about\n• Peer feedback (anonymous) — patterns emerged that one-on-ones missed\n• Forward-looking development plans — not just "here's how you did" but "here's where you're going"\n\n**What I'd change:**\n• Frequency — annual is too slow for startups. Quarterly check-ins minimum\n• Rating scales — numbers create anxiety. Switched to "exceeding / meeting / developing"\n\nHow is everyone else handling reviews in fast-moving teams?` },
      { id: 'seed-leadf-3', authorId: 'mock-james',
        content: `The best leadership advice I ever got: **"Your team's performance is a mirror of your clarity."**\n\nIf people aren't performing, ask:\n→ Did I communicate expectations clearly?\n→ Do they have the context to make good decisions?\n→ Are they blocked by something I should remove?\n\n90% of performance issues I've seen were actually leadership issues — unclear priorities, missing context, or the wrong person in the wrong seat.\n\nTough pill to swallow but it changed how I lead.` },
    ],
    replies: [
      { id: 'seed-leadf-r1', postId: 'seed-leadf-1', authorId: 'mock-sarah', content: `"What would you do?" is the single most powerful management phrase. I started using it with my direct reports and within a month they were bringing solutions, not problems.` },
      { id: 'seed-leadf-r2', postId: 'seed-leadf-1', authorId: 'mock-alex', content: `The maker-to-manager transition is the hardest part of scaling. I still struggle with not jumping in and doing it myself when I know I could do it faster.` },
      { id: 'seed-leadf-r3', postId: 'seed-leadf-2', authorId: 'mock-naomi', content: `Quarterly check-ins are the sweet spot. We do a lightweight async review every quarter and a deeper in-person review annually. Keeps feedback flowing without the overhead.` },
      { id: 'seed-leadf-r4', postId: 'seed-leadf-2', authorId: 'mock-elena', content: `We dropped numerical ratings entirely. Now it's a structured conversation: What's working? What's not? What do you need? What's next? Way more productive.` },
      { id: 'seed-leadf-r5', postId: 'seed-leadf-3', authorId: 'mock-marcus', content: `This hit hard. I spent 3 months frustrated with a team member before realizing I'd never clearly defined what success looked like in their role. My fault, not theirs.` },
      { id: 'seed-leadf-r6', postId: 'seed-leadf-3', authorId: 'mock-priya', content: `Adding to this: "the wrong person in the right seat" is fixable. "The right person in the wrong seat" is a tragedy. Job crafting is underrated.` },
    ],
    files: [
      { id: 'seed-leadf-f1', uploaderId: 'mock-david', fileName: 'First_90_Days_Leadership_Plan.pdf', fileUrl: '/resources/first-90-days-leadership-plan.pdf', fileSize: 1500000, mimeType: 'application/pdf' },
      { id: 'seed-leadf-f2', uploaderId: 'mock-priya', fileName: 'Performance_Review_Template.docx', fileUrl: '/resources/performance-review-template.docx', fileSize: 320000, mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
      { id: 'seed-leadf-f3', uploaderId: 'mock-james', fileName: 'One_on_One_Meeting_Guide.pdf', fileUrl: '/resources/one-on-one-meeting-guide.pdf', fileSize: 980000, mimeType: 'application/pdf' },
    ],
  },
  'sales-for-founders': {
    description: 'Master founder-led sales — from cold outreach to closing. Share scripts, objection handlers, and deal strategies.',
    posts: [
      { id: 'seed-salef-1', authorId: 'mock-alex',
        content: `Went from "I'm not a salesperson" to closing $120K in founder-led deals last quarter. Here's what changed:\n\n**Mindset shift:** You're not selling — you're diagnosing. If your product genuinely solves a problem, not telling people about it is almost unethical.\n\n**The framework that worked for me:**\n1. Discovery call: 80% listening, 20% talking. "Tell me about your current process"\n2. Demo: Show the before/after, not every feature. "Here's what your team will stop doing"\n3. Close: No tricks. "Based on what you've told me, I think this will save you 15 hours/week. Want to try it for 30 days?"\n\nFounders who hate sales — what's holding you back?` },
      { id: 'seed-salef-2', authorId: 'mock-sarah',
        content: `Objection handling cheat sheet I wish I had 2 years ago:\n\n**"It's too expensive"** → "Compared to what? What's the cost of not solving this?"\n**"I need to think about it"** → "Totally fair. What specific information would help you decide?"\n**"We use a competitor"** → "What do you love about them? What do you wish they did better?"\n**"Not a priority right now"** → "When would be a better time to revisit? I'll set a reminder."\n\nThe key: objections aren't rejections. They're requests for more information.` },
      { id: 'seed-salef-3', authorId: 'mock-elena',
        content: `We just ran a cold email experiment that changed everything:\n\n**Old approach:** "Hi {name}, we help {industry} companies {benefit}..." → 2% reply rate\n**New approach:** "Hi {name}, I noticed {specific observation about their business}. We helped {similar company} solve {specific problem}. Worth a 15-min call?" → 11% reply rate\n\n**Why it works:** Specificity signals you've done homework. Name-dropping similar companies builds instant credibility. And 15 minutes is a tiny ask.\n\nTotal outreach: 200 emails → 22 replies → 14 calls → 4 pilots → 2 closed ($34K).\n\nAnyone else cracked the cold email code?` },
    ],
    replies: [
      { id: 'seed-salef-r1', postId: 'seed-salef-1', authorId: 'mock-marcus', content: `"Diagnosing, not selling" is the reframe every technical founder needs. Once I started treating sales calls like debugging sessions, I actually started enjoying them.` },
      { id: 'seed-salef-r2', postId: 'seed-salef-1', authorId: 'mock-naomi', content: `The 80/20 listening rule is real. My first 10 sales calls I talked for 45 of the 60 minutes. Didn't close a single one.` },
      { id: 'seed-salef-r3', postId: 'seed-salef-2', authorId: 'mock-james', content: `Bookmarking this. The "too expensive" response is perfect — it reframes from cost to cost-of-inaction without being defensive.` },
      { id: 'seed-salef-r4', postId: 'seed-salef-2', authorId: 'mock-david', content: `Adding one: "Send me more info" → "I'd rather walk you through it — what specifically caught your interest?" Emailed PDFs have a 0% close rate in my experience.` },
      { id: 'seed-salef-r5', postId: 'seed-salef-3', authorId: 'mock-priya', content: `11% reply rate is incredible. Are you personalizing each one manually or using some automation? At 200 emails, manual seems doable. At 2,000, not so much.` },
      { id: 'seed-salef-r6', postId: 'seed-salef-3', authorId: 'mock-alex', content: `The "specific observation" is the secret sauce. I spend 5 minutes per lead researching before writing. Takes longer but the conversion makes up for it.` },
    ],
    files: [
      { id: 'seed-salef-f1', uploaderId: 'mock-alex', fileName: 'Founder_Led_Sales_Playbook.pdf', fileUrl: '/resources/founder-led-sales-playbook.pdf', fileSize: 2800000, mimeType: 'application/pdf' },
      { id: 'seed-salef-f2', uploaderId: 'mock-sarah', fileName: 'Cold_Email_Templates_That_Convert.docx', fileUrl: '/resources/cold-email-templates.docx', fileSize: 520000, mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
      { id: 'seed-salef-f3', uploaderId: 'mock-elena', fileName: 'Objection_Handling_Cheat_Sheet.pdf', fileUrl: '/resources/objection-handling-cheat-sheet.pdf', fileSize: 740000, mimeType: 'application/pdf' },
    ],
  },
  'content-marketing-mastery': {
    description: 'Learn to create content that attracts, converts, and retains customers. Share your best-performing pieces and strategies.',
    posts: [
      { id: 'seed-cmm-1', authorId: 'mock-priya',
        content: `Our blog went from 2K to 50K monthly visitors in 8 months. Here's the exact content strategy:\n\n**The "Product-Led Content" framework:**\n1. Every article teaches something valuable WITHOUT our product\n2. At the end, we show how our product makes it 10x easier\n3. CTA is always a template/calculator, never "book a demo"\n\n**Our top 3 posts (by conversions):**\n→ "Startup Runway Calculator" — 8K visits/mo, 22% → signup\n→ "Cap Table Template for Founders" — 6K visits/mo, 18% → signup\n→ "How to Read a Term Sheet" — 12K visits/mo, 8% → signup\n\nCommon thread: practical tools, not thought leadership. Build the thing, then write about it.` },
      { id: 'seed-cmm-2', authorId: 'mock-james',
        content: `Unpopular opinion: most startups should NOT start a podcast or YouTube channel.\n\nContent marketing isn't about production value. It's about answering the questions your customers are already typing into Google.\n\n**My hierarchy of content ROI:**\n1. SEO-optimized blog posts (evergreen, compound growth)\n2. Email newsletter (owned audience, highest conversion)\n3. LinkedIn/Twitter threads (distribution, not destination)\n4. Guest posts on established sites (borrowed authority)\n...\n9. Podcast (huge time investment, slow growth)\n10. YouTube (even bigger time investment)\n\nStart at the top. Once you have traction, expand down.` },
      { id: 'seed-cmm-3', authorId: 'mock-naomi',
        content: `We repurposed ONE long-form guide into 12 different formats last month. Results:\n\n**Original:** 4,000-word guide on "B2B SaaS Pricing Models"\n\n**Repurposed into:**\n→ Twitter thread → 86K impressions\n→ LinkedIn carousel → 42K impressions\n→ 3 short-form videos (TikTok/Reels) → 120K combined views\n→ Newsletter deep-dive → 34% open rate, 12% CTR\n→ Guest post excerpt → published on SaaStr\n→ Infographic → pinned on Pinterest, 2K saves\n\n**Total time:** 8 hours to repurpose vs 40 hours to create from scratch.\n\nRepurposing isn't lazy — it's smart distribution.` },
    ],
    replies: [
      { id: 'seed-cmm-r1', postId: 'seed-cmm-1', authorId: 'mock-sarah', content: `The "practical tools" insight is spot on. Our ROI calculator drives 40% of all signups. Build something people can use immediately.` },
      { id: 'seed-cmm-r2', postId: 'seed-cmm-1', authorId: 'mock-alex', content: `How are you handling content updates? We have 200+ posts and keeping them fresh is becoming a full-time job.` },
      { id: 'seed-cmm-r3', postId: 'seed-cmm-2', authorId: 'mock-elena', content: `I feel personally attacked (we just launched a podcast 😅). But you're right — it's a grind. Our blog posts convert 5x better.` },
      { id: 'seed-cmm-r4', postId: 'seed-cmm-2', authorId: 'mock-david', content: `Newsletters are the most underrated channel. We have 8K subs and an email drives more demo requests than a month of LinkedIn posts.` },
      { id: 'seed-cmm-r5', postId: 'seed-cmm-3', authorId: 'mock-marcus', content: `Repurposing is the ultimate growth hack. We have a "content atomization" process where every long-form piece spawns 8-10 derivative pieces.` },
      { id: 'seed-cmm-r6', postId: 'seed-cmm-3', authorId: 'mock-priya', content: `The Twitter thread format consistently outperforms everything else for us. Short, punchy, and the thread structure keeps people reading.` },
    ],
    files: [
      { id: 'seed-cmm-f1', uploaderId: 'mock-priya', fileName: 'Content_Strategy_Framework_Canvas.pdf', fileUrl: '/resources/content-strategy-framework-canvas.pdf', fileSize: 1900000, mimeType: 'application/pdf' },
      { id: 'seed-cmm-f2', uploaderId: 'mock-james', fileName: 'SEO_Keyword_Research_Template.xlsx', fileUrl: '/resources/seo-keyword-research-template.xlsx', fileSize: 890000, mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
      { id: 'seed-cmm-f3', uploaderId: 'mock-naomi', fileName: 'Content_Repurposing_Workflow.pdf', fileUrl: '/resources/content-repurposing-workflow.pdf', fileSize: 1200000, mimeType: 'application/pdf' },
    ],
  },
  'startup-finance-101': {
    description: 'Master financial modeling, runway management, cap tables, and the numbers that matter for your startup.',
    posts: [
      { id: 'seed-sf101-1', authorId: 'mock-david',
        content: `Built a financial model that actually helped us make decisions (instead of just impressing investors).\n\n**The 3-sheet approach:**\n1. **Revenue model** — bottoms-up, not top-down. "10 customers x $100/mo" not "1% of a $10B market"\n2. **Hiring plan** — who, when, how much. This IS your cost model\n3. **Cash flow** — when money actually moves. Revenue ≠ cash\n\n**Key insight:** The most important number isn't revenue — it's "months of runway at current burn." That number should wake you up every morning.\n\nWhat financial metrics are everyone tracking weekly?` },
      { id: 'seed-sf101-2', authorId: 'mock-marcus',
        content: `Cap table mistakes I made (so you don't have to):\n\n❌ Didn't model dilution across 3 rounds before issuing first shares\n❌ Gave advisor equity without a vesting schedule\n❌ Forgot about the option pool — it comes out of YOUR share, not thin air\n❌ Didn't use a 409A valuation before issuing options\n\n**What I do now:**\n→ Model dilution in a spreadsheet BEFORE touching any legal docs\n→ 4-year vesting with 1-year cliff — for EVERYONE including founders\n→ Keep the option pool at 10-15% post-seed\n→ Carta or Pulley for cap table management — never a spreadsheet\n\nCap tables are one-way doors. You can't undo bad decisions.` },
      { id: 'seed-sf101-3', authorId: 'mock-elena',
        content: `Question: **At what MRR did you hire your first finance person?**\n\nWe're at $25K MRR and I'm still doing all the books myself (QuickBooks + a fractional CFO 5 hours/month).\n\nIt's working but I'm spending 8-10 hours/week on finance stuff that isn't strategic — categorizing expenses, chasing invoices, reconciling accounts.\n\nAt what point does it make sense to hire:\n→ Part-time bookkeeper?\n→ Full-time finance hire?\n→ In-house CFO?\n\nWould love to hear benchmarks from others who've scaled through this.` },
    ],
    replies: [
      { id: 'seed-sf101-r1', postId: 'seed-sf101-1', authorId: 'mock-sarah', content: `We track: cash balance, monthly burn, runway months, MRR, gross margin, and CAC payback. All on one dashboard updated every Monday.` },
      { id: 'seed-sf101-r2', postId: 'seed-sf101-1', authorId: 'mock-alex', content: `"Months of runway" is the ultimate reality check. We have a rule: when runway hits 6 months, fundraising mode activates. No exceptions.` },
      { id: 'seed-sf101-r3', postId: 'seed-sf101-2', authorId: 'mock-naomi', content: `The option pool advice needs to be in every founder's onboarding. We had to do a messy recap because our pool was too small post-Series A.` },
      { id: 'seed-sf101-r4', postId: 'seed-sf101-2', authorId: 'mock-james', content: `+1 on Carta. We switched from a spreadsheet and discovered 3 errors in our cap table within the first week.` },
      { id: 'seed-sf101-r5', postId: 'seed-sf101-3', authorId: 'mock-priya', content: `We hired a part-time bookkeeper at $15K MRR (10 hrs/week, ~$500/mo). Best decision ever. Freed up 8 hours of my week and caught $4K in missed deductions in the first month.` },
      { id: 'seed-sf101-r6', postId: 'seed-sf101-3', authorId: 'mock-david', content: `Fractional CFO at $20K MRR, part-time bookkeeper at $50K, full-time finance at $2M ARR. That was our progression and it worked well.` },
    ],
    files: [
      { id: 'seed-sf101-f1', uploaderId: 'mock-david', fileName: 'Startup_Financial_Model_Template.xlsx', fileUrl: '/resources/financial-model-template.xlsx', fileSize: 1800000, mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
      { id: 'seed-sf101-f2', uploaderId: 'mock-marcus', fileName: 'Cap_Table_Dilution_Calculator.xlsx', fileUrl: '/resources/cap-table-dilution-calculator.xlsx', fileSize: 650000, mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
      { id: 'seed-sf101-f3', uploaderId: 'mock-elena', fileName: 'Runway_Management_Guide.pdf', fileUrl: '/resources/runway-management-guide.pdf', fileSize: 1400000, mimeType: 'application/pdf' },
    ],
  },
  'ai-tools-for-founders': {
    description: 'Discover how to leverage AI tools across marketing, sales, product, and operations. Share your favorite AI workflows.',
    posts: [
      { id: 'seed-aitf-1', authorId: 'mock-sarah',
        content: `I automated 60% of our customer support with AI and our CSAT score actually went UP. Here's the stack:\n\n**Tier 1 (instant):** Custom GPT trained on our docs + Intercom → handles "how do I..." and "where is..." questions. 80% resolved without human touch.\n**Tier 2 (5 min):** Human reviews AI-suggested response → approves or edits. 15% of tickets.\n**Tier 3 (human):** Complex issues, bugs, angry customers. 5% of tickets.\n\n**Results after 3 months:**\n→ Response time: 4 hours → 2 minutes\n→ Support cost per ticket: $12 → $3\n→ CSAT: 82% → 89%\n\nThe AI handles routine stuff faster than humans. Humans handle the nuanced stuff better than AI. This is the sweet spot.` },
      { id: 'seed-aitf-2', authorId: 'mock-james',
        content: `My weekly AI stack as a solo founder:\n\n• **Claude** — writing, brainstorming, code review (better than ChatGPT for long-form thinking)\n• **ChatGPT** — quick questions, data analysis, image generation\n• **Midjourney** — all marketing visuals, social media graphics\n• **ElevenLabs** — voiceovers for product demos\n• **Gamma** — pitch decks and investor presentations\n• **Notion AI** — meeting notes, project summaries\n\nTotal cost: ~$120/month. Productivity gain: easily 20+ hours/week.\n\nThe key isn't "AI will replace you" — it's "AI will replace the parts of your job that aren't your superpower." What's in your stack?` },
      { id: 'seed-aitf-3', authorId: 'mock-naomi',
        content: `We built an AI-powered competitor analysis tool in 3 hours that would have cost $15K to outsource. Here's how:\n\n1. **Scraping:** Apify actor → pulls competitor websites, pricing pages, G2 reviews\n2. **Analysis:** ChatGPT API → categorizes features, pricing tiers, customer sentiment\n3. **Output:** Notion database → auto-populated comparison table with weekly updates\n\n**Total cost:** $23 in API credits + 3 hours of my time.\n\n**What we learned:** Our top competitor's biggest weakness (customer support) wasn't even on our radar. It's now our homepage headline.\n\nAnyone else building custom AI tools for internal use?` },
    ],
    replies: [
      { id: 'seed-aitf-r1', postId: 'seed-aitf-1', authorId: 'mock-marcus', content: `We did the same with Zendesk + a custom GPT. The trick is feeding it your actual support history so it learns your voice. Customers can't tell it's AI.` },
      { id: 'seed-aitf-r2', postId: 'seed-aitf-1', authorId: 'mock-elena', content: `What's your escalation trigger from Tier 1 to Tier 2? We use sentiment analysis — if the AI detects frustration, it auto-escalates.` },
      { id: 'seed-aitf-r3', postId: 'seed-aitf-2', authorId: 'mock-priya', content: `Swap recommendation: try Claude for data analysis too. I uploaded our CRM export and it found patterns our analytics tool missed. Game changer.` },
      { id: 'seed-aitf-r4', postId: 'seed-aitf-2', authorId: 'mock-david', content: `I'd add Perplexity for research. It's replaced 80% of my Google searches — especially for competitive research and market sizing.` },
      { id: 'seed-aitf-r5', postId: 'seed-aitf-3', authorId: 'mock-alex', content: `This is brilliant. We pay $500/mo for a competitive intel tool that does basically this. Going to try rebuilding it this weekend.` },
      { id: 'seed-aitf-r6', postId: 'seed-aitf-3', authorId: 'mock-sarah', content: `The "customer support weakness" insight is gold. AI doesn't just save money — it surfaces things you'd never find manually.` },
    ],
    files: [
      { id: 'seed-aitf-f1', uploaderId: 'mock-sarah', fileName: 'AI_Automation_Playbook_for_Founders.pdf', fileUrl: '/resources/ai-automation-playbook.pdf', fileSize: 2200000, mimeType: 'application/pdf' },
      { id: 'seed-aitf-f2', uploaderId: 'mock-james', fileName: 'AI_Tools_Stack_Comparison.xlsx', fileUrl: '/resources/ai-tools-stack-comparison.xlsx', fileSize: 720000, mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
      { id: 'seed-aitf-f3', uploaderId: 'mock-naomi', fileName: 'Custom_GPT_Prompt_Library.pdf', fileUrl: '/resources/custom-gpt-prompt-library.pdf', fileSize: 960000, mimeType: 'application/pdf' },
    ],
  },
  'design-thinking': {
    description: 'Master human-centered design — from user research to prototyping. Share your design processes and user insights.',
    posts: [
      { id: 'seed-dt-1', authorId: 'mock-elena',
        content: `We did 20 user interviews last month and it completely changed our roadmap. Here's what we learned about running effective user research:\n\n**What worked:**\n• "Show me how you currently solve this" — watching behavior > listening to opinions\n• The 5-whys technique — every answer leads to a deeper insight\n• Recording + AI transcription (Fireflies) — frees you to actually listen\n\n**What didn't:**\n• "Would you use this feature?" — people are polite liars\n• Surveys without follow-up interviews — data without context is dangerous\n• Testing with friends — they're biased, even when they try not to be\n\n**The biggest insight:** Our users didn't need more features. They needed our existing features to work together better. We killed 4 roadmap items and focused on integrations instead.` },
      { id: 'seed-dt-2', authorId: 'mock-sarah',
        content: `How we went from idea to prototype in 5 days using design sprints:\n\n**Day 1: Map** — Define the problem. Not "we need a dashboard" but "users can't track their team's progress."\n**Day 2: Sketch** — Everyone sketches solutions individually (no groupthink).\n**Day 3: Decide** — Vote silently, then discuss. The best ideas float to the top naturally.\n**Day 4: Prototype** — Figma + simple clickable prototype. Not pixel-perfect, just functional enough to test.\n**Day 5: Test** — 5 users, 1 hour each. You'll learn more in 5 hours than in 5 months of building in the dark.\n\nWe've run 3 sprints now and every single one saved us from building the wrong thing.` },
      { id: 'seed-dt-3', authorId: 'mock-alex',
        content: `The most impactful UX change we ever made was removing 3 fields from our signup form.\n\n**Before:** Name, email, password, company name, role, team size, use case → 34% completion rate\n**After:** Email, password only → 72% completion rate\n\n**What we learned:** Every field you add costs you ~10% of your potential users. "But we need that data!" — no you don't. You can ask later, after they've experienced value.\n\nProgressive profiling > upfront data capture. Always.` },
    ],
    replies: [
      { id: 'seed-dt-r1', postId: 'seed-dt-1', authorId: 'mock-james', content: `"People are polite liars" needs to be on a poster in every startup office. We wasted 3 months building a feature 80% of interviewees "would definitely use." Zero adopted it.` },
      { id: 'seed-dt-r2', postId: 'seed-dt-1', authorId: 'mock-priya', content: `The integrations insight is huge. Users don't want more tools — they want their existing tools to talk to each other.` },
      { id: 'seed-dt-r3', postId: 'seed-dt-2', authorId: 'mock-naomi', content: `Design sprints are underrated in startups. Everyone thinks they need to move fast, but 5 days of structured thinking saves months of building the wrong thing.` },
      { id: 'seed-dt-r4', postId: 'seed-dt-2', authorId: 'mock-david', content: `Day 5 is the most important. We used to skip testing because "we already know what users want." We were wrong every single time.` },
      { id: 'seed-dt-r5', postId: 'seed-dt-3', authorId: 'mock-marcus', content: `We removed our signup form entirely — just "Sign up with Google." Conversion went from 28% to 61%. Progressive profiling is the way.` },
      { id: 'seed-dt-r6', postId: 'seed-dt-3', authorId: 'mock-elena', content: `The "you can ask later" point is key. We moved role and company size to an onboarding modal AFTER the user had seen their dashboard. 87% completion rate.` },
    ],
    files: [
      { id: 'seed-dt-f1', uploaderId: 'mock-elena', fileName: 'User_Research_Interview_Guide.pdf', fileUrl: '/resources/user-research-interview-guide.pdf', fileSize: 1100000, mimeType: 'application/pdf' },
      { id: 'seed-dt-f2', uploaderId: 'mock-sarah', fileName: 'Design_Sprint_Canvas_Template.pdf', fileUrl: '/resources/design-sprint-canvas-template.pdf', fileSize: 1600000, mimeType: 'application/pdf' },
      { id: 'seed-dt-f3', uploaderId: 'mock-alex', fileName: 'UX_Audit_Checklist.xlsx', fileUrl: '/resources/ux-audit-checklist.xlsx', fileSize: 380000, mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
    ],
  },
  'remote-leadership': {
    description: 'Lead distributed teams with confidence. Share async workflows, remote culture practices, and scaling strategies.',
    posts: [
      { id: 'seed-rl-1', authorId: 'mock-james',
        content: `We've been fully remote for 3 years, 40 people across 12 time zones. Here's what actually works:\n\n**Async-first communication:**\n• Notion for all documentation — "write it down" is our first value\n• Loom for updates — a 3-minute video replaces a 30-minute meeting\n• Slack for quick coordination, but no expectation of immediate response\n\n**Sync time is sacred:**\n• 2 all-hands per month (30 min each)\n• Weekly 1:1s (30 min)\n• Quarterly in-person offsites (3 days)\n\n**What doesn't work:**\n• "Remote with office hours" — it's the worst of both worlds\n• Daily standups — async standup bots are better\n• Surveillance software — trust people or don't hire them\n\nThe companies winning at remote aren't replicating the office online. They're rethinking work entirely.` },
      { id: 'seed-rl-2', authorId: 'mock-david',
        content: `Hot take: most "remote culture" problems are actually management problems that in-person just masked.\n\nIf your team isn't aligned remotely, they probably weren't aligned in the office either — you just couldn't tell because body language and hallway conversations papered over the cracks.\n\n**Remote forces you to be intentional about:**\n→ Written communication (no "I thought you said...")\n→ Expectations (no "but I was at my desk all day")\n→ Recognition (no hallway high-fives, you have to actively celebrate wins)\n\nRemote isn't harder. It's just more honest about what management requires.` },
      { id: 'seed-rl-3', authorId: 'mock-priya',
        content: `We just ran our first fully remote offsite and it was honestly better than our in-person ones. Here's the format:\n\n**Day 1: Connection** — no work talk. Cooking class, virtual escape room, "life stories" session where everyone shares their journey.\n**Day 2: Strategy** — deep dives into roadmap, metrics, and team retrospectives. Async pre-reading means meeting time is discussion, not presentation.\n**Day 3: Building** — cross-functional hackathon. Teams of 4-5, 6 hours, build something fun. The ideas that came out of this were incredible.\n\n**Key:** Every session had a facilitator who wasn't the manager. Keeps it from becoming "leadership talks at everyone."` },
    ],
    replies: [
      { id: 'seed-rl-r1', postId: 'seed-rl-1', authorId: 'mock-sarah', content: `Loom is the killer app for remote. I send 5-10 Looms a day instead of Slack essays. Saves hours and the tone/inflection comes through.` },
      { id: 'seed-rl-r2', postId: 'seed-rl-1', authorId: 'mock-alex', content: `"Remote with office hours" — perfectly said. We tried hybrid for 6 months and it was chaos. The in-office people had side conversations that remote people missed. Commit one way or the other.` },
      { id: 'seed-rl-r3', postId: 'seed-rl-2', authorId: 'mock-naomi', content: `This is the truth. Remote didn't create our alignment problems — it revealed them. We had to completely rebuild our goal-setting process and it made us better.` },
      { id: 'seed-rl-r4', postId: 'seed-rl-2', authorId: 'mock-marcus', content: `"Remote isn't harder. It's just more honest." I'm stealing this for our next all-hands.` },
      { id: 'seed-rl-r5', postId: 'seed-rl-3', authorId: 'mock-elena', content: `The facilitator point is critical. We had our CEO facilitate the first remote offsite and it was just a 3-day monologue. Switched to a rotating facilitator and it transformed the energy.` },
      { id: 'seed-rl-r6', postId: 'seed-rl-3', authorId: 'mock-james', content: `Love the hackathon idea. Going to pitch this for our next offsite. Did you give prizes or was the satisfaction of building enough?` },
    ],
    files: [
      { id: 'seed-rl-f1', uploaderId: 'mock-james', fileName: 'Remote_First_Handbook_Template.pdf', fileUrl: '/resources/remote-first-handbook-template.pdf', fileSize: 2400000, mimeType: 'application/pdf' },
      { id: 'seed-rl-f2', uploaderId: 'mock-david', fileName: 'Async_Meeting_Guide_for_Teams.pdf', fileUrl: '/resources/async-meeting-guide.pdf', fileSize: 1300000, mimeType: 'application/pdf' },
      { id: 'seed-rl-f3', uploaderId: 'mock-priya', fileName: 'Remote_Offsite_Planning_Kit.pdf', fileUrl: '/resources/remote-offsite-planning-kit.pdf', fileSize: 1700000, mimeType: 'application/pdf' },
    ],
  },
};

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      where: { status: 'PUBLISHED' },
      select: { id: true, title: true, slug: true },
      orderBy: { title: 'asc' },
    });

    const realUsers = await prisma.user.findMany({
      select: { id: true, name: true, avatar: true },
      take: 8,
    });

    if (realUsers.length === 0) {
      return NextResponse.json({ error: 'No users found' }, { status: 400 });
    }

    const authorLookup = new Map<string, string>();
    MOCK_MEMBERS.forEach((m, i) => authorLookup.set(m.id, realUsers[i % realUsers.length].id));

    const summary: Record<string, { members: number; posts: number; replies: number; files: number }> = {};

    for (const course of courses) {
      const seed = COURSE_SEEDS[course.slug];
      if (!seed) continue;

      let group = await prisma.courseStudyGroup.findUnique({ where: { courseId: course.id } });
      if (!group) {
        group = await prisma.courseStudyGroup.create({ data: { courseId: course.id } });
      }

      await prisma.courseStudyGroup.update({
        where: { id: group.id },
        data: { description: seed.description },
      });

      let membersCreated = 0, postsCreated = 0, repliesCreated = 0, filesCreated = 0;

      for (const m of MOCK_MEMBERS) {
        const realId = authorLookup.get(m.id);
        if (!realId) continue;
        const existing = await prisma.courseGroupMember.findFirst({
          where: { groupId: group.id, userId: realId },
        });
        if (!existing) {
          await prisma.courseGroupMember.create({ data: { groupId: group.id, userId: realId } });
          membersCreated++;
        }
      }

      for (const p of seed.posts) {
        const existing = await prisma.courseGroupPost.findUnique({ where: { id: p.id } });
        if (!existing) {
          const realAuthorId = authorLookup.get(p.authorId);
          if (!realAuthorId) continue;
          await prisma.courseGroupPost.create({
            data: { id: p.id, groupId: group.id, authorId: realAuthorId, content: p.content,
              createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) },
          });
          postsCreated++;
        }
      }

      for (const r of seed.replies) {
        const existing = await prisma.courseGroupReply.findUnique({ where: { id: r.id } });
        if (!existing) {
          const realAuthorId = authorLookup.get(r.authorId);
          if (!realAuthorId) continue;
          await prisma.courseGroupReply.create({
            data: { id: r.id, postId: r.postId, authorId: realAuthorId, content: r.content,
              createdAt: new Date(Date.now() - Math.random() * 6 * 24 * 60 * 60 * 1000) },
          });
          repliesCreated++;
        }
      }

      for (const f of seed.files) {
        const existing = await prisma.courseGroupFile.findUnique({ where: { id: f.id } });
        if (!existing) {
          const realUploaderId = authorLookup.get(f.uploaderId);
          if (!realUploaderId) continue;
          await prisma.courseGroupFile.create({
            data: { id: f.id, groupId: group.id, uploaderId: realUploaderId, fileName: f.fileName,
              fileUrl: f.fileUrl, fileSize: f.fileSize, mimeType: f.mimeType,
              createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) },
          });
          filesCreated++;
        }
      }

      summary[course.slug] = { members: membersCreated, posts: postsCreated, replies: repliesCreated, files: filesCreated };
    }

    let avatarsUpdated = 0;
    for (const m of MOCK_MEMBERS) {
      const realId = authorLookup.get(m.id);
      if (!realId) continue;
      const user = realUsers.find((u) => u.id === realId);
      if (user && user.avatar !== m.avatar) {
        await prisma.user.update({ where: { id: realId }, data: { avatar: m.avatar, name: m.name } });
        avatarsUpdated++;
      }
    }

    const totalItems = Object.values(summary).reduce((acc, s) => acc + s.members + s.posts + s.replies + s.files, 0);

    return NextResponse.json({ success: true, coursesSeeded: Object.keys(summary).length, avatarsUpdated, totalItems, summary });
  } catch (error: any) {
    console.error('[SeedAll] Error:', error);
    return NextResponse.json({ error: error?.message || 'Seed failed' }, { status: 500 });
  }
}
