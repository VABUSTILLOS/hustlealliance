"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

/**
 * Captures the browser's `beforeinstallprompt` and shows a discreet
 * "Install app" pill so members can add Hustle Alliance to their home screen.
 * Falls back to a hint if the event is unavailable (iOS Safari).
 */
export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (dismissed || (!deferred && !isIos())) return null;

  const install = async () => {
    if (deferred) {
      await deferred.prompt();
      setDeferred(null);
    } else {
      // iOS Safari has no beforeinstallprompt — guide the user.
      setDismissed(true);
      alert("Tap the Share button, then 'Add to Home Screen'.");
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2">
      <div className="flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 shadow-2xl">
        <svg className="h-6 w-6 shrink-0" viewBox="0 0 512 512" aria-hidden="true">
          <path d="M292 96 L160 288 h88 l-28 128 132-192 h-88 z" fill="#FF3B30" />
        </svg>
        <div className="text-sm leading-tight">
          <p className="font-semibold">Install Hustle Alliance</p>
          <p className="text-xs text-[var(--color-muted)]">Get push alerts &amp; offline access</p>
        </div>
        <button
          onClick={install}
          className="ml-2 rounded-xl bg-[var(--color-accent)] px-3 py-2 text-xs font-semibold text-white"
        >
          Install
        </button>
        <button
          onClick={() => setDismissed(true)}
          aria-label="Dismiss install prompt"
          className="text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

function isIos(): boolean {
  if (typeof window === "undefined") return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}
