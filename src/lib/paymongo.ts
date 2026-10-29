import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * PayMongo Checkout (GCash, Maya, GrabPay, cards, QR Ph).
 * Set PAYMONGO_SECRET_KEY (sk_test_… while testing, sk_live_… to go live) and, for payment
 * confirmations, PAYMONGO_WEBHOOK_SECRET from a webhook pointed at /api/paymongo/webhook
 * listening for "checkout_session.payment.paid".
 */
export const paymongoEnabled = () => !!process.env.PAYMONGO_SECRET_KEY;

const auth = () => "Basic " + Buffer.from(`${process.env.PAYMONGO_SECRET_KEY}:`).toString("base64");

/** Creates a hosted checkout page for the whole order and returns its URL. Amounts are in centavos. */
export async function createCheckout(o: {
  orderNo: string;
  total: number;
  summary: string;
  name: string;
  phone: string;
  siteUrl: string;
  cancelSig: string;
}): Promise<string> {
  const res = await fetch("https://api.paymongo.com/v1/checkout_sessions", {
    method: "POST",
    headers: { Authorization: auth(), "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      data: {
        attributes: {
          // One line for the whole order, so the pairing discount and delivery fee are already included.
          line_items: [{ currency: "PHP", amount: Math.round(o.total * 100), name: `Order ${o.orderNo}`, description: o.summary.slice(0, 250), quantity: 1 }],
          payment_method_types: ["gcash", "paymaya", "grab_pay", "card", "qrph"],
          reference_number: o.orderNo,
          description: `Order ${o.orderNo}`,
          billing: { name: o.name, phone: o.phone },
          success_url: `${o.siteUrl}/?order=${encodeURIComponent(o.orderNo)}`,
          // Signed, so only this customer's browser can tell the kitchen to drop the order (/api/order/cancel).
          cancel_url: `${o.siteUrl}/?order_cancelled=${encodeURIComponent(o.orderNo)}&sig=${o.cancelSig}`,
        },
      },
    }),
  });
  if (!res.ok) throw new Error(`PayMongo ${res.status}: ${await res.text()}`);
  const json = await res.json();
  return json.data.attributes.checkout_url as string;
}

/** Signature for an order's cancel link, so nobody else can cancel it. */
export const cancelSig = (orderNo: string) =>
  createHmac("sha256", process.env.PAYMONGO_SECRET_KEY ?? "").update(`cancel:${orderNo}`).digest("hex").slice(0, 32);

export function cancelSigValid(orderNo: string, sig: string) {
  const expected = cancelSig(orderNo);
  return paymongoEnabled() && sig.length === expected.length && timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
}

/** Verifies the Paymongo-Signature header: "t=<timestamp>,te=<test sig>,li=<live sig>". */
export function verifyWebhook(rawBody: string, header: string | null): boolean {
  const secret = process.env.PAYMONGO_WEBHOOK_SECRET;
  if (!secret || !header) return false;
  const parts = Object.fromEntries(header.split(",").map((kv) => kv.split("=") as [string, string]));
  if (!parts.t) return false;
  const expected = createHmac("sha256", secret).update(`${parts.t}.${rawBody}`).digest("hex");
  const live = process.env.PAYMONGO_SECRET_KEY?.startsWith("sk_live_");
  const given = live ? parts.li : parts.te;
  if (!given || given.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(given), Buffer.from(expected));
}
