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

Cookies have a whole photo and an inside photo (`cookie-<name>-inside.jpg`): cards switch to the inside shot on hover, the quick view has a Whole/Inside switch, and the "Meet the cookies" section (`CookieLineup.tsx`) shows both side by side with each cookie's `hue` and `filling`.

Products support `soldOut` and `availableDays` (0 = Sunday), and `TODAY` lists what sold out today and what is running low. Sold-out items are greyed out, sink to the bottom of the menu, and cannot be added to the cart or a cookie box. The hero plays `public/images/hero-cookie.mp4` (or `.webm`) if you add one.

## Going live: what to set up

Copy `.env.example` to `.env.local` locally, or add the same variables in your host (e.g. Vercel → Settings → Environment Variables).

1. **Where orders go (required).** Set `RESEND_API_KEY` + `SHOP_EMAIL` (email) and/or `NOTIFY_WEBHOOK_URL` (e.g. a Zapier/Make hook that texts or Vibers the kitchen). The live site refuses orders and messages until one works, so nothing is silently lost. In `npm run dev` they're just printed in the terminal.
2. **Online payment (optional).** Set `PAYMONGO_SECRET_KEY` and `PAYMONGO_WEBHOOK_SECRET` (webhook → `/api/paymongo/webhook`, event `checkout_session.payment.paid`). The kitchen gets an "awaiting payment" ticket, then a "PAID" message. Without these keys, customers pay at pickup or on delivery. Test with `sk_test_…` keys first: the PayMongo call itself has not been exercised against PayMongo yet.
3. **Site URL.** Set `NEXT_PUBLIC_SITE_URL` to your domain (used for PayMongo return links, sitemap, social previews).

## Still to do before launch

- **Real content:** name, logo, address, phone, email, socials and hours (`BUSINESS`, `HOURS`), delivery areas (`DELIVERY_AREAS`), and the hero/story numbers.
- **Reviews:** replace the samples in `REVIEWS` with real ones (ideally from Google Business Profile), then set `REVIEWS_ARE_SAMPLES` to `false`.
- **Help pages:** the Pickup & Delivery, Allergens, FAQ and Privacy text in `src/lib/info.ts` is a draft. Check allergens with the kitchen, and have the privacy notice reviewed against the Data Privacy Act.
- **Photos:** drop photos into `public/images/` using the names in `docs/PHOTO-GUIDE.md` and restart `npm run dev`. Anything missing falls back to the Unsplash stock photo, then an emoji. Once every photo is in, remove the `remotePatterns` entry in `next.config.ts`. Make sure you have the rights to every photo.
- **Sold out today:** edit `TODAY` in `src/lib/data.ts` each morning (set `date` to today; an old list is ignored automatically). Later, move it to the CMS or POS so staff can update it from a phone.
- **CMS:** move `PRODUCTS`, `CATS`, `OPT` and `HOURS` into Sanity or Supabase.
- **Video:** replace the "Watch our story" placeholder in `Layers.tsx` with a real embed.

## Pricing rules

- Prices are whole pesos and include 12% VAT.
- Bulk prices (half dozen = 5.5 singles, dozen = 10, roll 4-pack = 3.6) round to the nearest ₱5. A mixed Build-a-Box is priced from the cookies picked at the same rate, so it always matches a single-flavour box.
- Each drink paired with a pastry or cinnamon roll takes ₱30 off (`PAIRING`). Free delivery applies once the discounted subtotal reaches ₱1,000.
- `/api/order` recalculates all of this on the server; prices sent by the browser are ignored.
