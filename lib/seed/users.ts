// lib/seed/users.ts — User profile definitions for community seeding
// Each user has a complete profile: bio, headline, avatar, role, tier, and interests.

export interface SeedUser {
  email: string;
  name: string;
  username: string;
  role: 'ADMIN' | 'INSTRUCTOR' | 'STUDENT';
  membershipTier: 'FREE' | 'BASIC' | 'PRO';
  avatar: string;
  bio: string;
  headline: string;
  industries: string[];
  skills: string[];
  location: string;
  joinedDaysAgo: number; // How many days ago they joined (for createdAt)
}

// Avatar helper — uses dicebear initials API with deterministic seeds
function av(name: string, bg: string = '7c3aed'): string {
  return `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=${bg}`;
}

// ── Hero Users (admins + instructors + top contributors) ──────────────────

export const heroUsers: SeedUser[] = [
  {
    email: 'admin@hustlealliance.com',
    name: 'Admin',
    username: 'admin',
    role: 'ADMIN',
    membershipTier: 'PRO',
    avatar: av('Admin', 'dc2626'),
    bio: 'Platform administrator and community shepherd. Building the infrastructure that powers founder success.',
    headline: 'Platform Steward @ Hustle Alliance',
    industries: ['Community', 'EdTech'],
    skills: ['Community Building', 'Platform Engineering'],
    location: 'San Francisco, CA',
    joinedDaysAgo: 185,
  },
  {
    email: 'marcus@hustlealliance.com',
    name: 'Marcus Chen',
    username: 'marcuschen',
    role: 'INSTRUCTOR',
    membershipTier: 'PRO',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=face',
    bio: 'GP at Horizon Ventures ($45M fund). Previously founded and sold TradeDesk to Thomson Reuters. Passionate about coaching first-time founders from non-traditional backgrounds.',
    headline: 'GP @ Horizon Ventures | 40+ Seed Rounds | Ex-Founder',
    industries: ['VC', 'SaaS', 'FinTech'],
    skills: ['Fundraising', 'Pitch Coaching', 'Term Sheets', 'Venture Capital'],
    location: 'New York, NY',
    joinedDaysAgo: 180,
  },
  {
    email: 'priya@hustlealliance.com',
    name: 'Priya Patel',
    username: 'priyap',
    role: 'INSTRUCTOR',
    membershipTier: 'PRO',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=face',
    bio: 'Scaled 3 startups from 0 to 100K+ users. Head of Growth at ScaleUp. Previously led growth at Intercom and Loom. Guest lecturer at Stanford GSB.',
    headline: 'Head of Growth @ ScaleUp | 3x 0→100K Users | Stanford GSB Lecturer',
    industries: ['SaaS', 'Consumer Tech', 'EdTech'],
    skills: ['Growth Marketing', 'SEO', 'Content Strategy', 'PLG', 'Community-Led Growth'],
    location: 'Austin, TX',
    joinedDaysAgo: 178,
  },
  {
    email: 'devon@hustlealliance.com',
    name: 'Devon Mitchell',
    username: 'devonm',
    role: 'INSTRUCTOR',
    membershipTier: 'PRO',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=96&h=96&fit=crop&crop=face',
    bio: 'Built Flux Studio to $2M ARR completely bootstrapped. Advises YC startups on product-led strategy. Revenue-funded from day one.',
    headline: 'CEO @ Flux Studio | Bootstrapped to $2M ARR | PLG Advisor',
    industries: ['SaaS', 'Design Tools', 'Developer Tools'],
    skills: ['Product-Led Growth', 'Bootstrapping', 'SaaS Metrics', 'Design Thinking'],
    location: 'Denver, CO',
    joinedDaysAgo: 177,
  },
  {
    email: 'sarah@hustlealliance.com',
    name: 'Sarah Okonkwo',
    username: 'sarahk',
    role: 'INSTRUCTOR',
    membershipTier: 'PRO',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=96&h=96&fit=crop&crop=face',
    bio: 'Scaled engineering teams at Google, Stripe, and two YC startups. Now building TalentBridge — making global talent accessible to startups.',
    headline: 'CEO @ TalentBridge | Ex-Google, Stripe | YC Alum',
    industries: ['HR Tech', 'SaaS', 'Developer Tools'],
    skills: ['Leadership', 'Engineering Management', 'Hiring', 'Team Scaling'],
    location: 'London, UK',
    joinedDaysAgo: 176,
  },
  {
    email: 'james@hustlealliance.com',
    name: 'James Okafor',
    username: 'jameso',
    role: 'STUDENT',
    membershipTier: 'PRO',
    avatar: av('James Okafor', 'dc2626'),
    bio: 'Nigerian fintech founder building Africa\'s Stripe. Previously built payments infra at Flutterwave. Passionate about financial inclusion across emerging markets.',
    headline: 'Founder @ PayBridge | Building payments infra for Africa',
    industries: ['FinTech', 'Emerging Markets'],
    skills: ['Payments', 'API Design', 'Financial Inclusion', 'Go-to-Market'],
    location: 'Lagos, Nigeria',
    joinedDaysAgo: 170,
  },
  {
    email: 'maya@hustlealliance.com',
    name: 'Maya Rodriguez',
    username: 'maya',
    role: 'STUDENT',
    membershipTier: 'PRO',
    avatar: av('Maya Rodriguez', '9333ea'),
    bio: 'Climate tech founder. Previously a climate data scientist at NASA JPL. Turning complex climate models into actionable business insights for SMEs.',
    headline: 'Founder @ CarbonClear | Climate Tech | Ex-NASA JPL',
    industries: ['Climate Tech', 'Sustainability', 'Data Science'],
    skills: ['Climate Science', 'Data Modeling', 'Carbon Accounting', 'B2B SaaS'],
    location: 'Los Angeles, CA',
    joinedDaysAgo: 169,
  },
  {
    email: 'alex@hustlealliance.com',
    name: 'Alex Kowalski',
    username: 'alexk',
    role: 'STUDENT',
    membershipTier: 'FREE',
    avatar: av('Alex Kowalski', 'ea580c'),
    bio: 'Serial founder. Built and sold a logistics SaaS to FleetCor for $12M. Now tackling hiring with ML. Stanford CS dropout turned 2x founder.',
    headline: 'Founder @ HireMind | AI-Powered Recruiting | 1x Exit',
    industries: ['HR Tech', 'AI/ML', 'SaaS'],
    skills: ['Machine Learning', 'NLP', 'Product Management', 'Fundraising'],
    location: 'San Francisco, CA',
    joinedDaysAgo: 168,
  },
  {
    email: 'elena@hustlealliance.com',
    name: 'Elena Kim',
    username: 'elenak',
    role: 'STUDENT',
    membershipTier: 'PRO',
    avatar: av('Elena Kim', '2563eb'),
    bio: 'Building the Canva for video editing. Raised $4M seed from a16z. Previously PM at Adobe and Figma. Obsessed with creative tools and design systems.',
    headline: 'CEO @ ClipForge | $4M Seed (a16z) | Ex-Adobe, Figma PM',
    industries: ['Creator Economy', 'SaaS', 'Design Tools'],
    skills: ['Product Strategy', 'UX Design', 'Creative Tools', 'Fundraising'],
    location: 'Brooklyn, NY',
    joinedDaysAgo: 165,
  },
  {
    email: 'david@hustlealliance.com',
    name: 'David Liu',
    username: 'davidl',
    role: 'STUDENT',
    membershipTier: 'BASIC',
    avatar: av('David Liu', '0d9488'),
    bio: 'Indie hacker building micro-SaaS products. Currently at $8K MRR across 3 products. Writing about the journey at indiehacker.io. Bootstrapped and profitable.',
    headline: 'Indie Hacker | $8K MRR across 3 micro-SaaS products',
    industries: ['SaaS', 'Indie Hacking', 'Developer Tools'],
    skills: ['Full-Stack Dev', 'Indie Hacking', 'SEO', 'Email Marketing'],
    location: 'Taipei, Taiwan',
    joinedDaysAgo: 160,
  },
  {
    email: 'maria@hustlealliance.com',
    name: 'Maria Torres',
    username: 'mariat',
    role: 'STUDENT',
    membershipTier: 'PRO',
    avatar: av('Maria Torres', 'ca8a04'),
    bio: 'Latina founder building procurement software for mid-market manufacturers. Former supply chain consultant at McKinsey. First-gen entrepreneur figuring it out as I go.',
    headline: 'CEO @ SupplyBridge | Procurement for Manufacturers | Ex-McKinsey',
    industries: ['Supply Chain', 'SaaS', 'Manufacturing'],
    skills: ['Supply Chain', 'Enterprise Sales', 'Operations', 'B2B SaaS'],
    location: 'Miami, FL',
    joinedDaysAgo: 158,
  },
  {
    email: 'tom@hustlealliance.com',
    name: 'Tom Baker',
    username: 'tomb',
    role: 'STUDENT',
    membershipTier: 'FREE',
    avatar: av('Tom Baker', '4f46e5'),
    bio: 'Technical co-founder building an open-source observability platform. Previously Staff Engineer at Datadog. Writing about system design and distributed systems.',
    headline: 'CTO @ TelemetryHub | Open-Source Observability | Ex-Datadog',
    industries: ['DevOps', 'Open Source', 'Developer Tools'],
    skills: ['Distributed Systems', 'Rust', 'Kubernetes', 'Open Source'],
    location: 'Berlin, Germany',
    joinedDaysAgo: 155,
  },
];

// ── Member Users (50 diverse profiles) ─────────────────────────────────────

export const memberUsers: SeedUser[] = [
  { email: 'anna@example.com', name: 'Anna Williams', username: 'annaw', role: 'STUDENT', membershipTier: 'FREE', avatar: av('Anna Williams', 'db2777'), bio: 'Product designer turned founder. Building a collaborative whiteboard tool for remote design sprints.', headline: 'Founder @ SprintBoard | Design Thinking for Remote Teams', industries: ['Design Tools', 'SaaS'], skills: ['Product Design', 'Figma', 'UX Research'], location: 'Portland, OR', joinedDaysAgo: 150 },
  { email: 'carlos@example.com', name: 'Carlos Mendez', username: 'carlosm', role: 'STUDENT', membershipTier: 'BASIC', avatar: av('Carlos Mendez', '059669'), bio: 'Building a neobank for freelancers in Latin America. Previously led engineering at Nubank Mexico.', headline: 'CEO @ FlexBank | Neobank for LatAm Freelancers | Ex-Nubank', industries: ['FinTech', 'Latin America'], skills: ['Banking', 'Mobile Dev', 'Growth'], location: 'Mexico City, MX', joinedDaysAgo: 148 },
  { email: 'fatima@example.com', name: 'Fatima Al-Rashid', username: 'fatimaa', role: 'STUDENT', membershipTier: 'PRO', avatar: av('Fatima A', 'b45309'), bio: 'EdTech founder building AI-powered tutoring for STEM students. PhD dropout from MIT. On a mission to democratize quality education.', headline: 'Founder @ TutorMind | AI Tutoring for STEM | MIT Dropout', industries: ['EdTech', 'AI/ML'], skills: ['AI', 'NLP', 'Education', 'Mobile Apps'], location: 'Dubai, UAE', joinedDaysAgo: 145 },
  { email: 'ryan@example.com', name: 'Ryan Park', username: 'ryanp', role: 'STUDENT', membershipTier: 'FREE', avatar: av('Ryan Park', '0891b2'), bio: 'Former FAANG engineer. Now building developer tools for the Web3 space. Currently pre-revenue but have 2K GitHub stars.', headline: 'Founder @ ChainKit | Web3 Developer Tools | Ex-FAANG', industries: ['Web3', 'Developer Tools'], skills: ['Solidity', 'Rust', 'TypeScript', 'DevRel'], location: 'Seattle, WA', joinedDaysAgo: 143 },
  { email: 'yuki@example.com', name: 'Yuki Tanaka', username: 'yukit', role: 'STUDENT', membershipTier: 'BASIC', avatar: av('Yuki Tanaka', 'c026d3'), bio: 'Building Japan\'s first vertical SaaS for restaurant supply chains. 2nd-time founder, first venture failed spectacularly — learned more from that than any MBA.', headline: 'CEO @ TableLink | Restaurant Supply Chain SaaS | 2x Founder', industries: ['SaaS', 'Food Tech', 'Supply Chain'], skills: ['B2B Sales', 'Supply Chain', 'Japanese Market'], location: 'Tokyo, Japan', joinedDaysAgo: 140 },
  { email: 'olivia@example.com', name: 'Olivia Chen', username: 'oliviac', role: 'STUDENT', membershipTier: 'PRO', avatar: av('Olivia Chen', 'e11d48'), bio: 'Health tech founder. Building an at-home hormone testing platform for women. Raised $2M from female-founded VC funds.', headline: 'CEO @ Hormona | At-Home Women\'s Health Testing | $2M Raised', industries: ['Health Tech', 'FemTech', 'D2C'], skills: ['Healthcare', 'D2C', 'Regulatory', 'Brand Building'], location: 'Boston, MA', joinedDaysAgo: 138 },
  { email: 'kwame@example.com', name: 'Kwame Asante', username: 'kwamea', role: 'STUDENT', membershipTier: 'FREE', avatar: av('Kwame Asante', '65a30d'), bio: 'Building logistics infrastructure for African e-commerce. Last-mile delivery is broken — we\'re fixing it one neighborhood at a time.', headline: 'Founder @ DashShip | Last-Mile Delivery for African E-Commerce', industries: ['Logistics', 'E-Commerce', 'Africa'], skills: ['Logistics', 'Operations', 'Mobile Money'], location: 'Accra, Ghana', joinedDaysAgo: 135 },
  { email: 'sofia@example.com', name: 'Sofia Lindqvist', username: 'sofial', role: 'STUDENT', membershipTier: 'BASIC', avatar: av('Sofia Lindqvist', '0ea5e9'), bio: 'Swedish climate activist turned founder. Building a marketplace for verified carbon offsets. Transparency is our competitive advantage.', headline: 'CEO @ OffsetMarket | Verified Carbon Offset Marketplace', industries: ['Climate Tech', 'Marketplace', 'Sustainability'], skills: ['Sustainability', 'Marketplace', 'Blockchain'], location: 'Stockholm, Sweden', joinedDaysAgo: 133 },
  { email: 'raj@example.com', name: 'Raj Patel', username: 'rajp', role: 'STUDENT', membershipTier: 'FREE', avatar: av('Raj Patel', 'f97316'), bio: 'Solo founder building in the AI agent space. Shipping weekly. Failed 3 startups before this one — but the learning compounds.', headline: 'Solo Founder @ AgentForge | AI Agents for SMBs | 4th Attempt', industries: ['AI/ML', 'SaaS'], skills: ['LLMs', 'Python', 'Solo Founding', 'Growth Hacking'], location: 'Bangalore, India', joinedDaysAgo: 130 },
  { email: 'hannah@example.com', name: 'Hannah Weiss', username: 'hannahw', role: 'STUDENT', membershipTier: 'PRO', avatar: av('Hannah Weiss', 'a855f7'), bio: 'Building the operating system for independent therapists. Previously a licensed therapist who got fed up with terrible practice management software.', headline: 'CEO @ TherapyOS | Practice Management for Therapists | LMFT', industries: ['Health Tech', 'SaaS', 'SMB'], skills: ['Healthcare', 'UX Design', 'SaaS Metrics'], location: 'Chicago, IL', joinedDaysAgo: 128 },
  { email: 'omar@example.com', name: 'Omar Hassan', username: 'omarh', role: 'STUDENT', membershipTier: 'FREE', avatar: av('Omar Hassan', '84cc16'), bio: 'Building a WhatsApp-native CRM for small businesses in the Middle East. Everyone\'s on WhatsApp — why aren\'t CRMs?', headline: 'Founder @ ChatCRM | WhatsApp-Native CRM for MENA SMBs', industries: ['SaaS', 'MENA', 'SMB'], skills: ['WhatsApp API', 'Arabic Market', 'SMB Sales'], location: 'Cairo, Egypt', joinedDaysAgo: 125 },
  { email: 'luna@example.com', name: 'Luna Park', username: 'lunap', role: 'STUDENT', membershipTier: 'BASIC', avatar: av('Luna Park', 'd946ef'), bio: 'Gen Z founder building a social commerce platform for digital fashion. First employee at a YC startup that IPO\'d. Now building my own thing.', headline: 'CEO @ WearDigital | Social Commerce for Digital Fashion | YC Alum', industries: ['E-Commerce', 'Creator Economy', 'Web3'], skills: ['Social Media', 'Community', 'Fashion Tech'], location: 'Los Angeles, CA', joinedDaysAgo: 122 },
  { email: 'viktor@example.com', name: 'Viktor Petrov', username: 'viktorp', role: 'STUDENT', membershipTier: 'FREE', avatar: av('Viktor Petrov', '64748b'), bio: 'Ukrainian founder building cybersecurity tools for SMBs. Bootstrapping from Kyiv. The resilience of our team is our superpower.', headline: 'CTO @ ShieldStack | SMB Cybersecurity | Built from Kyiv 🇺🇦', industries: ['Cybersecurity', 'SaaS', 'SMB'], skills: ['Security', 'DevOps', 'Go'], location: 'Kyiv, Ukraine', joinedDaysAgo: 120 },
  { email: 'jiwoo@example.com', name: 'Jiwoo Kim', username: 'jiwook', role: 'STUDENT', membershipTier: 'PRO', avatar: av('Jiwoo Kim', 'ec4899'), bio: 'Building an AI copilot for patent attorneys. My father is a patent lawyer — I grew up watching him drown in paperwork. AI can fix this.', headline: 'CEO @ PatentAI | AI Copilot for IP Lawyers | 2nd Gen Founder', industries: ['Legal Tech', 'AI/ML'], skills: ['NLP', 'Legal Tech', 'B2B SaaS'], location: 'Seoul, South Korea', joinedDaysAgo: 118 },
  { email: 'amelia@example.com', name: 'Amelia Brooks', username: 'ameliab', role: 'STUDENT', membershipTier: 'FREE', avatar: av('Amelia Brooks', '06b6d4'), bio: 'Former journalist building a platform to help newsrooms adopt AI responsibly. Media is in crisis — tech can help, but it has to be ethical.', headline: 'Founder @ NewsPilot | Ethical AI for Newsrooms | Ex-NYT Journalist', industries: ['Media', 'AI/ML', 'Journalism'], skills: ['Journalism', 'AI Ethics', 'Product'], location: 'Washington, DC', joinedDaysAgo: 115 },
  { email: 'kenji@example.com', name: 'Kenji Nakamura', username: 'kenjin', role: 'STUDENT', membershipTier: 'BASIC', avatar: av('Kenji Nakamura', '14b8a6'), bio: 'Robotics engineer building autonomous inventory drones for warehouses. Spent 5 years at Boston Dynamics. Now applying that tech to logistics.', headline: 'Founder @ DroneStock | Autonomous Warehouse Drones | Ex-Boston Dynamics', industries: ['Robotics', 'Logistics', 'Hard Tech'], skills: ['Robotics', 'Computer Vision', 'Hardware'], location: 'Pittsburgh, PA', joinedDaysAgo: 112 },
  { email: 'zara@example.com', name: 'Zara Osei', username: 'zarao', role: 'STUDENT', membershipTier: 'PRO', avatar: av('Zara Osei', 'f43f5e'), bio: 'Building a beauty-tech platform that matches skincare products to your DNA. Raised $1.5M pre-seed. Beauty industry is $500B — and 90% of it is guesswork.', headline: 'CEO @ DermaMatch | DNA-Based Skincare Matching | $1.5M Pre-Seed', industries: ['Beauty Tech', 'Health Tech', 'D2C'], skills: ['Genomics', 'D2C', 'Brand', 'Fundraising'], location: 'Atlanta, GA', joinedDaysAgo: 110 },
  { email: 'nadia@example.com', name: 'Nadia Petrova', username: 'nadiap', role: 'STUDENT', membershipTier: 'FREE', avatar: av('Nadia Petrova', '8b5cf6'), bio: 'Building a platform that helps developers monetize their APIs. The API economy is growing 3x faster than the rest of SaaS.', headline: 'Founder @ APIStarter | Monetize Your APIs | Developer Economy', industries: ['Developer Tools', 'API Economy'], skills: ['API Design', 'Developer Marketing', 'Pricing'], location: 'Amsterdam, NL', joinedDaysAgo: 108 },
  { email: 'leo@example.com', name: 'Leo Fernandez', username: 'leof', role: 'STUDENT', membershipTier: 'BASIC', avatar: av('Leo Fernandez', 'ca8a04'), bio: 'Building tools for remote engineering teams. Async-first collaboration is the future. Previously eng manager at GitLab (all-remote since 2014).', headline: 'CEO @ AsyncDev | Tools for Remote Engineering Teams | Ex-GitLab EM', industries: ['Developer Tools', 'Remote Work', 'SaaS'], skills: ['Remote Culture', 'Engineering Mgmt', 'DevTools'], location: 'Barcelona, Spain', joinedDaysAgo: 105 },
  { email: 'anya@example.com', name: 'Anya Sharma', username: 'anyas', role: 'STUDENT', membershipTier: 'PRO', avatar: av('Anya Sharma', '7c3aed'), bio: 'Building vertical AI for construction. Our computer vision models catch defects before they become $100K problems. Hard tech, harder problems.', headline: 'CEO @ BuildSight | Computer Vision for Construction Sites', industries: ['Construction Tech', 'AI/ML', 'Hard Tech'], skills: ['Computer Vision', 'Construction', 'Enterprise Sales'], location: 'Toronto, Canada', joinedDaysAgo: 103 },
  { email: 'felix@example.com', name: 'Felix Bauer', username: 'felixb', role: 'STUDENT', membershipTier: 'FREE', avatar: av('Felix Bauer', '78716c'), bio: 'Building the GitHub for music production. Version control for audio files, collaborative mixing, and AI-powered mastering.', headline: 'Founder @ TrackBase | Git for Music Producers | Musician + Coder', industries: ['Music Tech', 'Developer Tools', 'Creator Economy'], skills: ['Audio Engineering', 'Web Audio', 'Collaboration'], location: 'Berlin, Germany', joinedDaysAgo: 100 },
  { email: 'priyanka@example.com', name: 'Priyanka Das', username: 'priyankad', role: 'STUDENT', membershipTier: 'BASIC', avatar: av('Priyanka Das', 'db2777'), bio: 'Former Uber ops lead. Now building an EV charging network for apartment buildings in India. 80% of Indians live in apartments with no charging access.', headline: 'CEO @ ChargeUp | EV Charging for Apartments | Ex-Uber Ops', industries: ['CleanTech', 'EV', 'India'], skills: ['Operations', 'Hardware', 'Government Relations'], location: 'Mumbai, India', joinedDaysAgo: 98 },
  { email: 'max@example.com', name: 'Max Andersson', username: 'maxa', role: 'STUDENT', membershipTier: 'FREE', avatar: av('Max Andersson', '0284c7'), bio: '16-year-old founder building an AI tutor for high school math. Launched on Product Hunt and got 500 signups in 24 hours. Age is just a number.', headline: '16yo Founder @ MathBot | AI Math Tutor | 500 Users in 24h on PH', industries: ['EdTech', 'AI/ML'], skills: ['React', 'Python', 'GPT', 'Growth'], location: 'Oslo, Norway', joinedDaysAgo: 95 },
  { email: 'isabelle@example.com', name: 'Isabelle Moreau', username: 'isabellem', role: 'STUDENT', membershipTier: 'PRO', avatar: av('Isabelle Moreau', 'be185d'), bio: 'Luxury fashion buyer turned tech founder. Building B2B wholesale platform connecting independent designers with boutiques.', headline: 'Founder @ MaisonTrade | B2B Wholesale for Indie Fashion | Ex-LVMH', industries: ['Fashion Tech', 'Marketplace', 'B2B'], skills: ['Fashion', 'Marketplace', 'B2B Sales'], location: 'Paris, France', joinedDaysAgo: 93 },
  { email: 'cam@example.com', name: 'Cam Nguyen', username: 'camn', role: 'STUDENT', membershipTier: 'FREE', avatar: av('Cam Nguyen', 'ea580c'), bio: 'Building a platform for fractional work in tech. The future of work isn\'t full-time or freelance — it\'s fractional. Previously Head of Eng at a Series B startup.', headline: 'CEO @ Fraction | Fractional Tech Jobs Platform | Ex-Head of Eng', industries: ['Future of Work', 'Marketplace', 'HR Tech'], skills: ['Engineering Leadership', 'Marketplace Dynamics', 'Future of Work'], location: 'Ho Chi Minh City, VN', joinedDaysAgo: 90 },
  { email: 'grace@example.com', name: 'Grace Okafor', username: 'graceo', role: 'STUDENT', membershipTier: 'BASIC', avatar: av('Grace Okafor', '22c55e'), bio: 'James\'s sister, building my own thing! Creating a peer-to-peer lending platform for Nigerian SMEs. Banks reject 80% of small business loan applications — we\'re changing that.', headline: 'CEO @ LendCircle | P2P Lending for Nigerian SMEs', industries: ['FinTech', 'Africa', 'Lending'], skills: ['FinTech', 'Risk Modeling', 'Community'], location: 'Abuja, Nigeria', joinedDaysAgo: 88 },
  { email: 'dmitri@example.com', name: 'Dmitri Volkov', username: 'dmitriv', role: 'STUDENT', membershipTier: 'PRO', avatar: av('Dmitri Volkov', '334155'), bio: 'Ex-Yandex ML engineer. Building privacy-preserving analytics for healthcare. Differential privacy meets clinical trials.', headline: 'CTO @ PrivAnalytics | Privacy-Preserving Health Analytics | Ex-Yandex', industries: ['Health Tech', 'Privacy', 'AI/ML'], skills: ['ML', 'Privacy', 'Healthcare', 'Rust'], location: 'Tbilisi, Georgia', joinedDaysAgo: 85 },
  { email: 'mei@example.com', name: 'Mei Lin', username: 'meil', role: 'STUDENT', membershipTier: 'FREE', avatar: av('Mei Lin', 'd946ef'), bio: 'Building a cross-border payments API for Southeast Asian e-commerce. SEA is the fastest-growing e-com region — but payments are a mess across borders.', headline: 'Founder @ CrossPay | Cross-Border Payments API for SEA', industries: ['FinTech', 'SEA', 'E-Commerce'], skills: ['Payments', 'API Design', 'Regional Expansion'], location: 'Singapore', joinedDaysAgo: 83 },
  { email: 'hasan@example.com', name: 'Hasan Yilmaz', username: 'hasany', role: 'STUDENT', membershipTier: 'BASIC', avatar: av('Hasan Yilmaz', 'b91c1c'), bio: 'Building AI-powered crop monitoring for smallholder farmers. Computer vision + satellite imagery to detect disease before it spreads.', headline: 'Founder @ CropVision | AI Crop Monitoring for Small Farmers', industries: ['AgriTech', 'AI/ML', 'Emerging Markets'], skills: ['Computer Vision', 'Satellite Imagery', 'IoT'], location: 'Istanbul, Turkey', joinedDaysAgo: 80 },
  { email: 'chiara@example.com', name: 'Chiara Rossi', username: 'chiarar', role: 'STUDENT', membershipTier: 'PRO', avatar: av('Chiara Rossi', 'c084fc'), bio: 'Building an AI writing assistant for non-native English speakers. 1.5 billion people speak English as a second language — they deserve better tools.', headline: 'CEO @ WriteWell | AI Writing for ESL Speakers | 1.5B Market', industries: ['EdTech', 'AI/ML', 'Writing'], skills: ['NLP', 'UX Writing', 'Internationalization'], location: 'Milan, Italy', joinedDaysAgo: 78 },
  { email: 'tong@example.com', name: 'Tong Wei', username: 'tongw', role: 'STUDENT', membershipTier: 'FREE', avatar: av('Tong Wei', '0ea5e9'), bio: 'Hardware engineer building affordable brain-computer interfaces for accessibility. Currently in stealth. The next computing platform is neural.', headline: 'Founder @ NeuralKey | Affordable BCI for Accessibility | Stealth', industries: ['Deep Tech', 'Health Tech', 'Accessibility'], skills: ['Hardware', 'Signal Processing', 'Neuroscience'], location: 'Shenzhen, China', joinedDaysAgo: 75 },
  { email: 'aspen@example.com', name: 'Aspen Wright', username: 'aspenw', role: 'STUDENT', membershipTier: 'FREE', avatar: av('Aspen Wright', '84cc16'), bio: 'Building the operating system for outdoor adventure guides. Climbers, kayakers, ski instructors — they all need scheduling, payments, and liability waivers.', headline: 'Founder @ GuideOS | Business Tools for Outdoor Guides', industries: ['Vertical SaaS', 'Outdoor Industry'], skills: ['SaaS', 'SMB Sales', 'Payments'], location: 'Boulder, CO', joinedDaysAgo: 73 },
  { email: 'karim@example.com', name: 'Karim Benali', username: 'karimb', role: 'STUDENT', membershipTier: 'BASIC', avatar: av('Karim Benali', '92400e'), bio: 'Data engineer building an open-source alternative to Fivetran. ELT pipelines shouldn\'t cost $10K/month for startups.', headline: 'Founder @ PipeFlow | Open-Source ELT Alternative to Fivetran', industries: ['Data Infrastructure', 'Open Source'], skills: ['Data Engineering', 'Rust', 'Apache Spark'], location: 'Paris, France', joinedDaysAgo: 70 },
  { email: 'mira@example.com', name: 'Mira Joshi', username: 'miraj', role: 'STUDENT', membershipTier: 'PRO', avatar: av('Mira Joshi', 'a21caf'), bio: 'Building a platform that helps creators run cohort-based courses. The future of education is small groups + accountability — not recorded lectures.', headline: 'CEO @ CohortKit | Platform for Cohort-Based Courses | Creator Economy', industries: ['EdTech', 'Creator Economy'], skills: ['EdTech', 'Community', 'No-Code'], location: 'Delhi, India', joinedDaysAgo: 68 },
  { email: 'erik@example.com', name: 'Erik Johansson', username: 'erikj', role: 'STUDENT', membershipTier: 'FREE', avatar: av('Erik Johansson', '0369a1'), bio: 'Game developer turned SaaS founder. Building analytics for game studios. Gamers generate petabytes of behavioral data — most studios don\'t know what to do with it.', headline: 'CTO @ GamePulse | Analytics for Game Studios | Ex-Unity Engineer', industries: ['Gaming', 'Analytics', 'SaaS'], skills: ['Game Dev', 'Data Engineering', 'Unity'], location: 'Malmö, Sweden', joinedDaysAgo: 65 },
  { email: 'tosin@example.com', name: 'Tosin Adebayo', username: 'tosina', role: 'STUDENT', membershipTier: 'FREE', avatar: av('Tosin Adebayo', '16a34a'), bio: 'Ex-investment banker building automated financial models for African startups. Most founders can\'t afford a CFO — our AI fills that gap.', headline: 'Founder @ ModelAI | Automated Financial Models for African Startups', industries: ['FinTech', 'AI/ML', 'Africa'], skills: ['Financial Modeling', 'AI', 'Startup Finance'], location: 'Nairobi, Kenya', joinedDaysAgo: 63 },
  { email: 'sam@example.com', name: 'Sam O\'Brien', username: 'samo', role: 'STUDENT', membershipTier: 'BASIC', avatar: av('Sam OBrien', '854d0e'), bio: 'Building a marketplace connecting indie authors with professional editors. Self-publishing is a $10B market — but the editing process is stuck in 2005.', headline: 'CEO @ EditMatch | Editing Marketplace for Indie Authors | $10B Market', industries: ['Publishing', 'Marketplace', 'Creator Economy'], skills: ['Marketplace', 'Publishing', 'Community'], location: 'Dublin, Ireland', joinedDaysAgo: 60 },
  { email: 'lucia@example.com', name: 'Lucia Vargas', username: 'luciav', role: 'STUDENT', membershipTier: 'PRO', avatar: av('Lucia Vargas', 'ec4899'), bio: 'Building telemedicine infrastructure for rural Latin America. 40% of LatAm\'s population lives more than 2 hours from a hospital. We\'re closing that gap.', headline: 'CEO @ MediConnect | Telemedicine for Rural Latin America', industries: ['Health Tech', 'Latin America', 'Telecom'], skills: ['Telemedicine', 'Mobile Health', 'Government Partnerships'], location: 'Bogotá, Colombia', joinedDaysAgo: 58 },
  { email: 'arjun@example.com', name: 'Arjun Mehta', username: 'arjunm', role: 'STUDENT', membershipTier: 'FREE', avatar: av('Arjun Mehta', '0d9488'), bio: 'Second-time founder. First startup was a food delivery app that failed. Now building an AI-powered nutrition coach. Learning from failure is underrated.', headline: 'Founder @ NutriAI | AI Nutrition Coach | 2nd Attempt After Failure', industries: ['Health Tech', 'AI/ML', 'Consumer'], skills: ['Mobile Apps', 'AI', 'Pivoting'], location: 'Pune, India', joinedDaysAgo: 55 },
  { email: 'leila@example.com', name: 'Leila Haddad', username: 'leilah', role: 'STUDENT', membershipTier: 'BASIC', avatar: av('Leila Haddad', 'b45309'), bio: 'Building a compliance automation platform for crypto startups. Regulations are changing weekly — manual compliance doesn\'t scale.', headline: 'CEO @ RegChain | Crypto Compliance Automation | Ex-Binance Legal', industries: ['RegTech', 'Crypto', 'SaaS'], skills: ['Compliance', 'Blockchain', 'Regulatory'], location: 'Dubai, UAE', joinedDaysAgo: 53 },
  { email: 'haruki@example.com', name: 'Haruki Sato', username: 'harukis', role: 'STUDENT', membershipTier: 'FREE', avatar: av('Haruki Sato', '2563eb'), bio: 'Building a platform that helps Japanese artisans sell globally. Japan has 1,000+ year-old craft traditions — but most artisans don\'t speak English or do e-commerce.', headline: 'Founder @ WazaMarket | Global E-Commerce for Japanese Artisans', industries: ['E-Commerce', 'Japan', 'Cultural Heritage'], skills: ['Cross-Border E-Com', 'Japanese Market', 'Logistics'], location: 'Kyoto, Japan', joinedDaysAgo: 50 },
  { email: 'noor@example.com', name: 'Noor Ali', username: 'noora', role: 'STUDENT', membershipTier: 'PRO', avatar: av('Noor Ali', '9333ea'), bio: 'Building a mental health platform for the Muslim community. Culturally competent therapy is not optional — it\'s essential.', headline: 'Founder @ Salam | Mental Health for Muslim Communities', industries: ['Health Tech', 'Community', 'Social Impact'], skills: ['Mental Health', 'Community Building', 'Mobile Apps'], location: 'London, UK', joinedDaysAgo: 48 },
  { email: 'mateo@example.com', name: 'Mateo Garcia', username: 'mateog', role: 'STUDENT', membershipTier: 'FREE', avatar: av('Mateo Garcia', 'dc2626'), bio: 'Former pro gamer building tools for esports coaches. VOD review takes hours — our AI does it in minutes with match highlights and strategy breakdowns.', headline: 'CEO @ StratBot | AI-Powered Esports Coaching | Ex-Pro Gamer', industries: ['Gaming', 'AI/ML', 'Sports Tech'], skills: ['Esports', 'Computer Vision', 'SaaS'], location: 'Madrid, Spain', joinedDaysAgo: 45 },
  { email: 'lina@example.com', name: 'Lina Bergström', username: 'linab', role: 'STUDENT', membershipTier: 'BASIC', avatar: av('Lina Bergstrom', '059669'), bio: 'Building an AI fact-checking browser extension. Misinformation is a public health crisis. We\'re building the antidote — one claim at a time.', headline: 'Founder @ FactGuard | AI Fact-Checking Browser Extension', industries: ['Media Tech', 'AI/ML', 'Consumer'], skills: ['NLP', 'Browser Extensions', 'Fact-Checking'], location: 'Copenhagen, Denmark', joinedDaysAgo: 43 },
  { email: 'tyrone@example.com', name: 'Tyrone Jackson', username: 'tyronej', role: 'STUDENT', membershipTier: 'FREE', avatar: av('Tyrone Jackson', 'ea580c'), bio: 'Building a platform connecting Black founders with angel investors. Only 1% of VC funding goes to Black founders — we\'re building our own table.', headline: 'Founder @ BlackSeed | Connecting Black Founders to Angel Investors', industries: ['FinTech', 'DEI', 'Marketplace'], skills: ['Fundraising', 'Community', 'Matchmaking'], location: 'Detroit, MI', joinedDaysAgo: 40 },
  { email: 'sakura@example.com', name: 'Sakura Yamamoto', username: 'sakuray', role: 'STUDENT', membershipTier: 'PRO', avatar: av('Sakura Yamamoto', 'db2777'), bio: 'Building an anime-style avatar platform for virtual meetings. Remote work is here to stay — why look at boring rectangles when you can be an anime character?', headline: 'CEO @ VAvatar | Anime Avatars for Virtual Meetings | $500K ARR', industries: ['Remote Work', 'Entertainment', 'Consumer'], skills: ['3D Graphics', 'WebRTC', 'Consumer Apps'], location: 'Tokyo, Japan', joinedDaysAgo: 38 },
  { email: 'ibrahim@example.com', name: 'Ibrahim Khoury', username: 'ibrahimk', role: 'STUDENT', membershipTier: 'BASIC', avatar: av('Ibrahim Khoury', '78716c'), bio: 'Building real-time translation for Arabic dialects in business settings. MSA ≠ spoken Arabic. Our AI bridges the gap for business communication.', headline: 'CEO @ DialectBridge | Arabic Dialect Translation for Business', industries: ['AI/ML', 'Language Tech', 'MENA'], skills: ['NLP', 'Arabic Linguistics', 'B2B'], location: 'Amman, Jordan', joinedDaysAgo: 35 },
  { email: 'chantal@example.com', name: 'Chantal Mukamana', username: 'chantalm', role: 'STUDENT', membershipTier: 'FREE', avatar: av('Chantal Mukamana', 'ca8a04'), bio: 'Building mobile micro-insurance for East African farmers. Crop insurance shouldn\'t require paperwork — just a basic phone and a growing season.', headline: 'Founder @ FarmShield | Mobile Crop Insurance for East Africa', industries: ['InsurTech', 'AgriTech', 'Africa'], skills: ['Micro-Insurance', 'Mobile Money', 'Agriculture'], location: 'Kigali, Rwanda', joinedDaysAgo: 33 },
  { email: 'jonas@example.com', name: 'Jonas Mueller', username: 'jonasm', role: 'STUDENT', membershipTier: 'PRO', avatar: av('Jonas Mueller', '0284c7'), bio: 'Building privacy-first analytics for Shopify stores. GA4 is overkill for most merchants — and the privacy concerns are real. GDPR-native analytics from day one.', headline: 'CEO @ ShopMetrics | Privacy-First Analytics for Shopify', industries: ['E-Commerce', 'Analytics', 'Privacy'], skills: ['Analytics', 'Shopify Ecosystem', 'Privacy'], location: 'Munich, Germany', joinedDaysAgo: 30 },
  { email: 'aisha@example.com', name: 'Aisha Bello', username: 'aishab', role: 'STUDENT', membershipTier: 'FREE', avatar: av('Aisha Bello', '7c3aed'), bio: 'Doctor building a platform to help African diaspora send healthcare to their families back home. Remittances are $50B/year — let\'s channel some to health.', headline: 'Founder @ HealthWire | Healthcare Remittances for African Diaspora | MD', industries: ['Health Tech', 'FinTech', 'Africa'], skills: ['Medicine', 'Remittances', 'Mobile'], location: 'Houston, TX', joinedDaysAgo: 28 },
];

// ── Novice Users (recent joiners, low activity) ────────────────────────────

export const noviceUsers: SeedUser[] = [
  { email: 'novice1@example.com', name: 'Taylor Reed', username: 'taylorr', role: 'STUDENT', membershipTier: 'FREE', avatar: av('Taylor Reed', '94a3b8'), bio: 'Just getting started. Aspiring founder with an idea for a pet-tech startup. Here to learn before I quit my job.', headline: 'Aspiring Founder | Pet-Tech Idea | Learning Before Launching', industries: ['Pet Tech', 'Consumer'], skills: ['Marketing', 'E-Commerce'], location: 'Nashville, TN', joinedDaysAgo: 14 },
  { email: 'novice2@example.com', name: 'Jordan Blake', username: 'jordanb', role: 'STUDENT', membershipTier: 'FREE', avatar: av('Jordan Blake', '94a3b8'), bio: 'College senior with a side project that\'s getting traction. Not sure if I should raise money or bootstrap. Here to figure it out.', headline: 'College Founder | Side Project Getting Traction | Deciding Next Steps', industries: ['Consumer', 'Social Media'], skills: ['React', 'Mobile Dev'], location: 'Ann Arbor, MI', joinedDaysAgo: 12 },
  { email: 'novice3@example.com', name: 'Riley Morgan', username: 'rileym', role: 'STUDENT', membershipTier: 'FREE', avatar: av('Riley Morgan', '94a3b8'), bio: 'Software engineer at Big Tech. Building a nocode platform on weekends. Want to validate before going full-time.', headline: 'Big Tech Engineer | Weekend Builder | Validating NoCode Platform', industries: ['NoCode', 'SaaS'], skills: ['Full-Stack', 'NoCode'], location: 'Austin, TX', joinedDaysAgo: 10 },
  { email: 'novice4@example.com', name: 'Casey Kim', username: 'caseyk', role: 'STUDENT', membershipTier: 'FREE', avatar: av('Casey Kim', '94a3b8'), bio: 'Marketing professional exploring whether my agency experience translates to building a SaaS product. Total beginner, hungry to learn.', headline: 'Marketer Exploring SaaS | Agency Background | Beginner Mindset', industries: ['SaaS', 'Marketing'], skills: ['Marketing', 'Content Strategy'], location: 'Vancouver, Canada', joinedDaysAgo: 8 },
  { email: 'novice5@example.com', name: 'Drew Patterson', username: 'drewp', role: 'STUDENT', membershipTier: 'FREE', avatar: av('Drew Patterson', '94a3b8'), bio: 'Former chef building recipe management software for restaurants. I know the problem deeply — just need to learn how to build and sell software.', headline: 'Ex-Chef Turned Founder | Recipe Management for Restaurants | Domain Expert', industries: ['Food Tech', 'SaaS'], skills: ['Culinary', 'Restaurant Operations'], location: 'New Orleans, LA', joinedDaysAgo: 7 },
  { email: 'novice6@example.com', name: 'Avery Santos', username: 'averys', role: 'STUDENT', membershipTier: 'FREE', avatar: av('Avery Santos', '94a3b8'), bio: 'UX designer who just learned to code. Building a portfolio-builder for designers. Here to learn the business side of things.', headline: 'UX Designer Learning to Build | Portfolio Builder for Designers', industries: ['Design Tools', 'SaaS'], skills: ['UX Design', 'React'], location: 'Lisbon, Portugal', joinedDaysAgo: 5 },
  { email: 'novice7@example.com', name: 'Quinn Foster', username: 'quinnf', role: 'STUDENT', membershipTier: 'FREE', avatar: av('Quinn Foster', '94a3b8'), bio: 'Recent MBA grad. Have a thesis on D2C brands that I want to turn into a real business. Network is my only asset right now.', headline: 'MBA Grad | D2C Brand Thesis | Network-Rich, Cash-Poor', industries: ['D2C', 'E-Commerce'], skills: ['Business Strategy', 'Finance'], location: 'Philadelphia, PA', joinedDaysAgo: 3 },
  { email: 'novice8@example.com', name: 'Morgan Yu', username: 'morgany', role: 'STUDENT', membershipTier: 'FREE', avatar: av('Morgan Yu', '94a3b8'), bio: 'Literally just signed up. Have a napkin idea for an AI dating app coach. Don\'t know where to start. This community seemed like a good first step.', headline: 'Day 1 Founder | AI Dating App Idea | Complete Beginner', industries: ['Consumer', 'AI/ML'], skills: ['None yet!'], location: 'San Diego, CA', joinedDaysAgo: 1 },
];

// ── Export all users ────────────────────────────────────────────────────────

export const allSeedUsers: SeedUser[] = [...heroUsers, ...memberUsers, ...noviceUsers];

// ── Space definitions (for post assignment) ─────────────────────────────────

export interface SeedSpace {
  slug: string;
  name: string;
  description: string;
  memberCount: number;
  image: string;
  tags: string[];
}

export const seedSpaces: SeedSpace[] = [
  { slug: 'saas-founders', name: 'SaaS Founders', description: 'For founders building B2B and B2C SaaS products. Share learnings, get feedback, and grow together.', memberCount: 1247, image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop', tags: ['SaaS', 'B2B', 'Product'] },
  { slug: 'women-in-tech', name: 'Women in Tech', description: 'A supportive space for women founders, engineers, and operators in the tech industry.', memberCount: 763, image: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=400&h=300&fit=crop', tags: ['Community', 'DEI'] },
  { slug: 'climate-tech', name: 'Climate Tech', description: 'Founders building solutions for a sustainable future. Clean energy, carbon capture, circular economy, and more.', memberCount: 412, image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&h=300&fit=crop', tags: ['Climate', 'Sustainability', 'Hard Tech'] },
  { slug: 'ai-ml-builders', name: 'AI/ML Builders', description: 'Deep dive into artificial intelligence and machine learning. Share papers, models, and startup ideas.', memberCount: 891, image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop', tags: ['AI', 'Machine Learning', 'Deep Tech'] },
  { slug: 'fundraising-hub', name: 'Fundraising Hub', description: 'Everything fundraising. Share investor contacts, get pitch feedback, and celebrate your closes.', memberCount: 567, image: 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?w=400&h=300&fit=crop', tags: ['Fundraising', 'VC', 'Pitching'] },
  { slug: 'creator-economy', name: 'Creator Economy', description: 'For founders building tools and platforms for creators. Newsletter, podcast, and course builders welcome.', memberCount: 345, image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop', tags: ['Creator', 'Media', 'Community'] },
  { slug: 'growth-hacking', name: 'Growth Hacking', description: 'Zero-budget growth strategies, viral loops, and unconventional marketing tactics that actually work.', memberCount: 678, image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop', tags: ['Growth', 'Marketing', 'SEO'] },
  { slug: 'bootstrappers', name: 'Bootstrappers', description: 'For founders building profitable businesses without VC. Revenue-first, lifestyle-friendly, sustainable growth.', memberCount: 489, image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop', tags: ['Bootstrapping', 'Indie Hacking', 'Profitability'] },
  { slug: 'health-tech', name: 'Health Tech', description: 'Founders building the future of healthcare. Digital health, biotech, telemedicine, and wellness tech.', memberCount: 534, image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop', tags: ['Healthcare', 'Biotech', 'Wellness'] },
  { slug: 'fintech-builders', name: 'Fintech Builders', description: 'Building the future of financial services. Payments, lending, neobanks, insurtech, and crypto.', memberCount: 612, image: 'https://images.unsplash.com/photo-1559526324-4b87b5e9e7a7?w=400&h=300&fit=crop', tags: ['FinTech', 'Payments', 'Banking'] },
];
