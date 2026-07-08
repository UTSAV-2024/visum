import { useEffect, useRef } from "react";
import { cn } from "../lib/utils";
import { track } from "../lib/analytics";

// ── Priority label config ───────────────────────────────────────────
const PRIORITY_CONFIG = [
  { rank: 1, label: "Priority 1", impact: "Quick Win", dot: "bg-red-500", bar: "bg-red-500", border: "border-red-500/20", bg: "bg-red-500/5" },
  { rank: 2, label: "Priority 2", impact: "High Value", dot: "bg-accent", bar: "bg-accent", border: "border-accent/20", bg: "bg-accent/5" },
  { rank: 3, label: "Priority 3", impact: "Worth Doing", dot: "bg-orange-500", bar: "bg-orange-500", border: "border-orange-500/20", bg: "bg-orange-500/5" },
];

// ── Check name → short label & estimated time ──────────────────────
const SHORT_LABELS = {
  "AI Bot Permissions (robots.txt)": "AI crawler permissions",
  "JSON-LD Structured Data": "Structured data markup",
  "llms.txt File": "LLM guidance file",
  "MCP Endpoint": "Agent interaction endpoint",
  "JavaScript Rendering": "JavaScript-free content",
  "Meta Tags and Open Graph": "Meta and Open Graph tags",
  "Sitemap.xml": "XML sitemap",
  "Page Load Speed": "Page load speed",
};

// Reasonable time estimates per fix (in minutes, for a developer)
const ESTIMATED_MINUTES = {
  "AI Bot Permissions (robots.txt)": 5,
  "JSON-LD Structured Data": 10,
  "llms.txt File": 5,
  "MCP Endpoint": 30,
  "JavaScript Rendering": 20,
  "Meta Tags and Open Graph": 10,
  "Sitemap.xml": 15,
  "Page Load Speed": 20,
};

const ESTIMATED_TIMES = Object.fromEntries(
  Object.entries(ESTIMATED_MINUTES).map(([k, v]) => [k, `${v} min`]),
);

// ── Severity for sorting ────────────────────────────────────────────
function getSeverity(check) {
  if (!check.passed && !check.partial) return 2; // full failure = highest priority
  if (check.partial) return 1; // partial
  return 0;
}

/**
 * Sort failed/partial checks by:
 * 1. Severity (full failure before partial)
 * 2. Quick-win score: (max_score / estimated_minutes) descending
 *    This prioritises high-impact, low-effort fixes first.
 */
function getMinutes(name) {
  return ESTIMATED_MINUTES[name] || 15;
}

function quickWinScore(check) {
  return check.max_score / getMinutes(check.name);
}

function sortFailing(checks) {
  return [...checks]
    .filter((c) => !c.passed)
    .sort((a, b) => {
      const sevDiff = getSeverity(b) - getSeverity(a);
      if (sevDiff !== 0) return sevDiff;
      return quickWinScore(b) - quickWinScore(a);
    })
    .slice(0, 3);
}

// ── Format the fix text for display ─────────────────────────────────
function formatFix(check) {
  if (check.fix) return check.fix.replace(/\.$/, "");
  return `Review ${SHORT_LABELS[check.name] || check.name.toLowerCase()} configuration`;
}

// ── Main component ─────────────────────────────────────────────────
export function PriorityFixRoadmap({ checks }) {
  const prioritized = sortFailing(checks);
  const sectionRef = useRef(null);
  const trackedRef = useRef(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !trackedRef.current) {
          trackedRef.current = true;
          track("scrolled_to_roadmap", {
            failed_count: prioritized.length,
            top_issue: prioritized[0]?.name || "",
          });
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [prioritized]);

  if (prioritized.length === 0) return null;

  return (
    <section ref={sectionRef} aria-label="Priority Fix Roadmap" className="mt-10">
      {/* Header */}
      <div className="mb-5">
        <h2 className="text-lg sm:text-xl font-bold text-foreground">Your Priority Fix List</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Sorted by impact per minute of effort. Start with #1.
        </p>
      </div>

      {/* Priority cards */}
      <div className="flex flex-col gap-3">
        {prioritized.map((check, i) => {
          const cfg = PRIORITY_CONFIG[i] || PRIORITY_CONFIG[PRIORITY_CONFIG.length - 1];
          const pct = Math.round((check.score / check.max_score) * 100);

          return (
            <div
              key={check.name}
              className={cn("rounded-lg border bg-card p-4 sm:p-5 transition-colors hover:border-accent/50", cfg.border)}
            >
              {/* Header row */}
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={cn("mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold leading-none", cfg.dot, "text-white")}>
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">{cfg.label}</span>
                      <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide", cfg.bg, "text-foreground border", cfg.border)}>
                        {cfg.impact} Impact
                      </span>
                    </div>
                    <h3 className="text-sm font-medium text-foreground mt-0.5">
                      {SHORT_LABELS[check.name] || check.name}
                    </h3>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="rounded-md bg-secondary/30 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground whitespace-nowrap border border-border">
                    ~{ESTIMATED_TIMES[check.name] || "15 min"}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs font-bold tabular-nums text-foreground">
                      +{check.max_score - check.score}
                    </span>
                    <span className="text-[10px] text-muted-foreground">pts</span>
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted mb-3">
                <div
                  className={cn("h-full rounded-full transition-all duration-500", cfg.bar)}
                  style={{ width: `${pct}%` }}
                  role="progressbar"
                  aria-valuenow={pct}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${check.name} progress`}
                />
              </div>

              {/* Finding */}
              <p className="text-xs leading-relaxed text-muted-foreground mb-2">
                {check.finding}
              </p>

              {/* Fix */
              !check.passed && check.fix && (
                <div className="flex items-start gap-1.5 text-xs text-accent font-medium">
                  <svg className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                  </svg>
                  <span>{formatFix(check)}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
