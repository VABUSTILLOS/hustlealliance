'use client';

// ── Workflowy-Style Personal Planner ───────────────────────────────────
// Infinite nested outliner: Enter (sibling), Tab/Shift+Tab (indent/outdent),
// Ctrl+Enter (toggle done), click bullet to zoom, arrows to navigate,
// collapse/expand children. Every edit auto-saves to localStorage.
//
// Data: "hustle_planner_wf" → { "2025-01-13": WFNode[] }

import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocalStorage } from '@/lib/hooks/useLocalStorage';

// ── Types ──────────────────────────────────────────────────────────────

interface WFNode {
  id: string;
  text: string;
  done: boolean;
  collapsed: boolean;
  children: WFNode[];
}

interface PlannerTree {
  [dateKey: string]: WFNode[];
}

// ── Helpers ────────────────────────────────────────────────────────────

let _idCounter = 0;
function genId(): string {
  _idCounter++;
  return `${Date.now()}-${_idCounter}-${Math.random().toString(36).slice(2, 7)}`;
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Deep clone a tree node */
function cloneNode(n: WFNode): WFNode {
  return { ...n, children: n.children.map(cloneNode) };
}

/** Deep clone array of nodes */
function cloneTree(nodes: WFNode[]): WFNode[] {
  return nodes.map(cloneNode);
}

// ── Tree operations (immutable) ────────────────────────────────────────

type NodePath = number[]; // indices from root

function getNode(nodes: WFNode[], path: number[]): WFNode | null {
  let current: WFNode | undefined;
  let list = nodes;
  for (let i = 0; i < path.length; i++) {
    current = list[path[i]];
    if (!current) return null;
    if (i < path.length - 1) list = current.children;
  }
  return current ?? null;
}

function getParentPath(path: number[]): number[] {
  return path.slice(0, -1);
}

function getParent(nodes: WFNode[], path: number[]): WFNode | null {
  const pp = getParentPath(path);
  if (pp.length === 0) return null;
  return getNode(nodes, pp);
}

/** Replace a node at path (immutable) */
function setNodePath(nodes: WFNode[], path: number[], updater: (n: WFNode) => WFNode): WFNode[] {
  if (path.length === 0) return nodes;
  const [idx, ...rest] = path;
  return nodes.map((n, i) => {
    if (i !== idx) return n;
    if (rest.length === 0) return updater(n);
    return { ...n, children: setNodePath(n.children, rest, updater) };
  });
}

/** Insert sibling after path */
function insertSibling(nodes: WFNode[], path: number[], node: WFNode): WFNode[] {
  if (path.length === 0) return [...nodes, node];
  if (path.length === 1) {
    const idx = path[0];
    const before = nodes.slice(0, idx + 1);
    const after = nodes.slice(idx + 1);
    return [...before, node, ...after];
  }
  const [idx, ...rest] = path;
  return nodes.map((n, i) => (i === idx ? { ...n, children: insertSibling(n.children, rest, node) } : n));
}

/** Add child to node at path */
function addChild(nodes: WFNode[], path: number[], node: WFNode): WFNode[] {
  return setNodePath(nodes, path, (n) => ({ ...n, children: [...n.children, node], collapsed: false }));
}

/** Delete node at path */
function deleteNodeAt(nodes: WFNode[], path: number[]): WFNode[] {
  if (path.length === 0) return nodes;
  if (path.length === 1) {
    const idx = path[0];
    return [...nodes.slice(0, idx), ...nodes.slice(idx + 1)];
  }
  const [idx, ...rest] = path;
  return nodes.map((n, i) => (i === idx ? { ...n, children: deleteNodeAt(n.children, rest) } : n));
}

/** Indent: make node at path a child of the previous sibling */
function indentNode(nodes: WFNode[], path: number[]): WFNode[] | null {
  if (path.length === 0) return null;
  const lastIdx = path[path.length - 1];
  if (lastIdx === 0) return null; // can't indent first item
  const node = getNode(nodes, path);
  if (!node) return null;

  // Remove from current position
  let removed = deleteNodeAt(nodes, path);

  // Calculate new parent path (previous sibling at same level)
  const parentPath = [...path.slice(0, -1), lastIdx - 1];

  // Add as last child of the previous sibling
  // Need to recalculate since removal shifted indices
  // Simplest: remove, then find the right spot
  const parentNode = getNode(removed, parentPath);
  if (!parentNode) return null;

  return setNodePath(removed, parentPath, (n) => ({
    ...n,
    children: [...n.children, node],
    collapsed: false,
  }));
}

/** Outdent: make node a sibling of its parent */
function outdentNode(nodes: WFNode[], path: number[]): WFNode[] | null {
  if (path.length < 2) return null; // at root level, can't outdent
  const node = getNode(nodes, path);
  if (!node) return null;

  // Remove node from current position
  let removed = deleteNodeAt(nodes, path);

  // Insert after parent
  const parentPath = getParentPath(path);
  return insertSibling(removed, parentPath, node);
}

// ── Count visible nodes (for display) ──────────────────────────────────

function countVisible(nodes: WFNode[]): number {
  let count = nodes.length;
  for (const n of nodes) {
    if (!n.collapsed) count += countVisible(n.children);
  }
  return count;
}

// ── Highlight #tags and @mentions ──────────────────────────────────────

function highlightText(text: string): React.ReactNode[] {
  const parts = text.split(/(#[^\s#]+|@[^\s@]+)/g);
  return parts.map((part, i) => {
    if (part.startsWith('#')) {
      return (
        <span key={i} className="text-cyan-400 font-medium">
          {part}
        </span>
      );
    }
    if (part.startsWith('@')) {
      return (
        <span key={i} className="text-purple-400 font-medium">
          {part}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

// ── Focus context ──────────────────────────────────────────────────────
// Tracks which node is focused so we can manage arrow-key navigation.

interface FocusState {
  focusedPath: number[] | null;
  zoomPath: number[] | null; // when zoomed into a node
}

// ── Hook: generate initial tree from templates ─────────────────────────

function createTemplateTree(locale: 'en' | 'es'): WFNode[] {
  const isEs = locale === 'es';
  return [
    {
      id: genId(),
      text: isEs ? '☀️ Rutina de mañana' : '☀️ Morning routine',
      done: false,
      collapsed: false,
      children: [
        { id: genId(), text: '', done: false, collapsed: false, children: [] },
        { id: genId(), text: '', done: false, collapsed: false, children: [] },
      ],
    },
    {
      id: genId(),
      text: isEs ? '🎯 Prioridades de hoy' : '🎯 Today\'s priorities',
      done: false,
      collapsed: false,
      children: [
        { id: genId(), text: '', done: false, collapsed: false, children: [] },
        { id: genId(), text: '', done: false, collapsed: false, children: [] },
        { id: genId(), text: '', done: false, collapsed: false, children: [] },
      ],
    },
    {
      id: genId(),
      text: isEs ? '🙏 Agradezco' : '🙏 Grateful for',
      done: false,
      collapsed: false,
      children: [
        { id: genId(), text: '', done: false, collapsed: false, children: [] },
        { id: genId(), text: '', done: false, collapsed: false, children: [] },
      ],
    },
    {
      id: genId(),
      text: isEs ? '💡 Aprendizajes del día' : '💡 Daily learnings',
      done: false,
      collapsed: false,
      children: [{ id: genId(), text: '', done: false, collapsed: false, children: [] }],
    },
  ];
}

// ── Bullet component (recursive) ───────────────────────────────────────

function BulletNode({
  node,
  path,
  depth,
  allNodes,
  setTree,
  focusState,
  setFocusState,
  locale,
}: {
  node: WFNode;
  path: number[];
  depth: number;
  allNodes: WFNode[];
  setTree: (nodes: WFNode[]) => void;
  focusState: FocusState;
  setFocusState: (fs: FocusState) => void;
  locale: 'en' | 'es';
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const isFocused =
    focusState.focusedPath !== null &&
    focusState.focusedPath.length === path.length &&
    focusState.focusedPath.every((v, i) => v === path[i]);
  const hasChildren = node.children.length > 0;
  const isZoomed = focusState.zoomPath !== null;

  // Auto-focus when this node becomes the focused one
  useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
      // Place cursor at end
      const len = inputRef.current.value.length;
      inputRef.current.setSelectionRange(len, len);
    }
  }, [isFocused]);

  const updateText = useCallback(
    (text: string) => {
      const updated = setNodePath(allNodes, path, (n) => ({ ...n, text }));
      setTree(updated);
    },
    [allNodes, path, setTree],
  );

  const toggleDone = useCallback(() => {
    const updated = setNodePath(allNodes, path, (n) => ({ ...n, done: !n.done }));
    setTree(updated);
  }, [allNodes, path, setTree]);

  const toggleCollapse = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!hasChildren) return;
      const updated = setNodePath(allNodes, path, (n) => ({ ...n, collapsed: !n.collapsed }));
      setTree(updated);
    },
    [allNodes, path, setTree, hasChildren],
  );

  const zoomIn = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setFocusState({ ...focusState, zoomPath: [...path], focusedPath: null });
    },
    [path, focusState, setFocusState],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const input = e.currentTarget;
      const cursorAtStart = input.selectionStart === 0;
      const cursorAtEnd = input.selectionStart === input.value.length;
      const isMod = e.metaKey || e.ctrlKey;

      // Ctrl/Cmd+Enter → toggle done
      if (isMod && e.key === 'Enter') {
        e.preventDefault();
        toggleDone();
        return;
      }

      // Enter → new sibling
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        const newNode: WFNode = { id: genId(), text: '', done: false, collapsed: false, children: [] };
        const updated = insertSibling(allNodes, path, newNode);
        setTree(updated);
        // Find the new node's path
        const newPath = [...path.slice(0, -1), path[path.length - 1] + 1];
        setFocusState({ ...focusState, focusedPath: newPath });
        return;
      }

      // Shift+Enter → add child
      if (e.key === 'Enter' && e.shiftKey) {
        e.preventDefault();
        const newNode: WFNode = { id: genId(), text: '', done: false, collapsed: false, children: [] };
        const updated = addChild(allNodes, path, newNode);
        setTree(updated);
        const newPath = [...path, node.children.length];
        setFocusState({ ...focusState, focusedPath: newPath });
        return;
      }

      // Tab → indent
      if (e.key === 'Tab' && !e.shiftKey) {
        e.preventDefault();
        const result = indentNode(allNodes, path);
        if (result) {
          setTree(result);
          // Path shifted: node moved, need to recalculate
          // Approximate: same path but last index might shift
          const newPath = path.length > 1 ? [...path.slice(0, -1), path[path.length - 1]] : path;
          setFocusState({ ...focusState, focusedPath: newPath });
        }
        return;
      }

      // Shift+Tab → outdent
      if (e.key === 'Tab' && e.shiftKey) {
        e.preventDefault();
        const result = outdentNode(allNodes, path);
        if (result) {
          setTree(result);
          // Outdented node is now after its former parent
          const parentPath = getParentPath(path);
          const newPath = parentPath.length > 0 ? [...parentPath.slice(0, -1), parentPath[parentPath.length - 1] + 1] : [path[0] + 1];
          setFocusState({ ...focusState, focusedPath: newPath });
        }
        return;
      }

      // Backspace on empty node → delete
      if (e.key === 'Backspace' && node.text === '' && cursorAtStart && cursorAtEnd) {
        e.preventDefault();
        const updated = deleteNodeAt(allNodes, path);
        setTree(updated);
        // Focus previous node (same depth, one before, or parent if first)
        const lastIdx = path[path.length - 1];
        let newPath: number[];
        if (lastIdx > 0) {
          newPath = [...path.slice(0, -1), lastIdx - 1];
        } else if (path.length > 1) {
          newPath = getParentPath(path);
        } else {
          newPath = [0]; // fallback — might not exist, will be caught
        }
        setFocusState({ ...focusState, focusedPath: newPath });
        return;
      }

      // Arrow Up → move focus to previous visible node
      if (e.key === 'ArrowUp' && cursorAtStart) {
        e.preventDefault();
        const prev = findPrevVisiblePath(allNodes, focusState.zoomPath, path);
        if (prev) setFocusState({ ...focusState, focusedPath: prev });
        return;
      }

      // Arrow Down → move focus to next visible node
      if (e.key === 'ArrowDown' && cursorAtEnd) {
        e.preventDefault();
        const next = findNextVisiblePath(allNodes, focusState.zoomPath, path);
        if (next) setFocusState({ ...focusState, focusedPath: next });
        return;
      }

      // Arrow Left → collapse if expanded, else focus parent
      if (e.key === 'ArrowLeft' && cursorAtStart) {
        if (hasChildren && !node.collapsed) {
          e.preventDefault();
          const updated = setNodePath(allNodes, path, (n) => ({ ...n, collapsed: true }));
          setTree(updated);
        } else if (path.length > 1) {
          e.preventDefault();
          setFocusState({ ...focusState, focusedPath: getParentPath(path) });
        }
        return;
      }

      // Arrow Right → expand if collapsed, else focus first child
      if (e.key === 'ArrowRight' && cursorAtEnd) {
        if (hasChildren && node.collapsed) {
          e.preventDefault();
          const updated = setNodePath(allNodes, path, (n) => ({ ...n, collapsed: false }));
          setTree(updated);
        } else if (hasChildren && !node.collapsed) {
          e.preventDefault();
          setFocusState({ ...focusState, focusedPath: [...path, 0] });
        }
        return;
      }
    },
    [allNodes, path, focusState, setFocusState, setTree, node, toggleDone, hasChildren],
  );

  // Depth-based styling
  const depthColors = [
    '', // depth 0
    'border-l-orange-500/30', // depth 1
    'border-l-cyan-500/20', // depth 2
    'border-l-purple-500/20', // depth 3
    'border-l-green-500/20', // depth 4+
  ];
  const borderColor = depthColors[Math.min(depth, depthColors.length - 1)];

  return (
    <div className={`${depth > 0 ? `border-l-2 ${borderColor} ml-2 pl-3` : ''}`}>
      <div
        className={`group flex items-start gap-1.5 py-0.5 rounded-r-lg transition-colors cursor-text
          ${isFocused ? 'bg-zinc-800/80' : 'hover:bg-zinc-800/30'}`}
        onClick={() => setFocusState({ ...focusState, focusedPath: [...path] })}
      >
        {/* Collapse/expand toggle */}
        <button
          onClick={toggleCollapse}
          className={`flex-shrink-0 w-4 h-4 flex items-center justify-center text-[10px] text-zinc-600 hover:text-zinc-300 transition-colors mt-[3px]
            ${!hasChildren ? 'invisible' : ''}`}
        >
          {node.collapsed ? '▶' : '▼'}
        </button>

        {/* Bullet dot (zoom trigger) */}
        <button
          onClick={zoomIn}
          className={`flex-shrink-0 w-4 h-4 rounded-full mt-[3px] transition-all flex items-center justify-center
            ${node.done
              ? 'bg-green-500/30 border border-green-500/50'
              : 'border border-zinc-600 group-hover:border-zinc-400'
            }`}
          title={locale === 'es' ? 'Enfocar' : 'Zoom in'}
        >
          {node.done && <span className="text-[8px] text-green-400">✓</span>}
        </button>

        {/* Text input */}
        <input
          ref={inputRef}
          type="text"
          value={node.text}
          onChange={(e) => updateText(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocusState({ ...focusState, focusedPath: [...path] })}
          placeholder={
            depth === 0
              ? locale === 'es'
                ? 'Escribe algo... (Enter = nuevo, Tab = indentar, Ctrl+Enter = completar)'
                : 'Type something... (Enter = new, Tab = indent, Ctrl+Enter = complete)'
              : ''
          }
          className={`flex-1 bg-transparent text-sm outline-none border-none py-[2px] min-w-0
            ${node.done ? 'text-zinc-600 line-through' : 'text-zinc-200'}
            placeholder:text-zinc-600`}
        />

        {/* Tag preview (visible when not focused) */}
        {!isFocused && node.text && (node.text.includes('#') || node.text.includes('@')) && (
          <span className="text-xs truncate max-w-[120px] text-zinc-600 italic flex-shrink-0 hidden sm:inline">
            {node.text.match(/(#[^\s#]+|@[^\s@]+)/g)?.join(' ') ?? ''}
          </span>
        )}

        {/* Done indicator */}
        <span className="flex-shrink-0 w-6 text-right">
          {node.done && <span className="text-[10px] text-green-500/60">done</span>}
        </span>
      </div>

      {/* Children */}
      <AnimatePresence>
        {hasChildren && !node.collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            {node.children.map((child, i) => (
              <BulletNode
                key={child.id}
                node={child}
                path={[...path, i]}
                depth={depth + 1}
                allNodes={allNodes}
                setTree={setTree}
                focusState={focusState}
                setFocusState={setFocusState}
                locale={locale}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Zoom breadcrumb ────────────────────────────────────────────────────

function Breadcrumb({
  nodes,
  zoomPath,
  onBack,
  locale,
}: {
  nodes: WFNode[];
  zoomPath: number[];
  onBack: (path: number[] | null) => void;
  locale: 'en' | 'es';
}) {
  const crumbs: { text: string; path: number[] }[] = [];
  let list = nodes;
  let current: WFNode | undefined;
  for (let i = 0; i < zoomPath.length; i++) {
    current = list[zoomPath[i]];
    if (!current) break;
    crumbs.push({ text: current.text || (locale === 'es' ? '(sin título)' : '(untitled)'), path: zoomPath.slice(0, i + 1) });
    list = current.children;
  }

  return (
    <div className="flex items-center gap-1 text-xs mb-3 flex-wrap">
      <button
        onClick={() => onBack(null)}
        className="text-zinc-500 hover:text-zinc-200 transition-colors"
      >
        📝 {locale === 'es' ? 'Todo' : 'All'}
      </button>
      {crumbs.map((c, i) => (
        <span key={i} className="flex items-center gap-1">
          <span className="text-zinc-700">/</span>
          <button
            onClick={() => onBack(c.path)}
            className={`truncate max-w-[150px] hover:text-zinc-200 transition-colors
              ${i === crumbs.length - 1 ? 'text-orange-400 font-semibold' : 'text-zinc-500'}`}
          >
            {c.text}
          </button>
        </span>
      ))}
    </div>
  );
}

// ── Visible-node path navigation ──────────────────────────────────────
// Flatten visible nodes into an ordered list of paths.

function flattenVisiblePaths(
  nodes: WFNode[],
  basePath: number[],
  zoomPath: number[] | null,
): number[][] {
  const result: number[][] = [];
  for (let i = 0; i < nodes.length; i++) {
    const nodePath = [...basePath, i];
    result.push(nodePath);
    if (!nodes[i].collapsed && nodes[i].children.length > 0) {
      result.push(...flattenVisiblePaths(nodes[i].children, nodePath, zoomPath));
    }
  }
  return result;
}

function findPrevVisiblePath(
  nodes: WFNode[],
  zoomPath: number[] | null,
  currentPath: number[],
): number[] | null {
  const contextNodes = zoomPath ? (getNode(nodes, zoomPath)?.children ?? nodes) : nodes;
  const contextBase = zoomPath ?? [];
  const all = flattenVisiblePaths(contextNodes, contextBase, zoomPath);
  const idx = all.findIndex((p) => p.length === currentPath.length && p.every((v, i) => v === currentPath[i]));
  if (idx > 0) return all[idx - 1];
  return null;
}

function findNextVisiblePath(
  nodes: WFNode[],
  zoomPath: number[] | null,
  currentPath: number[],
): number[] | null {
  const contextNodes = zoomPath ? (getNode(nodes, zoomPath)?.children ?? nodes) : nodes;
  const contextBase = zoomPath ?? [];
  const all = flattenVisiblePaths(contextNodes, contextBase, zoomPath);
  const idx = all.findIndex((p) => p.length === currentPath.length && p.every((v, i) => v === currentPath[i]));
  if (idx >= 0 && idx < all.length - 1) return all[idx + 1];
  return null;
}

// ── Main Component ────────────────────────────────────────────────────

export default function PersonalPlanner({ locale }: { locale: 'en' | 'es' }) {
  const [planner, setPlanner] = useLocalStorage<PlannerTree>('hustle_planner_wf', {});
  const today = todayKey();
  const [focusState, setFocusState] = useState<FocusState>({ focusedPath: null, zoomPath: null });

  // Initialize today's tree from templates if empty
  const tree: WFNode[] = useMemo(() => {
    const existing = planner[today];
    if (existing && existing.length > 0) return existing;
    return createTemplateTree(locale);
  }, [planner, today, locale]);

  const setTree = useCallback(
    (nodes: WFNode[]) => {
      setPlanner((prev) => ({ ...prev, [today]: nodes }));
    },
    [today, setPlanner],
  );

  // Reset zoom when tree changes (e.g., after indent/outdent that moves a node)
  const zoomedNode = focusState.zoomPath ? getNode(tree, focusState.zoomPath) : null;

  // Context: what nodes to render (zoomed or root)
  const contextNodes: WFNode[] = zoomedNode ? zoomedNode.children : tree;
  const contextPath: number[] = focusState.zoomPath ?? [];

  const visibleCount = countVisible(tree);

  // Quick templates that work with the tree model
  const insertTemplate = (preset: 'morning' | 'priorities' | 'gratitude') => {
    const templates: Record<string, WFNode[]> = {
      morning: [
        {
          id: genId(),
          text: locale === 'es' ? '☀️ Rutina de mañana' : '☀️ Morning routine',
          done: false,
          collapsed: false,
          children: [
            { id: genId(), text: '', done: false, collapsed: false, children: [] },
            { id: genId(), text: '', done: false, collapsed: false, children: [] },
          ],
        },
      ],
      priorities: [
        {
          id: genId(),
          text: locale === 'es' ? '🎯 Prioridades' : '🎯 Priorities',
          done: false,
          collapsed: false,
          children: [
            { id: genId(), text: '', done: false, collapsed: false, children: [] },
            { id: genId(), text: '', done: false, collapsed: false, children: [] },
            { id: genId(), text: '', done: false, collapsed: false, children: [] },
          ],
        },
      ],
      gratitude: [
        {
          id: genId(),
          text: locale === 'es' ? '🙏 Agradezco' : '🙏 Grateful for',
          done: false,
          collapsed: false,
          children: [
            { id: genId(), text: '', done: false, collapsed: false, children: [] },
            { id: genId(), text: '', done: false, collapsed: false, children: [] },
          ],
        },
      ],
    };
    const newNodes = templates[preset];
    setTree([...tree, ...newNodes]);
  };

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
      {focusState.zoomPath && focusState.zoomPath.length > 0 && (
        <Breadcrumb
          nodes={tree}
          zoomPath={focusState.zoomPath}
          onBack={(path) => setFocusState({ ...focusState, zoomPath: path, focusedPath: null })}
          locale={locale}
        />
      )}

      {/* Quick templates */}
      {!focusState.zoomPath && (
        <div className="flex gap-1.5 mb-3 flex-wrap">
          {(['morning', 'priorities', 'gratitude'] as const).map((preset) => (
            <button
              key={preset}
              onClick={() => insertTemplate(preset)}
              className="text-[10px] sm:text-xs px-2 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              {preset === 'morning'
                ? locale === 'es'
                  ? '🌅 Mañana'
                  : '🌅 Morning'
                : preset === 'priorities'
                  ? locale === 'es'
                    ? '🎯 Prioridades'
                    : '🎯 Priorities'
                  : locale === 'es'
                    ? '🙏 Gratitud'
                    : '🙏 Gratitude'}
            </button>
          ))}
          <button
            onClick={() => {
              const newNode: WFNode = {
                id: genId(), text: '', done: false, collapsed: false, children: [],
              };
              setTree([...tree, newNode]);
              setFocusState({ ...focusState, focusedPath: [tree.length] });
            }}
            className="text-[10px] sm:text-xs px-2 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            + {locale === 'es' ? 'Ítem' : 'Item'}
          </button>
        </div>
      )}

      {/* Bullet tree */}
      <div className="flex-1 overflow-y-auto -mx-1 px-1 min-h-[200px]">
        {contextNodes.map((node, i) => (
          <BulletNode
            key={node.id}
            node={node}
            path={[...contextPath, i]}
            depth={contextPath.length}
            allNodes={tree}
            setTree={setTree}
            focusState={focusState}
            setFocusState={setFocusState}
            locale={locale}
          />
        ))}
        {contextNodes.length === 0 && (
          <p className="text-sm text-zinc-600 text-center py-8">
            {locale === 'es'
              ? 'Haz clic en + Ítem o usa un template para comenzar.'
              : 'Click + Item or use a template to get started.'}
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-800/50">
        <span className="text-[10px] text-zinc-600">
          {visibleCount} {locale === 'es' ? 'nodos' : 'nodes'}
        </span>
        <span className="text-[10px] text-zinc-500">
          {locale === 'es'
            ? 'Enter: nuevo | Tab: indentar | Ctrl+Enter: ✓'
            : 'Enter: new | Tab: indent | Ctrl+Enter: ✓'}
        </span>
      </div>
    </motion.div>
  );
}
