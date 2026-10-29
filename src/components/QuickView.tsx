"use client";

import { useState } from "react";
import { CATS, OPT, TODAY, type Product } from "@/lib/data";
import { insidePhoto, isPlate, productPhoto } from "@/lib/photos";
import { calcPrice, emojiFor, isSold, lowStock, money, optLabel, shopNow } from "@/lib/utils";
import { useShop } from "@/store/shop";
import SmartImage from "./SmartImage";

export default function QuickView({ p }: { p: Product }) {
  const groups = OPT[p.opt];
  const [sel, setSel] = useState(() => groups.map(() => 0));
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState("");
  const [view, setView] = useState<"whole" | "inside">("whole");
  const inside = insidePhoto(p);
  const { addToCart, closeAll } = useShop.getState();
  const price = calcPrice(p, sel);
  const now = shopNow();
  const sold = isSold(p, now);
  const low = lowStock(p, now);
  const emoji = emojiFor(p);

  const add = () => {
    const optsText = groups.map((g, i) => g.choices[sel[i]].l).join(" · ");
    const n = note.trim();
    addToCart({
      pid: p.id,
      name: p.name,
      img: productPhoto(p),
      price,
      opts: optsText + (n ? (optsText ? " · " : "") + `“${n}”` : ""),
      qty,
      emoji,
    });
    closeAll();
  };

  return (
    <div className="qv">
      <div className={`qv-img ${isPlate(p) ? "plate slate-bg" : ""} ${view === "inside" ? "show-inside" : ""}`}>
        <SmartImage src={productPhoto(p)} alt={p.name} fill sizes="(max-width: 860px) 100vw, 460px" emoji={emoji} className="object-cover" />
        {inside && (
          <>
            <SmartImage src={inside} alt={`Inside of ${p.name}`} fill sizes="(max-width: 860px) 100vw, 460px" emoji="" className="inside" />
            <div className="view-toggle" role="radiogroup" aria-label="Photo">
              {(["whole", "inside"] as const).map((v) => (
                <button key={v} role="radio" aria-checked={view === v} className={view === v ? "active" : ""} onClick={() => setView(v)}>
                  {v === "whole" ? "Whole" : "Inside"}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
      <div className="qv-body">
        <span className="eyebrow">{CATS.find((c) => c.id === p.cat)?.name}</span>
        <h3 id="modal-title">{p.name}</h3>
        <p className="desc">{p.desc}</p>
        {p.filling && <p className="mt-2 text-[.88rem]"><b className="text-pink">Inside:</b> {p.filling}</p>}
        {low && <p className="mt-2.5 text-sm font-semibold text-grape">⏳ Only {low} left from this morning&apos;s batch</p>}
        {groups.map((g, gi) => (
          <div className="opt-group" key={g.name} role="radiogroup" aria-label={g.name}>
            <h6>{g.name}</h6>
            <div className="opts">
              {g.choices.map((c, ci) => (
                <button
                  key={c.l}
                  role="radio"
                  aria-checked={sel[gi] === ci}
                  className={`opt ${sel[gi] === ci ? "active" : ""}`}
                  onClick={() => setSel((s) => s.map((v, i) => (i === gi ? ci : v)))}
                >
                  {c.l}
                  {optLabel(p, c) && <small>{optLabel(p, c)}</small>}
                </button>
              ))}
            </div>
          </div>
        ))}
        <div className="opt-group">
          <h6><label htmlFor="qvNote">Special requests</label></h6>
          <textarea
            id="qvNote"
            className="note-input"
            rows={2}
            placeholder="e.g. 'Happy Birthday Sam' on the cake, extra hot…"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
        <div className="qv-foot">
          {sold ? (
            <button className="btn btn-dark opacity-50" disabled>Sold out today · back {TODAY.restock}</button>
          ) : (
            <>
              <div className="stepper">
                <button aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
                <span aria-live="polite">{qty}</span>
                <button aria-label="Increase quantity" onClick={() => setQty((q) => q + 1)}>+</button>
              </div>
              <button className="btn btn-dark" onClick={add}>Add to order · {money(price * qty)}</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
