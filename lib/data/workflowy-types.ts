// ── Workflowy Flat-Map Types ────────────────────────────────────────────
// Normalized state: all nodes in a flat Record, order tracked by arrays.

export interface PlannerNode {
  id: string;
  parentId: string | null;
  content: string;
  isCollapsed: boolean;
  isDone: boolean;
  childrenIds: string[];
}

export type NodeMap = Record<string, PlannerNode>;

export interface PlannerState {
  nodeMap: NodeMap;
  rootOrder: string[]; // top-level node IDs in display order
}

export interface FocusState {
  focusedId: string | null;
  activeRootId: string | null; // null = show full tree; string = zoomed into that node
}

// ── ID generator ────────────────────────────────────────────────────────

let _counter = 0;
export function genId(): string {
  _counter++;
  return `${Date.now().toString(36)}-${_counter}-${Math.random().toString(36).slice(2, 7)}`;
}

// ── Pure mutation helpers ───────────────────────────────────────────────

/** Create a new blank node */
export function createNode(parentId: string | null = null): PlannerNode {
  return {
    id: genId(),
    parentId,
    content: '',
    isCollapsed: false,
    isDone: false,
    childrenIds: [],
  };
}

/** Insert `childId` into a parent's childrenIds at a specific index */
function insertChild(
  nodeMap: NodeMap,
  parentId: string | null,
  childId: string,
  afterIndex: number,
  rootOrder: string[],
): { nodeMap: NodeMap; rootOrder: string[] } {
  if (parentId === null) {
    // Top-level
    const newOrder = [...rootOrder];
    newOrder.splice(afterIndex + 1, 0, childId);
    return { nodeMap, rootOrder: newOrder };
  }
  const parent = nodeMap[parentId];
  if (!parent) return { nodeMap, rootOrder };
  const newChildren = [...parent.childrenIds];
  newChildren.splice(afterIndex + 1, 0, childId);
  return {
    nodeMap: { ...nodeMap, [parentId]: { ...parent, childrenIds: newChildren } },
    rootOrder,
  };
}

/** Remove `childId` from its parent's childrenIds (or rootOrder) */
function removeChild(
  nodeMap: NodeMap,
  parentId: string | null,
  childId: string,
  rootOrder: string[],
): { nodeMap: NodeMap; rootOrder: string[] } {
  if (parentId === null) {
    return { nodeMap, rootOrder: rootOrder.filter((id) => id !== childId) };
  }
  const parent = nodeMap[parentId];
  if (!parent) return { nodeMap, rootOrder };
  return {
    nodeMap: { ...nodeMap, [parentId]: { ...parent, childrenIds: parent.childrenIds.filter((id) => id !== childId) } },
    rootOrder,
  };
}

/** Find the index of a child within its parent's childrenIds or rootOrder */
function findChildIndex(
  nodeMap: NodeMap,
  parentId: string | null,
  childId: string,
  rootOrder: string[],
): number {
  if (parentId === null) return rootOrder.indexOf(childId);
  const parent = nodeMap[parentId];
  if (!parent) return -1;
  return parent.childrenIds.indexOf(childId);
}

/** Get the previous sibling of a node (null if first child) */
function getPrevSiblingId(
  nodeMap: NodeMap,
  node: PlannerNode,
  rootOrder: string[],
): string | null {
  const siblings = node.parentId === null ? rootOrder : (nodeMap[node.parentId]?.childrenIds ?? []);
  const idx = siblings.indexOf(node.id);
  return idx > 0 ? siblings[idx - 1] : null;
}

// ── Core Operations ─────────────────────────────────────────────────────

/**
 * addChild: Create a new node as the last child of `parentId`.
 * Auto-expands parent so the child is visible.
 */
export function addChild(
  state: PlannerState,
  parentId: string,
): PlannerState & { newId: string } {
  const parent = state.nodeMap[parentId];
  if (!parent) return { ...state, newId: '' };

  const newNode = createNode(parentId);
  const updatedParent: PlannerNode = {
    ...parent,
    childrenIds: [...parent.childrenIds, newNode.id],
    isCollapsed: false,
  };

  return {
    nodeMap: { ...state.nodeMap, [parentId]: updatedParent, [newNode.id]: newNode },
    rootOrder: state.rootOrder,
    newId: newNode.id,
  };
}

/**
 * addSibling: Create a new node immediately after `nodeId` under the same parent.
 * Returns updated state and the new node's ID.
 */
export function addSibling(
  state: PlannerState,
  nodeId: string,
): PlannerState & { newId: string } {
  const node = state.nodeMap[nodeId];
  if (!node) return { ...state, newId: '' };

  const newNode = createNode(node.parentId);
  const childIdx = findChildIndex(state.nodeMap, node.parentId, nodeId, state.rootOrder);

  const { nodeMap, rootOrder } = insertChild(
    { ...state.nodeMap, [newNode.id]: newNode },
    node.parentId,
    newNode.id,
    childIdx,
    state.rootOrder,
  );

  return {
    nodeMap: { ...nodeMap, [newNode.id]: newNode },
    rootOrder,
    newId: newNode.id,
  };
}

/**
 * indentNode: Move `nodeId` to become the last child of its preceding sibling.
 * Fails silently if node is the first child (no preceding sibling).
 */
export function indentNode(
  state: PlannerState,
  nodeId: string,
): PlannerState {
  const node = state.nodeMap[nodeId];
  if (!node) return state;

  const prevSiblingId = getPrevSiblingId(state.nodeMap, node, state.rootOrder);
  if (prevSiblingId === null) return state; // can't indent first child

  // 1. Remove from current parent
  let { nodeMap, rootOrder } = removeChild(state.nodeMap, node.parentId, nodeId, state.rootOrder);

  // 2. Add as last child of prevSibling
  const newParent = nodeMap[prevSiblingId];
  const updatedNode: PlannerNode = { ...node, parentId: prevSiblingId };
  const updatedParent: PlannerNode = {
    ...newParent,
    childrenIds: [...newParent.childrenIds, nodeId],
    isCollapsed: false, // auto-expand so user sees the indented node
  };

  nodeMap = {
    ...nodeMap,
    [nodeId]: updatedNode,
    [prevSiblingId]: updatedParent,
  };

  return { nodeMap, rootOrder };
}

/**
 * outdentNode: Move `nodeId` up one level — becomes a sibling of its current parent.
 * Inserts right after the parent. Fails silently if node is already top-level.
 */
export function outdentNode(
  state: PlannerState,
  nodeId: string,
): PlannerState {
  const node = state.nodeMap[nodeId];
  if (!node || node.parentId === null) return state; // already at root

  const parent = state.nodeMap[node.parentId];
  if (!parent) return state;

  const grandParentId = parent.parentId;

  // Find parent's index within its own parent
  const parentIdx = findChildIndex(state.nodeMap, grandParentId, node.parentId, state.rootOrder);

  // 1. Remove from current parent
  let { nodeMap, rootOrder } = removeChild(state.nodeMap, node.parentId, nodeId, state.rootOrder);

  // 2. Insert right after parent in grandparent's children
  const updatedNode: PlannerNode = { ...node, parentId: grandParentId };
  nodeMap = { ...nodeMap, [nodeId]: updatedNode };

  const result = insertChild(nodeMap, grandParentId, nodeId, parentIdx, rootOrder);
  return { nodeMap: result.nodeMap, rootOrder: result.rootOrder };
}

/**
 * deleteNode: Remove node and all its descendants.
 * Focus should move to previous visible node (or parent if first child).
 */
export function deleteNode(
  state: PlannerState,
  nodeId: string,
): PlannerState & { fallbackFocusId: string | null } {
  const node = state.nodeMap[nodeId];
  if (!node) return { ...state, fallbackFocusId: null };

  // Collect all descendant IDs recursively
  const toDelete = new Set<string>();
  function collectDescendants(id: string) {
    toDelete.add(id);
    const n = state.nodeMap[id];
    if (n) n.childrenIds.forEach(collectDescendants);
  }
  collectDescendants(nodeId);

  // Find fallback focus: previous sibling > parent > null
  let fallbackFocusId: string | null = getPrevSiblingId(state.nodeMap, node, state.rootOrder);
  if (fallbackFocusId === null) {
    fallbackFocusId = node.parentId;
  }

  // Remove from parent
  let { nodeMap, rootOrder } = removeChild(state.nodeMap, node.parentId, nodeId, state.rootOrder);

  // Remove all descendants from nodeMap
  for (const id of toDelete) {
    delete nodeMap[id];
  }

  return { nodeMap: { ...nodeMap }, rootOrder, fallbackFocusId };
}

/**
 * Check if all descendants of a node are done (recursive).
 */
export function allDescendantsDone(nodeMap: NodeMap, nodeId: string): boolean {
  const node = nodeMap[nodeId];
  if (!node) return true;
  for (const childId of node.childrenIds) {
    const child = nodeMap[childId];
    if (!child) continue;
    if (!child.isDone) return false;
    if (!allDescendantsDone(nodeMap, childId)) return false;
  }
  return true;
}

/**
 * Can a node be checked? True if it has no children OR all descendants are done.
 */
export function canCheckNode(nodeMap: NodeMap, nodeId: string): boolean {
  const node = nodeMap[nodeId];
  if (!node) return false;
  if (node.childrenIds.length === 0) return true;
  return allDescendantsDone(nodeMap, nodeId);
}

/**
 * toggleDone: Flip isDone on a node.
 * Prevents checking a parent while any child is still unchecked.
 */
export function toggleDone(state: PlannerState, nodeId: string): PlannerState {
  const node = state.nodeMap[nodeId];
  if (!node) return state;
  // Prevent checking if children aren't all done
  if (!node.isDone && !canCheckNode(state.nodeMap, nodeId)) return state;
  return {
    ...state,
    nodeMap: { ...state.nodeMap, [nodeId]: { ...node, isDone: !node.isDone } },
  };
}

/**
 * toggleCollapse: Flip isCollapsed on a node.
 */
export function toggleCollapse(state: PlannerState, nodeId: string): PlannerState {
  const node = state.nodeMap[nodeId];
  if (!node) return state;
  return {
    ...state,
    nodeMap: { ...state.nodeMap, [nodeId]: { ...node, isCollapsed: !node.isCollapsed } },
  };
}

/**
 * updateContent: Set the content (text) of a node.
 */
export function updateContent(state: PlannerState, nodeId: string, content: string): PlannerState {
  const node = state.nodeMap[nodeId];
  if (!node) return state;
  return {
    ...state,
    nodeMap: { ...state.nodeMap, [nodeId]: { ...node, content } },
  };
}

// ── Breadcrumb helper ───────────────────────────────────────────────────

export interface BreadcrumbItem {
  id: string;
  content: string;
}

/** Build breadcrumb trail from root to activeRootId */
export function buildBreadcrumb(nodeMap: NodeMap, activeRootId: string): BreadcrumbItem[] {
  const crumbs: BreadcrumbItem[] = [];
  let currentId: string | null = activeRootId;
  while (currentId) {
    const node: PlannerNode | undefined = nodeMap[currentId];
    if (!node) break;
    crumbs.unshift({ id: node.id, content: node.content || '(sin título)' });
    currentId = node.parentId;
  }
  return crumbs;
}

// ── Template generators ─────────────────────────────────────────────────

export function createTemplateTree(locale: 'en' | 'es'): PlannerState {
  const isEs = locale === 'es';

  const morning = createNode(null);
  morning.content = isEs ? '☀️ Rutina de mañana' : '☀️ Morning routine';
  const m1 = createNode(morning.id);
  const m2 = createNode(morning.id);
  morning.childrenIds = [m1.id, m2.id];

  const priorities = createNode(null);
  priorities.content = isEs ? '🎯 Prioridades de hoy' : "🎯 Today's priorities";
  const p1 = createNode(priorities.id);
  const p2 = createNode(priorities.id);
  const p3 = createNode(priorities.id);
  priorities.childrenIds = [p1.id, p2.id, p3.id];

  const gratitude = createNode(null);
  gratitude.content = isEs ? '🙏 Agradezco' : '🙏 Grateful for';
  const g1 = createNode(gratitude.id);
  const g2 = createNode(gratitude.id);
  gratitude.childrenIds = [g1.id, g2.id];

  const learnings = createNode(null);
  learnings.content = isEs ? '💡 Aprendizajes del día' : '💡 Daily learnings';
  const l1 = createNode(learnings.id);
  learnings.childrenIds = [l1.id];

  const allNodes = [morning, m1, m2, priorities, p1, p2, p3, gratitude, g1, g2, learnings, l1];
  const nodeMap: NodeMap = {};
  for (const n of allNodes) {
    nodeMap[n.id] = n;
  }

  return {
    nodeMap,
    rootOrder: [morning.id, priorities.id, gratitude.id, learnings.id],
  };
}

// ── Visible-node flattening for arrow-key navigation ────────────────────

/**
 * Returns a flat ordered list of all visible node IDs (respecting collapse & zoom).
 */
export function getVisibleNodeIds(
  state: PlannerState,
  activeRootId: string | null,
): string[] {
  const result: string[] = [];

  function walk(ids: string[]) {
    for (const id of ids) {
      const node = state.nodeMap[id];
      if (!node) continue;
      result.push(id);
      if (!node.isCollapsed && node.childrenIds.length > 0) {
        walk(node.childrenIds);
      }
    }
  }

  if (activeRootId) {
    const rootNode = state.nodeMap[activeRootId];
    if (rootNode) walk(rootNode.childrenIds);
  } else {
    walk(state.rootOrder);
  }

  return result;
}

/**
 * Find the next/previous visible node ID for arrow navigation.
 */
export function getAdjacentVisibleId(
  state: PlannerState,
  activeRootId: string | null,
  currentId: string,
  direction: 'prev' | 'next',
): string | null {
  const visible = getVisibleNodeIds(state, activeRootId);
  const idx = visible.indexOf(currentId);
  if (idx === -1) return null;
  if (direction === 'prev' && idx > 0) return visible[idx - 1];
  if (direction === 'next' && idx < visible.length - 1) return visible[idx + 1];
  return null;
}
