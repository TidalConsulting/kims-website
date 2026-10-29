import { ADDRESS, BUSINESS, CATS, CURRENCY, HOURS, PRODUCTS, SITE_URL } from "./data";

const pad = (h: number) => `${String(h).padStart(2, "0")}:00`;

/** LocalBusiness + Bakery structured data, including hours and a menu. */
export function jsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["Bakery", "CafeOrCoffeeShop"],
    name: BUSINESS.name,
    description: BUSINESS.description,
    url: SITE_URL,
    telephone: BUSINESS.phoneIntl,
    email: BUSINESS.email,
    priceRange: BUSINESS.priceRange,
    servesCuisine: ["Bakery", "Coffee"],
    foundingDate: String(BUSINESS.foundedYear),
    image: `${SITE_URL}/opengraph-image`,
    logo: `${SITE_URL}/brand/logo-badge.png`,
    slogan: BUSINESS.slogan,
    address: {
      "@type": "PostalAddress",
      streetAddress: BUSINESS.street,
      addressLocality: BUSINESS.city,
      addressRegion: BUSINESS.region,
      postalCode: BUSINESS.postalCode,
      addressCountry: BUSINESS.country,
    },
    openingHoursSpecification: HOURS.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: `https://schema.org/${h.d}`,
      opens: pad(h.o),
      closes: pad(h.c),
    })),
    geo: { "@type": "GeoCoordinates", latitude: BUSINESS.geo.lat, longitude: BUSINESS.geo.lng },
    hasMap: `https://maps.google.com/?q=${encodeURIComponent(ADDRESS)}`,
    sameAs: Object.values(BUSINESS.socials).filter((u) => u.startsWith("http")),
    hasMenu: {
      "@type": "Menu",
      hasMenuSection: CATS.map((c) => ({
        "@type": "MenuSection",
        name: c.name,
        hasMenuItem: PRODUCTS.filter((p) => p.cat === c.id).map((p) => ({
          "@type": "MenuItem",
          name: p.name,
          description: p.desc,
          offers: { "@type": "Offer", price: p.price.toFixed(2), priceCurrency: CURRENCY.code },
        })),
      })),
    },
  };
}
