/**
 * True in the self-contained preview build (npm run build:preview), which has no server:
 * API calls are simulated and third-party embeds are replaced with links.
 */
export const STATIC_PREVIEW = process.env.NEXT_PUBLIC_STATIC_PREVIEW === "1";

/** POST JSON to one of our API routes and return the parsed reply. Throws on failure. */
export async function postJson<T = { ok: true }>(url: string, body: unknown): Promise<T> {
  if (STATIC_PREVIEW) {
    await new Promise((r) => setTimeout(r, 400));
    if (url === "/api/order") return { orderNo: "CK-" + crypto.randomUUID().slice(0, 5).toUpperCase() } as T;
    return { ok: true } as T;
  }
  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
