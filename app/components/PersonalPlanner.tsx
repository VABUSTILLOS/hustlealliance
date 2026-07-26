'use client';

// ── Personal Planner (Workflowy-Style Outliner) ────────────────────────
// Flat-map architecture: all nodes in a normalized Record<string, PlannerNode>.
// Order tracked via rootOrder + per-node childrenIds arrays.
// Keyboard-driven: Enter (sibling), Tab/Shift+Tab (indent/outdent),
// Ctrl+Enter (done), Backspace on empty (delete), arrows for navigation.
// Click bullet to zoom, breadcrumb to unzoom.

import { useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkflowy } from '@/lib/hooks/useWorkflowy';

// ── Highlight #tags and @mentions ──────────────────────────────────────

function highlightText(text: string): React.ReactNode[] {
  const parts = text.split(/(#[^\s#]+|@[^\s@]+)/g);
  return parts.map((part, i) => {
    if (part.startsWith('#')) return <span key={i} className="text-cyan-400 font-medium">{part}</span>;
    if (part.startsWith('@')) return <span key={i} className="text-purple-400 font-medium">{part}</span>;
    return <span key={i}>{part}</span>;
  });
}

// ── Breadcrumb bar ─────────────────────────────────────────────────────

function Breadcrumb({
  breadcrumb,
  onZoomOut,
  locale,
}: {
  breadcrumb: { id: string; content: string }[];
  onZoomOut: (targetId: string | null) => void;
  locale: 'en' | 'es';
}) {
  if (breadcrumb.length === 0) return null;

  return (
    <div className="flex items-center gap-1 text-xs mb-3 flex-wrap">
      <button onClick={() => onZoomOut(null)} className="text-zinc-500 hover:text-zinc-200 transition-colors">
        📝 {locale === 'es' ? 'Todo' : 'All'}
      </button>
      {breadcrumb.map((c, i) => (
        <span key={c.id} className="flex items-center gap-1">
          <span className="text-zinc-700">/</span>
          <button
            onClick={() => onZoomOut(c.id)}
            className={`truncate max-w-[150px] hover:text-zinc-200 transition-colors ${
              i === breadcrumb.length - 1 ? 'text-orange-400 font-semibold' : 'text-zinc-500'
            }`}
          >
            {c.content}
          </button>
        </span>
      ))}
    </div>
  );
}

// ── NodeRow ────────────────────────────────────────────────────────────

function NodeRow({
  nodeId,
  depth,
  hook,
  locale,
}: {
  nodeId: string;
  depth: number;
  hook: ReturnType<typeof useWorkflowy>;
  locale: 'en' | 'es';
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const node = hook.nodeMap[nodeId];
  const isFocused = hook.focusState.focusedId === nodeId;

  // Auto-focus when this node becomes focused
  useEffect(() => {
    if (isFocused && textareaRef.current) {
      const ta = textareaRef.current;
      ta.focus();
      const len = ta.value.length;
      ta.setSelectionRange(len, len);
    }
  }, [isFocused]);

  // Auto-resize textarea height to fit content
  useEffect(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = ta.scrollHeight + 'px';
    }
  }, [node?.content]);

  if (!node) return null;

  const hasChildren = node.childrenIds.length > 0;

  // Recursively check if all descendants are done (for parent checkbox constraint)
  const allDescendantsDone = useCallback(
    (nid: string): boolean => {
      const n = hook.nodeMap[nid];
      if (!n) return true;
      for (const cid of n.childrenIds) {
        const child = hook.nodeMap[cid];
        if (!child || !child.isDone) return false;
        if (!allDescendantsDone(cid)) return false;
      }
      return true;
    },
    [hook.nodeMap],
  );
  const canCheck = !hasChildren || allDescendantsDone(nodeId);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      const input = e.currentTarget;
      const cursorAtStart = input.selectionStart === 0;
      const cursorAtEnd = input.selectionStart === input.value.length;
      const isMod = e.metaKey || e.ctrlKey;

      // Ctrl/Cmd+Enter → toggle done
      if (isMod && e.key === 'Enter') {
        e.preventDefault();
        hook.toggleDone(nodeId);
        return;
      }

      // Shift+Enter or Enter → let textarea insert newline naturally (notepad feel)
      if (e.key === 'Enter' && !isMod) {
        return; // default behavior: textarea inserts \n
      }

      // Tab → indent
      if (e.key === 'Tab' && !e.shiftKey) {
        e.preventDefault();
        hook.indentNode(nodeId);
        return;
      }

      // Shift+Tab → outdent
      if (e.key === 'Tab' && e.shiftKey) {
        e.preventDefault();
        hook.outdentNode(nodeId);
        return;
      }

      // Backspace on empty → delete
      if (e.key === 'Backspace' && node.content === '' && cursorAtStart && cursorAtEnd) {
        e.preventDefault();
        hook.deleteNode(nodeId);
        return;
      }

      // Arrow Up → prev visible node
      if (e.key === 'ArrowUp' && cursorAtStart) {
        e.preventDefault();
        hook.focusPrev(nodeId);
        return;
      }

      // Arrow Down → next visible node
      if (e.key === 'ArrowDown' && cursorAtEnd) {
        e.preventDefault();
        hook.focusNext(nodeId);
        return;
      }

      // Arrow Left → collapse if expanded + has children, else focus parent
      if (e.key === 'ArrowLeft' && cursorAtStart) {
        if (hasChildren && !node.isCollapsed) {
          e.preventDefault();
          hook.toggleCollapse(nodeId);
        } else if (!hook.focusState.activeRootId) {
          e.preventDefault();
          hook.focusParent(nodeId);
        }
        return;
      }

      // Arrow Right → expand if collapsed, else focus first child
      if (e.key === 'ArrowRight' && cursorAtEnd) {
        if (hasChildren && node.isCollapsed) {
          e.preventDefault();
          hook.toggleCollapse(nodeId);
        } else if (hasChildren && !node.isCollapsed) {
          e.preventDefault();
          hook.focusFirstChild(nodeId);
        }
        return;
      }
    },
    [hook, nodeId, node.content, hasChildren],
  );

  const depthColors = [
    '', 'border-l-orange-500/30', 'border-l-cyan-500/20',
    'border-l-purple-500/20', 'border-l-green-500/20',
  ];
  const borderColor = depthColors[Math.min(depth, depthColors.length - 1)];

  const content = node.content;
  const showTags = !isFocused && content && (content.includes('#') || content.includes('@'));

  return (
    <div className={`${depth > 0 ? `border-l-2 ${borderColor} ml-2 pl-3` : ''}`}>
      <div
        className={`group flex items-start gap-1.5 py-0.5 rounded-r-lg transition-colors cursor-text ${
          isFocused ? 'bg-zinc-800/80' : 'hover:bg-zinc-800/30'
        }`}
      >
        {/* Collapse/expand toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (hasChildren) hook.toggleCollapse(nodeId);
          }}
          className={`flex-shrink-0 w-4 h-4 flex items-center justify-center text-[10px] text-zinc-600 hover:text-zinc-300 transition-colors mt-[3px] ${
            !hasChildren ? 'invisible' : ''
          }`}
        >
          {node.isCollapsed ? '▶' : '▼'}
        </button>

        {/* To-do checkbox — toggles done; blocked if children aren't all checked */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (canCheck || node.isDone) hook.toggleDone(nodeId);
          }}
          disabled={!canCheck && !node.isDone}
          title={
            node.isDone
              ? locale === 'es' ? 'Desmarcar' : 'Uncheck'
              : !canCheck
                ? locale === 'es' ? 'Completa los hijos primero' : 'Complete children first'
                : locale === 'es' ? 'Marcar como hecho' : 'Mark done'
          }
          className={`flex-shrink-0 w-4 h-4 rounded-sm mt-[3px] transition-all flex items-center justify-center border ${
            node.isDone
              ? 'bg-green-500/30 border-green-500/50'
              : canCheck
                ? 'border-zinc-500 group-hover:border-zinc-300 bg-transparent'
                : 'border-zinc-700 bg-zinc-800/50 cursor-not-allowed opacity-40'
          }`}
        >
          {node.isDone && <span className="text-[8px] text-green-400">✓</span>}
        </button>

        {/* Bullet dot (zoom trigger) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            hook.zoomIn(nodeId);
          }}
          className={`flex-shrink-0 w-4 h-4 rounded-full mt-[3px] transition-all flex items-center justify-center ${
            node.isDone
              ? 'bg-green-500/30 border border-green-500/50'
              : 'bg-zinc-700 border border-zinc-500 group-hover:border-zinc-300'
          }`}
          title={locale === 'es' ? 'Enfocar' : 'Zoom in'}
        >
          {node.isDone ? (
            <span className="text-[8px] text-green-400">✓</span>
          ) : (
            <span className="w-1.5 h-1.5 rounded-full bg-white/80" />
          )}
        </button>

        {/* + icon — add sibling (replaces Enter key) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            hook.addSibling(nodeId);
          }}
          className="flex-shrink-0 w-4 h-4 rounded-sm mt-[3px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-zinc-500 hover:text-zinc-200 hover:bg-zinc-700/50"
          title={locale === 'es' ? 'Nuevo ítem' : 'New item'}
        >
          <span className="text-[12px] leading-none">+</span>
        </button>

        {/* Textarea (multiline, bold) — onMouseDown stops propagation so click focuses without zooming */}
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => hook.updateContent(nodeId, e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => hook.focusNode(nodeId)}
          onMouseUp={(e) => {
            // Place cursor at end so user can immediately Shift+Enter for line break
            const ta = e.currentTarget;
            const len = ta.value.length;
            ta.setSelectionRange(len, len);
          }}
          placeholder={
            depth === 0
              ? locale === 'es'
                ? 'Escribe algo...'
                : 'Type something...'
              : ''
          }
          rows={1}
          className={`flex-1 bg-transparent text-sm outline-none border-none py-[2px] min-w-0 resize-none overflow-hidden font-semibold ${
            node.isDone ? 'text-zinc-600 line-through' : 'text-zinc-200'
          } placeholder:text-zinc-600`}
        />

        {/* Tag preview (visible when not focused) */}
        {showTags && (
          <span className="text-xs truncate max-w-[120px] text-zinc-600 italic flex-shrink-0 hidden sm:inline">
            {content.match(/(#[^\s#]+|@[^\s@]+)/g)?.join(' ') ?? ''}
          </span>
        )}
      </div>

      {/* Children */}
      <AnimatePresence>
        {hasChildren && !node.isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            {node.childrenIds.map((childId) => (
              <NodeRow
                key={childId}
                nodeId={childId}
                depth={depth + 1}
                hook={hook}
                locale={locale}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────

export default function PersonalPlanner({ locale }: { locale: 'en' | 'es' }) {
  const hook = useWorkflowy(locale);
  const { state, focusState, breadcrumb, nodeCount, zoomOut, addRootNode } = hook;

  // Determine which nodes to render based on zoom
  const renderedNodeIds: string[] = (() => {
    if (focusState.activeRootId) {
      const rootNode = state.nodeMap[focusState.activeRootId];
      return rootNode ? rootNode.childrenIds : [];
    }
    return state.rootOrder;
  })();

  return (
    <motion.div
      className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 sm:p-5 flex flex-col h-full"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">📝</span>
          <h3 className="text-sm font-semibold text-zinc-100">
            {locale === 'es' ? 'Planificador Personal' : 'Personal Planner'}
          </h3>
        </div>
        <span className="text-[10px] text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-full">
          {locale === 'es'
            ? new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'short' })
            : new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short' })}
        </span>
      </div>

      {/* Breadcrumb (when zoomed) */}
      <Breadcrumb breadcrumb={breadcrumb} onZoomOut={zoomOut} locale={locale} />

      {/* Zoomed header: editable title of the zoomed-in node */}
      {focusState.activeRootId && state.nodeMap[focusState.activeRootId] && (
        <div className="flex items-center gap-2 mb-3 px-2 py-1.5 rounded-lg bg-orange-500/5 border border-orange-500/15">
          <button
            onClick={() => zoomOut(null)}
            className="text-zinc-500 hover:text-zinc-200 transition-colors flex-shrink-0"
            title={locale === 'es' ? 'Volver' : 'Go back'}
          >
            ←
          </button>
          <input
            type="text"
            value={state.nodeMap[focusState.activeRootId].content}
            onChange={(e) => hook.updateContent(focusState.activeRootId!, e.target.value)}
            className="flex-1 bg-transparent text-sm font-semibold text-orange-300 outline-none border-none min-w-0"
            placeholder={locale === 'es' ? '(sin título)' : '(untitled)'}
          />
          <span className="text-[10px] text-orange-500/60 flex-shrink-0">
            {state.nodeMap[focusState.activeRootId].childrenIds.length} {locale === 'es' ? 'ítems' : 'items'}
          </span>
        </div>
      )}

      {/* Quick actions */}
      <div className="flex gap-1.5 mb-3 flex-wrap">
        {focusState.activeRootId ? (
          <button
            onClick={() => hook.addChild(focusState.activeRootId!)}
            className="text-[10px] sm:text-xs px-2 py-1 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20 hover:bg-orange-500/20 transition-colors font-medium"
          >
            + {locale === 'es' ? 'Nuevo Ítem' : 'New Item'}
          </button>
        ) : (
          <button
            onClick={addRootNode}
            className="text-[10px] sm:text-xs px-2 py-1 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20 hover:bg-orange-500/20 transition-colors font-medium"
          >
            + {locale === 'es' ? 'Nuevo Ítem' : 'New Item'}
          </button>
        )}
      </div>

      {/* Node tree */}
      <div className="flex-1 overflow-y-auto -mx-1 px-1 min-h-[300px]">
        {renderedNodeIds.map((nodeId) => (
          <NodeRow
            key={nodeId}
            nodeId={nodeId}
            depth={focusState.activeRootId ? 1 : 0}
            hook={hook}
            locale={locale}
          />
        ))}
        {renderedNodeIds.length === 0 && (
          <p className="text-sm text-zinc-600 text-center py-8">
            {focusState.activeRootId
              ? locale === 'es'
                ? 'Vacío. Haz clic en + para agregar un ítem.'
                : 'Empty. Click + to add an item.'
              : locale === 'es'
                ? 'Haz clic en "+ Nuevo Ítem" para comenzar.'
                : 'Click "+ New Item" to get started.'}
          </p>
        )}
      </div>

      {/* Footer — keyboard shortcut legend */}
      <div className="mt-3 pt-3 border-t border-zinc-800/50">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-zinc-600">
            {nodeCount} {locale === 'es' ? 'nodos' : 'nodes'}
          </span>
          <span className="text-[10px] text-zinc-500">
            {locale === 'es' ? '• = enfocar | Clic texto = editar' : '• = zoom | Click text = edit'}
          </span>
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] text-zinc-600">
          <span><kbd className="text-zinc-500 bg-zinc-800 px-1 rounded text-[9px]">☐</kbd> {locale === 'es' ? 'check' : 'check'}</span>
          <span><kbd className="text-zinc-500 bg-zinc-800 px-1 rounded text-[9px]">+</kbd> {locale === 'es' ? 'nuevo' : 'new'}</span>
          <span><kbd className="text-zinc-500 bg-zinc-800 px-1 rounded text-[9px]">Enter</kbd> {locale === 'es' ? 'salto de línea' : 'line break'}</span>
          <span><kbd className="text-zinc-500 bg-zinc-800 px-1 rounded text-[9px]">Tab</kbd> {locale === 'es' ? 'indentar' : 'indent'}</span>
          <span><kbd className="text-zinc-500 bg-zinc-800 px-1 rounded text-[9px]">Shift+Tab</kbd> {locale === 'es' ? 'salir' : 'outdent'}</span>
          <span><kbd className="text-zinc-500 bg-zinc-800 px-1 rounded text-[9px]">Ctrl+Enter</kbd> ✓</span>
          <span><kbd className="text-zinc-500 bg-zinc-800 px-1 rounded text-[9px]">⌫</kbd> {locale === 'es' ? 'borrar' : 'delete'}</span>
        </div>
      </div>
    </motion.div>
  );
}
