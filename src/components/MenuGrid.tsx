"use client";

import { CATS, PRODUCTS } from "@/lib/data";
import { isAvailable, shopNow } from "@/lib/utils";
import { useShop, type Sort } from "@/store/shop";
import ProductCard from "./ProductCard";
import Reveal from "./Reveal";
import { useClientValue } from "./hooks";
import { Search } from "./icons";

const TABS = [{ id: "all" as const, name: "All", emoji: "" }, ...CATS];

export default function MenuGrid() {
  const { filter, query, sort, favs, setFilter, setQuery, setSort } = useShop();
  const day = useClientValue(() => shopNow().day);

  const q = query.trim().toLowerCase();
  let list = PRODUCTS.filter(
    (p) => (filter === "all" || p.cat === filter) && (p.name + " " + p.desc).toLowerCase().includes(q),
  );
  if (sort === "low") list = [...list].sort((a, b) => a.price - b.price);
  if (sort === "high") list = [...list].sort((a, b) => b.price - a.price);
  if (sort === "az") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
  if (sort === "fav") list = list.filter((p) => favs.includes(p.id));

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
        <div className="grid" aria-live="polite">
          {list.length ? (
            list.map((p, i) => (
              <ProductCard key={p.id} p={p} index={i} available={day === null || isAvailable(p, day)} />
            ))
          ) : (
            <div className="empty">
              {sort === "fav" ? "No favorites yet. Tap the ♥ on anything you love." : 'Nothing matches that search. Try "chocolate" or "latte".'}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
