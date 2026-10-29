/**
 * True in the self-contained preview build (npm run build:preview), which has no server:
 * API calls are simulated and third-party embeds are replaced with links.
 */
export const STATIC_PREVIEW = process.env.NEXT_PUBLIC_STATIC_PREVIEW === "1";

/** True when PayMongo keys are configured (set in next.config.ts; the key itself never reaches the browser). */
export const ONLINE_PAYMENT = !STATIC_PREVIEW && process.env.NEXT_PUBLIC_ONLINE_PAYMENT === "1";

/** An error message from our API that is safe to show the customer (e.g. "Sorry, we only have 4 … left"). */
export class ApiError extends Error {}

/** POST JSON to one of our API routes and return the parsed reply. Throws ApiError when the API says no. */
export async function postJson<T = { ok: true }>(url: string, body: unknown): Promise<T> {
  if (STATIC_PREVIEW) {
    await new Promise((r) => setTimeout(r, 400));
    if (url === "/api/order") return { orderNo: "CC-" + crypto.randomUUID().slice(0, 5).toUpperCase() } as T;
    return { ok: true } as T;
  }
  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  if (!res.ok) {
    const msg = await res.json().then((j) => j?.error, () => null);
    throw msg ? new ApiError(msg) : new Error(`HTTP ${res.status}`);
  }
  return res.json();
}
