'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useMemo } from 'react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import type { Resource } from '@/lib/data/resources';
import { getResourceContent, hasRealContent } from '@/lib/data/resources-content';
import { GuideViewer } from './GuideViewer';
import { SpreadsheetViewer } from './SpreadsheetViewer';
import { InfographicViewer } from './InfographicViewer';
import { CheatsheetViewer } from './CheatsheetViewer';
import { SopViewer } from './SopViewer';

interface ResourceSectionLike {
  heading: string;
  body: string;
  subsections?: ResourceSectionLike[];
}

function getGuideSections(
  ct: NonNullable<ReturnType<typeof getResourceContent>>,
  isEs: boolean
): ResourceSectionLike[] {
  if (ct.kind === 'guide' || ct.kind === 'ebook') {
    return isEs ? ct.contentEs.sections : ct.content.sections;
  }
  if (ct.kind === 'template') {
    return isEs ? ct.contentEs.sections : ct.content.sections;
  }
  return [];
}

interface ResourceViewerProps {
  resource: Resource;
  locale: 'en' | 'es';
  onClose: () => void;
}

export function ResourceViewer({ resource, locale, onClose }: ResourceViewerProps) {
  const { t } = useTranslation();
  const realContent = useMemo(() => {
    if (hasRealContent(resource.id)) {
      return getResourceContent(resource.id);
    }
    return null;
  }, [resource.id]);

  // Determine which viewer to use based on resource type
  const viewer = useMemo(() => {
    if (!realContent) return 'fallback';

    switch (realContent.kind) {
      case 'guide':
      case 'ebook':
      case 'template':
        return 'guide';
      case 'spreadsheet':
        return 'spreadsheet';
      case 'infographic':
        return 'infographic';
      case 'cheatsheet':
        return 'cheatsheet';
      case 'sop':
        return 'sop';
      case 'audio':
        return 'audio';
      default:
        return 'fallback';
    }
  }, [realContent]);

  const isEs = locale === 'es';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25 }}
          className="relative bg-surface border border-surface-light rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[92vh] flex flex-col overflow-hidden"
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-all"
            aria-label={t.general.close}
          >
            ✕
          </button>

          {/* Content area */}
          <div className="flex-1 overflow-y-auto">
            {viewer === 'guide' && realContent && (
              <GuideViewer
                title={isEs && resource.titleEs ? resource.titleEs : resource.title}
                description={isEs && resource.descriptionEs ? resource.descriptionEs : resource.description}
                type={resource.type}
                sections={getGuideSections(realContent, isEs)}
                fields={realContent.kind === 'template'
                  ? (isEs ? realContent.contentEs : realContent.content).fields
                  : undefined}
              />
            )}
            {viewer === 'spreadsheet' && realContent?.kind === 'spreadsheet' && (
              <SpreadsheetViewer
                title={isEs && resource.titleEs ? resource.titleEs : resource.title}
                description={isEs && resource.descriptionEs ? resource.descriptionEs : resource.description}
                content={isEs ? realContent.contentEs : realContent.content}
              />
            )}
            {viewer === 'infographic' && realContent?.kind === 'infographic' && (
              <InfographicViewer
                title={isEs && resource.titleEs ? resource.titleEs : resource.title}
                description={isEs && resource.descriptionEs ? resource.descriptionEs : resource.description}
                content={isEs ? realContent.contentEs : realContent.content}
              />
            )}
            {viewer === 'cheatsheet' && realContent?.kind === 'cheatsheet' && (
              <CheatsheetViewer
                title={isEs && resource.titleEs ? resource.titleEs : resource.title}
                description={isEs && resource.descriptionEs ? resource.descriptionEs : resource.description}
                content={isEs ? realContent.contentEs : realContent.content}
              />
            )}
            {viewer === 'sop' && realContent?.kind === 'sop' && (
              <SopViewer
                title={isEs && resource.titleEs ? resource.titleEs : resource.title}
                description={isEs && resource.descriptionEs ? resource.descriptionEs : resource.description}
                content={isEs ? realContent.contentEs : realContent.content}
              />
            )}
            {viewer === 'fallback' && (
              <FallbackViewer
                title={isEs && resource.titleEs ? resource.titleEs : resource.title}
                description={isEs && resource.descriptionEs ? resource.descriptionEs : resource.description}
                type={resource.type}
                resourceId={resource.id}
                locale={locale}
              />
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/** Fallback for resources without real content yet */
function FallbackViewer({
  title, description, type, resourceId, locale,
}: {
  title: string; description: string; type: string; resourceId: string; locale: string;
}) {
  const isEs = locale === 'es';
  return (
    <div className="p-8 space-y-6">
      <div className="space-y-2">
        <span className="px-2.5 py-1 rounded-lg bg-accent/10 border border-accent/20 text-accent text-[10px] font-bold uppercase tracking-wider">
          {type}
        </span>
        <h2 className="text-2xl font-heading font-bold text-foreground">{title}</h2>
      </div>
      <p className="text-muted leading-relaxed">{description}</p>
      <div className="bg-surface-light/30 rounded-xl p-6 text-center space-y-3">
        <span className="text-3xl">🚧</span>
        <p className="text-muted text-sm">
          {isEs
            ? 'El contenido completo de este recurso está en desarrollo. Mientras tanto, puedes descargar la versión actual.'
            : 'Full content for this resource is being built. In the meantime, you can download the current version.'}
        </p>
        <a
          href={`/api/download/${resourceId}?lang=${locale}`}
          download
          className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white font-heading font-bold text-sm rounded-lg hover:bg-accent-glow transition-all"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
          </svg>
          {isEs ? 'Descargar' : 'Download'}
        </a>
      </div>
    </div>
  );
}
