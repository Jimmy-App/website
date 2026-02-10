import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [65, 70, 75],
    deviceSizes: [320, 384, 420, 480, 540, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
