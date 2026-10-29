"use client";

import { useEffect, useRef, useState } from "react";
import { CATS } from "@/lib/data";
import { useShop } from "@/store/shop";
import FilterLink from "./FilterLink";
import { useFocusTrap, useScrollLock } from "./hooks";
import { Close } from "./icons";

export default function MobileNav() {
  const open = useShop((s) => s.mobileOpen);
  const setOpen = useShop((s) => s.setMobileOpen);
  const [sub, setSub] = useState(false);
  const ref = useRef<HTMLElement>(null);
  useFocusTrap(ref, open);
  useScrollLock(open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  const close = () => setOpen(false);

  return (
    <nav ref={ref} id="mobile-nav" className={`mobile-nav ${open ? "open" : ""}`} aria-label="Mobile" inert={!open}>
      <button className="icon-btn mobile-close" aria-label="Close menu" onClick={close}><Close /></button>
      <a href="#top" onClick={close}>Home</a>
      <button className="m-link" aria-expanded={sub} aria-controls="m-sub" onClick={() => setSub((s) => !s)}>
        Menu {sub ? "−" : "+"}
      </button>
      <div className="sub" id="m-sub" hidden={!sub}>
        {CATS.map((c) => (
          <FilterLink key={c.id} filter={c.id}>{c.emoji} {c.name}</FilterLink>
        ))}
      </div>
      <a href="#cookies" onClick={close}>Meet the Menu</a>
      <a href="#box" onClick={close}>Build a Box</a>
      <a href="#coffee" onClick={close}>Coffee</a>
      <a href="#story" onClick={close}>Our Story</a>
      <a href="#visit" onClick={close}>Visit &amp; Contact</a>
      <a href="#menu" onClick={close} className="btn btn-primary mt-6 flex justify-center border-none font-sans text-base">
        Start an Order
      </a>
    </nav>
  );
}
