import { useEffect, useState, useCallback } from "react";
import Head from "next/head";
import Link from "next/link";
import { ScoreEvolution } from "../components/reports/score-evolution";
import { ScanTimeline } from "../components/reports/scan-timeline";
import { IssuesOverTime } from "../components/reports/issues-over-time";
import { AIVisibilityGrowth } from "../components/reports/ai-visibility-growth";
import { SideBySide } from "../components/reports/side-by-side";
import { ExportActions } from "../components/reports/export-actions";
import { ReportsSkeleton } from "../components/reports/loading-skeleton";
import { cn } from "../lib/utils";
import { track } from "../lib/analytics";
import { SCAN_HISTORY } from "../components/reports/data";
import { withAuthRequired } from "../lib/auth-guard";

export default function Reports() {
  const [loading, setLoading] = useState(true);
  const [selectedScan, setSelectedScan] = useState(SCAN_HISTORY[0]?.id);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!loading) track("reports_viewed", {});
  }, [loading]);

  const handleExportPDF = useCallback(() => {
    window.print();
  }, []);

  const handleExportCSV = useCallback(() => {
    // Generate CSV from scan history
    const headers = "Date,Score,Issues,Resolved,Regressions,Changes\n";
    const rows = SCAN_HISTORY.map((s) => `${s.date},${s.score},${s.issues},${s.resolved},${s.regressions},"${s.changes}"`).join("\n");
    const csv = headers + rows;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `visum-report-${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  const handleShare = useCallback(() => {
    const text = `My AI Visibility score is ${SCAN_HISTORY[0]?.score}/100 — improved from ${SCAN_HISTORY[SCAN_HISTORY.length - 1]?.score}. Track yours at visum.io`;
    navigator.clipboard.writeText(text).catch(() => {});
  }, []);

  return (
    <>
      <Head>
        <title>Reports - Visum</title>
        <meta name="description" content="Scan reports and historical comparison for AI visibility." />
      </Head>

      <div>
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-8">
          {loading ? (
            <ReportsSkeleton />
          ) : (
            <div className="animate-fadeIn space-y-4 sm:space-y-6">
              {/* Page Header */}
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-foreground">Reports</h1>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                  Track your AI visibility growth across {SCAN_HISTORY.length} scans over the past month
                </p>
              </div>

              {/* Summary bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                {[
                  { label: "Total Scans", value: SCAN_HISTORY.length, color: "text-foreground" },
                  { label: "Score Change", value: `+${SCAN_HISTORY[0].score - SCAN_HISTORY[SCAN_HISTORY.length - 1].score}`, color: "text-green-500" },
                  { label: "Issues Fixed", value: SCAN_HISTORY.reduce((s, h) => s + h.resolved, 0), color: "text-green-500" },
                  { label: "Current Score", value: SCAN_HISTORY[0].score, color: "text-accent" },
                ].map((stat) => (
                  <div key={stat.label} className="relative rounded-xl border border-border bg-card p-3">
                    <p className="text-[9px] sm:text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">{stat.label}</p>
                    <p className={cn("font-mono text-lg sm:text-xl font-bold tabular-nums mt-0.5", stat.color)}>{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Score Evolution + Timeline */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="lg:col-span-2">
                  <ScoreEvolution />
                </div>
                <ScanTimeline
                  selectedScan={selectedScan}
                  onSelectScan={setSelectedScan}
                />
              </div>

              {/* Historical Issues, Resolved Issues, Regression Detection */}
              <IssuesOverTime />

              {/* AI Visibility Growth */}
              <AIVisibilityGrowth />

              {/* Side-by-Side Scan Comparison */}
              <SideBySide />

              {/* Export Actions */}
              <ExportActions
                onExportPDF={handleExportPDF}
                onExportCSV={handleExportCSV}
                onShare={handleShare}
              />
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
