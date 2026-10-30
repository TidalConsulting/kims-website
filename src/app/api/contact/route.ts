import { NextResponse } from "next/server";
import { bad, isEmail, readJson, str } from "@/lib/api";
import { mustRefuse, notify } from "@/lib/notify";

/** Reservation / catering / custom-cake requests, sent to the shop (reply goes straight to the customer). */
export async function POST(req: Request) {
  if (mustRefuse()) return NextResponse.json({ error: "Messages aren't set up yet" }, { status: 503 });
  const body = await readJson(req);
  if (!body) return bad("Invalid JSON");
  const name = str(body.name, 120);
  if (!name || !isEmail(body.email)) return bad("Name and a valid email are required");

  const r = { name, email: body.email, type: str(body.type, 60) || "Message", date: str(body.date, 20), msg: str(body.msg) };
  const delivered = await notify({
    kind: "contact",
    subject: `${r.type} from ${r.name}${r.date ? ` for ${r.date}` : ""}`,
    text: `${r.type}\nFrom: ${r.name} <${r.email}>\nDate: ${r.date || "not given"}\n\n${r.msg || "(no message)"}`,
    sms: `${r.type} from ${r.name} (${r.email})${r.date ? ` for ${r.date}` : ""}: ${r.msg || "(no message)"}`,
    replyTo: r.email,
    data: r,
  });
  if (!delivered && process.env.NODE_ENV === "production") return NextResponse.json({ error: "Not sent" }, { status: 502 });
  return NextResponse.json({ ok: true });
}
