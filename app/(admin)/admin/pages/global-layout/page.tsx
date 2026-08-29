'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { createDefaultBlock, type Block, type BlockType } from '@/lib/pages/blocks';
import { BlockPalette } from '../components/BlockPalette';
import { Canvas } from '../components/Canvas';
import { Inspector } from '../components/Inspector';

/**
 * Edits the global header/footer block trees (SiteSetting globalHeader /
 * globalFooter) that render on every published landing page.
 */
export default function GlobalLayoutPage() {
  const [tab, setTab] = useState<'header' | 'footer'>('header');
  const [header, setHeader] = useState<Block[]>([]);
  const [footer, setFooter] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const blocks = tab === 'header' ? header : footer;
  const setBlocks = tab === 'header' ? setHeader : setFooter;

  useEffect(() => {
    fetch('/api/admin/pages/global-layout')
      .then((r) => r.json())
      .then((data) => {
        setHeader(Array.isArray(data.header) ? data.header : []);
        setFooter(Array.isArray(data.footer) ? data.footer : []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = (type: BlockType) => {
    const block = createDefaultBlock(type);
    setBlocks([...blocks, block]);
    setSelectedId(block.id);
  };

  const handlePropsChange = (blockId: string, props: Record<string, unknown>) => {
    setBlocks(blocks.map((b) => (b.id === blockId ? { ...b, props } : b)));
  };

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/pages/global-layout', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ header, footer }),
      });
      if (res.ok) setSavedAt(new Date());
    } finally {
      setSaving(false);
    }
  }, [header, footer]);

  const selectedBlock = blocks.find((b) => b.id === selectedId) || null;

  if (loading) return <div className="p-8 text-sm text-muted">Loading…</div>;

  return (
    <div className="flex flex-col h-[calc(100vh-0px)]">
      <div className="flex items-center justify-between gap-4 px-4 md:px-6 py-3 border-b border-border/50 bg-surface">
        <div className="flex items-center gap-3">
          <Link href="/admin/pages" className="text-muted hover:text-foreground text-sm">← Back</Link>
          <h1 className="text-foreground font-medium text-sm">Global header & footer</h1>
          <div className="flex bg-surface-light rounded-lg overflow-hidden ml-2">
            {(['header', 'footer'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  setTab(t);
                  setSelectedId(null);
                }}
                className={`px-4 py-1.5 text-xs capitalize transition-colors ${
                  tab === t ? 'bg-accent text-white' : 'text-muted hover:text-foreground'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted">
            {saving ? 'Saving…' : savedAt ? `Saved ${savedAt.toLocaleTimeString()}` : ''}
          </span>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-1.5 bg-accent text-white rounded-lg text-xs font-medium hover:bg-accent/90 disabled:opacity-50 transition-colors"
          >
            Save
          </button>
        </div>
      </div>

      <p className="px-4 md:px-6 py-2 text-xs text-muted border-b border-border/50 bg-surface">
        These {tab} blocks render on every published landing page ({tab === 'header' ? 'above' : 'below'} the page content).
      </p>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 shrink-0 border-r border-border/50 overflow-y-auto bg-surface">
          <BlockPalette onAdd={handleAdd} />
        </aside>

        <Canvas
          blocks={blocks}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onReorder={setBlocks}
          onRemove={(blockId) => {
            setBlocks(blocks.filter((b) => b.id !== blockId));
            if (selectedId === blockId) setSelectedId(null);
          }}
          onNudge={(blockId, dx, dy) =>
            setBlocks(
              blocks.map((b) =>
                b.id === blockId
                  ? { ...b, position: { x: (b.position?.x || 0) + dx, y: (b.position?.y || 0) + dy } }
                  : b
              )
            )
          }
          previewWidth="desktop"
        />

        <aside className="w-80 shrink-0 border-l border-border/50 overflow-y-auto bg-surface">
          <Inspector
            block={selectedBlock}
            onChange={(props) => selectedBlock && handlePropsChange(selectedBlock.id, props)}
          />
        </aside>
      </div>
    </div>
  );
}
