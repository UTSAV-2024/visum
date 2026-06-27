import { cn } from "../lib/utils";

// ── Consequences for each check ───────────────────────────────────

const CONSEQUENCE_MAP: Record<string, { title: string; text: string }> = {
  "AI Bot Permissions (robots.txt)": {
    title: "AI crawlers blocked",
    text: "AI crawlers from search engines and chatbots may be blocked from accessing your content entirely, making you invisible in AI-generated search results and answers.",
  },
  "Sitemap.xml": {
    title: "Slow content discovery",
    text: "New or updated pages can take weeks or months to be discovered by AI crawlers, leaving your latest content invisible to AI systems.",
  },
  "JavaScript Rendering": {
    title: "Invisible dynamic content",
    text: "Key pages or dynamic content may remain invisible to AI crawlers indefinitely, since many AI agents do not execute JavaScript before processing page content.",
  },
  "Page Load Speed": {
    title: "Lost to timeouts",
    text: "AI agents operate under strict timeouts — slow pages get skipped in favour of faster alternatives, costing you visibility.",
  },
  "JSON-LD Structured Data": {
    title: "Poor AI understanding",
    text: "AI systems may fail to understand your content's meaning and structure, reducing the quality of AI-generated citations, summaries, and answers about your pages.",
  },
  "Meta Tags and Open Graph": {
    title: "Misrepresented in results",
    text: "AI-generated link previews, search snippets, and summarisations will lack context and may misrepresent your content or brand.",
  },
  "llms.txt File": {
    title: "Developer tools lack guidance",
    text: "Developer-focused AI tools and coding assistants will have less context about your project, leading to less accurate code suggestions and documentation references.",
  },
  "MCP Endpoint": {
    title: "No agent interaction",
    text: "Future generations of AI agents may pass your site by in favour of those they can actively interact with, query, and perform actions on through standardised endpoints.",
  },
};

// ── Component ─────────────────────────────────────────────────────

interface Check {
  name: string;
  score: number;
  max_score: number;
  passed: boolean;
  partial?: boolean;
}

export function DoNothingConsequences({ checks }: { checks: Check[] }) {
  // Pick failed checks sorted by max_score desc, limit to 3
  const failures = checks
    .filter((c) => !c.passed)
    .sort((a, b) => b.max_score - a.max_score)
    .slice(0, 3);

  if (failures.length === 0) return null;

  return (
    <section aria-label="What happens if you do nothing" className="mt-10">
      <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
        <h2 className="text-sm font-semibold text-foreground mb-1">What Happens If You Do Nothing?</h2>
        <p className="text-xs text-muted-foreground mb-5">
          These issues won&apos;t fix themselves — and the competitive window is closing.
        </p>

        <div className="flex flex-col gap-3">
          {failures.map((check) => {
            const consequence = CONSEQUENCE_MAP[check.name];
            if (!consequence) return null;

            return (
              <div
                key={check.name}
                className="flex items-start gap-3 rounded-lg border border-border bg-secondary/20 px-4 py-3"
              >
                {/* Warning icon */}
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-red-500">
                  <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>

                {/* Content */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-sm font-semibold text-foreground">{consequence.title}</h3>
                    <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-semibold text-red-500">
                      {check.partial ? "Partial" : "Missing"}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {consequence.text}
                  </p>
                  <p className="mt-1.5 text-[11px] font-medium tabular-nums">
                    <span className="text-muted-foreground">{check.name} — </span>
                    <span className="text-red-500">{check.score}/{check.max_score}</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Closing note */}
        <p className="mt-4 text-xs text-muted-foreground text-center leading-relaxed">
          Each of these issues compounds over time. As AI adoption grows, sites that address these gaps now will have a lasting visibility advantage.
        </p>
      </div>
    </section>
  );
}
