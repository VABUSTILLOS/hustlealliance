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

/** Generate 5-6 hustle-driven tasks per level based on phase and level title */
function makeLevelTasks(levelId: number, phaseIdx: number, levelTitle: string): JourneyTask[] {
  const theme = levelTitle.split(':')[0]?.trim() || levelTitle;
  const id = String(levelId);

  // Phase-specific task templates
  const taskSets: Record<number, (id: string, theme: string) => JourneyTask[]> = {
    // Phase 1: Ideation & Alignment — Research, Define, Write, Validate, Share
    0: (id, t) => [
      { id: `${id}-1`, title: `Understand the core concept of "${t}"`, description: 'Research and write a 100-word summary of this concept in your own words. What is the key insight? Why does it matter for founders?', type: 'text_input', points: 15, required: true, hint: 'If you can\'t explain it simply, you don\'t understand it yet. Use plain language — avoid jargon.' },
      { id: `${id}-2`, title: `Execute the Quick Win immediately`, description: 'Complete the Quick Win action from the level description. Write down exactly what you did and the outcome — even if it feels small.', type: 'text_input', points: 20, required: true, hint: 'Action beats intention every time. Do it NOW, not "later today." Later today never comes.' },
      { id: `${id}-3`, title: `Apply "${t}" to your specific business`, description: 'Write a concrete plan for how this concept applies to YOUR business or idea. What changes will you make based on this insight?', type: 'text_input', points: 15, required: true, hint: 'Generic advice is worthless. Specific application is gold. If you can\'t connect this to your business, you haven\'t learned it yet.' },
      { id: `${id}-4`, title: `Share this insight with one other founder`, description: 'Tell one other entrepreneur or aspiring founder about what you learned. Write down their reaction and any pushback they gave you.', type: 'text_input', points: 10, required: false, hint: 'Teaching is the fastest way to learn. If they challenge you, that\'s even better — it forces deeper understanding.' },
      { id: `${id}-5`, title: `Create a one-page takeaway document`, description: 'Compile your notes, the Quick Win result, and your application plan into a single document or screenshot. Upload it.', type: 'file_upload', points: 15, required: false, hint: 'This becomes your personal playbook. In 6 months, revisiting these takeaways will show you how far you\'ve grown.' },
    ],
    // Phase 2: Validation & Quick Wins — Research, Interview, Test, Analyze, Decide
    1: (id, t) => [
      { id: `${id}-1`, title: `Research "${t}" with real data`, description: 'Don\'t guess — gather actual data. Find 3 real examples, case studies, or data points related to this concept. Write what you found.', type: 'text_input', points: 15, required: true, hint: 'Google "case study [your topic]" and find at least one real company that succeeded or failed at this. Learn from their scars, not just their victories.' },
      { id: `${id}-2`, title: `Execute the Quick Win NOW`, description: 'Take the Quick Win action immediately. Write the exact steps you took and the result. If you hit resistance, document that too — resistance is data.', type: 'text_input', points: 20, required: true, hint: 'Validation is about speed. The faster you test, the faster you learn. A "failed" test that saves you 6 months of building is actually a massive win.' },
      { id: `${id}-3`, title: `Run a micro-experiment based on "${t}"`, description: 'Design and execute a tiny experiment (under 2 hours) to test this concept against your business idea. Document your hypothesis, method, and results.', type: 'text_input', points: 20, required: true, hint: 'Hypothesis: "I believe [X] will happen if I do [Y]." Method: "I will [action] for [time period]." Result: "Here\'s what actually happened." Science > opinion.' },
      { id: `${id}-4`, title: `Talk to a potential customer about "${t}"`, description: 'Have a real conversation with someone in your target market about this specific topic. Use The Mom Test approach: ask about their problems, not your solution.', type: 'text_input', points: 15, required: false, hint: '5 minutes of customer conversation is worth 5 hours of internal debate. Their exact words are your most valuable data.' },
      { id: `${id}-5`, title: `Decide: pivot, persevere, or kill?`, description: 'Based on everything you\'ve learned, make a clear decision about this aspect of your business. Write your decision and the evidence that supports it.', type: 'text_input', points: 15, required: true, hint: 'Indecision is the silent killer of startups. Make a call with the data you have. You can always course-correct later — but you can\'t steer a parked car.' },
    ],
    // Phase 3: Guerrilla Marketing & Launch — Create, Post, Track, Engage, Scale
    2: (id, t) => [
      { id: `${id}-1`, title: `Study 3 examples of "${t}" done right`, description: 'Find 3 real-world examples of this marketing tactic executed brilliantly. Screenshot or link to them. Write what makes each one work.', type: 'text_input', points: 15, required: true, hint: 'Don\'t reinvent the wheel. The best marketers are the best thieves — steal the strategy, not the content. Adapt what works to your niche.' },
      { id: `${id}-2`, title: `Create and publish your version TODAY`, description: 'Don\'t overthink — create and post your take on this tactic within the next 2 hours. Upload a screenshot or link to the live content.', type: 'file_upload', points: 25, required: true, hint: 'The algorithm rewards consistency, not perfection. A B+ post today outperforms an A+ post that never ships. Hit publish before you lose your nerve.' },
      { id: `${id}-3`, title: `Track results and engagement from your post`, description: 'After 24 hours, check your metrics: views, likes, comments, shares, clicks. Write down the numbers and what they tell you.', type: 'text_input', points: 15, required: true, hint: 'If nobody engaged, your hook was weak or your audience was wrong. If people engaged but didn\'t convert, your offer needs work. The data tells the truth — listen to it.' },
      { id: `${id}-4`, title: `Engage with everyone who responded`, description: 'Reply to every comment, DM, and interaction your content received. Write down any interesting conversations or leads that came from it.', type: 'text_input', points: 15, required: false, hint: 'The money is in the DMs. A 1% conversion rate on 100 engaged viewers = 1 customer. Engage with all 100 and your conversion rate multiplies. This is free sales.' },
      { id: `${id}-5`, title: `Build a repeatable system for "${t}"`, description: 'Write a simple SOP: How will you do this consistently, not just once? Template, schedule, checklist. Upload your system document.', type: 'file_upload', points: 15, required: false, hint: 'One great post is luck. A system that produces great posts weekly is a growth engine. Spend 15 minutes building the system — it compounds forever.' },
    ],
    // Phase 4: Sales Engine & CRM — Prospect, Pitch, Handle Objections, Close, Systematize
    3: (id, t) => [
      { id: `${id}-1`, title: `Study the mechanics of "${t}"`, description: 'Research how top performers execute this sales tactic. Watch 2 videos, read 1 article. Write the top 3 techniques you will steal.', type: 'text_input', points: 15, required: true, hint: 'Sales is a craft, not a talent. Study the best closers — Grant Cardone, Chris Voss, Alex Hormozi. Their techniques are free on YouTube. Learn them.' },
      { id: `${id}-2`, title: `Execute "${t}" with real prospects TODAY`, description: 'Apply this tactic to at least 5 real prospects or leads within the next 24 hours. Document each attempt and response.', type: 'text_input', points: 25, required: true, hint: 'Sales is a contact sport. You can read 50 books and still be terrible at sales. The only way to improve is to actually sell. Do 5 reps today — the first 2 will be cringe, and that\'s fine.' },
      { id: `${id}-3`, title: `Prepare for rejection — and learn from it`, description: 'Write down every "no" or objection you received. For each one, draft a better response for next time. Rejection is free coaching.', type: 'text_input', points: 15, required: true, hint: 'Every "no" contains a lesson. "Too expensive" = you haven\'t demonstrated enough value. "Not now" = you haven\'t created urgency. Decode the rejection — it\'s telling you what to fix.' },
      { id: `${id}-4`, title: `Role-play "${t}" with a friend or recording`, description: 'Practice this sales skill out loud. Record yourself on video or do it with a friend. Watch it back and identify your top improvement area.', type: 'file_upload', points: 15, required: false, hint: 'You will cringe watching yourself. Good. That\'s where growth lives. Focus on tone, confidence, and listening — most founders talk too much and listen too little.' },
      { id: `${id}-5`, title: `Build a CRM workflow for "${t}"`, description: 'Set up a simple system (spreadsheet, Notion, or actual CRM) to track this sales activity. Upload a screenshot of your tracking system.', type: 'file_upload', points: 15, required: false, hint: 'If it\'s not tracked, it didn\'t happen. A simple Google Sheet with columns: Prospect, Date Contacted, Status, Next Step, Notes — that\'s a CRM. Start there.' },
    ],
    // Phase 5: Product & Tech Foundation — Design, Build, Test, Ship, Measure
    4: (id, t) => [
      { id: `${id}-1`, title: `Understand the technical foundation of "${t}"`, description: 'Research how successful products implement this. Write a 100-word technical brief: what needs to happen, key decisions, and common pitfalls.', type: 'text_input', points: 15, required: true, hint: 'You don\'t need to be a developer, but you need to know enough to not get ripped off. 30 minutes of research on this topic will save you thousands in bad dev decisions.' },
      { id: `${id}-2`, title: `Apply "${t}" to your product right now`, description: 'Make one concrete improvement to your product based on this lesson. It could be code, design, infrastructure, or process. Document the change.', type: 'text_input', points: 20, required: true, hint: 'Ship one thing today. Even if it\'s tiny. A deployed improvement > a planned masterpiece. Momentum beats perfection in product development.' },
      { id: `${id}-3`, title: `Test your implementation of "${t}"`, description: 'Verify that your change actually works. Test it yourself, then have one other person test it. Write down any bugs or friction points found.', type: 'text_input', points: 15, required: true, hint: 'The "works on my machine" mentality kills products. Test on a real device, real network, real user. If you can\'t reproduce it, you can\'t fix it.' },
      { id: `${id}-4`, title: `Document how "${t}" is set up in your product`, description: 'Write a brief documentation page: what you did, why you chose this approach, and what a future developer (or your future self) needs to know.', type: 'text_input', points: 10, required: false, hint: 'Code you wrote 6 months ago might as well have been written by a stranger. Future-you will thank present-you for 5 minutes of documentation.' },
      { id: `${id}-5`, title: `Measure the impact of "${t}" on your metrics`, description: 'Set up tracking for this feature/change. After 3 days, check your analytics. Did it improve your North Star metric? Write the numbers.', type: 'text_input', points: 15, required: false, hint: 'If you can\'t measure it, you can\'t improve it. A feature without tracking is a bet without odds. Connect every change to a metric — even if the metric is "number of complaints decreased."' },
    ],
    // Phase 6: Legal, Finance & Admin — Research, Set Up, Document, Protect, Review
    5: (id, t) => [
      { id: `${id}-1`, title: `Understand the legal/financial basics of "${t}"`, description: 'Research the fundamentals. What does every founder need to know about this topic? Write a 100-word summary in plain English.', type: 'text_input', points: 15, required: true, hint: 'Legal and finance aren\'t just for lawyers and accountants. You\'re the CEO — you need to understand enough to make good decisions. Ignorance is the most expensive legal strategy.' },
      { id: `${id}-2`, title: `Take action: set up "${t}" for your business`, description: 'Execute the key setup or action. Whether it\'s filing a document, opening an account, or drafting a policy — do it today. Upload proof.', type: 'file_upload', points: 25, required: true, hint: 'The hardest part of legal/finance tasks is starting them. They feel boring and scary. Set a 25-minute timer and just start. You\'ll be shocked how much you get done.' },
      { id: `${id}-3`, title: `Build a compliance checklist for "${t}"`, description: 'Create a simple checklist of what needs to happen (now, quarterly, annually) to stay compliant in this area. Upload your checklist.', type: 'file_upload', points: 15, required: true, hint: 'Compliance isn\'t a one-time event — it\'s an ongoing practice. A 10-item checklist you review monthly prevents the $50K legal bill you get when something slips through.' },
      { id: `${id}-4`, title: `Consult an expert about "${t}" (even briefly)`, description: 'Talk to a lawyer, accountant, or expert about this topic. Even a 15-minute call. Write down their key advice and what surprised you.', type: 'text_input', points: 15, required: false, hint: 'Free consultations exist. SCORE.org, local SBA offices, Clerky, and Stripe Atlas all offer free or low-cost expert guidance. Use them. One expert tip can save you years of headaches.' },
      { id: `${id}-5`, title: `Set a recurring calendar reminder for "${t}"`, description: 'This isn\'t "done" — it\'s ongoing. Set a monthly, quarterly, or annual reminder to review this area. Upload a screenshot of your calendar event.', type: 'file_upload', points: 10, required: false, hint: 'The legal/financial things that kill startups are the ones you forget about. Automate the reminders. Your future self will thank you when you\'re not scrambling before a funding round.' },
    ],
    // Phase 7: Operations & The Machine — Document, Automate, Delegate, Measure, Optimize
    6: (id, t) => [
      { id: `${id}-1`, title: `Map your current "${t}" workflow`, description: 'Diagram or list every step in how this process currently works in your business. Be brutally honest — include the messy parts.', type: 'text_input', points: 15, required: true, hint: 'You can\'t improve what you can\'t see. Map it exactly as it exists today, not how you wish it worked. The gap between "current state" and "ideal state" is your roadmap.' },
      { id: `${id}-2`, title: `Execute the Quick Win for "${t}"`, description: 'Take immediate action on the Quick Win from this level. Document what you changed, automated, or improved. Upload before/after screenshots if applicable.', type: 'file_upload', points: 20, required: true, hint: 'Operations improvement is a game of inches. Don\'t try to fix everything at once. Pick the ONE bottleneck that\'s causing the most pain. Fix it. Then move to the next one.' },
      { id: `${id}-3`, title: `Automate or delegate one piece of "${t}"`, description: 'Find one step in this workflow that can be automated (Zapier, n8n, scripts) or delegated to someone else. Implement it. Write what you freed up.', type: 'text_input', points: 20, required: true, hint: 'Your hourly rate as a founder is your company\'s valuation divided by your working hours. If a task can be done for less than that rate, you should NOT be doing it. Delegate it.' },
      { id: `${id}-4`, title: `Write an SOP for "${t}"`, description: 'Create a Standard Operating Procedure document. Include: purpose, step-by-step instructions, tools needed, expected outcomes, and common troubleshooting.', type: 'text_input', points: 15, required: true, hint: 'An SOP is a love letter to your future replacement. Write it so clearly that a stranger could execute it. If they can\'t, the SOP is incomplete — fix it.' },
      { id: `${id}-5`, title: `Measure the efficiency of "${t}" this week`, description: 'Track how long this process takes and what it costs (time, money, errors). Set a baseline. Then set a goal for improvement next week.', type: 'text_input', points: 15, required: false, hint: 'What gets measured gets managed. If you don\'t know how long something takes, you can\'t know if you\'re improving. Track time for one week — you might be shocked.' },
    ],
    // Phase 8: Talent & Culture — Define, Attract, Interview, Onboard, Retain
    7: (id, t) => [
      { id: `${id}-1`, title: `Define what great "${t}" looks like for your company`, description: 'Write a clear definition of excellence in this area. What does A+ look like? What\'s unacceptable? Be specific — vague expectations produce vague results.', type: 'text_input', points: 15, required: true, hint: 'If you can\'t define "great," you can\'t hire for it, coach toward it, or measure it. Write the definition like you\'re explaining it to a new hire on day one.' },
      { id: `${id}-2`, title: `Audit your current "${t}" reality`, description: 'Honestly assess where you stand right now on this topic. Rate yourself 1-10. Write what\'s working and what\'s broken. No sugar-coating.', type: 'text_input', points: 15, required: true, hint: 'Self-awareness is the first leadership skill. If you rate yourself 8+ on everything, you\'re either delusional or not digging deep enough. Real growth starts with honest self-assessment.' },
      { id: `${id}-3`, title: `Create or update your "${t}" system/process`, description: 'Build or refine the actual system: job descriptions, interview scorecards, onboarding checklists, review templates. Upload your work product.', type: 'file_upload', points: 20, required: true, hint: 'Talent systems aren\'t bureaucracy — they\'re guardrails that prevent bad hires, missed expectations, and toxic culture. A $0 Google Doc system today beats a $50K HR platform you\'ll "set up next quarter."' },
      { id: `${id}-4`, title: `Get feedback on your "${t}" approach`, description: 'Ask one team member, peer, or mentor for honest feedback on how you handle this area. Write their exact words — even the uncomfortable parts.', type: 'text_input', points: 15, required: false, hint: 'Radical candor = care personally + challenge directly. Ask: "What\'s one thing I could do better in [area]?" Then shut up and listen. Don\'t defend, don\'t explain — just absorb.' },
      { id: `${id}-5`, title: `Set a 30-day improvement goal for "${t}"`, description: 'Based on your audit and feedback, pick ONE specific improvement to make in the next 30 days. Write the goal, the metric, and your first action.', type: 'text_input', points: 15, required: false, hint: 'Culture changes one habit at a time. Don\'t try to transform everything in a month. Pick one visible change, nail it, and let the momentum carry you to the next one.' },
    ],
    // Phase 9: Capital & Investment — Prepare, Build, Pitch, Negotiate, Close
    8: (id, t) => [
      { id: `${id}-1`, title: `Research how "${t}" works in the real world`, description: 'Study 3 real funding stories (successes and failures) related to this topic. Write the key lessons from each. What went right? What went wrong?', type: 'text_input', points: 15, required: true, hint: 'Read founder post-mortems on failed fundraises. They\'re more educational than success stories. Search "why we failed to raise" on Medium or IndieHackers.' },
      { id: `${id}-2`, title: `Prepare your "${t}" materials`, description: 'Create or update the specific materials needed: financial model, pitch deck section, data room document, term sheet draft. Upload what you built.', type: 'file_upload', points: 20, required: true, hint: 'Investors can smell unpreparedness from a mile away. Having your materials ready BEFORE you need them is a power move. It signals: "I\'m professional, I\'m serious, I respect your time."' },
      { id: `${id}-3`, title: `Practice "${t}" with honest feedback`, description: 'Role-play or present this to someone who will give you real feedback (not just "looks great!"). Write their critiques and what you\'ll change.', type: 'text_input', points: 15, required: true, hint: 'If your practice audience says "looks great" without any suggestions, find a better practice audience. You want the friend who will say "your numbers don\'t make sense" — that friend saves you from embarrassing investor meetings.' },
      { id: `${id}-4`, title: `Build your target list for "${t}"`, description: 'Create a spreadsheet of potential investors, lenders, or partners relevant to this funding strategy. Include: name, firm, why they\'re a fit, warm intro path.', type: 'text_input', points: 15, required: true, hint: 'Fundraising is a funnel. Top: 100 targets. Middle: 20 first meetings. Bottom: 3 term sheets. If your top-of-funnel is only 5 names, your odds are terrible. Build a real list.' },
      { id: `${id}-5`, title: `Take one real action toward "${t}" today`, description: 'Send one email, make one call, or submit one application related to this funding topic. Write what you did and what happens next.', type: 'text_input', points: 20, required: true, hint: 'Fundraising is a momentum game. One action per day compounds to 30 actions per month. Most founders raise zero dollars because they took zero actions. Be the founder who takes one action today.' },
    ],
    // Phase 10: Governance & The Infinite Game — Structure, Plan, Prepare, Mentor, Legacy
    9: (id, t) => [
      { id: `${id}-1`, title: `Study how great companies handle "${t}"`, description: 'Research how successful, mature companies approach this governance topic. Write 3 best practices you\'ll adopt and 3 mistakes you\'ll avoid.', type: 'text_input', points: 15, required: true, hint: 'Read annual reports, board meeting notes from public companies, and founder interviews about governance. The patterns are clear — steal them.' },
      { id: `${id}-2`, title: `Take action on "${t}" for your situation`, description: 'Complete the Quick Win from this level. Whether it\'s a board structure, crisis plan, or legacy document — create it now. Upload your output.', type: 'file_upload', points: 20, required: true, hint: 'Governance feels like "future you" problems. But the best time to build governance is when things are going well, not when you\'re in crisis mode. Future you will be grateful.' },
      { id: `${id}-3`, title: `Write your personal "${t}" philosophy`, description: 'Go beyond tactics — what do you believe about this topic? Write a personal manifesto or set of principles that will guide your decisions in this area.', type: 'text_input', points: 15, required: true, hint: 'Tactics change. Principles endure. Your philosophy is your compass when the map runs out. "I believe X because Y" — write it down. It will be tested someday.' },
      { id: `${id}-4`, title: `Mentor one person on "${t}"`, description: 'Share what you\'ve learned with someone earlier in their journey. Write what you taught them and what you learned from the interaction.', type: 'text_input', points: 15, required: false, hint: 'You don\'t need to be an expert to mentor — you just need to be one step ahead. Teaching crystallizes your own understanding. The mentor almost always learns more than the mentee.' },
      { id: `${id}-5`, title: `Build a legacy plan around "${t}"`, description: 'Zoom out: how does this topic connect to the long-term impact you want to have? Write a 5-year vision for this area and the first milestone.', type: 'text_input', points: 15, required: false, hint: 'The best founders play infinite games. They\'re not optimizing for next quarter — they\'re building something that outlasts them. What\'s your infinite game? Define it.' },
    ],
  };

  const generator = taskSets[phaseIdx];
  if (!generator) {
    // Fallback: simple set of tasks
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

const taskSetsEs: Record<number, (id: string, theme: string) => JourneyTask[]> = {
  0: (id, t) => [
    { id: `${id}-1`, title: `Comprende el concepto central de "${t}"`, description: 'Investiga y escribe un resumen de 100 palabras de este concepto con tus propias palabras. ¿Cuál es la idea clave? ¿Por qué es importante para los fundadores?', type: 'text_input', points: 15, required: true, hint: 'Si no puedes explicarlo de forma simple, aún no lo entiendes. Usa lenguaje sencillo — evita la jerga.' },
    { id: `${id}-2`, title: `Ejecuta la Victoria Rápida de inmediato`, description: 'Completa la acción de Victoria Rápida de la descripción del nivel. Escribe exactamente lo que hiciste y el resultado — incluso si parece pequeño.', type: 'text_input', points: 20, required: true, hint: 'La acción supera a la intención siempre. Hazlo AHORA, no "más tarde". Más tarde nunca llega.' },
    { id: `${id}-3`, title: `Aplica "${t}" a tu negocio específico`, description: 'Escribe un plan concreto de cómo este concepto se aplica a TU negocio o idea. ¿Qué cambios harás basado en este aprendizaje?', type: 'text_input', points: 15, required: true, hint: 'El consejo genérico no sirve. La aplicación específica es oro. Si no puedes conectar esto con tu negocio, aún no lo has aprendido.' },
    { id: `${id}-4`, title: `Comparte este aprendizaje con otro fundador`, description: 'Cuéntale a otro emprendedor o aspirante a fundador lo que aprendiste. Escribe su reacción y cualquier objeción que te hicieron.', type: 'text_input', points: 10, required: false, hint: 'Enseñar es la forma más rápida de aprender. Si te desafían, aún mejor — te obliga a una comprensión más profunda.' },
    { id: `${id}-5`, title: `Crea un documento de una página con lo aprendido`, description: 'Compila tus notas, el resultado de la Victoria Rápida y tu plan de aplicación en un solo documento o captura. Súbelo.', type: 'file_upload', points: 15, required: false, hint: 'Esto se convierte en tu manual personal. En 6 meses, revisar estas notas te mostrará cuánto has crecido.' },
  ],
  1: (id, t) => [
    { id: `${id}-1`, title: `Investiga "${t}" con datos reales`, description: 'No adivines — recopila datos reales. Encuentra 3 ejemplos reales, casos de estudio o puntos de datos relacionados con este concepto. Escribe lo que encontraste.', type: 'text_input', points: 15, required: true, hint: 'Busca en Google "caso de estudio [tu tema]" y encuentra al menos una empresa real que tuvo éxito o fracasó en esto. Aprende de sus cicatrices, no solo de sus victorias.' },
    { id: `${id}-2`, title: `Ejecuta la Victoria Rápida AHORA`, description: 'Toma la acción de Victoria Rápida inmediatamente. Escribe los pasos exactos que tomaste y el resultado. Si encontraste resistencia, documéntalo también — la resistencia es información.', type: 'text_input', points: 20, required: true, hint: 'La validación se trata de velocidad. Cuanto más rápido pruebas, más rápido aprendes. Una prueba "fallida" que te ahorra 6 meses de construcción es en realidad una gran victoria.' },
    { id: `${id}-3`, title: `Ejecuta un micro-experimento basado en "${t}"`, description: 'Diseña y ejecuta un pequeño experimento (menos de 2 horas) para probar este concepto contra tu idea de negocio. Documenta tu hipótesis, método y resultados.', type: 'text_input', points: 20, required: true, hint: 'Hipótesis: "Creo que [X] sucederá si hago [Y]." Método: "Haré [acción] durante [período]." Resultado: "Esto es lo que realmente sucedió." Ciencia > opinión.' },
    { id: `${id}-4`, title: `Habla con un cliente potencial sobre "${t}"`, description: 'Ten una conversación real con alguien de tu mercado objetivo sobre este tema específico. Usa el enfoque de The Mom Test: pregunta sobre sus problemas, no sobre tu solución.', type: 'text_input', points: 15, required: false, hint: '5 minutos de conversación con un cliente valen más que 5 horas de debate interno. Sus palabras exactas son tus datos más valiosos.' },
    { id: `${id}-5`, title: `Decide: ¿pivotar, perseverar o eliminar?`, description: 'Basado en todo lo que has aprendido, toma una decisión clara sobre este aspecto de tu negocio. Escribe tu decisión y la evidencia que la respalda.', type: 'text_input', points: 15, required: true, hint: 'La indecisión es el asesino silencioso de las startups. Toma una decisión con los datos que tienes. Siempre puedes corregir después — pero no puedes conducir un auto estacionado.' },
  ],
  2: (id, t) => [
    { id: `${id}-1`, title: `Estudia 3 ejemplos de "${t}" bien ejecutados`, description: 'Encuentra 3 ejemplos reales de esta táctica de marketing ejecutada brillantemente. Captura o enlaza a ellos. Escribe qué hace que cada uno funcione.', type: 'text_input', points: 15, required: true, hint: 'No reinventes la rueda. Los mejores marketers son los mejores ladrones — roba la estrategia, no el contenido. Adapta lo que funciona a tu nicho.' },
    { id: `${id}-2`, title: `Crea y publica tu versión HOY`, description: 'No lo pienses demasiado — crea y publica tu versión de esta táctica en las próximas 2 horas. Sube una captura o enlace al contenido publicado.', type: 'file_upload', points: 25, required: true, hint: 'El algoritmo premia la consistencia, no la perfección. Una publicación B+ hoy supera a una publicación A+ que nunca se publica. Publica antes de perder el valor.' },
    { id: `${id}-3`, title: `Registra los resultados y el engagement de tu publicación`, description: 'Después de 24 horas, revisa tus métricas: vistas, likes, comentarios, compartidos, clics. Escribe los números y lo que te dicen.', type: 'text_input', points: 15, required: true, hint: 'Si nadie interactuó, tu gancho era débil o tu audiencia estaba mal. Si interactuaron pero no convirtieron, tu oferta necesita trabajo. Los datos dicen la verdad — escúchalos.' },
    { id: `${id}-4`, title: `Interactúa con todos los que respondieron`, description: 'Responde a cada comentario, DM e interacción que recibió tu contenido. Escribe cualquier conversación interesante o lead que surgió.', type: 'text_input', points: 15, required: false, hint: 'El dinero está en los DMs. Una tasa de conversión del 1% en 100 espectadores comprometidos = 1 cliente. Interactúa con los 100 y tu tasa de conversión se multiplica. Esto son ventas gratis.' },
    { id: `${id}-5`, title: `Construye un sistema repetible para "${t}"`, description: 'Escribe un procedimiento simple: ¿Cómo harás esto de forma consistente, no solo una vez? Plantilla, calendario, checklist. Sube tu documento del sistema.', type: 'file_upload', points: 15, required: false, hint: 'Una gran publicación es suerte. Un sistema que produce grandes publicaciones semanalmente es un motor de crecimiento. Dedica 15 minutos a construir el sistema — se multiplica para siempre.' },
  ],
  3: (id, t) => [
    { id: `${id}-1`, title: `Estudia la mecánica de "${t}"`, description: 'Investiga cómo los mejores ejecutan esta táctica de ventas. Mira 2 videos, lee 1 artículo. Escribe las 3 técnicas principales que vas a copiar.', type: 'text_input', points: 15, required: true, hint: 'Las ventas son un oficio, no un talento. Estudia a los mejores cerradores — sus técnicas están gratis en YouTube. Apréndelas.' },
    { id: `${id}-2`, title: `Ejecuta "${t}" con prospectos reales HOY`, description: 'Aplica esta táctica a al menos 5 prospectos o leads reales en las próximas 24 horas. Documenta cada intento y respuesta.', type: 'text_input', points: 25, required: true, hint: 'Las ventas son un deporte de contacto. Puedes leer 50 libros y seguir siendo terrible vendiendo. La única forma de mejorar es vendiendo de verdad. Haz 5 repeticiones hoy — las primeras 2 serán incómodas, y está bien.' },
    { id: `${id}-3`, title: `Prepárate para el rechazo — y aprende de él`, description: 'Escribe cada "no" u objeción que recibiste. Para cada uno, redacta una mejor respuesta para la próxima vez. El rechazo es coaching gratuito.', type: 'text_input', points: 15, required: true, hint: 'Cada "no" contiene una lección. "Muy caro" = no has demostrado suficiente valor. "Ahora no" = no has creado urgencia. Decodifica el rechazo — te está diciendo qué arreglar.' },
    { id: `${id}-4`, title: `Practica "${t}" con un amigo o grabándote`, description: 'Practica esta habilidad de ventas en voz alta. Grábate en video o hazlo con un amigo. Mírate y identifica tu principal área de mejora.', type: 'file_upload', points: 15, required: false, hint: 'Te dará vergüenza verte. Bien. Ahí es donde vive el crecimiento. Enfócate en tono, confianza y escucha — la mayoría de los fundadores hablan demasiado y escuchan muy poco.' },
    { id: `${id}-5`, title: `Construye un flujo de trabajo CRM para "${t}"`, description: 'Configura un sistema simple (hoja de cálculo, Notion o CRM real) para rastrear esta actividad de ventas. Sube una captura de tu sistema de seguimiento.', type: 'file_upload', points: 15, required: false, hint: 'Si no se registra, no sucedió. Una simple hoja de Google con columnas: Prospecto, Fecha de Contacto, Estado, Próximo Paso, Notas — eso es un CRM. Empieza allí.' },
  ],
  4: (id, t) => [
    { id: `${id}-1`, title: `Comprende la base técnica de "${t}"`, description: 'Investiga cómo los productos exitosos implementan esto. Escribe un informe técnico de 100 palabras: qué necesita suceder, decisiones clave y errores comunes.', type: 'text_input', points: 15, required: true, hint: 'No necesitas ser desarrollador, pero necesitas saber lo suficiente para que no te estafen. 30 minutos de investigación en este tema te ahorrarán miles en malas decisiones de desarrollo.' },
    { id: `${id}-2`, title: `Aplica "${t}" a tu producto ahora mismo`, description: 'Haz una mejora concreta a tu producto basada en esta lección. Puede ser código, diseño, infraestructura o proceso. Documenta el cambio.', type: 'text_input', points: 20, required: true, hint: 'Lanza una cosa hoy. Incluso si es pequeña. Una mejora implementada > una obra maestra planeada. El impulso supera a la perfección en el desarrollo de productos.' },
    { id: `${id}-3`, title: `Prueba tu implementación de "${t}"`, description: 'Verifica que tu cambio realmente funciona. Pruébalo tú mismo, luego haz que otra persona lo pruebe. Escribe cualquier error o punto de fricción encontrado.', type: 'text_input', points: 15, required: true, hint: 'La mentalidad de "funciona en mi máquina" mata productos. Prueba en un dispositivo real, red real, usuario real. Si no puedes reproducirlo, no puedes arreglarlo.' },
    { id: `${id}-4`, title: `Documenta cómo "${t}" está configurado en tu producto`, description: 'Escribe una breve página de documentación: qué hiciste, por qué elegiste este enfoque y lo que un futuro desarrollador (o tu yo futuro) necesita saber.', type: 'text_input', points: 10, required: false, hint: 'El código que escribiste hace 6 meses bien podría haber sido escrito por un desconocido. Tu yo del futuro agradecerá a tu yo del presente por 5 minutos de documentación.' },
    { id: `${id}-5`, title: `Mide el impacto de "${t}" en tus métricas`, description: 'Configura el seguimiento para esta funcionalidad/cambio. Después de 3 días, revisa tus analíticas. ¿Mejoró tu métrica estrella norte? Escribe los números.', type: 'text_input', points: 15, required: false, hint: 'Si no puedes medirlo, no puedes mejorarlo. Una funcionalidad sin seguimiento es una apuesta sin probabilidades. Conecta cada cambio a una métrica — incluso si la métrica es "disminuyó el número de quejas."' },
  ],
  5: (id, t) => [
    { id: `${id}-1`, title: `Comprende los fundamentos legales/financieros de "${t}"`, description: 'Investiga los fundamentos. ¿Qué necesita saber cada fundador sobre este tema? Escribe un resumen de 100 palabras en lenguaje sencillo.', type: 'text_input', points: 15, required: true, hint: 'Legal y finanzas no son solo para abogados y contadores. Eres el CEO — necesitas entender lo suficiente para tomar buenas decisiones. La ignorancia es la estrategia legal más cara.' },
    { id: `${id}-2`, title: `Toma acción: configura "${t}" para tu negocio`, description: 'Ejecuta la configuración o acción clave. Ya sea presentar un documento, abrir una cuenta o redactar una política — hazlo hoy. Sube pruebas.', type: 'file_upload', points: 25, required: true, hint: 'La parte más difícil de las tareas legales/financieras es empezarlas. Se sienten aburridas y aterradoras. Pon un temporizador de 25 minutos y simplemente empieza. Te sorprenderá cuánto logras.' },
    { id: `${id}-3`, title: `Construye una lista de verificación de cumplimiento para "${t}"`, description: 'Crea una checklist simple de lo que necesita suceder (ahora, trimestralmente, anualmente) para mantener el cumplimiento en esta área. Sube tu checklist.', type: 'file_upload', points: 15, required: true, hint: 'El cumplimiento no es un evento único — es una práctica continua. Una checklist de 10 ítems que revisas mensualmente previene la factura legal de $50K que recibes cuando algo se escapa.' },
    { id: `${id}-4`, title: `Consulta a un experto sobre "${t}" (aunque sea brevemente)`, description: 'Habla con un abogado, contador o experto sobre este tema. Incluso una llamada de 15 minutos. Escribe sus consejos clave y lo que te sorprendió.', type: 'text_input', points: 15, required: false, hint: 'Existen consultas gratuitas. SCORE.org, oficinas locales de SBA, Clerky y Stripe Atlas ofrecen orientación experta gratuita o de bajo costo. Úsalas. Un consejo de experto puede ahorrarte años de dolores de cabeza.' },
    { id: `${id}-5`, title: `Configura un recordatorio recurrente para "${t}"`, description: 'Esto no está "hecho" — es continuo. Configura un recordatorio mensual, trimestral o anual para revisar esta área. Sube una captura de tu evento de calendario.', type: 'file_upload', points: 10, required: false, hint: 'Las cosas legales/financieras que matan startups son las que olvidas. Automatiza los recordatorios. Tu yo del futuro te lo agradecerá cuando no estés corriendo antes de una ronda de financiación.' },
  ],
  6: (id, t) => [
    { id: `${id}-1`, title: `Mapea tu flujo de trabajo actual de "${t}"`, description: 'Diagrama o enumera cada paso de cómo funciona actualmente este proceso en tu negocio. Sé brutalmente honesto — incluye las partes desordenadas.', type: 'text_input', points: 15, required: true, hint: 'No puedes mejorar lo que no puedes ver. Mapea exactamente como existe hoy, no como desearías que funcionara. La brecha entre "estado actual" y "estado ideal" es tu hoja de ruta.' },
    { id: `${id}-2`, title: `Ejecuta la Victoria Rápida para "${t}"`, description: 'Toma acción inmediata en la Victoria Rápida de este nivel. Documenta lo que cambiaste, automatizaste o mejoraste. Sube capturas de antes/después si aplica.', type: 'file_upload', points: 20, required: true, hint: 'La mejora de operaciones es un juego de centímetros. No intentes arreglar todo a la vez. Elige el UN cuello de botella que causa más dolor. Arrélglalo. Luego pasa al siguiente.' },
    { id: `${id}-3`, title: `Automatiza o delega una parte de "${t}"`, description: 'Encuentra un paso en este flujo de trabajo que pueda automatizarse (Zapier, n8n, scripts) o delegarse a otra persona. Impleméntalo. Escribe lo que liberaste.', type: 'text_input', points: 20, required: true, hint: 'Tu tarifa por hora como fundador es la valoración de tu empresa dividida por tus horas de trabajo. Si una tarea puede hacerse por menos de esa tarifa, NO deberías estar haciéndola tú. Delégala.' },
    { id: `${id}-4`, title: `Escribe un procedimiento operativo estándar para "${t}"`, description: 'Crea un documento SOP. Incluye: propósito, instrucciones paso a paso, herramientas necesarias, resultados esperados y solución de problemas comunes.', type: 'text_input', points: 15, required: true, hint: 'Un SOP es una carta de amor a tu futuro reemplazo. Escríbelo tan claramente que un desconocido pueda ejecutarlo. Si no pueden, el SOP está incompleto — arrélglalo.' },
    { id: `${id}-5`, title: `Mide la eficiencia de "${t}" esta semana`, description: 'Registra cuánto tiempo toma este proceso y cuánto cuesta (tiempo, dinero, errores). Establece una línea base. Luego establece una meta de mejora para la próxima semana.', type: 'text_input', points: 15, required: false, hint: 'Lo que se mide se gestiona. Si no sabes cuánto tiempo toma algo, no puedes saber si estás mejorando. Registra el tiempo durante una semana — podrías sorprenderte.' },
  ],
  7: (id, t) => [
    { id: `${id}-1`, title: `Define cómo se ve un gran "${t}" para tu empresa`, description: 'Escribe una definición clara de excelencia en esta área. ¿Cómo se ve un A+? ¿Qué es inaceptable? Sé específico — las expectativas vagas producen resultados vagos.', type: 'text_input', points: 15, required: true, hint: 'Si no puedes definir "excelente", no puedes contratar para ello, entrenar hacia ello ni medirlo. Escribe la definición como si se la estuvieras explicando a un nuevo empleado en su primer día.' },
    { id: `${id}-2`, title: `Audita tu realidad actual de "${t}"`, description: 'Evalúa honestamente dónde te encuentras ahora en este tema. Califícate del 1 al 10. Escribe lo que funciona y lo que está roto. Sin endulzar.', type: 'text_input', points: 15, required: true, hint: 'La autoconciencia es la primera habilidad de liderazgo. Si te calificas 8+ en todo, o eres delirante o no estás profundizando lo suficiente. El crecimiento real comienza con una autoevaluación honesta.' },
    { id: `${id}-3`, title: `Crea o actualiza tu sistema/proceso de "${t}"`, description: 'Construye o refina el sistema real: descripciones de trabajo, tarjetas de puntuación de entrevistas, checklists de incorporación, plantillas de revisión. Sube tu producto de trabajo.', type: 'file_upload', points: 20, required: true, hint: 'Los sistemas de talento no son burocracia — son barandillas que previenen malas contrataciones, expectativas no cumplidas y cultura tóxica. Un sistema de Google Doc de $0 hoy supera una plataforma de RRHH de $50K que "configurarás el próximo trimestre".' },
    { id: `${id}-4`, title: `Obtén retroalimentación sobre tu enfoque de "${t}"`, description: 'Pide a un miembro del equipo, colega o mentor retroalimentación honesta sobre cómo manejas esta área. Escribe sus palabras exactas — incluso las partes incómodas.', type: 'text_input', points: 15, required: false, hint: 'Franqueza radical = preocuparse personalmente + desafiar directamente. Pregunta: "¿Qué es una cosa que podría hacer mejor en [área]?" Luego cállate y escucha. No te defiendas, no expliques — solo absorbe.' },
    { id: `${id}-5`, title: `Establece una meta de mejora de 30 días para "${t}"`, description: 'Basado en tu auditoría y retroalimentación, elige UNA mejora específica para hacer en los próximos 30 días. Escribe la meta, la métrica y tu primera acción.', type: 'text_input', points: 15, required: false, hint: 'La cultura cambia un hábito a la vez. No intentes transformar todo en un mes. Elige un cambio visible, hazlo bien y deja que el impulso te lleve al siguiente.' },
  ],
  8: (id, t) => [
    { id: `${id}-1`, title: `Investiga cómo funciona "${t}" en el mundo real`, description: 'Estudia 3 historias reales de financiación (éxitos y fracasos) relacionadas con este tema. Escribe las lecciones clave de cada una. ¿Qué salió bien? ¿Qué salió mal?', type: 'text_input', points: 15, required: true, hint: 'Lee autopsias de fundadores sobre recaudaciones fallidas. Son más educativas que las historias de éxito. Busca "por qué fracasamos al recaudar" en Medium o IndieHackers.' },
    { id: `${id}-2`, title: `Prepara tus materiales de "${t}"`, description: 'Crea o actualiza los materiales específicos necesarios: modelo financiero, sección del pitch deck, documento del data room, borrador de term sheet. Sube lo que construiste.', type: 'file_upload', points: 20, required: true, hint: 'Los inversores huelen la falta de preparación a un kilómetro de distancia. Tener tus materiales listos ANTES de necesitarlos es un movimiento de poder. Señala: "Soy profesional, soy serio, respeto tu tiempo."' },
    { id: `${id}-3`, title: `Practica "${t}" con retroalimentación honesta`, description: 'Role-play o presenta esto a alguien que te dará retroalimentación real (no solo "¡se ve genial!"). Escribe sus críticas y lo que cambiarás.', type: 'text_input', points: 15, required: true, hint: 'Si tu audiencia de práctica dice "se ve genial" sin ninguna sugerencia, encuentra una mejor audiencia de práctica. Quieres al amigo que dirá "tus números no tienen sentido" — ese amigo te salva de reuniones embarazosas con inversores.' },
    { id: `${id}-4`, title: `Construye tu lista de objetivos para "${t}"`, description: 'Crea una hoja de cálculo de posibles inversores, prestamistas o socios relevantes para esta estrategia de financiación. Incluye: nombre, firma, por qué encajan, ruta de presentación cálida.', type: 'text_input', points: 15, required: true, hint: 'La recaudación de fondos es un embudo. Arriba: 100 objetivos. Medio: 20 primeras reuniones. Abajo: 3 term sheets. Si tu parte superior del embudo tiene solo 5 nombres, tus probabilidades son terribles. Construye una lista real.' },
    { id: `${id}-5`, title: `Toma una acción real hacia "${t}" hoy`, description: 'Envía un correo, haz una llamada o presenta una solicitud relacionada con este tema de financiación. Escribe lo que hiciste y lo que sucede a continuación.', type: 'text_input', points: 20, required: true, hint: 'La recaudación de fondos es un juego de impulso. Una acción por día se acumula a 30 acciones por mes. La mayoría de los fundadores recaudan cero dólares porque tomaron cero acciones. Sé el fundador que toma una acción hoy.' },
  ],
  9: (id, t) => [
    { id: `${id}-1`, title: `Estudia cómo las grandes empresas manejan "${t}"`, description: 'Investiga cómo las empresas exitosas y maduras abordan este tema de gobernanza. Escribe 3 mejores prácticas que adoptarás y 3 errores que evitarás.', type: 'text_input', points: 15, required: true, hint: 'Lee informes anuales, notas de reuniones de directorio de empresas públicas y entrevistas a fundadores sobre gobernanza. Los patrones son claros — cópialos.' },
    { id: `${id}-2`, title: `Toma acción en "${t}" para tu situación`, description: 'Completa la Victoria Rápida de este nivel. Ya sea una estructura de directorio, plan de crisis o documento de legado — créalo ahora. Sube tu resultado.', type: 'file_upload', points: 20, required: true, hint: 'La gobernanza se siente como problemas del "yo del futuro". Pero el mejor momento para construir gobernanza es cuando las cosas van bien, no cuando estás en modo crisis. Tu yo del futuro estará agradecido.' },
    { id: `${id}-3`, title: `Escribe tu filosofía personal de "${t}"`, description: 'Ve más allá de las tácticas — ¿en qué crees sobre este tema? Escribe un manifiesto personal o conjunto de principios que guiarán tus decisiones en esta área.', type: 'text_input', points: 15, required: true, hint: 'Las tácticas cambian. Los principios perduran. Tu filosofía es tu brújula cuando se acaba el mapa. "Creo en X porque Y" — escríbelo. Algún día será puesto a prueba.' },
    { id: `${id}-4`, title: `Asesora a una persona sobre "${t}"`, description: 'Comparte lo que has aprendido con alguien que está más atrás en su camino. Escribe lo que les enseñaste y lo que aprendiste de la interacción.', type: 'text_input', points: 15, required: false, hint: 'No necesitas ser un experto para asesorar — solo necesitas estar un paso adelante. Enseñar cristaliza tu propia comprensión. El mentor casi siempre aprende más que el aprendiz.' },
    { id: `${id}-5`, title: `Construye un plan de legado en torno a "${t}"`, description: 'Amplía la vista: ¿cómo se conecta este tema con el impacto a largo plazo que quieres tener? Escribe una visión de 5 años para esta área y el primer hito.', type: 'text_input', points: 15, required: false, hint: 'Los mejores fundadores juegan juegos infinitos. No están optimizando para el próximo trimestre — están construyendo algo que los trascienda. ¿Cuál es tu juego infinito? Defínelo.' },
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
