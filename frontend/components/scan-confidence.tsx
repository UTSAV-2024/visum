import { cn } from "../lib/utils";

// ── Confidence bands ────────────────────────────────────────────────

const CONFIDENCE_BANDS = [
  { min: 90, label: "High",   color: "text-green-500", fill: "bg-green-500", bg: "bg-green-500/10", ring: "ring-green-500/30" },
  { min: 70, label: "Medium", color: "text-accent",    fill: "bg-accent",    bg: "bg-accent/10",    ring: "ring-accent/30" },
  { min: 0,  label: "Low",    color: "text-orange-500", fill: "bg-orange-500", bg: "bg-orange-500/10", ring: "ring-orange-500/30" },
];

function getBand(pct: number) {
  return CONFIDENCE_BANDS.find((b) => pct >= b.min) || CONFIDENCE_BANDS[CONFIDENCE_BANDS.length - 1];
}

// ── Confidence calculation ──────────────────────────────────────────
// Uses signals from each check's `details` dict to estimate scan completeness.

interface CheckData {
  name: string;
  score: number;
  max_score: number;
  passed: boolean;
  partial?: boolean;
  details?: Record<string, unknown>;
}

function computeConfidence(checks: CheckData[]): number {
  const lookup: Record<string, CheckData> = {};
  for (const c of checks) {
    lookup[c.name] = c;
  }

  let score = 50; // base: scan completed without error

  // robots.txt fetched
  const robots = lookup["AI Bot Permissions (robots.txt)"];
  if (robots?.details?.found === true) score += 12;

  // sitemap fetched
  const sitemap = lookup["Sitemap.xml"];
  if (sitemap?.details?.found === true) score += 12;

  // page speed measured
  const speed = lookup["Page Load Speed"];
  if (speed?.details?.measured === true) score += 10;

  // rendered content extracted
  const rendering = lookup["JavaScript Rendering"];
  if ((rendering?.details?.rendered_words as number) > 0) score += 8;

  // static content extracted
  if ((rendering?.details?.static_words as number) > 0) score += 8;

  // meta tags parsed
  const meta = lookup["Meta Tags and Open Graph"];
  const metaPresent = meta?.details?.present as string[] | undefined;
  if (metaPresent && metaPresent.length > 0) score += 5;

  // JSON-LD parsed
  const schema = lookup["JSON-LD Structured Data"];
  if ((schema?.details?.schemas_found as number) > 0) score += 5;

  return Math.min(score, 100);
}

// ── Component ───────────────────────────────────────────────────────

export function ScanConfidence({ checks }: { checks: CheckData[] }) {
  if (!checks || checks.length === 0) return null;

  const pct = computeConfidence(checks);
  const band = getBand(pct);

  return (
    <section aria-label="Scan confidence" className="mt-6">
      <div
        className={cn(
          "rounded-xl border border-border bg-card px-4 py-3 sm:px-5 sm:py-3.5 flex items-center justify-between gap-4",
          band.ring,
          band.bg,
        )}
      >
        {/* Left: label + percentage */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Ring indicator */}
          <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full ring-1", band.bg, band.ring)}>
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
          </span>

          <div className="min-w-0">
            <span className="text-xs font-semibold text-foreground block leading-tight">Scan Confidence</span>

            {/* Fractional progress bar */}
            <div className="mt-1.5 h-1.5 w-28 sm:w-36 overflow-hidden rounded-full bg-muted">
              <div
                className={cn("h-full rounded-full transition-all duration-600", band.fill)}
                style={{ width: `${pct}%` }}
                role="progressbar"
                aria-valuenow={pct}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${pct}% confidence`}
              />
            </div>
          </div>
        </div>

        {/* Right: percentage + label */}
        <div className="flex items-center gap-2.5 shrink-0">
          <span className={cn("font-mono text-lg sm:text-xl font-extrabold tabular-nums leading-none", band.color)}>
            {pct}
          </span>
          <span className={cn("rounded-full px-2.5 py-0.5 text-[10px] font-semibold border", band.bg, band.color, band.ring)}>
            {band.label} Confidence
          </span>

          {/* Info icon with tooltip */}
          <div className="group relative flex items-center">
            <svg
              className="h-4 w-4 text-muted-foreground/50 hover:text-muted-foreground cursor-help transition-colors"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                clipRule="evenodd"
              />
            </svg>
            <div className="absolute bottom-full right-0 mb-2 z-50 w-56 rounded-lg border border-border bg-card px-3 py-2 text-[11px] text-muted-foreground shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" role="tooltip">
              Based on successful retrieval and analysis of your website content.
              <br />
              <span className="block mt-1 text-[10px] text-muted-foreground/60">
                Confidence is higher when more resources (robots.txt, sitemap, rendered HTML, performance metrics) are successfully fetched and analysed.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
