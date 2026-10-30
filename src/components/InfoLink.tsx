"use client";

import type { ReactNode } from "react";
import type { InfoPage } from "@/lib/info";
import { useShop } from "@/store/shop";

/** Footer link that opens one of the help pages in the modal. */
export default function InfoLink({ page, children }: { page: InfoPage; children: ReactNode }) {
  const openModal = useShop((s) => s.openModal);
  return (
    <button type="button" className="text-left hover:text-gold" onClick={() => openModal({ kind: "info", page })}>
      {children}
    </button>
  );
}
