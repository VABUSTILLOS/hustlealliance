export interface PostAuthor {
  username: string;
  name: string;
  avatar: string;
}

export interface Comment {
  id: string;
  author: PostAuthor;
  text: string;
  textEs?: string;
  timestamp: string;
}

export interface FeedPost {
  id: string;
  author: PostAuthor;
  text: string;
  textEs?: string;
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
    textEs: '986 días de racha en Duolingo. 847 días de racha de commits en GitHub. La gente que descarta las rachas como métricas vacías no entiende el interés compuesto. Cada día que te presentas a algo pequeño, estás reforzando la identidad de alguien que termina lo que empieza.',
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
        textEs: 'Este es el cambio de mentalidad que más fundadores necesitan. La consistencia siempre vence a la intensidad. 🔥',
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
    textEs: 'Busco co-fundador técnico en Ciudad de México. Estoy construyendo una plataforma de automatización de facturas con IA para PyMEs mexicanas. Tengo 10 años en bienes raíces industriales y 3 cartas de intención de fabricantes. Necesito a alguien que viva y respire Next.js y Supabase.',
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
        textEs: 'Conozco a alguien perfecto para esto — te envío MD ahora.',
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
    textEs: 'Nuestra lista de espera pasó de 40 a 1,200 en 6 días. El manual: MDs a micro-influencers + una landing page brutalmente simple. Identifiqué 15 YouTubers de nicho en nuestro vertical, envié MD a cada uno. 4 dijeron que sí. Un video alcanzó 18K vistas. Costo: $0.',
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
    textEs: 'Ejecutando Qwen 2.5 32B localmente en un M3 Max — 42 tokens/seg, 83% tan bueno como Claude en mi suite de benchmarks de código. Costo: $0/mes. Para el 70% de mis tareas diarias de programación, local es suficiente. Las matemáticas de apalancamiento son innegables.',
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
        textEs: '¡Me encantaría ver tu suite de benchmarks! He estado experimentando con la misma configuración.',
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
    textEs: '6 meses de datos de CPA: LinkedIn ($47), cold email ($12), contenido ($4). Los anuncios de LinkedIn cierran más rápido, cold email tiene un ciclo más largo, el contenido requiere 6 meses de ramp-up. Combinar los tres mantiene el pipeline lleno. Solo pagar es un horno de efectivo.',
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
    textEs: 'La auditoría de las 100 Tareas me cambió la vida. Enumeré cada tarea que hice en una semana. 100 tareas. Solo 27 eran de nivel CEO. 73 eran fallos de delegación. Pasé 30 días documentando POPs. Ahora trabajo 15 horas a la semana y los ingresos subieron un 40%.',
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
    textEs: 'Lanzo mi MVP: automatización de facturas para PyMEs mexicanas. Next.js + Supabase. Sube una factura PDF, la IA extrae campos, genera automáticamente XML CFDI 4.0. Enlace en comentarios. Destrúyanlo — necesito saber qué se rompe primero.',
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
        textEs: 'Tu onboarding tiene demasiados pasos antes de que el usuario vea valor. Redúcelo de 7 a 2. Confía en mí — tuvimos el mismo problema.',
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
    textEs: 'RESICO vs. Persona Física — cifras reales 2026. RESICO: 1%-2.5% ISR sobre ingreso bruto hasta 3.5M MXN. PFAE: tasas progresivas hasta 35%. Si estás por debajo del tope, RESICO es obvio. Pero ojo con el tope — excederlo te descalifica retroactivamente.',
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
    textEs: 'Mi portafolio 2026: 40% VOO, 25% VT, 15% acciones mexicanas individuales en GBM, 10% CETES, 10% BTC/ETH. Rebalanceo trimestral. Meta: $1.2M a los 45. Las matemáticas FIRE para fundadores LATAM: necesitas menos de lo que crees — $600K-$900K con un departamento pagado.',
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
    textEs: '¡Acabamos de cerrar nuestra ronda seed! Construimos todo nuestro MVP en Next.js + Supabase. Los recursos de desglose de term sheets en esta comunidad nos ahorraron $50K en honorarios legales. A todos los que dieron feedback en The Firing Squad — saben quiénes son. Gracias. 🚀',
    timestamp: '3 days ago',
    likes: 112,
    liked: false,
    comments: [],
  },
];

/** Get locale-aware feed posts with translated text */
export function getFeedPostsLocale(locale: 'en' | 'es'): FeedPost[] {
  if (locale === 'en') return feedPosts;
  return feedPosts.map((post) => ({
    ...post,
    text: post.textEs || post.text,
    comments: post.comments.map((c) => ({
      ...c,
      text: c.textEs || c.text,
    })),
  }));
}
