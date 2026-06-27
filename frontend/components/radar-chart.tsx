import { cn } from "../lib/utils";

// ── Dimensions & check mapping ─────────────────────────────────────

const DIMENSIONS = [
  { key: "Discovery",          label: "Discovery",          subtitle: "Finding your content" },
  { key: "Accessibility",      label: "Accessibility",      subtitle: "Accessing your content" },
  { key: "Structure",          label: "Structure",          subtitle: "Organising for AI" },
  { key: "Citation Readiness", label: "Citation Readiness", subtitle: "Earning proper citations" },
  { key: "Agent Interaction",  label: "Agent Interaction",  subtitle: "Allowing AI to act" },
] as const;

type Dimension = (typeof DIMENSIONS)[number]["key"];

// Each check maps to one or more dimensions with a weight
const DIMENSION_MAP: Record<string, Partial<Record<Dimension, number>>> = {
  "AI Bot Permissions (robots.txt)": { Discovery: 1.0 },
  "Sitemap.xml":                     { Discovery: 1.0 },
  "JavaScript Rendering":            { Accessibility: 1.0 },
  "Page Load Speed":                 { Accessibility: 1.0 },
  "JSON-LD Structured Data":         { Structure: 0.7, "Citation Readiness": 0.3 },
  "Meta Tags and Open Graph":        { Structure: 0.3, "Citation Readiness": 0.7 },
  "llms.txt File":                   { "Agent Interaction": 1.0 },
  "MCP Endpoint":                    { "Agent Interaction": 1.0 },
};

interface Check {
  name: string;
  score: number;
  max_score: number;
  passed: boolean;
  partial?: boolean;
}

function computeDimensions(checks: Check[]): { key: Dimension; pct: number }[] {
  // Accumulate weighted sums per dimension
  const weighted = DIMENSIONS.map((dim) => {
    let earned = 0;
    let total = 0;

    for (const check of checks) {
      const mapping = DIMENSION_MAP[check.name];
      if (!mapping) continue;
      const weight = mapping[dim.key];
      if (weight == null) continue;
      earned += check.score * weight;
      total += check.max_score * weight;
    }

    const pct = total > 0 ? Math.round((earned / total) * 100) : 0;
    return { key: dim.key, pct };
  });

  return weighted;
}

// ── Radar chart SVG helpers ────────────────────────────────────────

const SIDES = 5;
const ANGLE_OFFSET = -Math.PI / 2; // start at top

function vertex(index: number, radius: number, cx: number, cy: number) {
  const angle = ANGLE_OFFSET + (2 * Math.PI * index) / SIDES;
  return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
}

function polygonPoints(radius: number, cx: number, cy: number, scale = 1): string {
  return Array.from({ length: SIDES }, (_, i) => {
    const v = vertex(i, radius * scale, cx, cy);
    return `${v.x},${v.y}`;
  }).join(" ");
}

// ── Component ──────────────────────────────────────────────────────

export function RadarChart({ checks }: { checks: Check[] }) {
  const dimensions = computeDimensions(checks);

  // Check if there's any data
  const hasData = checks.length > 0;
  if (!hasData) return null;

  // SVG dimensions
  const size = 280;
  const cx = size / 2;
  const cy = size / 2;
  const maxR = size * 0.38; // keep within bounds for labels
  const labelDist = size * 0.46; // how far out labels go

  // Grid levels
  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0];

  // Data polygon
  const dataPoints = dimensions
    .map((d, i) => vertex(i, maxR * (d.pct / 100), cx, cy))
    .map((v) => `${v.x},${v.y}`)
    .join(" ");

  // Per-dimension info text color
  const dimColor = (pct: number) => {
    if (pct >= 85) return "text-green-500";
    if (pct >= 65) return "text-accent";
    if (pct >= 40) return "text-orange-500";
    return "text-red-500";
  };

  return (
    <section aria-label="AI Readiness Radar" className="mt-8">
      <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
        <h2 className="text-sm font-semibold text-foreground mb-1">AI Readiness Radar</h2>
        <p className="text-xs text-muted-foreground mb-5">
          Visual breakdown of your strengths and weaknesses across 5 dimensions.
        </p>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-10">
          {/* ── SVG Radar ─────────────────────────────────────── */}
          <div className="w-full max-w-[280px] mx-auto lg:mx-0 shrink-0">
            <svg
              viewBox={`0 0 ${size} ${size}`}
              className="block w-full h-auto"
              role="img"
              aria-label="Radar chart of AI readiness dimensions"
            >
              {/* Grid polygons */}
              {gridLevels.map((level) => (
                <polygon
                  key={level}
                  points={polygonPoints(maxR, cx, cy, level)}
                  fill="none"
                  stroke="currentColor"
                  strokeOpacity={level === 1.0 ? 0.2 : 0.08}
                  strokeWidth={level === 1.0 ? 1 : 0.5}
                />
              ))}

              {/* Axis lines */}
              {Array.from({ length: SIDES }, (_, i) => {
                const v = vertex(i, maxR, cx, cy);
                return (
                  <line
                    key={i}
                    x1={cx}
                    y1={cy}
                    x2={v.x}
                    y2={v.y}
                    stroke="currentColor"
                    strokeOpacity={0.1}
                    strokeWidth={0.5}
                  />
                );
              })}

              {/* Data polygon (filled) */}
              <polygon
                points={dataPoints}
                fill="url(#radarGrad)"
                fillOpacity={0.35}
                stroke="url(#radarGrad)"
                strokeWidth={2}
              />

              {/* Data points */}
              {dimensions.map((d, i) => {
                const v = vertex(i, maxR * (d.pct / 100), cx, cy);
                return (
                  <circle
                    key={d.key}
                    cx={v.x}
                    cy={v.y}
                    r={3.5}
                    fill="currentColor"
                    className={
                      d.pct >= 85 ? "text-green-500" :
                      d.pct >= 65 ? "text-accent" :
                      d.pct >= 40 ? "text-orange-500" :
                      "text-red-500"
                    }
                  />
                );
              })}

              {/* Dimension labels */}
              {DIMENSIONS.map((dim, i) => {
                const v = vertex(i, labelDist, cx, cy);
                const pct = dimensions.find((d) => d.key === dim.key)?.pct ?? 0;

                return (
                  <g key={dim.key}>
                    <text
                      x={v.x}
                      y={v.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-muted-foreground"
                      fontSize={10}
                      fontWeight={600}
                    >
                      {dim.label}
                    </text>
                    <text
                      x={v.x}
                      y={v.y + 13}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className={dimColor(pct)}
                      fontSize={11}
                      fontWeight={700}
                      fontFamily="monospace"
                    >
                      {pct}%
                    </text>
                  </g>
                );
              })}

              {/* Gradient fill */}
              <defs>
                <linearGradient id="radarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7c3aed" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* ── Dimension summary list ─────────────────────────── */}
          <div className="flex flex-col gap-2.5 min-w-0 w-full max-w-sm">
            {dimensions.map((d) => {
              const dim = DIMENSIONS.find((dd) => dd.key === d.key)!;
              const color = dimColor(d.pct);
              const bar = d.pct >= 85 ? "bg-green-500" : d.pct >= 65 ? "bg-accent" : d.pct >= 40 ? "bg-orange-500" : "bg-red-500";

              return (
                <div key={d.key} className="flex items-center gap-3">
                  {/* Score */}
                  <span className={cn("font-mono text-xs font-bold tabular-nums w-8 text-right shrink-0", color)}>
                    {d.pct}
                  </span>

                  {/* Bar */}
                  <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all duration-700", bar)}
                      style={{ width: `${d.pct}%` }}
                    />
                  </div>

                  {/* Label */}
                  <div className="min-w-0 w-24 shrink-0">
                    <div className="text-[11px] font-medium text-foreground leading-tight truncate">{dim.label}</div>
                    <div className="text-[10px] text-muted-foreground leading-tight truncate">{dim.subtitle}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
