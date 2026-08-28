import type {
  Block,
  HeroPropsSchema,
  FeaturesPropsSchema,
  PricingPropsSchema,
  TestimonialsPropsSchema,
  CtaPropsSchema,
  FaqPropsSchema,
  RichTextPropsSchema,
  ImagePropsSchema,
  VideoPropsSchema,
  EmbedPropsSchema,
} from '@/lib/pages/blocks';
import type { z } from 'zod';

/**
 * Presentational (read-only) renderers for each block type. These are
 * shared between the admin canvas preview and the public `/p/[slug]`
 * renderer so both surfaces stay pixel-identical. Props are cast loosely
 * since the stored JSON may be a partial/legacy shape; each renderer
 * defends with fallbacks.
 */

function HeroBlock({ props }: { props: Partial<z.infer<typeof HeroPropsSchema>> }) {
  const align = props.align === 'left' ? 'items-start text-left' : 'items-center text-center';
  return (
    <section className={`flex flex-col ${align} gap-4 px-6 py-16 md:py-24`}>
      {props.eyebrow ? (
        <span className="text-sm font-medium uppercase tracking-wide text-accent">{props.eyebrow}</span>
      ) : null}
      <h1 className="text-3xl md:text-5xl font-heading font-bold text-foreground max-w-3xl">
        {props.headline || 'Your headline here'}
      </h1>
      {props.subheadline ? (
        <p className="text-muted text-base md:text-lg max-w-2xl">{props.subheadline}</p>
      ) : null}
      <div className="flex gap-3 mt-2">
        {props.primaryCta?.label ? (
          <a
            href={props.primaryCta.href || '#'}
            className="px-5 py-2.5 bg-accent text-white rounded-xl font-medium text-sm hover:bg-accent/90 transition-colors"
          >
            {props.primaryCta.label}
          </a>
        ) : null}
        {props.secondaryCta?.label ? (
          <a
            href={props.secondaryCta.href || '#'}
            className="px-5 py-2.5 bg-surface-light text-foreground rounded-xl font-medium text-sm hover:bg-surface transition-colors"
          >
            {props.secondaryCta.label}
          </a>
        ) : null}
      </div>
      {props.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={props.imageUrl} alt="" className="mt-8 rounded-2xl max-w-full" />
      ) : null}
    </section>
  );
}

function FeaturesBlock({ props }: { props: Partial<z.infer<typeof FeaturesPropsSchema>> }) {
  const cols = props.columns || 3;
  const gridCols =
    cols === 1 ? 'grid-cols-1' : cols === 2 ? 'grid-cols-1 md:grid-cols-2' : cols === 4 ? 'grid-cols-1 md:grid-cols-4' : 'grid-cols-1 md:grid-cols-3';
  return (
    <section className="px-6 py-16">
      <div className="text-center max-w-2xl mx-auto mb-10">
        {props.heading ? <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground">{props.heading}</h2> : null}
        {props.subheading ? <p className="text-muted mt-2">{props.subheading}</p> : null}
      </div>
      <div className={`grid ${gridCols} gap-6 max-w-5xl mx-auto`}>
        {(props.items || []).map((item, i) => (
          <div key={i} className="p-6 rounded-2xl bg-surface-light">
            {item.icon ? <div className="text-2xl mb-3">{item.icon}</div> : null}
            <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
            {item.description ? <p className="text-muted text-sm">{item.description}</p> : null}
          </div>
        ))}
      </div>
    </section>
  );
}

function PricingBlock({ props }: { props: Partial<z.infer<typeof PricingPropsSchema>> }) {
  return (
    <section className="px-6 py-16">
      <div className="text-center max-w-2xl mx-auto mb-10">
        {props.heading ? <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground">{props.heading}</h2> : null}
        {props.subheading ? <p className="text-muted mt-2">{props.subheading}</p> : null}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {(props.tiers || []).map((tier, i) => (
          <div
            key={i}
            className={`p-6 rounded-2xl border ${tier.highlighted ? 'border-accent bg-accent/5' : 'border-border bg-surface-light'}`}
          >
            <h3 className="font-semibold text-foreground">{tier.name}</h3>
            <div className="mt-2 mb-1">
              <span className="text-2xl font-bold text-foreground">{tier.price}</span>
              {tier.period ? <span className="text-muted text-sm"> /{tier.period}</span> : null}
            </div>
            {tier.description ? <p className="text-muted text-sm mb-4">{tier.description}</p> : null}
            <ul className="space-y-2 mb-4">
              {(tier.features || []).map((f, fi) => (
                <li key={fi} className="text-sm text-foreground/90">✓ {f}</li>
              ))}
            </ul>
            {tier.cta?.label ? (
              <a
                href={tier.cta.href || '#'}
                className="block text-center px-4 py-2 bg-accent text-white rounded-xl font-medium text-sm hover:bg-accent/90 transition-colors"
              >
                {tier.cta.label}
              </a>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

function TestimonialsBlock({ props }: { props: Partial<z.infer<typeof TestimonialsPropsSchema>> }) {
  return (
    <section className="px-6 py-16">
      {props.heading ? (
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground text-center mb-10">{props.heading}</h2>
      ) : null}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {(props.items || []).map((item, i) => (
          <div key={i} className="p-6 rounded-2xl bg-surface-light">
            <p className="text-foreground/90 italic mb-4">&ldquo;{item.quote}&rdquo;</p>
            <div className="flex items-center gap-3">
              {item.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.avatarUrl} alt="" className="w-9 h-9 rounded-full object-cover" />
              ) : null}
              <div>
                <div className="font-medium text-sm text-foreground">{item.name}</div>
                {item.role ? <div className="text-xs text-muted">{item.role}</div> : null}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CtaBlock({ props }: { props: Partial<z.infer<typeof CtaPropsSchema>> }) {
  return (
    <section className="px-6 py-16 text-center bg-surface-light rounded-3xl mx-4 md:mx-auto max-w-4xl">
      <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground">{props.heading}</h2>
      {props.subheading ? <p className="text-muted mt-2 mb-6">{props.subheading}</p> : null}
      {props.button?.label ? (
        <a
          href={props.button.href || '#'}
          className="inline-block mt-6 px-6 py-3 bg-accent text-white rounded-xl font-medium hover:bg-accent/90 transition-colors"
        >
          {props.button.label}
        </a>
      ) : null}
    </section>
  );
}

function FaqBlock({ props }: { props: Partial<z.infer<typeof FaqPropsSchema>> }) {
  return (
    <section className="px-6 py-16 max-w-3xl mx-auto">
      {props.heading ? <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-8 text-center">{props.heading}</h2> : null}
      <div className="space-y-4">
        {(props.items || []).map((item, i) => (
          <details key={i} className="p-4 rounded-xl bg-surface-light group">
            <summary className="cursor-pointer font-medium text-foreground">{item.question}</summary>
            <p className="text-muted text-sm mt-2">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function RichTextBlock({ props }: { props: Partial<z.infer<typeof RichTextPropsSchema>> }) {
  return (
    <section className="px-6 py-10 max-w-3xl mx-auto prose prose-invert">
      <div dangerouslySetInnerHTML={{ __html: props.html || '' }} />
    </section>
  );
}

function ImageBlock({ props }: { props: Partial<z.infer<typeof ImagePropsSchema>> }) {
  if (!props.src) return null;
  return (
    <section className="px-6 py-10 max-w-4xl mx-auto text-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={props.src} alt={props.alt || ''} className="rounded-2xl max-w-full mx-auto" />
      {props.caption ? <p className="text-muted text-sm mt-2">{props.caption}</p> : null}
    </section>
  );
}

function VideoBlock({ props }: { props: Partial<z.infer<typeof VideoPropsSchema>> }) {
  if (!props.src) return null;
  return (
    <section className="px-6 py-10 max-w-4xl mx-auto">
      <video
        src={props.src}
        poster={props.poster || undefined}
        autoPlay={!!props.autoplay}
        controls
        className="rounded-2xl w-full"
      />
    </section>
  );
}

function EmbedBlock({ props }: { props: Partial<z.infer<typeof EmbedPropsSchema>> }) {
  if (props.html) {
    return (
      <section className="px-6 py-10 max-w-4xl mx-auto">
        <div dangerouslySetInnerHTML={{ __html: props.html }} />
      </section>
    );
  }
  if (props.url) {
    return (
      <section className="px-6 py-10 max-w-4xl mx-auto">
        <iframe src={props.url} className="w-full aspect-video rounded-2xl" allowFullScreen />
      </section>
    );
  }
  return null;
}

/** Renders a single block by type, dispatching to its presentational component. */
export function BlockRenderer({ block }: { block: Block }) {
  switch (block.type) {
    case 'hero':
      return <HeroBlock props={block.props} />;
    case 'features':
      return <FeaturesBlock props={block.props} />;
    case 'pricing':
      return <PricingBlock props={block.props} />;
    case 'testimonials':
      return <TestimonialsBlock props={block.props} />;
    case 'cta':
      return <CtaBlock props={block.props} />;
    case 'faq':
      return <FaqBlock props={block.props} />;
    case 'richtext':
      return <RichTextBlock props={block.props} />;
    case 'image':
      return <ImageBlock props={block.props} />;
    case 'video':
      return <VideoBlock props={block.props} />;
    case 'embed':
      return <EmbedBlock props={block.props} />;
    default:
      return null;
  }
}

/** Renders an ordered list of blocks (the full page document). */
export function PageBody({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((block) => (
        <BlockRenderer key={block.id} block={block} />
      ))}
    </>
  );
}
