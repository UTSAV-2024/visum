import { cn } from "../lib/utils";
import { getBand } from "../lib/scan-data";

// ── Score interpretation text (aligned with backend band thresholds) ─
function getInterpretation(score) {
  if (score >= 85) return "Your site is readable and understandable by most AI systems. You're well-positioned for AI-driven discovery.";
  if (score >= 65) return "AI systems can partially read your site, but key gaps limit how often you're cited in AI responses.";
  if (score >= 40) return "AI systems struggle to fully understand your site. Missing structure and permissions reduce your chances of appearing in AI answers.";
  return "Most AI systems cannot properly access or understand your site. You're likely invisible in AI search results.";
}

// ── SWOT-aware summary ──────────────────────────────────────────────
function getSwotSummary(checks) {
  const failed = checks.filter((c) => !c.passed && !c.partial);
  const partial = checks.filter((c) => c.partial);
  const topIssues = [...failed, ...partial].slice(0, 2);

  if (topIssues.length === 0) return null;

  const names = topIssues.map((c) => {
    switch (c.name) {
      case "AI Bot Permissions (robots.txt)": return "AI crawler permissions";
      case "JSON-LD Structured Data": return "structured data";
      case "llms.txt File": return "LLM guidance";
      case "MCP Endpoint": return "agent interoperability";
      case "JavaScript Rendering": return "content accessibility";
      case "Meta Tags and Open Graph": return "metadata quality";
      case "Sitemap.xml": return "page discoverability";
      case "Page Load Speed": return "page speed";
      default: return c.name.toLowerCase();
    }
  });

  if (names.length === 1) return `Your biggest visibility challenge is ${names[0]}.`;
  return `Your biggest visibility challenges are ${names[0]} and ${names[1]}.`;
}

// ── Next action from top failing check ─────────────────────────────
function getNextAction(checks) {
  const sorted = [...checks].sort((a, b) => b.max_score - a.max_score || a.score - b.score);
  const worst = sorted.find((c) => !c.passed);
  if (!worst) return null;

  const actions = {
    "AI Bot Permissions (robots.txt)": { label: "Update robots.txt for AI bots", icon: "🤖" },
    "JSON-LD Structured Data": { label: "Add structured data markup", icon: "📊" },
    "llms.txt File": { label: "Create llms.txt file", icon: "📄" },
    "MCP Endpoint": { label: "Enable agent interoperability", icon: "🔌" },
    "JavaScript Rendering": { label: "Improve server-side rendering", icon: "⚡" },
    "Meta Tags and Open Graph": { label: "Add missing meta and OG tags", icon: "🏷️" },
    "Sitemap.xml": { label: "Improve page discoverability", icon: "🗺️" },
    "Page Load Speed": { label: "Optimise page load speed", icon: "🚀" },
  };

  return actions[worst.name] || { label: "Review all failed checks", icon: "📋" };
}

// ── Component ──────────────────────────────────────────────────────
export function WhatThisMeans({ score, checks }) {
  const band = getBand(score);
  const interpretation = getInterpretation(score);
  const swotSummary = getSwotSummary(checks);
  const nextAction = getNextAction(checks);

  return (
    <div className="mt-8 rounded-xl border border-border bg-card p-6 sm:p-8">
      {/* Header + visual band (uses backend-aligned getBand from scan-data) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-foreground">What Your Score Means</h2>
        <span className={cn("self-start rounded-full px-4 py-1 text-xs font-semibold tracking-wide", band.pill)}>
          {band.label}
        </span>
      </div>

      {/* Interpretation */}
      <p className="text-sm leading-relaxed text-muted-foreground mb-3">
        {interpretation}
      </p>

      {/* SWOT-aware summary (only if issues exist) */}
      {swotSummary && (
        <p className="text-sm leading-relaxed text-muted-foreground">
          {swotSummary}
        </p>
      )}

      {/* Next action */}
      {nextAction && (
        <div className="mt-5 pt-4 border-t border-border">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
            Recommended Next Step
          </p>
          <div className="flex items-center gap-2.5 rounded-lg bg-accent/10 px-4 py-3">
            <span className="text-base" aria-hidden="true">{nextAction.icon}</span>
            <span className="text-sm font-medium text-accent">{nextAction.label}</span>
            <svg className="ml-auto h-4 w-4 shrink-0 text-accent" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
