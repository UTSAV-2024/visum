import { useState } from "react";
import { cn } from "../lib/utils";

const statusConfig = {
  PASS: {
    label: "PASS",
    className: "bg-green-500/20 text-green-500",
    bar: "bg-green-500",
  },
  PART: {
    label: "PART",
    className: "bg-orange-500/20 text-orange-500",
    bar: "bg-orange-500",
  },
  FAIL: {
    label: "FAIL",
    className: "bg-red-500/20 text-red-500",
    bar: "bg-red-500",
  },
};

// ── Humanized explanations for failed/partial checks ────────────────
const HUMAN_EXPLANATIONS = {
  "AI Bot Permissions (robots.txt)": {
    fail: "AI crawlers are blocked from accessing your site by your robots.txt configuration.",
    partial: "Some AI crawlers can access your site, but others are being blocked.",
  },
  "JSON-LD Structured Data": {
    fail: "AI systems cannot reliably understand what your pages are about.",
    partial: "AI systems can only partially understand what your pages are about.",
  },
  "llms.txt File": {
    fail: "Developer-focused AI tools have less guidance about your content.",
    partial: "AI coding assistants have incomplete guidance about your project.",
  },
  "MCP Endpoint": {
    fail: "AI agents cannot directly interact with your content.",
    partial: "AI agents have limited ability to interact with your content.",
  },
  "JavaScript Rendering": {
    fail: "Some AI crawlers may never see your content because it loads too late.",
    partial: "Some AI crawlers may miss part of your content due to JavaScript loading.",
  },
  "Meta Tags and Open Graph": {
    fail: "AI systems lack the information needed to understand and cite your pages.",
    partial: "AI systems have incomplete information for understanding your pages.",
  },
  "Sitemap.xml": {
    fail: "AI systems may miss important pages on your site.",
    partial: "AI systems have limited guidance for prioritising your pages.",
  },
  "Page Load Speed": {
    fail: "AI agents may time out before your page finishes loading.",
    partial: "Some AI agents may time out before your page finishes loading.",
  },
};

// ── "Why This Matters" for failed/partial checks ───────────────────
const WHY_IT_MATTERS = {
  "AI Bot Permissions (robots.txt)": "AI-powered search engines and chatbots cannot access or reference your content if blocked.",
  "JSON-LD Structured Data": "Without structured data, AI systems may struggle to understand and cite your content.",
  "llms.txt File": "Developer tools and coding assistants like Cursor and Copilot cannot easily reference your project.",
  "MCP Endpoint": "Future AI agents may be unable to perform actions using your site.",
  "JavaScript Rendering": "If content appears only after rendering, some AI systems may never process it.",
  "Meta Tags and Open Graph": "AI summarization tools rely on meta tags to accurately describe your site in search results.",
  "Sitemap.xml": "AI crawlers without a sitemap may never discover your newest or deepest pages.",
  "Page Load Speed": "AI agents operate under strict timeouts — slow pages get skipped for faster alternatives.",
};

// ── "What Happens If Ignored" for failed/partial checks ────────────
const WHAT_HAPPENS_IF_IGNORED = {
  "AI Bot Permissions (robots.txt)": "Your pages may be excluded from AI-generated search results and chatbot answers entirely.",
  "JSON-LD Structured Data": "You relinquish control over how your content appears in AI-generated summaries and answers.",
  "llms.txt File": "Developer-focused AI tools generate less accurate code completions and documentation about your project.",
  "MCP Endpoint": "Your site remains a static reference rather than an interactive tool for AI agents.",
  "JavaScript Rendering": "Key pages or dynamic content may remain invisible to AI crawlers indefinitely.",
  "Meta Tags and Open Graph": "AI-generated link previews and summarizations will lack context and may misrepresent your content.",
  "Sitemap.xml": "New or updated content can take weeks or months to be discovered by AI crawlers.",
  "Page Load Speed": "Your pages will increasingly lose visibility as AI agents and search engines tighten their timeout limits.",
};

export function CheckCard({ check }) {
  const status = check.passed ? "PASS" : check.partial ? "PART" : "FAIL";
  const config = statusConfig[status];
  const pct = Math.round((check.score / check.max_score) * 100);

  // Derive priority from check status
  const priority = !check.passed && !check.partial
    ? { label: "High Impact", className: "bg-red-500/10 text-red-500" }
    : check.partial
    ? { label: "Medium Impact", className: "bg-orange-500/10 text-orange-500" }
    : { label: "Low Impact", className: "bg-green-500/10 text-green-500" };

  const [open, setOpen] = useState(false);
  const detailsId = `check-details-${check.name.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <article className="flex flex-col gap-4 rounded-lg border border-border bg-card p-5 transition-colors hover:border-accent/50">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Status icon */}
          <span
            className={cn(
              "flex size-5 shrink-0 items-center justify-center",
              status === "PASS" && "text-green-500",
              status === "PART" && "text-orange-500",
              status === "FAIL" && "text-red-500",
            )}
            aria-hidden="true"
          >
            {status === "PASS" ? (
              <svg viewBox="0 0 20 20" fill="currentColor" className="size-5">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                  clipRule="evenodd"
                />
              </svg>
            ) : status === "PART" ? (
              <svg viewBox="0 0 20 20" fill="currentColor" className="size-5">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg viewBox="0 0 20 20" fill="currentColor" className="size-5">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </span>
          <h3 className="font-medium leading-tight text-foreground text-pretty sm:truncate">{check.name}</h3>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {!check.passed && (
            <span className={cn("hidden sm:inline-flex shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide", priority.className)}>
              {priority.label}
            </span>
          )}
          <span className={cn("shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide", config.className)}>
            {config.label}
          </span>
        </div>
      </div>
      {/* Priority label for mobile (shown below header) */}
      {!check.passed && (
        <div className="sm:hidden">
          <span className={cn("inline-flex shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide", priority.className)}>
            {priority.label}
          </span>
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <div className="flex items-baseline justify-between">
          <span className="font-mono text-sm font-semibold text-foreground">
            {check.score}
            <span className="text-muted-foreground">/{check.max_score}</span>
          </span>
          <span className="text-xs text-muted-foreground">{pct}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={cn("h-full rounded-full transition-all duration-500", config.bar)}
            style={{ width: `${pct}%` }}
            role="progressbar"
            aria-valuenow={check.score}
            aria-valuemin={0}
            aria-valuemax={check.max_score}
            aria-label={`${check.name} score`}
          />
        </div>
      </div>

      {/* Passed check: simple finding */}
      {check.passed && check.finding && (
        <p className="text-sm leading-relaxed text-muted-foreground">{check.finding}</p>
      )}

      {/* Failed/partial: accordion details */}
      {!check.passed && (
        <>
          {/* Toggle button */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            id={`${detailsId}-btn`}
            aria-expanded={open}
            aria-controls={detailsId}
            className="flex items-center justify-between w-full rounded-lg border border-border bg-secondary/30 px-3 py-2 text-xs font-semibold text-foreground hover:bg-secondary transition-colors cursor-pointer"
          >
            <span>{open ? "Hide Details" : "Show Details"}</span>
            <svg
              className={cn("h-4 w-4 transition-transform duration-200", open && "rotate-180")}
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {/* Collapsible details panel */}
          <div
            id={detailsId}
            role="region"
            aria-labelledby={`${detailsId}-btn`}
            className={cn(
              "overflow-hidden transition-all duration-300 ease-in-out",
              open ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0",
            )}
          >
            <div>
              <div className="flex flex-col gap-3 pt-1">
                {/* Humanized explanation */}
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {HUMAN_EXPLANATIONS[check.name]?.[check.partial ? "partial" : "fail"] || check.finding}
                </p>

                {/* Why This Matters */}
                <div className="rounded-lg bg-amber-500/5 border border-amber-500/10 px-3 py-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-amber-500">Why This Matters</span>
                  <p className="text-sm leading-relaxed text-muted-foreground mt-0.5">
                    {WHY_IT_MATTERS[check.name] || check.finding}
                  </p>
                </div>

                {/* What Happens If Ignored */}
                <div className="rounded-lg bg-red-500/5 border border-red-500/10 px-3 py-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-red-500">What Happens If Ignored</span>
                  <p className="text-sm leading-relaxed text-muted-foreground mt-0.5">
                    {WHAT_HAPPENS_IF_IGNORED[check.name] || "Your AI visibility will not improve, and competitors may outrank you in AI-generated results."}
                  </p>
                </div>

                {/* Recommended fix */}
                {check.fix && (
                  <div className="rounded-lg bg-accent/10 px-3 py-2 text-sm leading-relaxed text-accent">
                    <span className="font-semibold">Recommended Fix:</span> {check.fix}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </article>
  );
}
