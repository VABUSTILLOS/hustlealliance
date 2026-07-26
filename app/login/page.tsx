'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import AnimatedBackground from '../components/AnimatedBackground';
import GlassCard from '../components/GlassCard';
import { useTranslation } from '@/lib/i18n/useTranslation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { t } = useTranslation();

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
              {t.login.welcome}
            </h1>
            <p className="text-foreground-muted font-body text-sm">
              {t.login.subtitle}
            </p>
          </div>

          {/* Form */}
          <form className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground-muted mb-1.5"
              >
                {t.login.email}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.login.emailPlaceholder}
                className="w-full px-4 py-3 bg-deeper border border-violet/20 rounded-lg text-foreground placeholder:text-foreground-dim font-body text-sm outline-none transition-all duration-300 focus:border-violet focus:shadow-[0_0_15px_rgba(180,76,240,0.3)]"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-foreground-muted mb-1.5"
              >
                {t.login.password}
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.login.passwordPlaceholder}
                className="w-full px-4 py-3 bg-deeper border border-violet/20 rounded-lg text-foreground placeholder:text-foreground-dim font-body text-sm outline-none transition-all duration-300 focus:border-violet focus:shadow-[0_0_15px_rgba(180,76,240,0.3)]"
              />
            </div>

            {/* Forgot password */}
            <div className="text-right">
              <a
                href="#"
                className="text-xs text-violet/70 hover:text-violet transition-colors"
              >
                {t.login.forgotPassword}
              </a>
            </div>

            {/* Sign In button */}
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-violet to-magenta rounded-lg text-white font-heading font-bold text-sm hover:scale-[1.02] transition-transform duration-200 shadow-[0_0_25px_rgba(180,76,240,0.3)]"
            >
              {t.login.signIn}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-foreground-dim" />
            <span className="text-xs text-foreground-dim font-body">{t.login.or}</span>
            <div className="flex-1 h-px bg-foreground-dim" />
          </div>

          {/* Google Sign In */}
          <button className="w-full py-3 flex items-center justify-center gap-3 bg-foreground-dim/5 border border-foreground-dim/10 rounded-lg text-foreground font-body text-sm hover:bg-foreground-dim/10 transition-colors duration-200">
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
            {t.login.signInGoogle}
          </button>

          {/* Sign Up link */}
          <p className="text-center text-foreground-dim font-body text-sm mt-8">
            {t.login.noAccount}{' '}
            <Link
              href="/signup"
              className="text-violet hover:text-cyan transition-colors font-medium"
            >
              {t.login.signUp}
            </Link>
          </p>
        </GlassCard>
      </motion.div>
    </div>
  );
}
