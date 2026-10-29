"use client";

import { useState } from "react";
import { IMG, PRODUCTS } from "@/lib/data";
import { localOr, productPhoto } from "@/lib/photos";
import { boxPrice, byId, isSold, money } from "@/lib/utils";
import { useShop } from "@/store/shop";
import Reveal from "./Reveal";
import SmartImage from "./SmartImage";
import { useShopNow } from "./hooks";

const COOKIES = PRODUCTS.filter((p) => p.box);
const pickRandom = <T,>(list: T[]) => list[Math.floor(Math.random() * list.length)];

export default function BoxBuilder() {
  const [size, setSize] = useState<6 | 12>(6);
  const [items, setItems] = useState<string[]>([]);
  const { addToCart, showToast } = useShop.getState();
  const now = useShopNow();
  const full = items.length === size;
  const available = COOKIES.filter((c) => !isSold(c, now));
  const cheapest = available.reduce((a, c) => (c.price < a.price ? c : a), available[0] ?? COOKIES[0]);
  // Lowest possible price for a box: what's picked so far, topped up with the cheapest cookie.
  const fromPrice = (n: 6 | 12, picked: string[]) =>
    boxPrice([...picked, ...Array(Math.max(0, n - picked.length)).fill(cheapest.id)].slice(0, n), n);
  const price = full ? boxPrice(items, size) : fromPrice(size, items);

  const pick = (id: string) => {
    if (isSold(byId(id)!, now)) return showToast("That one sold out today. Pick another!");
    if (items.length < size) setItems([...items, id]);
    else showToast("Your box is full! Tap a cookie in the box to swap it.");
  };

  const surprise = () => {
    const next = [...items];
    while (next.length < size) next.push(pickRandom(available).id);
    setItems(next);
  };

  const addBox = () => {
    const counts: Record<string, number> = {};
    items.forEach((id) => { const n = byId(id)!.name; counts[n] = (counts[n] || 0) + 1; });
    addToCart({
      pid: "box" + size,
      name: `Mix & Match Box (${size})`,
      img: localOr("gift-box.jpg", IMG.cookie2),
      price: boxPrice(items, size),
      opts: Object.entries(counts).map(([n, q]) => `${q}× ${n}`).join(", "),
      box: items,
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
              const sold = isSold(c, now);
              return (
                <button
                  className={`pick ${sold ? "sold" : ""}`}
                  key={c.id}
                  onClick={() => pick(c.id)}
                  aria-disabled={sold || undefined}
                >
                  <span className={`qty ${n ? "show" : ""}`} aria-hidden="true">{n}</span>
                  <div className="pimg">
                    <SmartImage src={productPhoto(c)} alt="" fill sizes="(max-width: 520px) 45vw, 220px" emoji="🍪" className="object-cover" />
                  </div>
                  <b>{c.name}</b>
                  <span className="sr-only">{sold ? ", sold out today" : n ? `, ${n} in box` : ""}</span>
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
                  {s === 6 ? "Half dozen" : "Dozen"} · from {money(fromPrice(s, []))}
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
                    <SmartImage src={productPhoto(byId(id)!)} alt="" fill sizes="60px" emoji="🍪" className="object-cover" />
                  </button>
                ) : (
                  <div key={i} className="slot" aria-hidden="true">{i + 1}</div>
                );
              })}
            </div>
            <div className="progress"><span style={{ width: `${(items.length / size) * 100}%` }} /></div>
            <div className="box-meta" aria-live="polite">
              <span>{items.length} of {size} picked</span>
              <span>{full ? money(price) : `from ${money(price)}`}</span>
            </div>
            <button className="btn btn-primary" disabled={!full} onClick={addBox}>
              {full ? `Add box to cart · ${money(price)}` : `Pick ${size - items.length} more`}
            </button>
            <button className="link-btn" onClick={surprise}>Surprise me: fill it randomly</button>
          </aside>
        </div>
      </div>
    </section>
  );
}
