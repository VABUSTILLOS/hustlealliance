// Resource content registry — maps resource IDs to real content
// If a resource doesn't have content here, it falls back to the generic HTML generator

import type { ResourceContentType } from './types';
import { resourceContentEN } from './content-en';

/** Get real content for a resource by ID, or null if not yet created */
export function getResourceContent(id: string): ResourceContentType | null {
  const content = resourceContentEN[id];
  return content ?? null;
}

/** Check if a resource has real content (not just the HTML shell) */
export function hasRealContent(id: string): boolean {
  return id in resourceContentEN;
}

/** Get a list of all resource IDs that have real content */
export function getRealContentIds(): string[] {
  return Object.keys(resourceContentEN);
}
