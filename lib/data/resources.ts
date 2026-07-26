// Resources data: PDF books, guides, templates, spreadsheets
// Searchable, filterable library for entrepreneurs

export type ResourceType = 'pdf' | 'guide' | 'template' | 'spreadsheet' | 'ebook';

export interface Resource {
  id: string;
  title: string;
  type: ResourceType;
  description: string;
  thumbnail: string; // gradient placeholder
  downloadUrl: string; // mock link
  tags: string[];
  fileSize: string;
  format: string;
  downloads: number; // mock count
  featured?: boolean;
}

export const resources: Resource[] = [
  {
    id: 'r1',
    title: 'The Ultimate Pitch Deck Template',
    type: 'template',
    description: 'A 12-slide structure that wins investors. Based on the decks that raised over $500M combined. Includes speaker notes and design guidelines.',
    thumbnail: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
    downloadUrl: '#',
    tags: ['fundraising', 'pitching'],
    fileSize: '2.4 MB',
    format: 'PPTX',
    downloads: 4821,
    featured: true,
  },
  {
    id: 'r2',
    title: 'SaaS Financial Model 2026',
    type: 'spreadsheet',
    description: 'Plug-and-play financial model with revenue projections, churn analysis, CAC/LTV ratios, and runway calculator. Built by a former VC analyst.',
    thumbnail: 'linear-gradient(135deg, #059669, #34d399)',
    downloadUrl: '#',
    tags: ['fundraising', 'operations'],
    fileSize: '1.8 MB',
    format: 'XLSX',
    downloads: 3204,
    featured: true,
  },
  {
    id: 'r3',
    title: 'Founder Mental Health Playbook',
    type: 'guide',
    description: 'Practical strategies for managing burnout, anxiety, and the emotional rollercoaster of building a startup. Written by a clinical psychologist who coaches founders.',
    thumbnail: 'linear-gradient(135deg, #dc2626, #f87171)',
    downloadUrl: '#',
    tags: ['mental-health', 'operations'],
    fileSize: '3.1 MB',
    format: 'PDF',
    downloads: 2156,
  },
  {
    id: 'r4',
    title: 'Cold Email Outreach Templates',
    type: 'template',
    description: '12 proven cold email templates for sales, partnerships, press outreach, and investor introductions. Includes A/B testing notes.',
    thumbnail: 'linear-gradient(135deg, #2563eb, #60a5fa)',
    downloadUrl: '#',
    tags: ['marketing', 'sales'],
    fileSize: '890 KB',
    format: 'PDF',
    downloads: 3890,
    featured: true,
  },
  {
    id: 'r5',
    title: 'Product Roadmap Framework',
    type: 'spreadsheet',
    description: 'A strategic product planning template with prioritization matrices, OKR tracking, and stakeholder communication templates.',
    thumbnail: 'linear-gradient(135deg, #9333ea, #c084fc)',
    downloadUrl: '#',
    tags: ['product', 'operations'],
    fileSize: '1.5 MB',
    format: 'XLSX',
    downloads: 2745,
  },
  {
    id: 'r6',
    title: 'LLC Formation Checklist (US)',
    type: 'guide',
    description: 'Step-by-step guide to forming an LLC in any US state. Includes state-by-state filing fees, EIN application walkthrough, and operating agreement template.',
    thumbnail: 'linear-gradient(135deg, #ca8a04, #facc15)',
    downloadUrl: '#',
    tags: ['legal', 'operations'],
    fileSize: '4.2 MB',
    format: 'PDF',
    downloads: 5632,
    featured: true,
  },
  {
    id: 'r7',
    title: 'Social Media Content Calendar',
    type: 'spreadsheet',
    description: '30-day content calendar with post ideas, best times to post, hashtag strategies, and engagement tracking for Instagram, LinkedIn, and Twitter/X.',
    thumbnail: 'linear-gradient(135deg, #db2777, #f472b6)',
    downloadUrl: '#',
    tags: ['marketing', 'social-media'],
    fileSize: '1.1 MB',
    format: 'XLSX',
    downloads: 4102,
  },
  {
    id: 'r8',
    title: 'Startup Co-Founder Agreement',
    type: 'template',
    description: 'Legal template for co-founder equity split, vesting schedules, IP assignment, and decision-making frameworks. Reviewed by startup attorneys.',
    thumbnail: 'linear-gradient(135deg, #0d9488, #5eead4)',
    downloadUrl: '#',
    tags: ['legal'],
    fileSize: '650 KB',
    format: 'DOCX',
    downloads: 3456,
  },
  {
    id: 'r9',
    title: 'Customer Persona Builder',
    type: 'template',
    description: 'Interactive template to build detailed customer personas. Includes demographic, psychographic, and behavioral frameworks.',
    thumbnail: 'linear-gradient(135deg, #4f46e5, #818cf8)',
    downloadUrl: '#',
    tags: ['marketing', 'product'],
    fileSize: '720 KB',
    format: 'PDF',
    downloads: 2987,
  },
  {
    id: 'r10',
    title: 'Lean Startup Experiment Tracker',
    type: 'spreadsheet',
    description: 'Track your build-measure-learn cycles. Hypothesis templates, experiment logs, and pivot/double-down decision framework.',
    thumbnail: 'linear-gradient(135deg, #ea580c, #fb923c)',
    downloadUrl: '#',
    tags: ['product', 'operations'],
    fileSize: '980 KB',
    format: 'XLSX',
    downloads: 1876,
  },
  {
    id: 'r11',
    title: 'Investor CRM Tracker',
    type: 'spreadsheet',
    description: 'Track every investor conversation. Warm intro tracking, meeting notes, follow-up automation templates, and fund fit scoring.',
    thumbnail: 'linear-gradient(135deg, #b45389, #f9a8d4)',
    downloadUrl: '#',
    tags: ['fundraising', 'sales'],
    fileSize: '1.3 MB',
    format: 'XLSX',
    downloads: 2340,
  },
  {
    id: 'r12',
    title: 'SEO Content Strategy Guide',
    type: 'ebook',
    description: 'Complete SEO playbook for early-stage startups. Keyword research, content clusters, backlink strategies, and technical SEO checklist.',
    thumbnail: 'linear-gradient(135deg, #0891b2, #67e8f9)',
    downloadUrl: '#',
    tags: ['marketing', 'growth'],
    fileSize: '5.8 MB',
    format: 'PDF',
    downloads: 5210,
    featured: true,
  },
  {
    id: 'r13',
    title: 'Terms of Service & Privacy Policy Pack',
    type: 'template',
    description: 'Ready-to-customize ToS and Privacy Policy templates for SaaS, e-commerce, and marketplace businesses. GDPR/CCPA compliant drafts.',
    thumbnail: 'linear-gradient(135deg, #64748b, #94a3b8)',
    downloadUrl: '#',
    tags: ['legal'],
    fileSize: '820 KB',
    format: 'DOCX',
    downloads: 6721,
  },
  {
    id: 'r14',
    title: 'Customer Interview Script',
    type: 'template',
    description: 'Structured interview guide with 25 questions that uncover real pain points. Includes note-taking framework and insight synthesis templates.',
    thumbnail: 'linear-gradient(135deg, #166534, #4ade80)',
    downloadUrl: '#',
    tags: ['product', 'marketing'],
    fileSize: '540 KB',
    format: 'PDF',
    downloads: 1980,
  },
];

// --- Helper functions ---

export function getResourceById(id: string): Resource | undefined {
  return resources.find((r) => r.id === id);
}

export function getResourcesByType(type: ResourceType | 'all'): Resource[] {
  if (type === 'all') return resources;
  return resources.filter((r) => r.type === type);
}

export function getResourcesByTag(tag: string): Resource[] {
  return resources.filter((r) => r.tags.includes(tag));
}

export function searchResources(query: string): Resource[] {
  const q = query.toLowerCase();
  return resources.filter(
    (r) =>
      r.title.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.tags.some((t) => t.toLowerCase().includes(q))
  );
}

export function getRelatedResources(id: string, limit = 3): Resource[] {
  const resource = getResourceById(id);
  if (!resource) return [];
  const others = resources.filter((r) => r.id !== id);
  // Score by shared tags
  const scored = others.map((r) => ({
    resource: r,
    score: r.tags.filter((t) => resource.tags.includes(t)).length,
  }));
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.resource);
}

export function getAllTags(): string[] {
  const tagSet = new Set<string>();
  resources.forEach((r) => r.tags.forEach((t) => tagSet.add(t)));
  return [...tagSet].sort();
}

export const resourceTypeLabels: Record<ResourceType | 'all', string> = {
  all: 'All',
  pdf: 'PDF',
  guide: 'Guide',
  template: 'Template',
  spreadsheet: 'Spreadsheet',
  ebook: 'eBook',
};
