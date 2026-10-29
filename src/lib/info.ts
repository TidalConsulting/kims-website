import { BATCH_TIMES, BUSINESS, DELIVERY_AREAS, DELIVERY_FEE, FREE_DELIVERY, HOURS, PAIRING, PRODUCTS } from "./data";
import { fmtHour, money } from "./utils";

/*
 * Help pages opened from the footer. DRAFT copy: check every line with the shop before launch,
 * especially allergens (ask the kitchen) and privacy (have someone familiar with the
 * Philippine Data Privacy Act review it).
 */
export type InfoPage = "delivery" | "allergens" | "faq" | "privacy";
export type Block = { h?: string; p?: string; list?: string[] };

const NUTS = /almond|pistachio|hazelnut|walnut|pecan/i;
const withNuts = PRODUCTS.filter((p) => NUTS.test(p.name + " " + p.desc)).map((p) => p.name);
const contact = `${BUSINESS.phone} or ${BUSINESS.email}`;

export const INFO: Record<InfoPage, { title: string; blocks: Block[] }> = {
  delivery: {
    title: "Pickup & Delivery",
    blocks: [
      { h: "Pickup", p: `Order ahead and your order is usually ready in about 15 minutes. Collect it at the counter at ${BUSINESS.street}, ${BUSINESS.city}. Pay online, or with cash or GCash when you pick up.` },
      { h: "Delivery", p: `We deliver in 30–45 minutes to these areas: ${DELIVERY_AREAS.join(", ")}. Delivery is ${money(DELIVERY_FEE)}, and free on orders of ${money(FREE_DELIVERY)} or more.` },
      { h: "Fresh batches", p: `Cookies and rolls come out of the oven at ${BATCH_TIMES.map((h) => fmtHour(h)).join(", ")}. Popular items can sell out; the menu shows what's gone for the day.` },
      { h: "Big orders and catering", p: "For parties, offices and custom cakes, send us a request through the form on this page at least 48 hours ahead." },
    ],
  },
  allergens: {
    title: "Allergens",
    blocks: [
      { p: "Everything is made in one kitchen that handles wheat (gluten), eggs, milk, soy, peanuts and tree nuts. We can't guarantee any item is free of them." },
      { h: "Contains tree nuts", list: withNuts },
      { h: "Most baked goods contain", list: ["Wheat (gluten)", "Eggs", "Milk and butter"] },
      { h: "Drinks", p: "Oat and almond milk are available. Almond milk contains tree nuts." },
      { p: `Have an allergy? Call us before ordering at ${contact} and we'll talk you through it.` },
    ],
  },
  faq: {
    title: "FAQ",
    blocks: [
      { h: "What are your hours?", list: HOURS.map((d) => `${d.d}: ${fmtHour(d.o)} – ${fmtHour(d.c)}`) },
      { h: "Do prices include VAT?", p: "Yes. All prices are in pesos and already include 12% VAT. Nothing is added at checkout except delivery, when it applies." },
      { h: "How does the drink + pastry deal work?", p: `Each drink you pair with a pastry or cinnamon roll takes ${money(PAIRING.discount)} off. It's applied automatically in your cart.` },
      { h: "Can I order a custom cake?", p: "Yes. Use the request form and choose Custom cake order. Please allow at least 48 hours." },
      { h: "How can I pay?", p: "Online with GCash, Maya, GrabPay or card where available, or with cash or GCash at pickup or delivery." },
      { h: "Something wrong with my order?", p: `Call us at ${contact} and we'll make it right.` },
    ],
  },
  privacy: {
    title: "Privacy",
    blocks: [
      { p: `${BUSINESS.name} collects only what we need to make and deliver your order and to reply to you, in line with the Data Privacy Act of 2012 (RA 10173).` },
      { h: "What we collect", list: ["Your name and phone number, to prepare your order and tell you when it's ready", "Your delivery address and area, if you choose delivery", "Your email, if you send us a request or join our newsletter", "Your cart and favorites, which are saved only in your own browser"] },
      { h: "How we use it", p: "To fulfil orders, reply to requests, and (only if you subscribed) send our newsletter. We never sell your information." },
      { h: "Who we share it with", p: "Only the services that help us run the shop: our payment provider (PayMongo) to process payments, our email provider to send messages, and our delivery rider for delivery orders." },
      { h: "Your rights", p: `You can ask to see, correct or delete your information, or unsubscribe at any time. Contact us at ${contact}.` },
    ],
  },
};
