import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Serve modern, lighter formats for better LCP / Core Web Vitals.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
