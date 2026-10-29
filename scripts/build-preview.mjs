// Builds a single, self-contained preview/index.html (no server, no external files)
// that can be shared as a link, e.g. a claude.ai artifact. Usage: npm run build:preview
//
// The API routes are left out (the preview simulates them, see src/lib/client.ts),
// and every script, stylesheet and font is inlined into the HTML.
import { execSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const work = mkdtempSync(join(tmpdir(), "ck-preview-"));
const skip = new Set(["node_modules", ".next", "out", "preview", "prototype", ".git"]);

try {
  cpSync(root, work, { recursive: true, filter: (src) => !skip.has(src.slice(root.length + 1).split(/[\\/]/)[0]) });
  symlinkSync(join(root, "node_modules"), join(work, "node_modules"), "junction");
  rmSync(join(work, "src/app/api"), { recursive: true });

  execSync("npx next build --webpack", {
    cwd: work,
    stdio: "inherit",
    env: { ...process.env, NEXT_PUBLIC_STATIC_PREVIEW: "1" },
  });

  const out = join(work, "out");
  const file = (url) => readFileSync(join(out, url.split("?")[0]));
  const mime = { woff2: "font/woff2", woff: "font/woff", ttf: "font/ttf", svg: "image/svg+xml", png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", webp: "image/webp", avif: "image/avif" };
  const dataUri = (url) => `data:${mime[url.split(".").pop().split("?")[0]] ?? "application/octet-stream"};base64,${file(url).toString("base64")}`;

  let html = readFileSync(join(out, "index.html"), "utf8");
  // Stylesheets → <style>, with fonts and other url() assets embedded.
  html = html.replace(/<link rel="stylesheet" href="([^"]+)"[^>]*\/?>/g, (_, href) => {
    const css = file(href).toString("utf8").replace(/url\((\/_next\/[^)]+)\)/g, (_m, u) => `url(${dataUri(u)})`);
    return `<style>${css}</style>`;
  });
  // Next.js derives its asset prefix from document.currentScript.src, which inline scripts lack.
  // Report a script under /_next/ (an empty prefix) for the scripts that run during start-up.
  const shim =
    `<script>(()=>{const s=document.createElement("script");s.src=location.origin+"/_next/static/preview.js";` +
    `Object.defineProperty(document,"currentScript",{configurable:true,get:()=>s})})()</script>`;
  html = html.replace(/<script/, shim + "<script");
  // External scripts → inline scripts, keeping their order.
  html = html.replace(/<script src="(\/_next\/[^"]+)"[^>]*><\/script>/g, (_, src) =>
    `<script>${file(src)
      .toString("utf8")
      .replace(/<\/script/gi, "<\\/script")
      // Some libraries put a literal U+FFFD in strings; the escape is equivalent and survives re-encoding.
      .replace(/\uFFFD/g, "\\uFFFD")}</script>`,
  );
  // The React Server Components payload re-adds the stylesheet and font preloads on start-up.
  // Both are already inlined above, so drop those references from the (JS-string-escaped) payload.
  html = html.replace(/:HL\[\\"\/_next\/[^\]]*\]\\n/g, "");
  html = html.replace(/\[\\"\$\\",\\"link\\",\\"\d+\\",\{\\"rel\\":\\"stylesheet\\",\\"href\\":\\"\/_next\/[^}]*\}\]/g, "null");
  // Imported images (e.g. the logo) are referenced by path from the HTML and the inlined scripts.
  html = html.replace(/\/_next\/static\/media\/[^"'\\)\s]+?\.(?:png|jpe?g|webp|avif|svg)/g, (u) => dataUri(u));
  // Preloads and the favicon pointed at files that no longer exist.
  html = html.replace(/<link rel="(?:preload|modulepreload)"[^>]*\/?>/g, "");
  // App icons are referenced from the HTML and from the start-up payload: embed them everywhere.
  for (const icon of ["/icon.png", "/apple-icon.png"]) {
    const uri = dataUri(icon);
    html = html.replaceAll(new RegExp(`${icon.replace(".", "\\.")}(\\?[\\w-]+)?(?=["\\\\])`, "g"), uri);
  }

  const dest = join(root, "preview");
  mkdirSync(dest, { recursive: true });
  writeFileSync(join(dest, "index.html"), html);
  const left = [...html.matchAll(/(?:src|href)="(\/_next\/[^"]+)"/g)].map((m) => m[1]);
  if (left.length) console.warn("Still references external files:", left);
  console.log(`\nWrote preview/index.html (${(html.length / 1024).toFixed(0)} KB)`);
} finally {
  if (existsSync(work)) rmSync(work, { recursive: true, force: true });
}
