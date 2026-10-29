"use client";

import { useState, type FormEvent } from "react";
import { DELIVERY_FEE, FREE_DELIVERY, VAT_RATE } from "@/lib/data";
import { money, pickupTimes, vatIncluded } from "@/lib/utils";
import { cartSubtotal, useShop } from "@/store/shop";
import { Check } from "./icons";

type Done = { no: string; name: string; when: string; mode: "pickup" | "delivery" };

export default function Checkout() {
  const cart = useShop((s) => s.cart);
  const { clearCart, closeAll } = useShop.getState();
  const [mode, setMode] = useState<"pickup" | "delivery">("pickup");
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [times] = useState(pickupTimes);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const [done, setDone] = useState<Done | null>(null);

  const sub = cartSubtotal(cart);
  const fee = mode === "delivery" && sub < FREE_DELIVERY ? DELIVERY_FEE : 0;
  const total = sub + fee; // prices are VAT-inclusive

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const val = (k: string) => String(f.get(k) ?? "").trim();
    const required = ["name", "phone", ...(mode === "delivery" ? ["addr"] : [])];
    const errs = Object.fromEntries(required.map((k) => [k, !val(k)]));
    setErrors(errs);
    if (Object.values(errs).some(Boolean)) return;

    setBusy(true);
    setFailed(false);
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          name: val("name"),
          phone: val("phone"),
          addr: val("addr"),
          time: val("time"),
          notes: val("notes"),
          items: cart.map(({ pid, name, opts, qty, price }) => ({ pid, name, opts, qty, price })),
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      const { orderNo } = await res.json();
      setDone({ no: orderNo, name: val("name").split(" ")[0], when: val("time"), mode });
      clearCart();
    } catch {
      setFailed(true);
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="done">
        <div className="check"><Check /></div>
        <h3 id="modal-title">Order received!</h3>
        <p>
          Thanks, {done.name}! We&apos;re on it. Your order will be {done.mode === "pickup" ? "ready for pickup" : "at your door"} around <b>{done.when}</b>.
        </p>
        <div className="order-no">Order #{done.no}</div>
        <br />
        <button className="btn btn-primary" onClick={closeAll}>Back to the bakery</button>
      </div>
    );
  }

  const field = (name: string, label: string, type = "text") => (
    <div className="field">
      <label htmlFor={`co-${name}`}>{label}</label>
      <input
        id={`co-${name}`}
        name={name}
        type={type}
        required
        aria-invalid={errors[name] || undefined}
        className={errors[name] ? "err" : ""}
        autoComplete={name === "name" ? "name" : name === "phone" ? "tel" : "street-address"}
      />
    </div>
  );

  return (
    <div className="checkout">
      <span className="eyebrow">Almost there</span>
      <h3 id="modal-title">Checkout</h3>
      <div className="steps" aria-hidden="true"><span className="on" /><span className="on" /><span /></div>
      <div className="co-grid">
        <form onSubmit={submit} noValidate>
          <div className="seg" role="radiogroup" aria-label="Pickup or delivery">
            <button type="button" role="radio" aria-checked={mode === "pickup"} className={mode === "pickup" ? "active" : ""} onClick={() => setMode("pickup")}>
              <b>🛍️ Pickup</b>Ready in ~15 min
            </button>
            <button type="button" role="radio" aria-checked={mode === "delivery"} className={mode === "delivery" ? "active" : ""} onClick={() => setMode("delivery")}>
              <b>🚲 Delivery</b>{sub >= FREE_DELIVERY ? "Free" : money(DELIVERY_FEE)} · 30–45 min
            </button>
          </div>
          {field("name", "Full name")}
          {field("phone", "Phone (we'll text when it's ready)", "tel")}
          {mode === "delivery" && field("addr", "Delivery address")}
          <div className="field">
            <label htmlFor="co-time">{mode === "pickup" ? "Pickup" : "Delivery"} time</label>
            <select id="co-time" name="time">{times.map((t) => <option key={t}>{t}</option>)}</select>
          </div>
          <div className="field">
            <label htmlFor="co-notes">Notes for the kitchen</label>
            <textarea id="co-notes" name="notes" rows={2} />
          </div>
          <button className="btn btn-dark w-full justify-center" disabled={busy || !cart.length}>
            {busy ? "Placing order…" : `Place order · ${money(total)}`}
          </button>
          {failed && <p role="alert" className="mt-2.5 text-center text-sm text-berry">Something went wrong. Please try again or call us.</p>}
          <p className="mt-2.5 text-center text-xs text-muted">Demo checkout: no payment is taken. Connect Stripe or Square to go live.</p>
        </form>
        <div className="co-summary">
          <h6 className="eyebrow mb-2.5">Order summary</h6>
          {cart.map((c) => (
            <div className="mini" key={c.key}><span>{c.qty} × {c.name}</span><span>{money(c.price * c.qty)}</span></div>
          ))}
          <div className="sum mt-3"><span>Subtotal</span><span>{money(sub)}</span></div>
          <div className="sum"><span>Delivery</span><span>{fee ? money(fee) : "Free"}</span></div>
          <div className="sum total"><span>Total</span><span>{money(total)}</span></div>
          <div className="sum"><span>Includes VAT ({VAT_RATE * 100}%)</span><span>{money(vatIncluded(total))}</span></div>
        </div>
      </div>
    </div>
  );
}
