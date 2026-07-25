/**
 * Scan a competitor's site and store it against the signed-in user.
 *
 * A competitor scan is a real scan — it runs the same 8 checks and costs the
 * user one from their quota, enforced exactly like /api/scan. The only
 * difference is the stored row is marked kind = 'competitor' so it never
 * pollutes the user's own dashboard/reports/recommendations.
 */
import { getAuthedUser } from "../../../lib/supabase/auth";
import { getSupabaseAdminClient } from "../../../lib/supabase/admin";
import { resolveBilling } from "../../../lib/server/account";

const BACKEND_URL =
  process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const SCAN_TIMEOUT_MS = 55_000;
const MAX_COMPETITORS = 10;

export const config = {
  maxDuration: 60,
  api: { responseLimit: "8mb" },
};

function hostOf(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url || "";
  }
}

function storageCostOf(result) {
  try {
    return Buffer.byteLength(
      JSON.stringify({ url: result.url, band: result.band, checks: result.checks }),
      "utf8"
    );
  } catch {
    return 0;
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const user = await getAuthedUser({ req, res });
  if (!user) {
    return res.status(401).json({ error: "Sign in to compare competitors.", code: "unauthenticated" });
  }

  const { url } = req.body || {};
  if (!url || typeof url !== "string") {
    return res.status(400).json({ error: "A competitor URL is required." });
  }

  let target;
  try {
    target = new URL(url.startsWith("http") ? url : `https://${url}`);
    if (!["http:", "https:"].includes(target.protocol)) throw new Error("bad protocol");
  } catch {
    return res.status(400).json({ error: "That doesn't look like a valid URL." });
  }

  const admin = getSupabaseAdminClient();
  if (!admin) {
    return res.status(503).json({ error: "Scanning is temporarily unavailable." });
  }

  const competitorHost = hostOf(target.href);

  // Don't let a user add their own site as a competitor.
  const { data: ownScans } = await admin
    .from("scans")
    .select("url")
    .eq("user_id", user.id)
    .eq("kind", "primary")
    .order("created_at", { ascending: false })
    .limit(1);
  if (ownScans?.[0] && hostOf(ownScans[0].url) === competitorHost) {
    return res.status(400).json({
      error: "That's your own site — it's already the baseline you're comparing against.",
    });
  }

  // Existing competitor rows for this user, so we can enforce the cap and
  // replace any prior scan of the same host precisely (by id, not a fuzzy
  // URL match).
  const { data: existing } = await admin
    .from("scans")
    .select("id, url")
    .eq("user_id", user.id)
    .eq("kind", "competitor");
  const distinctHosts = new Set((existing || []).map((r) => hostOf(r.url)));
  if (!distinctHosts.has(competitorHost) && distinctHosts.size >= MAX_COMPETITORS) {
    return res.status(400).json({
      error: `You can track up to ${MAX_COMPETITORS} competitors. Remove one to add another.`,
    });
  }
  const staleIds = (existing || [])
    .filter((r) => hostOf(r.url) === competitorHost)
    .map((r) => r.id);

  // ── Quota: a competitor scan spends a credit like any other, from the
  // shared pool if the user is on a team ───────────────────────────────
  const { billingUserId } = await resolveBilling(admin, user.id);
  const { data: quota, error: quotaError } = await admin.rpc("consume_scan_quota", {
    p_user_id: billingUserId,
  });
  if (quotaError) {
    console.error("[api/competitors/scan] quota check failed:", quotaError.message);
    return res.status(503).json({ error: "Could not verify your scan allowance." });
  }
  if (!quota?.allowed) {
    return res.status(402).json({
      error: "You've used all your scans.",
      code: "quota_exhausted",
      quota: {
        tier: quota?.tier ?? "free",
        scansUsed: quota?.scans_used ?? 0,
        scanLimit: quota?.scan_limit ?? 0,
        scansRemaining: 0,
        renewalDate: quota?.renewal_date ?? null,
      },
    });
  }

  const releaseQuota = async () => {
    const { error } = await admin.rpc("release_scan_quota", { p_user_id: billingUserId });
    if (error) console.error("[api/competitors/scan] failed to release quota:", error.message);
  };

  // ── Run the scan ─────────────────────────────────────────────────────
  let data;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), SCAN_TIMEOUT_MS);
    let upstream;
    try {
      upstream = await fetch(`${BACKEND_URL}/scan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: target.href }),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }
    if (!upstream.ok) {
      const detail = await upstream.json().catch(() => ({}));
      await releaseQuota();
      return res.status(upstream.status === 429 ? 429 : 502).json({
        error: detail.detail || "Couldn't scan that site. It may be blocking our crawler.",
      });
    }
    data = await upstream.json();
  } catch (err) {
    await releaseQuota();
    const aborted = err?.name === "AbortError";
    return res.status(aborted ? 504 : 502).json({
      error: aborted
        ? "The scan took too long and was stopped. Try again."
        : "Couldn't scan that site. It may be blocking our crawler.",
    });
  }

  const result = data?.result;
  if (!result || typeof result.total_score !== "number") {
    await releaseQuota();
    return res.status(502).json({ error: "The scanner returned an unreadable result." });
  }

  // ── Record it as a competitor scan ───────────────────────────────────
  // One row per competitor host: drop the previous scan(s) of the same host
  // (matched by id) so "compare" reflects the latest and rows don't pile up.
  if (staleIds.length > 0) {
    await admin.from("scans").delete().eq("user_id", user.id).in("id", staleIds);
  }

  const { error: saveError } = await admin.from("scans").insert({
    scan_id: data.scan_id,
    url: result.url,
    email: user.email ?? null,
    user_id: user.id,
    total_score: result.total_score,
    band: result.band,
    checks: result.checks,
    scan_time_ms: result.scan_time_ms,
    storage_bytes: storageCostOf(result),
    status: "completed",
    kind: "competitor",
    created_at: new Date().toISOString(),
  });

  if (saveError) {
    console.error("[api/competitors/scan] failed to save:", saveError.message);
    return res.status(500).json({ error: "Scan ran but couldn't be saved. Try again." });
  }

  return res.status(200).json({ ok: true, host: competitorHost, scan_id: data.scan_id });
}
