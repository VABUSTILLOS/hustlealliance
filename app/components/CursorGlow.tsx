'use client';

import { useEffect, useRef, useState } from 'react';

export default function CursorGlow() {
  const [visible, setVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const glowRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const visibleRef = useRef(false);

  useEffect(() => {
    // Detect touch device
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsTouch(hasTouch);
    if (hasTouch) return;

    // Move the glow imperatively (no React re-render per mousemove event).
    const applyPos = (x: number, y: number) => {
      const el = glowRef.current;
      if (!el) return;
      el.style.opacity = '1';
      el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
    };

    const onMove = (e: MouseEvent) => {
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        applyPos(e.clientX, e.clientY);
      });
    };

    const onLeave = () => {
      if (!visibleRef.current) return;
      visibleRef.current = false;
      setVisible(false);
    };

    const onEnter = (e: MouseEvent) => {
      visibleRef.current = true;
      setVisible(true);
      applyPos(e.clientX, e.clientY);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.body.addEventListener('mouseleave', onLeave);
    document.body.addEventListener('mouseenter', onEnter);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.body.removeEventListener('mouseleave', onLeave);
      document.body.removeEventListener('mouseenter', onEnter);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Don't render on touch devices
  if (isTouch) return null;

  return (
    <div
      ref={glowRef}
      className="fixed pointer-events-none z-[9999]"
      style={{
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.15s ease',
      }}
    >
      <div
        className="w-80 h-80 rounded-full"
        style={{
          background: 'radial-gradient(circle at center, rgba(255,59,48,0.06) 0%, rgba(139,92,246,0.03) 40%, transparent 70%)',
          filter: 'blur(20px)',
        }}
      />
    </div>
  );
}
