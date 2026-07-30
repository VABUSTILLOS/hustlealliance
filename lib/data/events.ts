export interface CommunityEvent {
  id: string;
  title: string;
  titleEs: string;
  description: string;
  descriptionEs: string;
  date: string;
  time: string;
  host: {
    name: string;
    avatar: string;
  };
  attendees: number;
  space?: string;
}

/** Get locale-aware event title and description */
export function getEventLocale(event: CommunityEvent, locale: 'en' | 'es'): { title: string; description: string } {
  if (locale === 'es') return { title: event.titleEs, description: event.descriptionEs };
  return { title: event.title, description: event.description };
}

export const upcomingEvents: CommunityEvent[] = [
  {
    id: 'e1',
    title: 'Live Pitch Feedback with Marcus Chen',
    titleEs: 'Retroalimentación de Pitch en Vivo con Marcus Chen',
    description: 'Submit your pitch deck for live feedback from a top VC. First 5 submissions will be reviewed on air.',
    descriptionEs: 'Envía tu pitch deck para recibir retroalimentación en vivo de un VC de primer nivel. Las primeras 5 presentaciones serán revisadas al aire.',
    date: 'Aug 2, 2026',
    time: '11:00 AM PT',
    host: {
      name: 'Marcus Chen',
      avatar: '/images/avatars/marcuschen.jpg',
    },
    attendees: 87,
  },
  {
    id: 'e2',
    title: 'Zero-Budget Marketing Workshop',
    titleEs: 'Taller de Marketing sin Presupuesto',
    description: 'Priya Patel walks through her framework for getting your first 1,000 users without spending a dollar.',
    descriptionEs: 'Priya Patel explica su marco para conseguir tus primeros 1,000 usuarios sin gastar un solo dólar.',
    date: 'Aug 5, 2026',
    time: '2:00 PM PT',
    host: {
      name: 'Priya Patel',
      avatar: '/images/avatars/priyap.jpg',
    },
    attendees: 134,
  },
  {
    id: 'e3',
    title: 'SaaS Founders Meetup: Demo Day',
    titleEs: 'Encuentro de Fundadores SaaS: Demo Day',
    description: '5 founders present their products to the community. Get feedback, find beta testers, and network.',
    descriptionEs: '5 fundadores presentan sus productos a la comunidad. Recibe retroalimentación, encuentra beta testers y haz networking.',
    date: 'Aug 10, 2026',
    time: '10:00 AM PT',
    host: {
      name: 'Devon Mitchell',
      avatar: '/images/avatars/devonm.jpg',
    },
    attendees: 56,
    space: 'saas-founders',
  },
];
