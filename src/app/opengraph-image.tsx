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
          background: "radial-gradient(1200px 600px at 75% 40%, #4a2d1d 0%, #24160F 60%)",
          color: "#F7F0E6",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 8, textTransform: "uppercase", color: "#C8925A" }}>{BUSINESS.tagline}</div>
        <div style={{ fontSize: 110, marginTop: 20, lineHeight: 1.05 }}>{BUSINESS.name}</div>
        <div style={{ fontSize: 56, marginTop: 24, color: "#E0B07A", fontStyle: "italic" }}>Baked slow. Brewed bold.</div>
      </div>
    ),
    size,
  );
}
