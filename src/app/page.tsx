import Announcement from "@/components/Announcement";
import BoxBuilder from "@/components/BoxBuilder";
import CategoryStrip from "@/components/CategoryStrip";
import CoffeeSection from "@/components/CoffeeSection";
import MenuLineup from "@/components/MenuLineup";
import Footer from "@/components/Footer";
import Gift from "@/components/Gift";
import Hero from "@/components/Hero";
import Layers from "@/components/Layers";
import MenuGrid from "@/components/MenuGrid";
import MobileNav from "@/components/MobileNav";
import Nav from "@/components/Nav";
import Newsletter from "@/components/Newsletter";
import Reviews from "@/components/Reviews";
import StoreHydrator from "@/components/StoreHydrator";
import Story from "@/components/Story";
import SwirlCollection from "@/components/SwirlCollection";
import Visit from "@/components/Visit";
import { jsonLd } from "@/lib/seo";

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()) }} />
      <StoreHydrator />
      <Announcement />
      <Nav />
      <MobileNav />
      <main id="top">
        <Hero />
        <CategoryStrip />
        <MenuGrid />
        <MenuLineup />
        <SwirlCollection />
        <BoxBuilder />
        <CoffeeSection />
        <Story />
        <Gift />
        <Reviews />
        <Visit />
        <Newsletter />
      </main>
      <Footer />
      <Layers />
    </>
  );
}
