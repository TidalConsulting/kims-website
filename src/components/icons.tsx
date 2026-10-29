import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;
const stroke = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, "aria-hidden": true } as const;

export const Heart = (p: P) => (
  <svg {...stroke} {...p}><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" /></svg>
);
export const Plus = (p: P) => <svg {...stroke} strokeWidth={2.4} {...p}><path d="M12 5v14M5 12h14" /></svg>;
export const Search = (p: P) => <svg {...stroke} {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>;
export const Bag = (p: P) => <svg {...stroke} {...p}><path d="M6 7h12l-1 13H7L6 7z" /><path d="M9 7a3 3 0 0 1 6 0" /></svg>;
export const Burger = (p: P) => <svg {...stroke} {...p}><path d="M4 7h16M4 12h16M4 17h10" /></svg>;
export const Close = (p: P) => <svg {...stroke} {...p}><path d="M6 6l12 12M18 6 6 18" /></svg>;
export const Chevron = (p: P) => <svg {...stroke} strokeWidth={2.5} {...p}><path d="m6 9 6 6 6-6" /></svg>;
export const Arrow = (p: P) => <svg {...stroke} {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
export const Prev = (p: P) => <svg {...stroke} {...p}><path d="m15 6-6 6 6 6" /></svg>;
export const Next = (p: P) => <svg {...stroke} {...p}><path d="m9 6 6 6-6 6" /></svg>;
export const Check = (p: P) => <svg {...stroke} strokeWidth={3} {...p}><path d="m5 12 5 5 9-10" /></svg>;
export const Play = (p: P) => <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}><path d="M8 5v14l11-7z" /></svg>;

export const Instagram = (p: P) => (
  <svg {...stroke} {...p}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></svg>
);
export const Facebook = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}><path d="M14 8h3V4h-3a4 4 0 0 0-4 4v2H8v4h2v8h4v-8h3l1-4h-4V8z" /></svg>
);
export const TikTok = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}><path d="M16 3c.3 2.2 1.8 3.8 4 4v3.2c-1.5 0-2.9-.4-4-1.2V15a6 6 0 1 1-6-6v3.3a2.7 2.7 0 1 0 2.7 2.7V3H16z" /></svg>
);
export const Pause = (p: P) => <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}><path d="M7 5h4v14H7zM13 5h4v14h-4z" /></svg>;
