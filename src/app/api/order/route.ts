import { NextResponse } from "next/server";
import { bad, readJson, str } from "@/lib/api";
import { BUSINESS, DELIVERY_AREAS, SITE_URL } from "@/lib/data";
import { mustRefuse, notify } from "@/lib/notify";
import { cancelSig, createCheckout, paymongoEnabled } from "@/lib/paymongo";
import {
  ASAP, byId, cartTotals, linePrice, lineText, MAX_QTY, money, orderSlots, shopNow, stockProblem, type LineRef,
} from "@/lib/utils";

type Item = LineRef & { name: string; opts: string; price: number };

/** Reads one cart line. Only ids, option indices, a note and a quantity are taken from the browser. */
function readLine(raw: unknown): LineRef {
  const r = (raw ?? {}) as Record<string, unknown>;
  const ints = (v: unknown, max: number) => (Array.isArray(v) ? v.slice(0, max).map((x) => Number(x)) : undefined);
  return {
    pid: str(r.pid, 20),
    qty: Math.floor(Number(r.qty)),
    sel: ints(r.sel, 5),
    note: str(r.note, 200) || undefined,
    box: Array.isArray(r.box) ? r.box.slice(0, 12).map((id) => str(id, 20)) : undefined,
  };
}

/** The chosen time must be one we offer now, or offered up to 20 minutes ago (the checkout was left open). */
function validSlot(time: string) {
  if (time === ASAP) return orderSlots(shopNow()).includes(ASAP);
  return [0, 20].some((ago) => orderSlots(shopNow(new Date(Date.now() - ago * 60_000))).includes(time));
}

/**
 * Places an order. Prices, the pairing discount and the delivery fee are all recalculated here.
 * - With PayMongo configured, returns a checkoutUrl; the kitchen is told the order is waiting for
 *   payment, and /api/paymongo/webhook tells it when the payment lands.
 * - Without it, the customer pays at pickup or on delivery and the kitchen is told straight away.
 */
export async function POST(req: Request) {
  if (mustRefuse()) {
    console.error("[order] refused: no notification channel is configured (see .env.example)");
    return NextResponse.json({ error: "Online ordering isn't available right now" }, { status: 503 });
  }

  const body = await readJson(req);
  if (!body) return bad("Invalid JSON");
  const mode = body.mode === "delivery" ? "delivery" : "pickup";
  const name = str(body.name, 120);
  const phone = str(body.phone, 40);
  const area = str(body.area, 120);
  const addr = str(body.addr, 300);
  if (!name || !phone) return bad("Missing name or phone");
  if (mode === "delivery" && (!addr || !DELIVERY_AREAS.includes(area))) return bad("We don't deliver to that area");
  if (!Array.isArray(body.items) || !body.items.length || body.items.length > 100) return bad("Cart is empty");

  const time = str(body.time, 40);
  if (!validSlot(time)) return bad("That time isn't available any more. Please pick another time.");

  const now = shopNow();
  const items: Item[] = [];
  for (const raw of body.items) {
    const line = readLine(raw);
    const label = byId(line.pid)?.name ?? "an item";
    if (!(line.qty >= 1 && line.qty <= MAX_QTY)) return bad(`You can order 1 to ${MAX_QTY} of ${label} online.`);
    const price = linePrice(line, now);
    if (price === null) return bad(`Sorry, ${label} is no longer available. Please remove it from your cart.`);
    items.push({ ...line, ...lineText(line), price });
  }
  const short = stockProblem(items, now);
  if (short) return bad(`${short} Please change your cart.`);

  const t = cartTotals(items, mode);
  const orderNo = "CC-" + crypto.randomUUID().slice(0, 5).toUpperCase();
  const notes = str(body.notes);
  const online = paymongoEnabled();

  const ticket = [
    `Order ${orderNo}: ${mode.toUpperCase()}, ${time}`,
    `Customer: ${name} · ${phone}`,
    mode === "delivery" ? `Deliver to: ${addr}, ${area}` : "",
    "",
    ...items.map((i) => `${i.qty} × ${i.name}${i.opts ? ` (${i.opts})` : ""}  ${money(i.price * i.qty)}`),
    "",
    t.discount ? `Drink + pastry pairing ×${t.pairs}: −${money(t.discount)}` : "",
    mode === "delivery" ? `Delivery: ${t.fee ? money(t.fee) : "free"}` : "",
    `TOTAL: ${money(t.total)} (incl. VAT ${money(t.vat)})`,
    online ? "Payment: ONLINE. Wait for the PAID message before starting." : `Payment: collect ${money(t.total)} at ${mode === "pickup" ? "pickup" : "the door"}.`,
    notes ? `\nNotes: ${notes}` : "",
  ].filter((l, i, a) => l !== "" || a[i - 1] !== "").join("\n");

  const delivered = await notify({
    kind: "order",
    subject: `${online ? "[Awaiting payment] " : ""}New ${mode} order ${orderNo}: ${money(t.total)}`,
    text: ticket,
    data: { orderNo, mode, name, phone, area, addr, time, notes, items: items.map(({ pid, name, opts, qty, price }) => ({ pid, name, opts, qty, price })), totals: t, online },
  });
  if (!delivered && process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "We couldn't send your order to the kitchen" }, { status: 502 });
  }

  if (!online) return NextResponse.json({ orderNo, total: t.total });
  try {
    const checkoutUrl = await createCheckout({
      orderNo,
      total: t.total,
      summary: items.map((i) => `${i.qty}× ${i.name}`).join(", "),
      name,
      phone,
      siteUrl: SITE_URL,
      cancelSig: cancelSig(orderNo),
    });
    return NextResponse.json({ orderNo, checkoutUrl });
  } catch (e) {
    console.error("[order] PayMongo error", e);
    return NextResponse.json({ error: `Payment is unavailable right now. Please call ${BUSINESS.phone}.` }, { status: 502 });
  }
}
