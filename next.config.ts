import type { NextConfig } from "next";
import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  // ── Standalone output with file tracing ──────────────────────────────────
  // Strips unused files from the deployment, reducing cold-start size & time.
  output: 'standalone',
  outputFileTracingRoot: process.cwd(),

  // ── Image optimization ───────────────────────────────────────────────────
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'api.dicebear.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [375, 414, 640, 768, 1024, 1280, 1536, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 2592000,
  },

  // ── Headers ──────────────────────────────────────────────────────────────
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
      {
        source: '/api/community/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, s-maxage=10, stale-while-revalidate=30' }],
      },
      {
        source: '/:path((?!api|_next).*)',
        headers: [{ key: 'Cache-Control', value: 'public, s-maxage=60, stale-while-revalidate=300, must-revalidate' }],
      },
    ];
  },

  // ── Compression & misc ───────────────────────────────────────────────────
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,

  // ── External packages (keep these out of the server bundle) ──────────────
  // pg is a native Node.js module — must be external.
  // stripe & resend are ~3MB each and only used in a few API routes.
  serverExternalPackages: ['pg', 'stripe', 'resend', '@vercel/edge-config'],

  // ── Turbopack ────────────────────────────────────────────────────────────
  turbopack: {
    root: process.cwd(),
  },

  // ── Experimental ─────────────────────────────────────────────────────────
  experimental: {
    // Tree-shake barrel imports from these packages — cuts JS shipped to client
    optimizePackageImports: [
      'framer-motion',
      'lucide-react',
      'zustand',
      '@tanstack/react-query',
      '@supabase/supabase-js',
      '@supabase/ssr',
    ],
  },
};

export default withBundleAnalyzer(nextConfig);
