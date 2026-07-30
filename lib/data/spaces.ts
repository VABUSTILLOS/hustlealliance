export interface Space {
  slug: string;
  name: string;
  description: string;
  descriptionEs: string;
  memberCount: number;
  image: string;
  tags: string[];
}

export const spaces: Space[] = [
  {
    slug: 'the-fire',
    name: 'The Fire',
    description: 'Mental toughness, grit, and physical endurance. Conquer burnout through accountability to physical targets and push through the mental friction of building a business.',
    descriptionEs: 'Fortaleza mental, determinación y resistencia física. Vence el agotamiento mediante la responsabilidad hacia objetivos físicos y supera la fricción mental de construir un negocio.',
    memberCount: 842,
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop',
    tags: ['Discipline', 'Wellness', 'Mindset'],
  },
  {
    slug: 'the-idea-vault',
    name: 'The Idea Vault',
    description: 'Specific knowledge and building early leverage. Pitch raw ideas, search for co-founders, and discuss how to build permissionless leverage through media and personal authority.',
    descriptionEs: 'Conocimiento específico y construcción de apalancamiento inicial. Presenta ideas en bruto, busca co-fundadores y discute cómo construir apalancamiento sin permiso a través de medios y autoridad personal.',
    memberCount: 456,
    image: 'https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?w=400&h=300&fit=crop',
    tags: ['Ideas', 'Co-Founders', 'Leverage'],
  },
  {
    slug: 'building-the-machine',
    name: 'Building the Machine',
    description: 'MVP development, growth hacking, and guerrilla marketing. Share growth experiments, sales best practices, and execution strategies.',
    descriptionEs: 'Desarrollo de MVP, growth hacking y marketing de guerrilla. Comparte experimentos de crecimiento, mejores prácticas de ventas y estrategias de ejecución.',
    memberCount: 621,
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop',
    tags: ['Growth', 'MVP', 'Sales'],
  },
  {
    slug: 'ai-power',
    name: 'AI Power',
    description: 'Maximizing developer speed and operational bandwidth. Swap prompt engineering tactics, share Cursor setups, and benchmark local models like Ollama or Qwen for zero-cost deployments.',
    descriptionEs: 'Maximizando velocidad de desarrollo y ancho de banda operativo. Intercambia tácticas de prompt engineering, comparte configuraciones de Cursor y compara modelos locales como Ollama o Qwen para despliegues sin costo.',
    memberCount: 723,
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop',
    tags: ['AI', 'Developer Tools', 'Automation'],
  },
  {
    slug: 'the-acquisition-machine',
    name: 'The Acquisition Machine',
    description: 'Crafting undeniable value and tracking acquisition. Ruthlessly critique pricing and guarantees, and share raw CPA data on cold outreach and paid ads.',
    descriptionEs: 'Creando valor innegable y rastreando la adquisición. Critica sin piedad precios y garantías, y comparte datos reales de CPA en outreach frío y anuncios pagados.',
    memberCount: 389,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
    tags: ['Acquisition', 'Pricing', 'Marketing'],
  },
  {
    slug: 'scaling-and-systems',
    name: 'Scaling & Systems',
    description: 'The 100 Tasks framework and aggressive operational scaling. Remove yourself from daily client delivery with SOPs, B2B partnerships, and Zapier or Make automations.',
    descriptionEs: 'El marco de las 100 Tareas y escalamiento operativo agresivo. Retírate de la entrega diaria a clientes con SOPs, alianzas B2B y automatizaciones con Zapier o Make.',
    memberCount: 312,
    image: 'https://images.unsplash.com/photo-1512758017271-d7b84c2113f1?w=400&h=300&fit=crop',
    tags: ['Scaling', 'Automation', 'Operations'],
  },
  {
    slug: 'the-firing-squad',
    name: 'The Firing Squad',
    description: 'Radical transparency and unvarnished feedback. Debut completed MVPs, recruit beta testers, and absorb brutally honest, ego-free feedback on UX and conversion.',
    descriptionEs: 'Transparencia radical y retroalimentación sin filtros. Presenta MVPs terminados, recluta beta testers y absorbe críticas brutalmente honestas y sin ego sobre UX y conversión.',
    memberCount: 278,
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop',
    tags: ['Feedback', 'Beta Testing', 'MVP'],
  },
  {
    slug: 'mexico-operations',
    name: 'Mexico Operations',
    description: 'Navigating Mexican bureaucracy and compliance. Optimize taxes under RESICO vs. Persona Física, structure IMSS and Infonavit for hires, and draft local service contracts.',
    descriptionEs: 'Navegando la burocracia y cumplimiento mexicanos. Optimiza impuestos bajo RESICO vs. Persona Física, estructura IMSS e Infonavit para contrataciones y redacta contratos de servicios locales.',
    memberCount: 198,
    image: 'https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=400&h=300&fit=crop',
    tags: ['Mexico', 'Compliance', 'Tax'],
  },
  {
    slug: 'wealth-and-investments',
    name: 'Wealth & Investments',
    description: 'Capitalization, yield generation, and the financial endgame. Manage portfolios on GBM, maximize yield through SOFIPOs and P2P lending, and structure long-term wealth like Segubeca.',
    descriptionEs: 'Capitalización, generación de rendimientos y el objetivo financiero final. Administra portafolios en GBM, maximiza rendimientos con SOFIPOs y préstamos P2P, y estructura patrimonio a largo plazo como Segubeca.',
    memberCount: 345,
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=300&fit=crop',
    tags: ['Wealth', 'Investing', 'FIRE'],
  },
];

/** Get locale-aware space description */
export function getSpaceLocale(space: Space, locale: 'en' | 'es'): { description: string } {
  if (locale === 'es') return { description: space.descriptionEs };
  return { description: space.description };
}
