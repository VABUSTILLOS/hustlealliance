export interface PostAuthor {
  username: string;
  name: string;
  avatar: string;
}

export interface Comment {
  id: string;
  author: PostAuthor;
  text: string;
  timestamp: string;
}

export interface FeedPost {
  id: string;
  author: PostAuthor;
  text: string;
  image?: string;
  timestamp: string;
  likes: number;
  liked: boolean;
  comments: Comment[];
  space?: string;
}

export const feedPosts: FeedPost[] = [
  {
    id: '1',
    author: {
      username: 'marcuschen',
      name: 'Marcus Chen',
      avatar: '/images/avatars/marcuschen.jpg',
    },
    text: '986-day Duolingo streak. 847-day GitHub commit streak. The people who dismiss streaks as vanity metrics don\'t understand compounding. Every day you show up to something small, you\'re reinforcing the identity of someone who finishes what they start.',
    timestamp: '2 hours ago',
    likes: 47,
    liked: false,
    comments: [
      {
        id: 'c1',
        author: {
          username: 'sarahk',
          name: 'Sarah Kim',
          avatar: '/images/avatars/sarahk.jpg',
        },
        text: 'This is the mindset shift more founders need. Consistency beats intensity every time. 🔥',
        timestamp: '1 hour ago',
      },
    ],
    space: 'the-fire',
  },
  {
    id: '2',
    author: {
      username: 'alexk',
      name: 'Alex Kowalski',
      avatar: '/images/avatars/alexk.jpg',
    },
    text: 'Looking for a technical co-founder in Mexico City. Building an AI-powered invoice automation platform for Mexican SMEs. I have 10 years in industrial real estate and 3 LOIs from manufacturers. Need someone who lives and breathes Next.js and Supabase.',
    timestamp: '5 hours ago',
    likes: 34,
    liked: false,
    comments: [
      {
        id: 'c3',
        author: {
          username: 'jameso',
          name: 'James Okafor',
          avatar: '/images/avatars/jameso.jpg',
        },
        text: 'I know someone perfect for this — DMing you now.',
        timestamp: '3 hours ago',
      },
    ],
    space: 'the-idea-vault',
  },
  {
    id: '3',
    author: {
      username: 'priyap',
      name: 'Priya Patel',
      avatar: '/images/avatars/priyap.jpg',
    },
    text: 'Our waitlist went from 40 to 1,200 in 6 days. The playbook: micro-influencer DMs + a brutally simple landing page. Identified 15 niche YouTubers in our vertical, DMed every single one. 4 said yes. One video hit 18K views. Cost: $0.',
    timestamp: '8 hours ago',
    likes: 89,
    liked: true,
    comments: [],
    space: 'building-the-machine',
  },
  {
    id: '4',
    author: {
      username: 'sarahk',
      name: 'Sarah Kim',
      avatar: '/images/avatars/sarahk.jpg',
    },
    text: 'Running Qwen 2.5 32B locally on an M3 Max — 42 tokens/sec, 83% as good as Claude on my coding benchmark suite. Cost: $0/month. For 70% of my daily coding tasks, local is enough. The leverage math is undeniable.',
    timestamp: '12 hours ago',
    likes: 56,
    liked: false,
    comments: [
      {
        id: 'c4',
        author: {
          username: 'maya',
          name: 'Maya Rodriguez',
          avatar: '/images/avatars/maya.jpg',
        },
        text: 'Would love to see your benchmark suite! Been experimenting with the same setup.',
        timestamp: '10 hours ago',
      },
    ],
    space: 'ai-power',
  },
  {
    id: '5',
    author: {
      username: 'jameso',
      name: 'James Okafor',
      avatar: '/images/avatars/jameso.jpg',
    },
    text: '6 months of CPA data: LinkedIn ($47), cold email ($12), content ($4). LinkedIn ads close faster, cold email has a longer cycle, content is a 6-month ramp. Blending all three keeps the pipeline full. Pure paid is a cash furnace.',
    timestamp: '1 day ago',
    likes: 72,
    liked: false,
    comments: [],
    space: 'the-acquisition-machine',
  },
  {
    id: '6',
    author: {
      username: 'carlosm',
      name: 'Carlos Mendoza',
      avatar: '/images/avatars/carlosm.jpg',
    },
    text: 'The 100 Tasks audit changed my life. Listed every task I did in a week. 100 tasks. Only 27 were CEO-level. 73 were delegation failures. Spent 30 days documenting SOPs. Now I work 15 hours a week and revenue is up 40%.',
    timestamp: '1 day ago',
    likes: 63,
    liked: true,
    comments: [],
    space: 'scaling-and-systems',
  },
  {
    id: '7',
    author: {
      username: 'maya',
      name: 'Maya Rodriguez',
      avatar: '/images/avatars/maya.jpg',
    },
    text: 'Launching my MVP: invoice automation for Mexican SMEs. Next.js + Supabase. Upload a PDF invoice, AI extracts fields, auto-generates CFDI 4.0 XML. Link in comments. Destroy it — I need to know what breaks first.',
    timestamp: '2 days ago',
    likes: 41,
    liked: false,
    comments: [
      {
        id: 'c5',
        author: {
          username: 'marcuschen',
          name: 'Marcus Chen',
          avatar: '/images/avatars/marcuschen.jpg',
        },
        text: 'Your onboarding has too many steps before the user sees value. Cut it from 7 to 2. Trust me — we had the same problem.',
        timestamp: '2 days ago',
      },
    ],
    space: 'the-firing-squad',
  },
  {
    id: '8',
    author: {
      username: 'carlosm',
      name: 'Carlos Mendoza',
      avatar: '/images/avatars/carlosm.jpg',
    },
    text: 'RESICO vs. Persona Física — actual 2026 numbers. RESICO: 1%-2.5% ISR on gross income up to 3.5M MXN. PFAE: progressive rates up to 35%. If you\'re under the cap, RESICO is a no-brainer. But watch the cap — exceeding it retroactively disqualifies you.',
    timestamp: '2 days ago',
    likes: 29,
    liked: false,
    comments: [],
    space: 'mexico-operations',
  },
  {
    id: '9',
    author: {
      username: 'mariath',
      name: 'Maria Torres',
      avatar: '/images/avatars/mariat.jpg',
    },
    text: 'My 2026 portfolio: 40% VOO, 25% VT, 15% GBM individual Mexican stocks, 10% CETES, 10% BTC/ETH. Rebalancing quarterly. Target: $1.2M by 45. The FIRE math for LATAM founders: you need less than you think — $600K-$900K with a paid-off condo.',
    timestamp: '3 days ago',
    likes: 34,
    liked: false,
    comments: [],
    space: 'wealth-and-investments',
  },
  {
    id: '10',
    author: {
      username: 'sarahk',
      name: 'Sarah Kim',
      avatar: '/images/avatars/sarahk.jpg',
    },
    text: 'Just closed our seed round! Built our entire MVP on Next.js + Supabase. The term sheet breakdown resources in this community saved us $50K in legal fees. To everyone who gave feedback in The Firing Squad — you know who you are. Thank you. 🚀',
    timestamp: '3 days ago',
    likes: 112,
    liked: false,
    comments: [],
  },
];
