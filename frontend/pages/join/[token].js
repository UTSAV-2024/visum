import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { AuthShell } from "../../components/auth/auth-shell";
import { getAuthedUser } from "../../lib/supabase/auth";
import { getSupabaseAdminClient } from "../../lib/supabase/admin";
import { getInviteByToken, getMembership } from "../../lib/server/team";

/**
 * The invite landing page.
 *
 * Public so a signed-out invitee can see who invited them before deciding to
 * sign in. The token rides through auth as `next`, so signing in returns here
 * and the join completes in one more click.
 */
export async function getServerSideProps(ctx) {
  const { token } = ctx.params;
  const admin = getSupabaseAdminClient();
  if (!admin) return { props: { status: "unavailable", token } };

  const invite = await getInviteByToken(admin, token);
  if (!invite) return { props: { status: "invalid", token } };

  const user = await getAuthedUser(ctx);
  const signedIn = !!user;

  // Already in a team? Say so rather than silently failing on accept.
  let alreadyInTeam = false;
  let alreadyThisTeam = false;
  if (user) {
    const membership = await getMembership(admin, user.id);
    if (membership) {
      alreadyInTeam = true;
      alreadyThisTeam = membership.orgId === invite.orgId;
    }
  }

  return {
    props: {
      status: "ok",
      token,
      orgName: invite.orgName,
      role: invite.role,
      signedIn,
      alreadyInTeam,
      alreadyThisTeam,
    },
  };
}

export default function JoinTeam({
  status,
  token,
  orgName,
  role,
  signedIn,
  alreadyInTeam,
  alreadyThisTeam,
}) {
  const router = useRouter();
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState("");

  async function handleJoin() {
    setJoining(true);
    setError("");
    try {
      const res = await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ action: "accept", token }),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(payload.error || "Could not join the team.");
        setJoining(false);
        return;
      }
      router.replace("/team");
    } catch {
      setError("Something went wrong. Please try again.");
      setJoining(false);
    }
  }

  const title =
    status === "ok" ? `Join ${orgName}` : status === "invalid" ? "Invite not found" : "Unavailable";

  let body;
  if (status !== "ok") {
    body = (
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          {status === "invalid"
            ? "This invite link is invalid, has been revoked, or has expired. Ask whoever invited you for a fresh link."
            : "Team invites aren't available right now. Please try again shortly."}
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex h-10 items-center justify-center rounded-xl border border-border px-5 text-sm font-semibold text-foreground no-underline transition-colors hover:bg-muted/20"
        >
          Back to Visum
        </Link>
      </div>
    );
  } else if (alreadyThisTeam) {
    body = (
      <div className="text-center">
        <p className="text-sm text-muted-foreground">You&apos;re already on this team.</p>
        <Link
          href="/team"
          className="mt-6 inline-flex h-10 items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground no-underline transition-colors hover:bg-primary/90"
        >
          Go to your team
        </Link>
      </div>
    );
  } else if (alreadyInTeam) {
    body = (
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          You&apos;re already part of another team. Leave it first if you want to join{" "}
          <span className="font-medium text-foreground">{orgName}</span>.
        </p>
        <Link
          href="/team"
          className="mt-6 inline-flex h-10 items-center justify-center rounded-xl border border-border px-5 text-sm font-semibold text-foreground no-underline transition-colors hover:bg-muted/20"
        >
          View my team
        </Link>
      </div>
    );
  } else if (!signedIn) {
    const next = encodeURIComponent(`/join/${token}`);
    body = (
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          You&apos;ve been invited to join{" "}
          <span className="font-medium text-foreground">{orgName}</span> as a{" "}
          <span className="font-medium text-foreground">{role}</span>. Sign in or create an account
          to accept.
        </p>
        <div className="mt-6 flex flex-col gap-2">
          <Link
            href={`/login?next=${next}`}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground no-underline transition-colors hover:bg-primary/90"
          >
            Sign in to join
          </Link>
          <Link
            href={`/signup?next=${next}`}
            className="inline-flex h-11 items-center justify-center rounded-xl border border-border px-6 text-sm font-semibold text-foreground no-underline transition-colors hover:bg-muted/20"
          >
            Create an account
          </Link>
        </div>
      </div>
    );
  } else {
    body = (
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          You&apos;ve been invited to join{" "}
          <span className="font-medium text-foreground">{orgName}</span> as a{" "}
          <span className="font-medium text-foreground">{role}</span>. You&apos;ll share the team&apos;s
          scan allowance and see the team&apos;s scans.
        </p>
        {error && <p className="mt-3 text-sm font-medium text-destructive">{error}</p>}
        <button
          type="button"
          onClick={handleJoin}
          disabled={joining}
          className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
        >
          {joining ? "Joining…" : `Join ${orgName}`}
        </button>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{title} — Visum</title>
        <meta name="robots" content="noindex" />
      </Head>
      <AuthShell title={title} subtitle={status === "ok" ? "Team invitation" : ""}>
        {body}
      </AuthShell>
    </>
  );
}
