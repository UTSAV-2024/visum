import { useEffect, useState, useCallback, useMemo } from "react";
import Head from "next/head";
import Link from "next/link";
import { ScoreEvolution } from "../components/reports/score-evolution";
import { ScanTimeline } from "../components/reports/scan-timeline";
import { IssuesOverTime } from "../components/reports/issues-over-time";
import { SideBySide } from "../components/reports/side-by-side";
import { ExportActions } from "../components/reports/export-actions";
import { cn } from "../lib/utils";
import { track } from "../lib/analytics";
import { withAuthRequired } from "../lib/auth-guard";
import { deriveReports } from "../lib/derive-from-scans";

export default function Reports({ report = null, host = null }) {
  // Stable identity so the export callbacks don't rebuild every render.
  const timeline = useMemo(() => report?.timeline ?? [], [report]);
  const [selectedScan, setSelectedScan] = useState(timeline[0]?.id);
  const hasScans = !!report?.hasScans;

  useEffect(() => {
    track("reports_viewed", { scans: timeline.length, host });
  }, [timeline.length, host]);

  const handleExportPDF = useCallback(() => {
    window.print();
  }, []);

  const handleExportCSV = useCallback(() => {
    const headers = "Date,Score,Change,Issues,Resolved,Regressions\n";
    const rows = timeline
      .map((s) => `${s.date},${s.score},${s.change},${s.issues},${s.resolved},${s.regressions}`)
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `visum-report-${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [timeline]);

  const handleShare = useCallback(() => {
    if (timeline.length === 0) return;
    const latest = timeline[0].score;
    const first = timeline[timeline.length - 1].score;
    const text =
      timeline.length > 1
        ? `My AI visibility score for ${host} is ${latest}/100 — from ${first}. Check yours at visum.io`
        : `My AI visibility score for ${host} is ${latest}/100. Check yours at visum.io`;
    navigator.clipboard.writeText(text).catch(() => {});
  }, [timeline, host]);

  return (
    <>
      <Head>
        <title>Reports - Visum</title>
        <meta name="description" content="Scan reports and historical comparison for AI visibility." />
      </Head>

      <div>
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-8">
          {!hasScans ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                <svg className="h-6 w-6 text-accent" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.5 2A1.5 1.5 0 003 3.5v13A1.5 1.5 0 004.5 18h11a1.5 1.5 0 001.5-1.5V7.621a1.5 1.5 0 00-.44-1.06l-4.12-4.122A1.5 1.5 0 0011.378 2H4.5z" clipRule="evenodd" />
                </svg>
              </div>
              <h1 className="text-lg font-bold text-foreground">No reports yet</h1>
              <p className="mx-auto mt-1.5 max-w-sm text-sm text-muted-foreground">
                Reports track your score and issues across scans. Run a scan, then re-scan after
                each fix to watch the trend build.
              </p>
              <Link
                href="/#scan"
                className="mt-6 inline-flex h-10 items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground no-underline transition-colors hover:bg-primary/90"
              >
                Run your first scan
              </Link>
            </div>
          ) : (
            <div className="animate-fadeIn space-y-4 sm:space-y-6">
              {/* Page Header */}
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-foreground">Reports</h1>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                  {host}
                  {timeline.length > 1
                    ? ` — ${timeline.length} scans tracked`
                    : " — your first scan; re-scan to build a trend"}
                </p>
              </div>

              {/* Summary bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                {(() => {
                  const change = timeline.length > 1 ? timeline[0].score - timeline[timeline.length - 1].score : 0;
                  const fixed = timeline.reduce((s, h) => s + (h.resolved || 0), 0);
                  return [
                    { label: "Total Scans", value: timeline.length, color: "text-foreground" },
                    { label: "Score Change", value: `${change >= 0 ? "+" : ""}${change}`, color: change >= 0 ? "text-green-500" : "text-red-500" },
                    { label: "Issues Fixed", value: fixed, color: "text-green-500" },
                    { label: "Current Score", value: timeline[0].score, color: "text-accent" },
                  ];
                })().map((stat) => (
                  <div key={stat.label} className="relative rounded-xl border border-border bg-card p-3">
                    <p className="text-[9px] sm:text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">{stat.label}</p>
                    <p className={cn("font-mono text-lg sm:text-xl font-bold tabular-nums mt-0.5", stat.color)}>{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Score Evolution + Timeline */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="lg:col-span-2">
                  <ScoreEvolution series={report.scoreSeries} />
                </div>
                <ScanTimeline
                  scans={timeline}
                  selectedScan={selectedScan}
                  onSelectScan={setSelectedScan}
                />
              </div>

              {/* Historical Issues, Resolved, Regressions */}
              <IssuesOverTime issues={report.issueHistory} />

              {/* Side-by-Side Scan Comparison — only meaningful with 2+ scans */}
              <SideBySide scans={timeline} />

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

// ── Access control + real data ──────────────────────────────────
// Server-side auth plus the real score/issue trends derived from the user's
// scan history.
export const getServerSideProps = withAuthRequired(async (ctx, { supabase }) => {
  const { data: scans, error } = await supabase
    .from("scans")
    .select("id, scan_id, url, total_score, band, checks, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) console.error("[reports] failed to load scans:", error.message);

  const report = deriveReports(scans ?? []);
  return { props: { report, host: report.host ?? null } };
});
