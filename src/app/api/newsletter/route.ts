import { NextResponse } from "next/server";
import { bad, isEmail, readJson } from "@/lib/api";
import { mustRefuse, notify } from "@/lib/notify";

/** Newsletter sign-ups. Point NOTIFY_WEBHOOK_URL at a Zapier/Make hook to add them to Mailchimp or Klaviyo. */
export async function POST(req: Request) {
  if (mustRefuse()) return NextResponse.json({ error: "Sign-ups aren't set up yet" }, { status: 503 });
  const body = await readJson(req);
  if (!body || !isEmail(body.email)) return bad("A valid email is required");

  const delivered = await notify({ kind: "newsletter", subject: `New newsletter sign-up: ${body.email}`, text: body.email, data: { email: body.email } });
  if (!delivered && process.env.NODE_ENV === "production") return NextResponse.json({ error: "Not saved" }, { status: 502 });
  return NextResponse.json({ ok: true });
}
