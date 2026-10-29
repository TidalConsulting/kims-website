"use client";

import { OPT, TODAY, type Product } from "@/lib/data";
import { insidePhoto, isPlate, productPhoto } from "@/lib/photos";
import { emojiFor, money } from "@/lib/utils";
import { useShop } from "@/store/shop";
import SmartImage from "./SmartImage";
import { Heart, Plus } from "./icons";

const TAG_CLASS = { Hot: "hot", New: "new", Bestseller: "" } as const;

export default function ProductCard({ p, index, sold, low }: { p: Product; index: number; sold: boolean; low?: number }) {
  const fav = useShop((s) => s.favs.includes(p.id));
  const { toggleFav, openModal, addToCart, showToast } = useShop.getState();
  const emoji = emojiFor(p);
  const plate = isPlate(p);
  const inside = insidePhoto(p);

  const quickAdd = () => {
    if (sold) return showToast(`${p.name} is sold out today. Back ${TODAY.restock}.`);
    if (OPT[p.opt].length) return openModal({ kind: "quick", id: p.id });
    addToCart({ pid: p.id, name: p.name, img: productPhoto(p), price: p.price, opts: "", qty: 1, emoji });
  };

  return (
    <article className={`card ${sold ? "sold" : ""}`} style={{ animationDelay: `${Math.min(index, 12) * 40}ms` }}>
      <div className={`card-img ${plate ? "plate slate-bg" : ""}`} onClick={() => openModal({ kind: "quick", id: p.id })}>
        <SmartImage
          src={productPhoto(p)}
          alt={p.name}
          fill
          sizes="(max-width: 860px) 50vw, (max-width: 1080px) 33vw, 300px"
          emoji={emoji}
          className="object-cover"
        />
        {inside && !sold && (
          <>
            <SmartImage src={inside} alt={`Inside of ${p.name}`} fill sizes="(max-width: 860px) 50vw, (max-width: 1080px) 33vw, 300px" emoji="" className="inside" />
            <span className="inside-hint" aria-hidden="true">{p.cat === "cakes" ? "🍰 See a slice" : "👀 See inside"}</span>
          </>
        )}
        {sold ? (
          <span className="sold-flag">
            <span><b>Sold out today</b><small>Back {TODAY.restock}</small></span>
          </span>
        ) : low ? (
          <span className="tag low">Only {low} left</span>
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
          <button
            className="add"
            aria-label={sold ? `${p.name} is sold out today` : `Add ${p.name}`}
            aria-disabled={sold || undefined}
            title={sold ? "Sold out today" : undefined}
            onClick={quickAdd}
          >
            <Plus />
          </button>
        </div>
      </div>
    </article>
  );
}
