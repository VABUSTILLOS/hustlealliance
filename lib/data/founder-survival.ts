// ── Founder Survival Dashboard — Types & Mock Data ──────────────────────

/** A single daily habit that can be checked off */
export interface DailyHabit {
  id: string;
  icon: string;
  title: string;
  description: string;
  /** Which Atomic Habits law this primarily satisfies */
  atomicLaw: 'make-it-obvious' | 'make-it-attractive' | 'make-it-easy' | 'make-it-satisfying';
  category: 'movement' | 'nutrition' | 'tech' | 'relationships' | 'finance' | 'recovery' | 'longevity';
}

/** A quest in the survival guide */
export interface SurvivalQuest {
  id: number;
  category: 'A' | 'B' | 'C';
  title: string;
  description: string;
  /** Gray-hat = ethically ambiguous / aggressive tactics */
  isGrayHat: boolean;
  /** Completion status: locked, available, completed */
  status: 'locked' | 'available' | 'completed';
  icon: string;
}

// ── DAILY HABITS ─────────────────────────────────────────────────────────

export const dailyHabits: DailyHabit[] = [
  {
    id: 'steps',
    icon: '👟',
    title: '15K–20K Steps',
    description: 'Split into one morning block (7.5K) and one evening block (7.5K). Walk outdoors for sunlight exposure.',
    atomicLaw: 'make-it-easy',
    category: 'movement',
  },
  {
    id: 'smoothie',
    icon: '🥤',
    title: 'Whole-Food Smoothie',
    description: 'Banana, strawberry, frozen mango, unsweetened natural cacao. No powders, no added sugars.',
    atomicLaw: 'make-it-obvious',
    category: 'nutrition',
  },
  {
    id: 'ai-workflow',
    icon: '🤖',
    title: '30min Agéntic Coding',
    description: 'Deploy local AI workflows using Cursor + Ollama. Ship at least one automation or improvement.',
    atomicLaw: 'make-it-attractive',
    category: 'tech',
  },
  {
    id: 'connection',
    icon: '💜',
    title: '1hr Phone-Free Connection',
    description: 'Strictly undistracted, phone-in-another-room connection time with Marisol.',
    atomicLaw: 'make-it-satisfying',
    category: 'relationships',
  },
  {
    id: 'cash-flow',
    icon: '💰',
    title: 'Daily Cash Flow Review',
    description: 'Review liquid cash flow, GBM portfolio balance, and digital bank yield rates (Nu, Klar, Mercado Pago).',
    atomicLaw: 'make-it-obvious',
    category: 'finance',
  },
  {
    id: 'wim-hof',
    icon: '❄️',
    title: 'Wim Hof + Cold Shower',
    description: '3 rounds of holotropic breathing followed by a 2-minute cold shower. Builds stress resilience.',
    atomicLaw: 'make-it-easy',
    category: 'recovery',
  },
  {
    id: 'eating-window',
    icon: '⏰',
    title: '10-Hour Eating Window',
    description: 'Strict intermittent fasting window. First meal no earlier than 10am, last meal no later than 8pm.',
    atomicLaw: 'make-it-obvious',
    category: 'nutrition',
  },
  {
    id: 'sunlight',
    icon: '☀️',
    title: 'Morning Sunlight (10–15min)',
    description: 'View natural sunlight outdoors within 30 minutes of waking. Sets circadian rhythm. No sunglasses.',
    atomicLaw: 'make-it-obvious',
    category: 'longevity',
  },
];

// ── SURVIVAL QUESTS ──────────────────────────────────────────────────────

export const survivalQuests: SurvivalQuest[] = [
  // ═══════════ CATEGORY A: Street-Smart Agency Survival ═══════════
  {
    id: 1,
    category: 'A',
    title: 'SAT Defense Shield',
    description:
      'Learn the 12 essential tax deductions for digital agencies in Mexico. Register under the correct régimen fiscal (RIF or RESICO). Set up automated factura generation for every client payment. Know exactly what the SAT can and cannot audit.',
    isGrayHat: false,
    status: 'available',
    icon: '🛡️',
  },
  {
    id: 2,
    category: 'A',
    title: 'The IMSS Trap',
    description:
      'Fair, legal registration for yourself and every agency employee. Avoid the "esquema mixto" (mixed scheme) trap that underreports salaries. Understand voluntary continuation and modalidad 40 for retirement maximization.',
    isGrayHat: false,
    status: 'available',
    icon: '🏥',
  },
  {
    id: 3,
    category: 'A',
    title: 'Retainer Fortress Contracts',
    description:
      'Structure retainer contracts with scope-of-work annexes, hard deliverables, kill fees, and mandatory renewal windows. Include IP ownership transfer clauses that activate ONLY on final payment.',
    isGrayHat: false,
    status: 'available',
    icon: '📜',
  },
  {
    id: 4,
    category: 'A',
    title: 'The Agéntic Workflow',
    description:
      'Wire up n8n with local open-source models (Llama 3, Mistral) via Ollama. Automate lead enrichment, proposal drafting, and client reporting. Zero API costs, zero data leaks.',
    isGrayHat: false,
    status: 'available',
    icon: '⚡',
  },
  {
    id: 5,
    category: 'A',
    title: 'Local AI: ComfyUI Rig',
    description:
      'Configure ComfyUI to run on an Acer Predator or Redmagic rig without thermal throttling. Use custom fan curves, undervolting via MSI Afterburner, and --lowvram flags for stable diffusion workflows.',
    isGrayHat: false,
    status: 'available',
    icon: '🖥️',
  },
  {
    id: 6,
    category: 'A',
    title: 'Eating Glass: Crisis Protocol',
    description:
      'When a client site gets hacked or a Meta ad account gets banned: (1) Do not panic, (2) Do not blame the team, (3) Execute the pre-written incident response checklist, (4) Communicate to client within 15 minutes with a clear timeline.',
    isGrayHat: false,
    status: 'available',
    icon: '🩸',
  },
  {
    id: 7,
    category: 'A',
    title: 'Time-Vampire Detection',
    description:
      'Spot a time-vampire client in 5 minutes flat. They: ask for discounts before seeing deliverables, send messages at 11pm expecting instant replies, and "just have one more small change." Price them out deliberately — double your rate.',
    isGrayHat: false,
    status: 'available',
    icon: '🧛',
  },
  {
    id: 8,
    category: 'A',
    title: 'Expired Domain Hijacking',
    description:
      'Identify high-authority expired domains (DA 40+) in your client niches. Purchase them, rebuild with relevant content, and 301-redirect the link juice to client SEO projects. Monitor with Ahrefs/Semrush.',
    isGrayHat: true,
    status: 'available',
    icon: '🏴‍☠️',
  },
  {
    id: 9,
    category: 'A',
    title: 'Weaponized Scope Creep',
    description:
      'When a bad client pushes beyond the contracted scope, do NOT push back. Let them breach. Document every request. After 3 breaches, invoke the contract termination clause and keep the deposit. This is legal — read your contract.',
    isGrayHat: true,
    status: 'available',
    icon: '⚔️',
  },

  // ═══════════ CATEGORY B: Financial Resilience ═══════════
  {
    id: 10,
    category: 'B',
    title: 'BS Spending Audit (Hammer Style)',
    description:
      'Print 3 months of bank statements. Highlight every delivery app charge, taquito run, and subscription you forgot about in red. Calculate the monthly bleed. Redirect that exact amount into an investment account.',
    isGrayHat: false,
    status: 'available',
    icon: '🔴',
  },
  {
    id: 11,
    category: 'B',
    title: 'High-Interest Debt Eradication',
    description:
      'Liquidate underperforming assets (stocks, crypto bags, collectibles). Kill every peso of credit card debt carrying >30% APR. Escape the Buró de Crédito death spiral. Zero consumer debt is the foundation.',
    isGrayHat: false,
    status: 'available',
    icon: '💀',
  },
  {
    id: 12,
    category: 'B',
    title: 'Fully-Funded Firewall',
    description:
      'Ladder 6 months of bare-bones living expenses across Nu, Klar, and Mercado Pago earning daily yield. Do not invest a single peso beyond this until the firewall is complete. This is your "f--k you" fund.',
    isGrayHat: false,
    status: 'available',
    icon: '🧱',
  },
  {
    id: 13,
    category: 'B',
    title: 'Sandwich Generation Reality Check',
    description:
      'Sit down with your parents. Trace their Afore balance, IMSS weeks contributed, and pension eligibility. Know their health status and expected care needs. Plan NOW — before cognitive or physical decline makes it impossible.',
    isGrayHat: false,
    status: 'available',
    icon: '🥪',
  },
  {
    id: 14,
    category: 'B',
    title: 'Family Loan Firewall Scripts',
    description:
      'Memorize these exact scripts for saying "no" to family money requests: "I\'m not in a position to help with that right now, but I can help you review your budget." / "My money is tied up in investments I can\'t touch." No guilt.',
    isGrayHat: false,
    status: 'available',
    icon: '🚫',
  },
  {
    id: 15,
    category: 'B',
    title: 'Hacking Infonavit & Mortgages',
    description:
      'Understand Infonavit co-financing, Cofinavit, and how to use your subcuenta de vivienda as a down payment. Calculate total cost of ownership including predial, maintenance, and opportunity cost of the down payment.',
    isGrayHat: false,
    status: 'available',
    icon: '🏠',
  },
  {
    id: 16,
    category: 'B',
    title: 'The 15% Annual Engine',
    description:
      'Rebalance your GBM portfolio across ETFs (VOO, QQQ, EEM), FIBRAs, and Cetes. Target: 15% annual return with a Sharpe ratio above 1.2. Rebalance quarterly. Track every peso. Compound interest is the 8th wonder.',
    isGrayHat: false,
    status: 'available',
    icon: '📈',
  },
  {
    id: 17,
    category: 'B',
    title: 'The EV Cash Strategy',
    description:
      'Calculate Mexican tax deductions for EVs: IVA accreditable, ISR deduction up to 175K MXN daily, no tenencia in most states. Run TCO for a Zeekr 8x vs financing a combustion car. Avoid crippling auto-loan interest.',
    isGrayHat: false,
    status: 'available',
    icon: '🚗',
  },

  // ═══════════ CATEGORY C: The Founder Blueprint (Biohacking) ═══════════
  {
    id: 18,
    category: 'C',
    title: 'The Hof Baseline',
    description:
      'Master 3 rounds of Wim Hof breathing (30 deep breaths + exhale hold). Follow immediately with 3 straight minutes of cold exposure. Track your breath-hold time weekly. The cold is your teacher — it never lies.',
    isGrayHat: false,
    status: 'available',
    icon: '🧊',
  },
  {
    id: 19,
    category: 'C',
    title: 'The Hadzovic Discipline',
    description:
      'Pre-plan 100% of weekly meals. Every calorie has a purpose — function or aesthetics. Zero unplanned calories. Meal prep Sunday. Track macros: 1.8g protein/kg bodyweight, 0.8g fat/kg, rest from complex carbs.',
    isGrayHat: false,
    status: 'available',
    icon: '🍱',
  },
  {
    id: 20,
    category: 'C',
    title: 'Hypertrophy & Structural Armor',
    description:
      'Commit to a bodybuilding resistance split (Push/Pull/Legs x2 per week). Build structural armor against desk posture: rear delts, rhomboids, glutes, core. Sitting is the new smoking — compensate aggressively.',
    isGrayHat: false,
    status: 'available',
    icon: '🏋️',
  },
  {
    id: 21,
    category: 'C',
    title: 'Cortisol Management: Two-Block Protocol',
    description:
      'Map optimal 15-minute and 30-minute walking routes near your workspace. When stress spikes (client emergency, deadline pressure), execute a Two-Block Step Protocol immediately. Walk, breathe, return. No phone.',
    isGrayHat: false,
    status: 'available',
    icon: '🚶',
  },
  {
    id: 22,
    category: 'C',
    title: 'Sleep: The Ultimate Metric',
    description:
      'Defend the 8-hour unnegotiable sleep window. Cool room (65-68°F / 18-20°C), pitch black, no screens 90min before bed. Track with Oura or Apple Watch. If sleep slips, everything else crumbles. Sleep is non-negotiable.',
    isGrayHat: false,
    status: 'available',
    icon: '🌙',
  },
  {
    id: 23,
    category: 'C',
    title: "Attia's Centenarian Decathlon",
    description:
      'Define the 10 physical tasks you want to perform at 100 years old. Examples: carry groceries up 3 flights of stairs, pick up a grandchild from the floor, hike 5km. Reverse-engineer your training to build that capacity NOW.',
    isGrayHat: false,
    status: 'available',
    icon: '🏆',
  },
  {
    id: 24,
    category: 'C',
    title: 'The Zone 2 Base',
    description:
      'Commit to 3–4 hours of steady-state Zone 2 cardio per week. Conversational pace, nasal breathing only. Builds mitochondrial density, improves insulin sensitivity, and extends healthspan. Rucking, incline walking, cycling.',
    isGrayHat: false,
    status: 'available',
    icon: '🫁',
  },
  {
    id: 25,
    category: 'C',
    title: 'The VO₂ Max Peak',
    description:
      'Execute one 30-minute maximum heart rate session per week. 4×4 intervals (4min at 90-95% max HR, 4min recovery, repeat 4x). VO₂ max is the single best predictor of all-cause mortality. Defend it like your life depends on it.',
    isGrayHat: false,
    status: 'available',
    icon: '💨',
  },
  {
    id: 26,
    category: 'C',
    title: 'NSDR: Dopamine Recharge',
    description:
      'Replace the afternoon caffeine crash with a 20-minute Yoga Nidra / NSDR protocol. Huberman Lab research confirms: NSDR replenishes dopamine reserves and accelerates motor skill learning. YouTube: "Yoga Nidra 20 min".',
    isGrayHat: false,
    status: 'available',
    icon: '🧘',
  },
];
