'use client';

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  useDraggable,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Block } from '@/lib/pages/blocks';
import { BLOCK_LABELS } from '@/lib/pages/blocks';
import { BlockRenderer } from '@/lib/pages/components/blocks';

/**
 * Center canvas: a sortable list of block "cards". Each card wraps the
 * shared presentational `BlockRenderer` and adds a small freeform drag
 * handle overlay so an element can be nudged by x/y offset within its
 * section without altering document order (stored in `block.position`).
 */

function FreeformNudgeHandle({ block }: { block: Block }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: `nudge-${block.id}` });
  const style = transform ? { transform: CSS.Translate.toString(transform) } : undefined;

  return (
    <button
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      title="Drag to nudge position (x/y offset)"
      className="absolute top-2 right-10 z-10 w-7 h-7 flex items-center justify-center rounded-lg bg-surface/90 text-muted hover:text-accent cursor-move text-xs"
      onPointerUp={(e) => {
        // useDraggable doesn't give us a delta on release directly in this
        // simplified handler; nudges are applied via onDragEnd in the parent
        // DndContext instead. This button primarily serves as the drag handle.
        e.stopPropagation();
      }}
    >
      ⤧
    </button>
  );
}

function SortableBlockCard({
  block,
  selected,
  onSelect,
  onRemove,
}: {
  block: Block;
  selected: boolean;
  onSelect: () => void;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const offsetStyle = block.position
    ? { transform: `translate(${block.position.x || 0}px, ${block.position.y || 0}px)` }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onSelect}
      className={`relative group rounded-2xl border-2 transition-colors cursor-pointer ${
        selected ? 'border-accent' : 'border-transparent hover:border-border'
      }`}
    >
      <div className="absolute top-2 left-2 z-10 flex items-center gap-1">
        <span
          {...attributes}
          {...listeners}
          className="w-7 h-7 flex items-center justify-center rounded-lg bg-surface/90 text-muted hover:text-foreground cursor-grab active:cursor-grabbing text-xs"
          title="Drag to reorder"
        >
          ⠿
        </span>
        <span className="px-2 py-1 rounded-lg bg-surface/90 text-[10px] font-medium text-muted uppercase tracking-wide">
          {BLOCK_LABELS[block.type]}
        </span>
      </div>
      <FreeformNudgeHandle block={block} />
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="absolute top-2 right-2 z-10 w-7 h-7 flex items-center justify-center rounded-lg bg-surface/90 text-muted hover:text-red-400 text-xs"
        title="Remove section"
      >
        ✕
      </button>
      <div style={offsetStyle} className="pointer-events-none">
        <div className="pointer-events-auto">
          <BlockRenderer block={block} />
        </div>
      </div>
    </div>
  );
}

export function Canvas({
  blocks,
  selectedId,
  onSelect,
  onReorder,
  onRemove,
  onNudge,
  previewWidth,
}: {
  blocks: Block[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onReorder: (blocks: Block[]) => void;
  onRemove: (id: string) => void;
  onNudge: (id: string, dx: number, dy: number) => void;
  previewWidth: 'desktop' | 'mobile';
}) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over, delta } = event;
    const activeId = String(active.id);

    if (activeId.startsWith('nudge-')) {
      const blockId = activeId.replace('nudge-', '');
      onNudge(blockId, delta.x, delta.y);
      return;
    }

    if (!over || active.id === over.id) return;
    const oldIndex = blocks.findIndex((b) => b.id === active.id);
    const newIndex = blocks.findIndex((b) => b.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    onReorder(arrayMove(blocks, oldIndex, newIndex));
  };

  return (
    <div className="flex-1 overflow-y-auto bg-surface-light/30 p-6">
      <div
        className={`mx-auto bg-background rounded-2xl overflow-hidden shadow-xl transition-all ${
          previewWidth === 'mobile' ? 'max-w-sm' : 'max-w-4xl'
        }`}
      >
        {blocks.length === 0 ? (
          <div className="p-16 text-center text-muted text-sm">
            Add a section from the palette to get started.
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-1">
                {blocks.map((block) => (
                  <SortableBlockCard
                    key={block.id}
                    block={block}
                    selected={block.id === selectedId}
                    onSelect={() => onSelect(block.id)}
                    onRemove={() => onRemove(block.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
}
