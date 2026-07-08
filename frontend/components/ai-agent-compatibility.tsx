import { useEffect, useRef } from "react";
import { cn } from "../lib/utils";
import type { ReactNode } from "react";
import { track } from "../lib/analytics";

// ── Agent definitions ────────────────────────────────────────────────

const AGENTS = [
  {
    id: "chatgpt",
    name: "ChatGPT",
    description: "OpenAI's chatbot with web browsing",
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path d="M10 1C5.03 1 1 5.03 1 10s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm3.89 11.71c-.42.67-1.12 1.08-1.89 1.08-.42 0-.83-.12-1.19-.34-.34-.21-.6-.51-.78-.86l-1.66-.02c-.08.49-.3.95-.62 1.32-.42.48-1.02.76-1.66.76-.63 0-1.23-.28-1.65-.76-.33-.37-.55-.83-.63-1.32l-1.66.02c-.18.35-.44.65-.78.86-.36.22-.77.34-1.19.34-.77 0-1.47-.41-1.89-1.08-.48-.76-.48-1.71 0-2.47.42-.67 1.12-1.08 1.89-1.08.42 0 .83.12 1.19.34.34.21.6.51.78.86l1.66-.02c.08-.49.3-.95.62-1.32.42-.48 1.02-.76 1.66-.76.63 0 1.23.28 1.65.76.33.37.55.83.63 1.32l1.66.02c.18-.35.44-.65.78-.86.36-.22.77-.34 1.19-.34.77 0 1.47.41 1.89 1.08.48.76.48 1.71 0 2.47z" />
      </svg>
    ),
  },
  {
    id: "claude",
    name: "Claude",
    description: "Anthropic's assistant with web preview",
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M3.43 2.524A41.29 41.29 0 0110 2c2.236 0 4.43.18 6.57.524 1.437.231 2.43 1.49 2.43 2.902v5.148c0 1.413-.993 2.67-2.43 2.902a41.102 41.102 0 01-3.55.414.42.42 0 00-.343.164l-1.493 2.198c-.39.574-1.302.574-1.692 0l-1.493-2.198a.42.42 0 00-.343-.164 41.39 41.39 0 01-3.55-.414C1.993 13.245 1 11.986 1 10.574V5.426c0-1.413.993-2.67 2.43-2.902z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    id: "perplexity",
    name: "Perplexity",
    description: "AI-powered search engine",
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M9 3.5V5.5a.5.5 0 01-.5.5H6a.5.5 0 00-.5.5v1a.5.5 0 01-.5.5h-1A.5.5 0 013.5 9v1a.5.5 0 01-.5.5H2a.5.5 0 00-.5.5v2a.5.5 0 00.5.5h1a.5.5 0 00.5-.5v-1a.5.5 0 01.5-.5h1a.5.5 0 00.5-.5v-1a.5.5 0 01.5-.5h1a.5.5 0 00.5-.5V6.5a.5.5 0 01.5-.5h1a.5.5 0 00.5-.5V4.5a.5.5 0 01.5-.5h1a.5.5 0 00.5-.5V2.5a.5.5 0 00-.5-.5h-2a.5.5 0 00-.5.5v1z" clipRule="evenodd" />
        <path d="M14 6a3 3 0 11-6 0 3 3 0 016 0z" />
        <path d="M17 11a3 3 0 11-6 0 3 3 0 016 0z" />
        <path d="M12 16a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    id: "cursor",
    name: "Cursor",
    description: "AI code editor",
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M4.5 2A1.5 1.5 0 003 3.5v13A1.5 1.5 0 004.5 18h11a1.5 1.5 0 001.5-1.5V7.621a1.5 1.5 0 00-.44-1.06l-4.12-4.122A1.5 1.5 0 0011.378 2H4.5zm2.25 8.5a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5zm0 3a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    id: "gemini",
    name: "Gemini",
    description: "Google's multimodal AI",
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path d="M10 2a5 5 0 00-5 5v2a5 5 0 005 5 5 5 0 005-5V7a5 5 0 00-5-5z" />
        <path d="M10 14c-2.5 0-4.5-2-4.5-4.5S7.5 5 10 5s4.5 2 4.5 4.5S12.5 14 10 14z" />
      </svg>
    ),
  },
];

// ── Heuristic impact mapping ─────────────────────────────────────────
// Each entry is: { checkName, weight } where weight is 1.0 (High),
// 0.5 (Medium), or 0.1 (Low/None).
// Higher weight = check matters more for that agent.

const CHECK_NAMES = [
  "AI Bot Permissions (robots.txt)",
  "Sitemap.xml",
  "JavaScript Rendering",
  "JSON-LD Structured Data",
  "Meta Tags and Open Graph",
  "llms.txt File",
  "Page Load Speed",
  "MCP Endpoint",
] as const;

type ImpactWeight = 1.0 | 0.5 | 0.1;

const AGENT_MAPPINGS: Record<string, Record<string, ImpactWeight>> = {
  chatgpt: {
    "AI Bot Permissions (robots.txt)": 1.0,  // High  — GPTBot crawler
    "Sitemap.xml": 0.5,                       // Med   — helps discovery
    "JavaScript Rendering": 1.0,               // High  — needs SSR content
    "JSON-LD Structured Data": 1.0,            // High  — structured data for answers
    "Meta Tags and Open Graph": 0.5,           // Med   — OG for link previews
    "llms.txt File": 1.0,                      // High  — GPTs gain llms.txt support
    "Page Load Speed": 0.5,                    // Med   — crawl budget
    "MCP Endpoint": 0.1,                       // Low   — limited via Custom GPTs
  },
  claude: {
    "AI Bot Permissions (robots.txt)": 1.0,   // High — ClaudeBot
    "Sitemap.xml": 0.5,                        // Med  — discovery
    "JavaScript Rendering": 1.0,               // High — reads rendered content
    "JSON-LD Structured Data": 0.5,            // Med  — some structured data support
    "Meta Tags and Open Graph": 0.5,           // Med  — preview metadata
    "llms.txt File": 1.0,                      // High — Anthropic actively promotes
    "Page Load Speed": 0.5,                    // Med  — crawl budget
    "MCP Endpoint": 1.0,                       // High — Claude Code's core feature
  },
  perplexity: {
    "AI Bot Permissions (robots.txt)": 1.0,   // High — crawler access
    "Sitemap.xml": 1.0,                        // High — indexing for answers
    "JavaScript Rendering": 1.0,               // High — needs rendered content
    "JSON-LD Structured Data": 1.0,            // High — citation snippets
    "Meta Tags and Open Graph": 0.5,           // Med  — some metadata use
    "llms.txt File": 0.5,                      // Med  — emerging support
    "Page Load Speed": 1.0,                    // High — crawl budget = more indexed
    "MCP Endpoint": 0.1,                       // Low  — no MCP integration
  },
  cursor: {
    "AI Bot Permissions (robots.txt)": 0.1,   // Low  — doesn't crawl the web
    "Sitemap.xml": 0.1,                        // Low
    "JavaScript Rendering": 0.1,               // Low
    "JSON-LD Structured Data": 0.1,            // Low
    "Meta Tags and Open Graph": 0.1,           // Low
    "llms.txt File": 1.0,                      // High — docs/context for coding
    "Page Load Speed": 0.1,                    // Low
    "MCP Endpoint": 1.0,                       // High — tool integration
  },
  gemini: {
    "AI Bot Permissions (robots.txt)": 1.0,   // High — Google-Extended
    "Sitemap.xml": 1.0,                        // High — Google indexing
    "JavaScript Rendering": 1.0,               // High — Google renders JS
    "JSON-LD Structured Data": 1.0,            // High — rich results
    "Meta Tags and Open Graph": 1.0,           // High — search snippets
    "llms.txt File": 0.1,                      // Low  — Google uses own guidelines
    "Page Load Speed": 1.0,                    // High — Core Web Vitals
    "MCP Endpoint": 0.1,                       // Low  — no MCP yet
  },
};

// ── Impact label helpers ─────────────────────────────────────────────

function impactWeight(weight: number): { label: string; className: string } {
  if (weight >= 1.0) return { label: "High", className: "text-green-500 bg-green-500/10 border-green-500/20" };
  if (weight >= 0.5) return { label: "Med", className: "text-accent bg-accent/10 border-accent/20" };
  return { label: "Low", className: "text-muted-foreground bg-secondary/30 border-border" };
}

// ── Agent compatibility scoring ──────────────────────────────────────

interface AgentScore {
  id: string;
  name: string;
  description: string;
  icon: ReactNode;
  rawScore: number;
  maxScore: number;
  pct: number;
  label: string;
  labelColor: string;
  barColor: string;
}

function computeAgentScore(
  agent: (typeof AGENTS)[number],
  checkMap: Record<string, { score: number; max_score: number; passed: boolean }>,
): AgentScore {
  const mapping = AGENT_MAPPINGS[agent.id];
  if (!mapping) {
    return {
      ...agent,
      rawScore: 0,
      maxScore: 0,
      pct: 0,
      label: "Unknown",
      labelColor: "text-muted-foreground",
      barColor: "bg-muted-foreground",
    };
  }

  let weightedEarned = 0;
  let weightedTotal = 0;

  for (const [checkName, weight] of Object.entries(mapping)) {
    const check = checkMap[checkName];
    if (!check) continue;

    weightedTotal += weight * check.max_score;
    weightedEarned += weight * check.score;
  }

  const pct = weightedTotal > 0 ? Math.round((weightedEarned / weightedTotal) * 100) : 0;

  let label: string;
  let labelColor: string;
  let barColor: string;

  if (pct >= 85) {
    label = "Great";
    labelColor = "text-green-500";
    barColor = "bg-green-500";
  } else if (pct >= 65) {
    label = "Good";
    labelColor = "text-accent";
    barColor = "bg-accent";
  } else if (pct >= 40) {
    label = "Fair";
    labelColor = "text-orange-500";
    barColor = "bg-orange-500";
  } else {
    label = "Poor";
    labelColor = "text-red-500";
    barColor = "bg-red-500";
  }

  return {
    ...agent,
    rawScore: weightedEarned,
    maxScore: weightedTotal,
    pct,
    label,
    labelColor,
    barColor,
  };
}

// ── Main component ───────────────────────────────────────────────────

export function AiAgentCompatibility({ checks }: { checks: Array<{ name: string; score: number; max_score: number; passed: boolean; partial?: boolean }> }) {
  const sectionRef = useRef(null);
  const trackedRef = useRef(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || !checks) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !trackedRef.current) {
          trackedRef.current = true;
          const failing = checks.filter((c) => !c.passed).length;
          track("scrolled_to_compatibility", {
            total_checks: checks.length,
            failing_checks: failing,
          });
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [checks]);

  if (!checks || checks.length === 0) return null;

  // Build a lookup map
  const checkMap: Record<string, { score: number; max_score: number; passed: boolean; partial?: boolean }> = {};
  for (const c of checks) {
    checkMap[c.name] = c;
  }

  const scores = AGENTS.map((agent) => computeAgentScore(agent, checkMap));

  return (
    <section ref={sectionRef} aria-label="AI Agent Compatibility" className="mt-10">
      {/* Header */}
      <div className="mb-5">
        <h2 className="text-lg sm:text-xl font-bold text-foreground">AI Agent Compatibility</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          How well your site supports the AI agents your visitors use.
        </p>
      </div>

      {/* Agent score cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        {scores.map((agent) => (
          <div
            key={agent.id}
            className="rounded-xl border border-border bg-card p-4 flex flex-col items-center text-center"
          >
            {/* Icon */}
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent mb-2">
              {agent.icon}
            </span>

            {/* Name */}
            <span className="text-xs font-semibold text-foreground">{agent.name}</span>

            {/* Score */}
            <span className={cn("font-mono text-2xl font-extrabold leading-none mt-1.5", agent.labelColor)}>
              {agent.pct}
            </span>

            {/* Label */}
            <span className={cn("mt-0.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold border", agent.labelColor.replace("text", "border").replace("500", "500/30"), agent.labelColor.replace("text", "bg").replace("500", "500/10"))}>
              {agent.label}
            </span>

            {/* Mini progress bar */}
            <div className="mt-3 h-1 w-full rounded-full bg-muted overflow-hidden">
              <div
                className={cn("h-full rounded-full transition-all duration-500", agent.barColor)}
                style={{ width: `${agent.pct}%` }}
                role="progressbar"
                aria-valuenow={agent.pct}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${agent.name} compatibility`}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Impact breakdown table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-3 border-b border-border">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Impact Breakdown
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground whitespace-nowrap min-w-[160px]">
                  Check
                </th>
                {AGENTS.map((agent) => (
                  <th key={agent.id} className="text-center px-2 py-2.5 font-semibold text-muted-foreground whitespace-nowrap">
                    <span className="hidden sm:inline">{agent.name}</span>
                    <span className="sm:hidden">
                      {agent.id === "chatgpt" ? "GPT" : agent.id === "perplexity" ? "Perp" : agent.name}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CHECK_NAMES.map((checkName) => {
                const check = checkMap[checkName];
                const status = check
                  ? check.passed
                    ? { symbol: "✓", className: "text-green-500" }
                    : check.partial
                      ? { symbol: "△", className: "text-orange-500" }
                      : { symbol: "✗", className: "text-red-500" }
                  : { symbol: "–", className: "text-muted-foreground" };

                return (
                  <tr key={checkName} className="border-b border-border last:border-0">
                    <td className="px-4 py-2.5 text-foreground font-medium whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className={cn("text-xs font-bold tabular-nums", status.className)}>
                          {status.symbol}
                        </span>
                        <span>{checkName}</span>
                      </div>
                    </td>
                    {AGENTS.map((agent) => {
                      const mapping = AGENT_MAPPINGS[agent.id];
                      const weight = mapping?.[checkName] ?? 0.1;
                      const impact = impactWeight(weight);
                      return (
                        <td key={agent.id} className="text-center px-2 py-2.5">
                          <span className={cn("inline-block rounded px-1.5 py-0.5 text-[10px] font-semibold border leading-none", impact.className)}>
                            {impact.label}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footnote */}
      <p className="mt-3 text-[11px] text-muted-foreground/60 leading-relaxed">
        Impact is estimated heuristically based on each agent&apos;s known capabilities. Low impact does not mean the check is unimportant — it means the agent relies on it less than others.
      </p>
    </section>
  );
}
