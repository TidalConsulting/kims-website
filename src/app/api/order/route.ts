import { NextResponse } from "next/server";
import { bad, readJson, str } from "@/lib/api";
import { BOX_PRICE, OPT, PRODUCTS } from "@/lib/data";
import { calcPrice, isSold } from "@/lib/utils";

type Item = { pid: string; name: string; opts: string; qty: number; price: number };

/** Re-derives a line's unit price on the server so a tampered client can't set its own price. */
function serverPrice(item: Item): number | null {
  if (item.pid === "box6" || item.pid === "box12") return BOX_PRICE[item.pid === "box6" ? 6 : 12];
  const p = PRODUCTS.find((x) => x.id === item.pid);
  if (!p || isSold(p)) return null;
  const chosen = item.opts.split(" · ");
  const sel = OPT[p.opt].map((g) => g.choices.findIndex((ch) => chosen.includes(ch.l)));
  return sel.includes(-1) ? null : calcPrice(p, sel);
}

/**
 * Demo order endpoint: validates the order and returns an order number. No payment is taken.
 * To go live, create a PayMongo Checkout Session (GCash, Maya, GrabPay, cards, QR Ph) here from the
 * validated items, and use a webhook to text or Viber the kitchen once payment succeeds.
 */
export async function POST(req: Request) {
  const body = await readJson(req);
  if (!body) return bad("Invalid JSON");
  const mode = body.mode === "delivery" ? "delivery" : "pickup";
  const name = str(body.name, 120);
  const phone = str(body.phone, 40);
  const addr = str(body.addr, 300);
  if (!name || !phone || (mode === "delivery" && !addr)) return bad("Missing required fields");
  if (!Array.isArray(body.items) || !body.items.length || body.items.length > 100) return bad("Cart is empty");

  const items: Item[] = [];
  for (const raw of body.items as Item[]) {
    const item = { pid: str(raw?.pid, 20), name: str(raw?.name, 120), opts: str(raw?.opts, 500), qty: Math.floor(Number(raw?.qty)), price: Number(raw?.price) };
    const price = serverPrice(item);
    if (price === null || !(item.qty >= 1 && item.qty <= 99)) return bad(`Invalid item: ${item.name || item.pid}`);
    items.push({ ...item, price });
  }

  const orderNo = "CK-" + crypto.randomUUID().slice(0, 5).toUpperCase();
  console.info("[order]", { orderNo, mode, name, phone, addr, time: str(body.time, 40), notes: str(body.notes), items });

  return NextResponse.json({ orderNo });
}
