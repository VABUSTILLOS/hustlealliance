// 100 levels (IDs 11–110) across 10 phases
// Reordered: Sell first, validate fast, build later.
// Each level includes book references and quick-win guidance.

import type { JourneyLevel, JourneyTask } from './journey';

interface PhaseMeta {
  phase: number;
  name: string;
  xpReward: number;
}

const phases: PhaseMeta[] = [
  { phase: 1, name: 'Ideation & Alignment', xpReward: 100 },
  { phase: 2, name: 'Validation & Quick Wins', xpReward: 120 },
  { phase: 3, name: 'Guerrilla Marketing & Launch', xpReward: 160 },
  { phase: 4, name: 'Sales Engine & CRM', xpReward: 170 },
  { phase: 5, name: 'Product & Tech Foundation', xpReward: 150 },
  { phase: 6, name: 'Legal, Finance & Admin', xpReward: 140 },
  { phase: 7, name: 'Operations & The Machine', xpReward: 180 },
  { phase: 8, name: 'Talent & Culture', xpReward: 190 },
  { phase: 9, name: 'Capital & Investment', xpReward: 200 },
  { phase: 10, name: 'Governance & The Infinite Game', xpReward: 250 },
];

interface LevelInput {
  title: string;
  badgeName: string;
  badgeIcon: string;
  description: string;
}

const levels: LevelInput[][] = [
  // ═══════════════════════════════════════════════════════════════
  // Phase 1: Ideation & Alignment (Levels 11–20)
  // ═══════════════════════════════════════════════════════════════
  [
    {
      title: "Identifying 'Specific Knowledge' (Naval's Principle)",
      badgeName: 'Naval Disciple',
      badgeIcon: '🧠',
      description: 'Uncover your unique combination of skills, talents, and curiosity that cannot be trained or outsourced — your true competitive edge.\n\n📖 Reference: Naval Ravikant\'s "How to Get Rich" (free on navalmanack.com) — every tweet is a masterclass.\n\n⚡ Quick Win: Write down 3 things you\'re better at than 90% of people. If nothing comes to mind, ask 5 friends what they come to you for.',
    },
    {
      title: 'Finding a "Hair on Fire" Problem in the Market',
      badgeName: 'Fire Marshal',
      badgeIcon: '🔥',
      description: 'Identify urgent, painful problems customers are desperate to solve — the kind they will pay for immediately. Problems people complain about daily on Reddit, Twitter, and in Facebook groups.\n\n📖 Reference: "The Mom Test" by Rob Fitzpatrick — how to ask questions that don\'t lie to you.\n\n⚡ Quick Win: Go to 3 subreddits in your niche. Sort by "Top → Past Month." Read every complaint. That\'s your product roadmap.',
    },
    {
      title: 'Competitor Matrix & Finding the Blue Ocean',
      badgeName: 'Ocean Explorer',
      badgeIcon: '🌊',
      description: 'Map competitors on key dimensions and discover uncontested market space where you can dominate. Don\'t enter a red ocean of blood — find waters no one else is swimming in.\n\n📖 Reference: "Blue Ocean Strategy" by W. Chan Kim & Renée Mauborgne.\n\n⚡ Quick Win: Create a 2×2 matrix. X-axis: price (low→high). Y-axis: quality/depth. Plot 5 competitors. The empty quadrant is your opportunity.',
    },
    {
      title: 'Defining the Core Mission & Values',
      badgeName: 'Missionary',
      badgeIcon: '📜',
      description: 'Your mission is the engine that keeps you going when money is tight and everyone doubts you. Make it visceral. Make it personal. "I want to make money" is not a mission — "I want to free 10,000 freelancers from feast-or-famine cycles" is.\n\n📖 Reference: Simon Sinek\'s "Start With Why" (TED Talk is free, 18 minutes).\n\n⚡ Quick Win: Finish this sentence in under 10 words: "We exist to ______."',
    },
    {
      title: 'Formulating the 1-Sentence Pitch',
      badgeName: 'Wordsmith',
      badgeIcon: '✂️',
      description: 'If you can\'t explain it in one sentence, you don\'t understand it yet. Your pitch must make a stranger say "Tell me more" — not "What does that mean?"\n\n📖 Reference: The YC "elevator pitch" formula: "We help [X] do [Y] by [Z]."\n\n⚡ Quick Win: Pitch your idea to 5 strangers (coffee shop, gym, anywhere). If 3 of them ask a follow-up question, you\'re onto something. If all 5 look confused, rewrite.',
    },
    {
      title: 'Unit Economics 101: Can This Actually Make Money?',
      badgeName: 'Numbers Guru',
      badgeIcon: '🧮',
      description: 'Before you do anything else, answer: How much does it cost to get one customer? How much revenue does one customer generate? If CAC > LTV, you have a hobby, not a business.\n\n📖 Reference: "Lean Analytics" by Croll & Yoskovitz — especially the chapter on the One Metric That Matters.\n\n⚡ Quick Win: Fill out a napkin P&L. Revenue per customer - cost to acquire = your margin. If the number is negative, figure out why before spending another dollar.',
    },
    {
      title: 'The Co-Founder Prenup: Equity & Expectations',
      badgeName: 'Fair Dealer',
      badgeIcon: '🤝',
      description: 'Most startups don\'t die from competition — they die from co-founder conflict. Draft expectations now while you still like each other. Who does what? What happens if someone quits after 3 months?\n\n📖 Reference: YC\'s "Founder Equity" guide (free on startupchool.org).\n\n⚡ Quick Win: Use a free template from clerky.com or CoFoundersLab. Write down vesting terms (4 years, 1-year cliff is standard). Both sign it. Today.',
    },
    {
      title: 'Identifying the Ideal Customer Profile (ICP)',
      badgeName: 'Sniper',
      badgeIcon: '🎯',
      description: '"Everyone" is not a customer. The tighter your ICP, the faster you sell. Pick one specific person: age, job title, pain point, where they hang out online, what keeps them up at night.\n\n📖 Reference: "Crossing the Chasm" by Geoffrey Moore — target a beachhead before expanding.\n\n⚡ Quick Win: Create a "Day in the Life" profile for one ideal customer. Give them a name. Write down their morning routine, their frustrations, and where they spend time online.',
    },
    {
      title: "Defining the 'North Star' Metric",
      badgeName: 'Navigator',
      badgeIcon: '⭐',
      description: 'Pick ONE number that tells you whether your business is winning. For Airbnb it\'s nights booked. For Spotify it\'s time spent listening. Not revenue — the behavior that drives revenue.\n\n📖 Reference: "North Star Playbook" by Amplitude (free PDF).\n\n⚡ Quick Win: Ask: "If I could only measure one thing to know if we\'re growing, what would it be?" Write it on a sticky note. That\'s your North Star.',
    },
    {
      title: 'Milestone: The Concept Checkpoint',
      badgeName: 'Gatekeeper',
      badgeIcon: '🚪',
      description: 'Pause. Review everything from Phase 1.\n\nCan you explain your business in one sentence? Do you know exactly who your customer is? Can the unit economics work? If yes, advance. If no — DO NOT move forward until these are solid. The next phases involve spending time and money. Get the foundation right first.\n\n📖 Reference: Re-read your notes from this phase. The answers are already here.\n\n⚡ Quick Win: Explain your entire business to a smart friend in 60 seconds. If they get it, you\'re ready.',
    },
  ],

  // ═══════════════════════════════════════════════════════════════
  // Phase 2: Validation & Quick Wins (Levels 21–30)
  // ═══════════════════════════════════════════════════════════════
  [
    {
      title: 'The "Fake Door" Landing Page Test',
      badgeName: 'Smoke Tester',
      badgeIcon: '🚪',
      description: 'Build a simple landing page describing your product — before it exists — and measure signup intent. If people won\'t give you an email address for it, they won\'t give you money for it.\n\n📖 Reference: "The Lean Startup" by Eric Ries — Chapter 5 on MVP testing.\n\n⚡ Quick Win: Use Carrd.co or Umso (30 minutes, free). Write a headline, 3 bullet points, and a "Join Waitlist" button. Share it on Twitter/LinkedIn. Target: 50 signups in 48 hours.',
    },
    {
      title: 'Customer Interviews: How to Ask Non-Leading Questions',
      badgeName: 'Listener',
      badgeIcon: '👂',
      description: 'Most founders ask "Would you pay for this?" — and everyone says yes because they\'re polite. Learn to ask questions that reveal the truth: "When was the last time you paid to solve this problem?"\n\n📖 Reference: "The Mom Test" by Rob Fitzpatrick — read Chapter 3 before your first interview.\n\n⚡ Quick Win: Interview 5 people this week. Never mention your product. Only ask about their problems. Record the calls. You\'ll hear the real pain points.',
    },
    {
      title: 'Scraping Leads & Cold Outreach Hustle',
      badgeName: 'Hustler',
      badgeIcon: '☕',
      description: 'Don\'t wait for customers to find you. Go find them. Scrape leads from LinkedIn, Google Maps, or online directories. Send 20 personalized DMs or emails today. Not tomorrow — today.\n\n📖 Reference: Alex Hormozi\'s "$100M Leads" — free on his site. The chapter on "warm outreach" is gold.\n\n⚡ Quick Win: Find 20 potential customers on LinkedIn. Send each a 2-sentence DM: "Hey [name], I noticed you [specific observation]. Curious — how do you currently handle [problem]?" Track response rate.',
    },
    {
      title: 'The Concierge MVP (Do It Manually, Get Paid)',
      badgeName: 'Concierge',
      badgeIcon: '🧑‍💼',
      description: 'Before you write a single line of code, deliver your service manually to 3 paying customers. Charge them. Real money. If they won\'t pay when you do it by hand, they won\'t pay for an app either.\n\n📖 Reference: Andrew Tate\'s core principle: "Sell first, build later." Prove demand with cash, not compliments.\n\n⚡ Quick Win: Find one person with the problem you solve. Offer to do it for them manually this week for $50. Their reaction tells you everything.',
    },
    {
      title: 'Building the 48-Hour No-Code Prototype',
      badgeName: 'Speed Builder',
      badgeIcon: '⚡',
      description: 'Use no-code tools (Bubble, Webflow, Airtable, Glide) to build a clickable prototype in one weekend. Get it in front of real users by Monday. Speed beats perfection every time.\n\n📖 Reference: "Sprint" by Jake Knapp (Google Ventures) — the 5-day design sprint method. Adapt it to 2 days.\n\n⚡ Quick Win: Pick one no-code tool. Build a 3-screen prototype. Send the link to 10 people tonight. Ask: "What would make this worth $20/month to you?"',
    },
    {
      title: 'Pricing for Survival: Charge More Than You Think',
      badgeName: 'Price Setter',
      badgeIcon: '💰',
      description: 'New founders undercharge because they\'re scared. Price is a signal. Higher prices attract serious customers, filter out tire-kickers, and give you margin to actually serve them well.\n\n📖 Reference: "Monetizing Innovation" by Madhavan Ramanujam — how companies like LinkedIn and Uber price.\n\n⚡ Quick Win: Double your initial price. Offer it to the next 3 prospects. If one says yes, you were undercharging. If all three say no, ask what WOULD make it worth that price.',
    },
    {
      title: 'Pitching Strangers: Rejection Therapy',
      badgeName: 'Iron Skin',
      badgeIcon: '🛡️',
      description: 'Pitch your idea to 10 strangers who have no reason to be nice. Collect the brutal feedback. The goal is NOT to convince them — it\'s to find the hole in your logic before you spend money on it.\n\n📖 Reference: Jia Jiang\'s "Rejection Proof" — he did 100 days of intentional rejection. TED Talk is free.\n\n⚡ Quick Win: Go to a co-working space or coffee shop. Pitch your idea to 5 people you\'ve never met. Ask: "What\'s the biggest reason you wouldn\'t buy this?" Write down every answer.',
    },
    {
      title: 'Securing the First Letter of Intent (LOI)',
      badgeName: 'Deal Closer',
      badgeIcon: '📝',
      description: 'Get a potential customer to sign a non-binding letter of intent — "If you build X with Y features by Z date, I will pay $W." This is the strongest validation signal short of actual payment.\n\n📖 Reference: B2B SaaS playbook — search "LOI template B2B" and adapt.\n\n⚡ Quick Win: Find the person you had the best conversation with in Levels 22-23. Ask them: "If I build this exactly as we discussed, would you sign a letter of intent to buy at launch?"',
    },
    {
      title: 'Analyzing Initial User Feedback',
      badgeName: 'Data Miner',
      badgeIcon: '📊',
      description: 'Categorize all feedback from interviews, prototypes, and tests into themes. Look for patterns, not one-off opinions. The things people mention unprompted are the things you should build.\n\n📖 Reference: "Don\'t Make Me Think" by Steve Krug — for understanding user behavior.\n\n⚡ Quick Win: Create a simple spreadsheet. Column 1: Quote from user. Column 2: Theme (pricing, UX, missing feature, trust). Sort by frequency. Build what appears most.',
    },
    {
      title: 'Milestone: Product-Market Validation',
      badgeName: 'Validated',
      badgeIcon: '✅',
      description: 'Do you have evidence that real people want this, will use it, and will PAY for it? Not friends. Not "that sounds interesting." Real signals: LOIs signed, pre-orders collected, manual service paid for.\n\n📖 Reference: Marc Andreessen\'s essay "The Only Thing That Matters" (pmarchive.com).\n\n⚡ Quick Win: Can you point to at least ONE person who paid you real money? If yes — advance. If no — go back to Level 24. Sell something manually first.',
    },
  ],

  // ═══════════════════════════════════════════════════════════════
  // Phase 3: Guerrilla Marketing & Launch (Levels 31–40)
  // ═══════════════════════════════════════════════════════════════
  [
    {
      title: 'Zero-Dollar Marketing: The Guerrilla Playbook',
      badgeName: 'Guerrilla',
      badgeIcon: '🪖',
      description: 'Marketing doesn\'t need a budget — it needs creativity and effort. Content, community engagement, viral stunts, and DMs cost nothing but time. Start here before you spend a cent on ads.\n\n📖 Reference: "Guerrilla Marketing" by Jay Conrad Levinson — the original playbook. Also: "This Is Marketing" by Seth Godin.\n\n⚡ Quick Win: List 10 free marketing channels (Twitter, Reddit, LinkedIn, TikTok, forums, podcasts as guest, email newsletters, YouTube comments, local events, referral ask). Pick 3. Execute this week.',
    },
    {
      title: 'Hijacking Attention: Social Media Leverage',
      badgeName: 'Growth Hacker',
      badgeIcon: '📱',
      description: 'You don\'t need followers — you need attention. Comment on big accounts in your niche. Create content that polarizes. Reply to every comment. The algorithm rewards consistency and controversy.\n\n📖 Reference: "The Hype Machine" by Sinan Aral (MIT) — how social media actually spreads.\n\n⚡ Quick Win: Find the top 5 accounts in your niche. Comment value (not "great post!") on their content for 7 days straight. Track profile visits and follower growth. It works.',
    },
    {
      title: 'Launching on Product Hunt & Hacker News',
      badgeName: 'Hunter',
      badgeIcon: '🏹',
      description: 'A well-executed Product Hunt launch can bring your first 1,000 users in 24 hours. But it requires preparation: a great tagline, a maker comment that tells a story, and a community that supports you.\n\n📖 Reference: "Product Hunt Launch Guide" by Chris Messina (free, searchable).\n\n⚡ Quick Win: Create a Product Hunt upcoming page TODAY. Write your tagline (60 chars max), description, and first comment. Start engaging with other makers. Launch in 2 weeks minimum.',
    },
    {
      title: 'Engineering Viral Loops & Referral Systems',
      badgeName: 'Viral Engineer',
      badgeIcon: '🔄',
      description: 'Every user should bring at least one more user. Dropbox gave free storage for referrals (grew 3900%). PayPal literally paid people to sign up ($20/referral). Design your loop.\n\n📖 Reference: "Viral Loop" by Adam Penenberg — case studies from the fastest-growing companies in history.\n\n⚡ Quick Win: Brainstorm 3 referral incentives. Offer something your ICP actually wants (not a sticker). Test the simplest one this month.',
    },
    {
      title: 'Content as Leverage: SEO & Writing to Win',
      badgeName: 'Content King',
      badgeIcon: '✍️',
      description: 'A blog post you write today can bring customers for 5 years. SEO is compound interest. Write about the problems your customers Google at 2am. Answer them better than anyone else.\n\n📖 Reference: "They Ask, You Answer" by Marcus Sheridan — a car salesman who built a $100M business with content.\n\n⚡ Quick Win: Use AnswerThePublic.com (free). Type in your niche keyword. Write one article answering the top question. Publish it this week.',
    },
    {
      title: 'B2B Trojan Horses: Offering Free Audits',
      badgeName: 'Trojan',
      badgeIcon: '🐴',
      description: 'Give away a free audit, assessment, or consultation that naturally leads to your paid solution. "I noticed your website has 3 conversion leaks. Want a free 5-minute video showing you how to fix them?"\n\n📖 Reference: This is Alex Hormozi\'s entire Gym Launch strategy. Free value → paid client. Read "$100M Offers."\n\n⚡ Quick Win: Design a free audit you could deliver in 15 minutes. Offer it to 5 prospects today. If 2 accept, you have a lead magnet.',
    },
    {
      title: 'Street-Level Tactics: Local Domination',
      badgeName: 'Street Hustler',
      badgeIcon: '🏙️',
      description: 'Sometimes the best move is offline. Flyers, stickers, local events, bulletin boards, meetups. Your competitors are all online — that means the physical world is wide open.\n\n📖 Reference: Gary Vaynerchuk\'s "Crush It!" — especially the chapter on local domination.\n\n⚡ Quick Win: Identify one local channel your competitors ignore. A college campus? A co-working space? A coffee shop bulletin board? Execute one offline tactic this week.',
    },
    {
      title: 'Strategic Partnerships: Borrowing Audiences',
      badgeName: 'Alliance Builder',
      badgeIcon: '🤝',
      description: 'Why build an audience from scratch when you can borrow one? Partner with complementary businesses, newsletters, podcasts, and communities that already serve your ICP.\n\n📖 Reference: "Never Lose a Customer Again" by Joey Coleman — on the power of partnerships.\n\n⚡ Quick Win: List 5 businesses that serve your ICP but don\'t compete with you. Reach out to one: "I have an idea that makes us both money. Free 10-minute call?"',
    },
    {
      title: 'Media & PR: Creating the Narrative',
      badgeName: 'Storyteller',
      badgeIcon: '📰',
      description: 'Journalists don\'t care about your product — they care about a story. Your launch is not news. Your founder journey, the problem you\'re solving, or a controversial take on your industry IS.\n\n📖 Reference: "Trust Me, I\'m Lying" by Ryan Holiday — a media manipulator\'s confession.\n\n⚡ Quick Win: Write a pitch email (4 sentences max) to one journalist or newsletter curator. Lead with the story, not the product. Send it this week.',
    },
    {
      title: 'Milestone: The 100 True Fans Checkpoint',
      badgeName: 'Beloved',
      badgeIcon: '❤️',
      description: 'Kevin Kelly\'s theory: you only need 1,000 true fans to build a sustainable business. Each pays you $100/year = $100K. A true fan will drive 6 hours to see you. A true fan buys everything you make.\n\n📖 Reference: Kevin Kelly\'s "1,000 True Fans" essay (free on kk.org).\n\n⚡ Quick Win: Count your true fans — people who\'ve paid you, referred someone, or engaged deeply. If you have less than 10, go back to Levels 31-38. Marketing isn\'t working yet.',
    },
  ],

  // ═══════════════════════════════════════════════════════════════
  // Phase 4: Sales Engine & CRM (Levels 41–50)
  // ═══════════════════════════════════════════════════════════════
  [
    {
      title: 'Setting Up the CRM Architecture',
      badgeName: 'CRM Master',
      badgeIcon: '🗄️',
      description: 'A CRM is your sales memory. Every lead, every conversation, every follow-up tracked. Start simple — a spreadsheet works for your first 50 customers. Graduate to HubSpot or Pipedrive when you have too many to remember.\n\n📖 Reference: "Predictable Revenue" by Aaron Ross — how Salesforce grew from zero.\n\n⚡ Quick Win: Create a Google Sheet with columns: Name, Company, Contact Info, Last Contact, Next Step, Deal Value, Probability. Fill it with 10 leads today.',
    },
    {
      title: 'Lead Scoring & Qualification (BANT)',
      badgeName: 'Qualifier',
      badgeIcon: '🎯',
      description: 'Not all leads are equal. BANT: Budget (can they pay?), Authority (can they decide?), Need (do they have the problem?), Timeline (when will they buy?). Score every lead. Focus on the hot ones.\n\n📖 Reference: "SPIN Selling" by Neil Rackham — the most researched sales methodology ever.\n\n⚡ Quick Win: Rate your top 10 leads using BANT (1-5 each). Multiply the scores. Sort by total. Call the top 3 this week.',
    },
    {
      title: 'Designing the Automated Nurture Sequence',
      badgeName: 'Automator',
      badgeIcon: '🤖',
      description: 'Most leads aren\'t ready to buy today — but they will be someday. Build an email sequence that stays in touch without being annoying. Value in every email. No "just checking in."\n\n📖 Reference: "DotCom Secrets" by Russell Brunson — the master of funnel automation.\n\n⚡ Quick Win: Write a 5-email nurture sequence. Email 1: valuable insight. Email 2: case study. Email 3: common mistake. Email 4: tool/template. Email 5: soft pitch. Set it up in ConvertKit (free tier).',
    },
    {
      title: 'The Art of the Cold Call & Voicemail',
      badgeName: 'Cold Caller',
      badgeIcon: '📞',
      description: 'Cold calling isn\'t dead — bad cold calling is dead. Open with a hook about THEIR problem, qualify in 30 seconds, and leave voicemails that make them curious enough to call back. Practice makes fearless.\n\n📖 Reference: "Fanatical Prospecting" by Jeb Blount — Chapter 8 on phone prospecting.\n\n⚡ Quick Win: Write a 30-second cold call script. Practice it on 5 real prospects today. Your goal is not to close — it\'s to book a 15-minute follow-up call.',
    },
    {
      title: 'Crafting the Perfect Sales Deck',
      badgeName: 'Pitch Master',
      badgeIcon: '📊',
      description: 'Your sales deck tells a story: Here\'s the problem → Here\'s the cost of not fixing it → Here\'s our solution → Here\'s proof it works → Here\'s the price → Here\'s what to do next. 12 slides max. No one ever complained a deck was too short.\n\n📖 Reference: "Resonate" by Nancy Duarte — the science of presentations.\n\n⚡ Quick Win: Build your deck. Present it to a friend who knows nothing about your industry. If they can explain it back to you, it works.',
    },
    {
      title: 'Handling Objections & Closing Techniques',
      badgeName: 'Closer',
      badgeIcon: '🔑',
      description: '"It\'s too expensive" = "I don\'t see the value yet." "I need to think about it" = "You haven\'t made it urgent." Every objection has a root cause. Learn to diagnose before you prescribe.\n\n📖 Reference: "The Challenger Sale" by Matthew Dixon — teach, tailor, take control.\n\n⚡ Quick Win: List the top 5 objections you hear. Write a 2-sentence response for each. Practice until it\'s automatic. The goal is never to argue — it\'s to reframe.',
    },
    {
      title: 'Contract Negotiation & E-Signatures',
      badgeName: 'Negotiator',
      badgeIcon: '🖊️',
      description: 'Friction kills deals. Use e-signatures (DocuSign, PandaDoc, HelloSign). Know your walk-away terms before you negotiate. The person most willing to walk away has the power.\n\n📖 Reference: "Never Split the Difference" by Chris Voss — former FBI hostage negotiator.\n\n⚡ Quick Win: Set up a free PandaDoc or HelloSign account. Create a simple one-page agreement template. Have a payment link ready. Reduce "sign to paid" time to under 5 minutes.',
    },
    {
      title: 'Customer Onboarding Automation',
      badgeName: 'Onboarder',
      badgeIcon: '🚢',
      description: 'The first 72 hours after purchase determine whether a customer stays or churns. Automate your welcome: thank-you email, setup guide, quick-win checklist, and a personal check-in. Time to first value must be measured in hours, not days.\n\n📖 Reference: "The Customer Success Economy" by Nick Mehta & Allison Pickens.\n\n⚡ Quick Win: Write a 3-email onboarding sequence. Email 1 (immediate): receipt + thank you + first step. Email 2 (day 2): tip to get quick win. Email 3 (day 5): check-in + ask for feedback. Automate it.',
    },
    {
      title: 'Tracking Sales Velocity & Conversion Rates',
      badgeName: 'Sales Analyst',
      badgeIcon: '📈',
      description: 'Sales velocity = (Number of deals × Average deal size × Win rate) ÷ Sales cycle length. Measure each variable. Improve the weakest link. What gets measured gets managed.\n\n📖 Reference: "Cracking the Sales Management Code" by Jason Jordan — the metrics that actually matter.\n\n⚡ Quick Win: Calculate your current sales velocity. Which of the 4 variables is your bottleneck? Focus this entire week on improving just that one.',
    },
    {
      title: 'Milestone: The Predictable Revenue Engine',
      badgeName: 'Revenue Engine',
      badgeIcon: '⚙️',
      description: 'When you know that X cold calls = Y meetings = Z closed deals, you have a predictable engine. You can forecast revenue. You can scale. The guesswork is gone. Now you can pour fuel on the fire.\n\n📖 Reference: "Predictable Revenue" by Aaron Ross — read the whole book. It changed SaaS forever.\n\n⚡ Quick Win: Can you predict next month\'s revenue within 20% based on this month\'s inputs? If yes — advance. If no — tighten your tracking.',
    },
  ],

  // ═══════════════════════════════════════════════════════════════
  // Phase 5: Product & Tech Foundation (Levels 51–60)
  // ═══════════════════════════════════════════════════════════════
  [
    {
      title: 'Tech Stack Selection & Future-Proofing',
      badgeName: 'Architect',
      badgeIcon: '🏗️',
      description: 'By now you have paying customers. NOW choose your tech stack with scalability in mind. Document why each choice was made and what tradeoffs exist. Don\'t over-engineer — you can always migrate later.\n\n📖 Reference: "The Pragmatic Programmer" by Hunt & Thomas — timeless engineering wisdom.\n\n⚡ Quick Win: Write a one-page "tech stack decision doc." For each choice, list the alternative you considered and why you chose this one. Share it with a technical friend for a sanity check.',
    },
    {
      title: 'UI/UX Fundamentals: Designing for Conversion',
      badgeName: 'Designer',
      badgeIcon: '🎨',
      description: 'Your design should guide users toward your key action — sign up, buy, share. Remove everything that doesn\'t serve that goal. Great UI is invisible. Great UX is frictionless.\n\n📖 Reference: "Don\'t Make Me Think" by Steve Krug — the UX bible. Read it in one afternoon.\n\n⚡ Quick Win: Do a "5-second test" — show your homepage to someone for 5 seconds, then ask what they remember. If they can\'t recall your value proposition, redesign.',
    },
    {
      title: 'Establishing Development Sprints & Agile Ops',
      badgeName: 'Scrum Master',
      badgeIcon: '🔄',
      description: '2-week sprint cycles with clear rituals: planning Monday, daily standups, demo Friday, retrospective. Ship something every sprint. If you haven\'t shipped in 2 weeks, your sprint is too big.\n\n📖 Reference: "Scrum: The Art of Doing Twice the Work in Half the Time" by Jeff Sutherland.\n\n⚡ Quick Win: Plan your first sprint. Write 3-5 tasks on sticky notes. Each task must be completable in 1-2 days. Start Monday. Ship by Friday.',
    },
    {
      title: 'Setting Up Analytics (Mixpanel / Google Analytics)',
      badgeName: 'Analyst',
      badgeIcon: '📈',
      description: 'Install analytics from day one of your product. Track: signups, activation (user reaches "aha moment"), retention (do they come back?), and revenue. You cannot improve what you do not measure.\n\n📖 Reference: "Lean Analytics" by Croll & Yoskovitz — especially the "Analytics Frameworks" chapter.\n\n⚡ Quick Win: Install one analytics tool today (PostHog is free and open-source). Set up 5 key events to track. Check the dashboard daily for the first week.',
    },
    {
      title: 'Implementing Event Tracking for the North Star Metric',
      badgeName: 'Tracker',
      badgeIcon: '🎯',
      description: 'Your North Star metric (from Level 9) needs instrumentation. Every step a user takes toward that metric should be an event you can track. Where do users drop off? That\'s your priority.\n\n📖 Reference: Amplitude\'s "North Star Playbook" — free PDF, extremely practical.\n\n⚡ Quick Win: Map your user journey from signup to North Star action. Instrument each step. Launch. Wait 1 week. Find the biggest drop-off step. That\'s your next sprint.',
    },
    {
      title: 'Technical SEO Architecture',
      badgeName: 'SEO Hacker',
      badgeIcon: '🔍',
      description: 'SEO isn\'t just content — it\'s architecture. Proper meta tags, sitemaps, structured data, semantic HTML, fast load times. Google rewards sites that are technically excellent, not just well-written.\n\n📖 Reference: Moz\'s "Beginner\'s Guide to SEO" (free, updated yearly).\n\n⚡ Quick Win: Run your site through Google PageSpeed Insights and Lighthouse. Fix the top 3 issues. Submit your sitemap to Google Search Console. Free traffic starts here.',
    },
    {
      title: 'Bug Tracking & QA Protocols',
      badgeName: 'Bug Hunter',
      badgeIcon: '🐛',
      description: 'Every bug found in production is a learning opportunity — but only if you track and fix it. Set up a bug tracking system (Linear, Jira, GitHub Issues). Define severity levels and response times.\n\n📖 Reference: "Site Reliability Engineering" by Google (free online) — how the best handle incidents.\n\n⚡ Quick Win: Create a "Bug Report" template. Share it with your first 10 users. Offer a small reward (discount, swag) for the first bug found. Fix it within 24 hours.',
    },
    {
      title: 'Security Basics & Penetration Testing',
      badgeName: 'Guardian',
      badgeIcon: '🛡️',
      description: 'HTTPS everywhere. Input validation on every form. Dependency audits weekly. A single data breach kills early-stage companies. Security is not a feature — it\'s table stakes.\n\n📖 Reference: OWASP Top 10 (free) — the 10 most common web vulnerabilities.\n\n⚡ Quick Win: Run `npm audit` (or equivalent for your stack). Fix every "high" or "critical" finding. Enable 2FA on every account (GitHub, hosting, email, domain registrar).',
    },
    {
      title: 'Server Architecture & Hosting Optimization',
      badgeName: 'Server Lord',
      badgeIcon: '🖥️',
      description: 'Use a CDN (Cloudflare is free). Enable caching. Set up auto-scaling if you\'re on cloud. Your site should load in under 2 seconds anywhere in the world. Slow sites lose 53% of mobile visitors.\n\n📖 Reference: "High Performance Browser Networking" by Ilya Grigorik (free online from Google).\n\n⚡ Quick Win: Put Cloudflare in front of your site (free tier takes 5 minutes). Enable auto-minify and Brotli compression. Measure load time before and after.',
    },
    {
      title: 'Milestone: Version 1.0 Ready',
      badgeName: 'Launcher',
      badgeIcon: '🚀',
      description: 'Your product is built, tested, and stable. Analytics are in place. SEO is configured. Security is solid. You have paying customers and a predictable sales engine. The foundation is ready.\n\n📖 Reference: Re-read your Phase 1 mission. Are you still aligned? If the product has drifted, course-correct now.\n\n⚡ Quick Win: Do a full product walkthrough as if you\'re a brand-new user. Sign up, onboard, use the core feature. Note every moment of friction. Fix the top 3.',
    },
  ],

  // ═══════════════════════════════════════════════════════════════
  // Phase 6: Legal, Finance & Admin (Levels 61–70)
  // ═══════════════════════════════════════════════════════════════
  [
    {
      title: 'Choosing the Right Legal Entity (C-Corp, LLC)',
      badgeName: 'Lawful',
      badgeIcon: '⚖️',
      description: 'If you plan to raise VC: Delaware C-Corp. If you\'re bootstrapping and want simplicity: LLC. Don\'t incorporate before you have paying customers — it\'s a common founder mistake. Revenue first, entity second.\n\n📖 Reference: "Venture Deals" by Brad Feld & Jason Mendelson — the legal bible for founders.\n\n⚡ Quick Win: If you have revenue: use Stripe Atlas ($500) or Clerky ($799) to incorporate a Delaware C-Corp in under a week. If pre-revenue: wait.',
    },
    {
      title: 'Founder Vesting Schedules (4-Year / 1-Year Cliff)',
      badgeName: 'Vested',
      badgeIcon: '⏳',
      description: 'Standard vesting: 4 years total, 1-year cliff. If a co-founder leaves after 6 months, they get nothing. This protects everyone. Investors expect it. Don\'t skip this.\n\n📖 Reference: YC\'s "Founder Equity" guide (startupschool.org).\n\n⚡ Quick Win: Write down your vesting terms in plain English. Have each co-founder sign it. TODAY. Even on a napkin. Formalize with a lawyer later.',
    },
    {
      title: 'Setting Up the Cap Table Properly',
      badgeName: 'Cap Master',
      badgeIcon: '📋',
      description: 'Your cap table shows who owns what. Keep it clean: founders, any early advisors (0.25-1% max), and an option pool for future hires (10-20%). A messy cap table kills fundraising.\n\n📖 Reference: Carta\'s free cap table tool and their blog posts on cap table hygiene.\n\n⚡ Quick Win: Create your cap table in a spreadsheet. Columns: Name, Shares, % Ownership, Vesting Schedule, Cliff Date. Update it after every equity decision.',
    },
    {
      title: 'IP Assignment & Trademarks',
      badgeName: 'IP Guardian',
      badgeIcon: '🔐',
      description: 'Every founder, employee, and contractor must sign an IP assignment agreement. The company owns everything they create. File a provisional patent if you have novel technology. It costs ~$70.\n\n📖 Reference: USPTO\'s "Provisional Patent" guide — you can file one yourself without a lawyer.\n\n⚡ Quick Win: Download a standard IP assignment agreement template. Have every person who\'s contributed code or content sign it. Scan and store securely.',
    },
    {
      title: 'Opening Corporate Banking & Stripe Setup',
      badgeName: 'Banker',
      badgeIcon: '🏦',
      description: 'Separate business and personal finances immediately. Open a business bank account (Mercury, Brex, or traditional). Connect Stripe for payments. Never co-mingle funds — it pierces the corporate veil.\n\n📖 Reference: "Profit First" by Mike Michalowicz — a cash management system for entrepreneurs.\n\n⚡ Quick Win: Open a Mercury account (free, online, 10 minutes). Connect Stripe if not already done. Move all business revenue to the business account from this point forward.',
    },
    {
      title: 'Basic Accounting & Chart of Accounts Setup',
      badgeName: 'Bookkeeper',
      badgeIcon: '📒',
      description: 'Set up accounting software (QuickBooks, Xero, or Wave — all have free/low-cost tiers). Create a chart of accounts: Revenue, COGS, Operating Expenses, Assets, Liabilities, Equity. Future you will thank present you.\n\n📖 Reference: "Accounting Made Simple" by Mike Piper — read in 2 hours, understand accounting forever.\n\n⚡ Quick Win: Sign up for Wave (free). Categorize every transaction from the last 3 months. Run a Profit & Loss report. Know your numbers.',
    },
    {
      title: 'Employee Stock Option Pool (ESOP) Basics',
      badgeName: 'Equity Planner',
      badgeIcon: '📦',
      description: 'Set aside 10-20% of equity for future hires. Options typically vest over 4 years with a 1-year cliff. Early employees might get 0.5-2%. Understand ISOs vs NSOs and the 409A valuation.\n\n📖 Reference: "The Holloway Guide to Equity Compensation" — the definitive resource.\n\n⚡ Quick Win: Decide on your option pool size. Document it in your cap table. Even if you have no employees yet, plan for the first 3 hires.',
    },
    {
      title: 'Data Privacy (GDPR / CCPA) Compliance',
      badgeName: 'Privacy Pro',
      badgeIcon: '🔒',
      description: 'Privacy laws apply even to tiny startups. You need: a privacy policy (what you collect, why, how to delete), cookie consent if using tracking, and the ability to delete user data on request.\n\n📖 Reference: Termly\'s free privacy policy generator (termly.io) — solid starting point.\n\n⚡ Quick Win: Generate a privacy policy. Add it to your site footer. Set up a cookie consent banner (CookieYes has a free tier). Done in 30 minutes.',
    },
    {
      title: 'Insurance: D&O and General Liability',
      badgeName: 'Insured',
      badgeIcon: '🛡️',
      description: 'Directors & Officers insurance protects you personally from lawsuits about your business decisions. General liability covers accidents. Both are cheaper than you think — often under $100/month.\n\n📖 Reference: Talk to a startup-focused insurance broker (Vouch, Embroker, or Founder Shield).\n\n⚡ Quick Win: Get a quote from Vouch (vouch.us) — built for startups, online, 10 minutes. Compare with one other provider.',
    },
    {
      title: 'Milestone: The Legal & Financial Fortress',
      badgeName: 'Fortified',
      badgeIcon: '🏰',
      description: 'Your legal and financial foundation is solid. Entity formed, cap table clean, IP assigned, banking separate, accounting running, insurance active. No loose ends that could derail you later.\n\n📖 Reference: Review all documents from this phase. Keep a "Legal" folder with everything organized.\n\n⚡ Quick Win: Create a 1-page "Legal & Financial Checklist." Tick every item. Store all documents in one cloud folder shared with co-founders.',
    },
  ],

  // ═══════════════════════════════════════════════════════════════
  // Phase 7: Operations & The Machine (Levels 71–80)
  // ═══════════════════════════════════════════════════════════════
  [
    {
      title: 'Documenting Standard Operating Procedures (SOPs)',
      badgeName: 'Documenter',
      badgeIcon: '📋',
      description: 'If it happens more than twice, document it. SOPs are your business\'s memory. They let you delegate, scale, and eventually replace yourself in day-to-day operations. Video SOPs (Loom) are even faster.\n\n📖 Reference: "The E-Myth Revisited" by Michael Gerber — why most small businesses fail and how to systemize.\n\n⚡ Quick Win: Record a Loom video of your most frequent task (5 minutes max). Write 3 bullet points below it. Share with one person and see if they can do it without asking questions.',
    },
    {
      title: 'Replacing Yourself: Fire the Founder from Day-to-Day',
      badgeName: 'Delegator',
      badgeIcon: '🔄',
      description: 'If the business stops when you stop, you don\'t have a business — you have a job. Identify every task ONLY you can do. Systematically build systems and hire people to take over everything else.\n\n📖 Reference: "Clockwork" by Mike Michalowicz — design your business to run itself.\n\n⚡ Quick Win: Track your time for one week (Toggl is free). Categorize every hour as: Strategic (only you) or Operational (can be delegated). Target: shift 10% of operational hours to someone else this month.',
    },
    {
      title: 'Radical Truth & Transparency in the Team',
      badgeName: 'Transparent',
      badgeIcon: '🔮',
      description: 'Problems don\'t age well. Build a culture where bad news travels fast and honest feedback is a gift, not a threat. Share the real numbers — revenue, churn, runway. Your team can\'t help fix what they don\'t know about.\n\n📖 Reference: "Principles" by Ray Dalio — especially the section on "Radical Truth and Radical Transparency."\n\n⚡ Quick Win: At your next team meeting, share one uncomfortable truth about the business. Model the behavior. Ask: "What\'s the thing nobody is saying out loud?"',
    },
    {
      title: 'Automating Admin Hacks (Zapier / n8n / AI)',
      badgeName: 'Automation Wizard',
      badgeIcon: '🧙',
      description: 'Every hour spent on repetitive admin is an hour stolen from growth. Automate invoicing, reporting, data entry, social media scheduling. Use Zapier (no-code), n8n (self-hosted), or AI agents. Set it and forget it.\n\n📖 Reference: "Automate Your Busywork" by Aytekin Tank (JotForm founder) — simple automation philosophy.\n\n⚡ Quick Win: Find your most annoying recurring task. Automate it with Zapier (free tier gives 100 tasks/month). Time saved this week alone.',
    },
    {
      title: 'Designing Algorithmic Decision-Making',
      badgeName: 'Algorithmist',
      badgeIcon: '🧮',
      description: 'Create decision frameworks for recurring choices: hiring (scorecard), feature prioritization (ICE: Impact, Confidence, Ease), vendor selection (requirements matrix). Remove gut feeling from repeatable decisions.\n\n📖 Reference: "Decisive" by Chip & Dan Heath — a framework for better decisions.\n\n⚡ Quick Win: Build an ICE spreadsheet for your next 10 feature ideas. Score each 1-10 on Impact, Confidence, and Ease. Multiply. Build the highest score.',
    },
    {
      title: 'Customer Success & Churn Mitigation',
      badgeName: 'Retention Pro',
      badgeIcon: '❤️',
      description: 'It costs 5-25x more to acquire a new customer than keep an existing one. Build a customer success playbook: health scores, check-in cadence, at-risk early warning signs. Churn is a silent killer.\n\n📖 Reference: "The Customer Success Economy" by Nick Mehta — the definitive guide.\n\n⚡ Quick Win: Calculate your monthly churn rate. If it\'s above 5%, you have a leaky bucket. Call your last 3 churned customers and ask: "What happened?" The answers will save your business.',
    },
    {
      title: 'Ticketing Systems for Support',
      badgeName: 'Support Hero',
      badgeIcon: '🎫',
      description: 'As you scale, support requests multiply. Set up a help desk (Intercom, Zendesk, or Linear). Categorize by type, prioritize by severity, and measure response time. Customers remember how fast you replied, not what you said.\n\n📖 Reference: Intercom\'s "The Guide to Customer Support" — free, practical, written by people who do it.\n\n⚡ Quick Win: Set up a free Intercom or Crisp chat widget on your site. Create 3 saved replies for your most common questions. Respond to every inquiry within 1 hour this week.',
    },
    {
      title: 'Vendor Management & Supply Chain',
      badgeName: 'Supply Chain',
      badgeIcon: '🔗',
      description: 'Map every vendor and supplier. Who are you dependent on? What happens if they disappear tomorrow? Have backups for critical vendors. Negotiate better terms as you grow — loyalty discounts are real.\n\n📖 Reference: "The Goal" by Eliyahu Goldratt — a business novel about bottlenecks and supply chains.\n\n⚡ Quick Win: List your top 5 vendors. For each, identify what breaks if they disappear. Find one backup for your most critical dependency.',
    },
    {
      title: 'Financial Dashboards: Daily Cash Flow Tracking',
      badgeName: 'CFO',
      badgeIcon: '💵',
      description: 'Build a simple dashboard: cash in (today/this month), cash out, runway (months until cash runs out at current burn), and key ratios. Update it daily. Never be surprised by your bank balance.\n\n📖 Reference: "Financial Intelligence" by Berman & Knight — finance for non-finance founders.\n\n⚡ Quick Win: Open a Google Sheet. Row 1: Date. Row 2: Cash balance. Row 3: Revenue today. Row 4: Expenses today. Row 5: Days of runway. Fill it in every morning. Takes 2 minutes.',
    },
    {
      title: 'Milestone: The Self-Sustaining Machine',
      badgeName: 'Automaton',
      badgeIcon: '🤖',
      description: 'Your business runs without you in the day-to-day. Systems, automations, and people handle operations. You can take a 2-week vacation and revenue doesn\'t dip. This is the goal.\n\n📖 Reference: "The 4-Hour Workweek" by Tim Ferriss — not about working 4 hours, but about designing a business that can.\n\n⚡ Quick Win: Take a "mini-vacation" — 3 days completely offline. When you return, what broke? Those are the systems you need to build next.',
    },
  ],

  // ═══════════════════════════════════════════════════════════════
  // Phase 8: Talent & Culture (Levels 81–90)
  // ═══════════════════════════════════════════════════════════════
  [
    {
      title: 'Defining the Employer Brand',
      badgeName: 'Employer Brand',
      badgeIcon: '🏢',
      description: 'Why should top talent choose you over FAANG? You can\'t match their salary — but you can offer impact, autonomy, mission, and speed. Define your employer value proposition clearly.\n\n📖 Reference: "The Alliance" by Reid Hoffman — managing talent as a tour of duty.\n\n⚡ Quick Win: Write a 3-bullet "Why work with us" section. Test it: ask 5 engineer friends if it would make them curious. Iterate until 3/5 say yes.',
    },
    {
      title: 'Writing High-Conversion Job Descriptions',
      badgeName: 'Recruiter',
      badgeIcon: '📝',
      description: 'Most job descriptions are laundry lists of requirements. A-players are attracted to impact, ownership, and mission — not "5+ years of React." Lead with what they\'ll build and who they\'ll become.\n\n📖 Reference: "Who" by Geoff Smart — the A-method for hiring.\n\n⚡ Quick Win: Rewrite one job description. Lead with: "In your first 90 days, you will [specific impact]." Remove every requirement that isn\'t actually required. Post it.',
    },
    {
      title: 'The Interview Scorecard & Hiring A-Players',
      badgeName: 'A-Player Hunter',
      badgeIcon: '⭐',
      description: 'Structured interviews beat gut feeling every time. Create a scorecard: 5-7 criteria, rated 1-5 by each interviewer. Compare scores, not impressions. A-players raise the average of everyone around them.\n\n📖 Reference: "Work Rules!" by Laszlo Bock (former Google HR head) — how Google hires.\n\n⚡ Quick Win: Build a scorecard for your next open role. Every interviewer uses the same criteria. Debrief within 24 hours while memories are fresh. Hire slow, fire fast.',
    },
    {
      title: 'Onboarding Processes for New Hires',
      badgeName: 'Onboarder',
      badgeIcon: '🚀',
      description: 'Design a 30-60-90 day onboarding plan. Day 1: laptop, access, buddy assigned. Week 1: ship something small to production. Month 1: own a project. Month 3: present results to the team. Momentum matters.\n\n📖 Reference: "The First 90 Days" by Michael Watkins — the onboarding bible.\n\n⚡ Quick Win: Write a "Day 1 Checklist" for your next new hire. Everything they need: accounts, tools, introductions, first task. Make their first day feel organized, not chaotic.',
    },
    {
      title: 'Setting OKRs (Objectives & Key Results)',
      badgeName: 'Goal Setter',
      badgeIcon: '🎯',
      description: 'Objectives = where you want to go. Key Results = how you know you\'re getting there. Company OKRs → Team OKRs → Individual OKRs. Everyone should see how their work connects to the mission.\n\n📖 Reference: "Measure What Matters" by John Doerr — the book that brought OKRs from Intel to Google to the world.\n\n⚡ Quick Win: Set 3 company OKRs for this quarter. Each has 3-5 measurable KRs. Share them with the entire team. Review progress every Friday.',
    },
    {
      title: 'Asynchronous Work & Remote Optimization',
      badgeName: 'Async Master',
      badgeIcon: '🌍',
      description: 'Default to async: written updates > meetings, recorded demos > live presentations, documentation > tribal knowledge. Async lets you hire globally and gives everyone deep work time. Meetings are the last resort.\n\n📖 Reference: GitLab\'s "Remote Playbook" (free, comprehensive) — the largest all-remote company.\n\n⚡ Quick Win: Cancel one recurring meeting this week and replace it with a written update. See if anything breaks. If not, keep it canceled.',
    },
    {
      title: 'Performance Reviews & Radical Candor',
      badgeName: 'Coach',
      badgeIcon: '💬',
      description: 'Care personally, challenge directly. Performance reviews should never be a surprise — give feedback continuously. The annual review is a summary of conversations that already happened, not the first time someone hears it.\n\n📖 Reference: "Radical Candor" by Kim Scott — the framework every manager needs.\n\n⚡ Quick Win: Give one piece of direct, caring feedback to a team member today. Start with: "I\'m giving you this feedback because I believe in your potential." Be specific. Be actionable.',
    },
    {
      title: 'Handling Terminations Gracefully',
      badgeName: 'Graceful Exit',
      badgeIcon: '🤲',
      description: 'Firing is the hardest part of building a team — but keeping the wrong person poisons the culture. Be direct, be respectful, provide a fair severance, and preserve the person\'s dignity. How you fire is remembered.\n\n📖 Reference: "No Rules Rules" by Reed Hastings — Netflix\'s culture of high performance.\n\n⚡ Quick Win: Write a termination checklist: final paycheck timing, equipment return, access revocation, team communication, offboarding meeting. Have it ready before you need it.',
    },
    {
      title: 'Leadership Offsites & Culture Building',
      badgeName: 'Culture Builder',
      badgeIcon: '🏕️',
      description: 'Intentional offsites strengthen bonds and align strategy. The best ones mix deep work (strategy, retrospectives) with genuine connection (shared meals, activities). Remote teams need this even more — plan quarterly.\n\n📖 Reference: "The Culture Map" by Erin Meyer — navigating cultural differences in global teams.\n\n⚡ Quick Win: Plan a half-day offsite (even if virtual). Agenda: 30 min wins/celebrations, 60 min strategy discussion, 30 min "what\'s not working," 60 min fun activity. Ship the agenda this week.',
    },
    {
      title: 'Milestone: The High-Performance Team',
      badgeName: 'Dream Team',
      badgeIcon: '🏆',
      description: 'You have built a team of A-players who push each other to excel. People refer their talented friends because they love working here. Talent is your competitive advantage.\n\n📖 Reference: "Good to Great" by Jim Collins — "First who, then what." Get the right people on the bus.\n\n⚡ Quick Win: Ask each team member: "Would you refer your most talented former colleague to work here?" If anyone says no, dig into why. That\'s your culture problem.',
    },
  ],

  // ═══════════════════════════════════════════════════════════════
  // Phase 9: Capital & Investment (Levels 91–100)
  // ═══════════════════════════════════════════════════════════════
  [
    {
      title: 'Bootstrapping vs. VC: Choosing Your Game',
      badgeName: 'Path Chooser',
      badgeIcon: '🔀',
      description: 'VC is not the default — it\'s a specific choice for capital-intensive, high-growth businesses. Bootstrapping gives you freedom. VC gives you speed. Both can win. Choose consciously based on your market and goals.\n\n📖 Reference: "Company of One" by Paul Jarvis — why staying small is a valid (and profitable) strategy.\n\n⚡ Quick Win: Answer honestly: Can this business reach $1M ARR without outside capital? If yes, seriously consider bootstrapping. If the market requires speed (network effects, winner-take-all), VC may be right.',
    },
    {
      title: 'Alternative Funding: Bank Loans, Grants, Revenue Financing',
      badgeName: 'Fundraiser',
      badgeIcon: '💡',
      description: 'VC gets all the press but there are many ways to fund growth: SBA loans, government grants (SBIR/STTR), revenue-based financing (Pipe, Founderpath), or even customer pre-payments. Non-dilutive capital is the holy grail.\n\n📖 Reference: "Angel" by Jason Calacanis — covers the full funding landscape, not just angel investing.\n\n⚡ Quick Win: Research 3 non-VC funding sources relevant to your stage. SBIR grants for tech, SBA loans for US-based businesses, Pipe for SaaS with recurring revenue. Apply to one.',
    },
    {
      title: 'Preparing the Data Room & Cap Table Cleanup',
      badgeName: 'Data Room Pro',
      badgeIcon: '🗄️',
      description: 'Investors will ask for: financials, cap table, customer contracts, IP, team bios, market analysis, product roadmap. Assemble your data room before you start fundraising. Delays kill momentum — and momentum kills deals.\n\n📖 Reference: "Venture Deals" by Feld & Mendelson — the chapter on due diligence.\n\n⚡ Quick Win: Create a shared Google Drive folder: "Data Room." Add subfolders: Financials, Legal, Customers, Product, Team. Fill each with up-to-date documents. Done before your first investor meeting.',
    },
    {
      title: 'The YC Pitch Deck Formula',
      badgeName: 'YC Ready',
      badgeIcon: '📊',
      description: 'The canonical pitch deck: Problem → Solution → Market Size → How It Works → Traction → Team → Competition → Financials → Ask. Each section is 1-2 slides. The whole deck is under 15 slides. Any longer and you\'re rambling.\n\n📖 Reference: YC\'s "Guide to Seed Fundraising" (free on ycombinator.com).\n\n⚡ Quick Win: Build your deck using the YC template. Present it to 3 founder friends who\'ve raised before. Implement their feedback. Iterate 3 times before showing an investor.',
    },
    {
      title: 'Identifying Angel Investors & Syndicates',
      badgeName: 'Networker',
      badgeIcon: '🦋',
      description: 'Map the angel landscape: who invested in companies like yours? Who writes checks in your space? Target angels who bring more than money — introductions, expertise, credibility. One great angel is worth ten silent checks.\n\n📖 Reference: "AngelList" and "Crunchbase" — use them to research who invests in your category.\n\n⚡ Quick Win: Build a target list of 20 angels. For each: what companies they\'ve invested in, what they tweet about, who you know that can introduce you. Rank them. Start with #1.',
    },
    {
      title: 'Understanding Valuations & SAFEs',
      badgeName: 'Deal Maker',
      badgeIcon: '📜',
      description: 'SAFE = Simple Agreement for Future Equity. No interest, no maturity date, converts at next priced round. Valuation cap = max price investors pay. Discount = they get stock cheaper. Understand both before you negotiate.\n\n📖 Reference: YC\'s "SAFE User Guide" (free) — read the whole thing before signing anything.\n\n⚡ Quick Win: Model out a SAFE in a spreadsheet. "If we raise $1M on a $10M cap, what % do investors get? What if the next round is at $50M?" Run the scenarios.',
    },
    {
      title: 'The Investor Meeting: Framing the Narrative',
      badgeName: 'Storyteller',
      badgeIcon: '🎤',
      description: 'Every investor meeting is a performance. Open with a hook (the problem). Show momentum (traction graph up and to the right). Frame the opportunity as undeniable. End with a clear ask. Practice until it feels like breathing.\n\n📖 Reference: "Pitch Anything" by Oren Klaff — neuroscience-based persuasion techniques.\n\n⚡ Quick Win: Record yourself giving your pitch. Watch it. Cringe. Fix the weak parts. Do it again. Investors invest in confidence as much as business models.',
    },
    {
      title: 'Navigating the Due Diligence Process',
      badgeName: 'Due Diligence',
      badgeIcon: '🔍',
      description: 'Due diligence is an audit of everything you\'ve claimed. Respond to requests promptly and completely. Have legal counsel ready. A fast, organized response signals competence. Slow responses signal problems.\n\n📖 Reference: "Secrets of Sand Hill Road" by Scott Kupor (a16z managing partner) — the VC view of due diligence.\n\n⚡ Quick Win: Pre-empt due diligence. Prepare answers to the top 20 questions investors ask. Have documents ready before they request them. Speed = confidence = better terms.',
    },
    {
      title: 'Term Sheet Negotiation',
      badgeName: 'Terminator',
      badgeIcon: '⚖️',
      description: 'Focus on what matters: valuation (higher = less dilution), liquidation preference (1x non-participating is standard — anything more is aggressive), board control (you want founder-majority at seed), and option pool (comes out of YOUR share, negotiate it down).\n\n📖 Reference: "Venture Deals" by Feld & Mendelson — read Chapter 5 on term sheets before you negotiate.\n\n⚡ Quick Win: Get a lawyer who specializes in startup financing. Not your cousin who does real estate. Startup law is specific. The right lawyer pays for themselves in better terms.',
    },
    {
      title: 'Milestone: Capital In the Bank',
      badgeName: 'Funded',
      badgeIcon: '🏦',
      description: 'The round is closed. Capital is in the bank. Now the real work begins — deploy it wisely. More startups die from spending too fast after a raise than from failing to raise at all. Every dollar must have a job.\n\n📖 Reference: Re-read "The Lean Startup" — the principles apply even more after you raise. Stay lean.\n\n⚡ Quick Win: Create a 12-month deployment plan. How will each dollar be spent? What milestones must you hit before the next raise? If this round is your last, what\'s your path to profitability?',
    },
  ],

  // ═══════════════════════════════════════════════════════════════
  // Phase 10: Governance & The Infinite Game (Levels 101–110)
  // ═══════════════════════════════════════════════════════════════
  [
    {
      title: 'Setting Up a Real Board of Directors',
      badgeName: 'Board Member',
      badgeIcon: '👥',
      description: 'A great board makes you a better CEO. Recruit independent directors who bring expertise your founding team lacks. The best board members have been operators, not just investors. They\'ve sat in your chair.\n\n📖 Reference: "Startup Boards" by Brad Feld & Mahendra Ramsinghani — the definitive guide.\n\n⚡ Quick Win: Identify 2-3 potential independent board members. People who\'ve built what you\'re building. Reach out: "I\'m not asking you to join our board yet — but I\'d love to buy you coffee and learn from your journey."',
    },
    {
      title: 'Board Meeting Prep & Reporting',
      badgeName: 'Reporter',
      badgeIcon: '📊',
      description: 'Board decks tell the truth. Include: KPIs vs targets, cash position & runway, key wins, key challenges, team updates, and specific asks. Send 48 hours before the meeting. No surprises — ever. A surprised board member is a dangerous board member.\n\n📖 Reference: Sequoia\'s "Board Deck Template" (leaked and widely available — Google it).\n\n⚡ Quick Win: Build a board deck template. Sections: Metrics, Financials, Product, Team, Asks. Fill it with dummy data to get the format right before your first real meeting.',
    },
    {
      title: 'Navigating Crises: PR & Catastrophe Management',
      badgeName: 'Crisis Manager',
      badgeIcon: '🚨',
      description: 'Every company faces a crisis eventually. Data breach, public scandal, product failure, lawsuit. Have a crisis playbook: who speaks, what gets said, when, and to whom. The best crisis response is prepared before the crisis hits.\n\n📖 Reference: "Crisis Ready" by Melissa Agnes — how to build an invincible brand.\n\n⚡ Quick Win: Run a "pre-mortem" with your team: "Imagine we wake up tomorrow and the company is on fire. What happened? What do we do in the first hour? First day? First week?" Write down the playbook.',
    },
    {
      title: 'Expanding Internationally (New Markets)',
      badgeName: 'Explorer',
      badgeIcon: '🌍',
      description: 'International expansion is seductive and dangerous. Before entering a new country: validate demand, understand local payment methods, localize (not just translate), navigate local laws, and hire someone who\'s been there.\n\n📖 Reference: "Playing to Win" by A.G. Lafley & Roger Martin — the GE/McKinsey matrix for market selection.\n\n⚡ Quick Win: Pick your most likely international market. Spend $500 on a test: run localized ads for 2 weeks, measure conversion rate, talk to 10 users from that country. Data, not intuition.',
    },
    {
      title: 'Mergers & Acquisitions: Buying Competitors',
      badgeName: 'Acquirer',
      badgeIcon: '🤝',
      description: 'Sometimes buying is faster than building. But M&A is a minefield: culture clash, integration complexity, overpaying. The best acquisitions are small teams (<10 people) with technology you\'d spend 18 months building.\n\n📖 Reference: "Mastering the Merger" by David Harding & Sam Rovit (Bain & Company).\n\n⚡ Quick Win: List 5 companies you could acquire. Rank by: strategic fit, integration difficulty, price. Even if you\'re not ready today, understanding the landscape shapes your build-vs-buy decisions.',
    },
    {
      title: 'Legal Moats & Deep Intellectual Property',
      badgeName: 'Patent Holder',
      badgeIcon: '🏰',
      description: 'Moats can be: patents (defensible technology), network effects (each user makes the product better for others), data advantages (proprietary datasets), or brand (Nike, Apple, Red Bull). Build at least one moat that competitors cannot easily cross.\n\n📖 Reference: "Zero to One" by Peter Thiel — the chapter on "building a monopoly" is essential.\n\n⚡ Quick Win: Draw a simple diagram: "Why can\'t a well-funded competitor kill us in 6 months?" If you don\'t have a good answer, your moat is weak. Identify what would make that answer strong.',
    },
    {
      title: 'Wealth vs. Money: Founder Liquidity Events',
      badgeName: 'Wealth Builder',
      badgeIcon: '💎',
      description: 'You don\'t need to wait for IPO to unlock some value. Secondary sales, tender offers, and partial liquidity let you take money off the table while staying in the game. Selling 10% of your stake for life-changing money reduces stress and improves decision-making.\n\n📖 Reference: "The Psychology of Money" by Morgan Housel — wealth is what you don\'t see.\n\n⚡ Quick Win: Talk to your board/investors about secondary sale policies. Understand: can you sell a portion in a future round? At what valuation? Having the conversation early removes awkwardness later.',
    },
    {
      title: 'Preparing for an Exit Strategy (IPO / Acquisition)',
      badgeName: 'Exit Ready',
      badgeIcon: '🚪',
      description: 'Whether IPO or acquisition, start preparing 18-24 months ahead: clean financials (GAAP), auditable processes, documented everything, no legal skeletons. Exits are not events — they\'re processes that you engineer.\n\n📖 Reference: "The Art of Selling Your Business" by John Warrillow — practical exit planning.\n\n⚡ Quick Win: Do an "exit readiness audit." Financials: clean? Legal: no loose ends? Team: can operate without you? Product: defensible? Score each area 1-10. Fix anything below 7.',
    },
    {
      title: 'The Psychology of the Post-Success Founder',
      badgeName: 'Philosopher',
      badgeIcon: '🧘',
      description: 'Post-exit depression is real. Your identity was "founder." Now what? Prepare for the emotional journey: loss of purpose, questioning self-worth, navigating relationships when you have money. The people who thrive post-exit are those who defined themselves beyond their company.\n\n📖 Reference: "What Got You Here Won\'t Get You There" by Marshall Goldsmith.\n\n⚡ Quick Win: Write a personal mission statement that has nothing to do with your company. "I am [identity] who [contribution]." When the company chapter ends, this is your compass.',
    },
    {
      title: 'Milestone: Becoming the Angel / Mentor',
      badgeName: 'Angel',
      badgeIcon: '👼',
      description: 'You made it. Now pay it forward. Invest in the next generation, mentor founders who remind you of yourself 5 years ago, and keep building. The game is infinite — there\'s always another level. The real win is becoming the person you needed when you started.\n\n📖 Reference: "The Infinite Game" by Simon Sinek — the mindset that keeps great founders going.\n\n⚡ Quick Win: Find one early-stage founder in your space. Offer a 30-minute call. No agenda, no ask — just "I\'ve been where you are. What\'s the hardest thing right now?" That call might change their life.',
    },
  ],
];

/** Generate 10 hustle-driven tasks per level based on phase and level title.
 *  Each set of 10 follows a momentum-building arc:
 *  Understand → Quick Win → Apply → Create → Share → Measure → Case Study → Anti-Pattern → Systematize → Reflect */
function makeLevelTasks(levelId: number, phaseIdx: number, levelTitle: string): JourneyTask[] {
  const theme = levelTitle.split(':')[0]?.trim() || levelTitle;
  const id = String(levelId);

  const taskSets: Record<number, (id: string, theme: string) => JourneyTask[]> = {
    // Phase 1: Ideation & Alignment — Learn, Execute, Apply, Create, Share, Measure, Case, Pitfall, System, Reflect
    0: (id, t) => [
      { id: `${id}-1`, title: `Research & summarize "${t}"`, description: 'Research this concept thoroughly. Write a 150-word summary in your own words. What is the key insight? Why does it matter for founders? How have successful entrepreneurs applied it?', type: 'text_input', points: 15, required: true, hint: 'If you can\'t explain it simply in 3 sentences, you don\'t truly understand it. Use plain language. Jargon is a crutch for unclear thinking.' },
      { id: `${id}-2`, title: 'Execute the Quick Win NOW', description: 'Complete the Quick Win action from the level description immediately. Write exactly what you did and the outcome. Momentum starts with action — not planning to act.', type: 'text_input', points: 20, required: true, hint: 'The gap between knowing and doing is where most founders die. Close it NOW. A mediocre action today beats a perfect action next week — because next week never comes.' },
      { id: `${id}-3`, title: `Apply "${t}" to YOUR specific situation`, description: 'Write a concrete plan for how this applies to YOUR business or idea. What changes will you make starting tomorrow? Be uncomfortably specific — vague plans produce vague results.', type: 'text_input', points: 15, required: true, hint: 'Generic advice applied generically produces generic results. If you can\'t connect this directly to your business, you\'re intellectualizing instead of executing. Make it real.' },
      { id: `${id}-4`, title: 'Create a tangible artifact', description: `Turn your understanding of "${t}" into something visual: a one-page framework, mindmap, decision tree, or canvas. Upload a photo or screenshot. Creation is the highest form of understanding.`, type: 'file_upload', points: 15, required: false, hint: 'When you build something visual, you see connections your notes missed. This artifact becomes part of your founder playbook — revisit it in 3 months and see how your thinking evolved.' },
      { id: `${id}-5`, title: 'Share & teach this to another founder', description: 'Explain this concept to one other entrepreneur. Get their honest reaction — especially pushback and disagreement. Write their response and what it revealed about your understanding.', type: 'text_input', points: 10, required: false, hint: 'Teaching is the fastest path to mastery. If they push back, that\'s gold — it reveals weak spots. If they get excited and want to apply it themselves, you know you\'ve found something truly valuable.' },
      { id: `${id}-6`, title: 'Set a measurable baseline', description: `How will you know if applying "${t}" is working? Define 1-2 metrics you can track. Write your current baseline (zero is valid!) and a target for 2 weeks from now.`, type: 'text_input', points: 10, required: false, hint: 'What gets measured gets improved. Even a simple metric like "clarity score 1-10" or "number of ideas validated this week" creates accountability. Zero is a fine baseline — it only goes up.' },
      { id: `${id}-7`, title: 'Find a real-world case study', description: `Research one founder/company that NAILED "${t}" — and one that FAILED because they ignored it. Write both stories in 100 words each. Steal the winner\'s tactics. Avoid the loser\'s mistakes.`, type: 'text_input', points: 15, required: true, hint: 'Success leaves clues. Failure leaves even better clues. Google "[concept] case study startup" and find real stories. Learning from other people\'s scars is dramatically cheaper than earning your own.' },
      { id: `${id}-8`, title: 'Identify the #1 pitfall — and how to avoid it', description: `What do most founders get WRONG about "${t}"? Research the most common mistake, then write a short "How to Fail at This" guide. Understanding failure modes inoculates you against them.`, type: 'text_input', points: 10, required: false, hint: 'Knowing what NOT to do is often more valuable than knowing what to do. The best founders are paranoid about failure modes — they\'ve studied every way this can go wrong and have countermeasures ready.' },
      { id: `${id}-9`, title: 'Build a repeatable system', description: `Create a simple template, checklist, or recurring calendar reminder so "${t}" becomes a habit, not a one-time exercise. Upload your system. How will you ensure this sticks beyond today?`, type: 'file_upload', points: 15, required: false, hint: 'One insight applied once = luck. One insight systematized = leverage. Spend 10 minutes building the system — set a weekly review, create a Notion template, schedule a recurring check-in. Systems compound.' },
      { id: `${id}-10`, title: 'Reflect: What shifted in your thinking?', description: 'After completing all tasks, write a brief reflection: What surprised you? What was harder than expected? What will you do differently based on this level? Growth happens in reflection, not in action alone.', type: 'text_input', points: 15, required: true, hint: 'The founder who never reflects repeats the same mistakes forever. Take 5 minutes. Write like nobody will read it. The patterns you notice in reflection are the patterns that will define your trajectory.' },
    ],
    // Phase 2: Validation & Quick Wins — Research, Execute, Experiment, Interview, Analyze, Case, Pitfall, Template, Score, Decide
    1: (id, t) => [
      { id: `${id}-1`, title: `Research "${t}" with real data`, description: 'Don\'t guess — gather actual data. Find 3 real examples, case studies, or data points related to this validation method. Write what you found and what surprised you most.', type: 'text_input', points: 15, required: true, hint: 'Google "case study [your topic]" and find at least one real company that validated (or failed to validate) this. Learn from their scars, not just their victories.' },
      { id: `${id}-2`, title: 'Execute the Quick Win NOW', description: 'Take the Quick Win action immediately — not "after you read the rest." Write the exact steps you took and the result. Resistance is data too — document it honestly.', type: 'text_input', points: 20, required: true, hint: 'Validation is about speed. The faster you test, the faster you learn. A "failed" test that saves you 6 months of building the wrong thing is actually a massive, career-saving win.' },
      { id: `${id}-3`, title: `Run a micro-experiment based on "${t}"`, description: 'Design and execute a tiny experiment (under 2 hours) to test this concept against your business. Document: hypothesis, method, results, and what you\'ll change based on the outcome.', type: 'text_input', points: 20, required: true, hint: 'Hypothesis: "I believe [X] will happen if I do [Y]." Method: "I will [action] for [time period]." Result: "Here\'s what actually happened." Next: "Therefore I will..." Science > opinion.' },
      { id: `${id}-4`, title: 'Talk to a potential customer', description: `Have a real conversation with someone in your target market about "${t}". Use The Mom Test approach: ask about their actual problems and behaviors — NOT about your solution idea. Write their exact words.`, type: 'text_input', points: 15, required: false, hint: '5 minutes of customer conversation is worth 5 hours of internal debate. Their exact phrasing is your most valuable data. If they say "that sounds cool" they\'re being polite. If they say "I need this NOW" they\'re being honest.' },
      { id: `${id}-5`, title: 'Analyze your results objectively', description: 'Look at your experiment data and customer feedback like a scientist, not a founder in love with their idea. Write what the evidence ACTUALLY says — even if it contradicts what you wanted to believe.', type: 'text_input', points: 15, required: true, hint: 'Confirmation bias kills more startups than bad ideas. Actively look for evidence that you\'re WRONG. If you can\'t find any, you\'re not looking hard enough. The best founders are paranoid optimists.' },
      { id: `${id}-6`, title: 'Find a validation case study', description: `Research one company that validated "${t}" brilliantly (saving years of work) and one that skipped validation (and paid dearly). Write both stories. What pattern do you see?`, type: 'text_input', points: 10, required: false, hint: 'Zappos started by photographing shoes in stores — they didn\'t build inventory first. Dropbox made a fake product video before writing code. The pattern: validate demand before building supply.' },
      { id: `${id}-7`, title: 'Identify how founders fool themselves', description: `What is the #1 way founders lie to themselves about "${t}"? Research common self-deception patterns. Write your honest answer: have you been guilty of any of these?`, type: 'text_input', points: 10, required: false, hint: '"People said they\'d buy it" ≠ validation. "My mom thinks it\'s a great idea" ≠ validation. "I got 100 signups (but nobody paid)" ≠ validation. Money changing hands is the only validation that counts.' },
      { id: `${id}-8`, title: 'Build a validation template', description: 'Create a reusable validation framework: what questions to ask, what metrics to track, what counts as "validated" vs "invalidated." Upload your template so you can use it for every future idea.', type: 'file_upload', points: 15, required: false, hint: 'Don\'t reinvent the validation process every time. A template saves you hours and ensures you don\'t skip steps when you\'re excited about a new idea. Excitement is the enemy of rigor.' },
      { id: `${id}-9`, title: 'Set a validation velocity goal', description: 'Track how many validation experiments you ran this week. Set a goal for next week. Validation is a numbers game — the more experiments you run, the faster you find what works.', type: 'text_input', points: 10, required: false, hint: 'Most founders run 0-1 experiments per month. Elite validators run 3-5 per week. The difference isn\'t intelligence — it\'s willingness to be wrong quickly. Speed of learning is your competitive advantage.' },
      { id: `${id}-10`, title: 'Decide: pivot, persevere, or kill?', description: 'Based on everything you\'ve learned, make a clear, written decision about this aspect of your business. Include the evidence that supports your choice and your next concrete action.', type: 'text_input', points: 15, required: true, hint: 'Indecision is the silent killer of startups. Make a call with the data you have. You can always course-correct later — but you can\'t steer a parked car. A wrong decision today beats no decision for a month.' },
    ],
    // Phase 3: Guerrilla Marketing & Launch — Study, Create, Track, Engage, A/B Test, Viral Hook, Pitfall, Calendar, System, Reflect
    2: (id, t) => [
      { id: `${id}-1`, title: `Study 3 examples of "${t}" done brilliantly`, description: 'Find 3 real-world examples of this marketing tactic executed at a world-class level. Screenshot or link to them. Write what makes each one work — reverse-engineer the strategy.', type: 'text_input', points: 15, required: true, hint: 'Don\'t reinvent the wheel. The best marketers are the best thieves — steal the strategy, not the content. Adapt what works to your niche. Originality is overrated; effectiveness is everything.' },
      { id: `${id}-2`, title: 'Create and publish your version TODAY', description: 'Don\'t overthink — create and post your take on this tactic within the next 2 hours. Upload a screenshot or link to the live content. Speed beats perfection in marketing.', type: 'file_upload', points: 25, required: true, hint: 'The algorithm rewards consistency, not perfection. A B+ post today outperforms an A+ post that never ships. Hit publish before you lose your nerve — your first version will be your worst, and that\'s the point.' },
      { id: `${id}-3`, title: 'Track results and engagement', description: 'After 24-48 hours, check your metrics: views, likes, comments, shares, clicks, conversions. Write down the numbers and what they tell you. Be objective — the data doesn\'t care about your feelings.', type: 'text_input', points: 15, required: true, hint: 'If nobody engaged, your hook was weak or your targeting was wrong. If people engaged but didn\'t convert, your offer or CTA needs work. The data tells the truth — your job is to listen without ego.' },
      { id: `${id}-4`, title: 'Engage with every single responder', description: 'Reply to every comment, DM, and interaction your content received. Write down any interesting conversations, leads, or insights. The money is in the DMs — treat every engagement as a potential customer.', type: 'text_input', points: 15, required: false, hint: 'A 1% conversion rate on 100 engaged viewers = 1 customer. Engaging with ALL of them can 3-5x your conversion rate. This is free sales. Most creators ignore their comments — that\'s your edge.' },
      { id: `${id}-5`, title: 'A/B test one variation', description: `Create a slightly different version of your "${t}" content: change the hook, the format, the CTA, or the visuals. Publish it. Compare results to the original. Write what you learned about your audience.`, type: 'text_input', points: 15, required: false, hint: 'Marketing is a science, not an art. The only way to know what works is to test. Change ONE variable at a time so you know what caused the difference. Small tweaks can 10x results.' },
      { id: `${id}-6`, title: 'Identify the viral hook pattern', description: `Study the posts/content about "${t}" that went viral. What pattern do they share? Is it the headline structure? The emotional trigger? The format? Write a reusable "hook formula" you can use again.`, type: 'text_input', points: 10, required: false, hint: 'Viral content isn\'t random — it follows patterns. Curiosity gaps, contrarian takes, "I tried X and here\'s what happened," listicles, strong opinions. Find the pattern in your niche and weaponize it.' },
      { id: `${id}-7`, title: 'Identify what makes marketing feel spammy', description: `What\'s the #1 way people do "${t}" WRONG — making it feel desperate, spammy, or manipulative? Write the anti-pattern. Then write your commitment to never cross that line.`, type: 'text_input', points: 10, required: false, hint: 'Bad marketing screams "BUY FROM ME." Good marketing whispers "here\'s something valuable — if you want more, I can help." The difference is whether you lead with value or lead with the ask.' },
      { id: `${id}-8`, title: 'Create a content calendar template', description: `Build a simple 2-week content calendar for "${t}". What will you post, when, and on which platforms? Upload your calendar. Consistency without a calendar is a fantasy.`, type: 'file_upload', points: 15, required: false, hint: 'A content calendar removes the daily "what should I post?" paralysis. Batch-create content on Sunday. Schedule it during the week. Spend your creative energy ONCE, distribute it all week.' },
      { id: `${id}-9`, title: 'Build a repeatable marketing system', description: 'Write a simple SOP for this tactic: preparation steps, posting checklist, engagement protocol, and measurement. How will you do this weekly, not just once? Upload your system.', type: 'file_upload', points: 15, required: false, hint: 'One great post is luck. A system that produces great posts weekly is a growth engine. Spend 15 minutes building the system — it compounds into millions of impressions over a year.' },
      { id: `${id}-10`, title: 'Reflect: What did your audience teach you?', description: 'After running this full cycle, reflect: What content resonated most? What flopped? What did you learn about your audience that you didn\'t know before? Write your top 3 insights.', type: 'text_input', points: 15, required: true, hint: 'Your audience is your best marketing teacher — if you listen. They tell you what they want with every like, comment, and share. Most founders ignore this free feedback loop. Don\'t be most founders.' },
    ],
    // Phase 4: Sales Engine & CRM — Study, Prospect, Handle Rejection, Practice, CRM, Script, Anti-Pattern, Cheat Sheet, Metrics, Reflect
    3: (id, t) => [
      { id: `${id}-1`, title: `Study the mechanics of "${t}"`, description: 'Research how top performers execute this sales skill. Watch 2 videos, read 1 article by a proven closer. Write the top 3 techniques you will steal and adapt.', type: 'text_input', points: 15, required: true, hint: 'Sales is a craft, not a talent. Study the best — Chris Voss (negotiation), Alex Hormozi (offer creation), Grant Cardone (closing). Their techniques are free on YouTube. Learn them, then practice them.' },
      { id: `${id}-2`, title: `Execute "${t}" with real prospects TODAY`, description: 'Apply this tactic to at least 5 real prospects or leads within the next 24 hours. Document each attempt: who, what you said, their response. Real practice > theoretical knowledge.', type: 'text_input', points: 25, required: true, hint: 'Sales is a contact sport. You can read 50 books and still be terrible at selling. The only way to improve is to actually sell. Do 5 reps today. The first 2 will feel awkward — that means you\'re growing.' },
      { id: `${id}-3`, title: 'Handle rejection — and decode it', description: 'Write down every "no" or objection you received. For each one, draft a better response. Then identify the PATTERN: what\'s the real objection hiding behind the surface-level excuse?', type: 'text_input', points: 15, required: true, hint: 'Every "no" contains a lesson. "Too expensive" = you haven\'t demonstrated enough value. "Not now" = you haven\'t created urgency. "Need to think about it" = you haven\'t addressed their real fear. Decode, don\'t defend.' },
      { id: `${id}-4`, title: `Role-play "${t}" and record yourself`, description: 'Practice this sales skill out loud. Record yourself on video or role-play with a friend who will be brutally honest. Watch it back. Identify your #1 improvement area.', type: 'file_upload', points: 15, required: false, hint: 'You will cringe watching yourself. That\'s the point. Focus on: tone (confident but not aggressive), listening (are you talking more than 40% of the time?), and clarity (can they repeat your offer back?).' },
      { id: `${id}-5`, title: 'Build a CRM workflow', description: `Set up a simple tracking system for "${t}": spreadsheet, Notion, or actual CRM. Include: Prospect, Date, Status, Next Step, Notes. Upload a screenshot. If it\'s not tracked, it didn\'t happen.`, type: 'file_upload', points: 15, required: false, hint: 'A Google Sheet with 5 columns is a CRM. Start there. The tool doesn\'t matter — the habit of tracking every interaction matters. Most founders lose deals because they forget to follow up. Don\'t be that founder.' },
      { id: `${id}-6`, title: 'Write your personal sales script', description: `Craft a concise script for "${t}" that sounds like YOU — not a corporate robot. Include: opener, value proposition, qualifying questions, objection responses, and close. Make it conversational.`, type: 'text_input', points: 15, required: true, hint: 'The best sales scripts don\'t sound like scripts. Read yours out loud. If it sounds like something you\'d never say to a friend at a coffee shop, rewrite it. Authenticity closes more deals than slickness.' },
      { id: `${id}-7`, title: 'Identify the "desperate founder" smell', description: `What makes "${t}" feel pushy, desperate, or salesy in a bad way? Research the most common turn-offs in sales. Write what you\'ll NEVER do — your personal anti-playbook.`, type: 'text_input', points: 10, required: false, hint: 'Desperation is the #1 deal-killer. It manifests as: talking too fast, discounting too quickly, not listening, following up 5 times in 2 days. Confidence is quiet. Desperation is loud. Be the former.' },
      { id: `${id}-8`, title: 'Build an objection-handling cheat sheet', description: `Create a one-page reference for the top 5 objections you encounter when doing "${t}" — and your best responses for each. Upload it. Keep it visible during every sales conversation.`, type: 'file_upload', points: 15, required: false, hint: 'Objections are predictable. "Too expensive," "Not now," "Need to think," "Talk to my partner," "Using a competitor." Have your responses ready. Preparation eliminates panic. Panic kills deals.' },
      { id: `${id}-9`, title: 'Set daily sales activity metrics', description: 'Define your minimum daily sales activity: calls, emails, DMs, follow-ups. Write your target. Track it for 5 days. Sales is a volume game — activity in, deals out.', type: 'text_input', points: 10, required: false, hint: 'If you don\'t know how many outreach attempts you made today, you\'re not doing enough. Top SDRs make 50-100 touches per day. Start with 20. Increase weekly. Activity is the only variable you control.' },
      { id: `${id}-10`, title: 'Reflect: What\'s your close rate — and why?', description: 'Calculate your conversion rate from this week\'s sales activity. Prospects contacted → conversations → qualified leads → closed. Write the numbers. Where\'s the biggest drop-off? What will you improve next week?', type: 'text_input', points: 15, required: true, hint: 'Most founders have no idea what their close rate is. They "feel" like they\'re doing sales. Numbers don\'t lie. A 1% close rate on 100 contacts = 1 customer. Improve to 3% = 3 customers. Same effort, 3x results.' },
    ],
    // Phase 5: Product & Tech Foundation — Understand, Ship, Test, Document, Measure, Research, Pitfall, Decision Log, Monitor, Reflect
    4: (id, t) => [
      { id: `${id}-1`, title: `Understand the technical foundation of "${t}"`, description: 'Research how successful products implement this. Write a 150-word technical brief: what needs to happen, key decisions, common pitfalls, and what NOT to over-engineer.', type: 'text_input', points: 15, required: true, hint: 'You don\'t need to be a developer, but you need to know enough to not get ripped off. 30 minutes of research saves thousands in bad dev decisions. Understand the "why" before the "how."' },
      { id: `${id}-2`, title: `Ship one "${t}" improvement TODAY`, description: 'Make one concrete, deployable improvement to your product based on this lesson — code, design, infrastructure, or process. Document the change. A deployed improvement > a planned masterpiece.', type: 'text_input', points: 20, required: true, hint: 'Ship one thing today. Even if it\'s tiny. Momentum beats perfection in product. A live feature with 80% quality is infinitely more valuable than a perfect feature that\'s still "in development" 3 months later.' },
      { id: `${id}-3`, title: `Test your "${t}" implementation thoroughly`, description: 'Verify that your change actually works. Test it yourself on a real device/network. Then have one other person test it. Write down every bug, friction point, or edge case found.', type: 'text_input', points: 15, required: true, hint: '"Works on my machine" kills products. Test on real devices, real networks, real scenarios. If you can\'t reproduce it, you can\'t fix it. If a user can break it in 30 seconds, they will.' },
      { id: `${id}-4`, title: `Document your "${t}" setup`, description: 'Write a brief documentation page: what you did, why you chose this approach, alternatives considered, and what a future developer (or your future self) needs to know. Upload it.', type: 'text_input', points: 10, required: false, hint: 'Code you wrote 6 months ago might as well have been written by a stranger. Future-you will deeply appreciate 5 minutes of documentation today. Include: setup steps, key decisions, and known gotchas.' },
      { id: `${id}-5`, title: `Measure the impact of "${t}"`, description: 'Set up tracking for this feature/change. After 3-7 days, check your analytics. Did it improve your North Star metric? User satisfaction? Performance? Write the numbers — raw data, no spin.', type: 'text_input', points: 15, required: false, hint: 'If you can\'t measure it, you can\'t improve it. Every feature needs a success metric. Even "fewer support tickets" or "faster load time" counts. Connect every change to a number — or question why you\'re making it.' },
      { id: `${id}-6`, title: 'Research how top products handle this', description: `Find 2-3 successful products that do "${t}" exceptionally well. Study their implementation. Write what you\'d steal, what you\'d improve, and what doesn\'t apply to your scale.`, type: 'text_input', points: 10, required: false, hint: 'Great products leave clues. Look at Stripe\'s API docs, Notion\'s onboarding, Linear\'s speed. They solved the same problems you\'re facing. Don\'t copy blindly — adapt thoughtfully to your context and scale.' },
      { id: `${id}-7`, title: 'Identify the over-engineering trap', description: `What\'s the #1 way founders over-engineer "${t}" — building complex solutions for problems they don\'t have yet? Write what "good enough" looks like vs "gold-plated." Ship good enough first.`, type: 'text_input', points: 10, required: false, hint: 'Premature optimization is the root of all evil (and wasted time). If you don\'t have users yet, you don\'t need Kubernetes. If you have 100 users, you don\'t need microservices. Scale the solution to the actual problem.' },
      { id: `${id}-8`, title: 'Create a technical decision log', description: 'Start a simple log of technical decisions: what you chose, why, alternatives considered, trade-offs accepted. Upload the first entry about this level\'s change. This becomes invaluable as your team grows.', type: 'file_upload', points: 15, required: false, hint: 'In 12 months, someone (maybe you) will ask "why did we build it this way?" A decision log answers that question. It also prevents repeating debates. $0 to create, thousands in saved confusion.' },
      { id: `${id}-9`, title: 'Set up monitoring or alerting', description: `How will you know if "${t}" breaks? Set up basic monitoring: error tracking, performance alerts, or a simple daily check. Write what you set up. Broken features you don\'t know about are reputation killers.`, type: 'text_input', points: 10, required: false, hint: 'Users won\'t always report bugs — they\'ll just leave. A simple uptime check or error alert can be the difference between fixing a problem in 5 minutes vs discovering it 2 weeks later through churned users.' },
      { id: `${id}-10`, title: 'Reflect: Speed vs. quality trade-off', description: 'After this cycle, reflect honestly: Did you ship fast enough? Did you sacrifice too much quality? Where\'s your balance? Write your personal "ship speed" philosophy based on what you learned.', type: 'text_input', points: 15, required: true, hint: 'Some founders ship garbage and call it "MVP." Others polish forever and never ship. The sweet spot is different for every product. Find yours: what\'s the minimum quality bar your customers actually demand?' },
    ],
    // Phase 6: Legal, Finance & Admin — Understand, Execute, Checklist, Consult, Remind, Horror Story, Anti-Pattern, Dashboard, Deadlines, Reflect
    5: (id, t) => [
      { id: `${id}-1`, title: `Understand the legal/financial basics of "${t}"`, description: 'Research the fundamentals. What does every founder ABSOLUTELY need to know about this topic? Write a 150-word summary in plain English — no legalese, no jargon.', type: 'text_input', points: 15, required: true, hint: 'Legal and finance aren\'t just for lawyers and accountants. You\'re the CEO — ignorance is the most expensive legal strategy. 30 minutes of research today prevents a $50K mistake next year.' },
      { id: `${id}-2`, title: `Take action: set up "${t}" TODAY`, description: 'Execute the key setup or action. Whether it\'s filing a document, opening an account, drafting a policy, or making a calculation — do it NOW. Upload proof. Starting is the hardest part.', type: 'file_upload', points: 25, required: true, hint: 'Legal/finance tasks feel boring and scary — that\'s why founders avoid them for months. Set a 25-minute timer and just START. You\'ll be shocked how much you get done once you break the inertia.' },
      { id: `${id}-3`, title: 'Build a compliance checklist', description: `Create a simple checklist for "${t}": what needs to happen now, monthly, quarterly, and annually. Upload it. Compliance isn\'t a one-time event — it\'s an ongoing practice.`, type: 'file_upload', points: 15, required: true, hint: 'A 10-item checklist you review monthly prevents the $50K legal bill you get when something slips through the cracks. The checklist is boring until the day it saves your company. That day always comes.' },
      { id: `${id}-4`, title: 'Consult an expert (even briefly)', description: `Talk to a lawyer, accountant, or domain expert about "${t}". Even a 15-minute call or a free consultation. Write their key advice and what surprised you most. Experts see risks you don\'t.`, type: 'text_input', points: 15, required: false, hint: 'SCORE.org, local SBA offices, Clerky, Stripe Atlas, and law school clinics all offer free or low-cost expert guidance. One expert tip can save you years of headaches. Use the resources that exist.' },
      { id: `${id}-5`, title: 'Set recurring calendar reminders', description: `This isn\'t a "done and forget" topic. Set monthly, quarterly, or annual calendar reminders to review "${t}". Upload a screenshot. Automate the remembering.`, type: 'file_upload', points: 10, required: false, hint: 'The legal/financial things that kill startups are the ones you FORGET about. Automate the reminders. Your future self will thank you when you\'re not scrambling to fix something that could have been handled months ago.' },
      { id: `${id}-6`, title: 'Research a real-world horror story', description: `Find one startup that was DESTROYED because they messed up "${t}". Write what happened, what it cost them, and what they should have done. Learn from disasters — they\'re the most honest teachers.`, type: 'text_input', points: 10, required: false, hint: 'Search "[topic] startup lawsuit" or "[topic] founder nightmare." Real stories of cap table disasters, IP theft, tax penalties, and co-founder fights. These aren\'t rare — they\'re common. And almost all were preventable.' },
      { id: `${id}-7`, title: 'Identify the "I\'ll do it later" trap', description: `Why do founders chronically delay "${t}"? What\'s the psychological reason? Write your honest answer — and your commitment to stop. The best time to handle this was when you incorporated. The second best time is today.`, type: 'text_input', points: 10, required: false, hint: 'Founders delay legal/finance because it feels like "defense" while building product feels like "offense." But a legal disaster can wipe out everything your offense built. Defense wins championships.' },
      { id: `${id}-8`, title: 'Create a legal/finance dashboard', description: `Build a simple dashboard or tracker for "${t}": key documents, expiration dates, renewal deadlines, responsible parties. Upload a screenshot. Centralize the information so nothing falls through the cracks.`, type: 'file_upload', points: 15, required: false, hint: 'Scattered information = missed deadlines = legal exposure. One central document with all your legal/financial key dates and documents. Share it with your co-founder. Review it monthly. It takes 30 minutes to create.' },
      { id: `${id}-9`, title: 'Document key dates and deadlines', description: `List every important date related to "${t}": filing deadlines, renewal dates, compliance reviews, tax dates. Set calendar alerts for each one. Upload your date tracker.`, type: 'file_upload', points: 10, required: false, hint: 'The government and regulators don\'t care that you were "busy building product." Missed deadlines have real consequences — fines, penalties, loss of good standing. A calendar alert is the cheapest insurance you\'ll ever buy.' },
      { id: `${id}-10`, title: 'Reflect: What\'s your risk exposure?', description: 'After this level, honestly assess: What legal/financial risks are you currently exposed to? Rate each 1-10 on severity and likelihood. Write your top 3 risks and your plan to address each one.', type: 'text_input', points: 15, required: true, hint: 'Every founder has legal/financial risks they\'re ignoring. The question is whether you identify them before they become crises. A 10-minute risk assessment today beats a 10-month legal battle tomorrow.' },
    ],
    // Phase 7: Operations & The Machine — Map, Quick Win, Automate, SOP, Measure, Study, Anti-Pattern, Dashboard, Delegate Tree, Reflect
    6: (id, t) => [
      { id: `${id}-1`, title: `Map your current "${t}" workflow`, description: 'Diagram or list every step in how this process currently works. Be brutally honest — include the messy parts, the workarounds, and the "temporary" hacks that became permanent.', type: 'text_input', points: 15, required: true, hint: 'You can\'t improve what you can\'t see. Map the ACTUAL process, not the idealized version. The gap between "current state" and "ideal state" is your operations roadmap. Be honest — this is for you, not for show.' },
      { id: `${id}-2`, title: 'Execute the Quick Win NOW', description: `Take immediate action on the Quick Win for "${t}". Document what you changed, automated, or improved. Upload before/after screenshots. Small wins build operational momentum.`, type: 'file_upload', points: 20, required: true, hint: 'Operations improvement is a game of inches. Don\'t try to fix everything at once — you\'ll get overwhelmed and do nothing. Pick the ONE bottleneck causing the most pain. Fix it. Then move to the next.' },
      { id: `${id}-3`, title: 'Automate or delegate one step', description: `Find one step in "${t}" that can be automated (Zapier, n8n, AI, scripts) or delegated to someone else. Implement it TODAY. Write what you freed up: time, mental energy, or money.`, type: 'text_input', points: 20, required: true, hint: 'Your hourly rate as a founder = company value ÷ your working hours. If a task can be done for less than that rate, STOP doing it. Delegate it. Automate it. Your job is building the business, not running every process.' },
      { id: `${id}-4`, title: `Write an SOP for "${t}"`, description: 'Create a Standard Operating Procedure: purpose, step-by-step instructions, tools needed, expected outcomes, common troubleshooting, and who owns it. Write it so clearly a stranger could execute it.', type: 'text_input', points: 15, required: true, hint: 'An SOP is a love letter to your future replacement — which might be future-you after a vacation. If a stranger can\'t execute the SOP, it\'s incomplete. Test it: hand it to someone and watch them try.' },
      { id: `${id}-5`, title: 'Measure efficiency this week', description: `Track how long "${t}" takes and what it costs (time, money, errors, frustration). Set a baseline. Then set a specific, measurable improvement goal for next week. You can\'t improve what you don\'t measure.`, type: 'text_input', points: 15, required: false, hint: 'Most founders have NO IDEA how long their core processes take. Track it for one week. The numbers will shock you. A process you think takes "30 minutes" might actually take 2 hours when you count interruptions and rework.' },
      { id: `${id}-6`, title: 'Study a company with legendary ops', description: `Research a company famous for operational excellence in "${t}" — Amazon (logistics), Toyota (manufacturing), McDonald\'s (franchising). Write 3 principles you can adapt to your scale.`, type: 'text_input', points: 10, required: false, hint: 'Great operations aren\'t about size — they\'re about systems. A 2-person startup can have better ops than a 200-person company. The key is documentation, automation, and relentless simplification. Steal from the best.' },
      { id: `${id}-7`, title: 'Identify the micromanagement trap', description: `What\'s the difference between healthy operational rigor and toxic micromanagement regarding "${t}"? Write your personal line. Where do you tend to fall? Be honest — most founders lean toward micromanagement.`, type: 'text_input', points: 10, required: false, hint: 'Micromanagement says: "Do it exactly my way." Good operations says: "Here\'s the outcome we need, here are the constraints, here\'s how we\'ll measure success — now go figure out the best path." Trust the process, then trust the people.' },
      { id: `${id}-8`, title: 'Build an operations dashboard', description: `Create a simple dashboard for "${t}": key metrics, current status, bottlenecks, and trends. Upload a screenshot. Centralized visibility prevents problems from hiding in the shadows.`, type: 'file_upload', points: 15, required: false, hint: 'A dashboard doesn\'t need to be fancy. A Google Sheet with key metrics updated weekly is infinitely better than no visibility at all. The goal is to spot problems BEFORE they become crises. Early detection = cheap fixes.' },
      { id: `${id}-9`, title: 'Build a delegation decision tree', description: 'Create a simple framework: what tasks should you do personally, what should you delegate, what should you automate, and what should you eliminate? Apply it to your current workload. Upload your framework.', type: 'file_upload', points: 15, required: false, hint: 'Eisenhower Matrix on steroids: Urgent+Important = you. Important+Not Urgent = delegate. Urgent+Not Important = automate. Not Urgent+Not Important = eliminate. Most founders spend 80% of time in the last two categories.' },
      { id: `${id}-10`, title: 'Reflect: What\'s your biggest time leak?', description: 'After this ops deep-dive, reflect: Where are you personally the bottleneck? What task should you have stopped doing months ago? What will you offload THIS WEEK? Write your commitment and first action.', type: 'text_input', points: 15, required: true, hint: 'The founder who does everything is the founder who builds nothing great. Your highest-leverage activity is whatever ONLY you can do. Everything else is a distraction. Identify it. Offload it. Free yourself to build.' },
    ],
    // Phase 8: Talent & Culture — Define, Audit, Build System, Get Feedback, Set Goal, Study, Anti-Pattern, Manifesto, Onboarding, Reflect
    7: (id, t) => [
      { id: `${id}-1`, title: `Define what great "${t}" looks like`, description: 'Write a clear, specific definition of excellence in this area. What does A+ look like? What\'s a B? What\'s unacceptable? Vague expectations produce vague results. Write it like you\'re explaining to a new hire on day one.', type: 'text_input', points: 15, required: true, hint: 'If you can\'t define "great," you can\'t hire for it, coach toward it, promote based on it, or measure it. Your definition IS your standard. Make it concrete. "Good communicator" is vague. "Responds to all messages within 4 hours with clear next steps" is real.' },
      { id: `${id}-2`, title: `Audit your current "${t}" reality`, description: 'Honestly assess where you stand. Rate yourself 1-10. Write what\'s working, what\'s broken, and what you\'re avoiding. No sugar-coating. Self-awareness is the first leadership skill.', type: 'text_input', points: 15, required: true, hint: 'If you rate yourself 8+ on everything, you\'re either delusional or not digging deep enough. Real growth starts with uncomfortable honesty. The founder who thinks they\'re nailing talent probably has a revolving door of employees.' },
      { id: `${id}-3`, title: `Build or update your "${t}" system`, description: 'Create the actual system: job descriptions, interview scorecards, onboarding checklists, review templates, culture documents. Upload your work product. Systems aren\'t bureaucracy — they\'re guardrails.', type: 'file_upload', points: 20, required: true, hint: 'A $0 Google Doc system today beats a $50K HR platform you\'ll "set up next quarter." Write your interview scorecard NOW. Draft your onboarding checklist NOW. Done is better than perfect, and perfect never ships.' },
      { id: `${id}-4`, title: 'Get honest feedback', description: `Ask one team member, peer, or mentor for brutally honest feedback on how you handle "${t}". Write their exact words — especially the uncomfortable parts. Don\'t defend. Don\'t explain. Just absorb and thank them.`, type: 'text_input', points: 15, required: false, hint: 'Radical candor = care personally + challenge directly. Ask: "What\'s ONE thing I could do better in [area]?" Then shut up. Let the silence sit. People will fill it with truth if you give them space and don\'t get defensive.' },
      { id: `${id}-5`, title: 'Set a 30-day improvement goal', description: `Based on your audit and feedback, pick ONE specific, visible improvement for "${t}" to make in 30 days. Write the goal, the metric, your first action TODAY, and how you\'ll know if you succeeded.`, type: 'text_input', points: 15, required: false, hint: 'Culture changes one habit at a time. Don\'t announce a "culture transformation" — pick one visible change, nail it, and let the momentum carry you to the next one. Small, consistent wins > big, abandoned initiatives.' },
      { id: `${id}-6`, title: 'Study how the best companies do this', description: `Research 2 companies legendary for "${t}" — Netflix (culture deck), Google (hiring), Bridgewater (radical truth). Write 3 practices you can adapt, scaled to your size.`, type: 'text_input', points: 10, required: false, hint: 'Netflix\'s culture deck has been viewed millions of times for a reason. Google\'s hiring practices are studied globally. These aren\'t secrets — they\'re publicly documented. Steal what works. Adapt what doesn\'t. Ignore what\'s only relevant at their scale.' },
      { id: `${id}-7`, title: 'Identify the "hire clones" trap', description: `The biggest hiring mistake: hiring people just like you. How would this manifest for "${t}"? Write what diversity of thought actually looks like in this area — and how you\'ll actively seek it.`, type: 'text_input', points: 10, required: false, hint: 'A team of clones agrees on everything and challenges nothing. They\'re comfortable. They\'re also blind to their own weaknesses. The best teams have productive disagreement. Hire people who complement your weaknesses, not mirror your strengths.' },
      { id: `${id}-8`, title: 'Write your cultural manifesto', description: `What do you believe about "${t}" beyond tactics? Write a personal manifesto: your non-negotiables, your philosophy, what you stand for and what you won\'t tolerate. This is your leadership compass.`, type: 'text_input', points: 15, required: false, hint: 'When the pressure is on, you don\'t rise to the occasion — you fall to your systems and beliefs. A written manifesto is your anchor. "We believe X, therefore we do Y, and we NEVER do Z." Post it publicly. Live by it.' },
      { id: `${id}-9`, title: 'Build an onboarding checklist', description: `Create a 30-day onboarding plan for a new team member focused on "${t}". What do they need to know, do, read, and achieve by days 7, 14, and 30? Upload your plan. First impressions set the trajectory.`, type: 'file_upload', points: 15, required: false, hint: 'Most onboarding is "here\'s your laptop, good luck." Great onboarding is a deliberate 30-day journey. Day 1: culture and context. Day 7: tools and processes. Day 14: first small win. Day 30: independent contribution. Design it intentionally.' },
      { id: `${id}-10`, title: 'Reflect: Are you a talent magnet or repellent?', description: 'After this deep-dive, honestly reflect: Would A-players WANT to work with you? Why or why not? What\'s your reputation as a leader? Write what you\'ll do to become the kind of leader that attracts extraordinary people.', type: 'text_input', points: 15, required: true, hint: 'A-players want: autonomy, mastery, purpose, and fair compensation — in that order. They leave bad managers, not bad companies. Are you the reason someone would join — or the reason they\'d leave? Be honest. Then be better.' },
    ],
    // Phase 9: Capital & Investment — Research, Prepare, Practice, Target List, Take Action, Study Term Sheet, Anti-Pattern, Fundraising Tracker, Narrative, Reflect
    8: (id, t) => [
      { id: `${id}-1`, title: `Research how "${t}" works in the real world`, description: 'Study 3 real funding stories (successes AND failures) related to this topic. Write the key lessons from each. What went right? What went catastrophically wrong? Learn from both.', type: 'text_input', points: 15, required: true, hint: 'Read founder post-mortems on failed fundraises. They\'re more educational than success stories. Search "why we failed to raise" on Medium, IndieHackers, or Twitter. Other people\'s rejections are your free MBA in fundraising.' },
      { id: `${id}-2`, title: `Prepare your "${t}" materials`, description: 'Create or update the specific materials: financial model, pitch deck section, data room document, term sheet draft, investor FAQ. Upload what you built. Preparation signals professionalism.', type: 'file_upload', points: 20, required: true, hint: 'Investors can smell unpreparedness from across the room. Having your materials ready BEFORE you need them is a power move. It says: "I respect your time, I\'m serious, I\'ve done the work." First impressions in fundraising are everything.' },
      { id: `${id}-3`, title: `Practice "${t}" with brutally honest feedback`, description: 'Present this to someone who will give you real feedback — not "looks great!" Write their exact critiques and what you\'ll change. Find the friend who will tell you your numbers don\'t make sense before an investor does.', type: 'text_input', points: 15, required: true, hint: 'If your practice audience says "looks great" without any suggestions, find a better practice audience. You want the person who says "slide 7 contradicts slide 3" and "your TAM calculation is ridiculous." That person saves you.' },
      { id: `${id}-4`, title: `Build your target list for "${t}"`, description: 'Create a spreadsheet of potential investors, lenders, or partners. Include: name, firm, check size, why they\'re a fit, warm intro path, and status. Fundraising is a funnel — build the top of yours.', type: 'text_input', points: 15, required: true, hint: 'Fundraising funnel math: 100 targets → 20 first meetings → 5 second meetings → 2-3 term sheets → 1 close. If your top-of-funnel is 5 names, your odds are terrible. Build a real list. 100 is not too many — it\'s the minimum.' },
      { id: `${id}-5`, title: 'Take one real action TODAY', description: `Send one email, make one call, submit one application, or schedule one meeting related to "${t}". Write what you did and the result. Fundraising is a momentum game — one action per day compounds.`, type: 'text_input', points: 20, required: true, hint: 'Most founders raise zero dollars because they took zero actions. One action per day = 30 actions per month = real momentum. Don\'t wait until you "feel ready." Ready is a feeling that never comes. Just take one action. Today.' },
      { id: `${id}-6`, title: 'Study and decode a real term sheet', description: `Find a sample term sheet related to "${t}". Read every clause. Research what each one means. Write 3 terms you didn\'t previously understand and what you learned. Knowledge is negotiation power.`, type: 'text_input', points: 15, required: false, hint: 'Term sheets aren\'t just about valuation. Liquidation preferences, participation rights, anti-dilution, board seats, drag-along — each term can be worth millions. Understand them BEFORE you\'re staring at one with a 48-hour deadline.' },
      { id: `${id}-7`, title: 'Identify the "raise too early" trap', description: `What are the dangers of pursuing "${t}" before you\'re ready? Write 3 signals that you should raise now vs 3 signals that you should wait. Most founders raise too early and give away too much.`, type: 'text_input', points: 10, required: false, hint: 'Raising too early = giving away equity cheap. Raising too late = running out of cash. The sweet spot: when you have enough traction to get good terms but enough runway to negotiate. If you\'re desperate, investors can smell it.' },
      { id: `${id}-8`, title: 'Build a fundraising tracker', description: 'Create a tracker for your fundraising process: investor name, stage, last contact, next step, notes, and follow-up date. Upload a screenshot. Organized founders get funded. Disorganized founders get forgotten.', type: 'file_upload', points: 15, required: false, hint: 'A fundraising process without a tracker is chaos. You\'ll forget follow-ups, confuse investors, and look unprofessional. A simple spreadsheet prevents all of this. Update it after every interaction. Your future funded self will thank you.' },
      { id: `${id}-9`, title: 'Craft your "Why us?" narrative', description: 'Write a compelling 2-minute narrative: why THIS team, why THIS problem, why NOW, and why THIS solution is inevitable. This is the story that makes investors lean in. Upload your narrative.', type: 'text_input', points: 15, required: false, hint: 'Investors hear 1,000 pitches per year. They remember stories, not slides. Your narrative should answer: "Why will this team win where others failed?" Be specific. Be honest. Be compelling. This is your founder mythology — craft it carefully.' },
      { id: `${id}-10`, title: 'Reflect: Do you actually need outside capital?', description: 'After this deep-dive, honestly reflect: Do you NEED external funding, or do you WANT it? What would you do differently if you bootstrapped? Write your honest assessment. Capital is a tool, not a goal.', type: 'text_input', points: 15, required: true, hint: 'VC funding is NOT the default path — it\'s one specific tool for one specific type of business. Most great businesses are bootstrapped. Before raising, ask: "Would I still build this if I couldn\'t raise a dime?" If the answer is no, maybe don\'t build it.' },
    ],
    // Phase 10: Governance & The Infinite Game — Study, Execute, Philosophy, Mentor, Legacy Plan, Study Failures, Anti-Pattern, Board Template, Succession Plan, Reflect
    9: (id, t) => [
      { id: `${id}-1`, title: `Study how great companies handle "${t}"`, description: 'Research how successful, mature companies approach this governance topic. Write 3 best practices you\'ll adopt and 3 mistakes you\'ll avoid. Learn from those who\'ve already navigated what you\'re about to face.', type: 'text_input', points: 15, required: true, hint: 'Read annual reports, shareholder letters (Buffett, Bezos), and governance case studies. The patterns of great governance are clear and timeless. Most of them were learned through painful mistakes — learn from theirs, not yours.' },
      { id: `${id}-2`, title: `Take action on "${t}" NOW`, description: 'Complete the Quick Win: create the board structure, crisis plan, ethics policy, or legacy document. Upload your output. Governance built in calm weather holds when the storm hits.', type: 'file_upload', points: 20, required: true, hint: 'Governance feels like "future me" problems. But the best time to build governance is when things are going well — not when you\'re in crisis mode. The roof is easiest to fix when the sun is shining.' },
      { id: `${id}-3`, title: `Write your personal "${t}" philosophy`, description: 'Go beyond tactics — what do you BELIEVE about this topic? Write a personal manifesto or set of non-negotiable principles. Tactics change. Principles endure. This is your compass when the map runs out.', type: 'text_input', points: 15, required: true, hint: '"I believe X because Y. Therefore I will always Z. And I will never W." Your philosophy is what guides you when there\'s no playbook. Write it now, before you need it. It will be tested someday — probably sooner than you think.' },
      { id: `${id}-4`, title: 'Mentor one person', description: `Share what you\'ve learned about "${t}" with someone earlier in their founder journey. Write what you taught them AND what you learned from teaching. The mentor almost always learns more than the mentee.`, type: 'text_input', points: 15, required: false, hint: 'You don\'t need to be an expert to mentor — you just need to be one step ahead. Teaching crystallizes your understanding. Explaining a complex governance concept to a beginner reveals gaps in your own knowledge. Fill them.' },
      { id: `${id}-5`, title: 'Build a 5-year legacy plan', description: `Zoom out: how does "${t}" connect to the long-term impact you want to have? Write a 5-year vision for this area with specific milestones at years 1, 3, and 5. Think infinite game, not quarterly earnings.`, type: 'text_input', points: 15, required: false, hint: 'The best founders play infinite games. They\'re not optimizing for next quarter — they\'re building something that outlasts them. What\'s your 50-year vision? Now work backward: what needs to be true in 5 years for that to be possible?' },
      { id: `${id}-6`, title: 'Study governance failures that killed companies', description: `Research 2 companies that were DESTROYED by governance failures related to "${t}" — Theranos (board), Enron (audit), WeWork (founder control). Write what happened and the governance lesson.`, type: 'text_input', points: 10, required: false, hint: 'Governance failures aren\'t boring — they\'re spectacular disasters that wipe out billions. Theranos had no independent board members with medical expertise. Enron\'s board waived ethics rules. Governance isn\'t paperwork — it\'s the immune system of your company.' },
      { id: `${id}-7`, title: 'Identify the "founder as bottleneck" trap', description: `How does "${t}" become a bottleneck when the founder refuses to let go? Write how you\'ll recognize this in yourself — and what you\'ll do about it. The founder who can\'t delegate governance can\'t scale.`, type: 'text_input', points: 10, required: false, hint: 'The transition from "founder decides everything" to "governance system decides" is painful. It feels like losing control. But control at scale is an illusion — you either build systems or become the bottleneck that limits your company\'s potential.' },
      { id: `${id}-8`, title: 'Create a board meeting template', description: `Design a template for effective governance meetings about "${t}": agenda structure, pre-reads, decision framework, action items, and follow-up. Upload your template. Great meetings don\'t happen by accident.`, type: 'file_upload', points: 15, required: false, hint: 'Bad board meetings: founder presents for 45 minutes, board nods, everyone leaves. Great board meetings: pre-reads sent 72 hours before, 15 min presentation, 45 min strategic discussion, clear decisions and owners. Template it. Your board will thank you.' },
      { id: `${id}-9`, title: 'Draft a succession/continuity plan', description: `If you were hit by a bus tomorrow, what would happen to "${t}"? Write a one-page continuity plan: who knows what, key contacts, critical processes. Upload it. Morbid? Yes. Irresponsible to skip? Also yes.`, type: 'file_upload', points: 15, required: false, hint: 'Key person risk is real. If you\'re the only one who knows the bank passwords, the investor relationships, or the compliance deadlines — you\'re not a founder, you\'re a single point of failure. Fix that. Today.' },
      { id: `${id}-10`, title: 'Reflect: What kind of founder do you want to be?', description: 'After this governance deep-dive, reflect on your legacy: In 20 years, what do you want people to say about how you built your company? Write your answer. Then identify the gap between that vision and your current behavior.', type: 'text_input', points: 15, required: true, hint: 'Nobody on their deathbed wishes they\'d optimized more quarterly earnings. They think about impact, relationships, and what they built that outlasted them. Define your legacy NOW — not when it\'s too late to change course. Your daily actions either close the gap or widen it.' },
    ],
  };

  const generator = taskSets[phaseIdx];
  if (!generator) {
    return [
      { id: `${id}-1`, title: 'Complete this checkpoint', description: 'Read the lesson, execute the Quick Win, and reflect on how it applies to your business.', type: 'checkbox', points: 50, required: true },
    ];
  }

  return generator(id, theme);
}

/**
 * All 100 advanced levels (IDs 11–110) grouped into 10 reordered phases.
 * Phase order: Ideation → Validation → Marketing → Sales → Product → Legal → Operations → Talent → Capital → Governance
 */
export function buildAdvancedLevels(): JourneyLevel[] {
  const result: JourneyLevel[] = [];
  let globalId = 11;

  for (let phaseIdx = 0; phaseIdx < phases.length; phaseIdx++) {
    const { phase, name, xpReward } = phases[phaseIdx];
    const phaseLevels = levels[phaseIdx];

    for (let lvl = 0; lvl < phaseLevels.length; lvl++) {
      const { title, badgeName, badgeIcon, description } = phaseLevels[lvl];
      const id = globalId++;

      result.push({
        id,
        phase,
        phaseName: name,
        title,
        subtitle: `Level ${id}`,
        description,
        xpReward,
        badgeName,
        badgeIcon,
        tasks: makeLevelTasks(id, phaseIdx, title),
      });
    }
  }

  return result;
}

export { phases };

// ── Spanish task templates for the 100 advanced levels ──────────
// Each phase mirrors the 10-task momentum arc from makeLevelTasks.

const taskSetsEs: Record<number, (id: string, theme: string) => JourneyTask[]> = {
  // Phase 0: Ideación y Alineación
  0: (id, t) => [
    { id: `${id}-1`, title: `Investiga y resume "${t}"`, description: 'Investiga este concepto a fondo. Escribe un resumen de 150 palabras con tus propias palabras. ¿Cuál es la idea clave? ¿Por qué es importante para los fundadores? ¿Cómo lo han aplicado los emprendedores exitosos?', type: 'text_input', points: 15, required: true, hint: 'Si no puedes explicarlo de forma simple en 3 frases, aún no lo entiendes. Usa lenguaje sencillo. La jerga es una muleta para el pensamiento confuso.' },
    { id: `${id}-2`, title: 'Ejecuta la Victoria Rápida AHORA', description: 'Completa la acción de Victoria Rápida de la descripción del nivel inmediatamente. Escribe exactamente lo que hiciste y el resultado. El impulso comienza con la acción — no con planear actuar.', type: 'text_input', points: 20, required: true, hint: 'La brecha entre saber y hacer es donde mueren la mayoría de los fundadores. Ciérrala AHORA. Una acción mediocre hoy supera una acción perfecta la próxima semana — porque la próxima semana nunca llega.' },
    { id: `${id}-3`, title: `Aplica "${t}" a TU situación específica`, description: 'Escribe un plan concreto de cómo esto se aplica a TU negocio o idea. ¿Qué cambios harás a partir de mañana? Sé incómodamente específico — los planes vagos producen resultados vagos.', type: 'text_input', points: 15, required: true, hint: 'El consejo genérico aplicado genéricamente produce resultados genéricos. Si no puedes conectar esto directamente con tu negocio, estás intelectualizando en lugar de ejecutar. Hazlo real.' },
    { id: `${id}-4`, title: 'Crea un artefacto tangible', description: `Convierte tu comprensión de "${t}" en algo visual: un marco de una página, mapa mental, árbol de decisiones o lienzo. Sube una foto o captura. La creación es la forma más elevada de comprensión.`, type: 'file_upload', points: 15, required: false, hint: 'Cuando construyes algo visual, ves conexiones que tus notas pasaron por alto. Este artefacto se convierte en parte de tu manual de fundador — revísalo en 3 meses y ve cómo evolucionó tu pensamiento.' },
    { id: `${id}-5`, title: 'Comparte y enseña esto a otro fundador', description: 'Explícale este concepto a otro emprendedor. Obtén su reacción honesta — especialmente objeciones y desacuerdos. Escribe su respuesta y lo que reveló sobre tu comprensión.', type: 'text_input', points: 10, required: false, hint: 'Enseñar es el camino más rápido hacia la maestría. Si te objetan, es oro — revela puntos débiles. Si se entusiasman y quieren aplicarlo ellos mismos, sabes que has encontrado algo verdaderamente valioso.' },
    { id: `${id}-6`, title: 'Establece una línea base medible', description: `¿Cómo sabrás si aplicar "${t}" está funcionando? Define 1-2 métricas que puedas seguir. Escribe tu línea base actual (¡cero es válido!) y un objetivo para dentro de 2 semanas.`, type: 'text_input', points: 10, required: false, hint: 'Lo que se mide se mejora. Incluso una métrica simple como "puntuación de claridad 1-10" o "número de ideas validadas esta semana" crea responsabilidad. Cero es una línea base perfecta — solo puede subir.' },
    { id: `${id}-7`, title: 'Encuentra un caso de estudio real', description: `Investiga un fundador/empresa que CLAVÓ "${t}" — y uno que FRACASÓ por ignorarlo. Escribe ambas historias en 100 palabras cada una. Roba las tácticas del ganador. Evita los errores del perdedor.`, type: 'text_input', points: 15, required: true, hint: 'El éxito deja pistas. El fracaso deja pistas aún mejores. Busca en Google "[concepto] caso de estudio startup" y encuentra historias reales. Aprender de las cicatrices de otros es dramáticamente más barato que ganar las propias.' },
    { id: `${id}-8`, title: 'Identifica el error #1 — y cómo evitarlo', description: `¿Qué es lo que la mayoría de los fundadores hacen MAL con "${t}"? Investiga el error más común y escribe una breve guía de "Cómo Fracasar en Esto". Entender los modos de fallo te vacuna contra ellos.`, type: 'text_input', points: 10, required: false, hint: 'Saber qué NO hacer es a menudo más valioso que saber qué hacer. Los mejores fundadores son paranoicos con los modos de fallo — han estudiado cada forma en que esto puede salir mal y tienen contramedidas listas.' },
    { id: `${id}-9`, title: 'Construye un sistema repetible', description: `Crea una plantilla simple, checklist o recordatorio recurrente de calendario para que "${t}" se convierta en un hábito, no en un ejercicio único. Sube tu sistema. ¿Cómo asegurarás que esto perdure más allá de hoy?`, type: 'file_upload', points: 15, required: false, hint: 'Una idea aplicada una vez = suerte. Una idea sistematizada = ventaja competitiva. Dedica 10 minutos a construir el sistema — configura una revisión semanal, crea una plantilla de Notion, programa un check-in recurrente. Los sistemas se multiplican.' },
    { id: `${id}-10`, title: 'Reflexiona: ¿Qué cambió en tu pensamiento?', description: 'Después de completar todas las tareas, escribe una breve reflexión: ¿Qué te sorprendió? ¿Qué fue más difícil de lo esperado? ¿Qué harás diferente basado en este nivel? El crecimiento ocurre en la reflexión, no solo en la acción.', type: 'text_input', points: 15, required: true, hint: 'El fundador que nunca reflexiona repite los mismos errores para siempre. Tómate 5 minutos. Escribe como si nadie fuera a leerlo. Los patrones que notes en la reflexión son los patrones que definirán tu trayectoria.' },
  ],
  // Phase 1: Validación y Victorias Rápidas
  1: (id, t) => [
    { id: `${id}-1`, title: `Investiga "${t}" con datos reales`, description: 'No adivines — recopila datos reales. Encuentra 3 ejemplos reales, casos de estudio o puntos de datos relacionados con este método de validación. Escribe lo que encontraste y qué te sorprendió más.', type: 'text_input', points: 15, required: true, hint: 'Busca en Google "caso de estudio [tu tema]" y encuentra al menos una empresa real que validó (o no validó) esto. Aprende de sus cicatrices, no solo de sus victorias.' },
    { id: `${id}-2`, title: 'Ejecuta la Victoria Rápida AHORA', description: 'Toma la acción de Victoria Rápida inmediatamente — no "después de leer el resto". Escribe los pasos exactos y el resultado. La resistencia también es información — documéntala honestamente.', type: 'text_input', points: 20, required: true, hint: 'La validación se trata de velocidad. Cuanto más rápido pruebas, más rápido aprendes. Una prueba "fallida" que te ahorra 6 meses de construir lo incorrecto es en realidad una victoria masiva que salva tu carrera.' },
    { id: `${id}-3`, title: `Ejecuta un micro-experimento basado en "${t}"`, description: 'Diseña y ejecuta un pequeño experimento (menos de 2 horas) para probar este concepto contra tu negocio. Documenta: hipótesis, método, resultados y qué cambiarás basado en el resultado.', type: 'text_input', points: 20, required: true, hint: 'Hipótesis: "Creo que [X] sucederá si hago [Y]." Método: "Haré [acción] durante [período]." Resultado: "Esto es lo que realmente sucedió." Siguiente: "Por lo tanto, haré..." Ciencia > opinión.' },
    { id: `${id}-4`, title: 'Habla con un cliente potencial', description: `Ten una conversación real con alguien de tu mercado objetivo sobre "${t}". Usa el enfoque de The Mom Test: pregunta sobre sus problemas y comportamientos reales — NO sobre tu idea de solución. Escribe sus palabras exactas.`, type: 'text_input', points: 15, required: false, hint: '5 minutos de conversación con un cliente valen más que 5 horas de debate interno. Su forma exacta de expresarse es tu dato más valioso. Si dicen "suena genial" están siendo educados. Si dicen "necesito esto AHORA" están siendo honestos.' },
    { id: `${id}-5`, title: 'Analiza tus resultados objetivamente', description: 'Mira los datos de tu experimento y los comentarios de clientes como un científico, no como un fundador enamorado de su idea. Escribe lo que la evidencia REALMENTE dice — incluso si contradice lo que querías creer.', type: 'text_input', points: 15, required: true, hint: 'El sesgo de confirmación mata más startups que las malas ideas. Busca activamente evidencia de que estás EQUIVOCADO. Si no puedes encontrar ninguna, no estás buscando lo suficiente. Los mejores fundadores son optimistas paranoicos.' },
    { id: `${id}-6`, title: 'Encuentra un caso de estudio de validación', description: `Investiga una empresa que validó "${t}" brillantemente (ahorrándose años de trabajo) y una que se saltó la validación (y lo pagó caro). Escribe ambas historias. ¿Qué patrón ves?`, type: 'text_input', points: 10, required: false, hint: 'Zappos empezó fotografiando zapatos en tiendas — no construyeron inventario primero. Dropbox hizo un video falso del producto antes de escribir código. El patrón: valida la demanda antes de construir la oferta.' },
    { id: `${id}-7`, title: 'Identifica cómo los fundadores se engañan', description: `¿Cuál es la forma #1 en que los fundadores se mienten a sí mismos sobre "${t}"? Investiga patrones comunes de autoengaño. Escribe tu respuesta honesta: ¿has sido culpable de alguno de estos?`, type: 'text_input', points: 10, required: false, hint: '"La gente dijo que lo compraría" ≠ validación. "Mi mamá cree que es una gran idea" ≠ validación. "Conseguí 100 registros (pero nadie pagó)" ≠ validación. El dinero cambiando de manos es la única validación que cuenta.' },
    { id: `${id}-8`, title: 'Construye una plantilla de validación', description: 'Crea un marco de validación reutilizable: qué preguntas hacer, qué métricas seguir, qué cuenta como "validado" vs "invalidado". Sube tu plantilla para usarla con cada idea futura.', type: 'file_upload', points: 15, required: false, hint: 'No reinventes el proceso de validación cada vez. Una plantilla te ahorra horas y asegura que no te saltes pasos cuando estás emocionado por una nueva idea. La emoción es enemiga del rigor.' },
    { id: `${id}-9`, title: 'Establece una meta de velocidad de validación', description: 'Registra cuántos experimentos de validación ejecutaste esta semana. Establece una meta para la próxima semana. La validación es un juego de números — cuantos más experimentos, más rápido encuentras lo que funciona.', type: 'text_input', points: 10, required: false, hint: 'La mayoría de los fundadores ejecutan 0-1 experimentos por mes. Los validadores de élite ejecutan 3-5 por semana. La diferencia no es inteligencia — es disposición a equivocarse rápido. La velocidad de aprendizaje es tu ventaja competitiva.' },
    { id: `${id}-10`, title: 'Decide: ¿pivotar, perseverar o eliminar?', description: 'Basado en todo lo que has aprendido, toma una decisión clara y por escrito sobre este aspecto de tu negocio. Incluye la evidencia que respalda tu elección y tu próxima acción concreta.', type: 'text_input', points: 15, required: true, hint: 'La indecisión es el asesino silencioso de las startups. Decide con los datos que tienes. Siempre puedes corregir después — pero no puedes conducir un auto estacionado. Una decisión equivocada hoy supera ninguna decisión durante un mes.' },
  ],
  // Phase 2: Marketing de Guerrilla y Lanzamiento
  2: (id, t) => [
    { id: `${id}-1`, title: `Estudia 3 ejemplos de "${t}" ejecutados brillantemente`, description: 'Encuentra 3 ejemplos reales de esta táctica de marketing ejecutada a nivel mundial. Captura o enlaza. Escribe qué hace que cada uno funcione — haz ingeniería inversa de la estrategia.', type: 'text_input', points: 15, required: true, hint: 'No reinventes la rueda. Los mejores marketers son los mejores ladrones — roba la estrategia, no el contenido. Adapta lo que funciona a tu nicho. La originalidad está sobrevalorada; la efectividad lo es todo.' },
    { id: `${id}-2`, title: 'Crea y publica tu versión HOY', description: 'No lo pienses demasiado — crea y publica tu versión de esta táctica en las próximas 2 horas. Sube una captura o enlace al contenido publicado. La velocidad supera a la perfección en marketing.', type: 'file_upload', points: 25, required: true, hint: 'El algoritmo premia la consistencia, no la perfección. Una publicación B+ hoy supera a una A+ que nunca se publica. Publica antes de perder el valor — tu primera versión será la peor, y ese es el punto.' },
    { id: `${id}-3`, title: 'Registra resultados y engagement', description: 'Después de 24-48 horas, revisa tus métricas: vistas, likes, comentarios, compartidos, clics, conversiones. Escribe los números y lo que te dicen. Sé objetivo — a los datos no les importan tus sentimientos.', type: 'text_input', points: 15, required: true, hint: 'Si nadie interactuó, tu gancho era débil o tu segmentación era incorrecta. Si interactuaron pero no convirtieron, tu oferta o CTA necesita trabajo. Los datos dicen la verdad — tu trabajo es escuchar sin ego.' },
    { id: `${id}-4`, title: 'Interactúa con cada persona que respondió', description: 'Responde a cada comentario, DM e interacción que recibió tu contenido. Escribe cualquier conversación interesante, lead o perspectiva. El dinero está en los DMs — trata cada interacción como un cliente potencial.', type: 'text_input', points: 15, required: false, hint: 'Una tasa de conversión del 1% en 100 espectadores comprometidos = 1 cliente. Interactuar con TODOS puede multiplicar tu tasa de conversión por 3-5x. Esto son ventas gratis. La mayoría ignora sus comentarios — esa es tu ventaja.' },
    { id: `${id}-5`, title: 'Haz una prueba A/B de una variación', description: `Crea una versión ligeramente diferente de tu contenido sobre "${t}": cambia el gancho, el formato, el CTA o los visuales. Publícala. Compara resultados con la original. Escribe lo que aprendiste sobre tu audiencia.`, type: 'text_input', points: 15, required: false, hint: 'El marketing es una ciencia, no un arte. La única forma de saber qué funciona es probar. Cambia UNA variable a la vez para saber qué causó la diferencia. Pequeños ajustes pueden multiplicar resultados por 10.' },
    { id: `${id}-6`, title: 'Identifica el patrón de gancho viral', description: `Estudia las publicaciones/contenido sobre "${t}" que se volvieron virales. ¿Qué patrón comparten? ¿Es la estructura del titular? ¿El disparador emocional? ¿El formato? Escribe una "fórmula de gancho" reutilizable.`, type: 'text_input', points: 10, required: false, hint: 'El contenido viral no es aleatorio — sigue patrones. Brechas de curiosidad, opiniones contrarias, "Probé X y esto es lo que pasó", listas, opiniones fuertes. Encuentra el patrón en tu nicho y conviértelo en tu arma.' },
    { id: `${id}-7`, title: 'Identifica qué hace que el marketing se sienta spam', description: `¿Cuál es la forma #1 en que la gente hace "${t}" MAL — haciéndolo sentir desesperado, spam o manipulador? Escribe el anti-patrón. Luego escribe tu compromiso de nunca cruzar esa línea.`, type: 'text_input', points: 10, required: false, hint: 'El mal marketing grita "CÓMPRAME". El buen marketing susurra "aquí hay algo valioso — si quieres más, puedo ayudar". La diferencia es si lideras con valor o lideras con la petición.' },
    { id: `${id}-8`, title: 'Crea una plantilla de calendario de contenido', description: `Construye un calendario simple de 2 semanas para "${t}". ¿Qué publicarás, cuándo y en qué plataformas? Sube tu calendario. La consistencia sin un calendario es una fantasía.`, type: 'file_upload', points: 15, required: false, hint: 'Un calendario de contenido elimina la parálisis diaria de "¿qué publico hoy?". Crea contenido en lote el domingo. Prográmalo durante la semana. Gasta tu energía creativa UNA VEZ, distribúyela toda la semana.' },
    { id: `${id}-9`, title: 'Construye un sistema de marketing repetible', description: 'Escribe un procedimiento simple para esta táctica: pasos de preparación, checklist de publicación, protocolo de engagement y medición. ¿Cómo harás esto semanalmente, no solo una vez? Sube tu sistema.', type: 'file_upload', points: 15, required: false, hint: 'Una gran publicación es suerte. Un sistema que produce grandes publicaciones semanalmente es un motor de crecimiento. Dedica 15 minutos a construir el sistema — se multiplica en millones de impresiones durante un año.' },
    { id: `${id}-10`, title: 'Reflexiona: ¿Qué te enseñó tu audiencia?', description: 'Después de ejecutar este ciclo completo, reflexiona: ¿Qué contenido resonó más? ¿Qué fracasó? ¿Qué aprendiste sobre tu audiencia que no sabías antes? Escribe tus 3 principales aprendizajes.', type: 'text_input', points: 15, required: true, hint: 'Tu audiencia es tu mejor profesora de marketing — si escuchas. Te dicen lo que quieren con cada like, comentario y compartido. La mayoría de los fundadores ignoran este ciclo de retroalimentación gratuito. No seas la mayoría.' },
  ],
  // Phase 3: Motor de Ventas y CRM
  3: (id, t) => [
    { id: `${id}-1`, title: `Estudia la mecánica de "${t}"`, description: 'Investiga cómo los mejores ejecutan esta habilidad de ventas. Mira 2 videos, lee 1 artículo de un cerrador probado. Escribe las 3 técnicas principales que vas a copiar y adaptar.', type: 'text_input', points: 15, required: true, hint: 'Las ventas son un oficio, no un talento. Estudia a los mejores — Chris Voss (negociación), Alex Hormozi (creación de ofertas), Grant Cardone (cierre). Sus técnicas están gratis en YouTube. Apréndelas, luego practícalas.' },
    { id: `${id}-2`, title: `Ejecuta "${t}" con prospectos reales HOY`, description: 'Aplica esta táctica a al menos 5 prospectos o leads reales en las próximas 24 horas. Documenta cada intento: quién, qué dijiste, su respuesta. La práctica real > conocimiento teórico.', type: 'text_input', points: 25, required: true, hint: 'Las ventas son un deporte de contacto. Puedes leer 50 libros y seguir siendo terrible vendiendo. La única forma de mejorar es vendiendo de verdad. Haz 5 repeticiones hoy. Las primeras 2 serán incómodas — eso significa que estás creciendo.' },
    { id: `${id}-3`, title: 'Maneja el rechazo — y decodifícalo', description: 'Escribe cada "no" u objeción que recibiste. Para cada uno, redacta una mejor respuesta. Luego identifica el PATRÓN: ¿cuál es la objeción real escondida detrás de la excusa superficial?', type: 'text_input', points: 15, required: true, hint: 'Cada "no" contiene una lección. "Muy caro" = no has demostrado suficiente valor. "Ahora no" = no has creado urgencia. "Necesito pensarlo" = no has abordado su miedo real. Decodifica, no te defiendas.' },
    { id: `${id}-4`, title: `Practica "${t}" y grábate`, description: 'Practica esta habilidad de ventas en voz alta. Grábate en video o haz role-play con un amigo que sea brutalmente honesto. Mírate. Identifica tu área de mejora #1.', type: 'file_upload', points: 15, required: false, hint: 'Te dará vergüenza verte. Ese es el punto. Enfócate en: tono (seguro pero no agresivo), escucha (¿estás hablando más del 40% del tiempo?), y claridad (¿pueden repetir tu oferta de vuelta?).' },
    { id: `${id}-5`, title: 'Construye un flujo de trabajo CRM', description: `Configura un sistema de seguimiento simple para "${t}": hoja de cálculo, Notion o CRM real. Incluye: Prospecto, Fecha, Estado, Próximo Paso, Notas. Sube una captura. Si no se registra, no sucedió.`, type: 'file_upload', points: 15, required: false, hint: 'Una hoja de Google con 5 columnas es un CRM. Empieza allí. La herramienta no importa — el hábito de registrar cada interacción importa. La mayoría pierde ventas porque olvida hacer seguimiento. No seas ese fundador.' },
    { id: `${id}-6`, title: 'Escribe tu guion de ventas personal', description: `Crea un guion conciso para "${t}" que suene como TÚ — no como un robot corporativo. Incluye: apertura, propuesta de valor, preguntas de calificación, respuestas a objeciones y cierre. Hazlo conversacional.`, type: 'text_input', points: 15, required: true, hint: 'Los mejores guiones de ventas no suenan a guiones. Lee el tuyo en voz alta. Si suena como algo que nunca le dirías a un amigo en un café, reescríbelo. La autenticidad cierra más tratos que la labia.' },
    { id: `${id}-7`, title: 'Identifica el "olor a fundador desesperado"', description: `¿Qué hace que "${t}" se sienta insistente, desesperado o "vendemotos" de mala manera? Investiga lo que más ahuyenta en ventas. Escribe lo que NUNCA harás — tu anti-playbook personal.`, type: 'text_input', points: 10, required: false, hint: 'La desesperación es el mata-tratos #1. Se manifiesta como: hablar demasiado rápido, descontar muy rápido, no escuchar, hacer seguimiento 5 veces en 2 días. La confianza es silenciosa. La desesperación es ruidosa. Sé lo primero.' },
    { id: `${id}-8`, title: 'Construye una hoja de referencia para objeciones', description: `Crea una referencia de una página con las 5 objeciones principales que encuentras al hacer "${t}" — y tus mejores respuestas para cada una. Súbela. Tenla visible durante cada conversación de ventas.`, type: 'file_upload', points: 15, required: false, hint: 'Las objeciones son predecibles. "Muy caro", "Ahora no", "Necesito pensarlo", "Hablar con mi socio", "Uso un competidor". Ten tus respuestas listas. La preparación elimina el pánico. El pánico mata tratos.' },
    { id: `${id}-9`, title: 'Establece métricas diarias de actividad de ventas', description: 'Define tu actividad mínima diaria de ventas: llamadas, correos, DMs, seguimientos. Escribe tu objetivo. Regístralo durante 5 días. Las ventas son un juego de volumen — actividad entra, tratos salen.', type: 'text_input', points: 10, required: false, hint: 'Si no sabes cuántos intentos de alcance hiciste hoy, no estás haciendo suficiente. Los mejores SDRs hacen 50-100 contactos por día. Empieza con 20. Aumenta semanalmente. La actividad es la única variable que controlas.' },
    { id: `${id}-10`, title: 'Reflexiona: ¿Cuál es tu tasa de cierre — y por qué?', description: 'Calcula tu tasa de conversión de la actividad de ventas de esta semana. Prospectos contactados → conversaciones → leads calificados → cerrados. Escribe los números. ¿Dónde está la mayor caída? ¿Qué mejorarás la próxima semana?', type: 'text_input', points: 15, required: true, hint: 'La mayoría de los fundadores no tienen idea de su tasa de cierre. "Sienten" que están haciendo ventas. Los números no mienten. Tasa de cierre del 1% en 100 contactos = 1 cliente. Mejora al 3% = 3 clientes. Mismo esfuerzo, 3x resultados.' },
  ],
  // Phase 4: Producto y Base Técnica
  4: (id, t) => [
    { id: `${id}-1`, title: `Comprende la base técnica de "${t}"`, description: 'Investiga cómo los productos exitosos implementan esto. Escribe un informe técnico de 150 palabras: qué necesita suceder, decisiones clave, errores comunes y qué NO sobre-diseñar.', type: 'text_input', points: 15, required: true, hint: 'No necesitas ser desarrollador, pero necesitas saber lo suficiente para que no te estafen. 30 minutos de investigación ahorran miles en malas decisiones de desarrollo. Entiende el "por qué" antes del "cómo".' },
    { id: `${id}-2`, title: `Lanza una mejora de "${t}" HOY`, description: 'Haz una mejora concreta y desplegable a tu producto basada en esta lección — código, diseño, infraestructura o proceso. Documenta el cambio. Una mejora implementada > una obra maestra planeada.', type: 'text_input', points: 20, required: true, hint: 'Lanza una cosa hoy. Incluso si es pequeña. El impulso supera a la perfección en producto. Una funcionalidad viva con 80% de calidad es infinitamente más valiosa que una perfecta que sigue "en desarrollo" 3 meses después.' },
    { id: `${id}-3`, title: `Prueba tu implementación de "${t}" a fondo`, description: 'Verifica que tu cambio realmente funciona. Pruébalo tú mismo en un dispositivo/red real. Luego haz que otra persona lo pruebe. Escribe cada error, punto de fricción o caso límite encontrado.', type: 'text_input', points: 15, required: true, hint: '"Funciona en mi máquina" mata productos. Prueba en dispositivos reales, redes reales, escenarios reales. Si no puedes reproducirlo, no puedes arreglarlo. Si un usuario puede romperlo en 30 segundos, lo hará.' },
    { id: `${id}-4`, title: `Documenta tu configuración de "${t}"`, description: 'Escribe una breve página de documentación: qué hiciste, por qué elegiste este enfoque, alternativas consideradas y lo que un futuro desarrollador (o tu yo futuro) necesita saber. Súbela.', type: 'text_input', points: 10, required: false, hint: 'El código que escribiste hace 6 meses bien podría haber sido escrito por un desconocido. Tu yo del futuro apreciará profundamente 5 minutos de documentación hoy. Incluye: pasos de configuración, decisiones clave y trampas conocidas.' },
    { id: `${id}-5`, title: `Mide el impacto de "${t}"`, description: 'Configura el seguimiento para esta funcionalidad/cambio. Después de 3-7 días, revisa tus analíticas. ¿Mejoró tu métrica estrella norte? ¿Satisfacción del usuario? ¿Rendimiento? Escribe los números — datos crudos, sin adornos.', type: 'text_input', points: 15, required: false, hint: 'Si no puedes medirlo, no puedes mejorarlo. Cada funcionalidad necesita una métrica de éxito. Incluso "menos tickets de soporte" o "tiempo de carga más rápido" cuenta. Conecta cada cambio a un número — o cuestiona por qué lo estás haciendo.' },
    { id: `${id}-6`, title: 'Investiga cómo los mejores productos manejan esto', description: `Encuentra 2-3 productos exitosos que hacen "${t}" excepcionalmente bien. Estudia su implementación. Escribe qué copiarías, qué mejorarías y qué no aplica a tu escala.`, type: 'text_input', points: 10, required: false, hint: 'Los grandes productos dejan pistas. Mira la documentación de API de Stripe, el onboarding de Notion, la velocidad de Linear. Resolvieron los mismos problemas que tú enfrentas. No copies ciegamente — adapta pensativamente a tu contexto y escala.' },
    { id: `${id}-7`, title: 'Identifica la trampa del sobre-diseño', description: `¿Cuál es la forma #1 en que los fundadores sobre-diseñan "${t}" — construyendo soluciones complejas para problemas que aún no tienen? Escribe cómo se ve "suficientemente bueno" vs "bañado en oro". Lanza suficientemente bueno primero.`, type: 'text_input', points: 10, required: false, hint: 'La optimización prematura es la raíz de todo mal (y tiempo perdido). Si no tienes usuarios todavía, no necesitas Kubernetes. Si tienes 100 usuarios, no necesitas microservicios. Escala la solución al problema real.' },
    { id: `${id}-8`, title: 'Crea un registro de decisiones técnicas', description: 'Inicia un registro simple de decisiones técnicas: qué elegiste, por qué, alternativas consideradas, compromisos aceptados. Sube la primera entrada sobre el cambio de este nivel. Esto se vuelve invaluable a medida que tu equipo crece.', type: 'file_upload', points: 15, required: false, hint: 'En 12 meses, alguien (quizás tú) preguntará "¿por qué lo construimos así?" Un registro de decisiones responde esa pregunta. También evita repetir debates. $0 de crear, miles en confusión ahorrada.' },
    { id: `${id}-9`, title: 'Configura monitoreo o alertas', description: `¿Cómo sabrás si "${t}" se rompe? Configura monitoreo básico: seguimiento de errores, alertas de rendimiento o una verificación diaria simple. Escribe lo que configuraste. Las funcionalidades rotas que no conoces son asesinas de reputación.`, type: 'text_input', points: 10, required: false, hint: 'Los usuarios no siempre reportan errores — simplemente se van. Una simple verificación de disponibilidad o alerta de error puede ser la diferencia entre arreglar un problema en 5 minutos vs descubrirlo 2 semanas después por usuarios que se fueron.' },
    { id: `${id}-10`, title: 'Reflexiona: Compromiso entre velocidad y calidad', description: 'Después de este ciclo, reflexiona honestamente: ¿Lanzaste suficientemente rápido? ¿Sacrificaste demasiada calidad? ¿Dónde está tu equilibrio? Escribe tu filosofía personal de "velocidad de lanzamiento" basada en lo que aprendiste.', type: 'text_input', points: 15, required: true, hint: 'Algunos fundadores lanzan basura y lo llaman "MVP". Otros pulen para siempre y nunca lanzan. El punto ideal es diferente para cada producto. Encuentra el tuyo: ¿cuál es la barra de calidad mínima que tus clientes realmente exigen?' },
  ],
  // Phase 5: Legal, Finanzas y Administración
  5: (id, t) => [
    { id: `${id}-1`, title: `Comprende los fundamentos legales/financieros de "${t}"`, description: 'Investiga los fundamentos. ¿Qué necesita saber ABSOLUTAMENTE cada fundador sobre este tema? Escribe un resumen de 150 palabras en lenguaje sencillo — sin jerga legal, sin tecnicismos.', type: 'text_input', points: 15, required: true, hint: 'Legal y finanzas no son solo para abogados y contadores. Eres el CEO — la ignorancia es la estrategia legal más cara. 30 minutos de investigación hoy previenen un error de $50K el próximo año.' },
    { id: `${id}-2`, title: `Toma acción: configura "${t}" HOY`, description: 'Ejecuta la configuración o acción clave. Ya sea presentar un documento, abrir una cuenta, redactar una política o hacer un cálculo — hazlo AHORA. Sube pruebas. Empezar es la parte más difícil.', type: 'file_upload', points: 25, required: true, hint: 'Las tareas legales/financieras se sienten aburridas y aterradoras — por eso los fundadores las evitan durante meses. Pon un temporizador de 25 minutos y simplemente EMPIEZA. Te sorprenderá cuánto logras una vez que rompes la inercia.' },
    { id: `${id}-3`, title: 'Construye una lista de verificación de cumplimiento', description: `Crea una checklist simple para "${t}": qué necesita suceder ahora, mensualmente, trimestralmente y anualmente. Súbela. El cumplimiento no es un evento único — es una práctica continua.`, type: 'file_upload', points: 15, required: true, hint: 'Una checklist de 10 ítems que revisas mensualmente previene la factura legal de $50K que recibes cuando algo se escapa por las grietas. La checklist es aburrida hasta el día que salva tu empresa. Ese día siempre llega.' },
    { id: `${id}-4`, title: 'Consulta a un experto (aunque sea brevemente)', description: `Habla con un abogado, contador o experto en el dominio sobre "${t}". Incluso una llamada de 15 minutos o una consulta gratuita. Escribe sus consejos clave y lo que más te sorprendió. Los expertos ven riesgos que tú no.`, type: 'text_input', points: 15, required: false, hint: 'SCORE.org, oficinas locales de SBA, Clerky, Stripe Atlas y clínicas de facultades de derecho ofrecen orientación experta gratuita o de bajo costo. Un consejo de experto puede ahorrarte años de dolores de cabeza. Usa los recursos que existen.' },
    { id: `${id}-5`, title: 'Configura recordatorios de calendario recurrentes', description: `Esto no es un tema de "hecho y olvidado". Configura recordatorios de calendario mensuales, trimestrales o anuales para revisar "${t}". Sube una captura. Automatiza el recordar.`, type: 'file_upload', points: 10, required: false, hint: 'Las cosas legales/financieras que matan startups son las que OLVIDAS. Automatiza los recordatorios. Tu yo del futuro te lo agradecerá cuando no estés corriendo para arreglar algo que podría haberse manejado hace meses.' },
    { id: `${id}-6`, title: 'Investiga una historia de terror real', description: `Encuentra una startup que fue DESTRUIDA porque manejó mal "${t}". Escribe qué pasó, cuánto les costó y qué deberían haber hecho. Aprende de los desastres — son los maestros más honestos.`, type: 'text_input', points: 10, required: false, hint: 'Busca "[tema] demanda startup" o "[tema] pesadilla fundador". Historias reales de desastres de tabla de capitalización, robo de PI, penalizaciones fiscales y peleas entre cofundadores. No son raras — son comunes. Y casi todas eran prevenibles.' },
    { id: `${id}-7`, title: 'Identifica la trampa del "Lo haré después"', description: `¿Por qué los fundadores posponen crónicamente "${t}"? ¿Cuál es la razón psicológica? Escribe tu respuesta honesta — y tu compromiso de parar. El mejor momento para manejar esto fue cuando te incorporaste. El segundo mejor momento es hoy.`, type: 'text_input', points: 10, required: false, hint: 'Los fundadores postergan legal/finanzas porque se siente como "defensa" mientras construir producto se siente como "ataque". Pero un desastre legal puede destruir todo lo que tu ataque construyó. La defensa gana campeonatos.' },
    { id: `${id}-8`, title: 'Crea un panel de control legal/financiero', description: `Construye un panel o rastreador simple para "${t}": documentos clave, fechas de vencimiento, plazos de renovación, partes responsables. Sube una captura. Centraliza la información para que nada se escape.`, type: 'file_upload', points: 15, required: false, hint: 'Información dispersa = plazos perdidos = exposición legal. Un documento central con todas tus fechas y documentos legales/financieros clave. Compártelo con tu cofundador. Revísalo mensualmente. Toma 30 minutos crearlo.' },
    { id: `${id}-9`, title: 'Documenta fechas y plazos clave', description: `Enumera cada fecha importante relacionada con "${t}": plazos de presentación, fechas de renovación, revisiones de cumplimiento, fechas fiscales. Configura alertas de calendario para cada una. Sube tu rastreador de fechas.`, type: 'file_upload', points: 10, required: false, hint: 'Al gobierno y los reguladores no les importa que estuvieras "ocupado construyendo producto". Los plazos perdidos tienen consecuencias reales — multas, penalizaciones, pérdida de buena reputación. Una alerta de calendario es el seguro más barato que comprarás.' },
    { id: `${id}-10`, title: 'Reflexiona: ¿Cuál es tu exposición al riesgo?', description: 'Después de este nivel, evalúa honestamente: ¿A qué riesgos legales/financieros estás actualmente expuesto? Califica cada uno 1-10 en gravedad y probabilidad. Escribe tus 3 principales riesgos y tu plan para abordar cada uno.', type: 'text_input', points: 15, required: true, hint: 'Cada fundador tiene riesgos legales/financieros que está ignorando. La pregunta es si los identificas antes de que se conviertan en crisis. Una evaluación de riesgos de 10 minutos hoy supera una batalla legal de 10 meses mañana.' },
  ],
  // Phase 6: Operaciones y La Máquina
  6: (id, t) => [
    { id: `${id}-1`, title: `Mapea tu flujo de trabajo actual de "${t}"`, description: 'Diagrama o enumera cada paso de cómo funciona actualmente este proceso. Sé brutalmente honesto — incluye las partes desordenadas, las soluciones provisionales y los parches "temporales" que se volvieron permanentes.', type: 'text_input', points: 15, required: true, hint: 'No puedes mejorar lo que no puedes ver. Mapea el proceso REAL, no la versión idealizada. La brecha entre "estado actual" y "estado ideal" es tu hoja de ruta de operaciones. Sé honesto — esto es para ti, no para mostrar.' },
    { id: `${id}-2`, title: 'Ejecuta la Victoria Rápida AHORA', description: `Toma acción inmediata en la Victoria Rápida para "${t}". Documenta lo que cambiaste, automatizaste o mejoraste. Sube capturas de antes/después. Las pequeñas victorias construyen impulso operativo.`, type: 'file_upload', points: 20, required: true, hint: 'La mejora de operaciones es un juego de centímetros. No intentes arreglar todo a la vez — te abrumarás y no harás nada. Elige el ÚNICO cuello de botella que causa más dolor. Arrélglalo. Luego pasa al siguiente.' },
    { id: `${id}-3`, title: 'Automatiza o delega un paso', description: `Encuentra un paso en "${t}" que pueda automatizarse (Zapier, n8n, IA, scripts) o delegarse a otra persona. Impleméntalo HOY. Escribe lo que liberaste: tiempo, energía mental o dinero.`, type: 'text_input', points: 20, required: true, hint: 'Tu tarifa por hora como fundador = valor de la empresa ÷ tus horas de trabajo. Si una tarea puede hacerse por menos de esa tarifa, DEJA de hacerla. Delégala. Automatízala. Tu trabajo es construir el negocio, no ejecutar cada proceso.' },
    { id: `${id}-4`, title: `Escribe un procedimiento operativo estándar para "${t}"`, description: 'Crea un Procedimiento Operativo Estándar: propósito, instrucciones paso a paso, herramientas necesarias, resultados esperados, solución de problemas comunes y quién es responsable. Escríbelo tan claro que un desconocido pueda ejecutarlo.', type: 'text_input', points: 15, required: true, hint: 'Un SOP es una carta de amor a tu futuro reemplazo — que podría ser tu yo del futuro después de unas vacaciones. Si un desconocido no puede ejecutar el SOP, está incompleto. Pruébalo: dáselo a alguien y observa cómo lo intenta.' },
    { id: `${id}-5`, title: 'Mide la eficiencia esta semana', description: `Registra cuánto tiempo toma "${t}" y cuánto cuesta (tiempo, dinero, errores, frustración). Establece una línea base. Luego establece una meta de mejora específica y medible para la próxima semana. No puedes mejorar lo que no mides.`, type: 'text_input', points: 15, required: false, hint: 'La mayoría de los fundadores NO TIENEN IDEA de cuánto tardan sus procesos centrales. Registra el tiempo durante una semana. Los números te sorprenderán. Un proceso que crees que toma "30 minutos" podría tomar 2 horas cuando cuentas interrupciones y retrabajo.' },
    { id: `${id}-6`, title: 'Estudia una empresa con operaciones legendarias', description: `Investiga una empresa famosa por excelencia operativa en "${t}" — Amazon (logística), Toyota (manufactura), McDonald's (franquicias). Escribe 3 principios que puedas adaptar a tu escala.`, type: 'text_input', points: 10, required: false, hint: 'Las grandes operaciones no se tratan de tamaño — se tratan de sistemas. Una startup de 2 personas puede tener mejores operaciones que una empresa de 200 personas. La clave es documentación, automatización y simplificación implacable. Copia de los mejores.' },
    { id: `${id}-7`, title: 'Identifica la trampa del micro-management', description: `¿Cuál es la diferencia entre rigor operativo saludable y micro-management tóxico con respecto a "${t}"? Escribe tu línea personal. ¿Hacia dónde tiendes? Sé honesto — la mayoría de los fundadores tienden al micro-management.`, type: 'text_input', points: 10, required: false, hint: 'El micro-management dice: "Hazlo exactamente a mi manera". Las buenas operaciones dicen: "Aquí está el resultado que necesitamos, aquí están las restricciones, así es como mediremos el éxito — ahora ve y descubre el mejor camino". Confía en el proceso, luego confía en las personas.' },
    { id: `${id}-8`, title: 'Construye un panel de control de operaciones', description: `Crea un panel simple para "${t}": métricas clave, estado actual, cuellos de botella y tendencias. Sube una captura. La visibilidad centralizada evita que los problemas se escondan en las sombras.`, type: 'file_upload', points: 15, required: false, hint: 'Un panel no necesita ser elegante. Una hoja de Google con métricas clave actualizadas semanalmente es infinitamente mejor que ninguna visibilidad. El objetivo es detectar problemas ANTES de que se conviertan en crisis. Detección temprana = soluciones baratas.' },
    { id: `${id}-9`, title: 'Construye un árbol de decisión de delegación', description: 'Crea un marco simple: ¿qué tareas debes hacer personalmente, qué debes delegar, qué debes automatizar y qué debes eliminar? Aplícalo a tu carga de trabajo actual. Sube tu marco.', type: 'file_upload', points: 15, required: false, hint: 'Matriz de Eisenhower con esteroides: Urgente+Importante = tú. Importante+No Urgente = delega. Urgente+No Importante = automatiza. No Urgente+No Importante = elimina. La mayoría de los fundadores pasan el 80% del tiempo en las últimas dos categorías.' },
    { id: `${id}-10`, title: 'Reflexiona: ¿Cuál es tu mayor fuga de tiempo?', description: 'Después de esta inmersión profunda en operaciones, reflexiona: ¿Dónde eres personalmente el cuello de botella? ¿Qué tarea deberías haber dejado de hacer hace meses? ¿Qué descargarás ESTA SEMANA? Escribe tu compromiso y primera acción.', type: 'text_input', points: 15, required: true, hint: 'El fundador que hace todo es el fundador que no construye nada grande. Tu actividad de mayor apalancamiento es lo que SOLO tú puedes hacer. Todo lo demás es distracción. Identifícalo. Descárgalo. Libérate para construir.' },
  ],
  // Phase 7: Talento y Cultura
  7: (id, t) => [
    { id: `${id}-1`, title: `Define cómo se ve un gran "${t}"`, description: 'Escribe una definición clara y específica de excelencia en esta área. ¿Cómo se ve un A+? ¿Qué es un B? ¿Qué es inaceptable? Las expectativas vagas producen resultados vagos. Escríbelo como si se lo explicaras a un nuevo empleado en su primer día.', type: 'text_input', points: 15, required: true, hint: 'Si no puedes definir "excelente", no puedes contratar para ello, entrenar hacia ello, promover basado en ello ni medirlo. Tu definición ES tu estándar. Hazla concreta. "Buen comunicador" es vago. "Responde todos los mensajes en 4 horas con próximos pasos claros" es real.' },
    { id: `${id}-2`, title: `Audita tu realidad actual de "${t}"`, description: 'Evalúa honestamente dónde te encuentras. Califícate del 1 al 10. Escribe lo que funciona, lo que está roto y lo que estás evitando. Sin endulzar. La autoconciencia es la primera habilidad de liderazgo.', type: 'text_input', points: 15, required: true, hint: 'Si te calificas 8+ en todo, o eres delirante o no estás profundizando lo suficiente. El crecimiento real comienza con una honestidad incómoda. El fundador que cree que está clavando el talento probablemente tiene una puerta giratoria de empleados.' },
    { id: `${id}-3`, title: `Construye o actualiza tu sistema de "${t}"`, description: 'Crea el sistema real: descripciones de trabajo, tarjetas de puntuación de entrevistas, checklists de incorporación, plantillas de revisión, documentos de cultura. Sube tu producto de trabajo. Los sistemas no son burocracia — son barandillas.', type: 'file_upload', points: 20, required: true, hint: 'Un sistema de Google Doc de $0 hoy supera una plataforma de RRHH de $50K que "configurarás el próximo trimestre". Escribe tu tarjeta de puntuación de entrevistas AHORA. Redacta tu checklist de incorporación AHORA. Hecho es mejor que perfecto, y perfecto nunca se publica.' },
    { id: `${id}-4`, title: 'Obtén retroalimentación honesta', description: `Pide a un miembro del equipo, colega o mentor retroalimentación brutalmente honesta sobre cómo manejas "${t}". Escribe sus palabras exactas — especialmente las partes incómodas. No te defiendas. No expliques. Solo absorbe y agradece.`, type: 'text_input', points: 15, required: false, hint: 'Franqueza radical = preocuparse personalmente + desafiar directamente. Pregunta: "¿Qué es UNA cosa que podría hacer mejor en [área]?" Luego cállate. Deja que el silencio repose. La gente lo llenará con verdad si les das espacio y no te pones a la defensiva.' },
    { id: `${id}-5`, title: 'Establece una meta de mejora de 30 días', description: `Basado en tu auditoría y retroalimentación, elige UNA mejora específica y visible para "${t}" en 30 días. Escribe la meta, la métrica, tu primera acción HOY y cómo sabrás si tuviste éxito.`, type: 'text_input', points: 15, required: false, hint: 'La cultura cambia un hábito a la vez. No anuncies una "transformación cultural" — elige un cambio visible, hazlo bien y deja que el impulso te lleve al siguiente. Victorias pequeñas y consistentes > grandes iniciativas abandonadas.' },
    { id: `${id}-6`, title: 'Estudia cómo las mejores empresas hacen esto', description: `Investiga 2 empresas legendarias por "${t}" — Netflix (cultura), Google (contratación), Bridgewater (verdad radical). Escribe 3 prácticas que puedas adaptar, escaladas a tu tamaño.`, type: 'text_input', points: 10, required: false, hint: 'El documento de cultura de Netflix ha sido visto millones de veces por una razón. Las prácticas de contratación de Google se estudian globalmente. Estos no son secretos — están documentados públicamente. Copia lo que funciona. Adapta lo que no. Ignora lo que solo es relevante a su escala.' },
    { id: `${id}-7`, title: 'Identifica la trampa de "contratar clones"', description: `El mayor error de contratación: contratar gente igual a ti. ¿Cómo se manifestaría esto para "${t}"? Escribe cómo se ve realmente la diversidad de pensamiento en esta área — y cómo la buscarás activamente.`, type: 'text_input', points: 10, required: false, hint: 'Un equipo de clones está de acuerdo en todo y no desafía nada. Son cómodos. También son ciegos a sus propias debilidades. Los mejores equipos tienen desacuerdo productivo. Contrata personas que complementen tus debilidades, no que reflejen tus fortalezas.' },
    { id: `${id}-8`, title: 'Escribe tu manifiesto cultural', description: `¿En qué crees sobre "${t}" más allá de las tácticas? Escribe un manifiesto personal: tus innegociables, tu filosofía, lo que defiendes y lo que no tolerarás. Esta es tu brújula de liderazgo.`, type: 'text_input', points: 15, required: false, hint: 'Cuando la presión aumenta, no te elevas a la ocasión — caes a tus sistemas y creencias. Un manifiesto escrito es tu ancla. "Creemos en X, por lo tanto hacemos Y, y NUNCA hacemos Z". Publícalo. Vívelo.' },
    { id: `${id}-9`, title: 'Construye una checklist de incorporación', description: `Crea un plan de incorporación de 30 días para un nuevo miembro del equipo enfocado en "${t}". ¿Qué necesitan saber, hacer, leer y lograr para los días 7, 14 y 30? Sube tu plan. Las primeras impresiones marcan la trayectoria.`, type: 'file_upload', points: 15, required: false, hint: 'La mayoría de la incorporación es "aquí está tu laptop, buena suerte". La gran incorporación es un viaje deliberado de 30 días. Día 1: cultura y contexto. Día 7: herramientas y procesos. Día 14: primera pequeña victoria. Día 30: contribución independiente. Diséñalo intencionalmente.' },
    { id: `${id}-10`, title: 'Reflexiona: ¿Eres un imán o un repelente de talento?', description: 'Después de esta inmersión profunda, reflexiona honestamente: ¿Los jugadores A QUERRÍAN trabajar contigo? ¿Por qué sí o por qué no? ¿Cuál es tu reputación como líder? Escribe qué harás para convertirte en el tipo de líder que atrae a personas extraordinarias.', type: 'text_input', points: 15, required: true, hint: 'Los jugadores A quieren: autonomía, maestría, propósito y compensación justa — en ese orden. Se van por malos gerentes, no por malas empresas. ¿Eres la razón por la que alguien se uniría — o la razón por la que se iría? Sé honesto. Luego sé mejor.' },
  ],
  // Phase 8: Capital e Inversión
  8: (id, t) => [
    { id: `${id}-1`, title: `Investiga cómo funciona "${t}" en el mundo real`, description: 'Estudia 3 historias reales de financiación (éxitos Y fracasos) relacionadas con este tema. Escribe las lecciones clave de cada una. ¿Qué salió bien? ¿Qué salió catastróficamente mal? Aprende de ambos.', type: 'text_input', points: 15, required: true, hint: 'Lee autopsias de fundadores sobre recaudaciones fallidas. Son más educativas que las historias de éxito. Busca "por qué fracasamos al recaudar" en Medium, IndieHackers o Twitter. Los rechazos de otros son tu MBA gratuito en recaudación de fondos.' },
    { id: `${id}-2`, title: `Prepara tus materiales de "${t}"`, description: 'Crea o actualiza los materiales específicos: modelo financiero, sección del pitch deck, documento del data room, borrador de term sheet, FAQ para inversores. Sube lo que construiste. La preparación señala profesionalismo.', type: 'file_upload', points: 20, required: true, hint: 'Los inversores huelen la falta de preparación desde el otro lado de la sala. Tener tus materiales listos ANTES de necesitarlos es un movimiento de poder. Dice: "Respeto tu tiempo, soy serio, he hecho el trabajo". Las primeras impresiones en recaudación lo son todo.' },
    { id: `${id}-3`, title: `Practica "${t}" con retroalimentación brutalmente honesta`, description: 'Presenta esto a alguien que te dará retroalimentación real — no "¡se ve genial!" Escribe sus críticas exactas y lo que cambiarás. Encuentra al amigo que te dirá que tus números no tienen sentido antes de que lo haga un inversor.', type: 'text_input', points: 15, required: true, hint: 'Si tu audiencia de práctica dice "se ve genial" sin ninguna sugerencia, encuentra una mejor audiencia. Quieres a la persona que dice "la diapositiva 7 contradice la 3" y "tu cálculo de TAM es ridículo". Esa persona te salva.' },
    { id: `${id}-4`, title: `Construye tu lista de objetivos para "${t}"`, description: 'Crea una hoja de cálculo de posibles inversores, prestamistas o socios. Incluye: nombre, firma, tamaño de cheque, por qué encajan, ruta de presentación cálida y estado. La recaudación es un embudo — construye la parte superior del tuyo.', type: 'text_input', points: 15, required: true, hint: 'Matemáticas del embudo de recaudación: 100 objetivos → 20 primeras reuniones → 5 segundas reuniones → 2-3 term sheets → 1 cierre. Si tu parte superior del embudo es de 5 nombres, tus probabilidades son terribles. Construye una lista real. 100 no es demasiado — es el mínimo.' },
    { id: `${id}-5`, title: 'Toma una acción real HOY', description: `Envía un correo, haz una llamada, presenta una solicitud o programa una reunión relacionada con "${t}". Escribe lo que hiciste y el resultado. La recaudación es un juego de impulso — una acción por día se acumula.`, type: 'text_input', points: 20, required: true, hint: 'La mayoría de los fundadores recaudan cero dólares porque tomaron cero acciones. Una acción por día = 30 acciones por mes = impulso real. No esperes hasta "sentirte listo". Listo es un sentimiento que nunca llega. Solo toma una acción. Hoy.' },
    { id: `${id}-6`, title: 'Estudia y decodifica un term sheet real', description: `Encuentra un term sheet de muestra relacionado con "${t}". Lee cada cláusula. Investiga qué significa cada una. Escribe 3 términos que no entendías antes y lo que aprendiste. El conocimiento es poder de negociación.`, type: 'text_input', points: 15, required: false, hint: 'Los term sheets no son solo sobre valoración. Preferencias de liquidación, derechos de participación, anti-dilución, puestos en el directorio, arrastre — cada término puede valer millones. Entiéndelos ANTES de estar mirando uno con un plazo de 48 horas.' },
    { id: `${id}-7`, title: 'Identifica la trampa de "recaudar demasiado pronto"', description: `¿Cuáles son los peligros de buscar "${t}" antes de estar listo? Escribe 3 señales de que deberías recaudar ahora vs 3 señales de que deberías esperar. La mayoría recauda demasiado pronto y regala demasiado.`, type: 'text_input', points: 10, required: false, hint: 'Recaudar demasiado pronto = regalar capital barato. Recaudar demasiado tarde = quedarse sin efectivo. El punto ideal: cuando tienes suficiente tracción para obtener buenos términos pero suficiente runway para negociar. Si estás desesperado, los inversores lo huelen.' },
    { id: `${id}-8`, title: 'Construye un rastreador de recaudación', description: 'Crea un rastreador para tu proceso de recaudación: nombre del inversor, etapa, último contacto, próximo paso, notas y fecha de seguimiento. Sube una captura. Los fundadores organizados obtienen financiación. Los desorganizados son olvidados.', type: 'file_upload', points: 15, required: false, hint: 'Un proceso de recaudación sin rastreador es caos. Olvidarás seguimientos, confundirás inversores y parecerás poco profesional. Una simple hoja de cálculo previene todo esto. Actualízala después de cada interacción. Tu yo financiado del futuro te lo agradecerá.' },
    { id: `${id}-9`, title: 'Crea tu narrativa de "¿Por qué nosotros?"', description: 'Escribe una narrativa convincente de 2 minutos: por qué ESTE equipo, por qué ESTE problema, por qué AHORA y por qué ESTA solución es inevitable. Esta es la historia que hace que los inversores se inclinen. Sube tu narrativa.', type: 'text_input', points: 15, required: false, hint: 'Los inversores escuchan 1,000 pitches por año. Recuerdan historias, no diapositivas. Tu narrativa debe responder: "¿Por qué ganará este equipo donde otros fracasaron?" Sé específico. Sé honesto. Sé convincente. Esta es tu mitología de fundador — constrúyela con cuidado.' },
    { id: `${id}-10`, title: 'Reflexiona: ¿Realmente necesitas capital externo?', description: 'Después de esta inmersión profunda, reflexiona honestamente: ¿NECESITAS financiación externa o la QUIERES? ¿Qué harías diferente si bootstrapearas? Escribe tu evaluación honesta. El capital es una herramienta, no un objetivo.', type: 'text_input', points: 15, required: true, hint: 'La financiación de VC NO es el camino predeterminado — es una herramienta específica para un tipo específico de negocio. La mayoría de los grandes negocios son bootstraped. Antes de recaudar, pregúntate: "¿Construiría esto igual si no pudiera recaudar ni un centavo?" Si la respuesta es no, quizás no lo construyas.' },
  ],
  // Phase 9: Gobernanza y El Juego Infinito
  9: (id, t) => [
    { id: `${id}-1`, title: `Estudia cómo las grandes empresas manejan "${t}"`, description: 'Investiga cómo las empresas exitosas y maduras abordan este tema de gobernanza. Escribe 3 mejores prácticas que adoptarás y 3 errores que evitarás. Aprende de quienes ya navegaron lo que estás por enfrentar.', type: 'text_input', points: 15, required: true, hint: 'Lee informes anuales, cartas a accionistas (Buffett, Bezos) y casos de estudio de gobernanza. Los patrones de la gran gobernanza son claros y atemporales. La mayoría se aprendieron a través de errores dolorosos — aprende de los suyos, no de los tuyos.' },
    { id: `${id}-2`, title: `Toma acción en "${t}" AHORA`, description: 'Completa la Victoria Rápida: crea la estructura del directorio, plan de crisis, política de ética o documento de legado. Sube tu resultado. La gobernanza construida en clima tranquilo se mantiene cuando llega la tormenta.', type: 'file_upload', points: 20, required: true, hint: 'La gobernanza se siente como problemas del "yo del futuro". Pero el mejor momento para construir gobernanza es cuando las cosas van bien — no cuando estás en modo crisis. El techo es más fácil de arreglar cuando brilla el sol.' },
    { id: `${id}-3`, title: `Escribe tu filosofía personal de "${t}"`, description: 'Ve más allá de las tácticas — ¿en qué CREES sobre este tema? Escribe un manifiesto personal o conjunto de principios innegociables. Las tácticas cambian. Los principios perduran. Esta es tu brújula cuando se acaba el mapa.', type: 'text_input', points: 15, required: true, hint: '"Creo en X porque Y. Por lo tanto, siempre haré Z. Y nunca haré W." Tu filosofía es lo que te guía cuando no hay manual. Escríbela ahora, antes de necesitarla. Será puesta a prueba algún día — probablemente más pronto de lo que crees.' },
    { id: `${id}-4`, title: 'Asesora a una persona', description: `Comparte lo que has aprendido sobre "${t}" con alguien que está más atrás en su camino de fundador. Escribe lo que les enseñaste Y lo que aprendiste al enseñar. El mentor casi siempre aprende más que el aprendiz.`, type: 'text_input', points: 15, required: false, hint: 'No necesitas ser un experto para asesorar — solo necesitas estar un paso adelante. Enseñar cristaliza tu comprensión. Explicar un concepto complejo de gobernanza a un principiante revela vacíos en tu propio conocimiento. LLénalos.' },
    { id: `${id}-5`, title: 'Construye un plan de legado de 5 años', description: `Amplía la vista: ¿cómo se conecta "${t}" con el impacto a largo plazo que quieres tener? Escribe una visión de 5 años para esta área con hitos específicos en los años 1, 3 y 5. Piensa en juego infinito, no en ganancias trimestrales.`, type: 'text_input', points: 15, required: false, hint: 'Los mejores fundadores juegan juegos infinitos. No están optimizando para el próximo trimestre — están construyendo algo que los trasciende. ¿Cuál es tu visión de 50 años? Ahora trabaja hacia atrás: ¿qué necesita ser cierto en 5 años para que eso sea posible?' },
    { id: `${id}-6`, title: 'Estudia fallos de gobernanza que destruyeron empresas', description: `Investiga 2 empresas que fueron DESTRUIDAS por fallos de gobernanza relacionados con "${t}" — Theranos (directorio), Enron (auditoría), WeWork (control del fundador). Escribe qué pasó y la lección de gobernanza.`, type: 'text_input', points: 10, required: false, hint: 'Los fallos de gobernanza no son aburridos — son desastres espectaculares que destruyen miles de millones. Theranos no tenía miembros independientes en el directorio con experiencia médica. El directorio de Enron renunció a las reglas de ética. La gobernanza no es papeleo — es el sistema inmunológico de tu empresa.' },
    { id: `${id}-7`, title: 'Identifica la trampa de "fundador como cuello de botella"', description: `¿Cómo se convierte "${t}" en un cuello de botella cuando el fundador se niega a soltar? Escribe cómo reconocerás esto en ti mismo — y qué harás al respecto. El fundador que no puede delegar gobernanza no puede escalar.`, type: 'text_input', points: 10, required: false, hint: 'La transición de "el fundador decide todo" a "el sistema de gobernanza decide" es dolorosa. Se siente como perder el control. Pero el control a escala es una ilusión — o construyes sistemas o te conviertes en el cuello de botella que limita el potencial de tu empresa.' },
    { id: `${id}-8`, title: 'Crea una plantilla de reunión de directorio', description: `Diseña una plantilla para reuniones de gobernanza efectivas sobre "${t}": estructura de agenda, lecturas previas, marco de decisión, elementos de acción y seguimiento. Sube tu plantilla. Las grandes reuniones no ocurren por accidente.`, type: 'file_upload', points: 15, required: false, hint: 'Malas reuniones de directorio: el fundador presenta 45 minutos, el directorio asiente, todos se van. Buenas reuniones: lecturas previas enviadas 72 horas antes, 15 min de presentación, 45 min de discusión estratégica, decisiones claras y responsables. Plantíllalo. Tu directorio te lo agradecerá.' },
    { id: `${id}-9`, title: 'Redacta un plan de sucesión/continuidad', description: `Si te atropellara un autobús mañana, ¿qué pasaría con "${t}"? Escribe un plan de continuidad de una página: quién sabe qué, contactos clave, procesos críticos. Súbelo. ¿Mórbido? Sí. ¿Irresponsable omitirlo? También sí.`, type: 'file_upload', points: 15, required: false, hint: 'El riesgo de persona clave es real. Si eres el único que conoce las contraseñas del banco, las relaciones con inversores o los plazos de cumplimiento — no eres un fundador, eres un punto único de fallo. Arrélglalo. Hoy.' },
    { id: `${id}-10`, title: 'Reflexiona: ¿Qué tipo de fundador quieres ser?', description: 'Después de esta inmersión profunda en gobernanza, reflexiona sobre tu legado: En 20 años, ¿qué quieres que la gente diga sobre cómo construiste tu empresa? Escribe tu respuesta. Luego identifica la brecha entre esa visión y tu comportamiento actual.', type: 'text_input', points: 15, required: true, hint: 'Nadie en su lecho de muerte desea haber optimizado más ganancias trimestrales. Piensan en impacto, relaciones y lo que construyeron que los trascendió. Define tu legado AHORA — no cuando sea demasiado tarde para cambiar el rumbo. Tus acciones diarias cierran la brecha o la amplían.' },
  ],
};

/**
 * Returns Spanish-localized tasks for a given advanced level.
 * Falls back to the English tasks if translation is unavailable.
 */
export function localizeLevelTasks(levelId: number, phaseIdx: number, title: string, locale: string): JourneyTask[] {
  if (locale === 'es') {
    const generator = taskSetsEs[phaseIdx];
    if (generator) {
      const theme = title.split(':')[0]?.trim() || title;
      return generator(String(levelId), theme);
    }
  }
  return makeLevelTasks(levelId, phaseIdx, title);
}
