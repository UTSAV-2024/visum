// Browser-side Supabase client (cookie-backed session via @supabase/ssr).
//
// Use this in React components / pages. It returns null when auth is not
// configured so callers can degrade gracefully instead of crashing.
import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_URL, SUPABASE_ANON_KEY, isAuthEnabled } from "../config";

let _client = null;

export function getSupabaseBrowserClient() {
  if (!isAuthEnabled) return null;
  if (_client) return _client;
  _client = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return _client;
}
