import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { NextConfig } from "next";

// Set by scripts/build-preview.mjs to produce a server-less static export.
const preview = process.env.NEXT_PUBLIC_STATIC_PREVIEW === "1";

// Photos and videos dropped into public/images/ (see docs/PHOTO-GUIDE.md). The list is read
// when the dev server starts or the site is built, so the site only asks for files that exist.
const dir = join(process.cwd(), "public/images");
const files = readdirSync(dir).filter((f) => /\.(jpe?g|png|webp|avif|mp4|webm)$/i.test(f));

// The one-file preview can't load separate files, so photos are embedded as data URIs.
const MIME: Record<string, string> = { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp", avif: "image/avif" };
const photoData = preview
  ? Object.fromEntries(
      files
        .filter((f) => MIME[f.split(".").pop()!.toLowerCase()])
        .map((f) => [f, `data:${MIME[f.split(".").pop()!.toLowerCase()]};base64,${readFileSync(join(dir, f)).toString("base64")}`]),
    )
  : {};

const nextConfig: NextConfig = {
  ...(preview && { output: "export" }),
  env: {
    NEXT_PUBLIC_PHOTOS: files.join(","),
    NEXT_PUBLIC_PHOTO_DATA: JSON.stringify(photoData),
  },
  images: {
    unoptimized: preview,
    formats: ["image/avif", "image/webp"],
    // Stock placeholders. Remove once every product has a real photo in public/images.
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
};

export default nextConfig;
