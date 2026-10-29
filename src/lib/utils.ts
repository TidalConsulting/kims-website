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
  // "in 25 min" when it's close; otherwise the clock time, so it never reads "in 338 min".
  const mins = next ? Math.round((next - hour) * 60) : 0;
  const nextBatch = !next ? `tomorrow ${fmtHour(BATCH_TIMES[0])}` : mins <= 90 ? `in ${mins} min` : `at ${fmtHour(next)}`;
  return { day, open, sub, nextBatch };
}

/** "2:30 PM" for a fractional hour. Fixed locale, so the server and browser produce the same slot labels. */
function fmtClock(h: number) {
  const m = Math.round(h * 60);
  return new Date(Date.UTC(2000, 0, 1, Math.floor(m / 60), m % 60)).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: "UTC" });
}

export const ASAP = "ASAP (~15 min)";

/**
 * Pickup / delivery times in shop time, inside opening hours: "ASAP" while open (until 20 min
 * before closing), then 15-minute slots from 30 min ahead, rolling into tomorrow.
 * The order API accepts only these labels.
 */
export function orderSlots(now: ShopNow = shopNow(), max = 24) {
  const out: string[] = [];
  const today = HOURS[now.day];
  if (now.hour >= today.o && now.hour < today.c - 1 / 3) out.push(ASAP);
  const add = (prefix: string, from: number, to: number) => {
    for (let q = Math.ceil(from * 4); q <= to * 4 && out.length < max; q++) out.push(`${prefix} ${fmtClock(q / 4)}`);
  };
  add("Today", Math.max(now.hour, today.o) + 0.5, today.c - 0.25);
  const next = HOURS[(now.day + 1) % 7];
  add("Tomorrow", next.o + 0.5, next.c - 0.25);
  return out;
}

/** "in about 15 minutes" / "today at 2:30 PM", for the confirmation message. */
export const slotPhrase = (slot: string) =>
  slot === ASAP ? "in about 15 minutes" : slot.replace(/^(\w+) /, (_, d: string) => `${d.toLowerCase()} at `);

/** A cart line as the order API sees it: option indices, an optional note, or a box's cookie ids. */
export type LineRef = { pid: string; qty: number; sel?: number[]; note?: string; box?: string[] };

export const MAX_QTY = 99;
const BOX_SIZES: Record<string, 6 | 12> = { box6: 6, box12: 12 };

/** Unit price of a line, or null if it can't be ordered (unknown item, bad options, sold out). */
export function linePrice(l: LineRef, now: ShopNow | null): number | null {
  const size = BOX_SIZES[l.pid];
  if (size) {
    const ids = l.box ?? [];
    const ok = ids.length === size && ids.every((id) => { const p = byId(id); return !!p?.box && !isSold(p, now); });
    return ok ? boxPrice(ids, size) : null;
  }
  const p = byId(l.pid);
  if (!p || l.box || isSold(p, now)) return null;
  const groups = OPT[p.opt];
  const sel = l.sel ?? groups.map(() => 0);
  const ok = sel.length === groups.length && sel.every((v, i) => Number.isInteger(v) && v >= 0 && v < groups[i].choices.length);
  return ok ? calcPrice(p, sel) : null;
}

/** Name and option text for a line, always built from the menu (never from what the browser sent). */
export function lineText(l: LineRef) {
  if (BOX_SIZES[l.pid]) {
    const counts = new Map<string, number>();
    (l.box ?? []).forEach((id) => { const n = byId(id)?.name ?? id; counts.set(n, (counts.get(n) ?? 0) + 1); });
    return { name: `Mix & Match Box (${BOX_SIZES[l.pid]})`, opts: [...counts].map(([n, q]) => `${q}× ${n}`).join(", ") };
  }
  const p = byId(l.pid);
  const groups = p ? OPT[p.opt] : [];
  const parts = groups.map((g, i) => g.choices[l.sel?.[i] ?? 0]?.l ?? "");
  const note = l.note?.trim();
  if (note) parts.push(`“${note}”`);
  return { name: p?.name ?? l.pid, opts: parts.filter(Boolean).join(" · ") };
}

/**
 * Checks the whole cart against today's "Only N left" counts (a dozen uses 12, a box one of each
 * cookie in it). Returns a message for the first item that runs over, or null.
 */
export function stockProblem(lines: LineRef[], now: ShopNow | null): string | null {
  const used = new Map<string, number>();
  const add = (id: string, n: number) => used.set(id, (used.get(id) ?? 0) + n);
  for (const l of lines) {
    if (l.box) l.box.forEach((id) => add(id, l.qty));
    else {
      const p = byId(l.pid);
      const units = p ? OPT[p.opt].reduce((n, g, i) => n * (g.choices[l.sel?.[i] ?? 0]?.n ?? 1), 1) : 1;
      add(l.pid, units * l.qty);
    }
  }
  for (const [id, n] of used) {
    const p = byId(id);
    const left = p && lowStock(p, now);
    if (left !== undefined && n > left) return `Sorry, we only have ${left} ${p!.name} left today.`;
  }
  return null;
}
