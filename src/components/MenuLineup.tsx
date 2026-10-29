"use client";

import { useState, type CSSProperties } from "react";
import { CATS, PRODUCTS, type CategoryId } from "@/lib/data";
import { insideLabel, insidePhoto, notesLabel, productPhoto } from "@/lib/photos";
import { emojiFor, isSold, lowStock, money } from "@/lib/utils";
import { useShop } from "@/store/shop";
import Reveal from "./Reveal";
import SmartImage from "./SmartImage";
import { useShopNow } from "./hooks";

/** Tabs of the "Meet the menu" section, with each tab's heading. */
const LINE: Partial<Record<CategoryId, { title: [string, string]; sub: string }>> = {
  cookies: { title: ["Eight cookies.", "Eight gooey centers."], sub: "Every cookie is stuffed. Here's what each one looks like on the outside, and what's waiting inside." },
  cakes: { title: ["Twelve cakes.", "Every layer counts."], sub: "See each cake whole, then sliced, so you know exactly what you're getting." },
  pastries: { title: ["Fourteen pastries.", "Baked every morning."], sub: "Laminated, glazed, filled and fresh out of the oven at 7am." },
  coffee: { title: ["Ten coffees.", "One for every craving."], sub: "Iced, shaken, whipped or hot. Here's exactly what goes in each cup." },
  refreshments: { title: ["Twelve iced teas.", "Brewed fresh daily."], sub: "Real fruit, fresh herbs and a touch of honey. No powders." },
};
const TABS = (Object.keys(LINE) as CategoryId[]).map((id) => CATS.find((c) => c.id === id)!);

/**
 * "Meet the menu": one row per product (photo · number · name in its own colour · price),
 * then the inside/slice photo, or a "What's in it" / "Tasting notes" panel.
 */
export default function MenuLineup() {
  const [cat, setCat] = useState<CategoryId>("cookies");
  const openModal = useShop((s) => s.openModal);
  const now = useShopNow();
  const line = LINE[cat]!;

  return (
    <section className="section lineup" id="cookies">
      <div className="shell">
        <Reveal className="section-head">
          <div>
            <span className="eyebrow">Meet the menu</span>
            <h2>{line.title[0]}<br />{line.title[1]}</h2>
            <p>{line.sub}</p>
          </div>
          <a href="#box" className="btn btn-primary">Build a box of 6 or 12</a>
        </Reveal>
        <div className="tabs mb-6" role="group" aria-label="Choose a menu section">
          {TABS.map((c) => (
            <button key={c.id} className={`tab ${cat === c.id ? "active" : ""}`} aria-pressed={cat === c.id} onClick={() => setCat(c.id)}>
              {c.emoji} {c.name}
            </button>
          ))}
        </div>
        <div className="lineup-list">
          {PRODUCTS.filter((p) => p.cat === cat).map((c, i) => {
            const sold = isSold(c, now);
            const low = lowStock(c, now);
            const inside = insidePhoto(c);
            const open = () => openModal({ kind: "quick", id: c.id });
            return (
              <article
                key={c.id}
                className={`lrow ${sold ? "sold" : ""}`}
                style={{ "--hue": c.hue ?? "var(--pink-pop)" } as CSSProperties}
                onClick={open}
              >
                <div className="whole">
                  <SmartImage src={productPhoto(c)} alt={c.name} fill sizes="(max-width: 860px) 110px, 200px" emoji={emojiFor(c)} className="object-cover" />
                </div>
                <div>
                  <span className="num">No. {String(i + 1).padStart(2, "0")}</span>
                  <h3>{c.name}</h3>
                  <p>{c.desc}</p>
                  {c.filling && <p className="mt-1.5"><b className="text-plum">Inside:</b> {c.filling}</p>}
                  <div className="lfoot">
                    <span className="price">
                      {money(c.price)}
                      {c.cat === "cakes" && <small className="text-[.7rem] text-muted"> / slice</small>}
                    </span>
                    {sold ? (
                      <span className="soldpill">Sold out today</span>
                    ) : (
                      <button className="btn btn-dark" onClick={(e) => { e.stopPropagation(); open(); }}>
                        Add to order<span className="sr-only">: {c.name}</span>
                      </button>
                    )}
                    {low && <span className="text-[.82rem] font-bold text-pink">⏳ Only {low} left</span>}
                  </div>
                </div>
                {inside ? (
                  <div className="in">
                    <SmartImage src={inside} alt={`${insideLabel(c)} of ${c.name}`} fill sizes="(max-width: 860px) 100vw, 260px" emoji={emojiFor(c)} className="object-cover" />
                    <span>{insideLabel(c)}</span>
                  </div>
                ) : (
                  <div className="in notes">
                    <b>{notesLabel(c)}</b>
                    <div className="chips">{(c.notes ?? []).map((n) => <span key={n}>{n}</span>)}</div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
