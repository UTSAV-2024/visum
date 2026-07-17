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

      <div className="min-h-screen bg-background text-foreground">
        <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
          <div className="mx-auto flex h-14 sm:h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
            <Link href="/" className="flex items-center gap-2 text-lg font-extrabold tracking-tight text-foreground no-underline">
              <svg className="h-6 w-6 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
              </svg>
              Visum
            </Link>
            <Link href="/" className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-[11px] sm:text-xs font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 no-underline">
              <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39l.001-.001z" clipRule="evenodd" />
              </svg>
              New Scan
            </Link>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-8">
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
        </main>

        <footer className="border-t border-border mt-8">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} Visum — AI Visibility Platform</p>
            <div className="flex items-center gap-4">
              <Link href="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Home</Link>
              <Link href="/dashboard" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
              <Link href="/analytics" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Analytics</Link>
              <Link href="/result" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Results</Link>
              <Link href="/recommendations" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Recommendations</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
