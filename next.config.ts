import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Emit a self-contained build (.next/standalone) for a small Docker image.
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'api.fciseller.com',
      },
    ],
  },
};

export default nextConfig;
