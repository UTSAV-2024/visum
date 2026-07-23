/**
 * Stop tracking a competitor — delete its stored scan for this user.
 *
 * Removing a competitor doesn't refund a scan (the scan really ran); it just
 * takes the row out of the comparison.
 */
import { getAuthedUser } from "../../../lib/supabase/auth";
import { getSupabaseAdminClient } from "../../../lib/supabase/admin";

function hostOf(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url || "";
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const user = await getAuthedUser({ req, res });
  if (!user) {
    return res.status(401).json({ error: "Not signed in", code: "unauthenticated" });
  }

  const { host } = req.body || {};
  if (!host || typeof host !== "string") {
    return res.status(400).json({ error: "A competitor host is required." });
  }

  const admin = getSupabaseAdminClient();
  if (!admin) return res.status(503).json({ error: "Storage is not configured." });

  // Match the host exactly in JS rather than with a fuzzy URL filter.
  const { data: rows, error } = await admin
    .from("scans")
    .select("id, url")
    .eq("user_id", user.id)
    .eq("kind", "competitor");
  if (error) {
    console.error("[api/competitors/remove] load failed:", error.message);
    return res.status(500).json({ error: "Could not remove that competitor." });
  }

  const ids = (rows || []).filter((r) => hostOf(r.url) === host).map((r) => r.id);
  if (ids.length === 0) return res.status(200).json({ ok: true, removed: 0 });

  const { error: delError } = await admin
    .from("scans")
    .delete()
    .eq("user_id", user.id)
    .in("id", ids);
  if (delError) {
    console.error("[api/competitors/remove] delete failed:", delError.message);
    return res.status(500).json({ error: "Could not remove that competitor." });
  }

  return res.status(200).json({ ok: true, removed: ids.length });
}
