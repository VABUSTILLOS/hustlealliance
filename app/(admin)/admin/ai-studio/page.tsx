'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Kind =
  | 'course-outline'
  | 'lesson-content'
  | 'product-description'
  | 'landing-page'
  | 'email-copy'
  | 'business-idea';

const KIND_OPTIONS: { value: Kind; label: string; hint: string }[] = [
  { value: 'course-outline', label: 'Course Outline', hint: 'Modules + lessons from a topic' },
  { value: 'lesson-content', label: 'Lesson Content', hint: 'Markdown body, key points, quiz' },
  { value: 'product-description', label: 'Product Description', hint: 'Headline, copy, feature bullets' },
  { value: 'landing-page', label: 'Landing Page Copy', hint: 'Headline, sections, CTA, FAQ' },
  { value: 'email-copy', label: 'Welcome Email', hint: 'Subject, preview text, HTML body' },
  { value: 'business-idea', label: 'Business Idea Expansion', hint: 'Audience, positioning, catalog' },
];

type GenerateResponse = {
  kind: Kind;
  output: Record<string, unknown>;
  demo: boolean;
  model: string;
  generationId: string;
};

export default function AiStudioPage() {
  const router = useRouter();
  const [idea, setIdea] = useState('');
  const [kind, setKind] = useState<Kind>('course-outline');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerateResponse | null>(null);
  const [creatingDraft, setCreatingDraft] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!idea.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch('/api/admin/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind, prompt: idea }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Generation failed');
      }
      const data: GenerateResponse = await res.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (label: string, value: unknown) => {
    const text = typeof value === 'string' ? value : JSON.stringify(value, null, 2);
    await navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 1500);
  };

  const handleApplyCourse = async () => {
    if (!result || result.kind !== 'course-outline') return;
    setCreatingDraft(true);
    try {
      const res = await fetch('/api/admin/ai/apply-course-outline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ output: result.output }),
      });
      if (!res.ok) throw new Error('Failed to create draft course');
      const data = await res.json();
      router.push(`/admin/courses/${data.courseId}`);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create draft course');
    } finally {
      setCreatingDraft(false);
    }
  };

  const inputClass =
    'w-full px-4 py-2.5 bg-surface border border-surface-light rounded-xl text-foreground text-sm placeholder:text-muted focus:outline-none focus:border-accent transition-colors';
  const labelClass = 'block text-sm text-muted mb-1.5';

  return (
    <div className="p-4 md:p-8 max-w-4xl">
      <h1 className="text-2xl font-heading font-bold text-foreground mb-2">AI Studio</h1>
      <p className="text-muted text-sm mb-8">
        Describe your idea, pick what to generate, and get structured drafts you can copy or apply directly.
      </p>

      <div className="space-y-6 bg-surface border border-surface-light rounded-2xl p-6">
        <div>
          <label className={labelClass}>Describe your idea *</label>
          <textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            className={inputClass}
            rows={3}
            placeholder="e.g. A beginner course on flipping sneakers for profit"
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

      {result && (
        <div className="mt-8 bg-surface border border-surface-light rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
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

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => handleCopy('output', result.output)}
              className="px-4 py-2 bg-surface-light text-foreground rounded-xl text-sm hover:bg-surface-light/70 transition-colors"
            >
              {copiedField === 'output' ? 'Copied!' : 'Copy JSON'}
            </button>
            {result.kind === 'course-outline' && (
              <button
                type="button"
                onClick={handleApplyCourse}
                disabled={creatingDraft}
                className="px-4 py-2 bg-accent text-white rounded-xl text-sm hover:bg-accent/90 transition-colors disabled:opacity-50"
              >
                {creatingDraft ? 'Creating draft…' : 'Apply → Create Draft Course'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
