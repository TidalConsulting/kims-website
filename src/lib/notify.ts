/**
 * Sends order and form notifications to the shop. Two channels, use either or both:
 * - Email through Resend: set RESEND_API_KEY and SHOP_EMAIL (and EMAIL_FROM once your domain is verified).
 * - A webhook: set NOTIFY_WEBHOOK_URL (e.g. a Zapier or Make hook that texts or Vibers the kitchen,
 *   or adds newsletter sign-ups to Mailchimp/Klaviyo).
 */
type Message = { kind: "order" | "payment" | "cancelled" | "contact" | "newsletter"; subject: string; text: string; replyTo?: string; data?: unknown };

const emailOn = () => !!(process.env.RESEND_API_KEY && process.env.SHOP_EMAIL);
const webhookOn = () => !!process.env.NOTIFY_WEBHOOK_URL;

/** Is any channel set up? Without one, messages would only reach the server log. */
export const notifyConfigured = () => emailOn() || webhookOn();

/** Refuse in production when nothing is configured, so customers are never told "received" for a message nobody sees. */
export const mustRefuse = () => process.env.NODE_ENV === "production" && !notifyConfigured();

/** Returns true if at least one channel accepted the message. */
export async function notify(msg: Message): Promise<boolean> {
  console.info(`[${msg.kind}] ${msg.subject}\n${msg.text}`);
  const sends: Promise<boolean>[] = [];

  if (emailOn()) {
    sends.push(
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM ?? "Website <onboarding@resend.dev>",
          to: [process.env.SHOP_EMAIL],
          subject: msg.subject,
          text: msg.text,
          ...(msg.replyTo && { reply_to: msg.replyTo }),
        }),
      }).then(async (r) => (r.ok ? true : (console.error("[notify] email failed", r.status, await r.text()), false))),
    );
  }
  if (webhookOn()) {
    sends.push(
      fetch(process.env.NOTIFY_WEBHOOK_URL!, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: msg.kind, subject: msg.subject, text: msg.text, replyTo: msg.replyTo, data: msg.data }),
      }).then((r) => (r.ok ? true : (console.error("[notify] webhook failed", r.status), false))),
    );
  }

  const results = await Promise.all(sends.map((p) => p.catch((e) => (console.error("[notify]", e), false))));
  return results.some(Boolean);
}
