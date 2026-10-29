# Photo & Video Guide

Drop files into the `public/images/` folder with the **exact names below**. The site picks each one up automatically the next time it starts (`npm run dev`) or is built. Anything missing falls back to a stock photo, then to an emoji.

## The look (keep every shot the same)
- **Overhead, straight down** (flat-lay), like the cinnamon roll photo
- **Dark surface**: black slate, dark stone, or a charcoal baking sheet. Use the same surface for every shot.
- **One soft light from the side** (window light at 9–11am is perfect). No flash.
- A few crumbs, a cinnamon stick, or cocoa nibs around the item. Keep it to 1–3 props.
- Fill about 75% of the frame with the item, centered, with a little space around it
- **Square, 1200×1200 px, JPG** (under 300 KB each; compress with squoosh.app)
- Phone tip: Portrait mode off, 1× lens, stand on a chair, lock exposure on the food

## Already done
All 9 cinnamon rolls (`roll-*.jpg`) are in `public/images/`. **If that photo came from Pinterest or another site, reshoot the rolls before launch.** You need the rights to use it. The Cookie Butter crop also shows a brand logo on the biscuit, so reshoot that one with an unbranded cookie.

## Shot list: products (overhead, dark surface, square)
Cookies: **done (AI-generated flat-lays on pastel pink)**. The current files are enlarged previews. Download the full-size 1264×1264 originals from Canva and save over these:
- cookie-classic-chocolate-chip.jpg (also copied as hero-cookie.jpg)
- cookie-double-chocolate.jpg
- cookie-spiced-cookie-butter.jpg
- cookie-cookies-and-cream.jpg
- cookie-chocolate-hazelnut.jpg
- cookie-caramel-pecan.jpg
- cookie-pistachio-raspberry.jpg
- cookie-red-velvet-white-chocolate.jpg
These are AI images. Before launch, swap in real photos of your actual cookies so customers get what they see.

Cookie **inside** shots (broken in half to show the filling, side view, same pastel pink). They show on hover, in the pop-up's Whole/Inside switch, and in the "Meet the cookies" section:
- cookie-classic-chocolate-chip-inside.jpg
- cookie-double-chocolate-inside.jpg
- cookie-spiced-cookie-butter-inside.jpg
- cookie-cookies-and-cream-inside.jpg
- cookie-chocolate-hazelnut-inside.jpg
- cookie-caramel-pecan-inside.jpg
- cookie-pistachio-raspberry-inside.jpg
- cookie-red-velvet-white-chocolate-inside.jpg
Shooting tip: break the cookie while it's still warm, stack the halves, and shoot from the side at cookie height.

**Cakes, pastries, coffee and iced teas: done (AI-generated, pastel pink, 76 photos in total).** File names follow `<category>-<item-name>.jpg`; cakes also have `-inside.jpg` (the slice). See `CANVA-LINKS.md` for the full-size downloads. Swap in real photos of your own products before launch.

## Section photos
- `hero-cookie.jpg`: square, 1400×1400. One hero cookie broken in half on slate. Also the poster frame for the video.
- `category-cookies.jpg`, `category-cakes.jpg`, `category-pastries.jpg`, `category-coffee.jpg`, `category-refreshments.jpg`: square, used in the round category bubbles
- `coffee-hero.jpg`: portrait 4:4.4, latte or iced coffee with beans
- `story-baker.jpg`: landscape, hands shaping dough or dusting flour
- `gift-box.jpg`: landscape, an open box of assorted cookies

## Hero video: `hero-cookie.mp4` (+ optional `hero-cookie.webm`)
- **What:** close-up of hands slowly breaking a warm cookie so the chocolate stretches. Dark background, same slate.
- **Length:** 6–10 seconds that loop cleanly (start and end on a similar frame)
- **Size:** square 1080×1080, **no audio**, under 3 MB
- **Shoot:** phone in slow-motion mode (120 or 240 fps), on a tripod, one side light
- **Compress:** HandBrake ("Web" preset), or run `ffmpeg -i in.mov -an -vf scale=1080:1080 -c:v libx264 -crf 26 -preset veryfast -movflags +faststart hero-cookie.mp4`
- The site plays it at 0.6× speed so it feels slower. A pause button appears on it. It's skipped automatically for visitors with "reduce motion" or data-saver turned on.

## No time to shoot?
AI image tools can produce this look. Prompt: *"Overhead flat-lay food photography of [item] on dark black slate, soft side window light, a few crumbs, moody, editorial, square."* Use the same prompt for every item so they match.
