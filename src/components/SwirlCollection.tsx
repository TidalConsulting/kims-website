"use client";

import { useState } from "react";
import { PRODUCTS, TODAY } from "@/lib/data";
import { productPhoto } from "@/lib/photos";
import { isSold, lowStock, money } from "@/lib/utils";
import { useShop } from "@/store/shop";
import Reveal from "./Reveal";
import SmartImage from "./SmartImage";

const ROLLS = PRODUCTS.filter((p) => p.cat === "rolls");

export default function SwirlCollection() {
  const [active, setActive] = useState(ROLLS[0].id);
  const openModal = useShop((s) => s.openModal);
  const r = ROLLS.find((x) => x.id === active)!;
  const low = lowStock(r);

  return (
    <section className="section swirl" id="swirl">
      <div className="shell swirl-layout">
        <Reveal>
          <span className="eyebrow">The Swirl Collection</span>
          <h2>Nine rolls.<br />One <i>obsession.</i></h2>
          <p className="lead">
            Brioche dough, rested overnight, rolled with brown sugar and Saigon cinnamon. Then we go a little wild with the toppings. Tap a roll to meet it.
          </p>
          <div className="swirl-detail" aria-live="polite">
            <h3>{r.emoji} {r.name}</h3>
            <p>{r.desc}</p>
            <div className="row">
              <span className="price text-pink-2">{money(r.price)}</span>
              {isSold(r) ? (
                <span className="text-sm font-semibold text-pink-2">Sold out today · back {TODAY.restock}</span>
              ) : (
                <button className="btn btn-primary" onClick={() => openModal({ kind: "quick", id: r.id })}>Customize &amp; add</button>
              )}
            </div>
            {low && <p className="mt-2.5 mb-0 text-[.8rem]">⏳ Only {low} left today</p>}
          </div>
        </Reveal>
        <Reveal className="swirl-grid" role="group" aria-label="Cinnamon roll flavors">
          {ROLLS.map((x) => (
            <button
              key={x.id}
              className={`roll ${x.id === active ? "active" : ""} ${isSold(x) ? "sold" : ""}`}
              aria-pressed={x.id === active}
              aria-label={isSold(x) ? `${x.name} (sold out today)` : x.name}
              onClick={() => setActive(x.id)}
            >
              <SmartImage src={productPhoto(x)} alt="" fill sizes="(max-width: 860px) 30vw, 220px" emoji={x.emoji} className="object-cover" />
              <span className="roll-label">{x.name}</span>
            </button>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
