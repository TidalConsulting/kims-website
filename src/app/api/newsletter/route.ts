import { NextResponse } from "next/server";
import { bad, isEmail, readJson } from "@/lib/api";

export async function POST(req: Request) {
  const body = await readJson(req);
  if (!body || !isEmail(body.email)) return bad("A valid email is required");

  // TODO: add the subscriber to Mailchimp or Klaviyo.
  console.info("[newsletter]", body.email);

  return NextResponse.json({ ok: true });
}
