// lib/seed/content.ts — Realistic AI-generated post templates for community seeding
// Categories: wins, asks, insights, hot-takes, resources, milestones, events

export interface PostTemplate {
  content: string;
  space: string;
  weight: number; // Higher = more likely to be selected
  hasImage?: boolean; // Whether to attach an Unsplash image
}

// ── Post Templates by Category ──────────────────────────────────────────────

export const postTemplates: PostTemplate[] = [
  // ── Wins & Milestones ──
  { content: 'Just hit {NUMBER} paying customers! 🎉 Took {NUMBER} months of grinding but we\'re finally seeing real traction. The biggest unlock? {STRATEGY}. Happy to share the full journey in the comments.', space: 'saas-founders', weight: 8, hasImage: true },
  { content: 'Our MRR just crossed ${NUMBER}K for the first time. I remember when $500 felt impossible. For everyone in the $0-1K range: keep shipping, keep talking to users. It compounds.', space: 'bootstrappers', weight: 7, hasImage: true },
  { content: 'Closed our pre-seed round! 🚀 ${NUMBER}K led by {INVESTOR}. It took {NUMBER} meetings and {NUMBER} rejections, but we found the right partners. The Fundraising 101 path here was a game-changer — that term sheet breakdown saved us serious legal fees.', space: 'fundraising-hub', weight: 6, hasImage: true },
  { content: 'Just got our first enterprise customer! 6 months of pilot, security review, and legal back-and-forth. Worth every hour. Enterprise sales is a marathon, not a sprint.', space: 'saas-founders', weight: 6, hasImage: true },
  { content: 'We hit #1 on Product Hunt today! 🏆 {NUMBER} upvotes and counting. The community support here has been incredible. Key lesson: we spent 3 weeks building relationships with PH influencers before launch day.', space: 'growth-hacking', weight: 5, hasImage: true },
  { content: 'Launched on Hacker News and got {NUMBER}K unique visitors in 24 hours. Our servers held up (barely). Here\'s what worked and what I\'d do differently.', space: 'growth-hacking', weight: 4 },
  { content: 'Officially ramen-profitable! 🍜 It\'s not glamorous but it\'s real — we can pay our bills from customer revenue alone. Took {NUMBER} months of bootstrapping. AMA about the journey.', space: 'bootstrappers', weight: 5 },
  { content: 'Signed our first 5-figure annual contract! For context, our average deal was $200/month 8 months ago. Moving upmarket is terrifying and rewarding in equal measure.', space: 'saas-founders', weight: 5 },

  // ── Asks & Questions ──
  { content: 'What\'s everyone using for {SOFTWARE_TOOL} these days? We\'re outgrowing our current setup and need something that scales. Budget under ${NUMBER}/mo. Would love specific recommendations.', space: 'saas-founders', weight: 6 },
  { content: 'Honest question for those who\'ve raised a Series A: how long did it actually take from first meeting to money in the bank? I keep hearing "4-6 weeks" but is that realistic?', space: 'fundraising-hub', weight: 5 },
  { content: 'How do you handle churn in a PLG model? We have great top-of-funnel but users churn after month 2-3. I suspect our activation flow is broken. Anyone willing to roast our onboarding?', space: 'saas-founders', weight: 5 },
  { content: 'Looking for a technical co-founder. Building an AI-powered {VERTICAL} platform. I have domain expertise and {NUMBER} pilot customers lined up. Based in {LOCATION}. DM me if interested or tag someone!', space: 'ai-ml-builders', weight: 4 },
  { content: 'Has anyone here successfully pivoted from B2C to B2B? We built a consumer app, got decent traction, but the unit economics don\'t work. Enterprises are showing interest. How do I make the leap?', space: 'saas-founders', weight: 4 },
  { content: 'Need advice: our angel investor wants to introduce us to a Series A fund, but we\'re only at ${NUMBER}K ARR. Is it too early? Don\'t want to burn a warm intro.', space: 'fundraising-hub', weight: 3 },
  { content: 'For solo founders: how do you handle the loneliness? I\'m {NUMBER} months in and the isolation is real. I\'ve tried co-working spaces but they feel transactional. What actually works?', space: 'bootstrappers', weight: 4 },
  { content: 'How many of you are using AI in your product vs. just for internal tooling? We\'re debating whether to build AI features or stay focused on our core workflow. Would love to hear real experiences.', space: 'ai-ml-builders', weight: 5 },

  // ── Insights & Hot Takes ──
  { content: 'Hot take: Most startups don\'t need to raise venture capital. We built {PRODUCT} to ${NUMBER}M ARR completely bootstrapped. The playbooks in the Growth Marketing path are all you need to get started. AMA!', space: 'bootstrappers', weight: 8, hasImage: true },
  { content: 'Unpopular opinion: "Move fast and break things" is terrible advice for B2B startups. Your enterprise customers need reliability, not velocity. We ship weekly, not hourly, and our churn is under 2%.', space: 'saas-founders', weight: 6 },
  { content: 'I\'ve reviewed {NUMBER} pitch decks this month. Here are the 3 most common mistakes:\n1. Too much text — investors skim, they don\'t read\n2. No clear ask — tell them exactly how much and what for\n3. Rambling answers to questions — practice saying "I don\'t know, but I\'ll find out"', space: 'fundraising-hub', weight: 7 },
  { content: 'The best growth hack I\'ve found: actually talking to customers. Not surveys, not analytics — real 30-minute conversations. We learned more from 10 calls than from 6 months of Mixpanel data.', space: 'growth-hacking', weight: 6, hasImage: true },
  { content: 'Built a custom analytics dashboard for our SaaS this weekend. Zero-budget stack: Next.js + Supabase + Vercel. Happy to share the repo if anyone wants it.', space: 'saas-founders', weight: 5, hasImage: true },
  { content: 'Here\'s a counterintuitive lesson from our first year: saying "no" to feature requests was the best thing we ever did. Every feature you add is maintenance forever. Focus on the one thing you do better than anyone.', space: 'saas-founders', weight: 5 },
  { content: 'I see so many founders obsessing over their pitch deck and ignoring their actual metrics. Investors care about 3 numbers: MRR growth rate, net revenue retention, and burn multiple. Nail those, and the deck writes itself.', space: 'fundraising-hub', weight: 5 },
  { content: 'The most underrated startup skill: knowing when to quit. I spent 2 years on a product nobody wanted because I was afraid of being a "quitter." My current startup hit PMF in 4 months because I was ruthless about killing what doesn\'t work.', space: 'bootstrappers', weight: 5 },

  // ── Resources & Learning ──
  { content: 'Just published my first blog post about building in public. {NUMBER} months ago I was too scared to share anything. Now I have {NUMBER}K followers and 3 inbound investor inquiries. The Community-Led Growth lesson here was 🔥', space: 'growth-hacking', weight: 6, hasImage: true },
  { content: 'The Product-Led Growth path is incredible. Just redesigned our onboarding flow based on Module 2 and activation rate went from {NUMBER}% to {NUMBER}% in two weeks. Data doesn\'t lie 📈', space: 'saas-founders', weight: 5, hasImage: true },
  { content: 'New module just dropped in the Growth Marketing path: "Community-Led Growth." We break down how Duolingo, Figma, and Notion built their communities. Plus a step-by-step playbook for founders. Check it out ⬇️', space: 'growth-hacking', weight: 5 },
  { content: 'I compiled a list of {NUMBER} free tools every bootstrapped founder should know about. Everything from analytics to design to customer support. All with generous free tiers. Link in comments.', space: 'bootstrappers', weight: 5 },
  { content: 'Finally finished the Leadership Foundations course. The hiring module alone is worth 10x the subscription. We just hired our first 3 employees and the structured interview process saved us from 2 bad hires.', space: 'saas-founders', weight: 4 },
  { content: 'Does anyone have a good resource on pricing strategy for enterprise SaaS? We\'re moving from a flat $99/mo to usage-based and I\'m worried about alienating our existing customers.', space: 'saas-founders', weight: 4 },
  { content: 'Just watched the recording of {INSTRUCTOR}\'s workshop on {TOPIC}. Mind = blown. The frameworks they shared are immediately applicable. If you missed it live, the recording is in the Resources tab.', space: 'growth-hacking', weight: 4 },
  { content: 'I\'ve been using ChatGPT as a co-founder (I know, I know). But seriously — for brainstorming, copywriting, and even basic code review, it\'s been a force multiplier. Anyone else doing this? What\'s your workflow?', space: 'ai-ml-builders', weight: 5 },

  // ── Community & Events ──
  { content: 'Office hours this Friday at 11am PT. Bring your pitch decks — I\'ll do live feedback on the first {NUMBER} submissions. Link in the Events tab.', space: 'fundraising-hub', weight: 4 },
  { content: 'Who else is building in {VERTICAL}? 🌍 We\'re working on {DESCRIPTION}. Would love to connect with other {VERTICAL} founders here. Maybe we can start a weekly accountability group?', space: 'climate-tech', weight: 3 },
  { content: 'The SaaS Founders meetup last week was incredible! {NUMBER} founders showed up, we had 3 product demos, and I made 2 connections that might turn into partnerships. When\'s the next one?', space: 'saas-founders', weight: 3 },
  { content: 'Thinking of starting a mastermind group for founders at the ${NUMBER}K-{NUMBER}K ARR range. Meet bi-weekly, share metrics, hold each other accountable. DM if interested — capping at {NUMBER} people.', space: 'saas-founders', weight: 4 },
  { content: 'Just attended {INSTRUCTOR}\'s live class on {TOPIC} and took {NUMBER} pages of notes. This community continues to deliver insane value. If you\'re lurking and haven\'t engaged yet — jump in, the water\'s warm!', space: 'saas-founders', weight: 4 },
  { content: 'Shoutout to {PERSON} for the detailed feedback on my landing page last week. Implemented their suggestions and our conversion rate went up {NUMBER}%. This is what community looks like 🙏', space: 'growth-hacking', weight: 3 },

  // ── Industry-specific ──
  { content: 'The climate tech funding landscape is changing fast. Just analyzed {NUMBER} recent deals and noticed a shift from carbon accounting toward adaptation tech. Investors are waking up to the fact that we need both mitigation AND adaptation.', space: 'climate-tech', weight: 4, hasImage: true },
  { content: 'Fintech regulation update: the new open banking rules are a game-changer for startups. If you\'re building in payments or lending, this creates a massive opportunity. Here\'s my analysis of what it means for early-stage founders.', space: 'fintech-builders', weight: 4, hasImage: true },
  { content: 'Building in health tech? The FDA just released new guidance on AI/ML-enabled devices. This is huge — it creates a clearer path for software-as-medical-device startups. Key takeaways:', space: 'health-tech', weight: 3, hasImage: true },
  { content: 'Women founders: I\'m compiling a list of female-focused VC funds that are actively deploying. So far I have {NUMBER} funds with open applications. DM me your email and I\'ll share the spreadsheet.', space: 'women-in-tech', weight: 5, hasImage: true },
  { content: 'The creator economy isn\'t just about influencers — the real opportunity is in tools for the long tail. {NUMBER} million people now consider themselves "creators," and most of them are underserved by current platforms.', space: 'creator-economy', weight: 3, hasImage: true },
  { content: 'Just read that {NUMBER}% of African startups are now raising their first round from local VCs rather than relying on Silicon Valley. The ecosystem is maturing fast. Exciting times for founders on the continent!', space: 'fundraising-hub', weight: 3 },
  { content: 'What are people\'s thoughts on the EU AI Act? We\'re building an AI product and trying to figure out if we need to restructure our data pipeline before it takes effect. Any regulatory experts here?', space: 'ai-ml-builders', weight: 3, hasImage: true },
];

// ── Comment Templates ───────────────────────────────────────────────────────

export const commentTemplates = [
  'Congratulations! Proud to have played a small part in your journey. 🚀',
  'Amazing! {QUESTION} Would love to compare notes.',
  'How did you handle {PROBLEM} in the early days?',
  'This is gold. Saved and bookmarked. Thank you for sharing!',
  'Totally agree with this. We saw the same thing with our {PRODUCT}. The key is {INSIGHT}.',
  'Great question. We tried {TOOL} for 3 months and ended up switching to {TOOL2}. The difference was night and day.',
  'I know someone great — will DM you!',
  'Check out {TOOL} — we switched {NUMBER} months ago and love it.',
  'We had the exact same experience. What worked for us was {STRATEGY}. Happy to hop on a call.',
  'Adding to this: don\'t forget about {TOPIC}. It\'s often overlooked but makes a huge difference.',
  'Respectfully disagree on this one. In our experience, {COUNTERPOINT}. But I see where you\'re coming from.',
  'This is exactly what I needed to hear today. The {NUMBER}-month grind is real but hearing success stories keeps me going.',
  'We\'re at the same stage! Would love to connect and share notes. Sending you a DM.',
  'For anyone reading this later: this advice is spot on. We implemented something similar and our {METRIC} improved by {NUMBER}%.',
  'What tools/stack are you using for {TOPIC}? We\'re building something similar and would love to learn from your setup.',
  'I was literally just struggling with this yesterday. Thank you for the timely post! 🙏',
  'Huge congrats! 🎉 Remember when we were both at $0 MRR? Wild how fast things change.',
  'Question for the group: has anyone here tried {STRATEGY}? Considering it for Q4 but not sure about the ROI.',
  'Hot take in the comments: {OPINION}. Curious if anyone else feels this way.',
  'Bookmarking this thread. Some of the best insights I\'ve seen on {TOPIC} anywhere online.',
];

// ── Event Templates ─────────────────────────────────────────────────────────

export interface EventTemplate {
  title: string;
  description: string;
  type: 'ONLINE' | 'IN_PERSON' | 'HYBRID';
  hostUsername: string; // Matches username in seed data
  maxAttendees: number;
}

export const eventTemplates: EventTemplate[] = [
  { title: 'Live Pitch Feedback with Marcus Chen', description: 'Submit your pitch deck for live feedback from a top VC. First 5 submissions will be reviewed on air. Bring your questions about fundraising, term sheets, and investor expectations.', type: 'ONLINE', hostUsername: 'marcuschen', maxAttendees: 100 },
  { title: 'Zero-Budget Marketing Workshop', description: 'Priya Patel walks through her framework for getting your first 1,000 users without spending a dollar on ads. Covers content marketing, SEO, community building, and viral loops.', type: 'ONLINE', hostUsername: 'priyap', maxAttendees: 200 },
  { title: 'SaaS Founders Meetup: Demo Day', description: '5 founders present their products to the community. Get feedback, find beta testers, and network with fellow builders. Each founder gets 10 minutes to present + 5 minutes of Q&A.', type: 'ONLINE', hostUsername: 'devonm', maxAttendees: 150 },
  { title: 'Building in Public: Monthly AMA', description: 'Sarah Okonkwo shares her journey building TalentBridge and answers your questions about scaling engineering teams, hiring, and leadership. Bring your toughest people-problems.', type: 'ONLINE', hostUsername: 'sarahk', maxAttendees: 120 },
  { title: 'AI for Founders: Practical Applications', description: 'Not hype — real use cases. We\'ll walk through how to integrate AI into your product and operations. Covering LLMs, embeddings, RAG, and agent architectures for non-ML engineers.', type: 'ONLINE', hostUsername: 'elenak', maxAttendees: 180 },
  { title: 'Bootstrapper Breakfast (Virtual)', description: 'Monthly virtual coffee chat for bootstrapped founders. No agenda, no pitches — just real talk about the bootstrap journey. Bring your wins and your struggles.', type: 'ONLINE', hostUsername: 'devonm', maxAttendees: 50 },
  { title: 'Fundraising Office Hours', description: 'Open Q&A session with Marcus Chen. Ask anything about fundraising — from pitch deck structure to term sheet negotiation to investor outreach strategies.', type: 'ONLINE', hostUsername: 'marcuschen', maxAttendees: 80 },
  { title: 'Women in Tech: Founder Fireside Chat', description: 'Intimate conversation with 3 women founders who\'ve raised Series A and beyond. They\'ll share the real stories — the wins, the rejections, and the lessons they wish they\'d known.', type: 'ONLINE', hostUsername: 'priyap', maxAttendees: 150 },
  { title: 'Growth Hacking Workshop: Email Sequences That Convert', description: 'Deep dive into email marketing for startups. We\'ll reverse-engineer 5 high-performing email sequences and build one live during the workshop.', type: 'ONLINE', hostUsername: 'priyap', maxAttendees: 200 },
  { title: 'Climate Tech Pitch Night', description: 'Climate tech founders pitch to a panel of cleantech investors. Open to the community for observation. If you want to pitch, submit your deck by Friday.', type: 'ONLINE', hostUsername: 'maya', maxAttendees: 120 },
  { title: 'Code & Coffee: Weekend Build Session', description: '2-hour co-working session for developers. Work on your side project, get unstuck with help from peers, and ship something by the end. All skill levels welcome.', type: 'ONLINE', hostUsername: 'davidl', maxAttendees: 60 },
  { title: 'Product-Led Growth Office Hours', description: 'Devon Mitchell reviews your PLG strategy live. Submit your onboarding flow, pricing page, or activation metrics for actionable feedback.', type: 'ONLINE', hostUsername: 'devonm', maxAttendees: 100 },
  { title: 'Fintech Founders Roundtable', description: 'Quarterly roundtable for fintech founders. Discuss regulatory changes, partnership strategies, and the evolving payments landscape. Chatham House rules.', type: 'ONLINE', hostUsername: 'jameso', maxAttendees: 40 },
  { title: 'Indie Hacker Show & Tell', description: '10 indie hackers share what they shipped this month. 5-minute demos, no slides — just real products. Great for inspiration and accountability.', type: 'ONLINE', hostUsername: 'davidl', maxAttendees: 100 },
  { title: 'Navigating Your First Enterprise Deal', description: 'Workshop covering everything you need to close your first enterprise customer: security reviews, procurement processes, legal negotiation, and implementation planning.', type: 'ONLINE', hostUsername: 'sarahk', maxAttendees: 150 },
  { title: 'SF Founders Happy Hour', description: 'In-person meetup for Bay Area founders. Drinks, networking, and real conversations. No name tags, no pitch competitions — just community.', type: 'IN_PERSON', hostUsername: 'alexk', maxAttendees: 80 },
  { title: 'NYC Tech Founders Mixer', description: 'Monthly mixer for NYC-based founders and operators. Come meet your peers, find co-founders, and expand your network in the city.', type: 'IN_PERSON', hostUsername: 'marcuschen', maxAttendees: 100 },
  { title: 'London Startup Social', description: 'Casual evening for London\'s startup community. Whether you\'re solo, funded, or just curious — come hang out with fellow builders.', type: 'IN_PERSON', hostUsername: 'sarahk', maxAttendees: 70 },
  { title: 'Design Review: Get Your UI Roasted', description: 'Submit your product screenshots for live design critique. Our panel of design-minded founders will give honest, actionable feedback to improve your UX.', type: 'ONLINE', hostUsername: 'elenak', maxAttendees: 90 },
  { title: 'The Mental Health of Founders', description: 'Candid conversation about founder mental health. Burnout, anxiety, imposter syndrome — we\'ll talk about it all. Led by a founder who\'s been through it and a licensed therapist.', type: 'ONLINE', hostUsername: 'maya', maxAttendees: 100 },
];

// ── Group Post Templates ────────────────────────────────────────────────────

export const groupPostTemplates = [
  'Just finished Module 2 — the section on {TOPIC} was a game-changer. Anyone else finding this particularly useful?',
  'Stuck on the {TOPIC} exercise. My {PROBLEM} isn\'t working as expected. Anyone willing to take a look?',
  'Shared a resource that helped me understand {TOPIC} better: {LINK}. Highly recommend for anyone struggling with this module.',
  'Who\'s up for a virtual study session this weekend? Thinking Saturday at 10am PT. We can tackle the {MODULE} together.',
  'Just passed the Module 3 quiz with a {NUMBER}%! 🎉 The key was focusing on {TOPIC} — the questions were surprisingly detail-oriented.',
  'Progress check: where is everyone in the course? I\'m on Module {NUMBER} and feeling good but worried about the pace.',
  'Has anyone implemented the {STRATEGY} from Module 4 yet? We tried it with our {PRODUCT} and got mixed results. Would love to compare notes.',
  'Found a great supplementary resource on {TOPIC}: {LINK}. Goes deeper than the course material on the technical aspects.',
  'Accountability check-in: completed {NUMBER} lessons this week. Target was {NUMBER}. How did everyone else do?',
  'Question about the {TOPIC} framework — how do you apply this when you have a {SITUATION}? The course examples assume {ASSUMPTION} which doesn\'t match my use case.',
];

// ── Helper to fill template variables ───────────────────────────────────────

const NUMBER_REPLACEMENTS = ['10', '15', '25', '50', '100', '250', '500', '1000', '3', '7', '12', '20', '40', '200', '5', '8'];
const STRATEGY_REPLACEMENTS = ['doubling down on customer success calls', 'redesigning the onboarding flow', 'switching to usage-based pricing', 'launching a referral program', 'investing in content marketing', 'building a community around the product', 'focusing on a narrower ICP'];
const TOOL_REPLACEMENTS = ['HubSpot', 'Notion', 'Linear', 'Stripe', 'Vercel', 'Supabase', 'Figma', 'Intercom', 'Segment', 'Amplitude', 'PostHog', 'Mixpanel', 'Canny', 'Zapier', 'Calendly'];
const TOPIC_REPLACEMENTS = ['onboarding', 'pricing strategy', 'churn reduction', 'cold email outreach', 'content marketing', 'SEO optimization', 'conversion rate optimization', 'customer interviews', 'product-market fit', 'activation metrics'];
const LOCATION_REPLACEMENTS = ['SF', 'NYC', 'Austin', 'remote', 'London', 'Berlin', 'Bangalore', 'Toronto', 'LA', 'Chicago'];
const VERTICAL_REPLACEMENTS = ['climate tech', 'fintech', 'health tech', 'creator economy', 'legal tech', 'prop tech', 'insur tech', 'food tech', 'agri tech'];
const INSIGHT_REPLACEMENTS = ['starting with a narrow ICP and expanding later', 'charging from day one, even if it\'s just $5', 'making the product self-serve before hiring sales', 'investing in design early — it compounds', 'ignoring competitors and obsessing over customers'];
const NAME_REPLACEMENTS = ['Marcus', 'Priya', 'Devon', 'Sarah', 'Elena', 'James', 'Maya', 'David', 'Maria', 'Tom'];

export function fillTemplate(template: string): string {
  return template
    .replace(/\{NUMBER\}/g, () => NUMBER_REPLACEMENTS[Math.floor(Math.random() * NUMBER_REPLACEMENTS.length)])
    .replace(/\{STRATEGY\}/g, () => STRATEGY_REPLACEMENTS[Math.floor(Math.random() * STRATEGY_REPLACEMENTS.length)])
    .replace(/\{SOFTWARE_TOOL\}|\{TOOL2?\}/g, () => TOOL_REPLACEMENTS[Math.floor(Math.random() * TOOL_REPLACEMENTS.length)])
    .replace(/\{TOPIC\}/g, () => TOPIC_REPLACEMENTS[Math.floor(Math.random() * TOPIC_REPLACEMENTS.length)])
    .replace(/\{LOCATION\}/g, () => LOCATION_REPLACEMENTS[Math.floor(Math.random() * LOCATION_REPLACEMENTS.length)])
    .replace(/\{VERTICAL\}/g, () => VERTICAL_REPLACEMENTS[Math.floor(Math.random() * VERTICAL_REPLACEMENTS.length)])
    .replace(/\{INSIGHT\}/g, () => INSIGHT_REPLACEMENTS[Math.floor(Math.random() * INSIGHT_REPLACEMENTS.length)])
    .replace(/\{PERSON\}/g, () => NAME_REPLACEMENTS[Math.floor(Math.random() * NAME_REPLACEMENTS.length)])
    .replace(/\{INSTRUCTOR\}/g, () => NAME_REPLACEMENTS[Math.floor(Math.random() * NAME_REPLACEMENTS.length)])
    .replace(/\{INVESTOR\}/g, () => ['a16z', 'YC', 'Sequoia', 'Accel', 'Founders Fund', 'Benchmark', 'Greylock', 'General Catalyst', 'Lightspeed', 'Index Ventures'][Math.floor(Math.random() * 10)])
    .replace(/\{PRODUCT\}/g, () => ['Flux Studio', 'HireMind', 'CarbonClear', 'PayBridge', 'TalentBridge', 'ClipForge', 'SupplyBridge', 'TelemetryHub', 'APIStarter', 'SprintBoard'][Math.floor(Math.random() * 10)])
    .replace(/\{PROBLEM\}/g, () => ['churn', 'user activation', 'pricing', 'scaling support', 'hiring', 'fundraising', 'marketing attribution', 'onboarding', 'customer retention', 'growth stagnation'][Math.floor(Math.random() * 10)])
    .replace(/\{DESCRIPTION\}/g, () => ['carbon offset tracking for SMEs', 'a neobank for freelancers', 'an AI tutor for STEM students', 'a privacy-first analytics platform', 'a marketplace connecting artisans globally'][Math.floor(Math.random() * 5)])
    .replace(/\{METRIC\}/g, () => ['MRR', 'activation rate', 'conversion rate', 'NPS', 'churn rate', 'LTV', 'CAC', 'daily active users', 'retention'][Math.floor(Math.random() * 9)])
    .replace(/\{COUNTERPOINT\}/g, () => ['a slower, more deliberate approach worked better', 'charging more actually reduced churn', 'hiring junior and training them up was better than hiring senior'][Math.floor(Math.random() * 3)])
    .replace(/\{OPINION\}/g, () => ['remote work is overrated for early-stage startups', 'most MVPs are over-engineered', 'we should normalize failed startups', 'the "10x engineer" is a myth'][Math.floor(Math.random() * 4)])
    .replace(/\{SITUATION\}/g, () => ['tiny team', 'no budget', 'non-technical background', 'existing enterprise customers', 'two-sided marketplace'][Math.floor(Math.random() * 5)])
    .replace(/\{ASSUMPTION\}/g, () => ['you have a dedicated sales team', 'users are tech-savvy', 'you already have product-market fit'][Math.floor(Math.random() * 3)])
    .replace(/\{MODULE\}/g, () => ['Module 2', 'Module 3', 'the onboarding section', 'the pricing module', 'the growth chapter'][Math.floor(Math.random() * 5)])
    .replace(/\{LINK\}/g, () => ['https://example.com/resource', 'https://github.com/example/tool', 'https://youtube.com/watch?v=example'][Math.floor(Math.random() * 3)])
    .replace(/\{QUESTION\}/g, () => ['Which investors did you end up going with?', 'What was the hardest part of the process?', 'How did you find your lead investor?', 'Any tips for first-time fundraisers?'][Math.floor(Math.random() * 4)]);
}

// ── Unsplash image URLs for posts ───────────────────────────────────────────

export const postImages = [
  'https://images.unsplash.com/photo-1553484771-371e845efba1?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&h=400&fit=crop',
];
