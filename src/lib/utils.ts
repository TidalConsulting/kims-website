import { BATCH_TIMES, BUSINESS, CATS, CURRENCY, HOURS, OPT, PRODUCTS, TODAY, VAT_RATE, type OptionChoice, type Product } from "./data";

const fmtWhole = new Intl.NumberFormat(CURRENCY.locale, { style: "currency", currency: CURRENCY.code, maximumFractionDigits: 0 });
const fmtCents = new Intl.NumberFormat(CURRENCY.locale, { style: "currency", currency: CURRENCY.code, minimumFractionDigits: 2 });

/** ₱95, ₱1,250, or ₱36.43 when there are centavos. */
export const money = (n: number) => (Number.isInteger(Math.round(n * 100) / 100) ? fmtWhole : fmtCents).format(n);

/** VAT portion of a VAT-inclusive amount. */
export const vatIncluded = (amount: number) => amount - amount / (1 + VAT_RATE);

export const byId = (id: string) => PRODUCTS.find((p) => p.id === id);

export const emojiFor = (p?: Product) => p?.emoji || CATS.find((c) => c.id === p?.cat)?.emoji || "🍪";

export function calcPrice(p: Product, sel: number[]) {
  let price = p.price;
  OPT[p.opt].forEach((g, i) => {
    const c = g.choices[sel[i]];
    if (c.fixed) price = c.fixed;
    else if (c.mult) price = price * c.mult;
    else price += c.p || 0;
  });
  return Math.round(price); // whole pesos
}

export function optLabel(p: Product, c: OptionChoice) {
  if (c.fixed) return money(c.fixed);
  if (c.mult && c.mult !== 1) return money(Math.round(p.price * c.mult));
  if (c.p) return "+" + money(c.p);
  return "";
}

/** Sold out today: listed in TODAY, flagged soldOut, or not baked on this day of the week. */
export function isSold(p: Product, day: number | null = null) {
  return TODAY.soldOut.includes(p.id) || !!p.soldOut || (day !== null && !!p.availableDays && !p.availableDays.includes(day));
}

/** How many are left when stock is low ("Only N left"), otherwise undefined. */
export const lowStock = (p: Product) => (isSold(p) ? undefined : TODAY.low[p.id]);

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
  }).formatToParts(date);
  const get = (t: string) => parts.find((x) => x.type === t)?.value ?? "0";
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  return { day, hour: +get("hour") + +get("minute") / 60 };
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
