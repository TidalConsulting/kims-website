import { NextResponse } from "next/server";
import { bad, readJson, str } from "@/lib/api";
import { notify } from "@/lib/notify";
import { cancelSigValid } from "@/lib/paymongo";

/**
 * The customer backed out of PayMongo's payment page (they land on ?order_cancelled=…&sig=…).
 * Tells the kitchen so the "[Awaiting payment]" ticket isn't left hanging.
 */
export async function POST(req: Request) {
  const body = await readJson(req);
  const orderNo = str(body?.orderNo, 20);
  const sig = str(body?.sig, 64);
  if (!orderNo || !cancelSigValid(orderNo, sig)) return bad("Invalid link");
  await notify({
    kind: "cancelled",
    subject: `CANCELLED: order ${orderNo}. Payment was not completed.`,
    text: `The customer left the payment page for order ${orderNo} without paying. Don't start it unless a PAID message for ${orderNo} follows.`,
    data: { orderNo },
  });
  return NextResponse.json({ ok: true });
}
