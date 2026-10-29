"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { shopNow } from "@/lib/utils";

/** Adds `.in` to the element when it scrolls into view (CSS handles the animation). */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([en]) => {
        if (en.isIntersecting) {
          el.classList.add("in");
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

/** Keeps Tab focus inside `ref` while active and restores focus to the opener on close. */
export function useFocusTrap(ref: RefObject<HTMLElement | null>, active: boolean) {
  useEffect(() => {
    const root = ref.current;
    if (!active || !root) return;
    const opener = document.activeElement as HTMLElement | null;
    const focusables = () =>
      [...root.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )].filter((el) => el.offsetParent !== null || el === document.activeElement);

    // Wait a frame so content rendered in the same commit is focusable.
    const raf = requestAnimationFrame(() => (focusables()[0] ?? root).focus());
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const list = focusables();
      if (!list.length) return;
      const first = list[0], last = list[list.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      else if (!root.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKey);
      opener?.focus?.();
    };
  }, [ref, active]);
}

/** Locks page scroll while `locked` is true. */
export function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [locked]);
}

/** Value that is only known on the client (time of day, viewport, …). Null during SSR. */
export function useClientValue<T>(compute: () => T, intervalMs?: number) {
  const [v, setV] = useState<T | null>(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only value, intentionally deferred past hydration
    setV(compute());
    if (!intervalMs) return;
    const t = setInterval(() => setV(compute()), intervalMs);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intervalMs]);
  return v;
}

/** The shop's current day, hour and date (Manila time). Null during server rendering. */
export const useShopNow = () => useClientValue(() => shopNow(), 60_000);
