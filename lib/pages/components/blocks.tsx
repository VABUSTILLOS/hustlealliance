'use client';

import { useEffect, useState } from 'react';
import { getAttribution } from '@/app/components/page-tracker';
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
  CountdownPropsSchema,
  StatsPropsSchema,
  LogoCloudPropsSchema,
  LeadFormPropsSchema,
  BuyButtonPropsSchema,
  GalleryPropsSchema,
  SpacerPropsSchema,
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

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function CountdownBlock({ props }: { props: Partial<z.infer<typeof CountdownPropsSchema>> }) {
  const target = props.targetDate ? new Date(props.targetDate).getTime() : NaN;
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    if (Number.isNaN(target)) return;
    const tick = () => setRemaining(Math.max(0, target - Date.now()));
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [target]);

  if (Number.isNaN(target)) return null;

  const expired = remaining !== null && remaining <= 0;
  const days = remaining ? Math.floor(remaining / (1000 * 60 * 60 * 24)) : 0;
  const hours = remaining ? Math.floor((remaining / (1000 * 60 * 60)) % 24) : 0;
  const minutes = remaining ? Math.floor((remaining / (1000 * 60)) % 60) : 0;
  const seconds = remaining ? Math.floor((remaining / 1000) % 60) : 0;

  return (
    <section className="px-6 py-16 text-center">
      {props.heading ? (
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-6">{props.heading}</h2>
      ) : null}
      {expired ? (
        <p className="text-muted text-lg">{props.expiredMessage || 'Offer expired'}</p>
      ) : remaining === null ? null : (
        <div className="flex items-center justify-center gap-4 md:gap-8">
          {[
            { label: 'Days', value: days },
            { label: 'Hrs', value: hours },
            { label: 'Min', value: minutes },
            { label: 'Sec', value: seconds },
          ].map((unit) => (
            <div key={unit.label} className="flex flex-col items-center">
              <span className="text-3xl md:text-5xl font-bold text-accent tabular-nums">{pad(unit.value)}</span>
              <span className="text-xs uppercase tracking-wide text-muted mt-1">{unit.label}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function StatsBlock({ props }: { props: Partial<z.infer<typeof StatsPropsSchema>> }) {
  return (
    <section className="px-6 py-16">
      <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 max-w-4xl mx-auto">
        {(props.items || []).map((item, i) => (
          <div key={i} className="text-center">
            <div className="text-3xl md:text-4xl font-heading font-bold text-foreground">{item.value}</div>
            <div className="text-sm text-muted mt-1">{item.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function LogoCloudBlock({ props }: { props: Partial<z.infer<typeof LogoCloudPropsSchema>> }) {
  return (
    <section className="px-6 py-12">
      {props.heading ? (
        <p className="text-center text-sm text-muted mb-6 uppercase tracking-wide">{props.heading}</p>
      ) : null}
      <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 max-w-4xl mx-auto">
        {(props.logos || []).map((logo, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={i}
            src={logo.src}
            alt={logo.alt || ''}
            className="h-8 md:h-10 w-auto grayscale opacity-70 hover:opacity-100 transition-opacity"
          />
        ))}
      </div>
    </section>
  );
}

function LeadFormBlock({ props }: { props: Partial<z.infer<typeof LeadFormPropsSchema>> }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');
    try {
      const pageSlug = typeof window !== 'undefined' ? window.location.pathname.split('/').pop() : undefined;
      const attribution = getAttribution();
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          tag: props.tag || undefined,
          pageSlug,
          sessionId: attribution.sessionId,
          utm: attribution.utm ?? undefined,
          path: window.location.pathname,
        }),
      });
      setStatus(res.ok ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  };

  return (
    <section className="px-6 py-16 max-w-lg mx-auto text-center">
      {props.heading ? <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-2">{props.heading}</h2> : null}
      {props.subheading ? <p className="text-muted mb-6">{props.subheading}</p> : null}
      {status === 'success' ? (
        <p className="text-accent font-medium">{props.successMessage || "You're in! Check your inbox."}</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="flex-1 px-4 py-2.5 rounded-xl bg-surface-light text-foreground text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="px-5 py-2.5 bg-accent text-white rounded-xl font-medium text-sm hover:bg-accent/90 transition-colors disabled:opacity-50"
          >
            {status === 'loading' ? 'Submitting…' : props.buttonLabel || 'Subscribe'}
          </button>
        </form>
      )}
      {status === 'error' ? <p className="text-red-400 text-sm mt-2">Something went wrong. Try again.</p> : null}
    </section>
  );
}

function BuyButtonBlock({ props }: { props: Partial<z.infer<typeof BuyButtonPropsSchema>> }) {
  if (!props.productSlug) return null;
  const secondary = props.style === 'secondary';
  return (
    <section className="px-6 py-10 text-center">
      <a
        href={`/store/products/${props.productSlug}`}
        className={`inline-block px-6 py-3 rounded-xl font-medium transition-colors ${
          secondary
            ? 'bg-surface-light text-foreground hover:bg-border'
            : 'bg-accent text-white hover:bg-accent/90'
        }`}
      >
        {props.label || 'Buy now'}
      </a>
    </section>
  );
}

function GalleryBlock({ props }: { props: Partial<z.infer<typeof GalleryPropsSchema>> }) {
  const cols = props.columns || 3;
  const gridCols = cols === 2 ? 'grid-cols-1 md:grid-cols-2' : cols === 4 ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-2 md:grid-cols-3';
  return (
    <section className="px-6 py-10 max-w-5xl mx-auto">
      <div className={`grid ${gridCols} gap-4`}>
        {(props.images || []).map((img, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={i} src={img.src} alt={img.alt || ''} className="rounded-xl w-full aspect-square object-cover" />
        ))}
      </div>
    </section>
  );
}

const SPACER_SIZES: Record<string, string> = { sm: 'h-8', md: 'h-16', lg: 'h-32' };

function SpacerBlock({ props }: { props: Partial<z.infer<typeof SpacerPropsSchema>> }) {
  return <div className={SPACER_SIZES[props.size || 'md']} aria-hidden="true" />;
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
    case 'countdown':
      return <CountdownBlock props={block.props} />;
    case 'stats':
      return <StatsBlock props={block.props} />;
    case 'logo-cloud':
      return <LogoCloudBlock props={block.props} />;
    case 'lead-form':
      return <LeadFormBlock props={block.props} />;
    case 'buy-button':
      return <BuyButtonBlock props={block.props} />;
    case 'gallery':
      return <GalleryBlock props={block.props} />;
    case 'spacer':
      return <SpacerBlock props={block.props} />;
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
