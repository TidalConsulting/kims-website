# Crumb & Kettle: Bakery + Coffee site

Next.js (App Router), TypeScript, Tailwind CSS v4 and Zustand. Built from the single-file prototype in `prototype/index.html`, which is kept for reference. `CLAUDE.md` has the spec.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run lint && npm run typecheck
```

To make a shareable one-file preview (no server needed; checkout and forms are simulated), run `npm run build:preview`. It writes `preview/index.html`.

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SITE_URL`. The sitemap, OG tags and JSON-LD use it.

## Where things live

| What | Where |
| --- | --- |
| Brand name, address, phone, hours, time zone, socials | `src/lib/data.ts` → `BUSINESS`, `HOURS` |
| Currency (PHP), VAT rate, delivery fee, free-delivery minimum, box prices | `src/lib/data.ts` → `CURRENCY`, `VAT_RATE`, `DELIVERY_FEE`, `FREE_DELIVERY`, `BOX_PRICE` |
| Products, categories, option presets, reviews, hero slides | `src/lib/data.ts` |
| Design tokens (colors, fonts, radii) | `:root` in `src/app/globals.css`, also available in Tailwind as `bg-espresso`, `text-caramel`, `font-serif`, and so on |
| Component styles (ported from the prototype) | `@layer components` in `src/app/globals.css` |
| Cart and favorites (saved to localStorage), plus UI state | `src/store/shop.ts` |
| Page sections | `src/components/*` |
| Order, contact and newsletter endpoints | `src/app/api/*/route.ts` |
| SEO: JSON-LD, sitemap, robots, OG image | `src/lib/seo.ts`, `src/app/sitemap.ts`, `robots.ts`, `opengraph-image.tsx` |

Products support `soldOut` and `availableDays` (0 = Sunday), and `TODAY` lists what sold out today and what is running low. Sold-out items are greyed out, sink to the bottom of the menu, and cannot be added to the cart or a cookie box. The hero plays `public/images/hero-cookie.mp4` (or `.webm`) if you add one.

## Still to do before launch

- **Real content:** replace the placeholder brand, address and prices, and the **placeholder reviews** (`REVIEWS`).
- **Photos:** drop photos into `public/images/` using the names in `docs/PHOTO-GUIDE.md` and restart `npm run dev`. Anything missing falls back to the Unsplash stock photo, then an emoji. Once every photo is in, remove the `remotePatterns` entry in `next.config.ts`.
- **Sold out today:** edit `TODAY` in `src/lib/data.ts` (sold-out ids, low-stock counts). Later, move it to the CMS or POS so staff can update it from a phone.
- **CMS:** move `PRODUCTS`, `CATS`, `OPT` and `HOURS` into Sanity or Supabase.
- **Payments:** `/api/order` already validates the cart and recalculates prices on the server, but it doesn't take payment. Create a PayMongo Checkout Session there (GCash, Maya, GrabPay, cards, QR Ph; Stripe doesn't onboard PH businesses), and use a webhook to text or Viber the kitchen.
- **Forms:** `/api/contact` and `/api/newsletter` check the input and log it. Connect them to Resend or Formspree, and to Mailchimp or Klaviyo.
- **Video:** replace the "Watch our story" placeholder in `Layers.tsx` with a real embed.
- **Footer help links** (Pickup & Delivery, Allergens, FAQ, Privacy) point to `#` until those pages exist.
