import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        // Sanity CDN — all project images
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/images/**',
      },
    ],
  },

  // Recommended for @opennextjs/cloudflare compatibility
  // Remove if deploying to Vercel instead
  // output: 'standalone',

  /**
   * React Flow requires certain packages to be transpiled.
   */
  transpilePackages: ['@xyflow/react'],
};

export default nextConfig;
