// 100 levels (IDs 11–110) across 10 phases
// Each level is a checkpoint — one checkbox task to mark as complete

import type { JourneyLevel } from './journey';

interface PhaseMeta {
  phase: number;
  name: string;
  xpReward: number;
}

const phases: PhaseMeta[] = [
  { phase: 1, name: 'Ideation & Alignment', xpReward: 100 },
  { phase: 2, name: 'Validation & Prototyping', xpReward: 120 },
  { phase: 3, name: 'Legal, Finance & Admin', xpReward: 140 },
  { phase: 4, name: 'Product & Tech Foundation', xpReward: 150 },
  { phase: 5, name: 'Guerrilla Marketing & Launch', xpReward: 160 },
  { phase: 6, name: 'Sales Engine & CRM', xpReward: 170 },
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
  // Phase 1: Ideation & Alignment (Levels 11–20)
  [
    { title: "Identifying 'Specific Knowledge' (Naval's Principle)", badgeName: 'Naval Disciple', badgeIcon: '🧠', description: 'Uncover your unique combination of skills, talents, and curiosity that cannot be trained or outsourced — your true competitive edge.' },
    { title: 'Finding a "Hair on Fire" Problem in the Market', badgeName: 'Fire Marshal', badgeIcon: '🔥', description: 'Identify urgent, painful problems customers are desperate to solve — the kind they will pay for immediately.' },
    { title: 'Competitor Matrix & Finding the Blue Ocean', badgeName: 'Ocean Explorer', badgeIcon: '🌊', description: 'Map competitors on key dimensions and discover uncontested market space where you can dominate.' },
    { title: 'Defining the Core Mission & Values', badgeName: 'Missionary', badgeIcon: '📜', description: 'Write a mission that inspires action and core values that guide every decision your company makes.' },
    { title: 'Formulating the 1-Sentence Pitch', badgeName: 'Wordsmith', badgeIcon: '✂️', description: 'Distill your entire business into one compelling sentence that anyone can understand and remember.' },
    { title: 'Unit Economics 101: Can This Actually Make Money?', badgeName: 'Numbers Guru', badgeIcon: '🧮', description: 'Calculate your unit economics: Customer Acquisition Cost, Lifetime Value, gross margin — prove the math works.' },
    { title: 'The Co-Founder Prenup: Equity & Expectations', badgeName: 'Fair Dealer', badgeIcon: '🤝', description: 'Draft a formal co-founder agreement covering equity splits, vesting, roles, and what happens if someone leaves.' },
    { title: 'Identifying the Ideal Customer Profile (ICP)', badgeName: 'Sniper', badgeIcon: '🎯', description: 'Create a detailed ICP — not "everyone" but the exact kind of person who benefits most from your solution.' },
    { title: "Defining the 'North Star' Metric", badgeName: 'Navigator', badgeIcon: '⭐', description: 'Choose the single metric that best captures the core value your product delivers to customers.' },
    { title: 'Milestone: The Concept Checkpoint', badgeName: 'Gatekeeper', badgeIcon: '🚪', description: 'Review everything from Phase 1. Can you clearly articulate the problem, solution, market, and business model? If yes, advance.' },
  ],
  // Phase 2: Validation & Prototyping (Levels 21–30)
  [
    { title: 'The "Fake Door" Landing Page Test', badgeName: 'Smoke Tester', badgeIcon: '🚪', description: 'Build a simple landing page describing your product — before it exists — and measure signup intent from real visitors.' },
    { title: 'Customer Interviews: How to Ask Non-Leading Questions', badgeName: 'Listener', badgeIcon: '👂', description: 'Conduct structured interviews that reveal genuine pain points without accidentally guiding people toward your desired answer.' },
    { title: 'Scraping Leads & Cold Outreach Wits', badgeName: 'Hustler', badgeIcon: '☕', description: 'Build your first prospect list and test cold outreach channels — email, DMs, or calls — to gauge real interest.' },
    { title: 'The Concierge MVP (Doing It Manually)', badgeName: 'Concierge', badgeIcon: '🧑‍💼', description: 'Deliver your service manually to early customers before writing a single line of code. Learn what they truly value.' },
    { title: 'Building the 48-Hour No-Code Prototype', badgeName: 'Speed Builder', badgeIcon: '⚡', description: 'Use no-code tools (Bubble, Webflow, Airtable) to build a clickable prototype in one weekend and get it in front of users.' },
    { title: "Pricing for Survival: Don't Be Cheap", badgeName: 'Price Setter', badgeIcon: '💰', description: 'Set your initial pricing based on value delivered, not cost. Test willingness-to-pay before you launch.' },
    { title: 'Pitching Strangers: Rejection Therapy', badgeName: 'Iron Skin', badgeIcon: '🛡️', description: 'Pitch your idea to 10 strangers who have no reason to be nice. Collect the brutal feedback that makes you better.' },
    { title: 'Securing the First Letter of Intent (LOI)', badgeName: 'Deal Closer', badgeIcon: '📝', description: 'Get a potential customer to sign a non-binding letter of intent — the strongest validation signal short of payment.' },
    { title: 'Analyzing Initial User Feedback', badgeName: 'Data Miner', badgeIcon: '📊', description: 'Categorize all feedback from interviews, prototypes, and tests into themes. What patterns emerge? What surprises you?' },
    { title: 'Milestone: Product-Market Validation', badgeName: 'Validated', badgeIcon: '✅', description: 'Do you have evidence that real people want this, will use it, and will pay for it? If yes, proceed to build.' },
  ],
  // Phase 3: Legal, Finance & Admin (Levels 31–40)
  [
    { title: 'Choosing the Right Legal Entity (C-Corp, LLC)', badgeName: 'Lawful', badgeIcon: '⚖️', description: 'Understand the tradeoffs between C-Corp and LLC. Choose the structure that fits your fundraising and tax goals.' },
    { title: 'Founder Vesting Schedules (Standard 4-Year / 1-Year Cliff)', badgeName: 'Vested', badgeIcon: '⏳', description: 'Implement standard vesting: 4 years with a 1-year cliff. Protect yourself and your co-founders from early departures.' },
    { title: 'Setting Up the Cap Table Properly', badgeName: 'Cap Master', badgeIcon: '📋', description: 'Create a clean cap table that tracks founders, equity splits, and any early advisors. Future investors will scrutinize this.' },
    { title: 'IP Assignment & Trademarks', badgeName: 'IP Guardian', badgeIcon: '🔐', description: 'Ensure all intellectual property is assigned to the company. File provisional patents or trademarks if applicable.' },
    { title: 'Opening Corporate Banking & Stripe Setup', badgeName: 'Banker', badgeIcon: '🏦', description: 'Separate business and personal finances. Open a business bank account and connect Stripe for payments.' },
    { title: 'Basic Accounting & Chart of Accounts Setup', badgeName: 'Bookkeeper', badgeIcon: '📒', description: 'Set up a simple accounting system (QuickBooks, Xero, or Wave) with a proper chart of accounts from day one.' },
    { title: 'Employee Stock Option Pool (ESOP) Basics', badgeName: 'Equity Planner', badgeIcon: '📦', description: 'Understand ESOPs, set aside 10-20% of equity for future hires, and learn how options work for employees.' },
    { title: 'Data Privacy (GDPR / CCPA) Compliance', badgeName: 'Privacy Pro', badgeIcon: '🔒', description: 'Implement a privacy policy and cookie consent. Understand your obligations under GDPR and CCPA from the start.' },
    { title: 'Insurance: D&O and General Liability', badgeName: 'Insured', badgeIcon: '🛡️', description: 'Get Directors & Officers insurance and general liability coverage. Protect yourself before you need it.' },
    { title: 'Milestone: The Legal & Financial Fortress', badgeName: 'Fortified', badgeIcon: '🏰', description: 'Your legal and financial foundation is solid. No loose ends that could derail fundraising or operations later.' },
  ],
  // Phase 4: Product & Tech Foundation (Levels 41–50)
  [
    { title: 'Tech Stack Selection & Future-Proofing', badgeName: 'Architect', badgeIcon: '🏗️', description: 'Choose your tech stack with scalability in mind. Document why each choice was made and what tradeoffs exist.' },
    { title: 'UI/UX Fundamentals: Designing for Conversion', badgeName: 'Designer', badgeIcon: '🎨', description: 'Design your core flows with conversion as the north star. Every screen should guide users toward your key action.' },
    { title: 'Establishing Development Sprints & Agile Ops', badgeName: 'Scrum Master', badgeIcon: '🔄', description: 'Set up 2-week sprint cycles with clear rituals: planning, standups, reviews, and retrospectives. Ship every sprint.' },
    { title: 'Setting Up Analytics (Mixpanel / Google Analytics)', badgeName: 'Analyst', badgeIcon: '📈', description: 'Install analytics from day one. You cannot improve what you do not measure. Track at minimum: signups, activation, retention.' },
    { title: 'Implementing Event Tracking for the North Star Metric', badgeName: 'Tracker', badgeIcon: '🎯', description: 'Instrument your product to track every step toward your North Star metric. Events should tell the full user story.' },
    { title: 'Technical SEO Architecture', badgeName: 'SEO Hacker', badgeIcon: '🔍', description: 'Implement proper meta tags, sitemaps, structured data, and semantic HTML. Make Google your free marketing channel.' },
    { title: 'Bug Tracking & QA Protocols', badgeName: 'Bug Hunter', badgeIcon: '🐛', description: 'Set up a bug tracking system and define a QA process. Every bug found in production is a learning opportunity.' },
    { title: 'Security Basics & Penetration Testing', badgeName: 'Guardian', badgeIcon: '🛡️', description: 'Run basic security checks: HTTPS everywhere, input validation, dependency audits, and a penetration test of your critical flows.' },
    { title: 'Server Architecture & Hosting Optimization', badgeName: 'Server Lord', badgeIcon: '🖥️', description: 'Design your server architecture for reliability. Use CDNs, load balancers, and auto-scaling from the beginning.' },
    { title: 'Milestone: Version 1.0 Ready', badgeName: 'Launcher', badgeIcon: '🚀', description: 'Your product is built, tested, and stable. Analytics are in place. The foundation is ready. Time to launch.' },
  ],
  // Phase 5: Guerrilla Marketing & Launch (Levels 51–60)
  [
    { title: 'Zero-Dollar Marketing: The Guerrilla Playbook', badgeName: 'Guerrilla', badgeIcon: '🪖', description: 'Create a marketing plan that costs nothing: content, community, partnerships, and creative stunts that earn attention.' },
    { title: 'Hijacking Attention: Social Media Leverage', badgeName: 'Growth Hacker', badgeIcon: '📱', description: 'Build a social media strategy that rides trends, creates controversy (thoughtfully), and turns impressions into followers.' },
    { title: 'Launching on Product Hunt & Hacker News', badgeName: 'Hunter', badgeIcon: '🏹', description: 'Prepare and execute a Product Hunt launch. Write a compelling tagline, gather upvotes, and engage every comment.' },
    { title: 'Engineering Viral Loops & Referral Systems', badgeName: 'Viral Engineer', badgeIcon: '🔄', description: 'Design a referral system that incentivizes sharing. Every user should bring at least one more user over time.' },
    { title: 'Content as Leverage: SEO & Writing to Win', badgeName: 'Content King', badgeIcon: '✍️', description: 'Start a blog or newsletter. Write content that ranks, converts, and positions you as the authority in your space.' },
    { title: 'B2B Trojan Horses: Offering Free Audits', badgeName: 'Trojan', badgeIcon: '🐴', description: 'Offer free value (audits, assessments, consultations) that naturally leads prospects to your paid solution.' },
    { title: 'Street-Level Tactics: Local Domination & Flyers', badgeName: 'Street Hustler', badgeIcon: '🏙️', description: 'Sometimes the best move is offline. Identify local channels — events, flyers, stickers — that your competitors ignore.' },
    { title: 'Strategic Partnerships: Borrowing Audiences', badgeName: 'Alliance Builder', badgeIcon: '🤝', description: 'Partner with complementary businesses that already serve your ICP. Their audience becomes your audience.' },
    { title: 'Media & PR Outbound: Creating the Narrative', badgeName: 'Storyteller', badgeIcon: '📰', description: 'Craft a compelling founder story and pitch it to journalists, podcasts, and newsletters that reach your audience.' },
    { title: 'Milestone: The 100 True Fans Checkpoint', badgeName: 'Beloved', badgeIcon: '❤️', description: 'Do you have 100 people who love what you do and will tell others? This is the foundation of everything that follows.' },
  ],
  // Phase 6: Sales Engine & CRM (Levels 61–70)
  [
    { title: 'Setting Up the CRM Architecture', badgeName: 'CRM Master', badgeIcon: '🗄️', description: 'Choose and configure a CRM (HubSpot, Salesforce, Pipedrive). Define your pipeline stages and data model.' },
    { title: 'Lead Scoring & Qualification (BANT)', badgeName: 'Qualifier', badgeIcon: '🎯', description: 'Implement BANT (Budget, Authority, Need, Timeline) scoring. Focus sales energy on leads most likely to close.' },
    { title: 'Designing the Automated Nurture Sequence', badgeName: 'Automator', badgeIcon: '🤖', description: 'Build email sequences that nurture cold leads into warm prospects. Every touchpoint should add value, not noise.' },
    { title: 'The Art of the Cold Call & Voicemail', badgeName: 'Cold Caller', badgeIcon: '📞', description: 'Master the cold call: open with a hook, qualify in 30 seconds, and always leave a voicemail that earns a callback.' },
    { title: 'Crafting the Perfect Sales Deck', badgeName: 'Pitch Master', badgeIcon: '📊', description: 'Build a sales deck that tells a story, shows social proof, and ends with a clear next step. No more than 12 slides.' },
    { title: 'Handling Objections & Closing Techniques', badgeName: 'Closer', badgeIcon: '🔑', description: 'Learn the most common objections in your industry and prepare proven responses. Practice until it is second nature.' },
    { title: 'Contract Negotiation & E-Signatures', badgeName: 'Negotiator', badgeIcon: '🖊️', description: 'Streamline your contract workflow with e-signatures. Know which terms are negotiable and which are non-negotiable.' },
    { title: 'Customer Onboarding Automation', badgeName: 'Onboarder', badgeIcon: '🚢', description: 'Design a frictionless onboarding flow. Time-to-value should be measured in minutes, not days. Automate the welcome.' },
    { title: 'Tracking Sales Velocity & Conversion Rates', badgeName: 'Sales Analyst', badgeIcon: '📈', description: 'Measure time from lead to close, conversion at each stage, and average deal size. Optimize the weakest link.' },
    { title: 'Milestone: The Predictable Revenue Engine', badgeName: 'Revenue Engine', badgeIcon: '⚙️', description: 'Your sales process is no longer guesswork. You can predict revenue based on inputs. The machine is running.' },
  ],
  // Phase 7: Operations & The Machine (Levels 71–80)
  [
    { title: 'Documenting Standard Operating Procedures (SOPs)', badgeName: 'Documenter', badgeIcon: '📋', description: 'Write SOPs for every recurring task. If it happens more than twice, document it. Future you will thank present you.' },
    { title: 'Replacing Yourself: Firing the Founder from Day-to-Day', badgeName: 'Delegator', badgeIcon: '🔄', description: 'Identify every task only you can do, then systematically build systems and hire people to take over the rest.' },
    { title: 'Radical Truth & Transparency in the Team (Dalio)', badgeName: 'Transparent', badgeIcon: '🔮', description: 'Build a culture where honest feedback flows freely. Problems surface fast and get solved faster.' },
    { title: 'Automating Admin Hacks (Zapier / n8n / AI)', badgeName: 'Automation Wizard', badgeIcon: '🧙', description: 'Automate repetitive admin: invoicing, reporting, data entry. Every hour saved is an hour for strategic work.' },
    { title: 'Designing Algorithmic Decision-Making', badgeName: 'Algorithmist', badgeIcon: '🧮', description: 'Create decision frameworks and scorecards for recurring choices (hiring, feature prioritization, vendor selection).' },
    { title: 'Customer Success & Churn Mitigation', badgeName: 'Retention Pro', badgeIcon: '❤️', description: 'Build a customer success playbook. Identify at-risk accounts early and intervene before they churn.' },
    { title: 'Ticketing Systems for Support', badgeName: 'Support Hero', badgeIcon: '🎫', description: 'Set up a help desk (Intercom, Zendesk, or Linear). Categorize, prioritize, and measure resolution time.' },
    { title: 'Vendor Management & Supply Chain', badgeName: 'Supply Chain', badgeIcon: '🔗', description: 'Map every vendor relationship. Have backups for critical suppliers. Negotiate better terms as you scale.' },
    { title: 'Financial Dashboards: Daily Cash Flow Tracking', badgeName: 'CFO', badgeIcon: '💵', description: 'Build a dashboard showing cash in, cash out, and runway — updated daily. Never be surprised by the bank balance.' },
    { title: 'Milestone: The Self-Sustaining Machine', badgeName: 'Automaton', badgeIcon: '🤖', description: 'Your business runs without you in the day-to-day. Systems, people, and automation handle operations.' },
  ],
  // Phase 8: Talent & Culture (Levels 81–90)
  [
    { title: 'Defining the Employer Brand', badgeName: 'Employer Brand', badgeIcon: '🏢', description: 'Why should top talent choose you over FAANG? Define your employer value proposition and broadcast it.' },
    { title: 'Writing High-Conversion Job Descriptions', badgeName: 'Recruiter', badgeIcon: '📝', description: 'Write job descriptions that attract A-players. Focus on impact and mission, not just requirements.' },
    { title: 'The Interview Scorecard & Hiring A-Players', badgeName: 'A-Player Hunter', badgeIcon: '⭐', description: 'Implement structured interview scorecards. Every candidate is rated on the same criteria by every interviewer.' },
    { title: 'Onboarding Processes for New Hires', badgeName: 'Onboarder', badgeIcon: '🚀', description: 'Design a 30-60-90 day onboarding plan. New hires should ship something meaningful in their first week.' },
    { title: 'Setting OKRs (Objectives & Key Results)', badgeName: 'Goal Setter', badgeIcon: '🎯', description: 'Roll out company-wide OKRs. Connect every individual\'s work to the company\'s top-level objectives.' },
    { title: 'Asynchronous Work & Remote Optimization', badgeName: 'Async Master', badgeIcon: '🌍', description: 'Optimize for async communication. Default to written updates, recorded demos, and documentation over meetings.' },
    { title: 'Performance Reviews & Radical Candor', badgeName: 'Coach', badgeIcon: '💬', description: 'Run regular performance reviews that are honest, actionable, and growth-oriented. Care personally, challenge directly.' },
    { title: 'Handling Terminations Gracefully', badgeName: 'Graceful Exit', badgeIcon: '🤲', description: 'Learn to let people go with dignity. A termination done right preserves relationships and protects your culture.' },
    { title: 'Leadership Offsites & Culture Building', badgeName: 'Culture Builder', badgeIcon: '🏕️', description: 'Plan intentional offsites that strengthen bonds, align on strategy, and make people excited to come back on Monday.' },
    { title: 'Milestone: The High-Performance Team', badgeName: 'Dream Team', badgeIcon: '🏆', description: 'You have built a team of A-players who push each other to excel. Talent is your competitive advantage.' },
  ],
  // Phase 9: Capital & Investment (Levels 91–100)
  [
    { title: 'Bootstrapping vs. VC: Choosing Your Game', badgeName: 'Path Chooser', badgeIcon: '🔀', description: 'Decide consciously: bootstrap for control and profitability, or raise VC for speed and scale. There is no wrong answer — only tradeoffs.' },
    { title: 'Alternative Funding: Bank Loans, Grants, Revenue Financing', badgeName: 'Fundraiser', badgeIcon: '💡', description: 'Explore non-dilutive funding: SBA loans, government grants, revenue-based financing. Sometimes the best money is not VC money.' },
    { title: 'Preparing the Data Room & Cap Table Cleanup', badgeName: 'Data Room Pro', badgeIcon: '🗄️', description: 'Assemble your data room: financials, cap table, customer contracts, IP. Investors will ask for everything — have it ready.' },
    { title: 'The YC Pitch Deck Formula', badgeName: 'YC Ready', badgeIcon: '📊', description: 'Build the canonical pitch deck: problem, solution, market, traction, team, ask. Clear, concise, convincing.' },
    { title: 'Identifying Angel Investors & Syndicates', badgeName: 'Networker', badgeIcon: '🦋', description: 'Map the angel investor landscape. Target those who have invested in your vertical and can open doors beyond their check.' },
    { title: 'Understanding Valuations & SAFEs', badgeName: 'Deal Maker', badgeIcon: '📜', description: 'Learn how valuations are set, what a SAFE is, and how caps and discounts work. Never negotiate blind.' },
    { title: 'The Investor Meeting: Framing the Narrative', badgeName: 'Storyteller', badgeIcon: '🎤', description: 'Every investor meeting is a performance. Open with a hook, show momentum, and make the opportunity undeniable.' },
    { title: 'Navigating the Due Diligence Process', badgeName: 'Due Diligence', badgeIcon: '🔍', description: 'Respond to diligence requests promptly and completely. Delays kill deals. Have legal counsel ready.' },
    { title: 'Term Sheet Negotiation', badgeName: 'Terminator', badgeIcon: '⚖️', description: 'Understand every clause in a term sheet. Negotiate what matters (control, liquidation preference) and concede the rest.' },
    { title: 'Milestone: Capital In the Bank', badgeName: 'Funded', badgeIcon: '🏦', description: 'The round is closed. Capital is in the bank. Now the real work begins — deploy it wisely.' },
  ],
  // Phase 10: Governance & The Infinite Game (Levels 101–110)
  [
    { title: 'Setting Up a Real Board of Directors', badgeName: 'Board Member', badgeIcon: '👥', description: 'Recruit independent board members who bring expertise and accountability. A great board makes you better.' },
    { title: 'Board Meeting Prep & Reporting', badgeName: 'Reporter', badgeIcon: '📊', description: 'Prepare board decks that tell the truth. Financials, KPIs, risks, and asks. No surprises — ever.' },
    { title: 'Navigating Crises: PR & Catastrophe Management', badgeName: 'Crisis Manager', badgeIcon: '🚨', description: 'Have a crisis playbook: who speaks, what gets said, when. The best crisis response is prepared before the crisis hits.' },
    { title: 'Expanding Internationally (New Markets)', badgeName: 'Explorer', badgeIcon: '🌍', description: 'Identify your first international market. Understand localization, payments, legal, and cultural adaptation.' },
    { title: 'Mergers & Acquisitions: Buying Competitors', badgeName: 'Acquirer', badgeIcon: '🤝', description: 'Learn how M&A works. Sometimes buying a competitor is faster than building. Evaluate integration complexity honestly.' },
    { title: 'Legal Moats & Deep Intellectual Property', badgeName: 'Patent Holder', badgeIcon: '🏰', description: 'Build defensible moats: patents, trade secrets, network effects, and data advantages that competitors cannot replicate.' },
    { title: 'Wealth vs. Money: Founder Liquidity Events', badgeName: 'Wealth Builder', badgeIcon: '💎', description: 'Understand secondary sales, tender offers, and partial liquidity. You do not need to wait for IPO to unlock some value.' },
    { title: 'Preparing for an Exit Strategy (IPO / Acquisition)', badgeName: 'Exit Ready', badgeIcon: '🚪', description: 'Whether IPO or acquisition, start preparing 18-24 months ahead. Clean financials, auditable processes, and a compelling story.' },
    { title: 'The Psychology of the Post-Success Founder', badgeName: 'Philosopher', badgeIcon: '🧘', description: 'Prepare for the emotional journey after a liquidity event. Identity, purpose, and what comes next are real challenges.' },
    { title: 'Milestone: Becoming the Angel / Mentor', badgeName: 'Angel', badgeIcon: '👼', description: 'You made it. Now pay it forward. Invest in the next generation, mentor founders, and keep building. The game is infinite.' },
  ],
];

function makeCheckpointTask(levelId: number): JourneyLevel['tasks'] {
  return [
    {
      id: `${levelId}-1`,
      title: 'Complete this checkpoint',
      description: 'Read through this lesson, reflect on how it applies to your business, and check off when you have absorbed the concept.',
      type: 'checkbox' as const,
      points: 50,
      required: true,
    },
  ];
}

/**
 * All 100 advanced levels (IDs 11–110) grouped into 10 phases.
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
        tasks: makeCheckpointTask(id),
      });
    }
  }

  return result;
}

export { phases };
