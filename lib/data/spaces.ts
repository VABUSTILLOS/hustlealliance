export interface Space {
  slug: string;
  name: string;
  description: string;
  memberCount: number;
  image: string;
  tags: string[];
}

export const spaces: Space[] = [
  {
    slug: 'the-fire',
    name: 'The Fire',
    description: 'Mental toughness, grit, and physical endurance. Conquer burnout through accountability to physical targets and push through the mental friction of building a business.',
    memberCount: 842,
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop',
    tags: ['Discipline', 'Wellness', 'Mindset'],
  },
  {
    slug: 'the-idea-vault',
    name: 'The Idea Vault',
    description: 'Specific knowledge and building early leverage. Pitch raw ideas, search for co-founders, and discuss how to build permissionless leverage through media and personal authority.',
    memberCount: 456,
    image: 'https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?w=400&h=300&fit=crop',
    tags: ['Ideas', 'Co-Founders', 'Leverage'],
  },
  {
    slug: 'building-the-machine',
    name: 'Building the Machine',
    description: 'MVP development, growth hacking, and guerrilla marketing. Share growth experiments, sales best practices, and execution strategies.',
    memberCount: 621,
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop',
    tags: ['Growth', 'MVP', 'Sales'],
  },
  {
    slug: 'ai-power',
    name: 'AI Power',
    description: 'Maximizing developer speed and operational bandwidth. Swap prompt engineering tactics, share Cursor setups, and benchmark local models like Ollama or Qwen for zero-cost deployments.',
    memberCount: 723,
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop',
    tags: ['AI', 'Developer Tools', 'Automation'],
  },
  {
    slug: 'the-acquisition-machine',
    name: 'The Acquisition Machine',
    description: 'Crafting undeniable value and tracking acquisition. Ruthlessly critique pricing and guarantees, and share raw CPA data on cold outreach and paid ads.',
    memberCount: 389,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
    tags: ['Acquisition', 'Pricing', 'Marketing'],
  },
  {
    slug: 'scaling-and-systems',
    name: 'Scaling & Systems',
    description: 'The 100 Tasks framework and aggressive operational scaling. Remove yourself from daily client delivery with SOPs, B2B partnerships, and Zapier or Make automations.',
    memberCount: 312,
    image: 'https://images.unsplash.com/photo-1512758017271-d7b84c2113f1?w=400&h=300&fit=crop',
    tags: ['Scaling', 'Automation', 'Operations'],
  },
  {
    slug: 'the-firing-squad',
    name: 'The Firing Squad',
    description: 'Radical transparency and unvarnished feedback. Debut completed MVPs, recruit beta testers, and absorb brutally honest, ego-free feedback on UX and conversion.',
    memberCount: 278,
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop',
    tags: ['Feedback', 'Beta Testing', 'MVP'],
  },
  {
    slug: 'mexico-operations',
    name: 'Mexico Operations',
    description: 'Navigating Mexican bureaucracy and compliance. Optimize taxes under RESICO vs. Persona Física, structure IMSS and Infonavit for hires, and draft local service contracts.',
    memberCount: 198,
    image: 'https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=400&h=300&fit=crop',
    tags: ['Mexico', 'Compliance', 'Tax'],
  },
  {
    slug: 'wealth-and-investments',
    name: 'Wealth & Investments',
    description: 'Capitalization, yield generation, and the financial endgame. Manage portfolios on GBM, maximize yield through SOFIPOs and P2P lending, and structure long-term wealth like Segubeca.',
    memberCount: 345,
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=300&fit=crop',
    tags: ['Wealth', 'Investing', 'FIRE'],
  },
];
