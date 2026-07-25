/**
 * OAuth / email-confirmation landing point.
 *
 * Supabase sends the browser back here with a one-time `code`. Exchanging it
 * server-side means the session cookies are written by the server in the same
 * response as the redirect, so the very next page load is already signed in —
 * no flash of a signed-out UI, and no session living only in JavaScript.
 */
import { getSupabaseServerClient } from "../../../lib/supabase/server";
import { safeNext, DEFAULT_NEXT } from "../../../lib/safe-next";

function bounceToLogin(res, reason, next) {
  const params = new URLSearchParams({ error: reason });
  if (next) params.set("next", next);
  res.redirect(302, `/login?${params.toString()}`);
}

export default async function handler(req, res) {
  const { code, next, error: providerError } = req.query;
  const destination = safeNext(next, DEFAULT_NEXT);

  // The user declined consent, or the provider rejected the request.
  if (providerError) {
    return bounceToLogin(res, "oauth_denied", destination);
  }

  if (!code || typeof code !== "string") {
    return bounceToLogin(res, "missing_code", destination);
  }

  const supabase = getSupabaseServerClient({ req, res });
  if (!supabase) {
    return bounceToLogin(res, "auth_unavailable", destination);
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    console.error("[auth/callback] code exchange failed:", error.message);
    return bounceToLogin(res, "exchange_failed", destination);
  }

  return res.redirect(302, destination);
}
