'use client';

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const Particle = ({ delay }: { delay: number }) => {
  const randomX = Math.random() * 100;
  const randomY = Math.random() * 100;
  const randomDuration = 15 + Math.random() * 10;
  const randomSize = 20 + Math.random() * 60;

  return (
    <motion.div
      className="absolute rounded-full bg-violet opacity-10"
      style={{
        width: randomSize,
        height: randomSize,
        left: `${randomX}%`,
        top: `${randomY}%`,
      }}
      animate={{
        x: [0, 100, -100, 0],
        y: [0, -100, 100, 0],
        scale: [1, 1.2, 0.8, 1],
      }}
      transition={{
        duration: randomDuration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
};

export default function AnimatedBackground() {
  const reduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const particles = Array.from({ length: isMobile ? 6 : 15 }, (_, i) => i);

  // Static gradient fallback for users who prefer reduced motion
  if (reduceMotion) {
    return (
      <div className="fixed inset-0 overflow-hidden bg-deep -z-10">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 20% 50%, rgba(180, 76, 240, 0.25) 0%, rgba(11, 0, 20, 0) 50%)',
          }}
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 overflow-hidden bg-deep -z-10">
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'radial-gradient(circle at 20% 50%, rgba(180, 76, 240, 0.3) 0%, rgba(11, 0, 20, 0) 50%)',
            'radial-gradient(circle at 80% 80%, rgba(180, 76, 240, 0.3) 0%, rgba(11, 0, 20, 0) 50%)',
            'radial-gradient(circle at 40% 20%, rgba(180, 76, 240, 0.3) 0%, rgba(11, 0, 20, 0) 50%)',
            'radial-gradient(circle at 20% 50%, rgba(180, 76, 240, 0.3) 0%, rgba(11, 0, 20, 0) 50%)',
          ],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Secondary gradient layer */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'radial-gradient(circle at 80% 20%, rgba(0, 245, 255, 0.15) 0%, rgba(14, 1, 26, 0) 50%)',
            'radial-gradient(circle at 20% 80%, rgba(0, 245, 255, 0.15) 0%, rgba(14, 1, 26, 0) 50%)',
            'radial-gradient(circle at 60% 60%, rgba(0, 245, 255, 0.15) 0%, rgba(14, 1, 26, 0) 50%)',
            'radial-gradient(circle at 80% 20%, rgba(0, 245, 255, 0.15) 0%, rgba(14, 1, 26, 0) 50%)',
          ],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.5,
        }}
      />

      {/* Floating particles */}
      {particles.map((i) => (
        <Particle key={i} delay={i * 0.2} />
      ))}
    </div>
  );
}
