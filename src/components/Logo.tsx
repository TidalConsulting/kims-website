import Image from "next/image";
import { BUSINESS } from "@/lib/data";
import iconDark from "../../public/brand/logo-icon-dark.png";
import iconLight from "../../public/brand/logo-icon.png";

/**
 * Coffee Crumble lockup (docs/brand/Coffee_Crumble_Logo.pdf, page 4): the cookie-in-a-cup icon
 * beside the two-colour wordmark, set in the site's own fonts so it stays crisp at any size.
 * "light" is for light backgrounds (header), "dark" for dark ones (footer).
 */
export default function Logo({ variant = "light" }: { variant?: "light" | "dark" }) {
  const dark = variant === "dark";
  const [first, ...rest] = BUSINESS.name.split(" ");
  return (
    <a href="#top" className={`logo ${dark ? "logo-dark" : ""}`} aria-label={`${BUSINESS.name} home`}>
      <Image src={dark ? iconDark : iconLight} alt="" width={44} height={44} className="logo-icon" priority={!dark} />
      <span>
        <span className="logo-word">
          {first} <em>{rest.join(" ")}</em>
        </span>
        <small>{dark ? BUSINESS.taglineShort : BUSINESS.slogan}</small>
      </span>
    </a>
  );
}
