import type { NextConfig } from "next";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const withPWA = require("next-pwa")({
  dest: 'public', // Destination for PWA files (sw.js and workbox-*.js)
  register: true,  // Auto-register the service worker
  skipWaiting: true, // Skip waiting to activate service worker immediately
  disable: process.env.NODE_ENV === "development", // Disable PWA in development
});

// Main Next.js configuration
const nextConfig: NextConfig = {
  turbopack: {},
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
      },
      {
        protocol: 'https',
        hostname: 'ibb.co',
      },
      {
        protocol: 'https',
        hostname: 'i.ibb.co.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
};

export default withPWA(nextConfig);
