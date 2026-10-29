"use client";

import { useEffect } from "react";
import { postJson } from "@/lib/client";
import { useShop } from "@/store/shop";

/**
 * Loads the persisted cart + favorites after the first render (avoids hydration mismatches),
 * re-prices it against today's menu, then handles the return from PayMongo: ?order=CC-XXXXX after
 * paying, ?order_cancelled=CC-XXXXX&sig=… after backing out (the kitchen is told to drop that order).
 */
export default function StoreHydrator() {
  useEffect(() => {
    void Promise.resolve(useShop.persist.rehydrate()).then(() => {
      const q = new URLSearchParams(location.search);
      const orderNo = q.get("order");
      const { clearCart, openModal, showToast, refreshCart } = useShop.getState();
      refreshCart();
      if (orderNo) {
        clearCart();
        openModal({ kind: "paid", orderNo });
      } else if (q.has("order_cancelled")) {
        const cancelled = q.get("order_cancelled");
        if (cancelled && q.get("sig")) postJson("/api/order/cancel", { orderNo: cancelled, sig: q.get("sig") }).catch(() => {});
        showToast("Payment cancelled. Your cart is still here.");
      } else return;
      history.replaceState(null, "", location.pathname + location.hash);
    });
  }, []);
  return null;
}
