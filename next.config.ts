import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root to this project so Next does not infer it from a
  // parent lockfile (multiple package-lock.json files exist above this folder).
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
