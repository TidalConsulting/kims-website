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
5 of the 9 cinnamon rolls are in: `roll-classic-cinnamon.jpg`, `roll-chocolate-hazelnut.jpg`, `roll-cookie-butter.jpg`, `roll-caramel-pecan.jpg` and `roll-blueberry-cheesecake.jpg`. Still needed: `roll-smores.jpg`, `roll-matcha-white-chocolate.jpg`, `roll-red-velvet.jpg` and `roll-rose-pistachio.jpg`. **If that photo came from Pinterest or another site, reshoot the rolls before launch.** You need the rights to use it. The Cookie Butter crop also shows a brand logo on the biscuit, so reshoot that one with an unbranded cookie.

## Shot list: products (overhead, dark surface, square)
Cookies
- cookie-brown-butter-chocolate-chunk.jpg
- cookie-double-dark-sea-salt.jpg
- cookie-almond-butter-shortbread.jpg
- cookie-oatmeal-cranberry.jpg
- cookie-red-velvet-crinkle.jpg
- cookie-pistachio-rose.jpg

Cakes (a slice on a plate, overhead or 45°)
- cake-belgian-chocolate-cake.jpg
- cake-salted-caramel-cake.jpg
- cake-classic-red-velvet.jpg
- cake-vanilla-berry-bliss.jpg

Pastries
- pastry-butter-croissant.jpg
- pastry-pain-au-chocolat.jpg
- pastry-almond-croissant.jpg
- pastry-strawberry-cream-danish.jpg
- pastry-fudgy-walnut-brownie.jpg

Coffee (top-down latte art works great; iced drinks at 45°)
- coffee-caramel-latte.jpg
- coffee-cappuccino.jpg
- coffee-cold-brew.jpg
- coffee-honey-oat-latte.jpg
- coffee-mocha.jpg
- coffee-espresso.jpg

Refreshments
- drink-iced-matcha-latte.jpg
- drink-strawberry-lemonade.jpg
- drink-iced-peach-tea.jpg
- drink-mango-smoothie.jpg
- drink-classic-hot-chocolate.jpg
- drink-sparkling-water.jpg

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
