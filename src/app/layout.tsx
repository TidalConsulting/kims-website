import type { Metadata, Viewport } from "next";
import { Caveat, DM_Sans, Fredoka } from "next/font/google";
import { BUSINESS, SITE_URL } from "@/lib/data";
import "./globals.css";

const fredoka = Fredoka({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-fredoka", display: "swap" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans", display: "swap" });
// Handwritten accents sit below the fold, so don't let this font compete with the headline font at load.
const caveat = Caveat({ subsets: ["latin"], weight: ["500", "700"], variable: "--font-caveat", display: "swap", preload: false });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${BUSINESS.name} — Bakery & Café`,
  description: BUSINESS.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: BUSINESS.name,
    title: `${BUSINESS.name} — Bakery & Café`,
    description: BUSINESS.description,
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#2B1340" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fredoka.variable} ${dmSans.variable} ${caveat.variable}`}>
      <body>{children}</body>
    </html>
  );
}
