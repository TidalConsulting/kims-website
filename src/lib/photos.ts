import { IMG, type Category, type CategoryId, type Product } from "./data";

/* ---------------------------------------------------------
   PHOTOS: put your own shots in public/images/ using the file name from
   photoFileFor() (e.g. cookie-brown-butter-chocolate-chunk.jpg).
   If the file exists it's used; otherwise the stock photo, then an emoji.
   See docs/PHOTO-GUIDE.md for the full shot list.
   --------------------------------------------------------- */

const FILES = new Set((process.env.NEXT_PUBLIC_PHOTOS ?? "").split(",").filter(Boolean));
const EMBEDDED: Record<string, string> = JSON.parse(process.env.NEXT_PUBLIC_PHOTO_DATA || "{}");

export const hasFile = (file: string) => FILES.has(file);

/** Your photo from public/images if it exists, otherwise `fallback`. */
export const localOr = (file: string, fallback: string) =>
  EMBEDDED[file] ?? (FILES.has(file) ? `/images/${file}` : fallback);

const slug = (s: string) =>
  s.toLowerCase().replace(/['’]/g, "").replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const CAT_PREFIX: Record<CategoryId, string> = {
  cookies: "cookie",
  cakes: "cake",
  pastries: "pastry",
  rolls: "roll",
  coffee: "coffee",
  refreshments: "drink",
};

export const photoFileFor = (p: Product) => `${CAT_PREFIX[p.cat]}-${slug(p.name)}.jpg`;
export const productPhoto = (p: Product) => localOr(photoFileFor(p), p.img);

/** Cookie "inside" (broken-open) photo, cookie-<name>-inside.jpg, or undefined if there isn't one. */
export const insidePhoto = (p: Product) => {
  if (p.cat !== "cookies") return undefined;
  const file = photoFileFor(p).replace(/\.jpg$/, "-inside.jpg");
  return localOr(file, "") || undefined;
};

/** Cinnamon rolls use the "plate" style: a round overhead crop centered on the slate surface. */
export const isPlate = (p?: Product) => p?.cat === "rolls";

const CATEGORY_DEFAULT: Partial<Record<CategoryId, string>> = {
  rolls: "roll-classic-cinnamon.jpg",
  cookies: "cookie-classic-chocolate-chip.jpg",
};

/** category-<id>.jpg if you add one, otherwise a product photo for that category, otherwise stock. */
export const categoryPhoto = (c: Category) => {
  const own = localOr(`category-${c.id}.jpg`, "");
  const fallback = CATEGORY_DEFAULT[c.id];
  return own || (fallback ? localOr(fallback, c.img) : c.img);
};

export const SECTION_PHOTOS = {
  hero: localOr("hero-cookie.jpg", IMG.cookie1),
  swirlFeature: localOr("roll-classic-cinnamon.jpg", IMG.roll),
  coffee: localOr("coffee-hero.jpg", IMG.coffee1),
  story: localOr("story-baker.jpg", IMG.pastry2),
  gift: localOr("gift-box.jpg", IMG.cookie2),
  box: localOr("gift-box.jpg", localOr("cookie-classic-chocolate-chip.jpg", IMG.cookie2)),
};

/** Hero video sources that exist in public/images (never embedded in the one-file preview). */
export const heroVideo = Object.keys(EMBEDDED).length
  ? []
  : [
      { src: "/images/hero-cookie.webm", type: "video/webm" },
      { src: "/images/hero-cookie.mp4", type: "video/mp4" },
    ].filter((v) => FILES.has(v.src.slice("/images/".length)));

