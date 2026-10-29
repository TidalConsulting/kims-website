"use client";

import { useEffect } from "react";
import { useShop } from "@/store/shop";

/**
 * Loads the persisted cart + favorites after the first render (avoids hydration mismatches),
 * then handles the return from PayMongo: ?order=CK-XXXXX after paying, ?order_cancelled=1 after backing out.
 */
export default function StoreHydrator() {
  useEffect(() => {
    void Promise.resolve(useShop.persist.rehydrate()).then(() => {
      const q = new URLSearchParams(location.search);
      const orderNo = q.get("order");
      const { clearCart, openModal, showToast } = useShop.getState();
      if (orderNo) {
        clearCart();
        openModal({ kind: "paid", orderNo });
      } else if (q.has("order_cancelled")) {
        showToast("Payment cancelled. Your cart is still here.");
      } else return;
      history.replaceState(null, "", location.pathname + location.hash);
    });
  }, []);
  return null;
}
