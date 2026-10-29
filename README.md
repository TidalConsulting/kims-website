# Coffee Crumble: bakery & café site

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
| Logo files (`public/brand/`, original PDF in `docs/brand/`), lockup in `Logo.tsx` | `public/brand/`, `src/components/Logo.tsx` |
| Brand name, address, phone, hours, time zone, socials | `src/lib/data.ts` → `BUSINESS`, `HOURS` |
| Currency (PHP), VAT rate, delivery fee, free-delivery minimum, box prices | `src/lib/data.ts` → `CURRENCY`, `VAT_RATE`, `DELIVERY_FEE`, `FREE_DELIVERY`, `BOX_PRICE` |
| Products, categories, option presets, reviews, hero slides | `src/lib/data.ts` |
| Design tokens (colors, fonts, radii) | `:root` in `src/app/globals.css`, also available in Tailwind as `bg-espresso`, `text-caramel`, `font-serif`, and so on |
| Component styles (ported from the prototype) | `@layer components` in `src/app/globals.css` |
| Cart and favorites (saved to localStorage), plus UI state | `src/store/shop.ts` |
| Page sections | `src/components/*` |
| Order, contact and newsletter endpoints | `src/app/api/*/route.ts` |
| SEO: JSON-LD, sitemap, robots, OG image | `src/lib/seo.ts`, `src/app/sitemap.ts`, `robots.ts`, `opengraph-image.tsx` |

The menu has 65 products (8 cookies, 12 cakes, 14 pastries, 9 cinnamon rolls, 10 coffees, 12 iced teas), each with its own photo in `public/images/`. Cookies and cakes also have a second photo (`<name>-inside.jpg`: the cookie broken open, or a cake slice): cards switch to it on hover, and the quick view has a Whole/Inside switch. Drinks list their ingredients and cakes/pastries their tasting notes (`notes`). Both show in the quick view, with the name in the product's own colour (`hue`). Full-size photo downloads are listed in `docs/CANVA-LINKS.md`.

Products support `soldOut` and `availableDays` (0 = Sunday), and `TODAY` lists what sold out today and what is running low. Sold-out items are greyed out, sink to the bottom of the menu, and cannot be added to the cart or a cookie box. The hero plays `public/images/hero-cookie.mp4` (or `.webm`) if you add one.

## Going live: what to set up

Copy `.env.example` to `.env.local` locally, or add the same variables in your host (e.g. Vercel → Settings → Environment Variables).

1. **Where orders go (required).** Set `RESEND_API_KEY` + `SHOP_EMAIL` (email) and/or `NOTIFY_WEBHOOK_URL` (e.g. a Zapier/Make hook that texts or Vibers the kitchen). The live site refuses orders and messages until one works, so nothing is silently lost. In `npm run dev` they're just printed in the terminal.
2. **Online payment (optional).** Set `PAYMONGO_SECRET_KEY` and `PAYMONGO_WEBHOOK_SECRET` (webhook → `/api/paymongo/webhook`, event `checkout_session.payment.paid`). The kitchen gets an "awaiting payment" ticket, then a "PAID" message. Without these keys, customers pay at pickup or on delivery. Test with `sk_test_…` keys first: the PayMongo call itself has not been exercised against PayMongo yet.
3. **Site URL.** Set `NEXT_PUBLIC_SITE_URL` to your domain (used for PayMongo return links, sitemap, social previews).

## Still to do before launch

- **Real content:** opening hours (`HOURS`), social links (`BUSINESS.socials`, hidden until filled in), the story text, and a check of the delivery areas (`DELIVERY_AREAS`). Name, logo, email, phone and the Ayala Triangle address are in.
- **Reviews:** replace the samples in `REVIEWS` with real ones (ideally from Google Business Profile), then set `REVIEWS_ARE_SAMPLES` to `false`.
- **Help pages:** the Pickup & Delivery, Allergens, FAQ and Privacy text in `src/lib/info.ts` is a draft. Check allergens with the kitchen, and have the privacy notice reviewed against the Data Privacy Act.
- **Photos:** drop photos into `public/images/` using the names in `docs/PHOTO-GUIDE.md` and restart `npm run dev`. Anything missing falls back to the Unsplash stock photo, then an emoji. Once every photo is in, remove the `remotePatterns` entry in `next.config.ts`. Make sure you have the rights to every photo.
- **Sold out today:** edit `TODAY` in `src/lib/data.ts` each morning (set `date` to today; an old list is ignored automatically). Later, move it to the CMS or POS so staff can update it from a phone.
- **CMS:** move `PRODUCTS`, `CATS`, `OPT` and `HOURS` into Sanity or Supabase.
- **Video:** replace the "Watch our story" placeholder in `Layers.tsx` with a real embed.

## Performance

Lighthouse (production build): desktop 99 performance, mobile about 83 (simulated slow 4G and a 4× slower CPU); 100 accessibility, best practices and SEO on both. In a real browser the hero appears in about 0.3 s even with the CPU slowed 4×. The menu grid shows 8 items at a time ("Show more" / "Show all") to keep the page light, and only the first hero photo loads with the page.

## Pricing rules

- Prices are whole pesos and include 12% VAT.
- Bulk prices (half dozen = 5.5 singles, dozen = 10, roll 4-pack = 3.6) round to the nearest ₱5. A mixed Build-a-Box is priced from the cookies picked at the same rate, so it always matches a single-flavour box.
- Each drink paired with a pastry or cinnamon roll takes ₱30 off (`PAIRING`). Free delivery applies once the discounted subtotal reaches ₱1,000.
- `/api/order` recalculates all of this on the server; prices sent by the browser are ignored.

## Ordering rules

- The browser sends only product ids, option choices, notes and quantities. The server builds the kitchen ticket from the menu, so names and prices can't be faked.
- Pickup and delivery times are 15-minute slots in shop time (Asia/Manila) inside `HOURS`. "ASAP" is offered only while open, until 20 minutes before closing. When closed, the first slot is 30 minutes after opening. The server accepts only these slots.
- "Only N left" counts in `TODAY.low` are enforced in the cart and on the server: a dozen uses 12, a 4-pack 4, and a cookie box one of each cookie in it. A line can have at most 99.
- A saved cart is re-priced when the page loads, and anything sold out is removed with a notice.
- With PayMongo on, a customer who backs out of the payment page triggers a "CANCELLED" message to the kitchen (a signed link, so only that customer can cancel).
