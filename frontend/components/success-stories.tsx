import { cn } from "../lib/utils";
import { getBand } from "../lib/scan-data";

// ── Demo case studies ─────────────────────────────────────────────

interface Story {
  name: string;
  type: string;
  before: number;
  after: number;
  fixes: string[];
}

const STORIES: Story[] = [
  {
    name: "Store A",
    type: "E-commerce",
    before: 42,
    after: 81,
    fixes: ["JSON-LD Structured Data", "MCP Endpoint", "JavaScript Rendering"],
  },
  {
    name: "DocsHub",
    type: "Documentation",
    before: 55,
    after: 88,
    fixes: ["llms.txt File", "Meta Tags and Open Graph", "Sitemap.xml"],
  },
  {
    name: "LaunchPage",
    type: "Marketing",
    before: 28,
    after: 74,
    fixes: ["AI Bot Permissions (robots.txt)", "JavaScript Rendering", "JSON-LD Structured Data"],
  },
];

// ── Arrow icon ────────────────────────────────────────────────────

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("h-4 w-4 shrink-0", className)} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </svg>
  );
}

// ── Component ─────────────────────────────────────────────────────

export function SuccessStories() {
  return (
    <section aria-label="Success stories" className="mt-10">
      <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
        <h2 className="text-sm font-semibold text-foreground mb-1">Success Stories</h2>
        <p className="text-xs text-muted-foreground mb-5">
          See how other sites improved their AI readiness by addressing the same issues.
        </p>

        {/* Stories grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {STORIES.map((story) => {
            const beforeBand = getBand(story.before);
            const afterBand = getBand(story.after);
            const gain = story.after - story.before;

            return (
              <div
                key={story.name}
                className="flex flex-col rounded-lg border border-border bg-secondary/20 p-4"
              >
                {/* Header */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{story.name}</h3>
                    <span className="text-[10px] text-muted-foreground">{story.type}</span>
                  </div>
                  <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-semibold text-green-500 whitespace-nowrap">
                    Demo
                  </span>
                </div>

                {/* Score transformation */}
                <div className="flex items-center justify-center gap-2 mb-3">
                  <div className="flex flex-col items-center">
                    <span className={cn("font-mono text-xl font-extrabold leading-none", beforeBand.text)}>
                      {story.before}
                    </span>
                    <span className="text-[9px] text-muted-foreground mt-0.5">Before</span>
                  </div>

                  <ArrowIcon className="text-accent" />

                  <div className="flex flex-col items-center">
                    <span className={cn("font-mono text-xl font-extrabold leading-none", afterBand.text)}>
                      {story.after}
                    </span>
                    <span className="text-[9px] text-muted-foreground mt-0.5">After</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="font-mono text-lg font-extrabold leading-none text-accent">
                      +{gain}
                    </span>
                    <span className="text-[9px] text-muted-foreground mt-0.5">Gain</span>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-border my-2" />

                {/* Fixes list */}
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-0.5">
                    Added
                  </span>
                  {story.fixes.map((fix) => (
                    <div key={fix} className="flex items-center gap-1.5">
                      <svg className="h-3 w-3 shrink-0 text-green-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path
                          fillRule="evenodd"
                          d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-[11px] text-muted-foreground">{fix}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Disclaimer */}
        <p className="mt-4 text-[10px] text-muted-foreground/50 text-center">
          These are <strong>illustrative examples</strong> showing potential outcomes. They are not real customer results. Individual results vary.
        </p>
      </div>
    </section>
  );
}
