'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import AnimatedBackground from './components/AnimatedBackground';

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      <AnimatedBackground />

      <div className="relative z-10 text-center">
        {/* Floating Astronaut */}
        <motion.div
          className="mb-10"
          animate={{
            y: [0, -15, 0],
            rotate: [0, 3, -3, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="relative inline-block"
          >
            {/* Stars ring */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 bg-cyan rounded-full"
                style={{
                  top: `${20 + i * 25}%`,
                  left: `${10 + i * 30}%`,
                }}
                animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.2, 0.8] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.6,
                }}
              />
            ))}

            {/* Astronaut SVG */}
            <svg
              viewBox="0 0 200 200"
              className="w-48 h-48 sm:w-56 sm:h-56"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Helmet */}
              <ellipse cx="100" cy="80" rx="42" ry="48" fill="#0E011A" stroke="#B44CF0" strokeWidth="3" />
              <ellipse cx="100" cy="80" rx="30" ry="36" fill="#1a0a2e" />
              {/* Visor */}
              <ellipse cx="100" cy="75" rx="22" ry="26" fill="#00F5FF" opacity="0.3" />
              <ellipse cx="100" cy="75" rx="18" ry="22" fill="#00F5FF" opacity="0.15" />
              {/* Visor reflection */}
              <ellipse cx="92" cy="68" rx="7" ry="5" fill="white" opacity="0.2" transform="rotate(-20 92 68)" />

              {/* Body / Suit */}
              <rect x="75" y="125" width="50" height="55" rx="10" fill="#0E011A" stroke="#B44CF0" strokeWidth="2.5" />
              {/* Chest detail */}
              <rect x="85" y="135" width="30" height="20" rx="4" fill="#B44CF0" opacity="0.2" />

              {/* Backpack */}
              <rect x="58" y="130" width="18" height="40" rx="6" fill="#1a0a2e" stroke="#B44CF0" strokeWidth="2" />

              {/* Left arm */}
              <motion.g
                animate={{ rotate: [-5, 8, -5] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                style={{ transformOrigin: '75px 135px' }}
              >
                <rect x="52" y="132" width="24" height="14" rx="7" fill="#0E011A" stroke="#B44CF0" strokeWidth="2" />
                <rect x="46" y="143" width="20" height="10" rx="5" fill="#B44CF0" opacity="0.3" />
              </motion.g>

              {/* Right arm */}
              <motion.g
                animate={{ rotate: [5, -8, 5] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                style={{ transformOrigin: '125px 135px' }}
              >
                <rect x="124" y="132" width="24" height="14" rx="7" fill="#0E011A" stroke="#B44CF0" strokeWidth="2" />
                <rect x="134" y="143" width="20" height="10" rx="5" fill="#B44CF0" opacity="0.3" />
              </motion.g>

              {/* Legs */}
              <rect x="80" y="178" width="16" height="22" rx="6" fill="#0E011A" stroke="#B44CF0" strokeWidth="2" />
              <rect x="104" y="178" width="16" height="22" rx="6" fill="#0E011A" stroke="#B44CF0" strokeWidth="2" />

              {/* Antenna */}
              <line x1="100" y1="32" x2="100" y2="18" stroke="#B44CF0" strokeWidth="2" />
              <motion.circle
                cx="100" cy="16" r="3"
                fill="#00F5FF"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </svg>
          </motion.div>
        </motion.div>

        {/* 404 Code */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-8xl sm:text-9xl font-heading font-extrabold text-white/5 select-none mb-2"
        >
          404
        </motion.p>

        {/* Message */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="gradient-text text-3xl sm:text-4xl font-heading font-bold mb-3"
        >
          You&apos;ve drifted too far.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="text-white/50 font-body text-sm mb-8"
        >
          The page you&apos;re looking for is lost in deep space.
        </motion.p>

        {/* Return button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet to-magenta rounded-lg text-white font-heading font-bold text-sm hover:scale-105 transition-transform duration-200 shadow-[0_0_25px_rgba(180,76,240,0.3)]"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Return to Base
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
