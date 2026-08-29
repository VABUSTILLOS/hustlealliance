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
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [versions, setVersions] = useState<{ id: string; createdAt: string; blockCount: number }[]>([]);

  const loadVersions = useCallback(() => {
    fetch(`/api/admin/pages/${id}/versions`)
      .then((r) => r.json())
      .then((data) => setVersions(data.versions || []))
      .catch(() => {});
  }, [id]);

  useEffect(() => {
    if (settingsOpen) loadVersions();
  }, [settingsOpen, loadVersions]);

  const handleRestoreVersion = async (versionId: string) => {
    const res = await fetch(`/api/admin/pages/${id}/versions/${versionId}/restore`, { method: 'POST' });
    if (res.ok) {
      const data = await res.json();
      setHistory([data.page.blocks || []]);
      setCursor(0);
      setDirty(false);
      loadVersions();
    }
  };

  const updateSeo = (patch: Partial<Seo>) => {
    if (!page) return;
    setPage({ ...page, seo: { ...(page.seo || {}), ...patch } });
    setDirty(true);
  };

  const updateTheme = (theme: Theme) => {
    if (!page) return;
    setPage({ ...page, theme });
    setDirty(true);
  };

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
        body: JSON.stringify({ title: page.title, blocks, seo: page.seo, theme: page.theme ?? null }),
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
            onClick={() => setSettingsOpen((v) => !v)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              settingsOpen ? 'bg-accent/10 text-accent' : 'bg-surface-light text-foreground hover:bg-border'
            }`}
          >
            Page settings
          </button>
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

      {settingsOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50" onClick={() => setSettingsOpen(false)}>
          <div
            className="w-full max-w-md h-full bg-surface border-l border-border/50 overflow-y-auto p-5 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-foreground font-semibold">Page settings</h2>
              <button onClick={() => setSettingsOpen(false)} className="text-muted hover:text-foreground text-sm">✕</button>
            </div>

            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted mb-3">SEO</h3>
              <label className="block mb-3">
                <span className="block text-xs font-medium text-muted mb-1.5">Meta title</span>
                <input
                  type="text"
                  value={page.seo?.title || ''}
                  onChange={(e) => updateSeo({ title: e.target.value })}
                  placeholder={page.title}
                  className="w-full px-3 py-2 bg-surface-light rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </label>
              <label className="block mb-3">
                <span className="block text-xs font-medium text-muted mb-1.5">Meta description</span>
                <textarea
                  value={page.seo?.description || ''}
                  onChange={(e) => updateSeo({ description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 bg-surface-light rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                />
              </label>
              <label className="block mb-3">
                <span className="block text-xs font-medium text-muted mb-1.5">OG image URL</span>
                <input
                  type="text"
                  value={page.seo?.ogImage || ''}
                  onChange={(e) => updateSeo({ ogImage: e.target.value })}
                  placeholder="https://…"
                  className="w-full px-3 py-2 bg-surface-light rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </label>
              {/* Social share preview */}
              <div className="rounded-xl border border-border/50 overflow-hidden bg-surface-light">
                {page.seo?.ogImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={page.seo.ogImage} alt="" className="w-full aspect-[1.91/1] object-cover" />
                ) : (
                  <div className="w-full aspect-[1.91/1] flex items-center justify-center text-muted text-xs">No OG image</div>
                )}
                <div className="p-3">
                  <div className="text-sm font-medium text-foreground truncate">{page.seo?.title || page.title}</div>
                  <div className="text-xs text-muted line-clamp-2 mt-0.5">{page.seo?.description || 'No description set.'}</div>
                </div>
              </div>
            </section>

            <ThemePanel theme={page.theme ?? null} onChange={updateTheme} />

            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted mb-3">Custom code (admin-only)</h3>
              <label className="block mb-3">
                <span className="block text-xs font-medium text-muted mb-1.5">Inject at top of page (head code)</span>
                <textarea
                  value={page.theme?.headCode || ''}
                  onChange={(e) => updateTheme({ ...(page.theme || {}), headCode: e.target.value })}
                  rows={3}
                  placeholder="<script>…</script>"
                  className="w-full px-3 py-2 bg-surface-light rounded-lg text-xs font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                />
              </label>
              <label className="block mb-3">
                <span className="block text-xs font-medium text-muted mb-1.5">Inject at bottom of page (body code)</span>
                <textarea
                  value={page.theme?.bodyCode || ''}
                  onChange={(e) => updateTheme({ ...(page.theme || {}), bodyCode: e.target.value })}
                  rows={3}
                  placeholder="<script>…</script>"
                  className="w-full px-3 py-2 bg-surface-light rounded-lg text-xs font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                />
              </label>
            </section>

            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted mb-3">Versions (last 10)</h3>
              {versions.length === 0 ? (
                <p className="text-xs text-muted">No snapshots yet — one is saved each time blocks are saved.</p>
              ) : (
                <div className="space-y-2">
                  {versions.map((v) => (
                    <div key={v.id} className="flex items-center justify-between px-3 py-2 rounded-lg border border-border/50">
                      <div className="text-xs">
                        <div className="text-foreground">{new Date(v.createdAt).toLocaleString()}</div>
                        <div className="text-muted">{v.blockCount} blocks</div>
                      </div>
                      <button
                        onClick={() => handleRestoreVersion(v.id)}
                        className="text-xs text-accent hover:underline"
                      >
                        Restore
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
