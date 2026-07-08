import { cn } from "../lib/utils";
import { getBand } from "../lib/scan-data";

// ── Short labels ──────────────────────────────────────────────────

const SHORT_LABELS: Record<string, string> = {
  "AI Bot Permissions (robots.txt)": "AI crawler permissions",
  "JSON-LD Structured Data": "structured data",
  "llms.txt File": "an llms.txt file",
  "MCP Endpoint": "an MCP endpoint",
  "JavaScript Rendering": "JavaScript rendering",
  "Meta Tags and Open Graph": "meta tags",
  "Sitemap.xml": "a sitemap",
  "Page Load Speed": "page load speed",
};

const SHORT_PASS_LABELS: Record<string, string> = {
  "AI Bot Permissions (robots.txt)": "accessible to AI crawlers",
  "JSON-LD Structured Data": "well-structured content",
  "llms.txt File": "AI developer guidance",
  "MCP Endpoint": "agent interaction ready",
  "JavaScript Rendering": "fully renderable content",
  "Meta Tags and Open Graph": "good meta information",
  "Sitemap.xml": "complete content discovery",
  "Page Load Speed": "fast page loading",
};

// ── Summary generation ────────────────────────────────────────────

interface Check {
  name: string;
  score: number;
  max_score: number;
  passed: boolean;
  partial?: boolean;
}

interface Summary {
  sentences: string[];
  tone: "positive" | "constructive" | "urgent";
}

function generateSummary(score: number, checks: Check[]): Summary {
  const passed = checks.filter((c) => c.passed);
  const failed = checks.filter((c) => !c.passed);
  const partial = checks.filter((c) => c.partial);

  const strengths = passed.map((c) => SHORT_PASS_LABELS[c.name] || c.name);
  const weaknesses = failed.map((c) => SHORT_LABELS[c.name] || c.name);
  const topFailures = [...failed]
    .sort((a, b) => b.max_score - a.max_score)
    .slice(0, 2)
    .map((c) => SHORT_LABELS[c.name] || c.name);

  const sentences: string[] = [];

  // ── Opening sentence (score-based) ──────────────────────────
  if (score >= 85) {
    sentences.push(
      `Great shape. Score: ${score}/100. Minor tweaks recommended.`,
    );
  } else if (score >= 65) {
    sentences.push(
      `Solid foundation. Score: ${score}/100. Several improvements available.`,
    );
  } else if (score >= 40) {
    sentences.push(
      `Significant gaps. Score: ${score}/100. Major improvements needed.`,
    );
  } else {
    sentences.push(
      `Critical issues. Score: ${score}/100. Most AI systems can't read your site.`,
    );
  }

  // ── SWOT sentence ──────────────────────────────────────────
  if (strengths.length > 0 && weaknesses.length > 0) {
    // Mixed: has both strengths and weaknesses
    const strongList = strengths.slice(0, 2).join(" and ");
    const weakList = weaknesses.slice(0, 2).join(" and ");
    sentences.push(
      `${strongList} present, but ${weakList} are missing.`,
    );
  } else if (strengths.length > 0 && weaknesses.length === 0) {
    sentences.push(
      `All key AI visibility checks are passing.`,
    );
  } else if (strengths.length === 0) {
    const weakList = weaknesses.slice(0, 3).join(", ");
    sentences.push(
      `Critical: ${weakList} missing or insufficient.`,
    );
  }

  // ── Opportunity sentence ───────────────────────────────────
  if (topFailures.length > 0) {
    if (topFailures.length === 1) {
      sentences.push(
        `Top fix: add ${topFailures[0]}.`,
      );
    } else {
      sentences.push(
        `Top fixes: ${topFailures.join(" and ")}.`,
      );
    }
  }

  // ── Closing recommendation ─────────────────────────────────
  if (score >= 85) {
    // Already excellent — minor tweaks
    if (partial.length > 0) {
      sentences.push(
        `Resolving partial checks could push your score higher.`,
      );
    }
  } else if (score >= 65) {
    sentences.push(
      `Closing these gaps moves your site from good to excellent.`,
    );
  } else if (score >= 40) {
    sentences.push(
      `Fixing these issues significantly improves how AI systems discover and understand your content.`,
    );
  } else {
    sentences.push(
      `Start with the highest-impact fixes first for the fastest path to AI visibility.`,
    );
  }

  const tone: "positive" | "constructive" | "urgent" =
    score >= 85 ? "positive" :
    score >= 65 ? "constructive" :
    "urgent";

  return { sentences, tone };
}

// ── Component ─────────────────────────────────────────────────────

export function ExecutiveSummary({ score, checks }: { score: number; checks: Check[] }) {
  if (!checks || checks.length === 0) return null;

  const { sentences, tone } = generateSummary(score, checks);

  const borderColor =
    tone === "positive" ? "border-green-500/20" :
    tone === "constructive" ? "border-accent/20" :
    "border-red-500/20";

  const iconColor =
    tone === "positive" ? "text-green-500" :
    tone === "constructive" ? "text-accent" :
    "text-red-500";

  return (
    <section aria-label="Executive summary" className="mt-6">
      <div
        className={cn(
          "flex items-start gap-3 rounded-xl border bg-card px-4 py-3.5 sm:px-5 sm:py-4",
          borderColor,
        )}
      >
        {/* Icon */}
        <span className={cn("mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full", iconColor)}>
          {tone === "positive" ? (
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clipRule="evenodd"
              />
            </svg>
          ) : tone === "constructive" ? (
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </span>

        {/* Summary text */}
        <div className="min-w-0">
          <p className="text-xs leading-relaxed text-foreground/90">
            {sentences.map((s, i) => (
              <span key={i}>
                {s}
                {i < sentences.length - 1 ? " " : ""}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
