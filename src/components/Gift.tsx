import { SECTION_PHOTOS } from "@/lib/photos";
import Reveal from "./Reveal";
import SmartImage from "./SmartImage";

export default function Gift() {
  return (
    <section className="section pb-0">
      <div className="shell">
        <Reveal className="gift">
          <div className="gift-img">
            <SmartImage src={SECTION_PHOTOS.gift} alt="Cookies arranged for gifting" fill sizes="(max-width: 860px) 100vw, 620px" emoji="🎁" className="object-cover" />
          </div>
          <div className="gift-text">
            <span className="eyebrow">Gift boxes &amp; catering</span>
            <h2>Perfect for gifting.<br />Perfect for sharing.</h2>
            <a href="#box" className="btn btn-primary">Build a gift box</a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
