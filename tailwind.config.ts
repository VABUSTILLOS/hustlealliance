import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // CSS-variable-driven palette for dark/light mode
        black: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        'surface-light': 'var(--color-surface-light)',
        muted: 'var(--color-muted)',
        white: 'var(--color-foreground)',
        accent: 'var(--color-accent)',
        'accent-glow': 'var(--color-accent-glow)',
        'foreground-dim': 'var(--color-foreground-dim)',
        'foreground-muted': 'var(--color-foreground-muted)',
        'mockup-bg': 'var(--color-mockup-bg)',

        // Legacy mappings for backward compatibility
        deep: 'var(--color-bg)',
        deeper: 'var(--color-surface)',
        violet: 'var(--color-accent)',
        magenta: 'var(--color-accent-glow)',
        cyan: 'var(--color-accent)',
      },
      animation: {
        float: 'float 6s infinite ease-in-out',
        'pulse-glow': 'pulse-glow 2s infinite',
        'gradient-shift': 'gradient-shift 8s linear infinite',
        'cta-pulse': 'cta-pulse 2s infinite',
        'number-tick': 'number-tick 0.6s ease-out',
        'slide-in': 'slideIn 0.3s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255,59,48,0.3)' },
          '50%': { boxShadow: '0 0 60px rgba(255,59,48,0.6)' },
        },
        'gradient-shift': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'cta-pulse': {
          '0%, 100%': { boxShadow: '0 0 40px rgba(255,59,48,0.3)' },
          '50%': { boxShadow: '0 0 80px rgba(255,59,48,0.6)' },
        },
        'number-tick': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      fontFamily: {
        body: ['Inter', 'sans-serif'],
        heading: ['Clash Display', 'var(--font-clash)', 'sans-serif'],
        display: ['Bebas Neue', 'var(--font-bebas)', 'sans-serif'],
        mono: ['JetBrains Mono', 'Space Mono', 'monospace'],
      },
      fontSize: {
        'display-xl': ['clamp(3rem, 8vw, 7rem)', { lineHeight: '0.9', fontWeight: '700' }],
        'display-lg': ['clamp(2.5rem, 5vw, 4rem)', { lineHeight: '1', fontWeight: '700' }],
      },
    },
  },
  plugins: [],
};

export default config;
