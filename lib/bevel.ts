import { MetricLog, Settings } from "./types";

export type BevelStatus =
  | { configured: false; reason: string }
  | { configured: true; baseUrl: string };

export function bevelStatus(settings: Settings): BevelStatus {
  if (!settings.bevelApiBaseUrl) {
    return { configured: false, reason: "Bevel API base URL is not set in Settings." };
  }
  if (!settings.bevelApiKey) {
    return { configured: false, reason: "Bevel API key is not set in Settings." };
  }
  return { configured: true, baseUrl: settings.bevelApiBaseUrl };
}

export type BevelSyncResult =
  | { ok: false; userMessage: string }
  | { ok: true; metrics: MetricLog[]; userMessage: string };

/**
 * Fetch metrics from the Bevel API. Returns a non-technical user message on
 * failure and falls back gracefully. Real endpoint and field-mapping are
 * placeholders until Bevel API access details are supplied.
 */
export async function syncBevelMetrics(settings: Settings): Promise<BevelSyncResult> {
  const status = bevelStatus(settings);
  if (!status.configured) {
    return {
      ok: false,
      userMessage: `${status.reason} Manual entry remains available.`,
    };
  }

  try {
    const res = await fetchWithRetry(`${status.baseUrl.replace(/\/$/, "")}/metrics`, {
      headers: { Authorization: `Bearer ${settings.bevelApiKey}` },
    });
    if (!res.ok) {
      return {
        ok: false,
        userMessage: `Bevel responded with ${res.status}. Your manually entered data is unaffected.`,
      };
    }
    const raw = (await res.json()) as unknown;
    const metrics = mapBevelMetrics(raw);
    return {
      ok: true,
      metrics,
      userMessage: `Synced ${metrics.length} metric${metrics.length === 1 ? "" : "s"} from Bevel.`,
    };
  } catch {
    return {
      ok: false,
      userMessage: "Could not reach Bevel right now. Your manually entered data is unaffected.",
    };
  }
}

async function fetchWithRetry(url: string, init: RequestInit, attempts = 4): Promise<Response> {
  let lastError: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url, init);
      if (res.status < 500) return res;
      lastError = new Error(`HTTP ${res.status}`);
    } catch (err) {
      lastError = err;
    }
    await sleep(2 ** i * 1000);
  }
  throw lastError ?? new Error("Network failure");
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Map a Bevel response payload to the dashboard's MetricLog shape.
 *
 * Bevel field-to-dashboard mapping is a configuration placeholder. Until the
 * real schema is known this function intentionally returns an empty list so
 * the recommendation engine never operates on fabricated values.
 */
function mapBevelMetrics(_raw: unknown): MetricLog[] {
  return [];
}
