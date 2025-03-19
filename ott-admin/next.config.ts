import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    // remotePatterns: [
    //   {
    //     protocol: 'https',
    //     hostname: process.env.NEXT_PUBLIC_CDN_URL || 'http://localhost:9000/ott-media/',
    //     port: '',
    //     pathname: '/images/**',
    //     search: '',
    //   },
    // ],
    domains: ['localhost'],
  },
};

export default nextConfig;
