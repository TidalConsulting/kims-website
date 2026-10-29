import { NextResponse } from "next/server";
import { notify } from "@/lib/notify";
import { money } from "@/lib/utils";
import { verifyWebhook } from "@/lib/paymongo";

/** PayMongo calls this when a checkout is paid. Tells the kitchen the order can start. */
export async function POST(req: Request) {
  const raw = await req.text();
  if (!verifyWebhook(raw, req.headers.get("paymongo-signature"))) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }
  const event = JSON.parse(raw)?.data?.attributes;
  if (event?.type === "checkout_session.payment.paid") {
    const session = event.data?.attributes ?? {};
    const orderNo = session.reference_number ?? "(unknown)";
    const paid = (session.payments ?? []).reduce((s: number, p: { attributes?: { amount?: number } }) => s + (p.attributes?.amount ?? 0), 0) / 100;
    await notify({
      kind: "payment",
      subject: `PAID: order ${orderNo} (${money(paid)}). Start it now.`,
      text: `Order ${orderNo} has been paid online (${money(paid)}).`,
      data: { orderNo, paid },
    });
  }
  return NextResponse.json({ received: true });
}
