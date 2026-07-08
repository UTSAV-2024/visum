import { createClient } from "@supabase/supabase-js";

// Lazy-init Supabase client: never crashes at module-import time.
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

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { scan_id, url, email, total_score, band, checks, scan_time_ms } = req.body;

  if (!email || !url || typeof total_score !== "number") {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const supabase = getSupabase();
  if (!supabase) {
    return res.status(200).json({
      ok: true,
      warning: "Storage not configured — scan data will not be persisted.",
    });
  }

  // Update or insert scan record by scan_id
  const { error } = await supabase.from("scans").upsert(
    {
      scan_id,
      url,
      email: email.toLowerCase().trim(),
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

  res.status(200).json({ ok: true });
}
