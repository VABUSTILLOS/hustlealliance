'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NeonButton from './NeonButton';

const links = [
  { href: '#mission', label: 'Mission' },
  { href: '#members', label: 'Members' },
  { href: '#resources', label: 'Resources' },
  { href: '#login', label: 'Login' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-deep/80 border-b border-violet/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#" className="gradient-text text-xl sm:text-2xl font-heading font-bold tracking-tight">
            Hustle Alliance
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map(({ href, label }) => (
              <a
                key={label}
                href={href}
                className="text-sm font-medium text-white/70 hover:text-violet transition-colors duration-200"
              >
                {label}
              </a>
            ))}
            <NeonButton variant="primary" className="text-sm !py-2 !px-4">
              Join Alliance
            </NeonButton>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden flex flex-col gap-1.5 p-2"
            aria-label="Toggle menu"
          >
            <motion.span
              animate={open ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
              className="block w-6 h-0.5 bg-violet rounded"
            />
            <motion.span
              animate={open ? { opacity: 0 } : { opacity: 1 }}
              className="block w-6 h-0.5 bg-violet rounded"
            />
            <motion.span
              animate={open ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
              className="block w-6 h-0.5 bg-violet rounded"
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden bg-deeper/95 border-t border-violet/20"
          >
            <div className="px-4 py-4 space-y-3">
              {links.map(({ href, label }) => (
                <a
                  key={label}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="block text-sm font-medium text-white/70 hover:text-violet transition-colors duration-200 py-2"
                >
                  {label}
                </a>
              ))}
              <NeonButton variant="primary" className="w-full !py-2 !px-4">
                Join Alliance
              </NeonButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
