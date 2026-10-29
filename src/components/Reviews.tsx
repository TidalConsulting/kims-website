"use client";

import { useEffect, useRef, useState } from "react";
import { REVIEWS, REVIEWS_ARE_SAMPLES } from "@/lib/data";
import Reveal from "./Reveal";
import { Next, Prev } from "./icons";

// NOTE: REVIEWS are placeholders. Replace with real ones (e.g. from Google Business Profile) before launch.
export default function Reviews() {
  const [i, setI] = useState(0);
  const [offset, setOffset] = useState(0);
  const track = useRef<HTMLDivElement>(null);

  const perView = () => (innerWidth < 860 ? 1 : 3);
  const move = (d: number) => setI((cur) => Math.max(0, Math.min(REVIEWS.length - perView(), cur + d)));

  // Recompute pixel offset on index change and on resize.
  useEffect(() => {
    const measure = () => {
      const card = track.current?.firstElementChild as HTMLElement | null;
      const clamped = Math.min(i, REVIEWS.length - perView());
      setOffset(card ? clamped * (card.offsetWidth + 22) : 0);
    };
    measure();
    addEventListener("resize", measure);
    return () => removeEventListener("resize", measure);
  }, [i]);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((cur) => (cur >= REVIEWS.length - perView() ? 0 : cur + 1)), 6000);
    return () => clearInterval(t);
  }, [i]);

  return (
    <section className="section reviews" aria-roledescription="carousel" aria-label="Customer reviews">
      <div className="shell">
        <Reveal className="section-head">
          <div>
            <span className="eyebrow">Loved by many</span>
            <h2>{REVIEWS_ARE_SAMPLES ? "What guests will say." : "Real smiles. Real reviews."}</h2>
            {REVIEWS_ARE_SAMPLES && <p>Sample reviews shown for layout. Real Google reviews go here before launch.</p>}
          </div>
          <div className="rev-nav">
            <button className="circle-btn" aria-label="Previous review" onClick={() => move(-1)}><Prev /></button>
            <button className="circle-btn" aria-label="Next review" onClick={() => move(1)}><Next /></button>
          </div>
        </Reveal>
        <div className="rev-track-wrap">
          <div className="rev-track" ref={track} style={{ transform: `translateX(${-offset}px)` }}>
            {REVIEWS.map((r, k) => (
              <figure className="rev" key={k}>
                <div className="stars" role="img" aria-label={`${r.s} out of 5 stars`}>
                  {"★".repeat(r.s)}{"☆".repeat(5 - r.s)}
                </div>
                <blockquote><p>“{r.t}”</p></blockquote>
                <figcaption className="who"><span className="avatar" aria-hidden="true">★</span>{r.n}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
