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
      "[track] Missing SUPABASE_URL or SUPABASE_SERVICE_KEY. " +
      "Analytics tracking is disabled. Set both in your environment."
    );
    return null;
  }
  try {
    _supabase = createClient(url, key);
    return _supabase;
  } catch (err) {
    console.error("[track] Failed to create Supabase client:", err);
    return null;
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { event, properties } = req.body;

  const supabase = getSupabase();
  if (!supabase) {
    // Silently degrade — analytics is best-effort
    return res.status(200).json({ ok: true, warning: "Analytics not configured." });
  }

  try {
    await supabase.from("events").insert({
      event,
      properties,
      created_at: new Date().toISOString(),
    });
  } catch (err) {
    console.error(err);
  }

  res.status(200).json({ ok: true });
}