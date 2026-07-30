import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image optimization — allow remote avatars from DiceBear
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'api.dicebear.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
    // Enable AVIF/WebP for smaller images
    formats: ['image/avif', 'image/webp'],
    // Mobile-first device sizes for srcSet generation
    deviceSizes: [375, 414, 640, 768, 1024, 1280, 1536, 1920],
    // Smaller image sizes for thumbnails/avatars
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Minimum cache TTL for optimized images on Vercel (30 days)
    minimumCacheTTL: 2592000,
  },

  // Cache-control & security headers
  async headers() {
    return [
      // Security headers — force HTTPS everywhere, prevent downgrade attacks
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      // Static assets — long-lived immutable cache
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Next.js image optimization responses — 30-day CDN cache
      {
        source: '/_next/image/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=2592000, stale-while-revalidate=86400',
          },
        ],
      },
      // API: community endpoints — rapid revalidation for real-time feel
      {
        source: '/api/community/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=10, stale-while-revalidate=30',
          },
        ],
      },
      // Pages — short-lived CDN cache with background revalidation
      {
        source: '/:path((?!api|_next).*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=60, stale-while-revalidate=300, must-revalidate',
          },
        ],
      },
    ];
  },

  // Compress responses to reduce TTFB
  compress: true,

  // Production optimizations
  poweredByHeader: false,
  reactStrictMode: true,

  // Prevent Turbopack from bundling Node.js native modules
  serverExternalPackages: ['pg'],

  // Turbopack root directory
  turbopack: {
    root: process.cwd(),
  },

  // Reduce layout shift with automatic font optimization
  experimental: {
    optimizePackageImports: [
      'framer-motion',
      'lucide-react',
      'zustand',
    ],
  },
};

export default nextConfig;
