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
import { cn } from "../lib/utils";
import { getBand } from "../lib/scan-data";
import { track } from "../lib/analytics";

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

// ── Status indicator component ───────────────────────────────────

function StatusDot({ status = "online" }) {
  const colors = {
    online: "bg-green-500",
    warning: "bg-orange-500",
    offline: "bg-red-500",
  };
  return (
    <span className="relative inline-flex h-2 w-2">
      <span
        className={cn(
          "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
          colors[status]
        )}
      />
      <span
        className={cn(
          "relative inline-flex h-2 w-2 rounded-full",
          colors[status]
        )}
      />
    </span>
  );
}

// ── Welcome banner ───────────────────────────────────────────────

function WelcomeBanner({ url, score }) {
  const band = getBand(score);

  return (
    <div className="relative mb-6 sm:mb-8 overflow-hidden rounded-2xl border border-accent/20 bg-gradient-to-r from-accent/5 via-accent/[0.02] to-transparent p-5 sm:p-6">
      {/* Decorative elements */}
      <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-accent/5 blur-3xl" />
      <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-accent/5 blur-3xl" />

      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-foreground">
              Executive Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              AI visibility overview for{" "}
              <span className="font-medium text-foreground">{url}</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg bg-accent/10 px-3 py-1.5">
              <StatusDot status="online" />
              <span className="text-[11px] font-medium text-accent">
                System online
              </span>
            </div>
            <span
              className={cn(
                "rounded-full px-3 py-1 text-[11px] font-semibold",
                band.pill,
                band.pillText
              )}
            >
              {band.label}
            </span>
          </div>
        </div>

        {/* Quick summary */}
        <div className="mt-4 flex flex-wrap gap-4 sm:gap-6">
          <div className="flex items-center gap-2">
            <span className="font-mono text-2xl font-bold tabular-nums text-foreground">
              {score}
            </span>
            <span className="text-xs text-muted-foreground/60">/100</span>
            <span className="inline-flex items-center gap-0.5 rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-semibold text-green-500">
              <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.563a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-3.95V16.25A.75.75 0 0110 17z"
                  clipRule="evenodd"
                />
              </svg>
              +5
            </span>
          </div>
          <div className="text-[11px] text-muted-foreground">
            Last scanned{" "}
            <span className="font-medium text-foreground">
              {DEMO_DATA.lastScanDate}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Dashboard Component ─────────────────────────────────────

export default function ExecutiveDashboard() {
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

      <div className="min-h-screen bg-background text-foreground">
        {/* ── Header ──────────────────────────────────────────────── */}
        <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
          <div className="mx-auto flex h-14 sm:h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-extrabold tracking-tight text-foreground no-underline"
            >
              <svg
                className="h-6 w-6 text-accent"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              Visum
            </Link>

            <div className="flex items-center gap-2 sm:gap-3">
              <span className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
                <StatusDot status="online" />
                All systems normal
              </span>
              <button
                onClick={handleScanAgain}
                disabled={loading}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39l-.001.001zm-6.6.529a.75.75 0 00.84-1.242 5.5 5.5 0 019.747-2.099l.31.31h-2.434a.75.75 0 000 1.5h4.242a.75.75 0 00.75-.75v-4.242a.75.75 0 00-1.5 0v2.43l-.31-.31A7 7 0 008.712 11.95l.001.003z"
                    clipRule="evenodd"
                  />
                </svg>
                {loading ? "Loading..." : "Scan Again"}
              </button>
            </div>
          </div>
        </header>

        {/* ── Dashboard Content ───────────────────────────────────── */}
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {loading ? (
            <DashboardSkeleton />
          ) : (
            <div className="animate-fadeIn space-y-4 sm:space-y-6">
              {/* Welcome Banner */}
              <WelcomeBanner url={siteUrl} score={score} />

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
        </main>

        {/* ── Footer ───────────────────────────────────────────────── */}
        <footer className="border-t border-border mt-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} Visum — AI Visibility Platform
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Home
              </Link>
              <Link
                href="/about"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                About
              </Link>
              <Link
                href="/privacy"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
