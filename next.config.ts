import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image optimization — allow remote avatars from DiceBear
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
      },
    ],
    // Enable AVIF/WebP for smaller images
    formats: ['image/avif', 'image/webp'],
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
      // Static assets — long-lived cache
      {
        source: '/:all*(svg|jpg|jpeg|png|gif|webp|avif|ico|woff|woff2|ttf|eot)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Pages — short-lived cache
      {
        source: '/:path((?!api).*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
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
