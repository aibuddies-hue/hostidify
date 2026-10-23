import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { consumeLeadAttempt, isAllowedLeadOrigin, LeadBodyTooLarge, readLeadJson } from "@/lib/lead-security";
import { promises as fs } from "fs";
import os from "os";
import path from "path";
import { isQualifiedBudget, leadSchema, type LeadFormData } from "@/lib/lead.schema";

const TIMEOUT_MS = 5000;

function sha256(value: string): string {
  return crypto.createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

/** Keep recovery data private; never print contact details or credentials to logs. */
async function logLeadLocally(lead: Record<string, unknown>, reason: string) {
  console.warn(`[lead] ${reason}; saving private recovery record`);
  const dir = process.env.LEAD_BACKUP_DIR || (process.env.NODE_ENV === "production"
    ? path.join(os.tmpdir(), "host-editify-leads") : path.join(process.cwd(), ".leads"));
  await fs.mkdir(dir, { recursive: true, mode: 0o700 });
  const file = path.join(dir, "leads.ndjson");
  await fs.appendFile(file, JSON.stringify(lead) + "\n", { mode: 0o600 });
  await fs.chmod(file, 0o600);
}

async function sendToN8n(url: string, lead: Record<string, unknown>) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(lead),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`n8n webhook responded ${res.status}`);
}

async function sendToMetaCapi(
  pixelId: string,
  token: string,
  lead: LeadFormData,
  eventId: string,
  req: NextRequest,
  clientIp: string,
  userAgent: string
) {
  const payload = {
    data: [
      {
        event_name: "Lead",
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        event_source_url: lead.utm?.landing_url || req.headers.get("referer") || "",
        action_source: "website",
        user_data: {
          em: [sha256(lead.email)],
          ph: [sha256(lead.whatsapp.replace(/\D/g, ""))],
          client_ip_address: clientIp,
          client_user_agent: userAgent,
          fbp: lead.utm?.fbp || undefined,
          fbc: lead.utm?.fbc || undefined,
        },
        custom_data: {
          currency: "USD",
          lead_type: lead.qualified ? "qualified" : "unqualified",
          budget: lead.budgetRange,
          industry: lead.industry,
          plan: lead.preferredPlan,
        },
      },
    ],
    test_event_code: process.env.META_TEST_EVENT_CODE || undefined,
  };
  const res = await fetch(`https://graph.facebook.com/v21.0/${pixelId}/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`Meta CAPI responded ${res.status}`);
}

export async function POST(req: NextRequest) {
  if (!isAllowedLeadOrigin(req)) return NextResponse.json({ error: "Origin not allowed" }, { status: 403 });
  if (req.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") {
    return NextResponse.json({ error: "Expected application/json" }, { status: 415 });
  }
  const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
  const retryAfter = consumeLeadAttempt(clientIp);
  if (retryAfter) return NextResponse.json({ error: "Too many attempts. Please try again shortly." }, { status: 429, headers: { "Retry-After": String(retryAfter) } });
  let body: unknown;
  try {
    body = await readLeadJson(req);
  } catch (error) {
    if (error instanceof LeadBodyTooLarge) return NextResponse.json({ error: "Request too large" }, { status: 413 });
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", details: parsed.error.format() }, { status: 400 });
  }

  // Qualification is decided here from the budget, not trusted from the browser
  const lead = { ...parsed.data, qualified: isQualifiedBudget(parsed.data.budgetRange) };
  const userAgent = (req.headers.get("user-agent") || "").slice(0, 512);
  const eventId = lead.eventId || `lead_${crypto.randomUUID()}`;
  const record = { ...lead, eventId, clientIp, userAgent, receivedAt: new Date().toISOString() };

  const n8nUrl = process.env.N8N_LEAD_WEBHOOK_URL;
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const capiToken = process.env.META_CAPI_TOKEN;

  // Cal.com is the booking destination. If the optional CRM webhook is absent,
  // still let the visitor schedule their call and keep a best-effort recovery log.
  // Blocking the booking flow here made every production form appear broken when
  // the CRM environment variable was not configured.
  if (!n8nUrl) console.error("[lead] delivery webhook is not configured; continuing to booking");

  // Wait for every delivery (each capped at 5s) before answering, so nothing is dropped mid-flight
  const [n8nResult, capiResult] = await Promise.allSettled([
    n8nUrl ? sendToN8n(n8nUrl, record) : logLeadLocally(record, "N8N_LEAD_WEBHOOK_URL is not set"),
    pixelId && capiToken
      ? sendToMetaCapi(pixelId, capiToken, lead, eventId, req, clientIp, userAgent)
      : Promise.resolve(),
  ]);

  if (capiResult.status === "rejected") {
    console.error("[lead] Meta CAPI delivery failed");
  }

  if (n8nResult.status === "rejected" && n8nUrl) {
    // A CRM outage must not prevent the visitor from reaching the booking page.
    console.error("[lead] n8n webhook delivery failed");
    try { await logLeadLocally(record, "n8n webhook failed"); } catch { console.error("[lead] private recovery write failed"); }
  }

  const warning =
    !n8nUrl
      ? "CRM delivery is not configured; continue to schedule your audit."
      : n8nResult.status === "rejected"
        ? "CRM delivery failed; continue to schedule your audit."
        : undefined;

  return NextResponse.json({ success: true, qualified: lead.qualified, eventId, warning });
}
