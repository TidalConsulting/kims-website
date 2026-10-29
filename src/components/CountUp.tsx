"use client";

import { useEffect, useRef, useState } from "react";

/** Animates from 0 (or end-30 for years) to `end` once it scrolls into view. */
export default function CountUp({ end, dec = 0, suffix = "" }: { end: number; dec?: number; suffix?: string }) {
  const ref = useRef<HTMLElement>(null);
  const start = end > 1000 ? end - 30 : 0;
  const [v, setV] = useState(start);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const io = new IntersectionObserver(([en]) => {
      if (!en.isIntersecting) return;
      io.disconnect();
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return setV(end);
      const t0 = performance.now();
      const step = (t: number) => {
        const k = Math.min(1, (t - t0) / 1400);
        setV(start + (end - start) * (1 - Math.pow(1 - k, 3)));
        if (k < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, { threshold: 0.15 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [end, start]);
  return <b ref={ref}>{v.toFixed(dec) + suffix}</b>;
}
