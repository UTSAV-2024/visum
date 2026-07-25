/**
 * Team actions — one endpoint, one POST body with an `action`.
 *
 * Every action re-resolves the caller's membership and role server-side, so
 * the client can't act above its permission level regardless of what it sends.
 */
import { getAuthedUser } from "../../../lib/supabase/auth";
import { getSupabaseAdminClient } from "../../../lib/supabase/admin";
import {
  createTeam,
  createInvite,
  revokeInvite,
  acceptInvite,
  setRole,
  removeMember,
  loadTeam,
} from "../../../lib/server/team";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const user = await getAuthedUser({ req, res });
  if (!user) return res.status(401).json({ error: "Sign in first.", code: "unauthenticated" });

  const admin = getSupabaseAdminClient();
  if (!admin) return res.status(503).json({ error: "Teams are temporarily unavailable." });

  const { action } = req.body || {};

  try {
    switch (action) {
      case "create": {
        const r = await createTeam(admin, user, req.body.name);
        if (r.error) return res.status(400).json(r);
        break;
      }
      case "invite": {
        const r = await createInvite(admin, user, req.body.role);
        if (r.error) return res.status(400).json(r);
        break;
      }
      case "revoke_invite": {
        const r = await revokeInvite(admin, user, req.body.inviteId);
        if (r.error) return res.status(400).json(r);
        break;
      }
      case "accept": {
        const r = await acceptInvite(admin, user, req.body.token);
        if (r.error) return res.status(400).json(r);
        break;
      }
      case "set_role": {
        const r = await setRole(admin, user, req.body.userId, req.body.role);
        if (r.error) return res.status(400).json(r);
        break;
      }
      case "remove": {
        const r = await removeMember(admin, user, req.body.userId);
        if (r.error) return res.status(400).json(r);
        break;
      }
      default:
        return res.status(400).json({ error: "Unknown action." });
    }
  } catch (err) {
    console.error("[api/team] action failed:", err?.message || err);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }

  // Return the fresh team state so the UI updates without a second round-trip.
  const team = await loadTeam(user.id).catch(() => null);
  return res.status(200).json({ ok: true, team });
}
