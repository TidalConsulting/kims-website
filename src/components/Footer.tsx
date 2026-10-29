import { BUSINESS } from "@/lib/data";
import FilterLink from "./FilterLink";
import InfoLink from "./InfoLink";
import { Facebook, Instagram, LogoMark, TikTok } from "./icons";

export default function Footer() {
  return (
    <footer>
      <div className="shell foot-grid">
        <div>
          <a href="#top" className="logo">
            <span className="logo-mark"><LogoMark /></span>
            <span>{BUSINESS.name}</span>
          </a>
          <p className="mt-3.5 max-w-[30ch]">Baked slow. Brewed bold. Made for the little moments.</p>
          <div className="socials">
            <a href={BUSINESS.socials.instagram} aria-label="Instagram"><Instagram /></a>
            <a href={BUSINESS.socials.facebook} aria-label="Facebook"><Facebook /></a>
            <a href={BUSINESS.socials.tiktok} aria-label="TikTok"><TikTok /></a>
          </div>
        </div>
        <nav aria-label="Shop">
          <h2 className="foot-h">Shop</h2>
          <ul>
            <li><FilterLink filter="cookies">Cookies</FilterLink></li>
            <li><FilterLink filter="cakes">Cakes</FilterLink></li>
            <li><FilterLink filter="pastries">Pastries</FilterLink></li>
            <li><FilterLink filter="rolls">Cinnamon Rolls</FilterLink></li>
            <li><a href="#box">Gift Boxes</a></li>
          </ul>
        </nav>
        <nav aria-label="Café">
          <h2 className="foot-h">Café</h2>
          <ul>
            <li><FilterLink filter="coffee">Coffee</FilterLink></li>
            <li><FilterLink filter="refreshments">Iced Teas</FilterLink></li>
            <li><a href="#visit">Reservations</a></li>
            <li><a href="#visit">Catering</a></li>
          </ul>
        </nav>
        <nav aria-label="Help">
          <h2 className="foot-h">Help</h2>
          <ul>
            <li><InfoLink page="delivery">Pickup &amp; Delivery</InfoLink></li>
            <li><InfoLink page="allergens">Allergens</InfoLink></li>
            <li><InfoLink page="faq">FAQ</InfoLink></li>
            <li><InfoLink page="privacy">Privacy</InfoLink></li>
          </ul>
        </nav>
        <div>
          <h2 className="foot-h">Contact</h2>
          <ul>
            <li><a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a></li>
            <li><a href={`tel:${BUSINESS.phone.replace(/[^\d+]/g, "")}`}>{BUSINESS.phone}</a></li>
            <li>{BUSINESS.street}<br />{BUSINESS.city}, {BUSINESS.region} {BUSINESS.postalCode}</li>
          </ul>
        </div>
      </div>
      <div className="shell foot-bottom">
        <span>© {new Date().getFullYear()} {BUSINESS.name}. All rights reserved.</span>
        <span>Made fresh daily ♥</span>
      </div>
    </footer>
  );
}
