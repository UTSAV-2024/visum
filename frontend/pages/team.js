import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { cn } from "../lib/utils";
import { track } from "../lib/analytics";
import { MembersSection } from "../components/team/members-section";
import { InviteUser } from "../components/team/invite-user";
import { ActivityLog } from "../components/team/activity-log";
import { NotificationsSettings } from "../components/team/notifications-settings";
import { ApiKeysSection } from "../components/team/api-keys-section";
import { BillingSummary } from "../components/team/billing-summary";
import { WorkspaceSettings } from "../components/team/workspace-settings";
import { OrgAnalytics } from "../components/team/org-analytics";
import { TeamSkeleton } from "../components/team/loading-skeleton";
import { TEAM_MEMBERS, BILLING } from "../components/team/data";
import { withAuthRequired } from "../lib/auth-guard";

export default function TeamManagement() {
  const [loading, setLoading] = useState(true);
  const [showInvite, setShowInvite] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1300);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!loading) track("team_viewed", {});
  }, [loading]);

  const activeMembers = TEAM_MEMBERS.filter((m) => m.status === "active").length;

  return (
    <>
      <Head>
        <title>Team - Visum</title>
        <meta name="description" content="Manage your team, roles, permissions, and workspace settings." />
      </Head>

      <div>
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-8">
          {loading ? (
            <TeamSkeleton />
          ) : (
            <div className="animate-fadeIn space-y-4 sm:space-y-6">
              {/* Page Header */}
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-foreground">Team Management</h1>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                  {TEAM_MEMBERS.length} members · {activeMembers} active · {BILLING.plan} plan
                </p>
              </div>

              {/* Invite User */}
              {showInvite && <InviteUser onClose={() => setShowInvite(false)} />}

              {/* Members + Activity Log */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="lg:col-span-2">
                  <MembersSection onInvite={() => setShowInvite(true)} />
                </div>
                <ActivityLog />
              </div>

              {/* Organization Analytics */}
              <OrgAnalytics />

              {/* Notifications + API Keys */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <NotificationsSettings />
                <ApiKeysSection />
              </div>

              {/* Workspace + Billing */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <WorkspaceSettings />
                <BillingSummary />
              </div>

              {/* Recent Actions footer */}
              <div className="relative rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="h-4 w-4 text-accent" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <p className="text-xs font-semibold uppercase tracking-widest text-foreground">Recent Actions</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { label: "Scans Completed", value: "1,423", change: "+12%", color: "text-accent" },
                    { label: "Issues Resolved", value: "156", change: "+8%", color: "text-green-500" },
                    { label: "Team Activity", value: "89", change: "this week", color: "text-blue-500" },
                  ].map((a) => (
                    <div key={a.label} className="rounded-xl bg-muted/5 border border-border p-3">
                      <p className="text-[9px] text-muted-foreground/70 uppercase tracking-wider">{a.label}</p>
                      <p className={cn("font-mono text-lg font-bold tabular-nums mt-1", a.color)}>{a.value}</p>
                      <p className="text-[9px] text-muted-foreground/60 mt-0.5">{a.change}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ── Access control ──────────────────────────────────────────────
// Verified server-side: this page never reaches an unauthenticated browser,
// with or without a direct URL.
export const getServerSideProps = withAuthRequired();
