import { cn } from "../lib/utils";

// ── Stage definitions with check mapping ────────────────────────────
const STAGES = [
  {
    id: "discovery",
    label: "Discovery",
    description: "Can AI agents find your site?",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
      </svg>
    ),
    checks: ["AI Bot Permissions (robots.txt)", "Sitemap.xml", "JavaScript Rendering"],
  },
  {
    id: "understanding",
    label: "Understanding",
    description: "Can AI agents understand your content?",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M4.5 2A1.5 1.5 0 003 3.5v13A1.5 1.5 0 004.5 18h11a1.5 1.5 0 001.5-1.5V7.621a1.5 1.5 0 00-.44-1.06l-4.12-4.122A1.5 1.5 0 0011.378 2H4.5zm2.25 8.5a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5zm0 3a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5z" clipRule="evenodd" />
      </svg>
    ),
    checks: ["JSON-LD Structured Data", "Meta Tags and Open Graph", "llms.txt File"],
  },
  {
    id: "citation",
    label: "Citation Readiness",
    description: "Will AI systems reliably cite you?",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M10 2c-2.236 0-4.43.18-6.57.524C1.993 2.755 1 4.014 1 5.426v5.148c0 1.413.993 2.67 2.43 2.902.848.137 1.705.248 2.57.331v3.443a.75.75 0 001.28.53l3.58-3.579a.78.78 0 01.527-.224 41.202 41.202 0 005.183-.5c1.437-.232 2.43-1.49 2.43-2.903V5.426c0-1.413-.993-2.67-2.43-2.902A41.289 41.289 0 0010 2zm0 7a1 1 0 100-2 1 1 0 000 2zM8 8a1 1 0 11-2 0 1 1 0 012 0zm5 1a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
      </svg>
    ),
    checks: ["Page Load Speed"],
  },
  {
    id: "interaction",
    label: "Agent Interaction",
    description: "Can AI agents take actions using your site?",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M15.988 3.012A2.25 2.25 0 0118 5.25v6.5A2.25 2.25 0 0115.75 14H13.5v-3.379a3 3 0 00-.879-2.121l-3.12-3.121a3 3 0 00-1.402-.791 2.25 2.25 0 011.57-1.576 2.25 2.25 0 013.465-.922l2.531 2.531a.75.75 0 00-.137.278.75.75 0 00.448.918.75.75 0 00.918-.448.75.75 0 00-.11-.657l.003-.003zM3.75 9A1.5 1.5 0 005.25 10.5h1.5a.75.75 0 01.75.75v3.378a1.5 1.5 0 01-.44 1.06l-3.12 3.121A1.5 1.5 0 013.75 18z" clipRule="evenodd" />
      </svg>
    ),
    checks: ["MCP Endpoint"],
  },
];

/**
 * Compute stage progress from the checks array.
 * Returns: { passed: number, count: number, pct: number }
 */
function computeStage(stage, checks) {
  const stageChecks = checks.filter((c) => stage.checks.includes(c.name));
  const total = stageChecks.reduce((sum, c) => sum + c.max_score, 0);
  const earned = stageChecks.reduce((sum, c) => sum + c.score, 0);
  const pct = total > 0 ? Math.round((earned / total) * 100) : 0;
  const passed = stageChecks.filter((c) => c.passed).length;
  const count = stageChecks.length;

  return { passed, count, pct };
}

// ── Stage Row component ─────────────────────────────────────────────
function StageRow({ stage, checks, index }) {
  const { passed, count, pct } = computeStage(stage, checks);

  const barColor =
    pct >= 80 ? "bg-green-500" : pct >= 50 ? "bg-accent" : pct >= 25 ? "bg-orange-500" : "bg-red-500";

  const statusLabel =
    passed === count ? "✅" : passed > 0 ? "⚠️" : "❌";

  return (
    <div className="flex flex-col gap-2 py-3 first:pt-0 last:pb-0">
      {/* Stage header */}
      <div className="flex items-center gap-3">
        {/* Icon */}
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
          {stage.icon}
        </span>

        {/* Label + description */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-foreground">{stage.label}</h3>
            <span className="text-xs text-muted-foreground/60 font-medium">{stage.description}</span>
          </div>
        </div>

        {/* Score + status */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="font-mono text-sm font-bold tabular-nums text-foreground">{pct}%</span>
          <span className="text-xs">{statusLabel}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full transition-all duration-700", barColor)}
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${stage.label} progress`}
        />
      </div>

      {/* Check summary */}
      <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
        {stage.checks.map((checkName) => {
          const check = checks.find((c) => c.name === checkName);
          if (!check) return null;
          const status = check.passed ? "text-green-500" : check.partial ? "text-orange-500" : "text-red-500";
          return (
            <span key={checkName} className="flex items-center gap-1">
              <span className={cn("font-semibold", status)}>
                {check.passed ? "✓" : check.partial ? "△" : "✗"}
              </span>
              <span className="truncate max-w-[160px] sm:max-w-none">{checkName}</span>
            </span>
          );
        })}
      </div>

      {/* Connector line (not last) */}
      {index < STAGES.length - 1 && (
        <div className="mt-1 ml-4 w-px h-4 bg-border self-start" aria-hidden="true" />
      )}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────
export function AIVisibilityJourney({ checks }) {
  if (!checks || checks.length === 0) return null;

  return (
    <section aria-label="AI Visibility Journey" className="mt-10">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-foreground">AI Visibility Journey</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          See how AI agents experience your site at every stage — from discovery to interaction.
        </p>
      </div>

      {/* Journey stages */}
      <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
        {STAGES.map((stage, i) => (
          <StageRow key={stage.id} stage={stage} checks={checks} index={i} />
        ))}

        {/* Journey note */}
        <div className="mt-5 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground/60 leading-relaxed">
            Stages are sequential: each builds on the previous one. A breakdown in <strong className="text-foreground/80">Discovery</strong> means later stages cannot be fully evaluated by AI systems.
          </p>
        </div>
      </div>
    </section>
  );
}
