"use client";

import type { ComponentPropsWithoutRef } from "react";
import type { Filter } from "@/lib/data";
import { useShop } from "@/store/shop";

/** An anchor to #menu that also applies a category filter. */
export default function FilterLink({ filter, onClick, ...rest }: { filter: Filter } & ComponentPropsWithoutRef<"a">) {
  const setFilter = useShop((s) => s.setFilter);
  const setMobileOpen = useShop((s) => s.setMobileOpen);
  return (
    <a
      href="#menu"
      {...rest}
      onClick={(e) => {
        setFilter(filter);
        setMobileOpen(false);
        onClick?.(e);
      }}
    />
  );
}
