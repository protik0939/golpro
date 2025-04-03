import type { NextConfig } from "next";


const nextConfig: NextConfig = {
  images: {
    domains: ['i.ibb.co', 'ibb.co', 'i.ibb.co.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Google images
      },
      {
        protocol: 'https',
        hostname: 'i.ibb.co', // ImageBB CDN
      },
      {
        protocol: 'https',
        hostname: 'ibb.co', // ImageBB shortened links
      },
    ],
  },
};

export default nextConfig;

