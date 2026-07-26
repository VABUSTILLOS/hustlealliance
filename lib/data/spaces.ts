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
    slug: 'saas-founders',
    name: 'SaaS Founders',
    description: 'For founders building B2B and B2C SaaS products. Share learnings, get feedback, and grow together.',
    memberCount: 842,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
    tags: ['SaaS', 'B2B', 'Product'],
  },
  {
    slug: 'women-in-tech',
    name: 'Women in Tech',
    description: 'A supportive space for women founders, engineers, and operators in the tech industry.',
    memberCount: 456,
    image: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=400&h=300&fit=crop',
    tags: ['Community', 'DEI'],
  },
  {
    slug: 'climate-tech',
    name: 'Climate Tech',
    description: 'Founders building solutions for a sustainable future. Clean energy, carbon capture, circular economy, and more.',
    memberCount: 234,
    image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&h=300&fit=crop',
    tags: ['Climate', 'Sustainability', 'Hard Tech'],
  },
  {
    slug: 'ai-ml-builders',
    name: 'AI/ML Builders',
    description: 'Deep dive into artificial intelligence and machine learning. Share papers, models, and startup ideas.',
    memberCount: 621,
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop',
    tags: ['AI', 'Machine Learning', 'Deep Tech'],
  },
  {
    slug: 'fundraising-hub',
    name: 'Fundraising Hub',
    description: 'Everything fundraising. Share investor contacts, get pitch feedback, and celebrate your closes.',
    memberCount: 389,
    image: 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?w=400&h=300&fit=crop',
    tags: ['Fundraising', 'VC', 'Pitching'],
  },
  {
    slug: 'creator-economy',
    name: 'Creator Economy',
    description: 'For founders building tools and platforms for creators. Newsletter, podcast, and course builders welcome.',
    memberCount: 198,
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop',
    tags: ['Creator', 'Media', 'Community'],
  },
];
