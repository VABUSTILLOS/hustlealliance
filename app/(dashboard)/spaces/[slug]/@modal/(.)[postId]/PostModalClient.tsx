"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useCallback } from "react";
import type { ReactNode } from "react";

export function PostModal({
  children,
  title,
}: {
  children: ReactNode;
  title?: string;
}) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDivElement>(null);

  const dismiss = useCallback(() => {
    router.back();
  }, [router]);

  // Close on Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") dismiss();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [dismiss]);

  // Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay with fade-in */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={dismiss}
      />

      {/* Slide-in panel */}
      <div
        ref={dialogRef}
        className="absolute right-0 top-0 h-full w-full max-w-xl bg-surface border-l border-surface-light
                   shadow-2xl overflow-y-auto animate-slide-in"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-surface/95 backdrop-blur-sm border-b border-surface-light px-6 py-4 flex items-center gap-3">
          <button
            onClick={dismiss}
            className="flex items-center justify-center w-8 h-8 rounded-lg
                       bg-white/5 hover:bg-white/10 transition-colors shrink-0"
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              className="w-4 h-4 text-muted"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
          <h2 className="font-heading font-bold text-foreground text-sm truncate">
            {title ?? "Post"}
          </h2>
        </div>

        {/* Content */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
