"use client";

import { useState } from "react";
import { BOX_PRICE, IMG, PRODUCTS } from "@/lib/data";
import { byId, money } from "@/lib/utils";
import { useShop } from "@/store/shop";
import Reveal from "./Reveal";
import SmartImage from "./SmartImage";

const COOKIES = PRODUCTS.filter((p) => p.box);

export default function BoxBuilder() {
  const [size, setSize] = useState<6 | 12>(6);
  const [items, setItems] = useState<string[]>([]);
  const { addToCart, showToast } = useShop.getState();
  const full = items.length === size;

  const pick = (id: string) =>
    items.length < size ? setItems([...items, id]) : showToast("Your box is full! Tap a cookie in the box to swap it.");

  const surprise = () => {
    const next = [...items];
    while (next.length < size) next.push(COOKIES[Math.floor(Math.random() * COOKIES.length)].id);
    setItems(next);
  };

  const addBox = () => {
    const counts: Record<string, number> = {};
    items.forEach((id) => { const n = byId(id)!.name; counts[n] = (counts[n] || 0) + 1; });
    addToCart({
      pid: "box" + size,
      name: `Mix & Match Box (${size})`,
      img: IMG.cookie2,
      price: BOX_PRICE[size],
      opts: Object.entries(counts).map(([n, q]) => `${q}× ${n}`).join(", "),
      qty: 1,
      emoji: "🎁",
    });
    setItems([]);
  };

  return (
    <section className="section" id="box">
      <div className="shell">
        <Reveal className="section-head">
          <div>
            <span className="eyebrow">Boxed with love</span>
            <h2>Build your own cookie box.</h2>
            <p>Pick a box size, then tap cookies to fill it. Tap a cookie in the box to remove it. Perfect for gifting (or not sharing).</p>
          </div>
        </Reveal>
        <div className="box-wrap">
          <div className="box-picks">
            {COOKIES.map((c) => {
              const n = items.filter((x) => x === c.id).length;
              return (
                <button className="pick" key={c.id} onClick={() => pick(c.id)} aria-label={`Add ${c.name} to box${n ? ` (${n} in box)` : ""}`}>
                  <span className={`qty ${n ? "show" : ""}`} aria-hidden="true">{n}</span>
                  <div className="pimg">
                    <SmartImage src={c.img} alt="" fill sizes="(max-width: 520px) 45vw, 220px" emoji="🍪" className="object-cover" />
                  </div>
                  <b>{c.name}</b>
                </button>
              );
            })}
          </div>
          <aside className="box-panel" aria-label="Your box">
            <span className="eyebrow">Your box</span>
            <h3 className="mt-1.5 text-[1.8rem]">The Mix &amp; Match</h3>
            <div className="size-toggle" role="radiogroup" aria-label="Box size">
              {([6, 12] as const).map((s) => (
                <button
                  key={s}
                  role="radio"
                  aria-checked={size === s}
                  className={size === s ? "active" : ""}
                  onClick={() => { setSize(s); setItems((it) => it.slice(0, s)); }}
                >
                  {s === 6 ? "Half dozen" : "Dozen"} · {money(BOX_PRICE[s])}
                </button>
              ))}
            </div>
            <div className="box-slots">
              {Array.from({ length: size }, (_, i) => {
                const id = items[i];
                return id ? (
                  <button
                    key={i}
                    className="slot filled"
                    title="Remove"
                    aria-label={`Remove ${byId(id)!.name} from box`}
                    onClick={() => setItems(items.filter((_, j) => j !== i))}
                  >
                    <SmartImage src={byId(id)!.img} alt="" fill sizes="60px" emoji="🍪" className="object-cover" />
                  </button>
                ) : (
                  <div key={i} className="slot" aria-hidden="true">{i + 1}</div>
                );
              })}
            </div>
            <div className="progress"><span style={{ width: `${(items.length / size) * 100}%` }} /></div>
            <div className="box-meta" aria-live="polite">
              <span>{items.length} of {size} picked</span>
              <span>{money(BOX_PRICE[size])}</span>
            </div>
            <button className="btn btn-primary" disabled={!full} onClick={addBox}>
              {full ? `Add box to cart · ${money(BOX_PRICE[size])}` : `Pick ${size - items.length} more`}
            </button>
            <button className="link-btn" onClick={surprise}>Surprise me: fill it randomly</button>
          </aside>
        </div>
      </div>
    </section>
  );
}
