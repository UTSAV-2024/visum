import { cn } from "../lib/utils";

// ── Heuristic percentile mapping ────────────────────────────────────
// These are reasonable estimates based on the scoring system's thresholds.
// Not derived from real-world survey data.

const PERCENTILE_BANDS = [
  { min: 90, label: "Top 5%", color: "text-green-500", bg: "bg-green-500/10", ring: "ring-green-500/30", bar: "bg-green-500" },
  { min: 80, label: "Top 15%", color: "text-green-400", bg: "bg-green-500/5",  ring: "ring-green-500/20", bar: "bg-green-500" },
  { min: 70, label: "Top 30%", color: "text-accent",     bg: "bg-accent/10",    ring: "ring-accent/30",    bar: "bg-accent" },
  { min: 50, label: "Top 50%", color: "text-orange-400", bg: "bg-orange-500/10", ring: "ring-orange-500/30", bar: "bg-orange-500" },
  { min: 0,  label: "Bottom 50%", color: "text-red-500", bg: "bg-red-500/10",    ring: "ring-red-500/30",    bar: "bg-red-500" },
];

function getPercentile(score: number) {
  return PERCENTILE_BANDS.find((b) => score >= b.min) || PERCENTILE_BANDS[PERCENTILE_BANDS.length - 1];
}

// ── Component ──────────────────────────────────────────────────────

export function RelativeBenchmark({ score }: { score: number }) {
  const band = getPercentile(score);

  return (
    <section aria-label="Relative benchmark ranking" className="mt-8">
      <div
        className={cn(
          "rounded-xl border border-border bg-card p-5 sm:p-6",
          band.ring,
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <h2 className="text-sm font-semibold text-foreground">Your Position</h2>
          <span className="rounded-full bg-secondary/30 px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground border border-border">
            Estimated
          </span>
        </div>

        {/* Main position display */}
        <div className="flex flex-col items-center gap-3">
          <div
            className={cn(
              "inline-flex items-center gap-3 rounded-xl px-5 py-3 ring-1",
              band.bg,
              band.ring,
            )}
          >
            <span className="font-mono text-2xl sm:text-3xl font-extrabold leading-none tabular-nums">
              <span className={band.color}>{band.label}</span>
            </span>
          </div>

          {/* Visual percentile bar */}
          <div className="w-full max-w-xs mt-1">
            {/* Marker row */}
            <div className="relative h-6 mb-1">
              {/* Your position marker */}
              <div
                className="absolute -translate-x-1/2 transition-all duration-700 ease-out"
                style={{ left: `${Math.min(score, 100)}%` }}
              >
                <div className="flex flex-col items-center">
                  <svg className={cn("h-3 w-3", band.color)} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                  </svg>
                  <span className={cn("text-[9px] font-semibold mt-0.5 whitespace-nowrap", band.color)}>
                    You
                  </span>
                </div>
              </div>

              {/* Bracket labels */}
              <span className="absolute left-0 top-0 text-[9px] text-muted-foreground/50">Bottom</span>
              <span className="absolute right-0 top-0 text-[9px] text-muted-foreground/50">Top</span>
            </div>

            {/* Gradient bar */}
            <div className="h-2 w-full rounded-full overflow-hidden bg-gradient-to-r from-red-500/30 via-orange-500/30 via-accent/30 to-green-500/30">
              <div className="h-full w-full relative">
                {/* Filled portion */}
                <div
                  className={cn("h-full rounded-full transition-all duration-700 ease-out", band.bar)}
                  style={{ width: `${Math.min(score, 100)}%` }}
                  role="progressbar"
                  aria-valuenow={score}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Your score position"
                />
              </div>
            </div>

            {/* Percentile markers */}
            <div className="relative h-4 mt-1">
              {PERCENTILE_BANDS.slice(1).map((b) => (
                <span
                  key={b.min}
                  className="absolute -translate-x-1/2 text-[9px] text-muted-foreground/40 tabular-nums"
                  style={{ left: `${b.min}%` }}
                >
                  {b.min}%
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Contextual text */}
        <p className="mt-4 text-xs text-muted-foreground text-center leading-relaxed">
          {band.label === "Bottom 50%" ? (
            <>Your score places you in the <strong className="text-foreground">bottom half</strong> of sites. Most optimized AI-visible sites score 85+.</>
          ) : band.label === "Top 50%" ? (
            <>Your score is in the <strong className="text-foreground">top half</strong> of sites, but there is still room for improvement.</>
          ) : band.label === "Top 30%" ? (
            <>Your score is in the <strong className="text-foreground">top 30%</strong> — a solid foundation. Closing remaining gaps can push you higher.</>
          ) : band.label === "Top 15%" ? (
            <>Your score is in the <strong className="text-foreground">top 15%</strong> — your site is well positioned for AI visibility.</>
          ) : (
            <>Your score is in the <strong className="text-foreground">top 5%</strong> — your site is among the best-prepared for AI agents.</>
          )}
        </p>

        {/* Disclaimer */}
        <p className="mt-2 text-[10px] text-muted-foreground/50 text-center">
          Percentile bands are heuristic estimates based on the scoring system&apos;s own thresholds. Not derived from real-world data.
        </p>
      </div>
    </section>
  );
}
