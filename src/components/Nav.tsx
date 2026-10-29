"use client";

import { useEffect, useRef, useState } from "react";
import { BUSINESS, CATS } from "@/lib/data";
import { SECTION_PHOTOS } from "@/lib/photos";
import { cartCount, useShop } from "@/store/shop";
import FilterLink from "./FilterLink";
import SmartImage from "./SmartImage";
import { Bag, Burger, Chevron, Heart, LogoMark, Search } from "./icons";

const BAKERY = CATS.slice(0, 4);
const CAFE = CATS.slice(4);

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mega, setMega] = useState(false);
  const megaRef = useRef<HTMLLIElement>(null);
  const cart = useShop((s) => s.cart);
  const favs = useShop((s) => s.favs);
  const bump = useShop((s) => s.bump);
  const { openDrawer, setMobileOpen, setSort, setFilter } = useShop.getState();
  const n = cartCount(cart);

  useEffect(() => {
    const onScroll = () => setScrolled(scrollY > 10);
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mega) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMega(false);
        megaRef.current?.querySelector("button")?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mega]);

  const goMenu = (focusSearch: boolean) => {
    location.hash = "menu";
    if (focusSearch) setTimeout(() => document.getElementById("searchInput")?.focus(), 400);
  };

  return (
    <header className={`nav ${scrolled ? "scrolled" : ""}`}>
      <div className="shell nav-inner">
        <a href="#top" className="logo" aria-label={`${BUSINESS.name} home`}>
          <span className="logo-mark"><LogoMark /></span>
          <span>{BUSINESS.name}<small>{BUSINESS.tagline}</small></span>
        </a>

        <ul className="nav-links">
          <li><a href="#top">Home</a></li>
          <li
            ref={megaRef}
            className={`has-mega ${mega ? "open" : ""}`}
            onMouseEnter={() => setMega(true)}
            onMouseLeave={() => setMega(false)}
            onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setMega(false); }}
          >
            <button aria-haspopup="true" aria-expanded={mega} aria-controls="mega-menu" onClick={() => setMega((m) => !m)}>
              Menu <Chevron className="chev" />
            </button>
            <div className="mega" id="mega-menu" inert={!mega}>
              <div>
                <h4>Bakery</h4>
                {BAKERY.map((c) => (
                  <FilterLink key={c.id} filter={c.id} onClick={() => setMega(false)}>
                    <span className="ico">{c.emoji}</span><span>{c.name}<em>{c.blurb}</em></span>
                  </FilterLink>
                ))}
              </div>
              <div>
                <h4>Café</h4>
                {CAFE.map((c) => (
                  <FilterLink key={c.id} filter={c.id} onClick={() => setMega(false)}>
                    <span className="ico">{c.emoji}</span><span>{c.name}<em>{c.blurb}</em></span>
                  </FilterLink>
                ))}
                <a href="#box" onClick={() => setMega(false)}><span className="ico">🎁</span><span>Build a Box<em>Mix 6 or 12 cookies</em></span></a>
                <FilterLink filter="all" onClick={() => setMega(false)}><span className="ico">📋</span><span>Full Menu<em>See everything</em></span></FilterLink>
              </div>
              <a href="#swirl" className="mega-feature" onClick={() => setMega(false)}>
                <SmartImage src={SECTION_PHOTOS.swirlFeature} alt="" fill sizes="200px" emoji="" style={{ objectFit: "cover", opacity: 0.55 }} />
                <small>NEW THIS SEASON</small>
                <b>The Swirl Collection →</b>
              </a>
            </div>
          </li>
          <li><a href="#cookies">Meet the Menu</a></li>
          <li><a href="#box">Build a Box</a></li>
          <li><a href="#coffee">Coffee</a></li>
          <li><a href="#story">Our Story</a></li>
          <li><a href="#visit">Visit</a></li>
        </ul>

        <div className="nav-actions">
          <button className="icon-btn" aria-label="Search the menu" onClick={() => goMenu(true)}>
            <Search />
          </button>
          <button
            className="icon-btn"
            aria-label={`Favorites (${favs.length})`}
            onClick={() => { setSort("fav"); setFilter("all"); goMenu(false); }}
          >
            <Heart />
            <span className={`badge ${favs.length ? "show" : ""}`} aria-hidden="true">{favs.length}</span>
          </button>
          <button className="icon-btn" aria-label={`Open cart (${n} items)`} onClick={openDrawer}>
            <Bag />
            <span key={bump} className={`badge ${n ? "show" : ""} ${bump ? "bump" : ""}`} aria-hidden="true">{n}</span>
          </button>
          <a href="#menu" className="btn btn-dark nav-cta">Order Now</a>
          <button className="icon-btn burger" aria-label="Open menu" aria-expanded={false} aria-controls="mobile-nav" onClick={() => setMobileOpen(true)}>
            <Burger />
          </button>
        </div>
      </div>
    </header>
  );
}
