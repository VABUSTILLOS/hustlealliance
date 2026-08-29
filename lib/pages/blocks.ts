import { z } from 'zod';

/**
 * Landing page block/section schema for the drag-and-drop page builder.
 *
 * The `blocks` Json column on `LandingPage` stores an array of `Block`
 * objects (see `PageDocumentSchema`). Each block has a stable `id`, a
 * `type` discriminant, a freeform `props` bag specific to that type, and
 * an optional `position` (x/y nudge offsets, in pixels, relative to its
 * normal flow position within the canvas) so the freeform drag layer can
 * be layered on top of the reorderable list without changing document
 * order semantics.
 *
 * Keep this forward-compatible: new block types should be added as new
 * members of `BlockTypeSchema` + a new props schema, and unknown/legacy
 * props should never be required so older documents keep validating.
 */

export const BLOCK_TYPES = [
  'hero',
  'features',
  'pricing',
  'testimonials',
  'cta',
  'faq',
  'richtext',
  'image',
  'video',
  'embed',
  'countdown',
  'stats',
  'logo-cloud',
  'lead-form',
  'buy-button',
  'gallery',
  'spacer',
] as const;

export type BlockType = (typeof BLOCK_TYPES)[number];

export const BlockTypeSchema = z.enum(BLOCK_TYPES);

/** Freeform x/y nudge offsets within a block's section, in pixels. */
export const PositionSchema = z
  .object({
    x: z.number().finite().default(0),
    y: z.number().finite().default(0),
  })
  .partial()
  .optional();

export type Position = z.infer<typeof PositionSchema>;

const ButtonSchema = z.object({
  label: z.string().default(''),
  href: z.string().default('#'),
});

export const HeroPropsSchema = z.object({
  eyebrow: z.string().optional().default(''),
  headline: z.string().default('Your headline here'),
  subheadline: z.string().optional().default(''),
  primaryCta: ButtonSchema.optional(),
  secondaryCta: ButtonSchema.optional(),
  imageUrl: z.string().optional().default(''),
  align: z.enum(['left', 'center']).optional().default('center'),
});

export const FeatureItemSchema = z.object({
  icon: z.string().optional().default(''),
  title: z.string().default(''),
  description: z.string().optional().default(''),
});

export const FeaturesPropsSchema = z.object({
  heading: z.string().optional().default('Features'),
  subheading: z.string().optional().default(''),
  columns: z.number().int().min(1).max(4).optional().default(3),
  items: z.array(FeatureItemSchema).default([]),
});

export const PricingTierSchema = z.object({
  name: z.string().default(''),
  price: z.string().default(''),
  period: z.string().optional().default(''),
  description: z.string().optional().default(''),
  features: z.array(z.string()).default([]),
  cta: ButtonSchema.optional(),
  highlighted: z.boolean().optional().default(false),
});

export const PricingPropsSchema = z.object({
  heading: z.string().optional().default('Pricing'),
  subheading: z.string().optional().default(''),
  tiers: z.array(PricingTierSchema).default([]),
});

export const TestimonialItemSchema = z.object({
  quote: z.string().default(''),
  name: z.string().default(''),
  role: z.string().optional().default(''),
  avatarUrl: z.string().optional().default(''),
});

export const TestimonialsPropsSchema = z.object({
  heading: z.string().optional().default('What people are saying'),
  items: z.array(TestimonialItemSchema).default([]),
});

export const CtaPropsSchema = z.object({
  heading: z.string().default('Ready to get started?'),
  subheading: z.string().optional().default(''),
  button: ButtonSchema.optional(),
});

export const FaqItemSchema = z.object({
  question: z.string().default(''),
  answer: z.string().default(''),
});

export const FaqPropsSchema = z.object({
  heading: z.string().optional().default('Frequently asked questions'),
  items: z.array(FaqItemSchema).default([]),
});

export const RichTextPropsSchema = z.object({
  html: z.string().optional().default(''),
});

export const ImagePropsSchema = z.object({
  src: z.string().optional().default(''),
  alt: z.string().optional().default(''),
  caption: z.string().optional().default(''),
});

export const VideoPropsSchema = z.object({
  src: z.string().optional().default(''),
  poster: z.string().optional().default(''),
  autoplay: z.boolean().optional().default(false),
});

export const EmbedPropsSchema = z.object({
  html: z.string().optional().default(''),
  url: z.string().optional().default(''),
});

export const CountdownPropsSchema = z.object({
  heading: z.string().optional().default(''),
  targetDate: z.string().optional().default(''),
  expiredMessage: z.string().optional().default('Offer expired'),
});

export const StatItemSchema = z.object({
  value: z.string().default(''),
  label: z.string().default(''),
});

export const StatsPropsSchema = z.object({
  items: z.array(StatItemSchema).default([]),
});

export const LogoItemSchema = z.object({
  src: z.string().default(''),
  alt: z.string().optional().default(''),
});

export const LogoCloudPropsSchema = z.object({
  heading: z.string().optional().default(''),
  logos: z.array(LogoItemSchema).default([]),
});

export const LeadFormPropsSchema = z.object({
  heading: z.string().optional().default('Get instant access'),
  subheading: z.string().optional().default(''),
  buttonLabel: z.string().optional().default('Subscribe'),
  successMessage: z.string().optional().default("You're in! Check your inbox."),
  tag: z.string().optional().default(''),
  collectName: z.boolean().optional().default(false),
  thankYouRedirect: z.string().optional().default(''),
});

export const BuyButtonPropsSchema = z.object({
  productSlug: z.string().optional().default(''),
  label: z.string().optional().default('Buy now'),
  style: z.enum(['primary', 'secondary']).optional().default('primary'),
});

export const GalleryImageSchema = z.object({
  src: z.string().default(''),
  alt: z.string().optional().default(''),
});

export const GalleryPropsSchema = z.object({
  images: z.array(GalleryImageSchema).default([]),
  columns: z.union([z.literal(2), z.literal(3), z.literal(4)]).optional().default(3),
});

export const SpacerPropsSchema = z.object({
  size: z.enum(['sm', 'md', 'lg']).optional().default('md'),
});

/** Maps a block type to its props schema. Used for per-type validation. */
export const BLOCK_PROPS_SCHEMAS = {
  hero: HeroPropsSchema,
  features: FeaturesPropsSchema,
  pricing: PricingPropsSchema,
  testimonials: TestimonialsPropsSchema,
  cta: CtaPropsSchema,
  faq: FaqPropsSchema,
  richtext: RichTextPropsSchema,
  image: ImagePropsSchema,
  video: VideoPropsSchema,
  embed: EmbedPropsSchema,
  countdown: CountdownPropsSchema,
  stats: StatsPropsSchema,
  'logo-cloud': LogoCloudPropsSchema,
  'lead-form': LeadFormPropsSchema,
  'buy-button': BuyButtonPropsSchema,
  gallery: GalleryPropsSchema,
  spacer: SpacerPropsSchema,
} as const satisfies Record<BlockType, z.ZodTypeAny>;

/**
 * A single block. Props are intentionally left as a loosely-typed record
 * at the discriminated-union level (validated more strictly per-type by
 * `validateBlock`) so unknown/legacy documents don't fail hard parsing.
 */
export const BlockSchema = z.object({
  id: z.string().min(1),
  type: BlockTypeSchema,
  props: z.record(z.string(), z.unknown()).default({}),
  position: PositionSchema,
});

export type Block = {
  id: string;
  type: BlockType;
  props: Record<string, unknown>;
  position?: Position;
};

/** The full document stored in `LandingPage.blocks`. */
export const PageDocumentSchema = z.array(BlockSchema).default([]);
export type PageDocument = Block[];

export const SeoSchema = z
  .object({
    title: z.string().optional(),
    description: z.string().optional(),
    ogImage: z.string().optional(),
  })
  .partial()
  .optional()
  .nullable();
export type Seo = z.infer<typeof SeoSchema>;

export const ThemeSchema = z
  .object({
    background: z.string().optional(),
    accent: z.string().optional(),
    headingFont: z.enum(['inter', 'bebas', 'mono']).optional(),
    headCode: z.string().max(20000).optional(),
    bodyCode: z.string().max(20000).optional(),
  })
  .partial()
  .optional()
  .nullable();
export type Theme = z.infer<typeof ThemeSchema>;

/** Validates and coerces a raw blocks array, throwing a ZodError on failure. */
export function parsePageDocument(input: unknown): PageDocument {
  return PageDocumentSchema.parse(input) as PageDocument;
}

/** Validates the whole document, returning a safe-parse result (no throw). */
export function safeParsePageDocument(input: unknown) {
  return PageDocumentSchema.safeParse(input);
}

/** Validates a single block's `props` against its type-specific schema. */
export function validateBlockProps(type: BlockType, props: unknown) {
  const schema = BLOCK_PROPS_SCHEMAS[type];
  return schema.safeParse(props);
}

export const BLOCK_LABELS: Record<BlockType, string> = {
  hero: 'Hero',
  features: 'Features',
  pricing: 'Pricing',
  testimonials: 'Testimonials',
  cta: 'Call to Action',
  faq: 'FAQ',
  richtext: 'Rich Text',
  image: 'Image',
  video: 'Video',
  embed: 'Embed',
  countdown: 'Countdown',
  stats: 'Stats',
  'logo-cloud': 'Logo Cloud',
  'lead-form': 'Lead Form',
  'buy-button': 'Buy Button',
  gallery: 'Gallery',
  spacer: 'Spacer',
};

/** Returns a fresh block of the given type with sensible default props. */
export function createDefaultBlock(type: BlockType): Block {
  const schema = BLOCK_PROPS_SCHEMAS[type];
  const props = schema.parse({}) as Record<string, unknown>;
  const id = typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `blk_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  return { id, type, props };
}
