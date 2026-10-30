/**
 * Sends order and form notifications to the shop. Three channels, use any mix:
 * - SMS to the kitchen's phone(s) through Semaphore (semaphore.co, a Philippine SMS gateway):
 *   set SEMAPHORE_API_KEY and KITCHEN_SMS (comma-separated mobile numbers, e.g. 09171234567).
 *   SMS_SENDER is optional and must be a sender name Semaphore has approved.
 * - Email through Resend: set RESEND_API_KEY and SHOP_EMAIL (and EMAIL_FROM once your domain is verified).
 * - A webhook: set NOTIFY_WEBHOOK_URL (e.g. a Zapier or Make hook that posts to Viber or Telegram,
 *   or adds newsletter sign-ups to Mailchimp/Klaviyo).
 */
type Message = {
  kind: "order" | "payment" | "cancelled" | "contact" | "newsletter";
  subject: string;
  text: string;
  /** Short version for SMS (each 160 characters is billed as one message). Defaults to the subject. */
  sms?: string;
  replyTo?: string;
  data?: unknown;
};

const emailOn = () => !!(process.env.RESEND_API_KEY && process.env.SHOP_EMAIL);
const webhookOn = () => !!process.env.NOTIFY_WEBHOOK_URL;
const smsOn = () => !!(process.env.SEMAPHORE_API_KEY && process.env.KITCHEN_SMS);

/** Is any channel set up? Without one, messages would only reach the server log. */
export const notifyConfigured = () => emailOn() || webhookOn() || smsOn();

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

  if (smsOn()) {
    const form = new URLSearchParams({
      apikey: process.env.SEMAPHORE_API_KEY!,
      number: process.env.KITCHEN_SMS!.replace(/\s/g, ""),
      // Capped at three SMS parts so a big order can't run up the bill.
      message: (msg.sms ?? msg.subject).slice(0, 459),
      ...(process.env.SMS_SENDER && { sendername: process.env.SMS_SENDER }),
    });
    sends.push(
      fetch("https://api.semaphore.co/api/v4/messages", { method: "POST", body: form }).then(async (r) => {
        // Semaphore can answer 200 with an error body (e.g. bad number, no credits), so check for a message id.
        const body = await r.text();
        const ok = r.ok && /"message_id"/.test(body);
        if (!ok) console.error("[notify] SMS failed", r.status, body.slice(0, 300));
        return ok;
      }),
    );
  }

  const results = await Promise.all(sends.map((p) => p.catch((e) => (console.error("[notify]", e), false))));
  return results.some(Boolean);
}
