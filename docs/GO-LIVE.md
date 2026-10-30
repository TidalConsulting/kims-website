# Going live: step by step

Setup chosen: **orders texted to the kitchen**, **customers pay at pickup or on delivery**, **free Vercel address first** (add a domain later).

Do the steps in order. Each one takes 5–15 minutes. Nothing here needs code changes.

## 1. Text messages to the kitchen (Semaphore)

1. Sign up at **semaphore.co** with the shop's email.
2. Buy credits (GCash, Maya or card). About ₱0.50 per text; ₱500 covers roughly 1,000 short orders. Each order text is 1–3 SMS depending on its size.
3. Open **Account → API** and copy the **API key**.
4. Write down the mobile number(s) that should get orders, e.g. `09171234567`. For two phones, separate with a comma: `09171234567,09181234567`.
5. Optional: request a **sender name** (for example `CoffeeCrmbl`, 11 characters max). Until it's approved, texts come from "SEMAPHORE". Leave `SMS_SENDER` blank until then.

You'll paste these into Vercel in step 3.

> Tip: also set up the free email channel (Resend, see the end) as a backup. If a phone is off or credits run out, the order is still in the inbox. Any one channel working is enough for the order to go through.

## 2. Put the code on GitHub (already done)

The site lives in the GitHub repository `tidalconsulting/kims-website`, branch `claude/eager-thompson-grg5q5`.

## 3. Publish on Vercel

1. Go to **vercel.com → Sign up → Continue with GitHub**, using the GitHub account that can see `tidalconsulting/kims-website`.
2. **Add New → Project →** pick `kims-website` → **Import**. If the repo isn't listed, click **Adjust GitHub App Permissions** and allow it.
3. Framework is detected as **Next.js**. Leave the build settings as they are.
4. Open **Environment Variables** and add:

   | Name | Value |
   | --- | --- |
   | `SEMAPHORE_API_KEY` | the key from step 1 |
   | `KITCHEN_SMS` | the kitchen number(s) |
   | `SMS_SENDER` | (leave out until approved) |
   | `NEXT_PUBLIC_SITE_URL` | leave out for now; set it in step 4 |

5. Click **Deploy**. After about 2 minutes you get an address like `kims-website.vercel.app`.
6. Vercel deploys the repository's default branch. If that isn't `claude/eager-thompson-grg5q5`, go to **Settings → Git → Production Branch** and set it, or merge the branch into `main`.

## 4. Point the site at its own address

1. Copy the address Vercel gave you (e.g. `https://kims-website.vercel.app`). You can rename it under **Settings → Domains** (e.g. `coffeecrumble.vercel.app`, if free).
2. **Settings → Environment Variables →** add `NEXT_PUBLIC_SITE_URL` with that full address.
3. **Deployments →** the latest one → **⋯ → Redeploy**. (Variables only apply to new deploys.)

## 5. Test before telling anyone

On your phone, open the site and:

- [ ] Place a pickup order. The kitchen phone gets a text within a minute.
- [ ] Place a delivery order to one of the listed areas.
- [ ] Send the catering form. The kitchen phone gets a text.
- [ ] Sign up for the newsletter. A short text arrives (switch these to email later; see the end).
- [ ] Try ordering more than an "Only N left" item allows. You get a clear "sorry" message.

If an order shows "We couldn't send your order to the kitchen", check **Vercel → Logs** for `SMS failed`. The usual causes are no credits, a wrong number, or a wrong API key.

## 6. Content to confirm before launch

These are in `src/lib/data.ts` and `src/lib/info.ts`. Send me the real details and I'll update them.

- [ ] **Opening hours** (`HOURS`): the times and days currently shown are placeholders. Online ordering only accepts times inside them.
- [ ] **Delivery areas** (`DELIVERY_AREAS`) and the ₱79 fee / ₱1,000 free-delivery threshold.
- [ ] **Prices** on all 65 items.
- [ ] **Reviews**: currently labelled as samples. Replace with real ones, or hide the section.
- [ ] **Allergen, FAQ and privacy text**: drafts. Check allergens with the kitchen, and have the privacy notice checked against the Data Privacy Act.
- [ ] **Photos**: several are AI or stock images. Swap in real photos of your products.
- [ ] **Story section text.**

## 7. Daily running

- **Sold out / low stock** (`TODAY` in `src/lib/data.ts`) is edited in the code, and each edit takes about 2 minutes to go live on Vercel. That's fine for a soft launch. For staff to tap "sold out" from a phone, the next step is a small admin page or a CMS.
- Check Semaphore credits weekly. The site can't take orders by text once credits run out (unless email is also set up).

## Later

- **Domain** (e.g. `coffeecrumble.ph` at dot.ph, or `.com` at Namecheap / Cloudflare): add it in **Vercel → Settings → Domains**, follow the DNS instructions, then update `NEXT_PUBLIC_SITE_URL` and redeploy.
- **Email backup (free, recommended):** sign up at resend.com, create an API key, and add `RESEND_API_KEY` plus `SHOP_EMAIL=coffeecrumble@gmail.com` in Vercel. Every order and message is then also emailed.
- **Online payment (PayMongo):** needs business documents (DTI/SEC, BIR, Mayor's permit). See the PayMongo section in `README.md`.
- **Google Business Profile**: claim the shop on Google Maps so it shows up in "bakery near me" searches and you can collect real reviews.
