import { useEffect, useState, useCallback } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { AiBotVisits } from "../components/analytics/ai-bot-visits";
import { TokenConsumption } from "../components/analytics/token-consumption";
import { CrawlingTimeline } from "../components/analytics/crawling-timeline";
import { ContentIndexed } from "../components/analytics/content-indexed";
import { AiMentionsHeatmap } from "../components/analytics/ai-mentions-heatmap";
import { RetrievalSuccess } from "../components/analytics/retrieval-success";
import { PromptSuccessRate } from "../components/analytics/prompt-success-rate";
import { AiEngineComparison } from "../components/analytics/ai-engine-comparison";
import { TrendCharts } from "../components/analytics/trend-charts";
import { DateRangePicker } from "../components/analytics/date-range-picker";
import { InsightsPanel } from "../components/analytics/insights-panel";
import { AnalyticsSkeleton } from "../components/analytics/loading-skeleton";
import { cn } from "../lib/utils";
import { track } from "../lib/analytics";

// ── Status indicator ─────────────────────────────────────────────

function StatusDot({ status = "online" }) {
  const colors = { online: "bg-green-500", warning: "bg-orange-500", offline: "bg-red-500" };
  return (
    <span className="relative inline-flex h-2 w-2">
      <span className={cn("absolute inline-flex h-full w-full animate-ping rounded-full opacity-75", colors[status])} />
      <span className={cn("relative inline-flex h-2 w-2 rounded-full", colors[status])} />
    </span>
  );
}

// ── Stat Pill ────────────────────────────────────────────────────

function StatPill({ label, value, trend, icon, color = "text-foreground" }) {
  return (
    <div className="relative rounded-xl border border-border bg-card p-3 sm:p-4 transition-all duration-200 hover:border-accent/30 hover:shadow-[0_0_20px_-12px_rgba(124,58,237,0.15)]">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.02] to-transparent pointer-events-none rounded-xl" />
      <div className="relative z-10 flex items-start gap-3">
        {icon && (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
            {icon}
          </div>
        )}
        <div className="min-w-0">
          <p className="text-[9px] sm:text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">
            {label}
          </p>
          <p className={cn("font-mono text-sm sm:text-base font-bold tabular-nums mt-0.5", color)}>
            {value}
          </p>
          {trend && (
            <p className="text-[9px] sm:text-[10px] text-muted-foreground/60 mt-0.5">{trend}</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────

export default function AiAnalytics() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    start: "",
    end: "",
    preset: "30d",
  });
  const [comparePeriod, setComparePeriod] = useState(false);

  // Simulate loading
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1600);
    return () => clearTimeout(t);
  }, []);

  // Track view
  useEffect(() => {
    if (!loading) {
      track("analytics_viewed", { date_range: dateRange.preset });
    }
  }, [loading, dateRange.preset]);

  const handleScanAgain = useCallback(() => {
    track("scan_again_clicked", { from: "analytics" });
    router.push("/");
  }, [router]);

  const handleExport = useCallback(() => {
    track("analytics_export", {});
    // Trigger print for PDF
    window.print();
  }, []);

  return (
    <>
      <Head>
        <title>AI Analytics - Visum</title>
        <meta
          name="description"
          content="AI Analytics dashboard — Understand how AI models see your website with advanced visualizations, trends, and insights."
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
              <svg className="h-6 w-6 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              Visum
            </Link>

            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/dashboard"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted/20 transition-all"
              >
                Dashboard
              </Link>
              <span className="hidden sm:flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <StatusDot status="online" />
                Live
              </span>
              <button
                onClick={handleScanAgain}
                disabled={loading}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-[11px] sm:text-xs font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="h-3 w-3 sm:h-3.5 sm:w-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39l.001-.001zm-6.6.529a.75.75 0 00.84-1.242 5.5 5.5 0 019.747-2.099l.31.31h-2.434a.75.75 0 000 1.5h4.242a.75.75 0 00.75-.75v-4.242a.75.75 0 00-1.5 0v2.43l-.31-.31A7 7 0 008.712 11.95l.001.003z" clipRule="evenodd" />
                </svg>
                {loading ? "Loading..." : "Scan New"}
              </button>
            </div>
          </div>
        </header>

        {/* ── Main Content ────────────────────────────────────────── */}
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {loading ? (
            <AnalyticsSkeleton />
          ) : (
            <div className="animate-fadeIn space-y-4 sm:space-y-6">
              {/* ── Page Header ────────────────────────────────────── */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-lg sm:text-xl font-bold text-foreground">
                    AI Analytics
                  </h1>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                    Understand how AI models interact with your website
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {/* Compare toggle */}
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={comparePeriod}
                      onChange={() => setComparePeriod(!comparePeriod)}
                      className="h-3 w-3 rounded border-border bg-muted text-accent focus:ring-accent"
                    />
                    <span className="text-[10px] sm:text-xs text-muted-foreground">Compare previous period</span>
                  </label>
                  {/* Date picker */}
                  <DateRangePicker
                    value={dateRange}
                    onChange={(range) => setDateRange(range)}
                  />
                  {/* Export */}
                  <button
                    onClick={handleExport}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted/20 transition-all"
                  >
                    <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
                      <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
                    </svg>
                    Export
                  </button>
                </div>
              </div>

              {/* ── Stats Strip ──────────────────────────────────── */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
                <StatPill
                  label="AI Visits"
                  value="6,258"
                  trend="+18% this period"
                  icon={
                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 1a4.5 4.5 0 00-4.5 4.5v2.5a2 2 0 00-2 2v4a2 2 0 002 2h9a2 2 0 002-2v-4a2 2 0 00-2-2v-2.5A4.5 4.5 0 0010 1zm-2.5 7V5.5a2.5 2.5 0 015 0V8h-5z" />
                    </svg>
                  }
                  color="text-accent"
                />
                <StatPill
                  label="Tokens Consumed"
                  value="6.3M"
                  trend="+23% vs prev period"
                  icon={
                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10.362 1.093a.75.75 0 00-.724 0L2.523 5.018 10 9.143l7.477-4.125-7.115-3.925zM18 6.443l-7.25 4v8.25l6.862-3.786A.75.75 0 0018 14.25V6.443zm-8.75 12.25v-8.25l-7.25-4v7.807a.75.75 0 00.388.657l6.862 3.786z" />
                    </svg>
                  }
                  color="text-orange-500"
                />
                <StatPill
                  label="Pages Indexed"
                  value="2,847"
                  trend="96% index rate"
                  icon={
                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.5 2A1.5 1.5 0 003 3.5v13A1.5 1.5 0 004.5 18h11a1.5 1.5 0 001.5-1.5V7.621a1.5 1.5 0 00-.44-1.06l-4.12-4.122A1.5 1.5 0 0011.378 2H4.5z" clipRule="evenodd" />
                    </svg>
                  }
                  color="text-blue-500"
                />
                <StatPill
                  label="Retrieval Rate"
                  value="86%"
                  trend="+14% improvement"
                  icon={
                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                  }
                  color="text-green-500"
                />
                <StatPill
                  label="Prompt Success"
                  value="91%"
                  trend="Avg across engines"
                  icon={
                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  }
                  color="text-green-500"
                />
              </div>

              {/* ── Row 1: Bot Visits + Token Chart ────────────── */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <AiBotVisits />
                <TokenConsumption />
              </div>

              {/* ── Crawling Timeline (full width) ─────────────── */}
              <CrawlingTimeline />

              {/* ── Row 2: Content Indexed + Mentions Heatmap ── */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <ContentIndexed />
                <AiMentionsHeatmap />
              </div>

              {/* ── Row 3: Retrieval Success + Prompt Rate ────── */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <RetrievalSuccess />
                <PromptSuccessRate />
              </div>

              {/* ── AI Engine Comparison (full width) ─────────── */}
              <AiEngineComparison />

              {/* ── Trends (full width) ───────────────────────── */}
              <TrendCharts />

              {/* ── AI Insights (full width) ──────────────────── */}
              <InsightsPanel />
            </div>
          )}
        </main>

        {/* ── Footer ─────────────────────────────────────────────── */}
        <footer className="border-t border-border mt-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} Visum — AI Visibility Platform
            </p>
            <div className="flex items-center gap-4">
              <Link href="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Home</Link>
              <Link href="/dashboard" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
              <Link href="/about" className="text-xs text-muted-foreground hover:text-foreground transition-colors">About</Link>
              <Link href="/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Privacy</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
