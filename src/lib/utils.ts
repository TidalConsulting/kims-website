import {
  BATCH_TIMES, BULK_RATE, BUSINESS, CATS, CURRENCY, DELIVERY_FEE, FREE_DELIVERY, HOURS, OPT, PAIRING, PRODUCTS, ROUND_TO, TODAY, VAT_RATE,
  type OptionChoice, type Product,
} from "./data";

const fmtWhole = new Intl.NumberFormat(CURRENCY.locale, { style: "currency", currency: CURRENCY.code, maximumFractionDigits: 0 });
const fmtCents = new Intl.NumberFormat(CURRENCY.locale, { style: "currency", currency: CURRENCY.code, minimumFractionDigits: 2 });

/** ₱95, ₱1,250, or ₱36.43 when there are centavos. */
export const money = (n: number) => (Number.isInteger(Math.round(n * 100) / 100) ? fmtWhole : fmtCents).format(n);

/** VAT portion of a VAT-inclusive amount. */
export const vatIncluded = (amount: number) => amount - amount / (1 + VAT_RATE);

export const byId = (id: string) => PRODUCTS.find((p) => p.id === id);

export const emojiFor = (p?: Product) => p?.emoji || CATS.find((c) => c.id === p?.cat)?.emoji || "🍪";

/** Bulk prices (half dozen, 4-pack, mixed boxes) round to the nearest ₱5; everything is whole pesos. */
const roundBulk = (n: number) => Math.round(n / ROUND_TO) * ROUND_TO;

export function calcPrice(p: Product, sel: number[]) {
  let price = p.price;
  OPT[p.opt].forEach((g, i) => {
    const c = g.choices[sel[i]];
    if (c.fixed) price = c.fixed;
    else if (c.mult && c.mult !== 1) price = roundBulk(price * c.mult);
    else price += c.p || 0;
  });
  return Math.round(price);
}

/** Mixed Build-a-Box price: the picked cookies at the same bulk rate as a single-flavour half dozen or dozen. */
export function boxPrice(ids: string[], size: 6 | 12) {
  const sum = ids.reduce((s, id) => s + (byId(id)?.price ?? 0), 0);
  return roundBulk((sum / size) * BULK_RATE[size]);
}

export function optLabel(p: Product, c: OptionChoice) {
  if (c.fixed) return money(c.fixed);
  if (c.mult && c.mult !== 1) return money(roundBulk(p.price * c.mult));
  if (c.p) return "+" + money(c.p);
  return "";
}

export type ShopNow = ReturnType<typeof shopNow>;

/** Is TODAY's sold-out / low-stock list for today? An old list is ignored, so it resets on its own. */
const todayListActive = (now: ShopNow) => TODAY.date === now.date;

/**
 * Sold out: flagged soldOut, listed in today's TODAY list, or not baked on this day of the week.
 * `now` is null during server rendering, where only the permanent soldOut flag applies.
 */
export function isSold(p: Product, now: ShopNow | null) {
  if (p.soldOut) return true;
  if (!now) return false;
  return (todayListActive(now) && TODAY.soldOut.includes(p.id)) || (!!p.availableDays && !p.availableDays.includes(now.day));
}

/** How many are left when stock is low ("Only N left"), otherwise undefined. */
export const lowStock = (p: Product, now: ShopNow | null) =>
  now && todayListActive(now) && !isSold(p, now) ? TODAY.low[p.id] : undefined;

type Line = { pid: string; price: number; qty: number };

/**
 * Cart totals. Prices include VAT, so nothing is added on top: the pairing discount comes off,
 * then delivery is added (free once the discounted subtotal reaches FREE_DELIVERY).
 */
export function cartTotals(lines: Line[], mode: "pickup" | "delivery" = "pickup") {
  const count = (cats: string[]) =>
    lines.reduce((n, l) => n + (cats.includes(byId(l.pid)?.cat ?? "") ? l.qty : 0), 0);
  const sub = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const pairs = Math.min(count(PAIRING.drinks), count(PAIRING.pastries));
  const discount = pairs * PAIRING.discount;
  const afterDiscount = sub - discount;
  const fee = mode === "delivery" && afterDiscount < FREE_DELIVERY ? DELIVERY_FEE : 0;
  const total = afterDiscount + fee;
  return { sub, pairs, discount, afterDiscount, fee, total, vat: vatIncluded(total) };
}

export function fmtHour(h: number) {
  return new Date(2000, 0, 1, h).toLocaleTimeString([], { hour: "numeric" });
}

/** Current day-of-week and fractional hour in the shop's own time zone. */
export function shopNow(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: BUSINESS.timeZone,
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const get = (t: string) => parts.find((x) => x.type === t)?.value ?? "0";
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  return { day, hour: +get("hour") + +get("minute") / 60, date: `${get("year")}-${get("month")}-${get("day")}` };
}

export function liveStatus(date = new Date()) {
  const { day, hour } = shopNow(date);
  const today = HOURS[day];
  const open = hour >= today.o && hour < today.c;
  const sub = open
    ? `until ${fmtHour(today.c)}`
    : `opens ${hour < today.o ? "at " + fmtHour(today.o) : "tomorrow " + fmtHour(HOURS[(day + 1) % 7].o)}`;
  const next = BATCH_TIMES.find((b) => b > hour);
  const nextBatch = next ? `in ${Math.round((next - hour) * 60)} min` : `tomorrow ${fmtHour(BATCH_TIMES[0])}`;
  return { day, open, sub, nextBatch };
}

export function pickupTimes() {
  const out = ["ASAP (~15 min)"];
  const d = new Date();
  d.setMinutes(Math.ceil(d.getMinutes() / 15) * 15 + 30, 0, 0);
  for (let i = 0; i < 10; i++) {
    out.push(d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }));
    d.setMinutes(d.getMinutes() + 15);
  }
  return out;
}
