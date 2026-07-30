export interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  host: {
    name: string;
    avatar: string;
  };
  attendees: number;
  space?: string;
}

export const upcomingEvents: CommunityEvent[] = [
  {
    id: 'e1',
    title: 'Live Pitch Feedback with Marcus Chen',
    description: 'Submit your pitch deck for live feedback from a top VC. First 5 submissions will be reviewed on air.',
    date: 'Aug 2, 2026',
    time: '11:00 AM PT',
    host: {
      name: 'Marcus Chen',
      avatar: '/images/avatars/marcuschen.svg',
    },
    attendees: 87,
  },
  {
    id: 'e2',
    title: 'Zero-Budget Marketing Workshop',
    description: 'Priya Patel walks through her framework for getting your first 1,000 users without spending a dollar.',
    date: 'Aug 5, 2026',
    time: '2:00 PM PT',
    host: {
      name: 'Priya Patel',
      avatar: '/images/avatars/priyap.svg',
    },
    attendees: 134,
  },
  {
    id: 'e3',
    title: 'SaaS Founders Meetup: Demo Day',
    description: '5 founders present their products to the community. Get feedback, find beta testers, and network.',
    date: 'Aug 10, 2026',
    time: '10:00 AM PT',
    host: {
      name: 'Devon Mitchell',
      avatar: '/images/avatars/devonm.svg',
    },
    attendees: 56,
    space: 'saas-founders',
  },
];
