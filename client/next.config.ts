import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode:false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "**.flaticon.com",
      },
    ],
  },
};

export default nextConfig;
