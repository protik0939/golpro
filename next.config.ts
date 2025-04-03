import withPWA from "next-pwa";
import type { NextConfig } from "next";

// Main Next.js configuration
const nextConfig: NextConfig = {
  images: {
    domains: ['i.ibb.co', 'ibb.co', 'i.ibb.co.com', 'lh3.googleusercontent.com'], // Add your image domains here
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ibb.co', // Add ImageBB CDN
      },
      {
        protocol: 'https',
        hostname: 'ibb.co', // Add ImageBB shortened links
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Add Google Images
      },
    ],
  },
};

// Next-PWA configuration
const pwaConfig = withPWA({
  dest: 'public', // Destination for PWA files (sw.js and workbox-*.js)
  register: true,  // Auto-register the service worker
  skipWaiting: true, // Skip waiting to activate service worker immediately
  disable: process.env.NODE_ENV === "development", // Disable PWA in development
});

export default {
  ...nextConfig,
  ...pwaConfig,
};
