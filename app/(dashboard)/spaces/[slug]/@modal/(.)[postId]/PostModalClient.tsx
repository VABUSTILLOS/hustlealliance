"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useCallback, createContext, useContext } from "react";
import { motion } from "framer-motion";
import type { ReactNode, RefObject } from "react";

// ── Scroll Container Context ──────────────────────────────────────────────────
// ReadingProgressBar consumes this to track modal scroll instead of window

const ScrollContainerContext =
  createContext<RefObject<HTMLDivElement | null> | null>(null);

export function useScrollContainer() {
  return useContext(ScrollContainerContext);
}

export function PostModal({
  children,
  title,
}: {
  children: ReactNode;
  title?: string;
}) {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const scrollY = useRef(0);

  const dismiss = useCallback(() => {
    router.back();
  }, [router]);

  // ── iOS-safe scroll lock ──────────────────────────────────────────────────
  useEffect(() => {
    scrollY.current = window.scrollY;

    // Pin body in place so background doesn't scroll on iOS
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY.current}px`;
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      window.scrollTo(0, scrollY.current);
    };
  }, []);

  // ── Close on Escape ───────────────────────────────────────────────────────
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") dismiss();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [dismiss]);

  return (
    <ScrollContainerContext.Provider value={scrollRef}>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop overlay — fades in, blocks touch bleed on iOS */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm touch-none"
          onClick={dismiss}
        />

        {/* Slide-in panel — fullscreen mobile, 720px drawer on desktop */}
        <motion.div
          ref={scrollRef}
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 28, stiffness: 260 }}
          className="relative w-full md:w-[720px] h-full bg-surface
                     border-l border-surface-light shadow-2xl
                     overflow-y-auto overscroll-contain"
        >
          {/* Fixed header with back-arrow close button */}
          <div
            className="sticky top-0 z-20 bg-surface/95 backdrop-blur-sm
                        border-b border-surface-light px-5 py-3.5
                        flex items-center gap-3"
          >
            <button
              onClick={dismiss}
              className="flex items-center justify-center w-8 h-8 rounded-lg
                         bg-white/5 hover:bg-white/10 active:bg-white/15
                         transition-colors shrink-0"
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
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <h2 className="font-heading font-bold text-foreground text-sm truncate">
              {title ?? "Post"}
            </h2>
          </div>

          {/* Content area */}
          <div className="p-4 sm:p-6">{children}</div>
        </motion.div>
      </div>
    </ScrollContainerContext.Provider>
  );
}
