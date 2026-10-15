import { createHash } from "node:crypto";

export const MAX_LEAD_BYTES = 16 * 1024;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_KEYS = 10_000;
const attempts = new Map<string, { count: number; expires: number }>();
let globalWindow = { count: 0, expires: 0 };

// Best-effort single-process limit. The hosting proxy must overwrite client IP
// headers; multi-instance deployments also need an edge/shared rate limiter.
export function consumeLeadAttempt(ip: string, now = Date.now()): number {
  if (now >= globalWindow.expires) globalWindow = { count: 0, expires: now + 60_000 };
  if (++globalWindow.count > 300) return Math.ceil((globalWindow.expires - now) / 1000);
  const key = createHash("sha256").update(ip).digest("hex");
  for (const [id, value] of attempts) if (value.expires <= now) attempts.delete(id);
  const previous = attempts.get(key);
  if (!previous && attempts.size >= MAX_KEYS) return 60;
  const entry = previous || { count: 0, expires: now + WINDOW_MS };
  attempts.set(key, entry);
  return ++entry.count > 8 ? Math.ceil((entry.expires - now) / 1000) : 0;
}

export function isAllowedLeadOrigin(req: Request): boolean {
  if (req.headers.get("sec-fetch-site") === "cross-site") return false;
  const origin = req.headers.get("origin");
  if (!origin) return true;
  const allowed = new Set([new URL(req.url).origin, "https://hosteditify.com", "https://www.hosteditify.com"]);
  return allowed.has(origin);
}

export class LeadBodyTooLarge extends Error {}

export async function readLeadJson(req: Request): Promise<unknown> {
  const length = Number(req.headers.get("content-length"));
  if (length > MAX_LEAD_BYTES) throw new LeadBodyTooLarge();
  const reader = req.body?.getReader();
  if (!reader) throw new SyntaxError("Missing body");
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_LEAD_BYTES) {
        await reader.cancel();
        throw new LeadBodyTooLarge();
      }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}
