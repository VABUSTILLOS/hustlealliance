'use client';

import { useEffect, useState, useCallback } from 'react';

export default function CursorGlow() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  const onMove = useCallback((e: MouseEvent) => {
    setPos({ x: e.clientX, y: e.clientY });
    setVisible(true);
  }, []);

  const onLeave = useCallback(() => setVisible(false), []);

  const onEnter = useCallback((e: MouseEvent) => {
    setPos({ x: e.clientX, y: e.clientY });
    setVisible(true);
  }, []);

  useEffect(() => {
    // Detect touch device
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsTouch(hasTouch);
    if (hasTouch) return;

    window.addEventListener('mousemove', onMove, { passive: true });
    document.body.addEventListener('mouseleave', onLeave);
    document.body.addEventListener('mouseenter', onEnter);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.body.removeEventListener('mouseleave', onLeave);
      document.body.removeEventListener('mouseenter', onEnter);
    };
  }, [onMove, onLeave, onEnter]);

  // Don't render on touch devices
  if (isTouch) return null;

  return (
    <div
      className="fixed pointer-events-none z-[9999]"
      style={{
        left: pos.x,
        top: pos.y,
        transform: 'translate(-50%, -50%)',
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
