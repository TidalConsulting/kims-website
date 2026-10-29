"use client";

import type { CSSProperties } from "react";
import { PRODUCTS } from "@/lib/data";
import { insidePhoto, productPhoto } from "@/lib/photos";
import { isSold, lowStock, money } from "@/lib/utils";
import { useShop } from "@/store/shop";
import Reveal from "./Reveal";
import SmartImage from "./SmartImage";
import { useShopNow } from "./hooks";

const COOKIES = PRODUCTS.filter((p) => p.cat === "cookies");

/** "Meet the cookies": each cookie as a row (whole · name in its own colour · inside shot). */
export default function CookieLineup() {
  const openModal = useShop((s) => s.openModal);
  const now = useShopNow();

  return (
    <section className="section lineup" id="cookies">
      <div className="shell">
        <Reveal className="section-head">
          <div>
            <span className="eyebrow">The cookie lineup</span>
            <h2>Eight cookies.<br />Eight gooey centers.</h2>
            <p>Every cookie is stuffed. Here&apos;s what each one looks like on the outside, and what&apos;s waiting inside.</p>
          </div>
          <a href="#box" className="btn btn-primary">Build a box of 6 or 12</a>
        </Reveal>
        <div className="lineup-list">
          {COOKIES.map((c, i) => {
            const sold = isSold(c, now);
            const low = lowStock(c, now);
            const inside = insidePhoto(c);
            const open = () => openModal({ kind: "quick", id: c.id });
            return (
              <Reveal
                as="article"
                key={c.id}
                className={`lrow ${sold ? "sold" : ""}`}
                style={{ "--hue": c.hue } as CSSProperties}
                onClick={open}
              >
                <div className="whole">
                  <SmartImage src={productPhoto(c)} alt={c.name} fill sizes="(max-width: 860px) 110px, 200px" emoji="🍪" className="object-cover" />
                </div>
                <div>
                  <span className="num">No. {String(i + 1).padStart(2, "0")}</span>
                  <h3>{c.name}</h3>
                  <p>{c.desc}</p>
                  <p className="mt-1.5"><b className="text-plum">Inside:</b> {c.filling}</p>
                  <div className="lfoot">
                    <span className="price">{money(c.price)}</span>
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
                <div className="in">
                  {inside ? (
                    <SmartImage src={inside} alt={`Inside of ${c.name}`} fill sizes="(max-width: 860px) 100vw, 260px" emoji="🍪" className="object-cover" />
                  ) : (
                    <div className="ph" aria-hidden="true">🍪</div>
                  )}
                  <span>Inside</span>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
