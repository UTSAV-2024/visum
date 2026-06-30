import { cn } from "../lib/utils";
import { getBand } from "../lib/scan-data";

// ── Target score constants ─────────────────────────────────────────
// These are scoring system thresholds, not industry averages.
// The "Partially Visible" band starts at 65, "Agent-Ready" starts at 85.

const TARGET_SCORE = 65;
const AGENT_READY_THRESHOLD = 85;

const TARGET_BAND = getBand(TARGET_SCORE);
const READY_BAND = getBand(AGENT_READY_THRESHOLD);

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
          <h2 className="text-sm font-semibold text-foreground">Score Benchmarks</h2>
          <span className="rounded-full bg-secondary/30 px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground border border-border">
            System Thresholds
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

          {/* Target Score (system threshold) */}
          <div className="flex flex-col items-center px-2 py-3 sm:px-3 sm:py-4">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Target Score
            </span>
            <span className="font-mono text-2xl sm:text-3xl font-extrabold leading-none text-accent">
              {TARGET_SCORE}
            </span>
            <span className="text-[10px] text-muted-foreground mt-0.5 text-center leading-tight hidden sm:block">
              {TARGET_BAND.label}
            </span>
            {/* Mini bar */}
            <div className="mt-2 h-1 w-full max-w-[80px] rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-accent"
                style={{ width: barWidth(TARGET_SCORE) }}
              />
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center justify-center">
            <svg className="h-5 w-5 text-muted-foreground/30" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
            </svg>
          </div>

          {/* Agent Ready (max threshold) */}
          <div className="flex flex-col items-center px-2 py-3 sm:px-3 sm:py-4">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Agent Ready
            </span>
            <span className="font-mono text-2xl sm:text-3xl font-extrabold leading-none text-green-500">
              {AGENT_READY_THRESHOLD}
            </span>
            <span className="text-[10px] text-muted-foreground mt-0.5 text-center leading-tight hidden sm:block">
              {READY_BAND.label}
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
            {score >= AGENT_READY_THRESHOLD ? (
              <>
                Your score is in the <strong className="text-foreground">Agent Ready</strong> range.{" "}
                Your site meets the highest standard for AI visibility.
              </>
            ) : score >= TARGET_SCORE ? (
              <>
                You are <strong className="text-foreground">above the target score</strong> of {TARGET_SCORE}.{" "}
                Closing the remaining gaps could put you in the Agent Ready range.
              </>
            ) : (
              <>
                The target score is <strong className="text-foreground">{TARGET_SCORE}</strong> (Partially Visible).{" "}
                Optimized sites score {AGENT_READY_THRESHOLD}+ across all checks.
              </>
            )}
          </p>
          {/* Note */}
          <p className="mt-2 text-[10px] text-muted-foreground/50 text-center">
            Target scores are based on the scoring system&apos;s design thresholds. Not industry averages.
          </p>
        </div>
      </div>
    </section>
  );
}
