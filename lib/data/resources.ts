// Resources data: PDF books, guides, templates, spreadsheets
// Searchable, filterable library for entrepreneurs

export type ResourceType = 'pdf' | 'guide' | 'template' | 'spreadsheet' | 'ebook' | 'infographic' | 'cheatsheet';

export interface Resource {
  id: string;
  title: string;
  titleEs?: string;
  type: ResourceType;
  description: string;
  descriptionEs?: string;
  thumbnail: string; // gradient placeholder
  downloadUrl: string; // mock link
  tags: string[];
  fileSize: string;
  format: string;
  downloads: number; // mock count
  featured?: boolean;
  /** Which journey phase this resource complements (1-10, or 0 for general) */
  journeyPhase?: number;
}

import { resourceTranslations } from './resource-translations';

/** Get locale-aware title/description for a resource */
export function getResourceLocale(resource: Resource, locale: 'en' | 'es'): { title: string; description: string } {
  if (locale === 'es' && resourceTranslations[resource.id]) {
    return {
      title: resourceTranslations[resource.id].titleEs,
      description: resourceTranslations[resource.id].descriptionEs,
    };
  }
  return { title: resource.title, description: resource.description };
}

export const resources: Resource[] = [
  // ══════════════════════════════════════════════════════════════════
  // PHASE 1: Ideation & Alignment (Levels 1–20)
  // ══════════════════════════════════════════════════════════════════
  {
    id: 'r1', title: 'Mission Statement Canvas',
    type: 'template',
    description: 'A one-page framework to define your mission, vision, values, and unique value proposition. Perfect for Level 1 — Define Your Mission.',
    thumbnail: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
    downloadUrl: '#', tags: ['ideation, strategy'], fileSize: '1.2 MB', format: 'PDF',
    downloads: 4821, featured: true, journeyPhase: 1,
  },
  {
    id: 'r2', title: 'Target Audience Persona Builder',
    type: 'template',
    description: 'Build detailed customer personas with demographics, psychographics, pain points, and jobs-to-be-done. Complements journey tasks on audience identification.',
    thumbnail: 'linear-gradient(135deg, #4f46e5, #818cf8)',
    downloadUrl: '#', tags: ['ideation, marketing'], fileSize: '720 KB', format: 'PDF',
    downloads: 2987, journeyPhase: 1,
  },
  {
    id: 'r3', title: 'Competitor Matrix & Blue Ocean Map',
    type: 'spreadsheet',
    description: 'Map competitors on 10 dimensions. Identify uncontested market space. Includes 2×2 matrix templates and red-ocean vs blue-ocean scoring.',
    thumbnail: 'linear-gradient(135deg, #0891b2, #67e8f9)',
    downloadUrl: '#', tags: ['ideation, strategy'], fileSize: '890 KB', format: 'XLSX',
    downloads: 2140, journeyPhase: 1,
  },
  {
    id: 'r4', title: 'Unit Economics Napkin Calculator',
    type: 'spreadsheet',
    description: 'Quick CAC, LTV, gross margin, and payback period calculator. The one spreadsheet every founder needs before spending a dollar on growth.',
    thumbnail: 'linear-gradient(135deg, #059669, #34d399)',
    downloadUrl: '#', tags: ['finance, ideation'], fileSize: '580 KB', format: 'XLSX',
    downloads: 3650, journeyPhase: 1,
  },
  {
    id: 'r5', title: 'Co-Founder Agreement & Vesting Schedule',
    type: 'template',
    description: 'Standard 4-year vesting with 1-year cliff. Equity split frameworks, role definitions, IP assignment, and decision-making protocols.',
    thumbnail: 'linear-gradient(135deg, #0d9488, #5eead4)',
    downloadUrl: '#', tags: ['legal, ideation'], fileSize: '650 KB', format: 'DOCX',
    downloads: 3456, featured: true, journeyPhase: 1,
  },
  {
    id: 'r6', title: '1-Sentence Pitch Formula',
    type: 'cheatsheet',
    description: 'Byte-sized card: the 4 pitch formulas used by YC, Sequoia, and a16z. Includes fill-in-the-blank templates and real examples from billion-dollar startups.',
    thumbnail: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
    downloadUrl: '#', tags: ['pitching, ideation'], fileSize: '320 KB', format: 'PDF',
    downloads: 6120, journeyPhase: 1,
  },

  // ══════════════════════════════════════════════════════════════════
  // PHASE 2: Validation & Quick Wins (Levels 21–30)
  // ══════════════════════════════════════════════════════════════════
  {
    id: 'r7', title: 'The Mom Test — Interview Cheatsheet',
    type: 'cheatsheet',
    description: '10 questions that never lie. Based on Rob Fitzpatrick\'s framework. Avoid false positives and get real signal from customer conversations.',
    thumbnail: 'linear-gradient(135deg, #dc2626, #f87171)',
    downloadUrl: '#', tags: ['validation, customer-research'], fileSize: '280 KB', format: 'PDF',
    downloads: 4890, journeyPhase: 2,
  },
  {
    id: 'r8', title: 'MVP Feature Prioritization Matrix',
    type: 'spreadsheet',
    description: 'RICE scoring (Reach, Impact, Confidence, Effort) to decide what goes in your MVP. Stop building features nobody asked for.',
    thumbnail: 'linear-gradient(135deg, #9333ea, #c084fc)',
    downloadUrl: '#', tags: ['validation, product'], fileSize: '450 KB', format: 'XLSX',
    downloads: 3280, journeyPhase: 2,
  },
  {
    id: 'r9', title: 'Landing Page A/B Test Kit',
    type: 'template',
    description: '5 landing page variants with copy frameworks, CTA placements, and social proof layouts. Track conversions from day one.',
    thumbnail: 'linear-gradient(135deg, #2563eb, #60a5fa)',
    downloadUrl: '#', tags: ['validation, marketing'], fileSize: '1.8 MB', format: 'PDF',
    downloads: 2750, journeyPhase: 2,
  },
  {
    id: 'r10', title: 'Lean Startup Experiment Tracker',
    type: 'spreadsheet',
    description: 'Build-Measure-Learn loop tracker. Hypothesis templates, experiment logs, and pivot/double-down decision frameworks.',
    thumbnail: 'linear-gradient(135deg, #ea580c, #fb923c)',
    downloadUrl: '#', tags: ['validation, product'], fileSize: '980 KB', format: 'XLSX',
    downloads: 1876, journeyPhase: 2,
  },
  {
    id: 'r11', title: 'Pre-Sales & Waitlist Playbook',
    type: 'guide',
    description: 'How to sell before you build. Waitlist strategies, early-adopter pricing, smoke tests, and commitment devices to validate demand.',
    thumbnail: 'linear-gradient(135deg, #db2777, #f472b6)',
    downloadUrl: '#', tags: ['validation, sales'], fileSize: '2.1 MB', format: 'PDF',
    downloads: 3420, journeyPhase: 2,
  },

  // ══════════════════════════════════════════════════════════════════
  // PHASE 3: Guerrilla Marketing & Launch (Levels 31–40)
  // ══════════════════════════════════════════════════════════════════
  {
    id: 'r12', title: 'SEO Content Strategy Guide',
    type: 'ebook',
    description: 'Complete SEO playbook: keyword research, content clusters, backlink strategies, and technical SEO. Map your content to customer search intent.',
    thumbnail: 'linear-gradient(135deg, #0891b2, #67e8f9)',
    downloadUrl: '#', tags: ['marketing, growth'], fileSize: '5.8 MB', format: 'PDF',
    downloads: 5210, featured: true, journeyPhase: 3,
  },
  {
    id: 'r13', title: 'Social Media Content Calendar (30-Day)',
    type: 'spreadsheet',
    description: 'Pre-filled 30-day content calendar with post ideas, optimal times, hashtag strategies, and engagement tracking for Instagram, LinkedIn, and X.',
    thumbnail: 'linear-gradient(135deg, #db2777, #f472b6)',
    downloadUrl: '#', tags: ['marketing, social-media'], fileSize: '1.1 MB', format: 'XLSX',
    downloads: 4102, journeyPhase: 3,
  },
  {
    id: 'r14', title: 'Cold Email Outreach Templates',
    type: 'template',
    description: '12 proven cold email templates for sales, partnerships, PR, and investor intros. Includes subject line A/B test results and follow-up cadences.',
    thumbnail: 'linear-gradient(135deg, #2563eb, #60a5fa)',
    downloadUrl: '#', tags: ['marketing, sales'], fileSize: '890 KB', format: 'PDF',
    downloads: 3890, featured: true, journeyPhase: 3,
  },
  {
    id: 'r15', title: 'Guerrilla Marketing — 50 Low-Budget Tactics',
    type: 'infographic',
    description: 'Visual one-pager with 50 guerrilla marketing tactics under $100. Street teams, sticker campaigns, Reddit launches, and viral stunts.',
    thumbnail: 'linear-gradient(135deg, #ca8a04, #facc15)',
    downloadUrl: '#', tags: ['marketing, growth'], fileSize: '1.5 MB', format: 'PDF',
    downloads: 7640, journeyPhase: 3,
  },
  {
    id: 'r16', title: 'Product Hunt Launch Checklist',
    type: 'cheatsheet',
    description: 'Byte-sized checklist: everything you need 30 days before, 7 days before, and on launch day. Hunter outreach scripts included.',
    thumbnail: 'linear-gradient(135deg, #ef4444, #fca5a5)',
    downloadUrl: '#', tags: ['marketing, launch'], fileSize: '340 KB', format: 'PDF',
    downloads: 8910, journeyPhase: 3,
  },
  {
    id: 'r17', title: 'Content Repurposing Matrix',
    type: 'infographic',
    description: 'Turn one long-form piece into 12+ social posts, a newsletter, a thread, a carousel, and a short video. Work smarter, not harder.',
    thumbnail: 'linear-gradient(135deg, #8b5cf6, #c4b5fd)',
    downloadUrl: '#', tags: ['marketing, content'], fileSize: '920 KB', format: 'PDF',
    downloads: 5230, journeyPhase: 3,
  },

  // ══════════════════════════════════════════════════════════════════
  // PHASE 4: Sales Engine & CRM (Levels 41–50)
  // ══════════════════════════════════════════════════════════════════
  {
    id: 'r18', title: 'Sales Funnel Dashboard',
    type: 'spreadsheet',
    description: 'Track leads through awareness → interest → decision → action. Conversion rates, pipeline velocity, and revenue forecasting built in.',
    thumbnail: 'linear-gradient(135deg, #059669, #34d399)',
    downloadUrl: '#', tags: ['sales, operations'], fileSize: '1.6 MB', format: 'XLSX',
    downloads: 2980, journeyPhase: 4,
  },
  {
    id: 'r19', title: 'Objection Handling Script Bank',
    type: 'cheatsheet',
    description: '25 common objections with 3 responses each. "Too expensive", "Send me more info", "I need to think about it" — never get stuck again.',
    thumbnail: 'linear-gradient(135deg, #dc2626, #f87171)',
    downloadUrl: '#', tags: ['sales, pitching'], fileSize: '410 KB', format: 'PDF',
    downloads: 5620, journeyPhase: 4,
  },
  {
    id: 'r20', title: 'Investor & Partner CRM Tracker',
    type: 'spreadsheet',
    description: 'Track every conversation. Warm intro tracking, meeting notes, follow-up automation, fund-fit scoring. Never lose a relationship.',
    thumbnail: 'linear-gradient(135deg, #b45389, #f9a8d4)',
    downloadUrl: '#', tags: ['sales, fundraising'], fileSize: '1.3 MB', format: 'XLSX',
    downloads: 2340, journeyPhase: 4,
  },
  {
    id: 'r21', title: 'The Demo That Converts',
    type: 'guide',
    description: 'Structure product demos that close. The 7-minute framework: hook, pain agitate, aha moment, pricing anchor, call to action.',
    thumbnail: 'linear-gradient(135deg, #0d9488, #5eead4)',
    downloadUrl: '#', tags: ['sales, pitching'], fileSize: '1.9 MB', format: 'PDF',
    downloads: 3140, journeyPhase: 4,
  },
  {
    id: 'r22', title: 'Pricing Strategy Decision Tree',
    type: 'infographic',
    description: 'Visual guide: freemium vs trial vs usage-based vs flat-rate. Decision tree based on ACV, customer segment, and sales motion.',
    thumbnail: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
    downloadUrl: '#', tags: ['sales, strategy'], fileSize: '780 KB', format: 'PDF',
    downloads: 4710, journeyPhase: 4,
  },

  // ══════════════════════════════════════════════════════════════════
  // PHASE 5: Product & Tech Foundation (Levels 51–60)
  // ══════════════════════════════════════════════════════════════════
  {
    id: 'r23', title: 'Product Roadmap Framework',
    type: 'spreadsheet',
    description: 'Strategic planning with RICE prioritization, OKR tracking, and stakeholder communication dashboards. Now-Next-Later format.',
    thumbnail: 'linear-gradient(135deg, #9333ea, #c084fc)',
    downloadUrl: '#', tags: ['product, operations'], fileSize: '1.5 MB', format: 'XLSX',
    downloads: 2745, journeyPhase: 5,
  },
  {
    id: 'r24', title: 'Tech Stack Decision Matrix',
    type: 'spreadsheet',
    description: 'Compare frameworks, hosting, databases, and third-party tools. Cost, scalability, hiring availability, and community health scored.',
    thumbnail: 'linear-gradient(135deg, #6366f1, #a5b4fc)',
    downloadUrl: '#', tags: ['tech, product'], fileSize: '1.1 MB', format: 'XLSX',
    downloads: 1890, journeyPhase: 5,
  },
  {
    id: 'r25', title: 'AI Tools for Founders — 2026 Edition',
    type: 'infographic',
    description: 'One-page visual map: AI tools for copywriting, design, coding, customer support, and data analysis. Free and paid tiers compared.',
    thumbnail: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
    downloadUrl: '#', tags: ['tech, ai'], fileSize: '1.4 MB', format: 'PDF',
    downloads: 12450, journeyPhase: 5,
  },
  {
    id: 'r26', title: 'User Story Mapping Template',
    type: 'template',
    description: 'Map user journeys from discovery to advocacy. Backbone, walking skeleton, and release slices. Miro-ready and print-ready versions.',
    thumbnail: 'linear-gradient(135deg, #2563eb, #60a5fa)',
    downloadUrl: '#', tags: ['product, ux'], fileSize: '940 KB', format: 'PDF',
    downloads: 2100, journeyPhase: 5,
  },
  {
    id: 'r27', title: 'No-Code / Low-Code Stack Guide',
    type: 'guide',
    description: 'Build your MVP without engineers. Bubble, Webflow, Airtable, Zapier, and Make.com workflows with real startup case studies.',
    thumbnail: 'linear-gradient(135deg, #059669, #34d399)',
    downloadUrl: '#', tags: ['tech, product'], fileSize: '3.2 MB', format: 'PDF',
    downloads: 6780, journeyPhase: 5,
  },

  // ══════════════════════════════════════════════════════════════════
  // PHASE 6: Legal, Finance & Admin (Levels 61–70)
  // ══════════════════════════════════════════════════════════════════
  {
    id: 'r28', title: 'LLC / S-Corp Formation Checklist',
    type: 'guide',
    description: 'Step-by-step: state filing, EIN, operating agreement, registered agent, and bank account. State-by-state fee comparison included.',
    thumbnail: 'linear-gradient(135deg, #ca8a04, #facc15)',
    downloadUrl: '#', tags: ['legal, operations'], fileSize: '4.2 MB', format: 'PDF',
    downloads: 5632, featured: true, journeyPhase: 6,
  },
  {
    id: 'r29', title: 'Terms of Service & Privacy Policy Pack',
    type: 'template',
    description: 'Ready-to-customize ToS and Privacy Policy for SaaS, e-commerce, and marketplaces. GDPR and CCPA compliant drafts with annotations.',
    thumbnail: 'linear-gradient(135deg, #64748b, #94a3b8)',
    downloadUrl: '#', tags: ['legal'], fileSize: '820 KB', format: 'DOCX',
    downloads: 6721, journeyPhase: 6,
  },
  {
    id: 'r30', title: 'Startup Accounting 101',
    type: 'ebook',
    description: 'Chart of accounts, revenue recognition, R&D tax credits, 83(b) elections, and cap table management. Written for founders who hate accounting.',
    thumbnail: 'linear-gradient(135deg, #166534, #4ade80)',
    downloadUrl: '#', tags: ['finance, legal'], fileSize: '3.8 MB', format: 'PDF',
    downloads: 4340, journeyPhase: 6,
  },
  {
    id: 'r31', title: 'SaaS Financial Model 2026',
    type: 'spreadsheet',
    description: 'Revenue projections, churn analysis, CAC/LTV ratios, runway calculator, and scenario planner. Built by a former VC analyst.',
    thumbnail: 'linear-gradient(135deg, #059669, #34d399)',
    downloadUrl: '#', tags: ['finance, fundraising'], fileSize: '1.8 MB', format: 'XLSX',
    downloads: 3204, featured: true, journeyPhase: 6,
  },
  {
    id: 'r32', title: 'Tax Deduction Cheatsheet for Founders',
    type: 'cheatsheet',
    description: 'Byte-sized card: 20 tax deductions most founders miss. Home office, equipment, software, travel, meals, and health premiums.',
    thumbnail: 'linear-gradient(135deg, #dc2626, #f87171)',
    downloadUrl: '#', tags: ['finance, legal'], fileSize: '290 KB', format: 'PDF',
    downloads: 8910, journeyPhase: 6,
  },
  {
    id: 'r33', title: 'Intellectual Property 101',
    type: 'guide',
    description: 'Trademarks, patents, copyrights, and trade secrets explained for founders. When to file, what to protect, and how much it costs.',
    thumbnail: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
    downloadUrl: '#', tags: ['legal, strategy'], fileSize: '2.6 MB', format: 'PDF',
    downloads: 3560, journeyPhase: 6,
  },

  // ══════════════════════════════════════════════════════════════════
  // PHASE 7: Operations & The Machine (Levels 71–80)
  // ══════════════════════════════════════════════════════════════════
  {
    id: 'r34', title: 'SOP Template Pack (10 Core Processes)',
    type: 'template',
    description: 'Standard operating procedures for onboarding, support, billing, deployment, and content publishing. Fill-in-the-blanks format.',
    thumbnail: 'linear-gradient(135deg, #0d9488, #5eead4)',
    downloadUrl: '#', tags: ['operations, systems'], fileSize: '1.9 MB', format: 'DOCX',
    downloads: 4120, journeyPhase: 7,
  },
  {
    id: 'r35', title: 'Automation Opportunity Map',
    type: 'infographic',
    description: 'Visual guide: 30 processes you can automate with Zapier, Make, or n8n. Time savings and complexity scores for each.',
    thumbnail: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
    downloadUrl: '#', tags: ['operations, tech, ai'], fileSize: '1.1 MB', format: 'PDF',
    downloads: 5230, journeyPhase: 7,
  },
  {
    id: 'r36', title: 'Project Management — Founder Edition',
    type: 'spreadsheet',
    description: 'Lightweight project tracker with RAG status, owner assignment, dependency mapping, and weekly review cadence. No PMP required.',
    thumbnail: 'linear-gradient(135deg, #ea580c, #fb923c)',
    downloadUrl: '#', tags: ['operations, systems'], fileSize: '720 KB', format: 'XLSX',
    downloads: 2890, journeyPhase: 7,
  },
  {
    id: 'r37', title: 'Customer Support Playbook',
    type: 'guide',
    description: 'Ticket triage, SLA definitions, canned responses, escalation paths, and CSAT measurement. Build support that scales.',
    thumbnail: 'linear-gradient(135deg, #2563eb, #60a5fa)',
    downloadUrl: '#', tags: ['operations, customer-research'], fileSize: '2.4 MB', format: 'PDF',
    downloads: 1980, journeyPhase: 7,
  },
  {
    id: 'r38', title: 'Monthly Business Review Template',
    type: 'template',
    description: 'One-page MBR format: KPIs, wins, blockers, resource requests, and next-month priorities. Keep your team aligned in 30 minutes.',
    thumbnail: 'linear-gradient(135deg, #9333ea, #c084fc)',
    downloadUrl: '#', tags: ['operations, strategy'], fileSize: '540 KB', format: 'PDF',
    downloads: 3450, journeyPhase: 7,
  },

  // ══════════════════════════════════════════════════════════════════
  // PHASE 8: Talent & Culture (Levels 81–90)
  // ══════════════════════════════════════════════════════════════════
  {
    id: 'r39', title: 'Hiring Scorecard Template',
    type: 'template',
    description: 'Structured interview scorecard with competency definitions, red-flag checklist, and culture-fit assessment. Hire slow, fire fast.',
    thumbnail: 'linear-gradient(135deg, #db2777, #f472b6)',
    downloadUrl: '#', tags: ['hiring, culture'], fileSize: '620 KB', format: 'PDF',
    downloads: 2780, journeyPhase: 8,
  },
  {
    id: 'r40', title: 'Employee Onboarding 30-60-90 Plan',
    type: 'template',
    description: 'Structured onboarding that gets new hires productive in week one. Milestones, buddy system, and manager check-in cadence.',
    thumbnail: 'linear-gradient(135deg, #059669, #34d399)',
    downloadUrl: '#', tags: ['hiring, culture'], fileSize: '870 KB', format: 'DOCX',
    downloads: 3900, journeyPhase: 8,
  },
  {
    id: 'r41', title: 'Remote Team Culture Playbook',
    type: 'guide',
    description: 'Async communication, virtual watercooler, documentation culture, and remote-first decision making. Don\'t replicate office dysfunction online.',
    thumbnail: 'linear-gradient(135deg, #6366f1, #a5b4fc)',
    downloadUrl: '#', tags: ['hiring, culture'], fileSize: '2.8 MB', format: 'PDF',
    downloads: 5120, journeyPhase: 8,
  },
  {
    id: 'r42', title: 'Compensation & Equity Benchmarks',
    type: 'spreadsheet',
    description: 'Salary bands by role, stage, and location. Equity ranges from seed to Series C. Based on 5,000+ startup data points.',
    thumbnail: 'linear-gradient(135deg, #ca8a04, #facc15)',
    downloadUrl: '#', tags: ['hiring, finance'], fileSize: '1.4 MB', format: 'XLSX',
    downloads: 4560, journeyPhase: 8,
  },
  {
    id: 'r43', title: 'Performance Review Framework',
    type: 'template',
    description: 'Continuous feedback model (no annual reviews). Goal setting, competency matrix, and growth conversation templates.',
    thumbnail: 'linear-gradient(135deg, #dc2626, #f87171)',
    downloadUrl: '#', tags: ['culture, systems'], fileSize: '730 KB', format: 'PDF',
    downloads: 2340, journeyPhase: 8,
  },

  // ══════════════════════════════════════════════════════════════════
  // PHASE 9: Capital & Investment (Levels 91–100)
  // ══════════════════════════════════════════════════════════════════
  {
    id: 'r44', title: 'The Ultimate Pitch Deck Template',
    type: 'template',
    description: '12-slide structure that wins investors. Based on decks that raised $500M+. Speaker notes and design guidelines per slide.',
    thumbnail: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
    downloadUrl: '#', tags: ['fundraising, pitching'], fileSize: '2.4 MB', format: 'PPTX',
    downloads: 4821, featured: true, journeyPhase: 9,
  },
  {
    id: 'r45', title: 'Fundraising CRM & Investor Pipeline',
    type: 'spreadsheet',
    description: 'Track every investor touchpoint. Fund fit scoring, meeting notes, follow-up automation, and close-probability forecasting.',
    thumbnail: 'linear-gradient(135deg, #b45389, #f9a8d4)',
    downloadUrl: '#', tags: ['fundraising, sales'], fileSize: '1.3 MB', format: 'XLSX',
    downloads: 2340, journeyPhase: 9,
  },
  {
    id: 'r46', title: 'Term Sheet Decoder',
    type: 'cheatsheet',
    description: 'Byte-sized card: liquidation preference, anti-dilution, board seats, drag-along, and pro-rata explained in plain English.',
    thumbnail: 'linear-gradient(135deg, #ef4444, #fca5a5)',
    downloadUrl: '#', tags: ['fundraising, legal'], fileSize: '360 KB', format: 'PDF',
    downloads: 7340, journeyPhase: 9,
  },
  {
    id: 'r47', title: 'Valuation Methods — A Founder\'s Guide',
    type: 'guide',
    description: 'Scorecard, Berkus, risk-factor summation, and DCF methods explained. How to negotiate your valuation without a finance degree.',
    thumbnail: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
    downloadUrl: '#', tags: ['fundraising, finance'], fileSize: '2.3 MB', format: 'PDF',
    downloads: 4100, journeyPhase: 9,
  },
  {
    id: 'r48', title: 'Cap Table Simulator',
    type: 'spreadsheet',
    description: 'Model dilution through multiple rounds. See exactly how much equity you keep after Seed, Series A, and Series B.',
    thumbnail: 'linear-gradient(135deg, #059669, #34d399)',
    downloadUrl: '#', tags: ['fundraising, finance'], fileSize: '860 KB', format: 'XLSX',
    downloads: 5670, journeyPhase: 9,
  },
  {
    id: 'r49', title: 'Investor Update Template',
    type: 'template',
    description: 'Monthly investor update format that actually gets read. KPIs, asks, wins, and learnings. Build trust with transparency.',
    thumbnail: 'linear-gradient(135deg, #2563eb, #60a5fa)',
    downloadUrl: '#', tags: ['fundraising, operations'], fileSize: '480 KB', format: 'PDF',
    downloads: 3890, journeyPhase: 9,
  },

  // ══════════════════════════════════════════════════════════════════
  // PHASE 10: Governance & The Infinite Game (Levels 101–110)
  // ══════════════════════════════════════════════════════════════════
  {
    id: 'r50', title: 'Board Deck Template',
    type: 'template',
    description: 'The exact board meeting format used by Series A+ companies. CEO update, financials, KPIs, strategic topics, and asks.',
    thumbnail: 'linear-gradient(135deg, #0d9488, #5eead4)',
    downloadUrl: '#', tags: ['governance, strategy'], fileSize: '1.7 MB', format: 'PPTX',
    downloads: 2670, journeyPhase: 10,
  },
  {
    id: 'r51', title: 'ESG & Impact Reporting Framework',
    type: 'guide',
    description: 'Environmental, social, and governance metrics that matter. B-Corp certification path and stakeholder capitalism playbook.',
    thumbnail: 'linear-gradient(135deg, #166534, #4ade80)',
    downloadUrl: '#', tags: ['governance, strategy'], fileSize: '3.1 MB', format: 'PDF',
    downloads: 1890, journeyPhase: 10,
  },
  {
    id: 'r52', title: 'Exit Strategy Decision Matrix',
    type: 'infographic',
    description: 'Visual guide: acquisition vs IPO vs stay-private-forever. Pros, cons, timelines, and founder outcome scenarios for each path.',
    thumbnail: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
    downloadUrl: '#', tags: ['governance, strategy'], fileSize: '950 KB', format: 'PDF',
    downloads: 3120, journeyPhase: 10,
  },
  {
    id: 'r53', title: 'Succession Planning Framework',
    type: 'template',
    description: 'Plan for founder transition. Role documentation, knowledge transfer, leadership pipeline, and emergency succession protocols.',
    thumbnail: 'linear-gradient(135deg, #64748b, #94a3b8)',
    downloadUrl: '#', tags: ['governance, culture'], fileSize: '680 KB', format: 'DOCX',
    downloads: 1450, journeyPhase: 10,
  },

  // ══════════════════════════════════════════════════════════════════
  // GENERAL / CROSS-CUTTING (Phase 0)
  // ══════════════════════════════════════════════════════════════════
  {
    id: 'r54', title: 'Founder Mental Health Playbook',
    type: 'guide',
    description: 'Burnout prevention, anxiety management, and the emotional rollercoaster of building a startup. Written by a clinical psychologist who coaches founders.',
    thumbnail: 'linear-gradient(135deg, #dc2626, #f87171)',
    downloadUrl: '#', tags: ['mental-health, wellness'], fileSize: '3.1 MB', format: 'PDF',
    downloads: 3156, journeyPhase: 0,
  },
  {
    id: 'r55', title: 'The Founder\'s Daily Routine Blueprint',
    type: 'infographic',
    description: 'Morning routines, deep work blocks, exercise, and sleep hygiene from 20+ successful founders. Customizable template included.',
    thumbnail: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
    downloadUrl: '#', tags: ['mental-health, productivity'], fileSize: '1.3 MB', format: 'PDF',
    downloads: 9230, journeyPhase: 0,
  },
  {
    id: 'r56', title: 'Networking Scripts for Introverts',
    type: 'cheatsheet',
    description: 'Byte-sized card: 10 conversation starters, 5 graceful exit lines, and a follow-up email template. Build your network without draining your battery.',
    thumbnail: 'linear-gradient(135deg, #8b5cf6, #c4b5fd)',
    downloadUrl: '#', tags: ['networking, growth'], fileSize: '310 KB', format: 'PDF',
    downloads: 6780, journeyPhase: 0,
  },
  {
    id: 'r57', title: 'Weekly Founder Review Template',
    type: 'template',
    description: '5-question weekly review: wins, lessons, gratitude, next week\'s #1 priority, and one thing to stop doing. Takes 15 minutes, changes everything.',
    thumbnail: 'linear-gradient(135deg, #ea580c, #fb923c)',
    downloadUrl: '#', tags: ['productivity, strategy'], fileSize: '380 KB', format: 'PDF',
    downloads: 7450, journeyPhase: 0,
  },
  {
    id: 'r58', title: 'Decision-Making Frameworks Pack',
    type: 'infographic',
    description: '5 frameworks on one page: Eisenhower Matrix, RAPID, SPADE, WRAP, and OODA Loop. Never suffer analysis paralysis again.',
    thumbnail: 'linear-gradient(135deg, #6366f1, #a5b4fc)',
    downloadUrl: '#', tags: ['strategy, productivity'], fileSize: '820 KB', format: 'PDF',
    downloads: 5340, journeyPhase: 0,
  },
  {
    id: 'r59', title: 'Customer Interview Script',
    type: 'template',
    description: '25 questions that uncover real pain points. Includes note-taking framework and insight synthesis templates.',
    thumbnail: 'linear-gradient(135deg, #166534, #4ade80)',
    downloadUrl: '#', tags: ['validation, customer-research'], fileSize: '540 KB', format: 'PDF',
    downloads: 2980, journeyPhase: 0,
  },
  {
    id: 'r60', title: 'Growth Metrics Dashboard',
    type: 'spreadsheet',
    description: 'North Star metric, pirate metrics (AARRR), cohort retention, and viral coefficient tracking. One spreadsheet to rule them all.',
    thumbnail: 'linear-gradient(135deg, #db2777, #f472b6)',
    downloadUrl: '#', tags: ['growth, analytics'], fileSize: '1.2 MB', format: 'XLSX',
    downloads: 4120, journeyPhase: 0,
  },

  // ══════════════════════════════════════════════════════════════════
  // MORE SOPS & TEMPLATES — Operations, Sales, Marketing, Hiring
  // ══════════════════════════════════════════════════════════════════

  // ── SOPs ────────────────────────────────────────────────────────
  {
    id: 'r61', title: 'SOP: Customer Onboarding Flow',
    type: 'template',
    description: 'End-to-end onboarding SOP: welcome email, kickoff call agenda, account setup checklist, 7-day/30-day check-in templates. Plug-and-play for SaaS, services, or agencies.',
    thumbnail: 'linear-gradient(135deg, #0d9488, #5eead4)',
    downloadUrl: '#', tags: ['operations, systems, sops'], fileSize: '1.4 MB', format: 'DOCX',
    downloads: 3870, journeyPhase: 7,
  },
  {
    id: 'r62', title: 'SOP: Content Publishing Pipeline',
    type: 'template',
    description: 'Complete content workflow: ideation → draft → review → SEO optimize → schedule → publish → repurpose. Roles, checklists, and SLAs per stage.',
    thumbnail: 'linear-gradient(135deg, #2563eb, #60a5fa)',
    downloadUrl: '#', tags: ['marketing, systems, sops'], fileSize: '1.1 MB', format: 'DOCX',
    downloads: 3120, journeyPhase: 3,
  },
  {
    id: 'r63', title: 'SOP: Sales Outreach Cadence',
    type: 'template',
    description: 'Multi-channel outreach SOP: LinkedIn → email → call → follow-up sequences. Templates for each touchpoint, CRM logging standards, and A/B test tracking.',
    thumbnail: 'linear-gradient(135deg, #059669, #34d399)',
    downloadUrl: '#', tags: ['sales, systems, sops'], fileSize: '980 KB', format: 'DOCX',
    downloads: 4560, journeyPhase: 4,
  },
  {
    id: 'r64', title: 'SOP: Bug Triage & Incident Response',
    type: 'template',
    description: 'Severity levels, escalation paths, incident commander role, post-mortem template, and SLA commitments. Keep your product stable while moving fast.',
    thumbnail: 'linear-gradient(135deg, #dc2626, #f87171)',
    downloadUrl: '#', tags: ['tech, systems, sops'], fileSize: '820 KB', format: 'DOCX',
    downloads: 2340, journeyPhase: 5,
  },
  {
    id: 'r65', title: 'SOP: Monthly Close & Financial Review',
    type: 'template',
    description: 'Step-by-step monthly close process: reconcile accounts, review P&L, update cash flow forecast, send investor update. For founders without a CFO.',
    thumbnail: 'linear-gradient(135deg, #ca8a04, #facc15)',
    downloadUrl: '#', tags: ['finance, systems, sops'], fileSize: '760 KB', format: 'DOCX',
    downloads: 2890, journeyPhase: 6,
  },
  {
    id: 'r66', title: 'SOP: Hiring & Interviewing Process',
    type: 'template',
    description: 'Full hiring SOP: job description template, sourcing channels, screening rubric, interview stages, reference check questions, and offer letter framework.',
    thumbnail: 'linear-gradient(135deg, #9333ea, #c084fc)',
    downloadUrl: '#', tags: ['hiring, systems, sops'], fileSize: '1.3 MB', format: 'DOCX',
    downloads: 5210, journeyPhase: 8,
  },
  {
    id: 'r67', title: 'SOP: Social Media Management',
    type: 'template',
    description: 'Daily/weekly social media SOP: content calendar, approval workflow, engagement monitoring, crisis communication, and analytics reporting cadence.',
    thumbnail: 'linear-gradient(135deg, #db2777, #f472b6)',
    downloadUrl: '#', tags: ['marketing, systems, sops'], fileSize: '1.5 MB', format: 'DOCX',
    downloads: 4430, journeyPhase: 3,
  },
  {
    id: 'r68', title: 'SOP: Customer Feedback Loop',
    type: 'template',
    description: 'Capture → categorize → prioritize → act → close the loop. NPS survey templates, feedback tagging taxonomy, and roadmap integration workflow.',
    thumbnail: 'linear-gradient(135deg, #6366f1, #a5b4fc)',
    downloadUrl: '#', tags: ['operations, customer-research, sops'], fileSize: '890 KB', format: 'DOCX',
    downloads: 1980, journeyPhase: 7,
  },

  // ── More Templates ──────────────────────────────────────────────
  {
    id: 'r69', title: 'Business Plan Template (Lean Format)',
    type: 'template',
    description: 'One-page lean business plan: problem, solution, market, business model, competitive advantage, milestones, and ask. No business-degree required.',
    thumbnail: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
    downloadUrl: '#', tags: ['ideation, strategy, templates'], fileSize: '620 KB', format: 'PDF',
    downloads: 7560, featured: true, journeyPhase: 1,
  },
  {
    id: 'r70', title: 'Client Proposal & SOW Template',
    type: 'template',
    description: 'Professional services proposal with scope of work, deliverables, timeline, pricing options, and terms. Close more deals with structured proposals.',
    thumbnail: 'linear-gradient(135deg, #b45389, #f9a8d4)',
    downloadUrl: '#', tags: ['sales, templates'], fileSize: '740 KB', format: 'DOCX',
    downloads: 4980, journeyPhase: 4,
  },
  {
    id: 'r71', title: 'Brand Identity & Style Guide Template',
    type: 'template',
    description: 'Logo usage, color palette, typography, imagery, voice & tone guidelines. A complete brand kit template to ensure consistency everywhere.',
    thumbnail: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
    downloadUrl: '#', tags: ['marketing, design, templates'], fileSize: '2.1 MB', format: 'PDF',
    downloads: 3810, journeyPhase: 3,
  },
  {
    id: 'r72', title: 'Investor Data Room Checklist',
    type: 'template',
    description: 'Complete data room structure: corporate docs, financials, product metrics, team bios, market research, IP portfolio. Exactly what VCs expect to see.',
    thumbnail: 'linear-gradient(135deg, #ef4444, #fca5a5)',
    downloadUrl: '#', tags: ['fundraising, legal, templates'], fileSize: '540 KB', format: 'PDF',
    downloads: 6230, journeyPhase: 9,
  },
  {
    id: 'r73', title: 'Meeting Agenda & Notes Template',
    type: 'template',
    description: 'Structured agenda builder: objectives, pre-reads, discussion items, decisions made, action items with owners. End meeting overload and actually ship.',
    thumbnail: 'linear-gradient(135deg, #ea580c, #fb923c)',
    downloadUrl: '#', tags: ['operations, productivity, templates'], fileSize: '380 KB', format: 'PDF',
    downloads: 8920, journeyPhase: 0,
  },
  {
    id: 'r74', title: 'Product Requirements Document (PRD)',
    type: 'template',
    description: 'PRD template: problem statement, user stories, acceptance criteria, success metrics, technical notes, and launch checklist. Align engineering and product.',
    thumbnail: 'linear-gradient(135deg, #2563eb, #60a5fa)',
    downloadUrl: '#', tags: ['product, templates'], fileSize: '560 KB', format: 'DOCX',
    downloads: 3670, journeyPhase: 5,
  },
  {
    id: 'r75', title: 'Contractor & Freelancer Agreement Pack',
    type: 'template',
    description: 'NDA, independent contractor agreement, SOW addendum, IP assignment clause, and payment terms. Protect your business when working with freelancers.',
    thumbnail: 'linear-gradient(135deg, #0891b2, #67e8f9)',
    downloadUrl: '#', tags: ['legal, templates'], fileSize: '910 KB', format: 'DOCX',
    downloads: 5430, journeyPhase: 6,
  },
];

// --- Helper functions ---

export function getResourceById(id: string): Resource | undefined {
  return resources.find((r) => r.id === id);
}

export function getResourcesByType(type: ResourceType | 'all'): Resource[] {
  if (type === 'all') return resources;
  return resources.filter((r) => r.type === type);
}

export function getResourcesByTag(tag: string): Resource[] {
  return resources.filter((r) => r.tags.includes(tag));
}

export function searchResources(query: string): Resource[] {
  const q = query.toLowerCase();
  return resources.filter(
    (r) =>
      r.title.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.tags.some((t) => t.toLowerCase().includes(q))
  );
}

export function getRelatedResources(id: string, limit = 3): Resource[] {
  const resource = getResourceById(id);
  if (!resource) return [];
  const others = resources.filter((r) => r.id !== id);
  // Score by shared tags
  const scored = others.map((r) => ({
    resource: r,
    score: r.tags.filter((t) => resource.tags.includes(t)).length,
  }));
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.resource);
}

export function getAllTags(): string[] {
  const tagSet = new Set<string>();
  resources.forEach((r) => r.tags.forEach((t) => tagSet.add(t)));
  return [...tagSet].sort();
}

export const resourceTypeLabels: Record<ResourceType | 'all', string> = {
  all: 'All',
  pdf: 'PDF',
  guide: 'Guide',
  template: 'Template',
  spreadsheet: 'Spreadsheet',
  ebook: 'eBook',
  infographic: 'Infographic',
  cheatsheet: 'Cheatsheet',
};

/** Phase names for filtering resources by journey phase */
export const journeyPhaseLabels: Record<number, string> = {
  0: 'General',
  1: 'Ideation & Alignment',
  2: 'Validation & Quick Wins',
  3: 'Guerilla Marketing & Launch',
  4: 'Sales Engine & CRM',
  5: 'Product & Tech',
  6: 'Legal, Finance & Admin',
  7: 'Operations & The Machine',
  8: 'Talent & Culture',
  9: 'Capital & Investment',
  10: 'Governance & The Infinite Game',
};

export function getResourcesByPhase(phase: number): Resource[] {
  if (phase === 0) return resources;
  return resources.filter((r) => r.journeyPhase === phase);
}

export function getFeaturedResources(): Resource[] {
  return resources.filter((r) => r.featured);
}
