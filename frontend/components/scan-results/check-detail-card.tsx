import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";

const DETAIL_DATA = {
  "AI Bot Permissions (robots.txt)": {
    impact: "Critical",
    howAISees: "AI crawlers check robots.txt first. If GPTBot or Claude-Web are disallowed, they leave immediately without reading any content.",
    fixPreview: "Add these lines to your robots.txt:\nUser-agent: GPTBot\nAllow: /\n\nUser-agent: Claude-Web\nAllow: /",
    scoreGain: 15,
  },
  "JSON-LD Structured Data": {
    impact: "High",
    howAISees: "Without JSON-LD, AI systems see raw HTML and must guess the meaning of your content. They frequently misinterpret context, authorship, and publication dates.",
    fixPreview: 'Add JSON-LD script to <head>:\n<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "WebPage",\n  "name": "..."\n}\n</script>',
    scoreGain: 12,
  },
  "llms.txt File": {
    impact: "Medium",
    howAISees: "AI coding assistants like Cursor and Copilot look for llms.txt to understand your project. Without it, they have no structured context about your API or documentation.",
    fixPreview: "Create /llms.txt at your domain root:\n# Your Project\n> Brief description\n\n## Docs\n- [Getting Started](https://...)\n- [API Reference](https://...)",
    scoreGain: 8,
  },
  "MCP Endpoint": {
    impact: "Medium",
    howAISees: "AI agents can only read static pages. An MCP endpoint allows them to query your data directly — checking inventory, pricing, or availability in real-time.",
    fixPreview: "Expose an MCP endpoint at /mcp or /api/mcp that returns structured tool definitions your AI agent can call directly.",
    scoreGain: 10,
  },
  "JavaScript Rendering": {
    impact: "High",
    howAISees: "Many AI crawlers (especially older ones) don't execute JavaScript. If your content is rendered client-side, these crawlers see an empty page.",
    fixPreview: "Ensure critical content is server-rendered. Use SSR or SSG for key pages. Add <noscript> fallbacks for JS-dependent content.",
    scoreGain: 12,
  },
  "Meta Tags and Open Graph": {
    impact: "Medium",
    howAISees: "AI summarization tools extract meta descriptions and OG tags to describe your site in citations. Missing or short tags result in generic, auto-generated snippets.",
    fixPreview: 'Add to <head>:\n<meta name="description" content="...">\n<meta property="og:title" content="...">\n<meta property="og:description" content="...">',
    scoreGain: 8,
  },
  "Sitemap.xml": {
    impact: "Medium",
    howAISees: "AI crawlers use sitemaps to discover new content. Without one, only pages linked from other sites get discovered, delaying indexing by weeks.",
    fixPreview: "Generate a sitemap.xml with all your pages and lastmod dates. Submit to Google Search Console and reference in robots.txt.",
    scoreGain: 7,
  },
  "Page Load Speed": {
    impact: "High",
    howAISees: "AI agents operate under strict timeouts (5-10s). Slow-loading pages are often abandoned before content fully renders, especially on mobile connections.",
    fixPreview: "Optimize images, enable compression, use CDN caching, and minimize JavaScript bundles. Target < 2s load time for AI crawlers.",
    scoreGain: 10,
  },
};

const IMPACT_COLORS = {
  Critical: "text-red-500 bg-red-500/10",
  High: "text-orange-500 bg-orange-500/10",
  Medium: "text-accent bg-accent/10",
  Low: "text-green-500 bg-green-500/10",
};

export function CheckDetailCard({ check, index }) {
  const [expanded, setExpanded] = useState(index < 2);
  const [fixGenerated, setFixGenerated] = useState(false);
  const status = check.passed ? "PASS" : check.partial ? "WARNING" : "FAIL";
  const detail = DETAIL_DATA[check.name] || {
    impact: check.partial ? "Medium" : "High",
    howAISees: check.finding || "This check impacts how AI systems perceive your content.",
    fixPreview: check.fix || "Resolve this issue to improve your AI visibility score.",
    scoreGain: Math.round(((check.max_score - check.score) / check.max_score) * 10),
  };

  const pct = Math.round((check.score / check.max_score) * 100);

  const statusColors = {
    PASS: { icon: "text-green-500", bg: "bg-green-500/10", border: "border-green-500/20", bar: "bg-green-500", label: "Passed" },
    WARNING: { icon: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/20", bar: "bg-orange-500", label: "Warning" },
    FAIL: { icon: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20", bar: "bg-red-500", label: "Failed" },
  };

  const sc = statusColors[status];

  return (
    <div
      className={cn(
        "relative rounded-xl border bg-card transition-all duration-200 hover:shadow-[0_0_20px_-8px_rgba(124,58,237,0.1)]",
        sc.border,
        expanded ? "shadow-sm" : ""
      )}
    >
      {/* Main row - always visible */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            {/* Status indicator */}
            <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg mt-0.5", sc.bg)}>
              {status === "PASS" ? (
                <svg className={cn("h-4 w-4", sc.icon)} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>
              ) : status === "WARNING" ? (
                <svg className={cn("h-4 w-4", sc.icon)} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className={cn("h-4 w-4", sc.icon)} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                </svg>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-semibold text-foreground">{check.name}</h3>
                <span className={cn("rounded-md px-1.5 py-0.5 text-[9px] font-semibold", IMPACT_COLORS[detail.impact] || IMPACT_COLORS.Medium)}>
                  {detail.impact}
                </span>
                <span className={cn("rounded-md px-1.5 py-0.5 text-[9px] font-semibold", sc.bg, sc.icon)}>
                  {sc.label}
                </span>
              </div>

              {/* Finding / description */}
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                {check.finding || (check.passed ? "All checks passed for this category." : "Issue detected that affects AI visibility.")}
              </p>

              {/* Score bar */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex-1 h-1.5 rounded-full bg-muted/20">
                  <div className={cn("h-full rounded-full transition-all duration-700", sc.bar)} style={{ width: `${pct}%` }} />
                </div>
                <span className="font-mono text-[11px] font-bold tabular-nums text-foreground shrink-0">
                  {check.score}/{check.max_score}
                </span>
              </div>
            </div>
          </div>

          {/* Expand/collapse button */}
          {!check.passed && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="shrink-0 p-1 rounded-lg hover:bg-muted/20 transition-colors"
              aria-label={expanded ? "Collapse details" : "Expand details"}
            >
              <svg
                className={cn("h-4 w-4 text-muted-foreground transition-transform duration-200", expanded && "rotate-180")}
                viewBox="0 0 20 20" fill="currentColor"
              >
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Expanded details panel */}
      {!check.passed && (
        <div
          className={cn(
            "overflow-hidden transition-all duration-300 ease-in-out",
            expanded ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="px-4 pb-4 pt-0 border-t border-border mx-4" />

          <div className="px-4 pb-4 space-y-3">
            {/* Problem */}
            <div className="rounded-lg bg-red-500/5 border border-red-500/10 px-3.5 py-2.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-red-500">Problem</span>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{check.finding}</p>
            </div>

            {/* Impact */}
            <div className="rounded-lg bg-orange-500/5 border border-orange-500/10 px-3.5 py-2.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-orange-500">Impact</span>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                <span className="font-semibold text-foreground">{detail.impact}</span> — This issue significantly affects how AI systems interact with your content.
              </p>
            </div>

            {/* How AI sees it */}
            <div className="rounded-lg bg-accent/5 border border-accent/10 px-3.5 py-2.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-accent">How AI Sees It</span>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{detail.howAISees}</p>
            </div>

            {/* Why it matters */}
            <div className="rounded-lg bg-amber-500/5 border border-amber-500/10 px-3.5 py-2.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-500">Why It Matters</span>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                {check.passed
                  ? "This check is passing. No action needed."
                  : `Fixing this improves how AI systems discover and understand your content. Every point increase in your score correlates with higher AI visibility and citation rates.`}
              </p>
            </div>

            {/* Fix Preview */}
            <div className="rounded-lg bg-green-500/5 border border-green-500/10 px-3.5 py-2.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-green-500">Fix Preview</span>
              <pre className="text-xs text-muted-foreground mt-1 leading-relaxed font-mono whitespace-pre-wrap">
                {detail.fixPreview}
              </pre>
            </div>

            {/* Score gain + Generate Fix */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.563a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-3.95V16.25A.75.75 0 0110 17z" clipRule="evenodd" />
                </svg>
                <span className="text-xs text-muted-foreground">
                  Estimated score gain:{" "}
                  <span className="font-mono font-bold text-green-500">+{detail.scoreGain} pts</span>
                </span>
              </div>

              <button
                onClick={() => setFixGenerated(true)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-semibold transition-all",
                  fixGenerated
                    ? "bg-green-500/10 text-green-500"
                    : "bg-accent/10 text-accent hover:bg-accent/20"
                )}
              >
                {fixGenerated ? (
                  <>
                    <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                    Fix Generated
                  </>
                ) : (
                  <>
                    <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.403 4.652a3 3 0 00-4.242 0L4.5 12.31A3 3 0 003.72 14.5l-.824 2.473a.75.75 0 00.928.928l2.473-.824a3 3 0 002.19-.78l7.66-7.662a3 3 0 000-4.242l-.344-.343z" clipRule="evenodd" />
                    </svg>
                    Generate Fix
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
