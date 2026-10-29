import { NextResponse } from "next/server";
import { bad, isEmail, readJson, str } from "@/lib/api";

/** Reservation / catering / custom-cake requests. */
export async function POST(req: Request) {
  const body = await readJson(req);
  if (!body) return bad("Invalid JSON");
  const name = str(body.name, 120);
  if (!name || !isEmail(body.email)) return bad("Name and a valid email are required");

  const request = { name, email: body.email, type: str(body.type, 60), date: str(body.date, 20), msg: str(body.msg) };

  // TODO: send with Resend (or Formspree) to the shop inbox, e.g.
  //   await resend.emails.send({ from, to: process.env.CONTACT_TO_EMAIL, replyTo: request.email, subject: request.type, text: request.msg })
  console.info("[contact]", request);

  return NextResponse.json({ ok: true });
}
