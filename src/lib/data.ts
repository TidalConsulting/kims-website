/* =========================================================
   SITE DATA — edit products, hours and business info here.
   Later: move PRODUCTS / CATS / OPT / HOURS into a CMS (Sanity)
   or a Supabase table so the owner can edit without code.
   ========================================================= */

// Brand: Coffee Crumble (logo: docs/brand/Coffee_Crumble_Logo.pdf).
export const BUSINESS = {
  name: "Coffee Crumble",
  slogan: "baked slow · brewed bold",
  taglineShort: "bakery & café",
  tagline: "Bakery · Café",
  description:
    "Small-batch cookies, cakes, pastries, cinnamon rolls, and specialty coffee. Order for pickup or delivery.",
  email: "coffeecrumble@gmail.com",
  /** Shown on the site. Metro Manila landline, so callers on mobile need the (02). */
  phone: "(02) 8888-0000",
  /** For tap-to-call links and search engines. */
  phoneIntl: "+63 2 8888 0000",
  street: "Ayala Triangle Gardens, Paseo de Roxas cor. Makati Ave.",
  city: "Makati City",
  region: "Metro Manila",
  postalCode: "1226",
  country: "PH",
  /** Ayala Triangle Gardens, for search engines and the map. */
  geo: { lat: 14.5567, lng: 121.0244 },
  // Used to compute "Open now" in the shop's local time, not the visitor's.
  timeZone: "Asia/Manila",
  priceRange: "₱₱",
  foundedYear: 2026,
  /** Full profile URLs. The footer only shows the ones filled in. */
  socials: {
    instagram: "",
    facebook: "",
    tiktok: "",
  },
};

/** One-line address, e.g. for the map link. */
export const ADDRESS = `${BUSINESS.street}, ${BUSINESS.city} ${BUSINESS.postalCode}, ${BUSINESS.region}`;
/** tel: link for the shop phone. */
export const TEL = `tel:${BUSINESS.phoneIntl.replace(/[^\d+]/g, "")}`;

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
  { id: "cookies", name: "Cookies", emoji: "🍪", img: IMG.cookie1, blurb: "8 stuffed cookies" },
  { id: "cakes", name: "Cakes", emoji: "🎂", img: IMG.cake1, blurb: "12 flavors · slice or whole" },
  { id: "pastries", name: "Pastries", emoji: "🥐", img: IMG.pastry1, blurb: "14 baked every morning" },
  { id: "rolls", name: "Cinnamon Rolls", emoji: "🌀", img: IMG.roll, blurb: "9 signature swirls" },
  { id: "coffee", name: "Coffee", emoji: "☕", img: IMG.coffee1, blurb: "10 iced, shaken & hot" },
  { id: "refreshments", name: "Iced Teas", emoji: "🍹", img: IMG.drink2, blurb: "12 fresh-brewed blends" },
];

/**
 * A choice either adds `p`, multiplies the base price by `mult`, or sets a `fixed` price.
 * `n` is how many of the item it uses (a dozen is 12), for the "Only N left" stock limit.
 */
export interface OptionChoice {
  l: string;
  p?: number;
  mult?: number;
  fixed?: number;
  n?: number;
}
export interface OptionGroup {
  name: string;
  choices: OptionChoice[];
}
export type OptionPreset = "cookie" | "cake" | "drink" | "cold" | "iced" | "hot" | "tea" | "roll" | "none";

export const OPT: Record<OptionPreset, OptionGroup[]> = {
  cookie: [{ name: "Quantity", choices: [{ l: "Single", mult: 1 }, { l: "Half dozen", mult: 5.5, n: 6 }, { l: "Dozen", mult: 10, n: 12 }] }], // keep in line with BULK_RATE
  cake: [{ name: "Size", choices: [{ l: "Slice", p: 0 }, { l: '6" Whole cake', p: 1100 }, { l: '9" Whole cake', p: 1800 }] }],
  drink: [
    { name: "Size", choices: [{ l: "12 oz", p: 0 }, { l: "16 oz", p: 20 }, { l: "20 oz", p: 40 }] },
    { name: "Milk", choices: [{ l: "Whole", p: 0 }, { l: "Oat", p: 40 }, { l: "Almond", p: 40 }, { l: "None", p: 0 }] },
    { name: "Temp", choices: [{ l: "Hot", p: 0 }, { l: "Iced", p: 0 }] },
  ],
  cold: [{ name: "Size", choices: [{ l: "16 oz", p: 0 }, { l: "24 oz", p: 40 }] }],
  iced: [
    { name: "Size", choices: [{ l: "16 oz", p: 0 }, { l: "24 oz", p: 40 }] },
    { name: "Milk", choices: [{ l: "Whole", p: 0 }, { l: "Oat", p: 40 }, { l: "Almond", p: 40 }] },
  ],
  hot: [
    { name: "Size", choices: [{ l: "12 oz", p: 0 }, { l: "16 oz", p: 20 }] },
    { name: "Milk", choices: [{ l: "Whole", p: 0 }, { l: "Oat", p: 40 }, { l: "Almond", p: 40 }] },
  ],
  tea: [
    { name: "Size", choices: [{ l: "16 oz", p: 0 }, { l: "24 oz", p: 30 }] },
    { name: "Sweetness", choices: [{ l: "Regular", p: 0 }, { l: "Less sweet", p: 0 }, { l: "No honey", p: 0 }] },
  ],
  roll: [{ name: "Quantity", choices: [{ l: "Single", mult: 1 }, { l: "4-pack", mult: 3.6, n: 4 }, { l: "Party of 9 (one of each)", fixed: 1450 }] }],
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
  /** Swirl Collection emoji, also the image fallback. */
  emoji?: string;
  /** Accent colour for the product's name in the quick view. */
  hue?: string;
  /** Cookies: what's inside. */
  filling?: string;
  /** Ingredients (drinks, "What's in it") or tasting notes (cakes, pastries). */
  notes?: string[];
  /** CMS-driven: permanently unavailable (for day-to-day sell-outs use TODAY). */
  soldOut?: boolean;
  /** CMS-driven: days of week the item is baked (0 = Sunday). Omit for every day. */
  availableDays?: number[];
}

export const PRODUCTS: Product[] = [
  // Cookies: every one is stuffed. Photos are public/images/cookie-<name>.jpg plus cookie-<name>-inside.jpg
  // (AI flat-lays for now; swap in real photos of the actual cookies before launch).
  { id: "c1", cat: "cookies", name: "Classic Chocolate Chip", desc: "Golden edges, gooey center, dark chocolate puddles and flaky salt.", price: 110, img: IMG.cookie1, tag: "Bestseller", opt: "cookie", box: true, hue: "#8A5A2B", filling: "Molten dark chocolate & white chocolate cream" },
  { id: "c2", cat: "cookies", name: "Double Chocolate", desc: "Cocoa dough loaded with dark chocolate chunks and sea salt.", price: 125, img: IMG.cookie3, opt: "cookie", box: true, hue: "#3B2016", filling: "Fudgy molten dark chocolate" },
  { id: "c3", cat: "cookies", name: "Spiced Cookie Butter", desc: "Cookie butter center, crushed spice biscuits, white chocolate drizzle.", price: 135, img: IMG.cookie2, tag: "Hot", opt: "cookie", box: true, hue: "#D9541E", filling: "Gooey spiced cookie butter" },
  { id: "c4", cat: "cookies", name: "Cookies & Cream", desc: "Vanilla dough with chocolate wafer crumbs and melty white chocolate.", price: 130, img: IMG.cookie2, opt: "cookie", box: true, hue: "#2B1340", filling: "White chocolate sweet cream" },
  { id: "c5", cat: "cookies", name: "Chocolate Hazelnut", desc: "Toasted hazelnuts and a gooey chocolate-hazelnut swirl.", price: 140, img: IMG.cookie1, opt: "cookie", box: true, hue: "#7A4A26", filling: "Chocolate-hazelnut praline" },
  { id: "c6", cat: "cookies", name: "Caramel Pecan", desc: "Salted caramel pools, toasted pecans, dark chocolate chunks.", price: 140, img: IMG.cookie1, opt: "cookie", box: true, hue: "#B8681D", filling: "Salted caramel" },
  { id: "c7", cat: "cookies", name: "Pistachio Raspberry", desc: "Pistachio dough, pistachio cream, fresh raspberries.", price: 150, img: IMG.cookie3, tag: "New", opt: "cookie", box: true, hue: "#5E7F22", filling: "Silky pistachio cream" },
  { id: "c8", cat: "cookies", name: "Red Velvet White Chocolate", desc: "Crimson cocoa dough with big white chocolate chunks.", price: 125, img: IMG.cookie3, opt: "cookie", box: true, hue: "#C8283E", filling: "Cream cheese filling" },
  // Cakes: whole cake photo + slice photo (cake-<name>.jpg and cake-<name>-inside.jpg)
  { id: "k1", cat: "cakes", name: "Chocolate Salted Caramel", desc: "Dark chocolate layers, salted caramel filling, caramel drip.", price: 240, img: IMG.cake1, tag: "Bestseller", opt: "cake", hue: "#6B3A1E", notes: ["Rich", "Sweet", "Indulgent"] },
  { id: "k2", cat: "cakes", name: "Vanilla Strawberry", desc: "Vanilla sponge, whipped cream and fresh strawberries.", price: 220, img: IMG.cake1, opt: "cake", hue: "#D63A5A", notes: ["Soft", "Fruity", "Classic"] },
  { id: "k3", cat: "cakes", name: "Lemon Blueberry", desc: "Lemon sponge, blueberry jam, lemon cream cheese frosting.", price: 220, img: IMG.cake1, opt: "cake", hue: "#4B4FB8", notes: ["Fresh", "Bright", "Fruity"] },
  { id: "k4", cat: "cakes", name: "Chocolate Raspberry", desc: "Dark chocolate sponge, raspberry jam, glossy ganache.", price: 240, img: IMG.cake1, opt: "cake", hue: "#B0243F", notes: ["Decadent", "Tart", "Elegant"] },
  { id: "k5", cat: "cakes", name: "Pistachio Rose", desc: "Pistachio sponge, pistachio cream, rose petals.", price: 250, img: IMG.cake1, tag: "New", opt: "cake", hue: "#5E7F22", notes: ["Floral", "Nutty", "Delicate"] },
  { id: "k6", cat: "cakes", name: "Coconut Mango", desc: "Coconut sponge, mango curd, toasted coconut.", price: 230, img: IMG.cake1, opt: "cake", hue: "#E08A00", notes: ["Tropical", "Light", "Juicy"] },
  { id: "k7", cat: "cakes", name: "Coffee Hazelnut", desc: "Coffee-soaked layers, hazelnut praline, mocha buttercream.", price: 240, img: IMG.cake1, opt: "cake", hue: "#7A4A26", notes: ["Bold", "Nutty", "Creamy"] },
  { id: "k8", cat: "cakes", name: "Apple Cinnamon", desc: "Spiced sponge with baked cinnamon apples.", price: 210, img: IMG.cake1, opt: "cake", hue: "#B8681D", notes: ["Warm", "Cozy", "Spiced"] },
  { id: "k9", cat: "cakes", name: "Pumpkin Cream Cheese", desc: "Pumpkin spice layers with cream cheese frosting.", price: 220, img: IMG.cake1, opt: "cake", hue: "#C4641B", notes: ["Fall", "Creamy", "Spiced"] },
  { id: "k10", cat: "cakes", name: "Red Velvet White Chocolate", desc: "Red velvet layers, cream cheese, white chocolate.", price: 230, img: IMG.cake1, opt: "cake", hue: "#C8283E", notes: ["Velvety", "Sweet", "Luxe"] },
  { id: "k11", cat: "cakes", name: "Orange Dark Chocolate", desc: "Dark chocolate sponge, orange marmalade, candied orange.", price: 240, img: IMG.cake1, opt: "cake", hue: "#D9541E", notes: ["Citrusy", "Rich", "Bold"] },
  { id: "k12", cat: "cakes", name: "Pear Almond", desc: "Almond sponge, vanilla cream and poached pears.", price: 230, img: IMG.cake1, opt: "cake", hue: "#8A7A2B", notes: ["Subtle", "Nutty", "Refined"] },
  // Pastries
  { id: "p1", cat: "pastries", name: "Almond Croissant", desc: "Twice-baked with frangipane and toasted sliced almonds.", price: 175, img: IMG.pastry1, opt: "none", hue: "#B8681D", notes: ["Flaky", "Nutty", "Buttery"] },
  { id: "p2", cat: "pastries", name: "Mixed Berry Danish", desc: "Vanilla custard topped with fresh mixed berries.", price: 165, img: IMG.pastry1, opt: "none", hue: "#C8283E", notes: ["Fruity", "Creamy", "Flaky"] },
  { id: "p3", cat: "pastries", name: "Pain au Chocolat", desc: "Two batons of dark chocolate in buttery pastry.", price: 155, img: IMG.pastry1, tag: "Bestseller", opt: "none", hue: "#6B3A1E", notes: ["Buttery", "Chocolatey", "Classic"] },
  { id: "p4", cat: "pastries", name: "Lemon Tart", desc: "Zesty lemon curd under toasted meringue.", price: 160, img: IMG.pastry1, opt: "none", hue: "#C49A00", notes: ["Zesty", "Tangy", "Light"] },
  { id: "p5", cat: "pastries", name: "Chocolate Éclair", desc: "Choux pastry, vanilla cream, chocolate glaze and hazelnuts.", price: 150, img: IMG.pastry1, opt: "none", hue: "#3B2016", notes: ["Creamy", "Chocolatey", "Crisp"] },
  { id: "p6", cat: "pastries", name: "Classic Croissant", desc: "72-hour laminated dough. Shatteringly flaky.", price: 135, img: IMG.pastry1, opt: "none", hue: "#B8681D", notes: ["Buttery", "Flaky", "Golden"] },
  { id: "p7", cat: "pastries", name: "Strawberry Tart", desc: "Vanilla pastry cream and glazed fresh strawberries.", price: 175, img: IMG.pastry1, tag: "New", opt: "none", hue: "#D63A5A", notes: ["Fresh", "Sweet", "Creamy"] },
  { id: "p8", cat: "pastries", name: "Blueberry Muffin", desc: "Bursting with blueberries under a crunchy crumb top.", price: 120, img: IMG.pastry1, opt: "none", hue: "#4B4FB8", notes: ["Soft", "Fruity", "Crumbly"] },
  { id: "p9", cat: "pastries", name: "Palmier", desc: "Caramelized puff pastry hearts.", price: 95, img: IMG.pastry1, opt: "none", hue: "#C4641B", notes: ["Crispy", "Caramelized", "Light"] },
  { id: "p10", cat: "pastries", name: "Raspberry Danish", desc: "Cream cheese center with fresh raspberries.", price: 165, img: IMG.pastry1, opt: "none", hue: "#B0243F", notes: ["Tart", "Creamy", "Flaky"] },
  { id: "p11", cat: "pastries", name: "Chocolate Brownie", desc: "Fudgy, crackly top, chocolate drizzle.", price: 125, img: IMG.pastry1, opt: "none", hue: "#3B2016", notes: ["Fudgy", "Rich", "Chewy"] },
  { id: "p12", cat: "pastries", name: "Custard Danish", desc: "Vanilla custard swirl with crushed pistachios.", price: 150, img: IMG.pastry1, opt: "none", hue: "#C49A00", notes: ["Creamy", "Buttery", "Nutty"] },
  { id: "p13", cat: "pastries", name: "Mille-Feuille", desc: "Crisp puff pastry layers and vanilla cream.", price: 185, img: IMG.pastry1, opt: "none", hue: "#8A7A2B", notes: ["Layered", "Creamy", "Crisp"] },
  { id: "p14", cat: "pastries", name: "Chocolate Tart", desc: "Silky dark chocolate ganache with pistachios.", price: 170, img: IMG.pastry1, opt: "none", hue: "#6B3A1E", notes: ["Silky", "Rich", "Nutty"] },
  // Cinnamon rolls (Swirl Collection)
  { id: "r1", cat: "rolls", name: "Classic Cinnamon", desc: "The original. Brown sugar swirl and vanilla glaze.", price: 165, img: IMG.roll, tag: "Bestseller", opt: "roll", emoji: "🌀" },
  { id: "r2", cat: "rolls", name: "Chocolate Hazelnut", desc: "Hazelnut spread, chocolate drizzle, toasted hazelnuts.", price: 185, img: IMG.roll, opt: "roll", emoji: "🌰" },
  { id: "r3", cat: "rolls", name: "Cookie Butter", desc: "Spiced cookie butter filling and crushed spice cookies.", price: 185, img: IMG.roll, tag: "Hot", opt: "roll", emoji: "🍪" },
  { id: "r4", cat: "rolls", name: "Caramel Pecan", desc: "Sticky caramel, candied pecans, sea salt.", price: 185, img: IMG.roll, opt: "roll", emoji: "🥜" },
  { id: "r5", cat: "rolls", name: "S'mores", desc: "Graham crumble, chocolate, toasted marshmallow.", price: 195, img: IMG.roll, opt: "roll", emoji: "🔥" },
  { id: "r6", cat: "rolls", name: "Blueberry Cheesecake", desc: "Blueberry compote, cheesecake frosting.", price: 195, img: IMG.roll, opt: "roll", emoji: "🫐" },
  { id: "r7", cat: "rolls", name: "Matcha White Chocolate", desc: "Ceremonial matcha glaze, white chocolate pearls.", price: 195, img: IMG.roll, tag: "New", opt: "roll", emoji: "🍵" },
  { id: "r8", cat: "rolls", name: "Red Velvet", desc: "Cocoa-red dough, cream cheese icing, velvet crumbs.", price: 185, img: IMG.roll, opt: "roll", emoji: "❤️" },
  { id: "r9", cat: "rolls", name: "Rose Pistachio", desc: "Rose water glaze, pistachios, dried petals.", price: 195, img: IMG.roll, opt: "roll", emoji: "🌹" },
  // Coffee: notes are the ingredients, shown as "What's in it"
  { id: "d1", cat: "coffee", name: "Vanilla Iced Coffee", desc: "Chilled coffee, milk and vanilla over ice.", price: 165, img: IMG.coffee1, opt: "iced", hue: "#6B3A1E", notes: ["Coffee", "Milk", "Vanilla syrup", "Ice"] },
  { id: "d2", cat: "coffee", name: "Dalgona Coffee", desc: "Whipped coffee cloud over cold milk.", price: 175, img: IMG.coffee1, opt: "iced", hue: "#B8681D", notes: ["Whipped coffee", "Sugar", "Cold milk"] },
  { id: "d3", cat: "coffee", name: "Honey Cinnamon Latte", desc: "Espresso, steamed milk, honey and cinnamon.", price: 185, img: IMG.coffee1, tag: "New", opt: "hot", hue: "#C4641B", notes: ["Espresso", "Milk", "Honey", "Cinnamon"] },
  { id: "d4", cat: "coffee", name: "Mocha Iced Coffee", desc: "Chocolate coffee, whipped cream, chocolate drizzle.", price: 190, img: IMG.coffee1, opt: "iced", hue: "#3B2016", notes: ["Coffee", "Milk", "Cocoa", "Whipped cream"] },
  { id: "d5", cat: "coffee", name: "Caramel Iced Coffee", desc: "Caramel coffee, whipped cream, caramel drizzle.", price: 185, img: IMG.coffee1, tag: "Bestseller", opt: "iced", signature: true, hue: "#B8681D", notes: ["Coffee", "Milk", "Caramel sauce", "Ice"] },
  { id: "d6", cat: "coffee", name: "Affogato", desc: "Vanilla ice cream drowned in hot espresso.", price: 195, img: IMG.coffee1, opt: "none", hue: "#6B3A1E", notes: ["Vanilla ice cream", "Hot espresso"] },
  { id: "d7", cat: "coffee", name: "Coconut Iced Coffee", desc: "Coffee over coconut milk and toasted coconut.", price: 180, img: IMG.coffee1, opt: "cold", hue: "#7A4A26", notes: ["Coffee", "Coconut milk", "Syrup", "Ice"] },
  { id: "d8", cat: "coffee", name: "Brown Sugar Shaken Coffee", desc: "Espresso shaken with brown sugar, splash of milk.", price: 190, img: IMG.coffee1, tag: "Hot", opt: "iced", signature: true, hue: "#8A5A2B", notes: ["Espresso", "Brown sugar", "Milk", "Ice"] },
  { id: "d9", cat: "coffee", name: "Coffee Smoothie", desc: "Coffee blended with banana, milk and honey.", price: 195, img: IMG.coffee1, opt: "cold", hue: "#B8681D", notes: ["Coffee", "Frozen banana", "Milk", "Honey"] },
  { id: "d10", cat: "coffee", name: "Strawberry Iced Latte", desc: "Strawberry milk layered with espresso.", price: 195, img: IMG.coffee1, opt: "iced", signature: true, hue: "#D63A5A", notes: ["Strawberry milk", "Milk", "Espresso", "Ice"] },
  // Iced teas (the category id stays "refreshments")
  { id: "f1", cat: "refreshments", name: "Lemon Detox Tea", desc: "Black tea, lemon, ginger and honey.", price: 140, img: IMG.drink2, opt: "tea", hue: "#C49A00", notes: ["Black tea", "Lemon", "Ginger", "Honey"] },
  { id: "f2", cat: "refreshments", name: "Peach Refresh", desc: "Black tea with fresh peaches and lemon.", price: 150, img: IMG.drink2, tag: "Bestseller", opt: "tea", hue: "#E0662A", notes: ["Black tea", "Peach", "Lemon", "Honey"] },
  { id: "f3", cat: "refreshments", name: "Cucumber Mint Tea", desc: "Green tea, cucumber, mint and lemon.", price: 140, img: IMG.drink2, opt: "tea", hue: "#3F8A3A", notes: ["Green tea", "Cucumber", "Mint", "Lemon"] },
  { id: "f4", cat: "refreshments", name: "Berry Antioxidant", desc: "Hibiscus tea with mixed berries.", price: 160, img: IMG.drink2, opt: "tea", hue: "#B0243F", notes: ["Hibiscus tea", "Mixed berries", "Lemon", "Honey"] },
  { id: "f5", cat: "refreshments", name: "Ginger Lemon Tea", desc: "Black tea, fresh ginger, lemon and honey.", price: 140, img: IMG.drink2, opt: "tea", hue: "#B8681D", notes: ["Black tea", "Ginger", "Lemon", "Honey"] },
  { id: "f6", cat: "refreshments", name: "Pineapple Green Tea", desc: "Green tea, pineapple and mint.", price: 150, img: IMG.drink2, tag: "New", opt: "tea", hue: "#8A9A00", notes: ["Green tea", "Pineapple", "Mint", "Honey"] },
  { id: "f7", cat: "refreshments", name: "Turmeric Ginger Tea", desc: "Green tea, turmeric, ginger and lemon.", price: 150, img: IMG.drink2, opt: "tea", hue: "#D98A00", notes: ["Green tea", "Turmeric", "Ginger", "Lemon"] },
  { id: "f8", cat: "refreshments", name: "Orange Cinnamon Tea", desc: "Black tea, orange and cinnamon.", price: 145, img: IMG.drink2, opt: "tea", hue: "#E0662A", notes: ["Black tea", "Orange", "Cinnamon", "Honey"] },
  { id: "f9", cat: "refreshments", name: "Mint Lemon Tea", desc: "Green tea, fresh mint and lemon.", price: 140, img: IMG.drink2, opt: "tea", hue: "#3F8A3A", notes: ["Green tea", "Mint", "Lemon", "Honey"] },
  { id: "f10", cat: "refreshments", name: "Apple Cinnamon Tea", desc: "Black tea, apple and cinnamon.", price: 145, img: IMG.drink2, opt: "tea", hue: "#C8283E", notes: ["Black tea", "Apple", "Cinnamon", "Honey"] },
  { id: "f11", cat: "refreshments", name: "Hibiscus Ginger Tea", desc: "Hibiscus tea, ginger and lemon.", price: 150, img: IMG.drink2, opt: "tea", hue: "#B0243F", notes: ["Hibiscus tea", "Ginger", "Lemon", "Honey"] },
  { id: "f12", cat: "refreshments", name: "Citrus Green Tea", desc: "Green tea, lemon and lime.", price: 140, img: IMG.drink2, opt: "tea", hue: "#8A9A00", notes: ["Green tea", "Lemon", "Lime", "Honey"] },
];

/* ---------------------------------------------------------
   TODAY'S AVAILABILITY: update each morning (later: from the CMS or POS).
   date:    the day this list is for (YYYY-MM-DD, shop time). On any other day
            it is ignored, so yesterday's sell-outs reset by themselves.
   soldOut: product ids that are gone for the day
   low:     product id -> how many are left (shows "Only N left")
   --------------------------------------------------------- */
export const TODAY = {
  date: "2026-10-29",
  soldOut: ["p3", "r9", "c6"],
  low: { c1: 4, p2: 3, r3: 5 } as Record<string, number>,
  restock: "tomorrow at 7am", // shown as "Back tomorrow at 7am"
};

// PLACEHOLDER reviews for layout only. Replace with real ones (ideally pulled
// from Google Business Profile) before launch, then set REVIEWS_ARE_SAMPLES to false.
// While true, the section is labelled as samples so nobody mistakes them for real customers.
export const REVIEWS_ARE_SAMPLES = true;
export const REVIEWS = [
  { s: 5, t: "The Classic Chocolate Chip is unreal. Crispy edge, and that molten white chocolate cream in the middle.", n: "Sample Review" },
  { s: 5, t: "Cookie Butter cinnamon roll + Brown Sugar Shaken Coffee is my Saturday ritual now.", n: "Sample Review" },
  { s: 5, t: "Ordered a 9\" Chocolate Salted Caramel cake for my mom's birthday. Gorgeous and delicious.", n: "Sample Review" },
  { s: 4, t: "Lovely spot in Ayala Triangle. The Peach Refresh is so good, and the croissants sell out fast!", n: "Sample Review" },
  { s: 5, t: "The Mix & Match cookie box made my whole office happy. Beautiful packaging.", n: "Sample Review" },
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

/** `file` is looked up in public/images first (see lib/photos.ts); `img` is the stock fallback. */
export const SLIDES = [
  { e: "Fresh from the oven", t: ["Baked slow.", "Brewed", "bold."], p: "Golden-edged cookies, soft-centered cinnamon rolls, and coffee pulled by people who care. Order ahead and skip the line.", file: "hero-cookie.jpg", img: IMG.cookie1, emoji: "🍪", video: true },
  { e: "The Swirl Collection", t: ["Nine rolls.", "Zero", "regrets."], p: "From Classic Cinnamon to Rose Pistachio. Rolled by hand every morning, glazed while warm.", file: "roll-cookie-butter.jpg", img: IMG.roll, emoji: "🌀" },
  { e: "Espresso bar", t: ["Good coffee,", "better", "days."], p: "Brown sugar shaken coffee, whipped dalgona and affogato, made with house syrups. Pair with a pastry and save ₱30.", file: "coffee-caramel-iced-coffee.jpg", img: IMG.coffee1, emoji: "☕" },
] as { e: string; t: string[]; p: string; file?: string; img: string; emoji: string; video?: boolean }[];

/** All prices are in this currency. */
export const CURRENCY = { code: "PHP", locale: "en-PH" };

/**
 * Bulk pricing: a half dozen costs 5.5 singles and a dozen costs 10, rounded to the nearest ₱5.
 * The same rate prices single-flavour orders and mixed Build-a-Box boxes, so they always agree.
 */
export const BULK_RATE: Record<6 | 12, number> = { 6: 5.5, 12: 10 };
export const ROUND_TO = 5;

/** "Pair any drink with a pastry and save ₱30": one discount per drink + pastry pair. */
export const PAIRING = {
  discount: 30,
  drinks: ["coffee", "refreshments"] as CategoryId[],
  pastries: ["pastries", "rolls"] as CategoryId[],
};

/** Delivery is limited to these areas, all within about 4 km of Ayala Triangle. */
export const DELIVERY_AREAS = [
  "Makati CBD (Ayala, Salcedo & Legazpi Village)",
  "Bel-Air & Poblacion",
  "San Lorenzo, Urdaneta & Dasmariñas Village",
  "Rockwell, Guadalupe & Pio del Pilar",
  "BGC, Taguig",
];
export const FREE_DELIVERY = 1000;
export const DELIVERY_FEE = 79;
/** Philippine VAT. Menu prices already include it, so it is shown but never added on top. */
export const VAT_RATE = 0.12;
