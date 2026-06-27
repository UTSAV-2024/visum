import { cn } from "../lib/utils";
import { getBand } from "../lib/scan-data";

// ── Short labels for the gains list ─────────────────────────────────
const SHORT_LABELS: Record<string, string> = {
  "AI Bot Permissions (robots.txt)": "AI crawler permissions",
  "JSON-LD Structured Data": "Structured data markup",
  "llms.txt File": "LLM guidance file",
  "MCP Endpoint": "Agent interaction endpoint",
  "JavaScript Rendering": "JavaScript-free content",
  "Meta Tags and Open Graph": "Meta and Open Graph tags",
  "Sitemap.xml": "XML sitemap",
  "Page Load Speed": "Page load speed",
};

// ── Band style tokens (mirrors getBand's colours as bg/ring) ────────
function getBandStyle(score: number) {
  if (score >= 85) return { bg: "bg-green-500/10", ring: "ring-green-500/30" };
  if (score >= 65) return { bg: "bg-accent/10", ring: "ring-accent/30" };
  if (score >= 40) return { bg: "bg-orange-500/10", ring: "ring-orange-500/30" };
  return { bg: "bg-red-500/10", ring: "ring-red-500/30" };
}

// ── Component ──────────────────────────────────────────────────────

interface Check {
  name: string;
  score: number;
  max_score: number;
  passed: boolean;
  partial?: boolean;
}

export function ScoreImprovement({ score, checks }: { score: number; checks: Check[] }) {
  // Calculate recoverable points from all non-passed checks
  const recoverable = checks.reduce((sum, c) => {
    if (!c.passed) return sum + (c.max_score - c.score);
    return sum;
  }, 0);

  const projected = Math.min(score + recoverable, 100);
  const gain = projected - score;

  if (gain <= 0) return null;

  const currentBand = getBand(score);
  const projectedBand = getBand(projected);
  const currentStyle = getBandStyle(score);
  const projectedStyle = getBandStyle(projected);

  // Build gains list — only non-passed checks sorted by impact (max_score desc)
  const gains = checks
    .filter((c) => !c.passed)
    .sort((a, b) => b.max_score - a.max_score)
    .slice(0, 5)
    .map((c) => ({
      label: SHORT_LABELS[c.name] || c.name,
      points: c.max_score - c.score,
    }));

  return (
    <section aria-label="Before vs after simulation" className="mt-8">
      <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
        <h2 className="text-sm font-semibold text-foreground mb-5">Before vs After Simulation</h2>

        {/* Score comparison */}
        <div className="flex items-center justify-center gap-3 sm:gap-5">
          {/* Current State */}
          <div
            className={cn(
              "flex flex-col items-center rounded-xl px-4 sm:px-6 py-4 ring-1 border border-border min-w-0 flex-1 max-w-[180px]",
              currentStyle.bg,
              currentStyle.ring,
            )}
          >
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Current State
            </span>
            <span className={cn("font-mono text-3xl sm:text-4xl font-extrabold leading-none mt-2", currentBand.text)}>
              {score}
            </span>
            <span className="text-[10px] text-muted-foreground mt-0.5 text-balance text-center leading-tight">
              {currentBand.label}
            </span>
          </div>

          {/* Arrow */}
          <div className="flex flex-col items-center gap-1 shrink-0">
            <svg
              className="h-6 w-6 sm:h-7 sm:w-7 text-accent"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-mono text-xs font-bold text-accent tabular-nums">+{gain}</span>
          </div>

          {/* Projected State */}
          <div
            className={cn(
              "flex flex-col items-center rounded-xl px-4 sm:px-6 py-4 ring-1 border border-border min-w-0 flex-1 max-w-[180px]",
              projectedStyle.bg,
              projectedStyle.ring,
            )}
          >
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Projected State
            </span>
            <span className={cn("font-mono text-3xl sm:text-4xl font-extrabold leading-none mt-2", projectedBand.text)}>
              {projected}
            </span>
            <span className="text-[10px] text-muted-foreground mt-0.5 text-balance text-center leading-tight">
              {projectedBand.label}
            </span>
          </div>
        </div>

        {/* Potential Improvements list */}
        <div className="mt-5 pt-4 border-t border-border">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
            Potential Improvements
          </h3>
          <div className="flex flex-col gap-1.5">
            {gains.map((g) => (
              <div
                key={g.label}
                className="flex items-center justify-between rounded-md bg-accent/5 px-3 py-2"
              >
                <span className="text-xs text-foreground font-medium">{g.label}</span>
                <span className="font-mono text-xs font-bold text-accent tabular-nums shrink-0 ml-3">
                  +{g.points}
                </span>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-3 text-[11px] text-muted-foreground/60 text-center leading-relaxed">
          Fixing issues shown above could move you from{" "}
          <strong className="text-foreground/80">{currentBand.label}</strong> to{" "}
          <strong className="text-foreground/80">{projectedBand.label}</strong>.
        </p>
      </div>
    </section>
  );
}
