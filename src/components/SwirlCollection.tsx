"use client";

import { useState } from "react";
import { PRODUCTS } from "@/lib/data";
import { money } from "@/lib/utils";
import { useShop } from "@/store/shop";
import Reveal from "./Reveal";

const ROLLS = PRODUCTS.filter((p) => p.cat === "rolls");

export default function SwirlCollection() {
  const [active, setActive] = useState(ROLLS[0].id);
  const openModal = useShop((s) => s.openModal);
  const r = ROLLS.find((x) => x.id === active)!;

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
              <span className="price text-caramel-2">{money(r.price)}</span>
              <button className="btn btn-primary" onClick={() => openModal({ kind: "quick", id: r.id })}>Customize &amp; add</button>
            </div>
          </div>
        </Reveal>
        <Reveal className="swirl-grid" role="group" aria-label="Cinnamon roll flavors">
          {ROLLS.map((x) => (
            <button
              key={x.id}
              className={`roll ${x.id === active ? "active" : ""}`}
              style={{ background: x.hue }}
              aria-pressed={x.id === active}
              onClick={() => setActive(x.id)}
            >
              <div
                className="ph text-[2rem]"
                aria-hidden="true"
                style={{
                  background: `radial-gradient(circle at 50% 45%, #f6e3c6 0 18%, ${x.hue} 19% 30%, #f1d7b0 31% 42%, ${x.hue} 43% 56%, #e9c89a 57% 70%, ${x.hue} 71%)`,
                }}
              >
                {x.emoji}
              </div>
              <span className="roll-label">{x.name}</span>
            </button>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
