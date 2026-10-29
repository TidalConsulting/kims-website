import { ImageResponse } from "next/og";
import { BUSINESS } from "@/lib/data";

export const dynamic = "force-static";

export const alt = `${BUSINESS.name} — Bakery & Coffee`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "radial-gradient(700px 500px at 78% 40%, rgba(255,95,174,.55) 0%, transparent 60%), radial-gradient(600px 500px at 10% 90%, rgba(123,63,228,.55) 0%, transparent 60%), #2B1340",
          color: "#FFF0F7",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 8, textTransform: "uppercase", color: "#FF8AC4" }}>{BUSINESS.tagline}</div>
        <div style={{ fontSize: 110, marginTop: 20, lineHeight: 1.05 }}>{BUSINESS.name}</div>
        <div style={{ fontSize: 56, marginTop: 24, color: "#FFD93D" }}>Baked slow. Brewed bold.</div>
      </div>
    ),
    size,
  );
}
