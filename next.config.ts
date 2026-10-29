import { readdirSync } from "node:fs";
import { join } from "node:path";
import type { NextConfig } from "next";

// Set by scripts/build-preview.mjs to produce a server-less static export.
const preview = process.env.NEXT_PUBLIC_STATIC_PREVIEW === "1";

// Photos and videos dropped into public/images/ (see docs/PHOTO-GUIDE.md). The list is read
// when the dev server starts or the site is built, so the site only asks for files that exist.
const dir = join(process.cwd(), "public/images");
const files = readdirSync(dir).filter((f) => /\.(jpe?g|png|webp|avif|mp4|webm)$/i.test(f));

// The one-file preview can't load separate files, so photos are embedded as data URIs,
// shrunk to 480px WebP so the whole page stays well under the 16 MB limit.
const IMAGE = /\.(jpe?g|png|webp|avif)$/i;
async function embedPhotos() {
  const sharp = (await import("sharp")).default;
  const entries = await Promise.all(
    files.filter((f) => IMAGE.test(f)).map(async (f) => {
      const buf = await sharp(join(dir, f))
        .resize({ width: 480, height: 480, fit: "inside", withoutEnlargement: true })
        .webp({ quality: 72 })
        .toBuffer();
      return [f, `data:image/webp;base64,${buf.toString("base64")}`] as const;
    }),
  );
  return Object.fromEntries(entries);
}

export default async function config(): Promise<NextConfig> {
  const photoData = preview ? await embedPhotos() : {};
  return {
    ...(preview && { output: "export" }),
    env: {
      NEXT_PUBLIC_PHOTOS: files.join(","),
      NEXT_PUBLIC_PHOTO_DATA: JSON.stringify(photoData),
      // Only whether online payment is on; the secret key stays on the server.
      NEXT_PUBLIC_ONLINE_PAYMENT: process.env.PAYMONGO_SECRET_KEY && !preview ? "1" : "",
    },
    images: {
      unoptimized: preview,
      formats: ["image/avif", "image/webp"],
      // Stock placeholders. Remove once every product has a real photo in public/images.
      remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
    },
  };
}
