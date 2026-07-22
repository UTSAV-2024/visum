// Service-role Supabase client. Server-only: this key bypasses Row Level
// Security, so it must never be imported into anything that reaches the
// browser.
//
// Lazily initialised so a missing key can never crash the app at import time —
// callers get null and degrade gracefully.
import { createClient } from "@supabase/supabase-js";

let _client = null;

export function getSupabaseAdminClient() {
  if (_client) return _client;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) {
    console.warn(
      "[supabase/admin] Missing SUPABASE_URL or SUPABASE_SERVICE_KEY. " +
        "Server-side account and scan storage is disabled."
    );
    return null;
  }

  try {
    _client = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    return _client;
  } catch (err) {
    console.error("[supabase/admin] Failed to create client:", err);
    return null;
  }
}
