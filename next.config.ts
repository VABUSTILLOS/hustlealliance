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

  // Cache-control headers for static assets & pages
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|jpeg|png|gif|webp|avif|ico|woff|woff2|ttf|eot)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
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
