"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useCallback, useState, createContext, useContext } from "react";
import { motion } from "framer-motion";
import type { ReactNode, RefObject } from "react";

// ── Scroll Container Context ──────────────────────────────────────────────────
// PostDetailClient reads this to know it's inside a modal and skip its own
// window-based ReadingProgressBar.

const ScrollContainerContext =
  createContext<RefObject<HTMLDivElement | null> | null>(null);

export function useScrollContainer() {
  return useContext(ScrollContainerContext);
}

// ── Modal-native reading progress bar ─────────────────────────────────────────
// Tracks the panel's internal scroll, positioned absolutely at the panel top.

function ModalProgressBar({
  scrollRef,
}: {
  scrollRef: RefObject<HTMLDivElement | null>;
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      const scrollable = el.scrollHeight - el.clientHeight;
      const pct = scrollable > 0 ? Math.min((el.scrollTop / scrollable) * 100, 100) : 0;
      setProgress(pct);
    };

    el.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => el.removeEventListener("scroll", handleScroll);
  }, [scrollRef]);

  return (
    <div className="absolute top-0 left-0 right-0 z-30 h-1 bg-surface-light">
      <motion.div
        className="h-full bg-accent"
        style={{ width: `${progress}%` }}
        animate={{ opacity: progress > 99 ? 0 : 1 }}
        transition={{ duration: 0.1 }}
      />
    </div>
  );
}

// ── PostModal ─────────────────────────────────────────────────────────────────

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
  const [mounted, setMounted] = useState(false);

  // ── Mount guard — prevents SSR/client DOM mismatch flash ──────────────────
  useEffect(() => {
    setMounted(true);
  }, []);

  const dismiss = useCallback(() => {
    router.back();
  }, [router]);

  // ── iOS-safe scroll lock ──────────────────────────────────────────────────
  useEffect(() => {
    if (!mounted) return;

    scrollY.current = window.scrollY;
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
  }, [mounted]);

  // ── Close on Escape ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!mounted) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") dismiss();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [dismiss, mounted]);

  // ── Hide entirely until client-mounted — eliminates SSR flash ─────────────
  if (!mounted) return null;

  return (
    <ScrollContainerContext.Provider value={scrollRef}>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop — no blur on mobile (WebKit repaint flash), md:blur only */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 bg-black/60 md:backdrop-blur-sm touch-none will-change-[opacity]"
          onClick={dismiss}
        />

        {/* Slide-in panel */}
        <motion.div
          ref={scrollRef}
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full md:max-w-[720px] h-full bg-surface
                     border-l border-surface-light shadow-2xl
                     overflow-y-auto overscroll-contain will-change-transform"
        >
          {/* Reading progress bar — anchored to panel top */}
          <ModalProgressBar scrollRef={scrollRef} />

          {/* Sticky header */}
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

          {/* Content */}
          <div className="p-4 sm:p-6">{children}</div>
        </motion.div>
      </div>
    </ScrollContainerContext.Provider>
  );
}
