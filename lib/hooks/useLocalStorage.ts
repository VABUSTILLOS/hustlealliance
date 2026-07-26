'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * Generic, SSR-safe localStorage hook.
 * Reads from localStorage on mount, writes on every change,
 * and stays in sync if the same key is modified elsewhere (storage events).
 *
 * Used by the Habit Tracker to persist daily checkboxes across reloads.
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  // ── Lazy initializer: read once from localStorage (SSR-safe) ──────────
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  // ── Persist to localStorage on every change ────────────────────────────
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch { /* quota exceeded or private browsing — silently ignore */ }
  }, [key, storedValue]);

  // ── Listen for cross-tab changes ───────────────────────────────────────
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue) as T);
        } catch { /* ignore */ }
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, [key]);

  // ── Setter that accepts a value or updater function ────────────────────
  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    setStoredValue((prev) => {
      const next = value instanceof Function ? value(prev) : value;
      return next;
    });
  }, []);

  return [storedValue, setValue];
}
