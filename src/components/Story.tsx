"use client";

import { BUSINESS, PRODUCTS } from "@/lib/data";
import { SECTION_PHOTOS } from "@/lib/photos";
import { useShop } from "@/store/shop";
import CountUp from "./CountUp";
import Reveal from "./Reveal";
import SmartImage from "./SmartImage";
import { Play } from "./icons";

const STUFFED_COOKIES = PRODUCTS.filter((p) => p.cat === "cookies").length;

export default function Story() {
  const openModal = useShop((s) => s.openModal);
  return (
    <section className="story" id="story">
      <Reveal className="story-text">
        <span className="eyebrow">Our story</span>
        <h2>Made with patience.<br />Baked with heart.</h2>
        <p>
          {BUSINESS.name} started with a borrowed oven and one stubborn cookie recipe. Today we bake every morning before sunrise using real butter, local eggs, and zero shortcuts. From our oven to your hands, it&apos;s more than baking. It&apos;s how we say good morning.
        </p>
        <div className="stats">
          <div><CountUp end={BUSINESS.foundedYear} /><small>Baking since</small></div>
          <div><CountUp end={STUFFED_COOKIES} /><small>Stuffed cookies</small></div>
          <div><CountUp end={0} /><small>Shortcuts taken</small></div>
        </div>
        <a href="#visit" className="btn btn-dark self-start">Come say hi</a>
      </Reveal>
      <div className="story-img">
        <SmartImage src={SECTION_PHOTOS.story} alt="Baker dusting flour over dough" fill sizes="(max-width: 860px) 100vw, 50vw" emoji="🥖" className="object-cover" />
        <button className="play" aria-label="Watch our story" onClick={() => openModal({ kind: "video" })}>
          <span><Play />Watch<br />our story</span>
        </button>
      </div>
    </section>
  );
}
