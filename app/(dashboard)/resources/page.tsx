'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/lib/store/useStore';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useToast } from '@/app/components/ToastProvider';
import {
  resources,
  searchResources,
  getAllTags,
  getRelatedResources,
  resourceTypeLabels,
  journeyPhaseLabels,
  getResourceLocale,
  type ResourceType,
  type Resource,
} from '@/lib/data/resources';

const typeIcons: Record<string, string> = {
  spreadsheet: '📊',
  pdf: '📄',
  ebook: '📚',
  guide: '📖',
  template: '📋',
  infographic: '🎨',
  cheatsheet: '📝',
};

export default function ResourcesPage() {
  const { t, locale } = useTranslation();
  const isBookmarked = useStore((s) => s.isBookmarked);
  const bookmarks = useStore((s) => s.resourceBookmarks);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeType, setActiveType] = useState<ResourceType | 'all'>('all');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [showSaved, setShowSaved] = useState(false);
  const [activePhase, setActivePhase] = useState<number | null>(null);

  const allTags = useMemo(() => getAllTags(), []);

  const filteredResources = useMemo(() => {
    let result = showSaved
      ? resources.filter((r) => bookmarks.includes(r.id))
      : resources;

    if (searchQuery.trim()) {
      result = searchResources(searchQuery);
      if (showSaved) result = result.filter((r) => bookmarks.includes(r.id));
    }

    if (activeType !== 'all') {
      result = result.filter((r) => r.type === activeType);
    }

    if (activeTag) {
      result = result.filter((r) => r.tags.includes(activeTag));
    }

    if (activePhase !== null) {
      result = result.filter((r) => r.journeyPhase === activePhase);
    }

    return result;
  }, [searchQuery, activeType, activeTag, showSaved, bookmarks, activePhase]);

  const types: (ResourceType | 'all')[] = ['all', 'guide', 'template', 'spreadsheet', 'ebook', 'infographic', 'cheatsheet'];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
          {t.resources.title}
        </h1>
        <p className="text-muted">{t.resources.subtitle}</p>
      </div>

      {/* Search bar */}
      <div className="relative">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.resources.search}
          className="w-full pl-12 pr-4 py-3 rounded-xl bg-surface border border-surface-light text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all"
        />
      </div>

      {/* Filter tabs */}
      <div className="space-y-3">
        {/* Type filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {types.map((type) => (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${activeType === type
                  ? 'bg-accent text-white'
                  : 'bg-surface border border-surface-light text-muted hover:text-foreground hover:border-foreground-dim/30'
                }`}
            >
              {resourceTypeLabels[type]}
            </button>
          ))}

          <div className="w-px h-6 bg-surface-light mx-1" />

          {/* Saved toggle */}
          <button
            onClick={() => setShowSaved(!showSaved)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5
              ${showSaved
                ? 'bg-accent text-white'
                : 'bg-surface border border-surface-light text-muted hover:text-foreground hover:border-foreground-dim/30'
              }`}
          >
            <span>{showSaved ? '📌' : '📁'}</span>
            {t.resources.filterSaved}
          </button>

          <div className="w-px h-6 bg-surface-light mx-1" />

          {/* Phase filter */}
          <select
            value={activePhase ?? ''}
            onChange={(e) => setActivePhase(e.target.value ? Number(e.target.value) : null)}
            className="px-3 py-2 rounded-lg text-sm font-medium bg-surface border border-surface-light text-foreground focus:outline-none focus:border-accent/50 transition-all cursor-pointer"
          >
            <option value="">All Phases</option>
            {Object.entries(journeyPhaseLabels).map(([phase, label]) => (
              <option key={phase} value={phase}>{label}</option>
            ))}
          </select>
        </div>

        {/* Tag pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all
                ${activeTag === tag
                  ? 'bg-accent/20 text-accent border border-accent/30'
                  : 'bg-surface-light/50 text-muted hover:text-foreground border border-transparent'
                }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Resource grid */}
      {filteredResources.length === 0 ? (
        <div className="py-16 text-center space-y-3">
          <span className="text-4xl block">📭</span>
          <p className="text-muted">{t.resources.noResults}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredResources.map((resource, index) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                index={index}
                isBookmarked={isBookmarked(resource.id)}
                locale={locale}
                t={t}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Request resource */}
      <RequestResourceSection t={t} />
    </div>
  );
}

function ResourceCard({
  resource,
  index,
  isBookmarked,
  locale,
  t,
}: {
  resource: Resource;
  index: number;
  isBookmarked: boolean;
  locale: 'en' | 'es';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: any;
}) {
  const toggleBookmark = useStore((s) => s.toggleBookmark);
  const [showModal, setShowModal] = useState(false);

  const { title, description } = getResourceLocale(resource, locale);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ delay: index * 0.05 }}
        className="group cursor-pointer"
        onClick={() => setShowModal(true)}
      >
        <div className="rounded-2xl bg-surface border border-surface-light overflow-hidden transition-all duration-300 hover:border-accent/30 hover:shadow-[0_0_30px_rgba(255,59,48,0.08)]">
          {/* Thumbnail */}
          <div
            className="h-36 relative flex items-center justify-center"
            style={{ background: resource.thumbnail }}
          >
            <span className="text-4xl opacity-60">
              {typeIcons[resource.type] || '📄'}
            </span>
            {/* Type badge */}
            <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/30 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider">
              {resourceTypeLabels[resource.type]}
            </span>
            {/* Bookmark button */}
            <button
              onClick={(e) => { e.stopPropagation(); toggleBookmark(resource.id); }}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-sm hover:bg-black/50 transition-all"
              title={isBookmarked ? t.resources.bookmarked : t.resources.bookmark}
            >
              {isBookmarked ? '📌' : '🔖'}
            </button>
          </div>

          {/* Content */}
          <div className="p-4 space-y-2">
            <h3 className="text-foreground font-heading font-bold text-sm line-clamp-2 group-hover:text-accent transition-colors">
              {title}
            </h3>
            <p className="text-muted text-xs line-clamp-2">{description}</p>
            <div className="flex items-center gap-3 text-[11px] text-muted">
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                </svg>
                {resource.downloads.toLocaleString()}
              </span>
              <span>{resource.fileSize}</span>
              <span>{resource.format}</span>
            </div>
            {/* Tags */}
            <div className="flex items-center gap-1 flex-wrap pt-1">
              {resource.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-surface-light text-muted">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Detail Modal */}
      <AnimatePresence>
        {showModal && (
          <ResourceModal
            resource={resource}
            isBookmarked={isBookmarked}
            locale={locale}
            t={t}
            onClose={() => setShowModal(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function ResourceModal({
  resource,
  isBookmarked,
  locale,
  t,
  onClose,
}: {
  resource: Resource;
  isBookmarked: boolean;
  locale: 'en' | 'es';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: any;
  onClose: () => void;
}) {
  const toggleBookmark = useStore((s) => s.toggleBookmark);
  const { addToast } = useToast();

  const { title, description } = getResourceLocale(resource, locale);

  const related = useMemo(() => getRelatedResources(resource.id), [resource.id]);

  const handleDownload = () => {
    const url = '/api/download/' + resource.id + '?lang=' + locale;
    const a = document.createElement('a');
    a.href = url;
    a.download = '';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    addToast({ message: locale === 'es' ? 'Descarga iniciada' : 'Download started', type: 'success' });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: 'spring', damping: 25 }}
        className="bg-surface border border-surface-light rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        {/* Thumbnail */}
        <div
          className="h-48 relative flex items-center justify-center rounded-t-2xl"
          style={{ background: resource.thumbnail }}
        >
          <span className="text-5xl opacity-60">
            {typeIcons[resource.type] || '📄'}
          </span>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-all"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Type badge + title */}
          <div className="space-y-2">
            <span className="px-2.5 py-1 rounded-lg bg-accent/10 border border-accent/20 text-accent text-[10px] font-bold uppercase tracking-wider">
              {resourceTypeLabels[resource.type]}
            </span>
            <h2 className="text-xl font-heading font-bold text-foreground">{title}</h2>
          </div>

          <p className="text-muted text-sm leading-relaxed">{description}</p>

          {/* File details */}
          <div className="flex items-center gap-4 text-sm text-muted">
            <span>{resource.fileSize}</span>
            <span>{resource.format}</span>
            <span>{resource.downloads.toLocaleString()} {t.resources.downloads}</span>
          </div>

          {/* Tags */}
          <div className="flex items-center gap-2 flex-wrap">
            {resource.tags.map((tag) => (
              <span key={tag} className="text-xs px-2 py-1 rounded bg-surface-light text-muted">#{tag}</span>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownload}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-accent text-white font-heading font-bold rounded-xl hover:bg-accent-glow transition-all shadow-[0_0_20px_rgba(255,59,48,0.3)]"
              style={{ animation: 'cta-pulse 2s infinite' }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
              </svg>
              {t.resources.download}
            </button>
            <button
              onClick={() => toggleBookmark(resource.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border font-heading font-bold text-sm transition-all
                ${isBookmarked
                  ? 'bg-accent/10 border-accent/30 text-accent'
                  : 'border-surface-light text-muted hover:text-foreground hover:border-foreground-dim/30'
                }`}
            >
              {isBookmarked ? '📌' : '🔖'}
              {isBookmarked ? t.resources.bookmarked : t.resources.bookmark}
            </button>
          </div>

          {/* Related resources */}
          {related.length > 0 && (
            <div className="pt-4 border-t border-surface-light space-y-3">
              <h3 className="text-sm font-heading font-bold text-foreground">{t.resources.relatedResources}</h3>
              <div className="space-y-2">
                {related.map((r: Resource) => (
                  <div
                    key={r.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-light/50 transition-colors cursor-pointer"
                    onClick={(e) => { e.stopPropagation(); /* navigate */ }}
                  >
                    <div
                      className="w-10 h-10 rounded-lg shrink-0 flex items-center justify-center text-sm"
                      style={{ background: r.thumbnail }}
                    />
                    <div className="min-w-0">
                      <p className="text-foreground text-xs font-medium truncate">{r.title}</p>
                      <p className="text-muted text-[10px]">{r.format} · {r.fileSize}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function RequestResourceSection({ t }: { t: any }) {
  const [showForm, setShowForm] = useState(false);
  const [requestText, setRequestText] = useState('');
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!requestText.trim()) return;
    setSent(true);
    setTimeout(() => {
      setShowForm(false);
      setSent(false);
      setRequestText('');
    }, 3000);
  };

  return (
    <div className="pt-8 border-t border-surface-light">
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="text-sm text-muted hover:text-accent transition-colors flex items-center gap-1.5"
        >
          <span>💬</span>
          {t.resources.requestResource}
        </button>
      ) : (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-3 p-4 rounded-xl bg-surface/50 border border-surface-light"
        >
          <h3 className="text-foreground font-heading font-bold text-sm">{t.resources.requestTitle}</h3>
          <p className="text-muted text-xs">{t.resources.requestDesc}</p>
          <textarea
            value={requestText}
            onChange={(e) => setRequestText(e.target.value)}
            placeholder={t.resources.requestPlaceholder}
            rows={3}
            className="w-full p-3 rounded-lg bg-surface border border-surface-light text-foreground text-sm placeholder:text-muted/50 resize-none focus:outline-none focus:border-accent/50 transition-all"
          />
          <div className="flex items-center gap-2">
            <button
              onClick={handleSend}
              disabled={!requestText.trim() || sent}
              className="px-4 py-2 bg-accent text-white font-heading font-bold text-sm rounded-lg hover:bg-accent-glow transition-all disabled:opacity-50"
            >
              {sent ? `✅ ${t.resources.requestSent}` : t.resources.sendRequest}
            </button>
            <button
              onClick={() => { setShowForm(false); setRequestText(''); }}
              className="px-3 py-2 text-sm text-muted hover:text-foreground transition-colors"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
