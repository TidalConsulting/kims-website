# Crumb & Kettle: Bakery + Coffee site

Next.js (App Router), TypeScript, Tailwind CSS v4 and Zustand. Built from the single-file prototype in `prototype/index.html`, which is kept for reference. `CLAUDE.md` has the spec.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run lint && npm run typecheck
```

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SITE_URL`. The sitemap, OG tags and JSON-LD use it.

## Where things live

| What | Where |
| --- | --- |
| Brand name, address, phone, hours, time zone, socials | `src/lib/data.ts` → `BUSINESS`, `HOURS` |
| Products, categories, option presets, reviews, hero slides | `src/lib/data.ts` |
| Design tokens (colors, fonts, radii) | `:root` in `src/app/globals.css`, also available in Tailwind as `bg-espresso`, `text-caramel`, `font-serif`, and so on |
| Component styles (ported from the prototype) | `@layer components` in `src/app/globals.css` |
| Cart and favorites (saved to localStorage), plus UI state | `src/store/shop.ts` |
| Page sections | `src/components/*` |
| Order, contact and newsletter endpoints | `src/app/api/*/route.ts` |
| SEO: JSON-LD, sitemap, robots, OG image | `src/lib/seo.ts`, `src/app/sitemap.ts`, `robots.ts`, `opengraph-image.tsx` |

Products support `soldOut` and `availableDays` (0 = Sunday). An item that isn't available today shows a "Sold out today" badge and can't be added to the cart.

## Still to do before launch

- **Real content:** replace the placeholder brand, address and prices, and the **placeholder reviews** (`REVIEWS`).
- **Photos:** the Unsplash stock images are placeholders. Put real WebP photos (around 1200px) in `/public` or the CMS, then update `IMG`. Once no remote images remain, remove the `remotePatterns` entry in `next.config.ts`.
- **CMS:** move `PRODUCTS`, `CATS`, `OPT` and `HOURS` into Sanity or Supabase.
- **Payments:** `/api/order` already validates the cart and recalculates prices on the server, but it doesn't take payment. Create a Stripe Checkout Session (or a Square order) there, and use a webhook to notify the kitchen.
- **Forms:** `/api/contact` and `/api/newsletter` check the input and log it. Connect them to Resend or Formspree, and to Mailchimp or Klaviyo.
- **Video:** replace the "Watch our story" placeholder in `Layers.tsx` with a real embed.
- **Footer help links** (Pickup & Delivery, Allergens, FAQ, Privacy) point to `#` until those pages exist.
