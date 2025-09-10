import type { NextConfig } from "next";

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    esmExternals: true,
  },
  transpilePackages: ["nextstepjs"],
};

export default nextConfig;
