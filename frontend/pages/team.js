import { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { cn } from "../lib/utils";
import { track } from "../lib/analytics";
import { withAuthRequired } from "../lib/auth-guard";
import { getSupabaseAdminClient } from "../lib/supabase/admin";
import { loadTeam, loadTeamActivity } from "../lib/server/team";
import { teamAction } from "../lib/api";

// ── Access control + real data ──────────────────────────────────
export const getServerSideProps = withAuthRequired(async (ctx, { user }) => {
  const team = await loadTeam(user.id).catch(() => null);

  let activity = [];
  if (team?.inTeam) {
    const admin = getSupabaseAdminClient();
    const memberById = new Map(team.members.map((m) => [m.userId, m]));
    activity = await loadTeamActivity(admin, team.org.id, memberById).catch(() => []);
  }

  return { props: { team: team ?? { inTeam: false }, activity } };
});

const ROLE_LABEL = { owner: "Owner", admin: "Admin", member: "Member", viewer: "Viewer" };

function initials(name, email) {
  const base = (name || email || "?").trim();
  return base
    .split(/\s+/)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function timeAgo(iso) {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const mins = Math.round((Date.now() - then) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.round(hrs / 24)}d ago`;
}

// A sub-feature we haven't built, shown honestly rather than faked.
function ComingSoon({ title, children }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card/50 p-5">
      <div className="flex items-center gap-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-foreground">{title}</p>
        <span className="rounded bg-muted/30 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
          Soon
        </span>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">{children}</p>
    </div>
  );
}

export default function TeamManagement({ team: initialTeam, activity }) {
  const router = useRouter();
  const [team, setTeam] = useState(initialTeam);
  const [teamName, setTeamName] = useState("");
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");

  const origin = typeof window !== "undefined" ? window.location.origin : "";

  async function run(body, busyKey) {
    setBusy(busyKey);
    setError("");
    try {
      const { team: next } = await teamAction(body);
      if (next) setTeam(next);
      // Role/membership changes ripple into other pages — refresh server props.
      router.replace(router.asPath, undefined, { scroll: false });
      return true;
    } catch (err) {
      setError(err.message || "Something went wrong.");
      return false;
    } finally {
      setBusy("");
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    track("team_created", {});
    await run({ action: "create", name: teamName }, "create");
  }

  function copyLink(token) {
    const url = `${origin}/join/${token}`;
    navigator.clipboard?.writeText(url).then(
      () => {
        setCopied(token);
        setTimeout(() => setCopied(""), 1800);
      },
      () => {}
    );
  }

  // ── Not in a team: create one ──────────────────────────────────
  if (!team?.inTeam) {
    return (
      <>
        <Head>
          <title>Team — Visum</title>
          <meta name="description" content="Create a team to share your scan allowance and results." />
        </Head>
        <div className="mx-auto max-w-lg px-4 sm:px-6 py-10 sm:py-16">
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
              <svg className="h-6 w-6 text-accent" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
              </svg>
            </div>
            <h1 className="text-lg font-bold text-foreground">Create a team</h1>
            <p className="mx-auto mt-1.5 max-w-sm text-sm text-muted-foreground">
              Invite teammates to share your scan allowance and see each other&apos;s scans.
              You&apos;ll be the owner, and your plan becomes the shared pool.
            </p>
            <form onSubmit={handleCreate} className="mt-6 flex flex-col gap-2">
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Team name (e.g. Acme Marketing)"
                className="h-11 w-full rounded-xl border border-border bg-secondary/50 px-4 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-accent"
              />
              {error && <p className="text-sm font-medium text-destructive">{error}</p>}
              <button
                type="submit"
                disabled={busy === "create"}
                className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
              >
                {busy === "create" ? "Creating…" : "Create team"}
              </button>
            </form>
          </div>
        </div>
      </>
    );
  }

  // ── In a team ──────────────────────────────────────────────────
  const { org, role, isOwner, canManage, members, invites } = team;

  return (
    <>
      <Head>
        <title>Team — Visum</title>
        <meta name="description" content="Manage your team, roles, and invites." />
      </Head>

      <div>
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-8">
          <div className="animate-fadeIn space-y-4 sm:space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-foreground">{org.name}</h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                {members.length} {members.length === 1 ? "member" : "members"} · you&apos;re the{" "}
                {ROLE_LABEL[role]?.toLowerCase()} · scans and results are shared across the team
              </p>
            </div>

            {error && (
              <p className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-2 text-sm font-medium text-destructive">
                {error}
              </p>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Members */}
              <div className="lg:col-span-2 rounded-2xl border border-border bg-card">
                <div className="flex items-center justify-between border-b border-border p-4">
                  <p className="text-xs font-semibold uppercase tracking-widest text-foreground">Members</p>
                </div>
                <ul className="divide-y divide-border">
                  {members.map((m) => (
                    <li key={m.userId} className="flex items-center gap-3 px-4 py-3">
                      {m.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={m.avatarUrl} alt="" referrerPolicy="no-referrer" className="h-8 w-8 shrink-0 rounded-full object-cover" />
                      ) : (
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10 text-[11px] font-bold text-accent">
                          {initials(m.fullName, m.email)}
                        </span>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">
                          {m.fullName || m.email.split("@")[0]}
                          {m.isYou && <span className="ml-1.5 text-[10px] text-muted-foreground">(you)</span>}
                        </p>
                        <p className="truncate text-[11px] text-muted-foreground">{m.email}</p>
                      </div>

                      {/* Role: owner can change non-owners; else static label */}
                      {isOwner && !m.isOwner ? (
                        <select
                          value={m.role}
                          disabled={busy === `role-${m.userId}`}
                          onChange={(e) => run({ action: "set_role", userId: m.userId, role: e.target.value }, `role-${m.userId}`)}
                          className="rounded-lg border border-border bg-secondary/50 px-2 py-1 text-[11px] font-medium text-foreground outline-none focus:border-accent disabled:opacity-60"
                          aria-label={`Role for ${m.email}`}
                        >
                          <option value="admin">Admin</option>
                          <option value="member">Member</option>
                          <option value="viewer">Viewer</option>
                        </select>
                      ) : (
                        <span className="rounded-md bg-muted/20 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                          {ROLE_LABEL[m.role]}
                        </span>
                      )}

                      {/* Remove (owner/admin can remove others; anyone can leave) */}
                      {!m.isOwner && (canManage || m.isYou) && (
                        <button
                          onClick={() => run({ action: "remove", userId: m.userId }, `rm-${m.userId}`)}
                          disabled={busy === `rm-${m.userId}`}
                          className="shrink-0 rounded-md p-1.5 text-muted-foreground/50 transition-colors hover:bg-muted/20 hover:text-destructive disabled:opacity-40"
                          aria-label={m.isYou ? "Leave team" : `Remove ${m.email}`}
                          title={m.isYou ? "Leave team" : "Remove member"}
                        >
                          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                          </svg>
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Activity */}
              <div className="rounded-2xl border border-border bg-card">
                <div className="border-b border-border p-4">
                  <p className="text-xs font-semibold uppercase tracking-widest text-foreground">Activity</p>
                </div>
                <div className="p-2">
                  {activity.length === 0 ? (
                    <p className="px-2 py-6 text-center text-xs text-muted-foreground/60">
                      No scans yet. Team scans will appear here.
                    </p>
                  ) : (
                    <ul className="space-y-0.5">
                      {activity.map((a) => (
                        <li key={a.id} className="flex items-start gap-2.5 rounded-lg px-2 py-2">
                          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                          <div className="min-w-0">
                            <p className="text-xs text-foreground">
                              <span className="font-medium">{a.actorName}</span> scanned{" "}
                              <span className="font-medium">{a.host}</span>
                            </p>
                            <p className="text-[10px] text-muted-foreground/60">
                              {a.score}/100 · {timeAgo(a.at)}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            {/* Invites (owner/admin only) */}
            {canManage && (
              <div className="rounded-2xl border border-border bg-card p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-foreground">Invite links</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      Anyone with a link can join as the chosen role. Links expire in 14 days.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {["member", "admin", "viewer"].map((r) => (
                      <button
                        key={r}
                        onClick={() => run({ action: "invite", role: r }, `inv-${r}`)}
                        disabled={busy === `inv-${r}`}
                        className="inline-flex h-9 items-center justify-center rounded-lg border border-primary/40 px-3 text-xs font-semibold text-primary transition-colors hover:bg-primary/10 disabled:opacity-60"
                      >
                        {busy === `inv-${r}` ? "…" : `+ ${ROLE_LABEL[r]}`}
                      </button>
                    ))}
                  </div>
                </div>

                {invites.length > 0 && (
                  <ul className="mt-4 space-y-2">
                    {invites.map((inv) => (
                      <li key={inv.id} className="flex items-center gap-2 rounded-lg border border-border bg-background/50 px-3 py-2">
                        <span className="rounded bg-muted/20 px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                          {ROLE_LABEL[inv.role]}
                        </span>
                        <code className="min-w-0 flex-1 truncate text-[11px] text-muted-foreground">
                          {origin}/join/{inv.token}
                        </code>
                        <button
                          onClick={() => copyLink(inv.token)}
                          className="shrink-0 rounded-md border border-border px-2 py-1 text-[11px] font-semibold text-foreground transition-colors hover:bg-muted/20"
                        >
                          {copied === inv.token ? "Copied" : "Copy"}
                        </button>
                        <button
                          onClick={() => run({ action: "revoke_invite", inviteId: inv.id }, `rev-${inv.id}`)}
                          disabled={busy === `rev-${inv.id}`}
                          className="shrink-0 rounded-md p-1.5 text-muted-foreground/50 transition-colors hover:bg-muted/20 hover:text-destructive disabled:opacity-40"
                          aria-label="Revoke invite"
                          title="Revoke"
                        >
                          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                          </svg>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Honestly-gated sub-features with no data source yet */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <ComingSoon title="API keys">
                Programmatic access to your scans. Not available yet — for now, scans run from the app.
              </ComingSoon>
              <ComingSoon title="Notifications">
                Email / Slack alerts on score changes and new issues. Not wired up yet.
              </ComingSoon>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
