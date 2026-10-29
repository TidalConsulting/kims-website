"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

/** next/image that swaps to an emoji placeholder if the photo fails to load (or disappears if `emoji` is ""). */
export default function SmartImage({ emoji = "🍪", alt, ...props }: ImageProps & { emoji?: string }) {
  const [failed, setFailed] = useState(false);
  if (failed && !emoji) return null;
  if (failed) return <div className={`ph ${props.className ?? ""}`} aria-hidden="true">{emoji}</div>;
  return <Image alt={alt} {...props} onError={() => setFailed(true)} />;
}
