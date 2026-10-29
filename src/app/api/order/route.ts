import { NextResponse } from "next/server";
import { bad, readJson, str } from "@/lib/api";
import { BUSINESS, DELIVERY_AREAS, OPT, PRODUCTS, SITE_URL } from "@/lib/data";
import { mustRefuse, notify } from "@/lib/notify";
import { createCheckout, paymongoEnabled } from "@/lib/paymongo";
import { boxPrice, calcPrice, cartTotals, isSold, money, shopNow, type ShopNow } from "@/lib/utils";

type Item = { pid: string; name: string; opts: string; qty: number; price: number; box?: string[] };

/** Re-derives a line's unit price on the server so a tampered client can't set its own price. */
function serverPrice(item: Item, now: ShopNow): number | null {
  if (item.pid === "box6" || item.pid === "box12") {
    const size = item.pid === "box6" ? 6 : 12;
    const ids = item.box ?? [];
    const ok = ids.length === size && ids.every((id) => {
      const p = PRODUCTS.find((x) => x.id === id);
      return p?.box && !isSold(p, now);
    });
    return ok ? boxPrice(ids, size) : null;
  }
  const p = PRODUCTS.find((x) => x.id === item.pid);
  if (!p || isSold(p, now)) return null;
  const chosen = item.opts.split(" · ");
  const sel = OPT[p.opt].map((g) => g.choices.findIndex((ch) => chosen.includes(ch.l)));
  return sel.includes(-1) ? null : calcPrice(p, sel);
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

  const now = shopNow();
  const items: Item[] = [];
  for (const raw of body.items as Item[]) {
    const item: Item = {
      pid: str(raw?.pid, 20),
      name: str(raw?.name, 120),
      opts: str(raw?.opts, 500),
      qty: Math.floor(Number(raw?.qty)),
      price: 0,
      box: Array.isArray(raw?.box) ? raw.box.map((id) => str(id, 20)).slice(0, 12) : undefined,
    };
    const price = serverPrice(item, now);
    if (price === null || !(item.qty >= 1 && item.qty <= 99)) return bad(`Sorry, ${item.name || "an item"} is no longer available`);
    if (item.box) {
      // Describe boxes from their real contents for the kitchen ticket.
      const counts = new Map<string, number>();
      item.box.forEach((id) => { const n = PRODUCTS.find((p) => p.id === id)!.name; counts.set(n, (counts.get(n) ?? 0) + 1); });
      item.name = `Mix & Match Box (${item.box.length})`;
      item.opts = [...counts].map(([n, q]) => `${q}× ${n}`).join(", ");
    }
    items.push({ ...item, price });
  }

  const t = cartTotals(items, mode);
  const orderNo = "CK-" + crypto.randomUUID().slice(0, 5).toUpperCase();
  const time = str(body.time, 40);
  const notes = str(body.notes);
  const online = paymongoEnabled();

  const ticket = [
    `Order ${orderNo}: ${mode.toUpperCase()} at ${time || "ASAP"}`,
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
    data: { orderNo, mode, name, phone, area, addr, time, notes, items, totals: t, online },
  });
  if (!delivered && process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "We couldn't send your order to the kitchen" }, { status: 502 });
  }

  if (!online) return NextResponse.json({ orderNo });
  try {
    const checkoutUrl = await createCheckout({
      orderNo,
      total: t.total,
      summary: items.map((i) => `${i.qty}× ${i.name}`).join(", "),
      name,
      phone,
      siteUrl: SITE_URL,
    });
    return NextResponse.json({ orderNo, checkoutUrl });
  } catch (e) {
    console.error("[order] PayMongo error", e);
    return NextResponse.json({ error: `Payment is unavailable right now. Please call ${BUSINESS.phone}.` }, { status: 502 });
  }
}
