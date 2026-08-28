'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

type Kind =
  | 'course-outline'
  | 'lesson-content'
  | 'product-description'
  | 'landing-page'
  | 'email-copy'
  | 'business-idea'
  | 'quiz'
  | 'email-sequence'
  | 'video-script'
  | 'social-posts'
  | 'copy-rewrite';

const KIND_OPTIONS: { value: Kind; label: string; hint: string; placeholder: string }[] = [
  {
    value: 'course-outline',
    label: 'Course Outline',
    hint: 'Modules + lessons from a topic',
    placeholder: 'e.g. A beginner course on flipping sneakers for profit',
  },
  {
    value: 'lesson-content',
    label: 'Lesson Content',
    hint: 'Markdown body, key points, quiz',
    placeholder: 'e.g. A lesson on pricing strategy for resellers',
  },
  {
    value: 'product-description',
    label: 'Product Description',
    hint: 'Headline, copy, feature bullets',
    placeholder: 'e.g. A digital ebook on personal branding for freelancers',
  },
  {
    value: 'landing-page',
    label: 'Landing Page Copy',
    hint: 'Headline, sections, CTA, FAQ',
    placeholder: 'e.g. A landing page for a cohort-based hustle coaching program',
  },
  {
    value: 'email-copy',
    label: 'Welcome Email',
    hint: 'Subject, preview text, HTML body',
    placeholder: 'e.g. A welcome email for new members of a side-hustle community',
  },
  {
    value: 'business-idea',
    label: 'Business Idea Expansion',
    hint: 'Audience, positioning, catalog',
    placeholder: 'e.g. A subscription box for aspiring resellers',
  },
  {
    value: 'quiz',
    label: 'Quiz',
    hint: '5 multiple-choice questions',
    placeholder: 'e.g. A quiz testing knowledge of sneaker reselling basics',
  },
  {
    value: 'email-sequence',
    label: 'Email Sequence',
    hint: '3-email nurture sequence',
    placeholder: 'e.g. A 3-email welcome sequence for a new course buyer',
  },
  {
    value: 'video-script',
    label: 'Video Script',
    hint: 'Hook, sections, CTA',
    placeholder: 'e.g. A 3-minute video script introducing our flagship course',
  },
  {
    value: 'social-posts',
    label: 'Social Posts',
    hint: 'Twitter, LinkedIn, Instagram',
    placeholder: 'e.g. Posts announcing a new course launch',
  },
  {
    value: 'copy-rewrite',
    label: 'Copy Rewrite',
    hint: 'Paste copy to improve',
    placeholder: 'Paste the copy you want to improve here…',
  },
];

type GenerationRecord = {
  id: string;
  kind: string;
  prompt: string;
  model: string;
  output: Record<string, unknown>;
  createdAt: string;
};

type DoneEvent = {
  type: 'done';
  output: Record<string, unknown>;
  demo: boolean;
  model: string;
  kind: Kind;
  generationId: string | null;
};

type ErrorEvent = { type: 'error'; error: string };
type PartialEvent = { type: 'partial'; output?: Record<string, unknown>; raw?: string };
type StreamEvent = DoneEvent | ErrorEvent | PartialEvent;

async function readNdjsonStream(res: Response, onEvent: (event: StreamEvent) => void) {
  const reader = res.body?.getReader();
  if (!reader) throw new Error('No response body to stream');
  const decoder = new TextDecoder();
  let buffer = '';
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';
    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        onEvent(JSON.parse(line) as StreamEvent);
      } catch {
        // ignore malformed line
      }
    }
  }
  if (buffer.trim()) {
    try {
      onEvent(JSON.parse(buffer) as StreamEvent);
    } catch {
      // ignore trailing malformed line
    }
  }
}

export default function AiStudioPage() {
  const router = useRouter();
  const [idea, setIdea] = useState('');
  const [kind, setKind] = useState<Kind>('course-outline');
  const [steer, setSteer] = useState('');
  const [loading, setLoading] = useState(false);
  const [streamingRaw, setStreamingRaw] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DoneEvent | null>(null);
  const [applying, setApplying] = useState<string | null>(null);
  const [applyMessage, setApplyMessage] = useState<{ text: string; href?: string } | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const [historyOpen, setHistoryOpen] = useState(false);
  const [history, setHistory] = useState<GenerationRecord[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const historyLoadedRef = useRef(false);

  const activeKind = KIND_OPTIONS.find((k) => k.value === kind)!;

  const loadHistory = async () => {
    setHistoryLoading(true);
    try {
      const res = await fetch('/api/admin/ai/history');
      if (!res.ok) throw new Error('Failed to load history');
      const data = await res.json();
      setHistory(data.generations || []);
      historyLoadedRef.current = true;
    } catch {
      // Silent — history is a convenience panel, not critical path.
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (historyOpen && !historyLoadedRef.current) {
      loadHistory();
    }
  }, [historyOpen]);

  const runGeneration = async (promptOverride?: string, steerOverride?: string) => {
    const prompt = promptOverride ?? idea;
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setApplyMessage(null);
    setStreamingRaw('');
    try {
      const res = await fetch('/api/admin/ai/generate-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind, prompt, steer: steerOverride }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Generation failed');
      }

      let finalEvent: DoneEvent | null = null;
      await readNdjsonStream(res, (event) => {
        if (event.type === 'partial') {
          if (event.raw) {
            setStreamingRaw(event.raw);
          } else if (event.output) {
            setStreamingRaw(JSON.stringify(event.output, null, 2));
          }
        } else if (event.type === 'done') {
          finalEvent = event;
        } else if (event.type === 'error') {
          throw new Error(event.error);
        }
      });

      if (!finalEvent) throw new Error('Generation did not complete');
      setResult(finalEvent);
      historyLoadedRef.current = false; // refresh history lazily next time it's opened
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed');
    } finally {
      setLoading(false);
      setStreamingRaw(null);
    }
  };

  const handleGenerate = () => runGeneration(idea, undefined);
  const handleRegenerate = () => runGeneration(idea, steer);

  const handleCopy = async (label: string, value: unknown) => {
    const text = typeof value === 'string' ? value : JSON.stringify(value, null, 2);
    await navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 1500);
  };

  const handleLoadHistoryEntry = (entry: GenerationRecord) => {
    setKind(entry.kind as Kind);
    setIdea(entry.prompt);
    setResult({
      type: 'done',
      output: entry.output,
      demo: entry.model.includes('(demo)'),
      model: entry.model,
      kind: entry.kind as Kind,
      generationId: entry.id,
    });
    setApplyMessage(null);
    setError(null);
  };

  const applyCourseOutline = async () => {
    if (!result) return;
    const res = await fetch('/api/admin/ai/apply-course-outline', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ output: result.output }),
    });
    if (!res.ok) throw new Error('Failed to create draft course');
    const data = await res.json();
    router.push(`/admin/courses/${data.courseId}`);
  };

  const applyLandingPage = async () => {
    if (!result) return;
    const res = await fetch('/api/admin/ai/apply-landing-page', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ output: result.output }),
    });
    if (!res.ok) throw new Error('Failed to create draft landing page');
    setApplyMessage({ text: 'Landing page draft created.', href: '/admin/pages' });
  };

  const applyEmailCampaign = async (name: string, subject: string, html: string) => {
    const res = await fetch('/api/admin/ai/apply-email-campaign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, subject, html }),
    });
    if (!res.ok) throw new Error('Failed to create draft campaign');
  };

  const applyEmailCopy = async () => {
    if (!result) return;
    const output = result.output as { subject: string; previewText: string; htmlBody: string };
    await applyEmailCampaign(output.subject || 'AI Studio campaign', output.subject, output.htmlBody);
    setApplyMessage({ text: 'Email campaign draft created.', href: '/admin/email' });
  };

  const applyEmailSequence = async () => {
    if (!result) return;
    const output = result.output as { name: string; emails: { subject: string; html: string; delayDays: number }[] };
    for (let i = 0; i < output.emails.length; i++) {
      const email = output.emails[i];
      await applyEmailCampaign(`${output.name} — Email ${i + 1}`, email.subject, email.html);
    }
    setApplyMessage({ text: `${output.emails.length} email campaign drafts created.`, href: '/admin/email' });
  };

  const applyProduct = async (title: string, description: string, price?: number) => {
    const res = await fetch('/api/admin/ai/apply-product', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, price }),
    });
    if (!res.ok) throw new Error('Failed to create draft product');
  };

  const applyProductDescription = async () => {
    if (!result) return;
    const output = result.output as { headline: string; longDescription: string };
    await applyProduct(output.headline, output.longDescription);
    setApplyMessage({ text: 'Product draft created.', href: '/admin/store' });
  };

  const applyBusinessIdea = async () => {
    if (!result) return;
    const output = result.output as {
      productCatalog: { name: string; description: string }[];
    };
    for (const product of output.productCatalog) {
      await applyProduct(product.name, product.description);
    }
    setApplyMessage({ text: `${output.productCatalog.length} product draft(s) created.`, href: '/admin/store' });
  };

  const handleApply = async () => {
    if (!result) return;
    setApplying(result.kind);
    setApplyMessage(null);
    try {
      switch (result.kind) {
        case 'course-outline':
          await applyCourseOutline();
          return; // navigates away
        case 'landing-page':
          await applyLandingPage();
          break;
        case 'email-copy':
          await applyEmailCopy();
          break;
        case 'email-sequence':
          await applyEmailSequence();
          break;
        case 'product-description':
          await applyProductDescription();
          break;
        case 'business-idea':
          await applyBusinessIdea();
          break;
        default:
          break;
      }
    } catch (err) {
      setApplyMessage({ text: err instanceof Error ? err.message : 'Failed to apply' });
    } finally {
      setApplying(null);
    }
  };

  const applyLabel: Partial<Record<Kind, string>> = {
    'course-outline': 'Apply → Create Draft Course',
    'landing-page': 'Create page draft',
    'email-copy': 'Create campaign draft',
    'email-sequence': 'Create campaign drafts',
    'product-description': 'Create product draft',
    'business-idea': 'Create product draft(s)',
  };

  const inputClass =
    'w-full px-4 py-2.5 bg-surface border border-surface-light rounded-xl text-foreground text-sm placeholder:text-muted focus:outline-none focus:border-accent transition-colors';
  const labelClass = 'block text-sm text-muted mb-1.5';

  return (
    <div className="p-4 md:p-8 max-w-6xl">
      <div className="flex items-start justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground mb-2">AI Studio</h1>
          <p className="text-muted text-sm mb-8">
            Describe your idea, pick what to generate, and get structured drafts you can copy or apply directly.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setHistoryOpen((v) => !v)}
          className="px-4 py-2 bg-surface border border-surface-light rounded-xl text-sm text-foreground hover:bg-surface-light/50 transition-colors shrink-0"
        >
          {historyOpen ? 'Hide history' : 'History'}
        </button>
      </div>

      <div className="flex gap-6 items-start">
        <div className="flex-1 min-w-0">
          <div className="space-y-6 bg-surface border border-surface-light rounded-2xl p-6">
            <div>
              <label className={labelClass}>
                {kind === 'copy-rewrite' ? 'Paste your copy *' : 'Describe your idea *'}
              </label>
              <textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                className={inputClass}
                rows={kind === 'copy-rewrite' ? 6 : 3}
                placeholder={activeKind.placeholder}
              />
            </div>

            <div>
              <label className={labelClass}>What do you want to generate?</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {KIND_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setKind(opt.value)}
                    className={`text-left px-4 py-3 rounded-xl border text-sm transition-colors ${
                      kind === opt.value
                        ? 'border-accent bg-accent/10 text-foreground'
                        : 'border-surface-light text-muted hover:text-foreground'
                    }`}
                  >
                    <div className="font-medium">{opt.label}</div>
                    <div className="text-xs opacity-70 mt-0.5">{opt.hint}</div>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleGenerate}
              disabled={loading || !idea.trim()}
              className="px-6 py-2.5 bg-accent text-white rounded-xl font-medium text-sm hover:bg-accent/90 transition-colors disabled:opacity-50"
            >
              {loading ? 'Generating…' : 'Generate'}
            </button>

            {error && <p className="text-sm text-red-400">{error}</p>}
          </div>

          {loading && streamingRaw !== null && (
            <div className="mt-8 bg-surface border border-surface-light rounded-2xl p-6">
              <h2 className="text-sm font-medium text-muted mb-3">Streaming…</h2>
              <pre className="text-xs text-foreground/70 bg-background border border-surface-light rounded-xl p-4 overflow-auto max-h-[320px] whitespace-pre-wrap">
                {streamingRaw || 'Waiting for first tokens…'}
              </pre>
            </div>
          )}

          {result && !loading && (
            <div className="mt-8 bg-surface border border-surface-light rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h2 className="text-lg font-heading font-semibold text-foreground">Result</h2>
                <div className="flex items-center gap-3">
                  {result.demo && (
                    <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/30">
                      Demo mode — set AI_GATEWAY_API_KEY for live generations
                    </span>
                  )}
                  <span className="text-xs text-muted">{result.model}</span>
                </div>
              </div>

              <pre className="text-xs text-foreground/90 bg-background border border-surface-light rounded-xl p-4 overflow-auto max-h-[480px] whitespace-pre-wrap">
                {JSON.stringify(result.output, null, 2)}
              </pre>

              <div className="flex flex-wrap items-center gap-3">
                <input
                  value={steer}
                  onChange={(e) => setSteer(e.target.value)}
                  placeholder="Steer the regenerate (e.g. make it more playful)…"
                  className={`${inputClass} max-w-xs`}
                />
                <button
                  type="button"
                  onClick={handleRegenerate}
                  disabled={loading}
                  className="px-4 py-2 bg-surface-light text-foreground rounded-xl text-sm hover:bg-surface-light/70 transition-colors disabled:opacity-50"
                >
                  Regenerate
                </button>
                <button
                  type="button"
                  onClick={() => handleCopy('output', result.output)}
                  className="px-4 py-2 bg-surface-light text-foreground rounded-xl text-sm hover:bg-surface-light/70 transition-colors"
                >
                  {copiedField === 'output' ? 'Copied!' : 'Copy JSON'}
                </button>
                {applyLabel[result.kind] && (
                  <button
                    type="button"
                    onClick={handleApply}
                    disabled={applying === result.kind}
                    className="px-4 py-2 bg-accent text-white rounded-xl text-sm hover:bg-accent/90 transition-colors disabled:opacity-50"
                  >
                    {applying === result.kind ? 'Applying…' : applyLabel[result.kind]}
                  </button>
                )}
              </div>

              {applyMessage && (
                <p className="text-sm text-foreground">
                  {applyMessage.text}{' '}
                  {applyMessage.href && (
                    <a href={applyMessage.href} className="text-accent underline">
                      View
                    </a>
                  )}
                </p>
              )}
            </div>
          )}
        </div>

        {historyOpen && (
          <div className="w-80 shrink-0 bg-surface border border-surface-light rounded-2xl p-4 max-h-[80vh] overflow-auto sticky top-4">
            <h2 className="text-sm font-semibold text-foreground mb-3">Recent generations</h2>
            {historyLoading && <p className="text-xs text-muted">Loading…</p>}
            {!historyLoading && history.length === 0 && (
              <p className="text-xs text-muted">No generations yet.</p>
            )}
            <div className="space-y-2">
              {history.map((entry) => (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => handleLoadHistoryEntry(entry)}
                  className="w-full text-left px-3 py-2 rounded-lg border border-surface-light hover:border-accent text-xs transition-colors"
                >
                  <div className="font-medium text-foreground truncate">{entry.kind}</div>
                  <div className="text-muted truncate">{entry.prompt}</div>
                  <div className="text-muted/70 mt-0.5">{new Date(entry.createdAt).toLocaleString()}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
