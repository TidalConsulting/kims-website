import type { NextConfig } from "next";

// Set by scripts/build-preview.mjs to produce a server-less static export.
const preview = process.env.NEXT_PUBLIC_STATIC_PREVIEW === "1";

const nextConfig: NextConfig = {
  ...(preview && { output: "export" }),
  images: {
    unoptimized: preview,
    formats: ["image/avif", "image/webp"],
    // Stock placeholders. Remove once real product photos live in /public or the CMS.
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
};

export default nextConfig;
