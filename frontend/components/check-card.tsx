import { useState } from "react";
import { cn } from "../lib/utils";
import { track } from "../lib/analytics";

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
};  // ── Humanized explanations for failed/partial checks ────────────────
const HUMAN_EXPLANATIONS = {
  "AI Bot Permissions (robots.txt)": {
    fail: "Your robots.txt blocks AI crawlers from accessing your site. ChatGPT, Claude, and Perplexity cannot see your content.",
    partial: "Some AI crawlers have access, but others are blocked. Check which specific bots are restricted in your robots.txt.",
  },
  "JSON-LD Structured Data": {
    fail: "No structured data found. AI systems have no reliable way to determine what your pages are about.",
    partial: "Structured data exists but is incomplete. Missing fields prevent AI systems from confidently understanding your content.",
  },
  "llms.txt File": {
    fail: "No llms.txt file found. AI coding assistants have no structured guidance about your project. Low priority for most sites.",
    partial: "llms.txt exists but is missing key fields (project name, description, or documentation URLs).",
  },
  "MCP Endpoint": {
    fail: "No API or MCP endpoint found. AI agents can only read your pages — they cannot check pricing, inventory, or take actions.",
    partial: "An OpenAPI spec was found but no true MCP endpoint. Partial agent interaction is possible.",
  },
  "JavaScript Rendering": {
    fail: "Your content depends heavily on JavaScript. AI crawlers that don't run JS see almost nothing on your pages.",
    partial: "Some content is available without JavaScript, but important parts depend on client-side rendering.",
  },
  "Meta Tags and Open Graph": {
    fail: "Critical meta tags are missing. AI systems lack the information needed to understand and accurately cite your pages.",
    partial: "Some meta tags are present but incomplete. Missing og:description or short meta description limits AI understanding.",
  },
  "Sitemap.xml": {
    fail: "No sitemap found. AI crawlers have no roadmap of your pages and may miss important content.",
    partial: "Sitemap found but lacks lastmod dates, limiting AI crawlers' ability to prioritize fresh content.",
  },
  "Page Load Speed": {
    fail: "Your pages load slowly (>4 seconds). AI agents often time out before your content finishes rendering.",
    partial: "Your pages load at a moderate speed. Some AI agents may time out, especially on slower connections.",
  },
};

// ── "Why This Matters" for failed/partial checks ───────────────────
const WHY_IT_MATTERS = {
  "AI Bot Permissions (robots.txt)": "Every blocked AI crawler is a lost opportunity to appear in AI search results and chatbot answers.",
  "JSON-LD Structured Data": "AI systems cite websites they understand. Structured data is a direct signal that increases citation rates.",
  "llms.txt File": "Without llms.txt, AI assistants have no structured guidance about what your site offers. Less relevant for most businesses.",
  "MCP Endpoint": "AI agents that can query your site directly get cited more often. An MCP endpoint turns your site from a reference into a data source.",
  "JavaScript Rendering": "Content that only appears after JavaScript runs is invisible to many AI crawlers. Your most important pages may not exist to AI.",
  "Meta Tags and Open Graph": "AI summarization tools rely on meta tags to describe your site when they cite it. Missing tags = missing context in AI answers.",
  "Sitemap.xml": "Without a sitemap, new products and pages can take weeks to appear in AI crawler indexes.",
  "Page Load Speed": "AI agents have strict timeouts — typically 5–10 seconds. A slow page gets skipped entirely, even if the content is perfect.",
};

// ── "What Happens If Ignored" for failed/partial checks ────────────
const WHAT_HAPPENS_IF_IGNORED = {
  "AI Bot Permissions (robots.txt)": "Your site will be excluded from AI search results. Competitors with open permissions will capture that traffic.",
  "JSON-LD Structured Data": "AI systems will guess what your pages are about — often incorrectly. You lose control over how you're described in AI answers.",
  "llms.txt File": "Minimal impact for most businesses. Focus on higher-priority fixes first.",
  "MCP Endpoint": "Your site is a read-only reference. AI agents cannot check your pricing, inventory, or availability in real time.",
  "JavaScript Rendering": "Pages that depend on JavaScript may never be indexed by AI crawlers. Products, blog posts, and landing pages remain invisible.",
  "Meta Tags and Open Graph": "AI tools will use generic, auto-generated descriptions for your site in search results — missing keywords, offers, and differentiators.",
  "Sitemap.xml": "New products and content take weeks to be discovered. Your latest offerings won't appear in AI answers until weeks later.",
  "Page Load Speed": "Slow pages get dropped from AI indexes. As more sites optimize for speed, slow sites lose disproportionate visibility.",
};

export function CheckCard({ check }) {
  const status = check.passed ? "PASS" : check.partial ? "PART" : "FAIL";
  const config = statusConfig[status];
  const pct = Math.round((check.score / check.max_score) * 100);

  // Derive priority from check status
  const priority = !check.passed && !check.partial
    ? { label: "Fix Now", className: "bg-red-500/10 text-red-500" }
    : check.partial
    ? { label: "Improve", className: "bg-orange-500/10 text-orange-500" }
    : { label: "Good", className: "bg-green-500/10 text-green-500" };

  const [open, setOpen] = useState(false);
  const detailsId = `check-details-${check.name.replace(/\s+/g, "-").toLowerCase()}`;

  function handleToggle() {
    const next = !open;
    setOpen(next);
    if (next) {
      track("expanded_check", {
        check_name: check.name,
        check_status: status,
        check_score: check.score,
        check_max_score: check.max_score,
      });
      track("clicked_recommendation", {
        check_name: check.name,
        check_status: status,
        check_score: check.score,
      });
    }
  }

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
            {status === "PASS" ? "✓" : status === "PART" ? "Needs Work" : "FAIL"}
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
            onClick={handleToggle}
            id={`${detailsId}-btn`}
            aria-expanded={open}
            aria-controls={detailsId}
            className="flex items-center justify-between w-full rounded-lg border border-border bg-secondary/30 px-3 py-2 text-xs font-semibold text-foreground hover:bg-secondary transition-colors cursor-pointer"
          >
            <span>{open ? "Hide Fix" : "Show Fix"}</span>
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
