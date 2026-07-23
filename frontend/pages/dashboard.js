import { useEffect, useCallback } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { VisibilityScore } from "../components/dashboard/visibility-score";
import { OverallGrade } from "../components/dashboard/overall-grade";
import { MetricCard } from "../components/dashboard/metric-card";
import { AlertsPanel } from "../components/dashboard/alerts-panel";
import { IssuesPanel } from "../components/dashboard/issues-panel";
import { RecentlyFixed } from "../components/dashboard/recently-fixed";
import { ScanHistory } from "../components/dashboard/scan-history";
import { ActivityFeed } from "../components/dashboard/activity-feed";
import { QuickActions } from "../components/dashboard/quick-actions";
import { CommandCenterHero } from "../components/dashboard/command-center-hero";
import { MyScans } from "../components/dashboard/my-scans";
import { track } from "../lib/analytics";
import { withAuthRequired } from "../lib/auth-guard";
import { deriveDashboard } from "../lib/derive-from-scans";

/**
 * Server-side auth + real data.
 *
 * withAuthRequired is the enforcement boundary: an unauthenticated request
 * never receives the dashboard at all. The scans are fetched with the user's
 * own RLS-scoped client — the query has no user_id filter because RLS applies
 * it — and everything the page shows is derived from those rows.
 */
export const getServerSideProps = withAuthRequired(async (ctx, { supabase }) => {
  const { data: scans, error } = await supabase
    .from("scans")
    .select("id, scan_id, url, total_score, band, checks, scan_time_ms, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("[dashboard] failed to load scans:", error.message);
  }

  return { props: { scans: scans ?? [], dashboard: deriveDashboard(scans ?? []) } };
});

// Map a 0–100 dimension score to the MetricCard's status vocabulary.
function statusFor(value) {
  if (value == null) return "warning";
  return value >= 80 ? "success" : value >= 60 ? "warning" : "error";
}

// ── Main Dashboard Component ─────────────────────────────────────

function firstNameFrom(account) {
  const full = account?.profile?.fullName || "";
  if (full.trim()) return full.trim().split(/\s+/)[0];
  const email = account?.profile?.email || "";
  return email ? email.split("@")[0] : "";
}

export default function ExecutiveDashboard({ scans = [], dashboard = null, account = null }) {
  const router = useRouter();
  const hasScans = !!dashboard?.hasScans;

  useEffect(() => {
    track("dashboard_viewed", {
      has_scans: hasScans,
      score: dashboard?.score ?? null,
      url: dashboard?.url ?? null,
    });
  }, [hasScans, dashboard]);

  const handleScanAgain = useCallback(() => {
    track("scan_again_clicked", { from: "dashboard", current_score: dashboard?.score ?? null });
    router.push("/#scan");
  }, [router, dashboard]);

  // The hero's real inputs: the derived view plus who/where from the account.
  const heroData = hasScans
    ? {
        firstName: firstNameFrom(account),
        domain: dashboard.host,
        score: dashboard.score,
        previousScore: dashboard.previousScore,
        delta: dashboard.delta,
        band: dashboard.band,
        health: dashboard.health,
        lastScanLabel: dashboard.lastScanLabel,
        executiveSummary: dashboard.executiveSummary,
        highlights: dashboard.highlights,
        recommendedActions: dashboard.recommendedActions,
      }
    : null;

  // Recommendations for the issues panel's second tab, in its lighter shape.
  const panelRecs = hasScans
    ? dashboard.issues.map((iss) => ({
        title: iss.name,
        impact: iss.severity === "critical" ? "High" : iss.severity === "major" ? "Medium" : "Low",
        effort: iss.severity === "minor" ? "Low" : "Medium",
      }))
    : [];

  const DIMENSION_META = hasScans
    ? [
        {
          label: "AI Readability",
          value: dashboard.dimensions.readability,
          description: "How easily AI systems can parse your content",
          icon: (
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.362 1.093a.75.75 0 00-.724 0L2.523 5.018 10 9.143l7.477-4.125-7.115-3.925zM18 6.443l-7.25 4v8.25l6.862-3.786A.75.75 0 0018 14.25V6.443zm-8.75 12.25v-8.25l-7.25-4v7.807a.75.75 0 00.388.657l6.862 3.786z" />
            </svg>
          ),
        },
        {
          label: "AI Crawlability",
          value: dashboard.dimensions.crawlability,
          description: "How well AI crawlers can navigate your site",
          icon: (
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z" clipRule="evenodd" />
              <path fillRule="evenodd" d="M6 10a.75.75 0 01.75-.75h9.546l-1.048-.943a.75.75 0 111.004-1.114l2.5 2.25a.75.75 0 010 1.114l-2.5 2.25a.75.75 0 11-1.004-1.114l1.048-.943H6.75A.75.75 0 016 10z" clipRule="evenodd" />
            </svg>
          ),
        },
        {
          label: "Structured Data",
          value: dashboard.dimensions.structuredData,
          description: "Schema markup and JSON-LD completeness",
          icon: (
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M1 2.75A.75.75 0 011.75 2h16.5a.75.75 0 010 1.5H1.75A.75.75 0 011 2.75zm0 5A.75.75 0 011.75 7h16.5a.75.75 0 010 1.5H1.75A.75.75 0 011 7.75zm0 5a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H1.75a.75.75 0 01-.75-.75zm0 5a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H1.75a.75.75 0 01-.75-.75z" clipRule="evenodd" />
            </svg>
          ),
        },
      ]
    : [];

  return (
    <>
      <Head>
        <title>Dashboard — Visum</title>
        <meta
          name="description"
          content="Your AI-readiness dashboard — score, issues, and fixes derived from your own scans."
        />
      </Head>

      <div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* ── Command Center Hero (real, or onboarding when empty) ── */}
          <div className="mb-8 sm:mb-10">
            <CommandCenterHero data={heroData} />
          </div>

          {/* ── Your scans ───────────────────────────────────────── */}
          <div className="mb-8 sm:mb-10">
            <MyScans scans={scans} />
          </div>

          {/* Everything below is derived from your latest scan; it only
              appears once there's a scan to derive it from. */}
          {hasScans && (
            <div className="animate-fadeIn space-y-4 sm:space-y-6">
              {/* ── Top Section: Score + Grade + Alerts ──────────── */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
                <div className="lg:col-span-5">
                  <VisibilityScore
                    score={dashboard.score}
                    previousScore={dashboard.previousScore ?? dashboard.score}
                    url={dashboard.host}
                  />
                </div>
                <div className="lg:col-span-3">
                  <OverallGrade score={dashboard.score} className="h-full" />
                </div>
                <div className="lg:col-span-4">
                  <AlertsPanel alerts={dashboard.alerts} className="h-full" />
                </div>
              </div>

              {/* ── Metric Cards Row ──────────────────────────────── */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                {DIMENSION_META.map((d) => (
                  <MetricCard
                    key={d.label}
                    label={d.label}
                    value={d.value ?? 0}
                    description={d.description}
                    status={statusFor(d.value)}
                    trend={d.value == null ? "stable" : d.value >= 80 ? "up" : "stable"}
                    trendValue={
                      d.value == null
                        ? "Not measured"
                        : d.value >= 80
                        ? "Well optimized"
                        : "Needs attention"
                    }
                    icon={d.icon}
                    size="md"
                  />
                ))}
              </div>

              {/* ── Issues + Recommendations ──────────────────────── */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <IssuesPanel issues={dashboard.issues} recommendations={panelRecs} />
                <ScanHistory history={dashboard.scanHistory} />
              </div>

              {/* ── Bottom Section: Fixes + Activity ─────────────── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <RecentlyFixed items={dashboard.recentlyFixed} />
                <ActivityFeed activities={dashboard.activity} />
              </div>

              {/* ── Quick Actions ─────────────────────────────────── */}
              <QuickActions onScanAgain={handleScanAgain} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
