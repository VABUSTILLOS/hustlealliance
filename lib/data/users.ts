export interface MemberProfile {
  username: string;
  name: string;
  avatar: string;
  headline: string;
  bio: string;
  startupPitch: string;
  completedPaths: string[];
  joinedSpaces: string[];
  achievements: { id: string; label: string; icon: string }[];
}

export const currentUser: MemberProfile = {
  username: 'alexk',
  name: 'Alex Kowalski',
  avatar: '/images/avatars/alexk.jpg',
  headline: 'Building the future of recruiting with AI',
  bio: 'Serial founder. Previously built and sold a logistics SaaS to FleetCor for $12M. Now tackling the hiring space with machine learning. Based in San Francisco. Stanford CS dropout.',
  startupPitch: 'HireMind is an AI-powered recruiting platform that automates candidate sourcing and screening, reducing time-to-hire by 60%. We use NLP to match candidates to roles based on skills, not keywords.',
  completedPaths: ['fundraising-101'],
  joinedSpaces: ['saas-founders', 'ai-ml-builders', 'fundraising-hub'],
  achievements: [
    { id: 'a1', label: 'Fundraising 101', icon: '🎓' },
    { id: 'a2', label: 'First Post', icon: '✍️' },
    { id: 'a3', label: '50 Likes', icon: '❤️' },
  ],
};

export const memberProfiles: Record<string, MemberProfile> = {
  alexk: currentUser,
  sarahk: {
    username: 'sarahk',
    name: 'Sarah Kim',
    avatar: '/images/avatars/sarahk.jpg',
    headline: 'Making mental healthcare accessible',
    bio: 'Founder of MindPath, a tele-therapy platform connecting underserved communities with licensed therapists. YC W24. Previously a clinical psychologist at Kaiser.',
    startupPitch: 'MindPath provides on-demand therapy sessions with culturally competent therapists, covered by insurance. 10,000+ sessions delivered across 42 states.',
    completedPaths: ['fundraising-101', 'growth-marketing'],
    joinedSpaces: ['women-in-tech', 'fundraising-hub'],
    achievements: [
      { id: 'a4', label: 'Fundraising 101', icon: '🎓' },
      { id: 'a5', label: 'Growth Marketing', icon: '📈' },
      { id: 'a6', label: 'Top Contributor', icon: '⭐' },
    ],
  },
  marcuschen: {
    username: 'marcuschen',
    name: 'Marcus Chen',
    avatar: '/images/avatars/marcuschen.jpg',
    headline: 'Investing in the next generation of founders',
    bio: 'GP at Horizon Ventures ($45M fund). Previously founded and sold TradeDesk to Thomson Reuters. Passionate about coaching first-time founders, especially from non-traditional backgrounds.',
    startupPitch: 'Horizon Ventures is an early-stage fund investing $250K–$2M in B2B SaaS and fintech startups led by underrepresented founders.',
    completedPaths: [],
    joinedSpaces: ['fundraising-hub', 'saas-founders'],
    achievements: [
      { id: 'a7', label: 'Community Mentor', icon: '🏆' },
      { id: 'a8', label: '100 Posts', icon: '📝' },
    ],
  },
  priyap: {
    username: 'priyap',
    name: 'Priya Patel',
    avatar: '/images/avatars/priyap.jpg',
    headline: 'Growth is a system, not a hack',
    bio: 'Head of Growth at ScaleUp, a growth consultancy. Helped 3 startups go from 0 to 100K+ users. Guest lecturer at Stanford GSB. Previously led growth at Intercom and Loom.',
    startupPitch: 'ScaleUp is a growth consultancy that embeds with early-stage startups to build repeatable acquisition engines, focusing on PLG and community-led growth.',
    completedPaths: [],
    joinedSpaces: ['women-in-tech', 'creator-economy'],
    achievements: [
      { id: 'a9', label: 'Workshop Host', icon: '🎙️' },
      { id: 'a10', label: '500 Likes', icon: '🔥' },
    ],
  },
  devonm: {
    username: 'devonm',
    name: 'Devon Mitchell',
    avatar: '/images/avatars/devonm.jpg',
    headline: 'Bootstrapped to $2M ARR',
    bio: 'CEO of Flux Studio. Built a collaborative design-tool SaaS without VC funding — revenue-funded from day one. Now paying it forward by mentoring other bootstrappers.',
    startupPitch: 'Flux Studio is a collaborative design tool for remote teams. Real-time multiplayer, version control, and developer handoff built in. Trusted by 400+ design teams.',
    completedPaths: ['product-led-growth'],
    joinedSpaces: ['saas-founders', 'fundraising-hub'],
    achievements: [
      { id: 'a11', label: 'Product-Led Growth', icon: '🎓' },
      { id: 'a12', label: 'Bootstrapper Badge', icon: '💪' },
      { id: 'a13', label: '200 Posts', icon: '📝' },
    ],
  },
  maya: {
    username: 'maya',
    name: 'Maya Rodriguez',
    avatar: '/images/avatars/maya.jpg',
    headline: 'Climate tech founder on a mission',
    bio: 'Building carbon offset tracking for SMEs. Previously a climate data scientist at NASA JPL. Turning complex climate models into actionable business insights.',
    startupPitch: 'CarbonClear helps small and medium businesses measure, offset, and report their carbon footprint with enterprise-grade accuracy at startup-friendly pricing.',
    completedPaths: ['fundraising-101'],
    joinedSpaces: ['climate-tech', 'women-in-tech'],
    achievements: [
      { id: 'a14', label: 'Fundraising 101', icon: '🎓' },
      { id: 'a15', label: 'Climate Pioneer', icon: '🌍' },
    ],
  },
};
