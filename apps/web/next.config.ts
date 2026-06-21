import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@healthmesh/ui"],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
