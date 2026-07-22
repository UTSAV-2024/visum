import { useEffect, useState, useCallback } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { VisibilityScore } from "../components/dashboard/visibility-score";
import { OverallGrade } from "../components/dashboard/overall-grade";
import { MetricCard } from "../components/dashboard/metric-card";
import { AlertsPanel } from "../components/dashboard/alerts-panel";
import { AITrafficTrend } from "../components/dashboard/ai-traffic-trend";
import { IssuesPanel } from "../components/dashboard/issues-panel";
import { RecentlyFixed } from "../components/dashboard/recently-fixed";
import { ScanHistory } from "../components/dashboard/scan-history";
import { ActivityFeed } from "../components/dashboard/activity-feed";
import { QuickActions } from "../components/dashboard/quick-actions";
import { DashboardSkeleton } from "../components/dashboard/loading-skeleton";
import { CommandCenterHero } from "../components/dashboard/command-center-hero";
import { MyScans } from "../components/dashboard/my-scans";
import { cn } from "../lib/utils";
import { getBand } from "../lib/scan-data";
import { track } from "../lib/analytics";
import { withAuthRequired } from "../lib/auth-guard";

/**
 * Server-side auth + real data.
 *
 * withAuthRequired is the enforcement boundary: an unauthenticated request
 * never receives the dashboard at all. The scans are then fetched with the
 * user's own RLS-scoped client, so the database itself guarantees a user can
 * only ever see their own rows — the query has no user_id filter because RLS
 * applies it.
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

  return { props: { scans: scans ?? [] } };
});

// ── Demo / mock data ─────────────────────────────────────────────

const DEMO_DATA = {
  score: 78,
  previousScore: 73,
  url: "example.com",
  readability: 85,
  crawlability: 72,
  structuredData: 68,
  lastScanDate: "Jul 17, 2026, 10:30 AM",
};

// ── Main Dashboard Component ─────────────────────────────────────

export default function ExecutiveDashboard({ scans = [], authEnabled = false }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  // Simulate loading from sessionStorage or API
  useEffect(() => {
    const loadTimer = setTimeout(() => {
      // Try to read from sessionStorage first
      try {
        const stored = sessionStorage.getItem("visum_result");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed?.result) {
            setData(parsed.result);
          } else {
            setData(DEMO_DATA);
          }
        } else {
          setData(DEMO_DATA);
        }
      } catch {
        setData(DEMO_DATA);
      }
      setLoading(false);
    }, 1800); // Intentional delay to show skeleton

    return () => clearTimeout(loadTimer);
  }, []);

  // Track page view
  useEffect(() => {
    if (!loading && data) {
      track("dashboard_viewed", {
        score: data.total_score || data.score,
        url: data.url,
      });
    }
  }, [loading, data]);

  const handleScanAgain = useCallback(() => {
    track("scan_again_clicked", {
      from: "dashboard",
      current_score: data?.total_score || data?.score,
    });
    router.push("/");
  }, [router, data]);

  const score = data ? (data.total_score ?? data.score ?? DEMO_DATA.score) : DEMO_DATA.score;
  const previousScore = data
    ? data.previous_score || data.previousScore || DEMO_DATA.previousScore
    : DEMO_DATA.previousScore;
  const siteUrl = data ? data.url : DEMO_DATA.url;
  const readability = data ? data.readability || DEMO_DATA.readability : DEMO_DATA.readability;
  const crawlability = data
    ? data.crawlability || DEMO_DATA.crawlability
    : DEMO_DATA.crawlability;
  const structuredData = data
    ? data.structured_data || data.structuredData || DEMO_DATA.structuredData
    : DEMO_DATA.structuredData;

  return (
    <>
      <Head>
        <title>Executive Dashboard - Visum</title>
        <meta
          name="description"
          content="AI Visibility Executive Dashboard — Monitor your website's AI readiness score, crawlability, and structured data health."
        />
      </Head>

      <div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* ── Command Center Hero ──────────────────────────────── */}
          <div className="mb-8 sm:mb-10">
            <CommandCenterHero loading={loading} />
          </div>

          {/* ── Your real scans (live data from your account) ────── */}
          {authEnabled && (
            <div className="mb-8 sm:mb-10">
              <MyScans scans={scans} />
            </div>
          )}

          {/* Everything below is sample data — clearly separated from the
              real per-account scans above. */}
          {authEnabled && (
            <div className="mb-4 flex items-center gap-2">
              <span className="rounded-md bg-muted/30 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Sample data
              </span>
              <span className="text-xs text-muted-foreground">
                The panels below are a product preview, not your account data.
              </span>
            </div>
          )}

          {loading ? (
            <DashboardSkeleton />
          ) : (
            <div className="animate-fadeIn space-y-4 sm:space-y-6">
              {/* ── Top Section: Score + Grade + Alerts ──────────── */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
                {/* AI Visibility Score - spans 5 columns */}
                <div className="lg:col-span-5">
                  <VisibilityScore
                    score={score}
                    previousScore={previousScore}
                    url={siteUrl}
                  />
                </div>

                {/* Overall Grade - spans 3 columns */}
                <div className="lg:col-span-3">
                  <OverallGrade score={score} className="h-full" />
                </div>

                {/* Alerts - spans 4 columns */}
                <div className="lg:col-span-4">
                  <AlertsPanel className="h-full" />
                </div>
              </div>

              {/* ── Metric Cards Row ──────────────────────────────── */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                {/* AI Readability */}
                <MetricCard
                  label="AI Readability"
                  value={readability}
                  description="How easily AI systems can parse your content"
                  status={readability >= 80 ? "success" : readability >= 60 ? "warning" : "error"}
                  trend={readability >= 80 ? "up" : "stable"}
                  trendValue={readability >= 80 ? "Well optimized" : "Needs attention"}
                  icon={
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10.362 1.093a.75.75 0 00-.724 0L2.523 5.018 10 9.143l7.477-4.125-7.115-3.925zM18 6.443l-7.25 4v8.25l6.862-3.786A.75.75 0 0018 14.25V6.443zm-8.75 12.25v-8.25l-7.25-4v7.807a.75.75 0 00.388.657l6.862 3.786z" />
                    </svg>
                  }
                  size="md"
                />

                {/* AI Crawlability */}
                <MetricCard
                  label="AI Crawlability"
                  value={crawlability}
                  description="How well AI crawlers can navigate your site"
                  status={crawlability >= 80 ? "success" : crawlability >= 60 ? "warning" : "error"}
                  trend="down"
                  trendValue="Decreased since last scan"
                  icon={
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z"
                        clipRule="evenodd"
                      />
                      <path
                        fillRule="evenodd"
                        d="M6 10a.75.75 0 01.75-.75h9.546l-1.048-.943a.75.75 0 111.004-1.114l2.5 2.25a.75.75 0 010 1.114l-2.5 2.25a.75.75 0 11-1.004-1.114l1.048-.943H6.75A.75.75 0 016 10z"
                        clipRule="evenodd"
                      />
                    </svg>
                  }
                  size="md"
                />

                {/* Structured Data */}
                <MetricCard
                  label="Structured Data"
                  value={structuredData}
                  description="Schema markup and JSON-LD completeness"
                  status={structuredData >= 80 ? "success" : structuredData >= 60 ? "warning" : "error"}
                  trend="up"
                  trendValue="Improved +8 pts"
                  icon={
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M1 2.75A.75.75 0 011.75 2h16.5a.75.75 0 010 1.5H1.75A.75.75 0 011 2.75zm0 5A.75.75 0 011.75 7h16.5a.75.75 0 010 1.5H1.75A.75.75 0 011 7.75zm0 5a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H1.75a.75.75 0 01-.75-.75zm0 5a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H1.75a.75.75 0 01-.75-.75z"
                        clipRule="evenodd"
                      />
                    </svg>
                  }
                  size="md"
                />
              </div>

              {/* ── Middle Section: Traffic Trend + Issues ────────── */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <AITrafficTrend />
                <IssuesPanel />
              </div>

              {/* ── Bottom Section: Three Columns ────────────────── */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                <RecentlyFixed />
                <ScanHistory />
                <ActivityFeed />
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
