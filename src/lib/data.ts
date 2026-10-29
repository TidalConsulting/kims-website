/* =========================================================
   SITE DATA — edit products, hours and business info here.
   Later: move PRODUCTS / CATS / OPT / HOURS into a CMS (Sanity)
   or a Supabase table so the owner can edit without code.
   ========================================================= */

// "Crumb & Kettle" is a placeholder brand. Swap in the real details.
export const BUSINESS = {
  name: "Crumb & Kettle",
  tagline: "Bakery · Coffee",
  description:
    "Small-batch cookies, cakes, pastries, cinnamon rolls, and specialty coffee. Order for pickup or delivery.",
  email: "hello@crumbandkettle.com",
  phone: "(555) 123-4567",
  street: "123 Main Street",
  city: "Your City",
  region: "ST",
  postalCode: "00000",
  country: "US",
  // Used to compute "Open now" in the shop's local time, not the visitor's.
  timeZone: "America/New_York",
  priceRange: "$$",
  foundedYear: 2019,
  socials: {
    instagram: "#",
    facebook: "#",
    tiktok: "#",
  },
};

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const U = (id: string) => `https://images.unsplash.com/${id}?w=1200&q=70&auto=format&fit=crop`;

export const IMG = {
  cookie1: U("photo-1499636136210-6f4ee915583e"),
  cookie2: U("photo-1558961363-fa8fdf82db35"),
  cookie3: U("photo-1590080875515-8a3a8dc5735e"),
  cake1: U("photo-1578985545062-69928b1d9587"),
  cake2: U("photo-1565958011703-44f9829ba187"),
  cake3: U("photo-1535141192574-5d4897c12636"),
  pastry1: U("photo-1555507036-ab1f4038808a"),
  pastry2: U("photo-1509440159596-0249088772ff"),
  brownie: U("photo-1606313564200-e75d5e30476c"),
  roll: U("photo-1509365465985-25d11c17e812"),
  coffee1: U("photo-1509042239860-f550ce710b93"),
  coffee2: U("photo-1495474472287-4d71bcdd2085"),
  coffee3: U("photo-1461023058943-07fcbe16d735"),
  coffee4: U("photo-1517701604599-bb29b565090c"),
  drink1: U("photo-1621263764928-df1444c5e859"),
  drink2: U("photo-1556679343-c7306c1976bc"),
  drink3: U("photo-1505252585461-04db1eb84625"),
};

export type CategoryId = "cookies" | "cakes" | "pastries" | "rolls" | "coffee" | "refreshments";
export type Filter = CategoryId | "all";

export interface Category {
  id: CategoryId;
  name: string;
  emoji: string;
  img: string;
  blurb: string;
}

export const CATS: Category[] = [
  { id: "cookies", name: "Cookies", emoji: "🍪", img: IMG.cookie1, blurb: "Chewy, gooey, brown butter" },
  { id: "cakes", name: "Cakes", emoji: "🎂", img: IMG.cake1, blurb: "Slices & whole cakes" },
  { id: "pastries", name: "Pastries", emoji: "🥐", img: IMG.pastry1, blurb: "Laminated daily" },
  { id: "rolls", name: "Cinnamon Rolls", emoji: "🌀", img: IMG.roll, blurb: "9 signature swirls" },
  { id: "coffee", name: "Coffee", emoji: "☕", img: IMG.coffee1, blurb: "Espresso bar & cold brew" },
  { id: "refreshments", name: "Refreshments", emoji: "🍋", img: IMG.drink2, blurb: "Teas, lemonades, smoothies" },
];

/** A choice either adds `p`, multiplies the base price by `mult`, or sets a `fixed` price. */
export interface OptionChoice {
  l: string;
  p?: number;
  mult?: number;
  fixed?: number;
}
export interface OptionGroup {
  name: string;
  choices: OptionChoice[];
}
export type OptionPreset = "cookie" | "cake" | "drink" | "cold" | "roll" | "none";

export const OPT: Record<OptionPreset, OptionGroup[]> = {
  cookie: [{ name: "Quantity", choices: [{ l: "Single", mult: 1 }, { l: "Half dozen", mult: 5.5 }, { l: "Dozen", mult: 10 }] }],
  cake: [{ name: "Size", choices: [{ l: "Slice", p: 0 }, { l: '6" Whole cake', p: 36 }, { l: '9" Whole cake', p: 58 }] }],
  drink: [
    { name: "Size", choices: [{ l: "12 oz", p: 0 }, { l: "16 oz", p: 0.75 }, { l: "20 oz", p: 1.25 }] },
    { name: "Milk", choices: [{ l: "Whole", p: 0 }, { l: "Oat", p: 0.75 }, { l: "Almond", p: 0.75 }, { l: "None", p: 0 }] },
    { name: "Temp", choices: [{ l: "Hot", p: 0 }, { l: "Iced", p: 0 }] },
  ],
  cold: [{ name: "Size", choices: [{ l: "16 oz", p: 0 }, { l: "24 oz", p: 1.5 }] }],
  roll: [{ name: "Quantity", choices: [{ l: "Single", mult: 1 }, { l: "4-pack", mult: 3.6 }, { l: "Party of 9 (one of each)", fixed: 48 }] }],
  none: [],
};

export type Tag = "Bestseller" | "New" | "Hot";

export interface Product {
  id: string;
  cat: CategoryId;
  name: string;
  desc: string;
  price: number;
  img: string;
  opt: OptionPreset;
  tag?: Tag;
  /** Eligible for the Build-a-Box picker. */
  box?: boolean;
  /** Shown in the coffee section's signature drinks. */
  signature?: boolean;
  /** Swirl Collection colour + emoji. */
  hue?: string;
  emoji?: string;
  /** CMS-driven: hide the add button and show a "Sold out" badge. */
  soldOut?: boolean;
  /** CMS-driven: days of week the item is baked (0 = Sunday). Omit for every day. */
  availableDays?: number[];
}

export const PRODUCTS: Product[] = [
  // Cookies
  { id: "c1", cat: "cookies", name: "Brown Butter Chocolate Chunk", desc: "Our signature: crisp edges, molten middle, flaky salt.", price: 4.25, img: IMG.cookie1, tag: "Bestseller", opt: "cookie", box: true },
  { id: "c2", cat: "cookies", name: "Double Dark Sea Salt", desc: "70% cacao dough with dark chocolate puddles.", price: 4.5, img: IMG.cookie3, opt: "cookie", box: true },
  { id: "c3", cat: "cookies", name: "Almond Butter Shortbread", desc: "Melt-in-your-mouth, lightly toasted almond.", price: 3.75, img: IMG.cookie2, opt: "cookie", box: true },
  { id: "c4", cat: "cookies", name: "Oatmeal Cranberry", desc: "Chewy oats, tart cranberries, white chocolate.", price: 3.75, img: IMG.cookie2, opt: "cookie", box: true },
  { id: "c5", cat: "cookies", name: "Red Velvet Crinkle", desc: "Powdered-sugar crackle with a cream cheese heart.", price: 4.25, img: IMG.cookie3, tag: "New", opt: "cookie", box: true },
  { id: "c6", cat: "cookies", name: "Pistachio Rose", desc: "Roasted pistachio, rose sugar, a little fancy.", price: 4.75, img: IMG.cookie1, opt: "cookie", box: true },
  // Cakes
  { id: "k1", cat: "cakes", name: "Belgian Chocolate Cake", desc: "Three layers, ganache drip, chocolate curls.", price: 6.5, img: IMG.cake1, tag: "Bestseller", opt: "cake" },
  { id: "k2", cat: "cakes", name: "Salted Caramel Cake", desc: "Brown sugar sponge, house caramel, toasted pecans.", price: 6.5, img: IMG.cake3, opt: "cake" },
  { id: "k3", cat: "cakes", name: "Classic Red Velvet", desc: "Buttermilk red velvet with cream cheese frosting.", price: 6.25, img: IMG.cake2, opt: "cake" },
  { id: "k4", cat: "cakes", name: "Vanilla Berry Bliss", desc: "Vanilla bean sponge, fresh berries, whipped cream.", price: 6.0, img: IMG.cake2, opt: "cake" },
  // Pastries
  { id: "p1", cat: "pastries", name: "Butter Croissant", desc: "72-hour laminated dough. 27 flaky layers.", price: 3.95, img: IMG.pastry1, opt: "none" },
  { id: "p2", cat: "pastries", name: "Pain au Chocolat", desc: "Two batons of dark chocolate in buttery pastry.", price: 4.5, img: IMG.pastry1, tag: "Bestseller", opt: "none" },
  { id: "p3", cat: "pastries", name: "Almond Croissant", desc: "Twice-baked with frangipane and sliced almonds.", price: 4.95, img: IMG.pastry2, opt: "none" },
  { id: "p4", cat: "pastries", name: "Strawberry Cream Danish", desc: "Vanilla custard, fresh strawberries, glaze.", price: 5.25, img: IMG.pastry1, tag: "New", opt: "none" },
  { id: "p5", cat: "pastries", name: "Fudgy Walnut Brownie", desc: "Dense, crackly top, toasted walnuts.", price: 4.25, img: IMG.brownie, opt: "none" },
  // Cinnamon rolls (Swirl Collection)
  { id: "r1", cat: "rolls", name: "Classic Cinnamon", desc: "The original. Brown sugar swirl and vanilla glaze.", price: 5.25, img: IMG.roll, tag: "Bestseller", opt: "roll", hue: "#d9a66b", emoji: "🌀" },
  { id: "r2", cat: "rolls", name: "Chocolate Hazelnut", desc: "Hazelnut spread, chocolate drizzle, toasted hazelnuts.", price: 5.95, img: IMG.roll, opt: "roll", hue: "#6b3f26", emoji: "🌰" },
  { id: "r3", cat: "rolls", name: "Cookie Butter", desc: "Spiced cookie butter filling and crushed spice cookies.", price: 5.95, img: IMG.roll, tag: "Hot", opt: "roll", hue: "#b97a45", emoji: "🍪" },
  { id: "r4", cat: "rolls", name: "Caramel Pecan", desc: "Sticky caramel, candied pecans, sea salt.", price: 5.95, img: IMG.roll, opt: "roll", hue: "#a35d22", emoji: "🥜" },
  { id: "r5", cat: "rolls", name: "S'mores", desc: "Graham crumble, chocolate, toasted marshmallow.", price: 6.25, img: IMG.roll, opt: "roll", hue: "#5a3a2a", emoji: "🔥" },
  { id: "r6", cat: "rolls", name: "Blueberry Cheesecake", desc: "Blueberry compote, cheesecake frosting.", price: 6.25, img: IMG.roll, opt: "roll", hue: "#4b3a78", emoji: "🫐" },
  { id: "r7", cat: "rolls", name: "Matcha White Chocolate", desc: "Ceremonial matcha glaze, white chocolate pearls.", price: 6.25, img: IMG.roll, tag: "New", opt: "roll", hue: "#7f9a4a", emoji: "🍵" },
  { id: "r8", cat: "rolls", name: "Red Velvet", desc: "Cocoa-red dough, cream cheese icing, velvet crumbs.", price: 5.95, img: IMG.roll, opt: "roll", hue: "#9b2335", emoji: "❤️" },
  { id: "r9", cat: "rolls", name: "Rose Pistachio", desc: "Rose water glaze, pistachios, dried petals.", price: 6.25, img: IMG.roll, opt: "roll", hue: "#c77d8e", emoji: "🌹" },
  // Coffee
  { id: "d1", cat: "coffee", name: "Caramel Latte", desc: "Rich espresso, steamed milk, house caramel.", price: 4.95, img: IMG.coffee3, tag: "Bestseller", opt: "drink", signature: true },
  { id: "d2", cat: "coffee", name: "Cappuccino", desc: "Bold espresso with velvety milk foam.", price: 4.25, img: IMG.coffee1, opt: "drink", signature: true },
  { id: "d3", cat: "coffee", name: "Cold Brew", desc: "Steeped 18 hours. Smooth, chocolatey, strong.", price: 4.5, img: IMG.coffee4, opt: "cold", signature: true },
  { id: "d4", cat: "coffee", name: "Honey Oat Latte", desc: "Local honey, oat milk, a dash of cinnamon.", price: 5.25, img: IMG.coffee1, tag: "New", opt: "drink" },
  { id: "d5", cat: "coffee", name: "Mocha", desc: "Espresso, dark chocolate, whipped cream.", price: 5.25, img: IMG.coffee3, opt: "drink" },
  { id: "d6", cat: "coffee", name: "Espresso", desc: "Double shot of our seasonal single origin.", price: 3.0, img: IMG.coffee2, opt: "none" },
  // Refreshments
  { id: "f1", cat: "refreshments", name: "Iced Matcha Latte", desc: "Ceremonial-grade matcha over milk and ice.", price: 5.25, img: IMG.drink1, opt: "drink" },
  { id: "f2", cat: "refreshments", name: "Strawberry Lemonade", desc: "Fresh-squeezed lemons, muddled strawberries.", price: 4.5, img: IMG.drink2, tag: "Hot", opt: "cold" },
  { id: "f3", cat: "refreshments", name: "Iced Peach Tea", desc: "Black tea brewed daily with peach purée.", price: 3.95, img: IMG.drink2, opt: "cold" },
  { id: "f4", cat: "refreshments", name: "Mango Smoothie", desc: "Mango, banana, yogurt, a squeeze of lime.", price: 5.95, img: IMG.drink3, opt: "cold" },
  { id: "f5", cat: "refreshments", name: "Classic Hot Chocolate", desc: "Melted dark chocolate and whole milk.", price: 4.25, img: IMG.coffee3, opt: "none" },
  { id: "f6", cat: "refreshments", name: "Sparkling Water", desc: "Chilled, with a slice of citrus.", price: 2.5, img: IMG.drink3, opt: "none" },
];

// PLACEHOLDER reviews for layout only. Replace with real ones (ideally pulled
// from Google Business Profile) before launch.
export const REVIEWS = [
  { s: 5, t: "The brown butter cookie is the best I have ever had. Crispy edge, gooey center, perfect.", n: "Sample Review" },
  { s: 5, t: "Cookie Butter cinnamon roll + oat latte is my Saturday ritual now.", n: "Sample Review" },
  { s: 5, t: "Ordered a custom cake for my mom's birthday. Gorgeous and delicious.", n: "Sample Review" },
  { s: 4, t: "Cozy spot to work. Cold brew is smooth and strong. Croissants sell out fast!", n: "Sample Review" },
  { s: 5, t: "The gift box made my whole office happy. Beautiful packaging.", n: "Sample Review" },
];

/** Index 0 = Sunday. Hours are 24h, in BUSINESS.timeZone. */
export const HOURS = [
  { d: "Sunday", o: 8, c: 15 },
  { d: "Monday", o: 7, c: 18 },
  { d: "Tuesday", o: 7, c: 18 },
  { d: "Wednesday", o: 7, c: 18 },
  { d: "Thursday", o: 7, c: 20 },
  { d: "Friday", o: 7, c: 20 },
  { d: "Saturday", o: 7, c: 20 },
];

/** Hours (24h) when fresh batches come out of the oven. */
export const BATCH_TIMES = [7, 11, 15];

export const SLIDES = [
  { e: "Fresh from the oven", t: ["Baked slow.", "Brewed", "bold."], p: "Golden-edged cookies, soft-centered cinnamon rolls, and coffee pulled by people who care. Order ahead and skip the line.", img: IMG.cookie1, emoji: "🍪" },
  { e: "The Swirl Collection", t: ["Nine rolls.", "Zero", "regrets."], p: "From Classic Cinnamon to Rose Pistachio. Rolled by hand every morning, glazed while warm.", img: IMG.roll, emoji: "🌀" },
  { e: "Espresso bar", t: ["Good coffee,", "better", "days."], p: "Single-origin espresso, 18-hour cold brew, and house-made syrups. Pair with a pastry and save $1.", img: IMG.coffee1, emoji: "☕" },
];

export const BOX_PRICE: Record<6 | 12, number> = { 6: 21, 12: 38 };
export const FREE_DELIVERY = 35;
export const DELIVERY_FEE = 4.99;
export const TAX = 0.07;
