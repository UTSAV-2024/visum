/**
 * Team membership — server-only.
 *
 * Every role check lives here, behind the service-role key. The browser can
 * read team rows (RLS lets a member see their own org) but can never write
 * them, so roles can't be escalated client-side.
 */
import { randomBytes } from "crypto";
import { getSupabaseAdminClient } from "../supabase/admin";

const ROLE_RANK = { owner: 3, admin: 2, member: 1, viewer: 0 };

/** The org a user belongs to, with their role — or null if they're solo. */
export async function getMembership(admin, userId) {
  const { data: member, error } = await admin
    .from("organization_members")
    .select("org_id, role, joined_at")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) {
    console.error("[team] getMembership:", error.message);
    return null;
  }
  if (!member) return null;

  const { data: org } = await admin
    .from("organizations")
    .select("id, name, owner_id, created_at")
    .eq("id", member.org_id)
    .maybeSingle();
  if (!org) return null;

  return {
    orgId: member.org_id,
    role: member.role,
    joinedAt: member.joined_at,
    org: { id: org.id, name: org.name, ownerId: org.owner_id, createdAt: org.created_at },
  };
}

/**
 * The full team view for the /team page: the org, every member (with profile),
 * pending invites, and the caller's own role. Null when the user isn't in a team.
 */
export async function loadTeam(userId) {
  const admin = getSupabaseAdminClient();
  if (!admin) return null;

  const membership = await getMembership(admin, userId);
  if (!membership) return { inTeam: false };

  const { orgId, org } = membership;

  const [membersRes, invitesRes] = await Promise.all([
    admin
      .from("organization_members")
      .select("user_id, role, joined_at")
      .eq("org_id", orgId)
      .order("joined_at", { ascending: true }),
    admin
      .from("organization_invites")
      .select("id, token, role, created_at, expires_at, revoked")
      .eq("org_id", orgId)
      .eq("revoked", false)
      .order("created_at", { ascending: false }),
  ]);

  // Profiles joined in JS — there's no direct FK from members to profiles for
  // PostgREST to embed on (both reference auth.users).
  const memberRows = membersRes.data || [];
  const ids = memberRows.map((m) => m.user_id);
  const { data: profileRows } = ids.length
    ? await admin.from("profiles").select("id, email, full_name, avatar_url").in("id", ids)
    : { data: [] };
  const profileById = new Map((profileRows || []).map((p) => [p.id, p]));

  const members = memberRows.map((m) => {
    const p = profileById.get(m.user_id) || {};
    return {
      userId: m.user_id,
      role: m.role,
      joinedAt: m.joined_at,
      email: p.email || "",
      fullName: p.full_name || "",
      avatarUrl: p.avatar_url || "",
      isOwner: m.user_id === org.ownerId,
      isYou: m.user_id === userId,
    };
  });

  // Only unexpired invites are actionable.
  const now = Date.now();
  const invites = (invitesRes.data || [])
    .filter((i) => new Date(i.expires_at).getTime() > now)
    .map((i) => ({
      id: i.id,
      token: i.token,
      role: i.role,
      createdAt: i.created_at,
      expiresAt: i.expires_at,
    }));

  return {
    inTeam: true,
    org: { id: org.id, name: org.name, ownerId: org.ownerId, createdAt: org.createdAt },
    role: membership.role,
    isOwner: userId === org.ownerId,
    canManage: ROLE_RANK[membership.role] >= ROLE_RANK.admin,
    members,
    invites,
  };
}

/**
 * Recent team activity, reconstructed from the org's scans: who scanned what,
 * and when. The only real "who did what" signal the app produces.
 */
export async function loadTeamActivity(admin, orgId, memberById, limit = 12) {
  const { data, error } = await admin
    .from("scans")
    .select("id, url, total_score, user_id, created_at")
    .eq("org_id", orgId)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) {
    console.error("[team] loadTeamActivity:", error.message);
    return [];
  }
  return (data || []).map((s) => {
    const who = memberById.get(s.user_id);
    let host = s.url;
    try {
      host = new URL(s.url).hostname.replace(/^www\./, "");
    } catch {
      /* keep raw */
    }
    return {
      id: s.id,
      actorName: who?.fullName || who?.email || "A teammate",
      host,
      score: s.total_score,
      at: s.created_at,
    };
  });
}

/** Create a team and make the user its owner. Fails if they're already in one. */
export async function createTeam(admin, user, name) {
  const existing = await getMembership(admin, user.id);
  if (existing) return { error: "You're already part of a team." };

  const teamName = (name || "").trim() || defaultTeamName(user);

  const { data: org, error: orgErr } = await admin
    .from("organizations")
    .insert({ name: teamName, owner_id: user.id })
    .select("id, name, owner_id, created_at")
    .single();
  if (orgErr) {
    console.error("[team] createTeam org:", orgErr.message);
    return { error: "Could not create the team." };
  }

  const { error: memErr } = await admin
    .from("organization_members")
    .insert({ org_id: org.id, user_id: user.id, role: "owner" });
  if (memErr) {
    // Roll back the org so we don't leave an ownerless team.
    await admin.from("organizations").delete().eq("id", org.id);
    console.error("[team] createTeam member:", memErr.message);
    return { error: "Could not create the team." };
  }

  // Adopt the owner's own-site (primary) scans into the team so the shared
  // dashboard isn't empty on day one. Competitor research stays personal.
  await admin
    .from("scans")
    .update({ org_id: org.id })
    .eq("user_id", user.id)
    .eq("kind", "primary")
    .is("org_id", null);

  return { org };
}

/** Create a shareable invite link for a role. Requires admin or owner. */
export async function createInvite(admin, user, role) {
  const membership = await getMembership(admin, user.id);
  if (!membership) return { error: "Create a team first." };
  if (ROLE_RANK[membership.role] < ROLE_RANK.admin) {
    return { error: "Only owners and admins can invite people." };
  }
  const inviteRole = ["admin", "member", "viewer"].includes(role) ? role : "member";
  const token = randomBytes(24).toString("base64url");

  const { data, error } = await admin
    .from("organization_invites")
    .insert({
      org_id: membership.orgId,
      token,
      role: inviteRole,
      created_by: user.id,
    })
    .select("id, token, role, expires_at")
    .single();
  if (error) {
    console.error("[team] createInvite:", error.message);
    return { error: "Could not create an invite." };
  }
  return { invite: data };
}

/** Revoke a pending invite. Requires admin or owner. */
export async function revokeInvite(admin, user, inviteId) {
  const membership = await getMembership(admin, user.id);
  if (!membership || ROLE_RANK[membership.role] < ROLE_RANK.admin) {
    return { error: "Only owners and admins can manage invites." };
  }
  const { error } = await admin
    .from("organization_invites")
    .update({ revoked: true })
    .eq("id", inviteId)
    .eq("org_id", membership.orgId); // can't touch another org's invites
  if (error) return { error: "Could not revoke the invite." };
  return { ok: true };
}

/** Look up a live invite by token (for the accept screen). */
export async function getInviteByToken(admin, token) {
  const { data, error } = await admin
    .from("organization_invites")
    .select("id, org_id, role, expires_at, revoked, organizations!inner(name)")
    .eq("token", token)
    .maybeSingle();
  if (error || !data) return null;
  if (data.revoked || new Date(data.expires_at).getTime() < Date.now()) return null;
  return { id: data.id, orgId: data.org_id, role: data.role, orgName: data.organizations.name };
}

/** Accept an invite: join the org. Fails if the user is already in a team. */
export async function acceptInvite(admin, user, token) {
  const invite = await getInviteByToken(admin, token);
  if (!invite) return { error: "That invite link is invalid or has expired." };

  const existing = await getMembership(admin, user.id);
  if (existing) {
    if (existing.orgId === invite.orgId) return { ok: true, alreadyMember: true };
    return { error: "You're already in a team. Leave it before joining another." };
  }

  const { error } = await admin
    .from("organization_members")
    .insert({ org_id: invite.orgId, user_id: user.id, role: invite.role });
  if (error) {
    console.error("[team] acceptInvite:", error.message);
    return { error: "Could not join the team." };
  }

  // The new member's own-site scans join the team pool; their competitor
  // research stays personal to them.
  await admin
    .from("scans")
    .update({ org_id: invite.orgId })
    .eq("user_id", user.id)
    .eq("kind", "primary")
    .is("org_id", null);

  return { ok: true, orgName: invite.orgName };
}

/** Change a member's role. Owner-only; the owner's own role can't change. */
export async function setRole(admin, user, targetUserId, role) {
  const membership = await getMembership(admin, user.id);
  if (!membership || user.id !== membership.org.ownerId) {
    return { error: "Only the team owner can change roles." };
  }
  if (targetUserId === membership.org.ownerId) {
    return { error: "The owner's role can't be changed." };
  }
  if (!["admin", "member", "viewer"].includes(role)) {
    return { error: "Unknown role." };
  }
  const { error } = await admin
    .from("organization_members")
    .update({ role })
    .eq("org_id", membership.orgId)
    .eq("user_id", targetUserId);
  if (error) return { error: "Could not update the role." };
  return { ok: true };
}

/**
 * Remove a member (owner/admin), or leave the team yourself. The owner can't
 * leave — they'd orphan the team; they'd delete it instead (future work).
 * When someone leaves, their scans stay with the team (org_id keeps pointing
 * at the org); they simply lose access via RLS.
 */
export async function removeMember(admin, user, targetUserId) {
  const membership = await getMembership(admin, user.id);
  if (!membership) return { error: "You're not in a team." };

  const isSelf = targetUserId === user.id;
  const isOwnerActing = user.id === membership.org.ownerId;

  if (targetUserId === membership.org.ownerId) {
    return { error: "The owner can't be removed." };
  }
  if (!isSelf && ROLE_RANK[membership.role] < ROLE_RANK.admin) {
    return { error: "Only owners and admins can remove members." };
  }

  const { error } = await admin
    .from("organization_members")
    .delete()
    .eq("org_id", membership.orgId)
    .eq("user_id", targetUserId);
  if (error) return { error: "Could not remove the member." };
  return { ok: true, left: isSelf, byOwner: isOwnerActing };
}

function defaultTeamName(user) {
  const meta = user.user_metadata || {};
  const name = meta.full_name || meta.name || (user.email ? user.email.split("@")[0] : "");
  return name ? `${name}'s Team` : "My Team";
}
