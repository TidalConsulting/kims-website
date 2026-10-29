"use client";

import type { ElementType, ComponentPropsWithoutRef } from "react";
import { useReveal } from "./hooks";

type Props<T extends ElementType> = { as?: T } & ComponentPropsWithoutRef<T>;

/** Fades its content up when scrolled into view. Disabled by prefers-reduced-motion in CSS. */
export default function Reveal<T extends ElementType = "div">({ as, className = "", ...rest }: Props<T>) {
  const ref = useReveal<HTMLElement>();
  const Tag = (as ?? "div") as ElementType;
  return <Tag ref={ref} className={`reveal ${className}`} {...rest} />;
}
