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
- **Cart drawer**: quantity steppers, free-delivery progress bar ($35 threshold), tax
- **Checkout modal**: pickup or delivery, generated time slots, validation, and an order-confirmation screen
- Cart and favorites persist in localStorage. Scroll-reveal animations respect `prefers-reduced-motion`.

## Design tokens
All colors and fonts live in `:root` at the top of the `<style>` block.
- Espresso `#24160F`, Caramel `#C8925A`, Cream `#F7F0E6`, Paper `#FBF8F3`, Sage `#33503A`, Berry `#B8485A`
- Fonts: Fraunces (headlines), DM Sans (body), Caveat (handwritten accents)

## Recommended build plan
1. **Scaffold**: Next.js (App Router) + TypeScript + Tailwind. Map the CSS tokens into `tailwind.config` theme colors and fonts (`next/font`).
2. **Componentize**: Nav/MegaMenu, MobileNav, Hero, CategoryStrip, MenuGrid, ProductCard, QuickViewModal, SwirlCollection, BoxBuilder, CoffeeSection, Story, Reviews, Visit, Footer, CartDrawer, Checkout.
3. **State**: move the cart and favorites into a Zustand store with `persist`.
4. **Data**: move `PRODUCTS`, `CATS`, `OPT`, `HOURS` into a CMS (Sanity is good for a bakery owner) or a Supabase table, so prices and sold-out items can be edited without code. Add `soldOut` and `availableDays` fields.
5. **Payments**: Stripe Checkout, or Square if the shop already uses Square POS (then orders land on the POS automatically). Use webhooks to email or text the kitchen.
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
