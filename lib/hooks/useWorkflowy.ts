'use client';

// ── Workflowy Hook ──────────────────────────────────────────────────────
// Manages normalized flat-map state with localStorage persistence,
// focus tracking, and zoom (activeRootId) support.

import { useState, useCallback, useMemo, useEffect } from 'react';
import { useLocalStorage } from '@/lib/hooks/useLocalStorage';
import type {
  PlannerState,
  PlannerNode,
  FocusState,
  NodeMap,
} from '@/lib/data/workflowy-types';
import {
  addSibling as addSiblingOp,
  addChild as addChildOp,
  indentNode as indentNodeOp,
  outdentNode as outdentNodeOp,
  deleteNode as deleteNodeOp,
  toggleDone as toggleDoneOp,
  toggleCollapse as toggleCollapseOp,
  updateContent as updateContentOp,
  buildBreadcrumb,
  getVisibleNodeIds,
  getAdjacentVisibleId,
  createTemplateTree,
  genId,
  createNode as createNewNode,
} from '@/lib/data/workflowy-types';

// ── Storage shape ───────────────────────────────────────────────────────

interface PlannerStore {
  [dateKey: string]: PlannerState;
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

// ── Hook ────────────────────────────────────────────────────────────────

export function useWorkflowy(locale: 'en' | 'es') {
  const [store, setStore] = useLocalStorage<PlannerStore>('hustle_planner_wf2', {});
  const today = todayKey();
  const [focusState, setFocusState] = useState<FocusState>({ focusedId: null, activeRootId: null });

  // Initialize today's state from template if empty
  const state: PlannerState = useMemo(() => {
    const existing = store[today];
    if (existing && existing.rootOrder && existing.rootOrder.length > 0) return existing;

    // Migrate from old format or create fresh
    const fresh = createTemplateTree(locale);
    // Persist immediately
    setTimeout(() => setStore((prev) => ({ ...prev, [today]: fresh })), 0);
    return fresh;
  }, [store, today, locale]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Commit helper ──────────────────────────────────────────────────

  const commit = useCallback(
    (newState: PlannerState) => {
      setStore((prev) => ({ ...prev, [today]: newState }));
    },
    [today, setStore],
  );

  // ── Operations ─────────────────────────────────────────────────────

  const addSibling = useCallback(
    (nodeId: string) => {
      const result = addSiblingOp(state, nodeId);
      commit({ nodeMap: result.nodeMap, rootOrder: result.rootOrder });
      if (result.newId) setFocusState((fs) => ({ ...fs, focusedId: result.newId }));
    },
    [state, commit],
  );

  const addChild = useCallback(
    (parentId: string) => {
      const result = addChildOp(state, parentId);
      commit({ nodeMap: result.nodeMap, rootOrder: result.rootOrder });
      if (result.newId) setFocusState((fs) => ({ ...fs, focusedId: result.newId }));
    },
    [state, commit],
  );

  const indentNode = useCallback(
    (nodeId: string) => {
      const newState = indentNodeOp(state, nodeId);
      commit(newState);
    },
    [state, commit],
  );

  const outdentNode = useCallback(
    (nodeId: string) => {
      const newState = outdentNodeOp(state, nodeId);
      commit(newState);
    },
    [state, commit],
  );

  const deleteNode = useCallback(
    (nodeId: string) => {
      const result = deleteNodeOp(state, nodeId);
      commit({ nodeMap: result.nodeMap, rootOrder: result.rootOrder });
      if (result.fallbackFocusId) setFocusState((fs) => ({ ...fs, focusedId: result.fallbackFocusId }));
    },
    [state, commit],
  );

  const toggleDone = useCallback(
    (nodeId: string) => {
      const newState = toggleDoneOp(state, nodeId);
      commit(newState);
    },
    [state, commit],
  );

  const toggleCollapse = useCallback(
    (nodeId: string) => {
      const newState = toggleCollapseOp(state, nodeId);
      commit(newState);
    },
    [state, commit],
  );

  const updateContent = useCallback(
    (nodeId: string, content: string) => {
      const newState = updateContentOp(state, nodeId, content);
      commit(newState);
    },
    [state, commit],
  );

  const zoomIn = useCallback(
    (nodeId: string) => {
      setFocusState({ focusedId: null, activeRootId: nodeId });
    },
    [],
  );

  const zoomOut = useCallback(
    (targetId: string | null) => {
      setFocusState({ focusedId: null, activeRootId: targetId });
    },
    [],
  );

  const addRootNode = useCallback(() => {
    const newNode = createNewNode(null);
    commit({
      ...state,
      nodeMap: { ...state.nodeMap, [newNode.id]: newNode },
      rootOrder: [...state.rootOrder, newNode.id],
    });
    setFocusState((fs) => ({ ...fs, focusedId: newNode.id }));
  }, [state, commit]);

  // ── Derived data ───────────────────────────────────────────────────

  const breadcrumb = useMemo(
    () => (focusState.activeRootId ? buildBreadcrumb(state.nodeMap, focusState.activeRootId) : []),
    [state.nodeMap, focusState.activeRootId],
  );

  const visibleNodeIds = useMemo(
    () => getVisibleNodeIds(state, focusState.activeRootId),
    [state, focusState.activeRootId],
  );

  // ── Focus helpers ──────────────────────────────────────────────────

  const focusNode = useCallback((nodeId: string) => {
    setFocusState((fs) => ({ ...fs, focusedId: nodeId }));
  }, []);

  const focusPrev = useCallback(
    (currentId: string) => {
      const prev = getAdjacentVisibleId(state, focusState.activeRootId, currentId, 'prev');
      if (prev) setFocusState((fs) => ({ ...fs, focusedId: prev }));
    },
    [state, focusState.activeRootId],
  );

  const focusNext = useCallback(
    (currentId: string) => {
      const next = getAdjacentVisibleId(state, focusState.activeRootId, currentId, 'next');
      if (next) setFocusState((fs) => ({ ...fs, focusedId: next }));
    },
    [state, focusState.activeRootId],
  );

  const focusParent = useCallback(
    (nodeId: string) => {
      const node = state.nodeMap[nodeId];
      if (node?.parentId && !focusState.activeRootId) {
        setFocusState((fs) => ({ ...fs, focusedId: node.parentId }));
      }
    },
    [state.nodeMap, focusState.activeRootId],
  );

  const focusFirstChild = useCallback(
    (nodeId: string) => {
      const node = state.nodeMap[nodeId];
      if (node && node.childrenIds.length > 0 && !node.isCollapsed) {
        setFocusState((fs) => ({ ...fs, focusedId: node.childrenIds[0] }));
      }
    },
    [state.nodeMap],
  );

  // ── Count ──────────────────────────────────────────────────────────

  const nodeCount = Object.keys(state.nodeMap).length;

  return {
    // State
    state,
    nodeMap: state.nodeMap,
    rootOrder: state.rootOrder,
    focusState,
    // Derived
    breadcrumb,
    visibleNodeIds,
    nodeCount,
    // Operations
    addSibling,
    addChild,
    indentNode,
    outdentNode,
    deleteNode,
    toggleDone,
    toggleCollapse,
    updateContent,
    zoomIn,
    zoomOut,
    addRootNode,
    // Focus
    focusNode,
    focusPrev,
    focusNext,
    focusParent,
    focusFirstChild,
    setFocusState,
  };
}
