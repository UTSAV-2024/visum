import { createClient } from "@supabase/supabase-js";
import { getSupabaseServerClient } from "../../lib/supabase/server";

// Lazy-init Supabase admin client: never crashes at module-import time.
// If credentials are missing, db() returns null and handlers degrade gracefully.
let _supabase = null;

function getSupabase() {
  if (_supabase) return _supabase;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) {
    console.warn(
      "[save-scan] Missing SUPABASE_URL or SUPABASE_SERVICE_KEY. " +
      "Scan saving is disabled. Set both in your environment."
    );
    return null;
  }
  try {
    _supabase = createClient(url, key);
    return _supabase;
  } catch (err) {
    console.error("[save-scan] Failed to create Supabase client:", err);
    return null;
  }
}

/**
 * Resolve the signed-in user from the request cookies, if any.
 * getUser() validates the JWT against the auth server — never trust a user id
 * sent in the request body.
 */
async function getAuthedUser(req, res) {
  try {
    const authClient = getSupabaseServerClient({ req, res });
    if (!authClient) return null;
    const { data, error } = await authClient.auth.getUser();
    if (error) return null;
    return data?.user ?? null;
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { scan_id, url, email, total_score, band, checks, scan_time_ms } = req.body || {};

  if (!url || typeof total_score !== "number") {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // user_id comes from the verified session only — never from the request body.
  const user = await getAuthedUser(req, res);
  const resolvedEmail = (email || user?.email || "").toLowerCase().trim() || null;

  // Require some way to attribute the scan: a signed-in user or an email.
  if (!user && !resolvedEmail) {
    return res.status(400).json({ error: "An email or a signed-in session is required" });
  }

  const supabase = getSupabase();
  if (!supabase) {
    return res.status(200).json({
      ok: true,
      warning: "Storage not configured — scan data will not be persisted.",
    });
  }

  const { error } = await supabase.from("scans").upsert(
    {
      scan_id,
      url,
      email: resolvedEmail,
      user_id: user?.id ?? null,
      total_score,
      band,
      checks,
      scan_time_ms,
      created_at: new Date().toISOString(),
    },
    { onConflict: "scan_id" }
  );

  if (error) {
    console.error("Supabase save-scan error:", error);
    return res.status(500).json({ error: "Failed to save scan data" });
  }

  res.status(200).json({ ok: true, saved_for_user: !!user });
}
