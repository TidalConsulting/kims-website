"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Filter } from "@/lib/data";

export interface CartLine {
  key: string;
  pid: string;
  name: string;
  img: string;
  price: number;
  opts: string;
  qty: number;
  /** Emoji shown if the image fails to load. */
  emoji: string;
}

export type Sort = "featured" | "low" | "high" | "az" | "fav";
export type Modal = { kind: "quick"; id: string } | { kind: "checkout" } | { kind: "video" };

interface ShopState {
  // Persisted
  cart: CartLine[];
  favs: string[];
  // Session UI
  filter: Filter;
  query: string;
  sort: Sort;
  layer: "drawer" | "modal" | null;
  modal: Modal | null;
  modalSeq: number;
  mobileOpen: boolean;
  toast: { msg: string; id: number } | null;
  bump: number;

  addToCart: (item: Omit<CartLine, "key">) => void;
  changeQty: (key: string, d: number) => void;
  removeLine: (key: string) => void;
  clearCart: () => void;
  toggleFav: (id: string) => void;

  setFilter: (f: Filter) => void;
  setQuery: (q: string) => void;
  setSort: (s: Sort) => void;
  openDrawer: () => void;
  openModal: (m: Modal) => void;
  closeAll: () => void;
  setMobileOpen: (open: boolean) => void;
  showToast: (msg: string) => void;
  hideToast: () => void;
}

export const useShop = create<ShopState>()(
  persist(
    (set) => ({
      cart: [],
      favs: [],
      filter: "all",
      query: "",
      sort: "featured",
      layer: null,
      modal: null,
      modalSeq: 0,
      mobileOpen: false,
      toast: null,
      bump: 0,

      addToCart: (item) =>
        set((s) => {
          const key = item.pid + "|" + item.opts;
          const exists = s.cart.some((c) => c.key === key);
          const cart = exists
            ? s.cart.map((c) => (c.key === key ? { ...c, qty: c.qty + item.qty } : c))
            : [...s.cart, { ...item, key }];
          return { cart, bump: s.bump + 1, toast: { msg: `Added ${item.qty} × ${item.name}`, id: Date.now() } };
        }),
      changeQty: (key, d) =>
        set((s) => ({
          cart: s.cart.map((c) => (c.key === key ? { ...c, qty: c.qty + d } : c)).filter((c) => c.qty > 0),
          bump: s.bump + 1,
        })),
      removeLine: (key) => set((s) => ({ cart: s.cart.filter((c) => c.key !== key), bump: s.bump + 1 })),
      clearCart: () => set({ cart: [] }),
      toggleFav: (id) =>
        set((s) => ({ favs: s.favs.includes(id) ? s.favs.filter((f) => f !== id) : [...s.favs, id] })),

      setFilter: (filter) => set({ filter }),
      setQuery: (query) => set({ query }),
      setSort: (sort) => set({ sort }),
      openDrawer: () => set({ layer: "drawer", mobileOpen: false }),
      openModal: (modal) => set((s) => ({ layer: "modal", modal, modalSeq: s.modalSeq + 1, mobileOpen: false })),
      closeAll: () => set({ layer: null }),
      setMobileOpen: (mobileOpen) => set({ mobileOpen }),
      showToast: (msg) => set({ toast: { msg, id: Date.now() } }),
      hideToast: () => set({ toast: null }),
    }),
    {
      name: "ck_shop",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ cart: s.cart, favs: s.favs }),
      // Bump when prices change: older carts (v1 USD, v2 old peso prices) are dropped; favorites are kept.
      version: 3,
      migrate: (persisted, version) => {
        const old = persisted as { cart?: CartLine[]; favs?: string[] };
        return version < 3 ? { cart: [], favs: old.favs ?? [] } : old;
      },
      // Rehydrated on mount (see StoreHydrator) so the server and first client render match.
      skipHydration: true,
    },
  ),
);

export const cartSubtotal = (cart: CartLine[]) => cart.reduce((s, c) => s + c.price * c.qty, 0);
export const cartCount = (cart: CartLine[]) => cart.reduce((s, c) => s + c.qty, 0);
