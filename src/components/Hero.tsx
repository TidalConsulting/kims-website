"use client";

import { useEffect, useRef, useState } from "react";
import { SLIDES } from "@/lib/data";
import { heroVideo, localOr } from "@/lib/photos";
import { liveStatus } from "@/lib/utils";
import CountUp from "./CountUp";
import SmartImage from "./SmartImage";
import { useClientValue } from "./hooks";
import { Arrow, Pause, Play } from "./icons";

type Sprinkle = { left: number; size: number; color: string; dur: number; delay: number };
const SPRINKLE_COLORS = ["var(--pink-pop)", "var(--lemon)", "var(--mint)", "var(--sky)", "#B48CFF", "#FF9F6E", "#fff"];

export default function Hero() {
  const [slide, setSlide] = useState(0);
  const [videoReady, setVideoReady] = useState(false);
  const [videoPaused, setVideoPaused] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  const status = useClientValue(() => liveStatus(), 60_000);
  // Random positions are generated client-side only to avoid a hydration mismatch.
  const sprinkles = useClientValue<Sprinkle[]>(() =>
    Array.from({ length: 26 }, () => ({
      left: Math.random() * 100,
      size: 4 + Math.random() * 9,
      color: SPRINKLE_COLORS[Math.floor(Math.random() * SPRINKLE_COLORS.length)],
      dur: 8 + Math.random() * 10,
      delay: Math.random() * 15,
    })),
  );
  // Skip the video for reduced motion or data saver.
  const allowVideo = useClientValue(() => {
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    return heroVideo.length > 0 && !matchMedia("(prefers-reduced-motion: reduce)").matches && !saveData;
  });

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), 7000);
    return () => clearInterval(t);
  }, [slide]);

  const s = SLIDES[slide];
  const showVideo = !!s.video && videoReady;

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (showVideo && !videoPaused) v.play().catch(() => {});
    else v.pause();
  }, [showVideo, videoPaused]);

  return (
    <section className="hero" aria-roledescription="carousel" aria-label="Featured">
      <div className="crumbs" aria-hidden="true">
        {sprinkles?.map((c, i) => (
          <span
            key={i}
            style={{
              left: `${c.left}%`,
              width: c.size * 0.45,
              height: c.size * 1.5,
              background: c.color,
              animationDuration: `${c.dur}s`,
              animationDelay: `-${c.delay}s`,
            }}
          />
        ))}
      </div>
      <div className="shell hero-inner">
        {/* Not a scroll-reveal: the hero is on screen at load, so it must show without waiting for JavaScript. */}
        <div>
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
        </div>
        <div className="hero-visual">
          <div className="hero-ring" />
          <div className="hero-plate">
            {allowVideo && (
              <video
                ref={video}
                className={showVideo ? "on" : ""}
                muted
                loop
                playsInline
                preload="metadata"
                poster={localOr("hero-cookie.jpg", SLIDES[0].img)}
                aria-hidden="true"
                onCanPlay={(e) => { e.currentTarget.playbackRate = 0.6; setVideoReady(true); }}
              >
                {heroVideo.map((v) => <source key={v.src} src={v.src} type={v.type} />)}
              </video>
            )}
            {SLIDES.map((sl, i) => (
              <SmartImage
                key={i}
                src={sl.file ? localOr(sl.file, sl.img) : sl.img}
                alt={i === slide ? sl.e : ""}
                fill
                priority={i === 0}
                sizes="(max-width: 860px) 380px, 560px"
                emoji={sl.emoji}
                className={i === slide ? "slide-on" : ""}
              />
            ))}
          </div>
          <button
            className={`vid-toggle ${showVideo ? "show" : ""}`}
            aria-label={videoPaused ? "Play video" : "Pause video"}
            onClick={() => setVideoPaused((p) => !p)}
          >
            {videoPaused ? <Play /> : <Pause />}
          </button>
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
