"use client";

import { OPT, type Product } from "@/lib/data";
import { emojiFor, money } from "@/lib/utils";
import { useShop } from "@/store/shop";
import SmartImage from "./SmartImage";
import { Heart, Plus } from "./icons";

const TAG_CLASS = { Hot: "hot", New: "new", Bestseller: "" } as const;

export default function ProductCard({ p, index, available }: { p: Product; index: number; available: boolean }) {
  const fav = useShop((s) => s.favs.includes(p.id));
  const { toggleFav, openModal, addToCart } = useShop.getState();
  const emoji = emojiFor(p);

  const quickAdd = () =>
    OPT[p.opt].length
      ? openModal({ kind: "quick", id: p.id })
      : addToCart({ pid: p.id, name: p.name, img: p.img, price: p.price, opts: "", qty: 1, emoji });

  return (
    <article className={`card ${available ? "" : "sold-out"}`} style={{ animationDelay: `${Math.min(index, 12) * 40}ms` }}>
      <div className="card-img" onClick={() => openModal({ kind: "quick", id: p.id })}>
        <SmartImage src={p.img} alt={p.name} fill sizes="(max-width: 860px) 50vw, (max-width: 1080px) 33vw, 300px" emoji={emoji} />
        {!available ? (
          <span className="tag out">Sold out today</span>
        ) : (
          p.tag && <span className={`tag ${TAG_CLASS[p.tag]}`}>{p.tag}</span>
        )}
        <button className="quick" onClick={(e) => { e.stopPropagation(); openModal({ kind: "quick", id: p.id }); }}>
          Quick view<span className="sr-only">: {p.name}</span>
        </button>
        <button
          className={`fav ${fav ? "on" : ""}`}
          aria-label={`Favorite ${p.name}`}
          aria-pressed={fav}
          onClick={(e) => { e.stopPropagation(); toggleFav(p.id); }}
        >
          <Heart />
        </button>
      </div>
      <div className="card-body">
        <h3>{p.name}</h3>
        <p>{p.desc}</p>
        <div className="card-foot">
          <span className="price">
            {money(p.price)} {p.opt === "cake" && <small>/ slice</small>}
          </span>
          <button className="add" aria-label={`Add ${p.name}`} onClick={quickAdd} disabled={!available}>
            <Plus />
          </button>
        </div>
      </div>
    </article>
  );
}
