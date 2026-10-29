# Crumb & Kettle: Bakery + Coffee Website

## What this is
`index.html` is a working single-file prototype (HTML + CSS + vanilla JS, no build step). Open it in a browser to see it. Treat it as the **design and behavior spec**. The job is to turn it into a production site.

"Crumb & Kettle" is a placeholder brand. Swap in the real name, logo, address, phone, hours, and prices.

## What's already built (keep all of this)
- Announcement bar plus a sticky glass nav with a **mega-menu dropdown** (Bakery: Cookies / Cakes / Pastries / Cinnamon Rolls; Café: Coffee / Refreshments / Build a Box)
- Mobile slide-in menu with a collapsible "Menu" submenu
- **Hero slider** (3 slides, auto-rotates, with dots), live "Open now / Closed" chip computed from `HOURS`, and a "next batch in X min" chip
- Category circles that filter the menu
- **Menu grid**: category tabs, live search, sort (price, A–Z, My Favorites), favorite hearts, and a quick-view modal
- **Product options**: cookies (single / half dozen / dozen), cakes (slice / 6" / 9"), drinks (size, milk, hot or iced), cinnamon rolls (single / 4-pack / party of 9), plus a special-requests note
- **Swirl Collection**: an interactive 3×3 grid of the 9 cinnamon-roll flavors
- **Build-a-Box**: 6 or 12 cookie slots, tap to fill or remove, "surprise me" fill, adds to cart as one line item
- Coffee section (sage-green palette) with 3 signature drinks
- Story section with animated counters and a video-modal placeholder
- Gifting banner, reviews carousel, visit/hours (today highlighted), a reservation/catering form, newsletter, and footer
- **Cart drawer**: quantity steppers, free-delivery progress bar (₱1,000 threshold, ₱79 delivery fee), VAT-inclusive totals
- **Checkout modal**: pickup or delivery, generated time slots, validation, and an order-confirmation screen
- Cart and favorites persist in localStorage. Scroll-reveal animations respect `prefers-reduced-motion`.

- **Photo system**: each product loads `images/<category>-<slug>.jpg` first, then stock, then an emoji (`photoFor()`, `pImg()`, `imgFallback()`). Cinnamon rolls use the "plate" style, a round overhead crop centered on dark slate. All photos get the same CSS grade so mixed sources match. See `images/PHOTO-GUIDE.md` for file names and the shot list.
- **Hero video**: `images/hero-cookie.mp4/.webm` plays muted, looped, at 0.6× speed in the hero plate on slide 1, with a pause button. `hero-cookie.jpg` is the poster/fallback. It's skipped under `prefers-reduced-motion` or data-saver.
- **Cookie lineup (8 stuffed cookies)**: each cookie has a whole photo (`images/cookie-<slug>.jpg`) and an inside photo (`images/cookie-<slug>-inside.jpg`, via `insideFor()`). Cards crossfade to the inside shot on hover and show a "See inside" hint. The quick view has a Whole/Inside switch. The "Meet the cookies" section (`#cookies`) lists every cookie as a row (whole · name in its own `hue` color · inside shot), and clicking a row opens the quick view. Each cookie has `hue` and `filling` fields.
- **Sold out today / low stock**: the `TODAY` object (`soldOut` ids, `low` counts, `restock` text). Sold-out cards are greyed with a "Sold out today · Back tomorrow at 7am" overlay, can't be added to the cart, and sink to the bottom of the grid. A strip above the grid lists them. They also can't be picked in Build-a-Box, and the "surprise me" fill skips them. Low-stock items show an "Only N left" tag.

## Currency & pricing
- All prices are **Philippine pesos (₱), whole numbers, VAT-inclusive (12%)**. `money()` formats with `en-PH`, and `vatOf()` shows the VAT portion at checkout. Nothing is added on top.
- Keep prices as integers. If you move to a database, store them as integer pesos (or centavos) and never as floats.

## Design rules: Candy Pop theme (keep to these)
All colors are tokens in `:root`. Never hard-code a hex in components.
- **Plum** `#2B1340` (`--plum`, `--plum-2`): text, dark sections (hero, visit, footer, box panel)
- **Bubblegum** `#DB1F80` (`--pink`): primary buttons, prices, active tabs, key accents. White text on it passes contrast.
- `--pink-pop` `#FF5FAE` and `--pink-2` `#FF8AC4` are **decoration only** (rings, hover shadows, text on dark). Don't put white text on them.
- **Lemon** `#FFD93D`: badges, add buttons, stars, highlights on dark, newsletter band. Always plum text on lemon.
- **Grape** `#7B3FE4`: secondary accent, gradients (Swirl section, gift banner)
- **Mint** `#2EC4A0` / `--mint-dark` `#0E5B4C` / `--mint-soft`: **coffee section only**
- **Sky** `#6EC8FF` and peach `#FF9F6E`: tiny accents only (category rings, sprinkles)
- Backgrounds: `--paper` `#FFF8FB`, `--cotton` `#FFF0F7`, `--cotton-2` `#FFE1EF`. Photo surface: `--slate` pastel pink.
- Candy details: candy-stripe announcement bar, rainbow sprinkles falling in the hero, "sticker" hover on cards (offset pink shadow plus a slight tilt), chunky pressed buttons (`box-shadow: 0 5px 0 <darker>`), rainbow category rings, bouncy easing (`--bounce`)
- Fonts: **Fredoka** (headlines, rounded and playful), DM Sans (body), Caveat (handwritten accents only)

## Production notes for these features
- Move `TODAY` into the CMS or POS so staff can tap "sold out" from a phone. With Square, read inventory counts and mark items sold out at 0.
- Reset `soldOut` automatically at opening time each day.
- Serve photos through `next/image` (AVIF/WebP, responsive sizes). Keep the slate "plate" style as a component prop.
- The hero video should keep `muted playsinline`, a `poster`, and the reduced-motion check.

## Recommended build plan
1. **Scaffold**: Next.js (App Router) + TypeScript + Tailwind. Map the CSS tokens into `tailwind.config` theme colors and fonts (`next/font`).
2. **Componentize**: Nav/MegaMenu, MobileNav, Hero, CategoryStrip, MenuGrid, ProductCard, QuickViewModal, SwirlCollection, BoxBuilder, CoffeeSection, Story, Reviews, Visit, Footer, CartDrawer, Checkout.
3. **State**: move the cart and favorites into a Zustand store with `persist`.
4. **Data**: move `PRODUCTS`, `CATS`, `OPT`, `HOURS` into a CMS (Sanity is good for a bakery owner) or a Supabase table, so prices and sold-out items can be edited without code. Add `soldOut` and `availableDays` fields.
5. **Payments (Philippines)**: PayMongo Checkout (GCash, Maya, GrabPay, cards, QR Ph). Xendit is an alternative. Stripe does not onboard PH businesses. Use webhooks to text or Viber the kitchen. For delivery, integrate Lalamove or Grab Express, or keep a flat in-house fee.
6. **Images**: the prototype uses Unsplash stock with an emoji fallback. Replace them with real product photos (WebP, around 1200px) and use `next/image`.
7. **Reviews**: the reviews in the prototype are **placeholders**. Replace them with real ones, ideally pulled from Google Business Profile.
8. **Forms**: wire up the contact/catering form and newsletter (Resend or Formspree; Mailchimp or Klaviyo for the newsletter).
9. **SEO / local**: `LocalBusiness` + `Bakery` JSON-LD, OG images, a sitemap, and a Google Maps embed in Visit.
10. **Quality**: Lighthouse score of 90 or higher, keyboard-trap focus inside modals and the drawer, `aria-expanded` on the menus.

## Nice-to-have upgrades
- Order-ahead time slots limited by real kitchen capacity
- Loyalty stamp card ("buy 9 coffees, 10th free") tied to phone number
- Custom-cake builder (flavor, frosting, size, message, date picker with 48h lead time)
- "Sold out today" badges driven by the CMS
- Allergen filter chips (nut-free, gluten-free, vegan)
- Instagram feed strip above the footer
- Dark mode toggle
