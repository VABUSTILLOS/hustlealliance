'use client';

import { useState, useEffect, useCallback, useRef, use } from 'react';
import Link from 'next/link';
import { createDefaultBlock, type Block, type BlockType, type Seo, type Theme } from '@/lib/pages/blocks';
import { BlockPalette } from '../../components/BlockPalette';
import { Canvas } from '../../components/Canvas';
import { Inspector } from '../../components/Inspector';
import { ThemePanel } from '../../components/ThemePanel';

type LandingPage = {
  id: string;
  slug: string;
  title: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  blocks: Block[];
  seo: Seo;
  theme?: Theme;
};

const HISTORY_LIMIT = 50;

export default function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const [page, setPage] = useState<LandingPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [previewWidth, setPreviewWidth] = useState<'desktop' | 'mobile'>('desktop');
  const [dirty, setDirty] = useState(false);

  // Undo/redo history stack of block arrays. `history[cursor]` is current.
  const [history, setHistory] = useState<Block[][]>([]);
  const [cursor, setCursor] = useState(0);
  const blocks = history[cursor] || [];

  const pushHistory = useCallback((next: Block[]) => {
    setHistory((prev) => {
      const truncated = prev.slice(0, cursor + 1);
      const updated = [...truncated, next].slice(-HISTORY_LIMIT);
      return updated;
    });
    setCursor((c) => Math.min(c + 1, HISTORY_LIMIT - 1));
    setDirty(true);
  }, [cursor]);

  useEffect(() => {
    fetch(`/api/admin/pages/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.page) {
          setPage(data.page);
          setHistory([data.page.blocks || []]);
          setCursor(0);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const updateBlocks = useCallback((next: Block[]) => {
    pushHistory(next);
  }, [pushHistory]);

  const handleAdd = (type: BlockType) => {
    const block = createDefaultBlock(type);
    updateBlocks([...blocks, block]);
    setSelectedId(block.id);
  };

  const handleRemove = (blockId: string) => {
    updateBlocks(blocks.filter((b) => b.id !== blockId));
    if (selectedId === blockId) setSelectedId(null);
  };

  const handleReorder = (next: Block[]) => {
    updateBlocks(next);
  };

  const handleNudge = (blockId: string, dx: number, dy: number) => {
    updateBlocks(
      blocks.map((b) =>
        b.id === blockId
          ? { ...b, position: { x: (b.position?.x || 0) + dx, y: (b.position?.y || 0) + dy } }
          : b
      )
    );
  };

  const handlePropsChange = (blockId: string, props: Record<string, unknown>) => {
    updateBlocks(blocks.map((b) => (b.id === blockId ? { ...b, props } : b)));
  };

  const handleUndo = () => {
    if (cursor > 0) setCursor((c) => c - 1);
  };

  const handleRedo = () => {
    if (cursor < history.length - 1) setCursor((c) => c + 1);
  };

  const handleTitleChange = (title: string) => {
    if (!page) return;
    setPage({ ...page, title });
    setDirty(true);
  };

  const handleSave = useCallback(async () => {
    if (!page) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/pages/${page.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: page.title, blocks, seo: page.seo }),
      });
      if (res.ok) {
        setLastSavedAt(new Date());
        setDirty(false);
      }
    } finally {
      setSaving(false);
    }
  }, [page, blocks]);

  // Autosave: debounce 2s after changes, in addition to the manual Save button.
  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!dirty || !page) return;
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(() => {
      handleSave();
    }, 2000);
    return () => {
      if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dirty, blocks, page?.title]);

  const handlePublishToggle = async () => {
    if (!page) return;
    const publish = page.status !== 'PUBLISHED';
    await handleSave();
    const res = await fetch(`/api/admin/pages/${page.id}/publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ publish }),
    });
    if (res.ok) {
      const data = await res.json();
      setPage(data.page);
    }
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) handleRedo();
        else handleUndo();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleSave, cursor, history.length]);

  const selectedBlock = blocks.find((b) => b.id === selectedId) || null;

  if (loading) {
    return <div className="p-8 text-sm text-muted">Loading…</div>;
  }

  if (!page) {
    return (
      <div className="p-8">
        <p className="text-sm text-muted mb-4">Page not found.</p>
        <Link href="/admin/pages" className="text-accent text-sm hover:underline">← Back to pages</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-0px)]">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 px-4 md:px-6 py-3 border-b border-border/50 bg-surface">
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/admin/pages" className="text-muted hover:text-foreground text-sm shrink-0">← Back</Link>
          <input
            type="text"
            value={page.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="bg-transparent text-foreground font-medium text-sm focus:outline-none border-b border-transparent focus:border-border min-w-0"
          />
          <span className="text-xs text-muted font-mono shrink-0">/p/{page.slug}</span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleUndo}
            disabled={cursor === 0}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-muted hover:text-foreground hover:bg-surface-light disabled:opacity-30 text-sm"
            title="Undo (Cmd+Z)"
          >
            ↶
          </button>
          <button
            onClick={handleRedo}
            disabled={cursor >= history.length - 1}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-muted hover:text-foreground hover:bg-surface-light disabled:opacity-30 text-sm"
            title="Redo (Cmd+Shift+Z)"
          >
            ↷
          </button>

          <div className="w-px h-5 bg-border mx-1" />

          <button
            onClick={() => setPreviewWidth('desktop')}
            className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm ${previewWidth === 'desktop' ? 'bg-accent/10 text-accent' : 'text-muted hover:text-foreground hover:bg-surface-light'}`}
            title="Desktop preview"
          >
            🖥️
          </button>
          <button
            onClick={() => setPreviewWidth('mobile')}
            className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm ${previewWidth === 'mobile' ? 'bg-accent/10 text-accent' : 'text-muted hover:text-foreground hover:bg-surface-light'}`}
            title="Mobile preview"
          >
            📱
          </button>

          <div className="w-px h-5 bg-border mx-1" />

          <span className="text-xs text-muted hidden md:inline">
            {saving ? 'Saving…' : lastSavedAt ? `Saved ${lastSavedAt.toLocaleTimeString()}` : dirty ? 'Unsaved changes' : ''}
          </span>

          <button
            onClick={handleSave}
            disabled={saving || !dirty}
            className="px-3 py-1.5 bg-surface-light text-foreground rounded-lg text-xs font-medium hover:bg-border disabled:opacity-50 transition-colors"
          >
            Save
          </button>
          <button
            onClick={handlePublishToggle}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              page.status === 'PUBLISHED'
                ? 'bg-surface-light text-foreground hover:bg-border'
                : 'bg-accent text-white hover:bg-accent/90'
            }`}
          >
            {page.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
          </button>
        </div>
      </div>

      {/* Three-pane editor */}
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 shrink-0 border-r border-border/50 overflow-y-auto bg-surface">
          <BlockPalette onAdd={handleAdd} />
        </aside>

        <Canvas
          blocks={blocks}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onReorder={handleReorder}
          onRemove={handleRemove}
          onNudge={handleNudge}
          previewWidth={previewWidth}
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
