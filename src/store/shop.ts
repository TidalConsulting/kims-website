"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Filter } from "@/lib/data";
import type { InfoPage } from "@/lib/info";
import { linePrice, MAX_QTY, shopNow, stockProblem } from "@/lib/utils";

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
  /** Chosen option index per option group (see OPT), so the server can price the line. */
  sel?: number[];
  /** Special request typed in the quick view. */
  note?: string;
  /** Cookie ids in a Build-a-Box box, so the server can price it. */
  box?: string[];
}

export type Sort = "featured" | "low" | "high" | "az" | "fav";
export type Modal =
  | { kind: "quick"; id: string }
  | { kind: "checkout" }
  | { kind: "video" }
  | { kind: "info"; page: InfoPage }
  | { kind: "paid"; orderNo: string };

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

  /** Returns false (and shows why) when the item can't be added, e.g. not enough left today. */
  addToCart: (item: Omit<CartLine, "key">) => boolean;
  changeQty: (key: string, d: number) => void;
  removeLine: (key: string) => void;
  clearCart: () => void;
  /** Re-prices a saved cart against today's menu and drops anything no longer available. */
  refreshCart: () => void;
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

const toast = (msg: string) => ({ toast: { msg, id: Date.now() } });

export const useShop = create<ShopState>()(
  persist(
    (set, get) => ({
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

      addToCart: (item) => {
        const s = get();
        const key = item.pid + "|" + item.opts;
        const exists = s.cart.some((c) => c.key === key);
        const cart = exists
          ? s.cart.map((c) => (c.key === key ? { ...c, qty: c.qty + item.qty } : c))
          : [...s.cart, { ...item, key }];
        const problem = cart.some((c) => c.qty > MAX_QTY)
          ? `You can order up to ${MAX_QTY} of one item online. For bigger orders, send us a catering request.`
          : stockProblem(cart, shopNow());
        if (problem) return set(toast(problem)), false;
        set({ cart, bump: s.bump + 1, ...toast(`Added ${item.qty} × ${item.name}`) });
        return true;
      },
      changeQty: (key, d) => {
        const s = get();
        const cart = s.cart.map((c) => (c.key === key ? { ...c, qty: c.qty + d } : c)).filter((c) => c.qty > 0);
        if (d > 0) {
          const problem = cart.some((c) => c.qty > MAX_QTY) ? `That's the most we can take online (${MAX_QTY}).` : stockProblem(cart, shopNow());
          if (problem) return set(toast(problem));
        }
        set({ cart, bump: s.bump + 1 });
      },
      removeLine: (key) => set((s) => ({ cart: s.cart.filter((c) => c.key !== key), bump: s.bump + 1 })),
      clearCart: () => set({ cart: [] }),
      refreshCart: () => {
        const now = shopNow();
        const cart = get().cart.flatMap((c) => {
          const price = linePrice(c, now);
          return price === null ? [] : [{ ...c, price }];
        });
        const gone = get().cart.length - cart.length;
        set({ cart, ...(gone ? toast(`${gone === 1 ? "1 item" : `${gone} items`} in your cart sold out and ${gone === 1 ? "was" : "were"} removed.`) : {}) });
      },
      toggleFav: (id) =>
        set((s) => ({ favs: s.favs.includes(id) ? s.favs.filter((f) => f !== id) : [...s.favs, id] })),

      setFilter: (filter) => set({ filter }),
      setQuery: (query) => set({ query }),
      setSort: (sort) => set({ sort }),
      openDrawer: () => set({ layer: "drawer", mobileOpen: false }),
      openModal: (modal) => set((s) => ({ layer: "modal", modal, modalSeq: s.modalSeq + 1, mobileOpen: false })),
      closeAll: () => set({ layer: null }),
      setMobileOpen: (mobileOpen) => set({ mobileOpen }),
      showToast: (msg) => set(toast(msg)),
      hideToast: () => set({ toast: null }),
    }),
    {
      name: "ck_shop",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ cart: s.cart, favs: s.favs }),
      // Bump when the cart line format changes: older carts (v1 USD, v2/v3 earlier menus, v4 without
      // option indices) are dropped. Favorites are kept. Prices are refreshed on load (refreshCart).
      version: 5,
      migrate: (persisted, version) => {
        const old = persisted as { cart?: CartLine[]; favs?: string[] };
        return version < 5 ? { cart: [], favs: old.favs ?? [] } : old;
      },
      // Rehydrated on mount (see StoreHydrator) so the server and first client render match.
      skipHydration: true,
    },
  ),
);

export const cartCount = (cart: CartLine[]) => cart.reduce((s, c) => s + c.qty, 0);
