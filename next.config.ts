import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [{ source: '/work', destination: '/insights', permanent: true }]
  },
  async rewrites() {
    return [
      // Serve favicon for common alternate icon requests to avoid 404s
      { source: '/apple-touch-icon.png', destination: '/favicon.ico' },
      { source: '/apple-touch-icon-precomposed.png', destination: '/favicon.ico' },
    ];
  },
};

export default nextConfig;
