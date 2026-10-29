"use client";

import { useEffect, useState } from "react";
import { SLIDES } from "@/lib/data";
import { liveStatus } from "@/lib/utils";
import CountUp from "./CountUp";
import Reveal from "./Reveal";
import SmartImage from "./SmartImage";
import { useClientValue } from "./hooks";
import { Arrow } from "./icons";

type Crumb = { left: number; size: number; dur: number; delay: number };

export default function Hero() {
  const [slide, setSlide] = useState(0);
  const status = useClientValue(() => liveStatus(), 60_000);
  // Random positions are generated client-side only to avoid a hydration mismatch.
  const crumbs = useClientValue<Crumb[]>(() =>
    Array.from({ length: 14 }, () => ({
      left: Math.random() * 100,
      size: 4 + Math.random() * 9,
      dur: 8 + Math.random() * 10,
      delay: Math.random() * 15,
    })),
  );

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), 7000);
    return () => clearInterval(t);
  }, [slide]);

  const s = SLIDES[slide];

  return (
    <section className="hero" aria-roledescription="carousel" aria-label="Featured">
      <div className="crumbs" aria-hidden="true">
        {crumbs?.map((c, i) => (
          <span
            key={i}
            style={{ left: `${c.left}%`, width: c.size, height: c.size * 0.8, animationDuration: `${c.dur}s`, animationDelay: `-${c.delay}s` }}
          />
        ))}
      </div>
      <div className="shell hero-inner">
        <Reveal>
          <span className="eyebrow">{s.e}</span>
          <h1 aria-live="polite">
            {s.t[0]}<br />{s.t[1]} <i>{s.t[2]}</i>
          </h1>
          <p>{s.p}</p>
          <div className="hero-ctas">
            <a href="#menu" className="btn btn-primary">Order for Pickup <Arrow /></a>
            <a href="#box" className="btn btn-ghost">Build a Cookie Box</a>
          </div>
          <div className="hero-meta">
            <div><CountUp end={38} />Things baked daily</div>
            <div><CountUp end={12} />Min avg pickup</div>
            <div><CountUp end={4.9} dec={1} />Avg rating</div>
          </div>
        </Reveal>
        <div className="hero-visual">
          <div className="hero-ring" />
          <div className="hero-plate">
            {SLIDES.map((sl, i) => (
              <SmartImage
                key={sl.img}
                src={sl.img}
                alt={i === slide ? sl.e : ""}
                fill
                priority={i === 0}
                sizes="(max-width: 860px) 380px, 560px"
                emoji={sl.emoji}
                className={i === slide ? "slide-on" : ""}
              />
            ))}
          </div>
          <div className={`chip-float chip-1 ${status && !status.open ? "closed" : ""}`}>
            <span className="dot" />
            <div>
              <b>{status ? (status.open ? "Open now" : "Closed now") : "Hours"}</b>
              <span>{status?.sub ?? "See below"}</span>
            </div>
          </div>
          <div className="chip-float chip-2">
            <span className="text-2xl" aria-hidden="true">🔥</span>
            <div><b>Next batch</b><span>{status?.nextBatch ?? "soon"}</span></div>
          </div>
        </div>
      </div>
      <div className="hero-dots">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            className={i === slide ? "active" : ""}
            aria-label={`Slide ${i + 1}`}
            aria-current={i === slide}
            onClick={() => setSlide(i)}
          />
        ))}
      </div>
    </section>
  );
}
