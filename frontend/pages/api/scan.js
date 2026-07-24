/**
 * The scan endpoint — and the only way a scan can be run.
 *
 * Every rule lives on this side of the wire: the browser cannot authenticate
 * itself, cannot grant itself quota, and cannot record a scan it didn't pay
 * for. The order matters —
 *
 *   1. verify the session          (401 if signed out)
 *   2. claim one scan from quota   (402 if the allowance is spent)
 *   3. run the scan
 *   4. record it, or hand the claim back if the scan failed
 *
 * Claiming *before* the scan is deliberate: two scans fired at once can't both
 * spend the same last credit, because consume_scan_quota takes a row lock.
 */
import { getAuthedUser } from "../../lib/supabase/auth";
import { getSupabaseAdminClient } from "../../lib/supabase/admin";
import { loadAccountSummary, resolveBilling } from "../../lib/server/account";

const BACKEND_URL =
  process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// A scan takes ~20s; allow generous headroom but never hang a function.
const SCAN_TIMEOUT_MS = 55_000;

export const config = {
  // Scans outlive the default serverless budget.
  maxDuration: 60,
  api: {
    // Reports carry per-check evidence and can exceed the 4 MB default.
    responseLimit: "8mb",
  },
};

/** What this scan costs the user's storage allowance: the size of the row we store. */
function storageCostOf(result) {
  try {
    return Buffer.byteLength(
      JSON.stringify({
        url: result.url,
        band: result.band,
        checks: result.checks,
      }),
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

  // ── 1. Authentication ──────────────────────────────────────────────
  const user = await getAuthedUser({ req, res });
  if (!user) {
    return res
      .status(401)
      .json({ error: "Sign in to run a scan.", code: "unauthenticated" });
  }

  const { url } = req.body || {};
  if (!url || typeof url !== "string") {
    return res.status(400).json({ error: "A URL is required." });
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
    return res.status(503).json({
      error: "Scanning is temporarily unavailable. Please try again shortly.",
      code: "storage_unconfigured",
    });
  }

  // ── 2. Quota ───────────────────────────────────────────────────────
  // On a team, the scan is charged to the owner's shared pool and stamped with
  // the org so every member sees it.
  const { billingUserId, orgId } = await resolveBilling(admin, user.id);

  const { data: quota, error: quotaError } = await admin.rpc("consume_scan_quota", {
    p_user_id: billingUserId,
  });

  if (quotaError) {
    console.error("[api/scan] quota check failed:", quotaError.message);
    return res
      .status(503)
      .json({ error: "Could not verify your scan allowance. Please try again." });
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

  // From here on the credit is spent — every failure path must hand it back
  // to the same pool it came from.
  const releaseQuota = async () => {
    const { error } = await admin.rpc("release_scan_quota", { p_user_id: billingUserId });
    if (error) console.error("[api/scan] failed to release quota:", error.message);
  };

  // ── 3. Run the scan ────────────────────────────────────────────────
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
        error:
          detail.detail ||
          "Scan failed. This site might be blocking our crawler. Try another URL.",
      });
    }

    data = await upstream.json();
  } catch (err) {
    await releaseQuota();
    const aborted = err?.name === "AbortError";
    console.error("[api/scan] upstream scan failed:", err?.message || err);
    return res.status(aborted ? 504 : 502).json({
      error: aborted
        ? "The scan took too long and was stopped. Try again, or try another URL."
        : "Scan failed. This site might be blocking our crawler. Try another URL.",
    });
  }

  const result = data?.result;
  if (!result || typeof result.total_score !== "number") {
    await releaseQuota();
    return res.status(502).json({ error: "The scanner returned an unreadable result." });
  }

  // ── 4. Record it ───────────────────────────────────────────────────
  // The scan succeeded and the user has already been charged for it, so a
  // storage hiccup here must not fail their request — it's logged, not thrown.
  const storageBytes = storageCostOf(result);
  const { error: saveError } = await admin.from("scans").upsert(
    {
      scan_id: data.scan_id,
      url: result.url,
      email: user.email ?? null,
      user_id: user.id,
      total_score: result.total_score,
      band: result.band,
      checks: result.checks,
      scan_time_ms: result.scan_time_ms,
      storage_bytes: storageBytes,
      status: "completed",
      org_id: orgId,
      created_at: new Date().toISOString(),
    },
    { onConflict: "scan_id" }
  );

  if (saveError) {
    console.error("[api/scan] failed to save scan:", saveError.message);
  }

  // Hand back the fresh account state so the UI reflects the new usage the
  // moment the scan lands, with no second round-trip.
  const account = await loadAccountSummary(user).catch(() => null);

  return res.status(200).json({ ...data, account });
}
