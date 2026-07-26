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
      username: 'sarahk',
      name: 'Sarah Kim',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=face',
    },
    text: 'Just closed our seed round! 🎉 The Fundraising 101 path in Hustle Alliance was a game-changer — the term sheet breakdown alone saved us $50K in legal fees. Thank you to this incredible community.',
    image:
      'https://images.unsplash.com/photo-1553484771-371e845efba1?w=600&h=400&fit=crop',
    timestamp: '2 hours ago',
    likes: 47,
    liked: false,
    comments: [
      {
        id: 'c1',
        author: {
          username: 'marcuschen',
          name: 'Marcus Chen',
          avatar:
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=face',
        },
        text: 'Congratulations Sarah! Proud to have played a small part. 🚀',
        timestamp: '1 hour ago',
      },
      {
        id: 'c2',
        author: {
          username: 'priyap',
          name: 'Priya Patel',
          avatar:
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=face',
        },
        text: 'Amazing! Which investors did you end up going with?',
        timestamp: '45 min ago',
      },
    ],
  },
  {
    id: '2',
    author: {
      username: 'devonm',
      name: 'Devon Mitchell',
      avatar:
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=96&h=96&fit=crop&crop=face',
    },
    text: 'Hot take: Most startups don\'t need to raise venture capital. We built Flux Studio to $2M ARR completely bootstrapped. The playbooks in the Growth Marketing path are all you need to get started. AMA!',
    timestamp: '5 hours ago',
    likes: 89,
    liked: true,
    comments: [
      {
        id: 'c3',
        author: {
          username: 'jameso',
          name: 'James Okafor',
          avatar:
            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop&crop=face',
        },
        text: 'How did you handle churn in the early days?',
        timestamp: '3 hours ago',
      },
    ],
    space: 'saas-founders',
  },
  {
    id: '3',
    author: {
      username: 'maya',
      name: 'Maya Rodriguez',
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&fit=crop&crop=face',
    },
    text: 'Just published my first blog post about building in public. 6 months ago I was too scared to share anything. Now I have 2K followers and 3 inbound investor inquiries. The Community-Led Growth lesson was 🔥',
    timestamp: '8 hours ago',
    likes: 34,
    liked: false,
    comments: [],
    space: 'women-in-tech',
  },
  {
    id: '4',
    author: {
      username: 'alexk',
      name: 'Alex Kowalski',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&fit=crop&crop=face',
    },
    text: 'Looking for a technical co-founder. Building an AI-powered recruiting platform. I have domain expertise and first pilot customer. Based in SF. DM me if interested or tag someone!',
    timestamp: '12 hours ago',
    likes: 22,
    liked: false,
    comments: [
      {
        id: 'c4',
        author: {
          username: 'sarahk',
          name: 'Sarah Kim',
          avatar:
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=face',
        },
        text: 'I know someone great — will DM you!',
        timestamp: '10 hours ago',
      },
    ],
  },
  {
    id: '5',
    author: {
      username: 'priyap',
      name: 'Priya Patel',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=face',
    },
    text: 'New module just dropped in the Growth Marketing path: "Community-Led Growth." We break down how Duolingo, Figma, and Notion built their communities. Plus a step-by-step playbook for founders. Check it out ⬇️',
    timestamp: '1 day ago',
    likes: 56,
    liked: false,
    comments: [],
  },
  {
    id: '6',
    author: {
      username: 'jameso',
      name: 'James Okafor',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop&crop=face',
    },
    text: 'Built a custom analytics dashboard for our SaaS this weekend. Zero-budget stack: Next.js + Supabase + Vercel. Happy to share the repo if anyone wants it.',
    image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
    timestamp: '1 day ago',
    likes: 41,
    liked: false,
    comments: [],
    space: 'saas-founders',
  },
  {
    id: '7',
    author: {
      username: 'sarahk',
      name: 'Sarah Kim',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=face',
    },
    text: 'What\'s everyone using for CRM these days? We\'re outgrowing HubSpot and need something more startup-friendly. Budget under $100/mo.',
    timestamp: '2 days ago',
    likes: 18,
    liked: false,
    comments: [
      {
        id: 'c5',
        author: {
          username: 'devonm',
          name: 'Devon Mitchell',
          avatar:
            'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=96&h=96&fit=crop&crop=face',
        },
        text: 'Check out Folk — we switched 3 months ago and love it.',
        timestamp: '2 days ago',
      },
    ],
  },
  {
    id: '8',
    author: {
      username: 'marcuschen',
      name: 'Marcus Chen',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=face',
    },
    text: 'Office hours this Friday at 11am PT. Bring your pitch decks — I\'ll do live feedback on the first 5 submissions. Link in the Events tab.',
    timestamp: '2 days ago',
    likes: 72,
    liked: true,
    comments: [],
  },
  {
    id: '9',
    author: {
      username: 'maya',
      name: 'Maya Rodriguez',
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&fit=crop&crop=face',
    },
    text: 'Who else is building in climate tech? 🌍 We\'re working on carbon offset tracking for SMEs. Would love to connect with other climate founders here.',
    timestamp: '3 days ago',
    likes: 29,
    liked: false,
    comments: [],
    space: 'climate-tech',
  },
  {
    id: '10',
    author: {
      username: 'alexk',
      name: 'Alex Kowalski',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&fit=crop&crop=face',
    },
    text: 'The Product-Led Growth path is incredible. Just redesigned our onboarding flow based on Module 2 and activation rate went from 12% to 34% in two weeks. Data doesn\'t lie 📈',
    timestamp: '3 days ago',
    likes: 63,
    liked: false,
    comments: [],
  },
];
