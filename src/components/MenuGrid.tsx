"use client";

import { useState } from "react";
import { CATS, PRODUCTS, TODAY } from "@/lib/data";
import { isSold, lowStock } from "@/lib/utils";
import { useShop, type Sort } from "@/store/shop";
import ProductCard from "./ProductCard";
import Reveal from "./Reveal";
import { useShopNow } from "./hooks";
import { Search } from "./icons";

const TABS = [{ id: "all" as const, name: "All", emoji: "" }, ...CATS];

/** Cards shown at first and added per "Show more". Keeps the page short and fast on phones. */
const PAGE = 8;

export default function MenuGrid() {
  const { filter, query, sort, favs, setFilter, setQuery, setSort } = useShop();
  const now = useShopNow();
  // How many cards to show; resets whenever the category, search or sort changes.
  const view = `${filter}|${query}|${sort}`;
  const [shown, setShown] = useState({ view, count: PAGE });
  const count = shown.view === view ? shown.count : PAGE;

  const q = query.trim().toLowerCase();
  let list = PRODUCTS.filter(
    (p) => (filter === "all" || p.cat === filter) && (p.name + " " + p.desc).toLowerCase().includes(q),
  );
  if (sort === "low") list = [...list].sort((a, b) => a.price - b.price);
  if (sort === "high") list = [...list].sort((a, b) => b.price - a.price);
  if (sort === "az") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
  if (sort === "fav") list = list.filter((p) => favs.includes(p.id));
  // Sold-out items sink to the bottom (a stable sort keeps the chosen order otherwise).
  list = [...list].sort((a, b) => Number(isSold(a, now)) - Number(isSold(b, now)));
  const soldHere = PRODUCTS.filter((p) => isSold(p, now) && (filter === "all" || p.cat === filter));
  const visible = list.slice(0, count);
  const left = list.length - visible.length;

  return (
    <section className="section" id="menu">
      <div className="shell">
        <Reveal className="section-head">
          <div>
            <span className="eyebrow">Our Menu</span>
            <h2>Handcrafted. Heartfelt. Irresistible.</h2>
            <p>Tap any item to customize it: size, milk, slice or whole cake, half dozen or dozen.</p>
          </div>
        </Reveal>
        <div className="menu-tools">
          <div className="tabs" role="group" aria-label="Filter by category">
            {TABS.map((c) => (
              <button
                key={c.id}
                className={`tab ${filter === c.id ? "active" : ""}`}
                aria-pressed={filter === c.id}
                onClick={() => setFilter(c.id)}
              >
                {c.emoji ? c.emoji + " " : ""}{c.name}
              </button>
            ))}
          </div>
          <div className="tools-right">
            <label className="search">
              <Search />
              <input
                id="searchInput"
                type="search"
                placeholder="Search treats & drinks…"
                aria-label="Search menu"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
            <select className="select" aria-label="Sort" value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
              <option value="featured">Featured</option>
              <option value="low">Price: Low → High</option>
              <option value="high">Price: High → Low</option>
              <option value="az">A → Z</option>
              <option value="fav">My Favorites</option>
            </select>
          </div>
        </div>
        {soldHere.length > 0 && (
          <div className="sold-strip">
            <span>🔥 <b>Sold out today:</b></span>
            {soldHere.map((p) => <span className="pill" key={p.id}>{p.name}</span>)}
            <span className="ml-auto text-muted">Fresh batch {TODAY.restock}</span>
          </div>
        )}
        <div className="grid" aria-live="polite">
          {list.length ? (
            visible.map((p, i) => (
              <ProductCard key={p.id} p={p} index={i} sold={isSold(p, now)} low={lowStock(p, now)} />
            ))
          ) : (
            <div className="empty">
              {sort === "fav" ? "No favorites yet. Tap the ♥ on anything you love." : 'Nothing matches that search. Try "chocolate" or "latte".'}
            </div>
          )}
        </div>
        {left > 0 && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button className="btn btn-dark" onClick={() => setShown({ view, count: count + PAGE })}>
              Show {Math.min(PAGE, left)} more
            </button>
            <button className="btn btn-ghost text-plum" onClick={() => setShown({ view, count: list.length })}>
              Show all {list.length}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
