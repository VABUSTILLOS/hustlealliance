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
        // New Foundr-inspired palette
        black: '#000000',
        surface: '#0A0A0A',
        'surface-light': '#1C1C1E',
        muted: '#8A8A8A',
        accent: '#FF3B30',
        'accent-glow': '#FF6B35',

        // Legacy mappings for backward compatibility
        deep: '#000000',
        deeper: '#0A0A0A',
        violet: '#FF3B30',
        magenta: '#FF6B35',
        cyan: '#FF3B30',
      },
      animation: {
        float: 'float 6s infinite ease-in-out',
        'pulse-glow': 'pulse-glow 2s infinite',
        'gradient-shift': 'gradient-shift 8s linear infinite',
        'cta-pulse': 'cta-pulse 2s infinite',
        'number-tick': 'number-tick 0.6s ease-out',
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
