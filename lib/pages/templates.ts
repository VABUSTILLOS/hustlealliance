import type { Block, BlockType } from '@/lib/pages/blocks';

/**
 * Starter templates for the "New page" flow. Each template is a named,
 * described set of pre-populated blocks covering common landing-page
 * archetypes. Blocks are given fresh, stable ids at selection time (see
 * `instantiateTemplate`) so multiple pages created from the same template
 * don't share block identity.
 */

export type PageTemplate = {
  id: string;
  name: string;
  description: string;
  blocks: Array<{ type: BlockType; props: Record<string, unknown> }>;
};

export const PAGE_TEMPLATES: PageTemplate[] = [
  {
    id: 'blank',
    name: 'Blank',
    description: 'Start from a single hero section and build up from scratch.',
    blocks: [
      {
        type: 'hero',
        props: {
          eyebrow: '',
          headline: 'Your headline here',
          subheadline: '',
          primaryCta: { label: 'Get started', href: '#' },
          align: 'center',
        },
      },
    ],
  },
  {
    id: 'course-launch',
    name: 'Course launch',
    description: 'Announce a new course with a countdown, curriculum highlights, and pricing.',
    blocks: [
      {
        type: 'hero',
        props: {
          eyebrow: 'New course',
          headline: 'Master the skill that changes everything',
          subheadline: 'Enroll now before doors close.',
          primaryCta: { label: 'Enroll now', href: '#pricing' },
          align: 'center',
        },
      },
      {
        type: 'countdown',
        props: { heading: 'Enrollment closes in', targetDate: '', expiredMessage: 'Enrollment has closed.' },
      },
      {
        type: 'features',
        props: {
          heading: "What you'll learn",
          columns: 3,
          items: [
            { icon: '🎯', title: 'Focused curriculum', description: 'No fluff, just outcomes.' },
            { icon: '🎥', title: 'Video lessons', description: 'Learn at your own pace.' },
            { icon: '🏆', title: 'Certificate', description: 'Prove what you know.' },
          ],
        },
      },
      { type: 'stats', props: { items: [{ value: '2,400+', label: 'Students' }, { value: '4.9★', label: 'Avg rating' }, { value: '92%', label: 'Completion' }] } },
      { type: 'pricing', props: { heading: 'Pricing', tiers: [{ name: 'Course', price: '$199', period: 'one-time', features: ['Lifetime access', 'Certificate'], cta: { label: 'Enroll now', href: '#' }, highlighted: true }] } },
      { type: 'testimonials', props: { heading: 'What students say', items: [] } },
      { type: 'faq', props: { heading: 'Frequently asked questions', items: [] } },
      { type: 'cta', props: { heading: 'Ready to start?', button: { label: 'Enroll now', href: '#' } } },
    ],
  },
  {
    id: 'lead-magnet',
    name: 'Lead magnet',
    description: 'Capture emails with a free resource in exchange for a signup.',
    blocks: [
      {
        type: 'hero',
        props: {
          eyebrow: 'Free download',
          headline: 'Get the free guide',
          subheadline: 'Join thousands of readers getting our best content.',
          align: 'center',
        },
      },
      { type: 'lead-form', props: { heading: 'Get instant access', buttonLabel: 'Send me the guide', tag: 'lead-magnet' } },
      { type: 'logo-cloud', props: { heading: 'As seen in', logos: [] } },
      { type: 'testimonials', props: { heading: 'What readers say', items: [] } },
    ],
  },
  {
    id: 'coaching-offer',
    name: 'Coaching offer',
    description: '1:1 or group coaching offer with social proof and application form.',
    blocks: [
      {
        type: 'hero',
        props: {
          eyebrow: 'Coaching',
          headline: 'Work with me 1:1',
          subheadline: 'Limited spots each month.',
          primaryCta: { label: 'Apply now', href: '#form' },
          align: 'left',
        },
      },
      { type: 'stats', props: { items: [{ value: '150+', label: 'Clients coached' }, { value: '5 yrs', label: 'Experience' }] } },
      { type: 'testimonials', props: { heading: 'Client results', items: [] } },
      { type: 'pricing', props: { heading: 'Packages', tiers: [] } },
      { type: 'lead-form', props: { heading: 'Apply now', buttonLabel: 'Request a call', tag: 'coaching-lead' } },
      { type: 'faq', props: { heading: 'Questions', items: [] } },
    ],
  },
  {
    id: 'webinar-signup',
    name: 'Webinar signup',
    description: 'Drive registrations for a live or evergreen webinar.',
    blocks: [
      {
        type: 'hero',
        props: {
          eyebrow: 'Free live training',
          headline: 'Join the free webinar',
          subheadline: 'Seats are limited — save yours now.',
          align: 'center',
        },
      },
      { type: 'countdown', props: { heading: 'Starts in', targetDate: '', expiredMessage: 'This webinar has ended.' } },
      { type: 'lead-form', props: { heading: 'Reserve your seat', buttonLabel: 'Save my seat', tag: 'webinar' } },
      { type: 'features', props: { heading: "What you'll learn", columns: 3, items: [] } },
      { type: 'testimonials', props: { heading: 'From past attendees', items: [] } },
    ],
  },
  {
    id: 'product-sales',
    name: 'Product sales',
    description: 'Sell a single product with a gallery, gallery of proof, and a direct buy button.',
    blocks: [
      {
        type: 'hero',
        props: {
          eyebrow: 'New product',
          headline: 'Meet your new favorite tool',
          subheadline: 'Everything you need, nothing you don\u2019t.',
          align: 'center',
        },
      },
      { type: 'gallery', props: { columns: 3, images: [] } },
      { type: 'features', props: { heading: 'Why you\u2019ll love it', columns: 3, items: [] } },
      { type: 'buy-button', props: { productSlug: '', label: 'Buy now', style: 'primary' } },
      { type: 'testimonials', props: { heading: 'Customer reviews', items: [] } },
      { type: 'spacer', props: { size: 'md' } },
      { type: 'cta', props: { heading: 'Ready to buy?', button: { label: 'Buy now', href: '#' } } },
    ],
  },
];

/** Produces a fresh, independent copy of a template's blocks with new ids. */
export function instantiateTemplate(template: PageTemplate): Block[] {
  return template.blocks.map((b) => ({
    id:
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `blk_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    type: b.type,
    props: { ...b.props },
  }));
}

export function getTemplate(id: string): PageTemplate | undefined {
  return PAGE_TEMPLATES.find((t) => t.id === id);
}
