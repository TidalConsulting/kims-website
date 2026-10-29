"use client";

import { PRODUCTS } from "@/lib/data";
import { productPhoto, SECTION_PHOTOS } from "@/lib/photos";
import { money } from "@/lib/utils";
import { useShop } from "@/store/shop";
import FilterLink from "./FilterLink";
import Reveal from "./Reveal";
import SmartImage from "./SmartImage";

const SIGNATURE = PRODUCTS.filter((p) => p.signature);
const FEATS = [["🫘", "Fresh beans"], ["☕", "Small batch"], ["🪑", "Cozy space"], ["🌿", "Eco cups"]];

export default function CoffeeSection() {
  const openModal = useShop((s) => s.openModal);
  return (
    <section className="section coffee" id="coffee">
      <div className="shell">
        <div className="coffee-hero">
          <Reveal>
            <span className="eyebrow text-mint">Premium coffee &amp; more</span>
            <h2>Good coffee brings<span className="hand">better days</span></h2>
            <p>Iced, shaken, whipped or hot, made with house syrups from our own kitchen. Pair any drink with a pastry and save ₱30.</p>
            <FilterLink filter="coffee" className="btn btn-mint">View Coffee Menu →</FilterLink>
            <div className="coffee-feats">
              {FEATS.map(([e, t]) => <div key={t}><span aria-hidden="true">{e}</span>{t}</div>)}
            </div>
          </Reveal>
          <Reveal className="coffee-img">
            <SmartImage src={SECTION_PHOTOS.coffee} alt="Latte art" fill sizes="(max-width: 860px) 100vw, 460px" emoji="☕" className="object-cover" />
          </Reveal>
        </div>
        <Reveal className="section-head justify-center text-center">
          <div>
            <span className="eyebrow text-mint">Popular choices</span>
            <h2 className="text-mint-dark">Our signature drinks</h2>
          </div>
        </Reveal>
        <div className="drinks">
          {SIGNATURE.map((d) => (
            <Reveal className="drink" key={d.id}>
              <div className="circle">
                <SmartImage src={productPhoto(d)} alt={d.name} fill sizes="170px" emoji="☕" className="object-cover" />
              </div>
              <h3>{d.name}</h3>
              <p>{d.desc}</p>
              <span className="price">{money(d.price)}</span>
              <button className="btn btn-mint" onClick={() => openModal({ kind: "quick", id: d.id })}>Order now →</button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
