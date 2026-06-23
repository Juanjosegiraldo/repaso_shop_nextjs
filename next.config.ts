import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root to this project so Next does not infer it from a
  // parent lockfile (multiple package-lock.json files exist above this folder).
  turbopack: {
    root: __dirname,
  },
  // Allow next/image to load product images from these external hosts.
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "placehold.co" },
      { protocol: "https", hostname: "picsum.photos" },
    ],
  },
};

export default nextConfig;
