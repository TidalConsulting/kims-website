import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { BUSINESS } from "@/lib/data";

export const dynamic = "force-static";

export const alt = `${BUSINESS.name}: ${BUSINESS.taglineShort}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Colours match the Candy Pop tokens in globals.css (next/og can't read CSS variables).
const PLUM = "#2B1340", PINK = "#DB1F80", GRAPE = "#7B3FE4", COTTON = "#FFF0F7", COTTON_2 = "#FFE1EF";

const file = (p: string) => readFileSync(join(process.cwd(), p));

/** Social-share card: the round badge beside the wordmark, on cotton-candy pink. */
export default function OgImage() {
  const badge = `data:image/png;base64,${file("public/brand/logo-badge.png").toString("base64")}`;
  const [first, ...rest] = BUSINESS.name.split(" ");
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: 70,
          padding: "0 90px",
          background: `radial-gradient(circle at 25% 50%, ${COTTON_2} 0%, ${COTTON} 60%)`,
          color: PLUM,
          fontFamily: "Fredoka",
        }}
      >
        {/* next/og renders a plain <img> */}
        <img src={badge} width={440} height={440} alt="" />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 132, lineHeight: 0.95 }}>{first}</div>
          <div style={{ fontSize: 132, lineHeight: 0.95, color: PINK }}>{rest.join(" ")}</div>
          <div style={{ fontSize: 50, marginTop: 26, color: GRAPE, fontFamily: "Caveat" }}>{BUSINESS.slogan}</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Fredoka", data: file("src/app/fonts/Fredoka-Bold.ttf"), weight: 700, style: "normal" },
        { name: "Caveat", data: file("src/app/fonts/Caveat-Bold.ttf"), weight: 700, style: "normal" },
      ],
    },
  );
}
