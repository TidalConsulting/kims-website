import { CATS } from "@/lib/data";
import FilterLink from "./FilterLink";
import Reveal from "./Reveal";
import SmartImage from "./SmartImage";

export default function CategoryStrip() {
  return (
    <section className="cats" aria-label="Categories">
      <div className="shell cat-row">
        {CATS.map((c) => (
          <Reveal key={c.id}>
            <FilterLink filter={c.id} className="cat block">
              <div className="thumb">
                <SmartImage src={c.img} alt="" fill sizes="108px" emoji={c.emoji} className="object-cover" />
              </div>
              <b>{c.name}</b>
              <small>Explore</small>
            </FilterLink>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
