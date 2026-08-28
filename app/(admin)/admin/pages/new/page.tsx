'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PAGE_TEMPLATES, instantiateTemplate } from '@/lib/pages/templates';

/** Template chooser shown before creating a new landing page. */
export default function NewPagePage() {
  const router = useRouter();
  const [creatingId, setCreatingId] = useState<string | null>(null);

  const handleChoose = async (templateId: string) => {
    const template = PAGE_TEMPLATES.find((t) => t.id === templateId);
    if (!template) return;
    setCreatingId(templateId);
    try {
      const blocks = instantiateTemplate(template);
      const res = await fetch('/api/admin/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: `Untitled ${template.name}`, blocks }),
      });
      const data = await res.json();
      if (res.ok && data.page) {
        router.push(`/admin/pages/${data.page.id}/edit`);
      }
    } finally {
      setCreatingId(null);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <Link href="/admin/pages" className="text-muted hover:text-foreground text-sm">← Back to pages</Link>
        <h1 className="text-2xl font-heading font-bold text-foreground mt-2">Choose a starting point</h1>
        <p className="text-muted text-sm mt-1">Pick a template to pre-fill your new page, or start blank.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PAGE_TEMPLATES.map((template) => (
          <button
            key={template.id}
            onClick={() => handleChoose(template.id)}
            disabled={creatingId !== null}
            className="text-left p-5 rounded-2xl bg-surface hover:bg-surface-light border border-transparent hover:border-accent/40 transition-colors disabled:opacity-50"
          >
            <h2 className="font-semibold text-foreground mb-1">{template.name}</h2>
            <p className="text-muted text-sm">{template.description}</p>
            <p className="text-xs text-muted mt-3">{template.blocks.length} sections</p>
            {creatingId === template.id ? <p className="text-xs text-accent mt-2">Creating…</p> : null}
          </button>
        ))}
      </div>
    </div>
  );
}
