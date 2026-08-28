import { BLOCK_TYPES, BLOCK_LABELS, type BlockType } from '@/lib/pages/blocks';

const ICONS: Record<BlockType, string> = {
  hero: '🏔️',
  features: '✨',
  pricing: '💳',
  testimonials: '💬',
  cta: '📣',
  faq: '❓',
  richtext: '📝',
  image: '🖼️',
  video: '🎬',
  embed: '🔗',
};

/** Left-hand palette of insertable block types. Click to append to canvas. */
export function BlockPalette({ onAdd }: { onAdd: (type: BlockType) => void }) {
  return (
    <div className="p-4 space-y-2">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-muted mb-3">Add Section</h2>
      {BLOCK_TYPES.map((type) => (
        <button
          key={type}
          onClick={() => onAdd(type)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-surface-light hover:bg-accent/10 hover:text-accent text-foreground text-sm font-medium transition-colors text-left"
        >
          <span className="text-lg">{ICONS[type]}</span>
          {BLOCK_LABELS[type]}
        </button>
      ))}
    </div>
  );
}
