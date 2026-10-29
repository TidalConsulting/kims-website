"use client";

import { useState, type FormEvent } from "react";
import { useShop } from "@/store/shop";

export default function Newsletter() {
  const showToast = useShop((s) => s.showToast);
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = String(new FormData(form).get("email") ?? "");
    setBusy(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      showToast("You're in! Check your inbox for a sweet welcome 🍪");
      form.reset();
    } catch {
      showToast("Hmm, that email didn't work. Mind checking it?");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="newsletter" aria-label="Newsletter">
      <div className="shell nl-inner">
        <div>
          <h3>Stay in the loop 🍪</h3>
          <p>New flavors, secret menu drops, and a free cookie on your birthday.</p>
        </div>
        <form className="nl-form" onSubmit={submit}>
          <input name="email" type="email" placeholder="Enter your email" required aria-label="Email" autoComplete="email" />
          <button className="btn btn-dark px-[22px] py-3" disabled={busy}>Subscribe</button>
        </form>
      </div>
    </section>
  );
}
