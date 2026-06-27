import { cn } from "../lib/utils";
import { getBand } from "../lib/scan-data";

// ── Benchmark constants ─────────────────────────────────────────────
// These are reasonable estimates based on the scoring system's own bands.
// The industry average (55) sits between "Fair — Many Gaps" (40-64) bands.
// Top performers (85+) align with "Excellent — Agent Ready" threshold.
// These are NOT from a statistical survey — they are heuristic benchmarks
// derived from the scoring system's own design.

const INDUSTRY_AVERAGE = 55;
const TOP_PERFORMER_THRESHOLD = 85;

const AVERAGE_BAND = getBand(INDUSTRY_AVERAGE); // "Fair — Many Gaps"
const TOP_BAND = getBand(TOP_PERFORMER_THRESHOLD); // "Excellent — Agent Ready"

// ── Component ───────────────────────────────────────────────────────

export function IndustryBenchmarking({ score }: { score: number }) {
  const yourBand = getBand(score);

  // Bar fill helpers
  const barWidth = (value: number) => `${Math.min(value, 100)}%`;

  return (
    <section aria-label="Industry benchmarking" className="mt-8">
      <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-5">
          <h2 className="text-sm font-semibold text-foreground">Industry Benchmarking</h2>
          <span className="rounded-full bg-secondary/30 px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground border border-border">
            Estimated
          </span>
        </div>

        {/* Three-column comparison */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {/* Your Score */}
          <div className="flex flex-col items-center rounded-lg bg-gradient-to-b from-transparent to-accent/[0.03] px-2 py-3 sm:px-3 sm:py-4">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Your Score
            </span>
            <span className={cn("font-mono text-2xl sm:text-3xl font-extrabold leading-none", yourBand.text)}>
              {score}
            </span>
            <span className="text-[10px] text-muted-foreground mt-0.5 text-center leading-tight hidden sm:block">
              {yourBand.label}
            </span>
            {/* Mini bar */}
            <div className="mt-2 h-1 w-full max-w-[80px] rounded-full bg-muted overflow-hidden">
              <div
                className={cn("h-full rounded-full", score >= 85 ? "bg-green-500" : score >= 65 ? "bg-accent" : score >= 40 ? "bg-orange-500" : "bg-red-500")}
                style={{ width: barWidth(score) }}
              />
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center justify-center">
            <svg className="h-5 w-5 text-muted-foreground/30" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
            </svg>
          </div>

          {/* Industry Average (estimated) */}
          <div className="flex flex-col items-center px-2 py-3 sm:px-3 sm:py-4">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Industry Avg.
            </span>
            <span className="font-mono text-2xl sm:text-3xl font-extrabold leading-none text-accent">
              {INDUSTRY_AVERAGE}
            </span>
            <span className="text-[10px] text-muted-foreground mt-0.5 text-center leading-tight hidden sm:block">
              {AVERAGE_BAND.label}
            </span>
            {/* Mini bar */}
            <div className="mt-2 h-1 w-full max-w-[80px] rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-accent"
                style={{ width: barWidth(INDUSTRY_AVERAGE) }}
              />
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center justify-center">
            <svg className="h-5 w-5 text-muted-foreground/30" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
            </svg>
          </div>

          {/* Top Performers */}
          <div className="flex flex-col items-center px-2 py-3 sm:px-3 sm:py-4">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Top Performers
            </span>
            <span className="font-mono text-2xl sm:text-3xl font-extrabold leading-none text-green-500">
              {TOP_PERFORMER_THRESHOLD}+
            </span>
            <span className="text-[10px] text-muted-foreground mt-0.5 text-center leading-tight hidden sm:block">
              {TOP_BAND.label}
            </span>
            {/* Mini bar */}
            <div className="mt-2 h-1 w-full max-w-[80px] rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-green-500"
                style={{ width: "100%" }}
              />
            </div>
          </div>
        </div>

        {/* Contextual message */}
        <div className="mt-4 pt-3 border-t border-border">
          <p className="text-xs text-muted-foreground leading-relaxed text-center">
            {score > INDUSTRY_AVERAGE ? (
              <>
                You are performing <strong className="text-foreground">above the estimated average</strong>.{" "}
                {score >= TOP_PERFORMER_THRESHOLD
                  ? "Your site ranks among top performers for AI visibility."
                  : "Closing the remaining gaps could put you among top performers."}
              </>
            ) : score === INDUSTRY_AVERAGE ? (
              <>
                You are at <strong className="text-foreground">the estimated industry average</strong>.{" "}
                Fixing the identified gaps could push you above average.
              </>
            ) : (
              <>
                You are <strong className="text-foreground">below the typical AI visibility level</strong>.{" "}
                Most optimized sites score {TOP_PERFORMER_THRESHOLD}+ across all checks.
              </>
            )}
          </p>
          {/* Disclaimer */}
          <p className="mt-2 text-[10px] text-muted-foreground/50 text-center">
            Benchmarks are estimates based on the scoring system&apos;s own design thresholds. Not derived from external industry data.
          </p>
        </div>
      </div>
    </section>
  );
}
