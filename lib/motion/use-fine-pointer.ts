import { useSyncExternalStore } from 'react';

const QUERY = '(hover: hover) and (pointer: fine)';

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches;
}

function getServerSnapshot() {
  return false;
}

/**
 * True only on devices with a precise pointer (mouse/trackpad).
 * Use to gate cursor-tracking effects (spotlight, magnetic hover)
 * so they never run on touch devices.
 */
export function useFinePointer(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
