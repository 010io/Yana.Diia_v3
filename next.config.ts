import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable Turbopack for stability
  experimental: {
    turbo: undefined,
    // serverActions: true, // Enabled by default in Next.js 16
  },
  // Suppress non-standard NODE_ENV warning
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  reactStrictMode: true,
};

export default nextConfig;
