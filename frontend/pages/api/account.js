/**
 * The signed-in user's real account state: profile, plan, quota, storage.
 *
 * Read-only by design. The UI refetches this after signing in, after a scan
 * and after an upgrade; nothing it returns can be written from the browser.
 */
import { getAuthedUser } from "../../lib/supabase/auth";
import { loadAccountSummary } from "../../lib/server/account";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const user = await getAuthedUser({ req, res });
  if (!user) {
    return res.status(401).json({ error: "Not signed in", code: "unauthenticated" });
  }

  try {
    const account = await loadAccountSummary(user);
    if (!account) {
      return res.status(503).json({ error: "Account storage is not configured." });
    }
    // Account state is per-user and changes on every scan — never cache it.
    res.setHeader("Cache-Control", "private, no-store");
    return res.status(200).json(account);
  } catch (err) {
    console.error("[api/account] failed to load account:", err?.message || err);
    return res.status(500).json({ error: "Could not load your account." });
  }
}
