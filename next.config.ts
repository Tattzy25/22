import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  // Domain configuration for musarty.com
  env: {
    NEXT_PUBLIC_DOMAIN: 'musarty.com',
    NEXT_PUBLIC_BASE_URL: process.env.NODE_ENV === 'production'
      ? 'https://musarty.com'
      : 'http://localhost:3000'
  },

  // Image optimization for custom domain
  images: {
    domains: ['musarty.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'musarty.com',
        port: '',
        pathname: '/**',
      },
    ],
  },

  // Headers for security and performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
