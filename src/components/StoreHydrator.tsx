"use client";

import { useEffect } from "react";
import { useShop } from "@/store/shop";

/** Loads the persisted cart + favorites after the first render to avoid hydration mismatches. */
export default function StoreHydrator() {
  useEffect(() => {
    useShop.persist.rehydrate();
  }, []);
  return null;
}
