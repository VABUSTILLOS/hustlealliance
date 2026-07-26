'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import AnimatedBackground from '../components/AnimatedBackground';
import GlassCard from '../components/GlassCard';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4">
      <AnimatedBackground />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md"
      >
        <GlassCard className="p-8 sm:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="gradient-text text-2xl sm:text-3xl font-heading font-bold mb-2">
              Welcome Back
            </h1>
            <p className="text-white/50 font-body text-sm">
              Sign in to your Hustle Alliance account
            </p>
          </div>

          {/* Form */}
          <form className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-white/70 mb-1.5"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-deeper border border-violet/20 rounded-lg text-white placeholder:text-white/30 font-body text-sm outline-none transition-all duration-300 focus:border-violet focus:shadow-[0_0_15px_rgba(180,76,240,0.3)]"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-white/70 mb-1.5"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-deeper border border-violet/20 rounded-lg text-white placeholder:text-white/30 font-body text-sm outline-none transition-all duration-300 focus:border-violet focus:shadow-[0_0_15px_rgba(180,76,240,0.3)]"
              />
            </div>

            {/* Forgot password */}
            <div className="text-right">
              <a
                href="#"
                className="text-xs text-violet/70 hover:text-violet transition-colors"
              >
                Forgot password?
              </a>
            </div>

            {/* Sign In button */}
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-violet to-magenta rounded-lg text-white font-heading font-bold text-sm hover:scale-[1.02] transition-transform duration-200 shadow-[0_0_25px_rgba(180,76,240,0.3)]"
            >
              Sign In
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-white/30 font-body">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Google Sign In */}
          <button className="w-full py-3 flex items-center justify-center gap-3 bg-white/5 border border-white/10 rounded-lg text-white font-body text-sm hover:bg-white/10 transition-colors duration-200">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in with Google
          </button>

          {/* Sign Up link */}
          <p className="text-center text-white/40 font-body text-sm mt-8">
            Don&apos;t have an account?{' '}
            <Link
              href="/signup"
              className="text-violet hover:text-cyan transition-colors font-medium"
            >
              Sign Up
            </Link>
          </p>
        </GlassCard>
      </motion.div>
    </div>
  );
}
