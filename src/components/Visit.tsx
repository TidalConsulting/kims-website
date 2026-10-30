"use client";

import { useState, type FormEvent } from "react";
import { postJson, STATIC_PREVIEW } from "@/lib/client";
import { ADDRESS, BUSINESS, HOURS, TEL } from "@/lib/data";
import { fmtHour, shopNow } from "@/lib/utils";
import { useShop } from "@/store/shop";
import Reveal from "./Reveal";
import { useClientValue } from "./hooks";


export default function Visit() {
  const today = useClientValue(() => shopNow().day);
  const showToast = useShop((s) => s.showToast);
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    if (!data.name?.trim() || !data.email?.includes("@")) {
      showToast("Please add your name and a valid email.");
      return;
    }
    setBusy(true);
    try {
      await postJson("/api/contact", data);
      showToast(`Thanks ${data.name.trim().split(" ")[0]}! We'll reply within a day.`);
      form.reset();
    } catch {
      showToast(`Sorry, that didn't send. Please call us at ${BUSINESS.phone}.`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <svg className="wave" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true">
        <path fill="currentColor" d="M0 40c120-25 240-25 360-8s240 30 360 10 240-45 360-30 240 30 360 20v28H0z" />
      </svg>
      <section className="section visit pt-[60px]" id="visit">
        <div className="shell visit-grid">
          <Reveal>
            <span className="eyebrow text-gold">Visit · Reserve · Cater</span>
            <h2>Book your <span className="hand">cozy spot</span></h2>
            <p className="mt-3.5 max-w-[42ch] opacity-85">
              Reserve a table, ask about catering, or order a custom celebration cake. We&apos;ll get back to you within a day.
            </p>
            <div className="hours">
              {HOURS.map((d, i) => (
                <div key={d.d} className={i === today ? "today" : ""} aria-current={i === today ? "date" : undefined}>
                  <span>{d.d}{i === today && " · today"}</span>
                  <span>{fmtHour(d.o)} – {fmtHour(d.c)}</span>
                </div>
              ))}
            </div>
            <p className="mt-[22px] opacity-85">
              📍 <a href={`https://maps.google.com/?q=${encodeURIComponent(ADDRESS)}`} className="underline-offset-2 hover:underline">{BUSINESS.street}, {BUSINESS.city}</a>
              {" · "}📞 <a href={TEL} className="underline-offset-2 hover:underline">{BUSINESS.phone}</a>
            </p>
            {!STATIC_PREVIEW && (
              <iframe
                className="map"
                title={`Map to ${BUSINESS.name}`}
                src={`https://maps.google.com/maps?q=${encodeURIComponent(ADDRESS)}&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            )}
          </Reveal>
          <Reveal as="form" className="form" onSubmit={submit} noValidate aria-label="Reservation and catering request">
            <div className="two">
              <input name="name" placeholder="Your name" aria-label="Your name" autoComplete="name" required />
              <input name="email" type="email" placeholder="Email" aria-label="Email" autoComplete="email" required />
            </div>
            <div className="two">
              <select name="type" aria-label="Request type">
                <option>Table reservation</option>
                <option>Custom cake order</option>
                <option>Catering inquiry</option>
                <option>Just saying hi</option>
              </select>
              <input name="date" type="date" aria-label="Date" />
            </div>
            <textarea name="msg" rows={5} placeholder="Tell us more: party size, cake flavor, servings…" aria-label="Message" />
            <button className="btn btn-primary justify-center" disabled={busy}>{busy ? "Sending…" : "Send request"}</button>
          </Reveal>
        </div>
      </section>
    </>
  );
}
