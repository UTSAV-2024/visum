import { Container } from "./container";

const rows = [
  { feature: "Website Scan", geo: true, visum: true },
  { feature: "AI Visibility Score", geo: true, visum: true },
  { feature: "Identify Problems", geo: true, visum: true },
  { feature: "Explain Why It Matters", geo: "partial", visum: true },
  { feature: "Prioritized Recommendations", geo: "partial", visum: true },
  { feature: "Fix Guidance", geo: false, visum: true },
  { feature: "One-Time Audit", geo: false, visum: true },
  { feature: "Beginner Friendly", geo: "partial", visum: true },
];

function CheckIcon({ filled }) {
  return (
    <svg className={`h-4 w-4 ${filled ? "text-green-500" : "text-muted-foreground/30"}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
    </svg>
  );
}

function PartialIcon() {
  return (
    <svg className="h-4 w-4 text-orange-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg className="h-4 w-4 text-red-500/60" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
    </svg>
  );
}

function ValueIcon({ value }) {
  if (value === true) return <CheckIcon filled />;
  if (value === "partial") return <PartialIcon />;
  return <CrossIcon />;
}

export function ComparisonSection() {
  function handleCtaClick() {
    const target = document.getElementById("scan-url") || document.getElementById("scan");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
      requestAnimationFrame(() => {
        const input = document.getElementById("scan-url");
        if (input) {
          requestAnimationFrame(() => {
            input.focus({ preventScroll: true });
          });
        }
      });
    }
  }

  return (
    <section className="py-24 bg-secondary/10">
      <Container>
        <div className="mx-auto max-w-3xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex rounded-full bg-accent/10 px-3 py-1 text-xs text-accent mb-4">
              Why Visum?
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground text-balance">
              Not Another Visibility Tool
            </h2>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground max-w-lg mx-auto">
              Most AI visibility tools tell you what&rsquo;s wrong. Visum helps you understand and
              fix it.
            </p>
          </div>

          {/* Comparison table */}
          <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
            {/* Table header */}
            <div className="grid grid-cols-[2fr_1fr_1fr] divide-x divide-border border-b border-border bg-secondary/30">
              <div className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Capability
              </div>
              <div className="px-5 py-3.5 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Traditional GEO Tools
              </div>
              <div className="px-5 py-3.5 text-center text-xs font-semibold uppercase tracking-wide text-accent">
                Visum
              </div>
            </div>

            {/* Table rows */}
            {rows.map((row, i) => (
              <div
                key={row.feature}
                className={`grid grid-cols-[2fr_1fr_1fr] divide-x divide-border ${
                  i < rows.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <div className="px-5 py-3.5 text-sm text-foreground flex items-center">
                  {row.feature}
                </div>
                <div className="px-5 py-3.5 flex items-center justify-center">
                  <ValueIcon value={row.geo} />
                </div>
                <div className="px-5 py-3.5 flex items-center justify-center">
                  <ValueIcon value={row.visum} />
                </div>
              </div>
            ))}
          </div>

          {/* Positioning statement */}
          <div className="mt-10 text-center">
            <p className="text-sm leading-relaxed text-muted-foreground max-w-md mx-auto">
              Most platforms focus on monitoring visibility.{" "}
              <span className="text-foreground font-medium">
                Visum focuses on helping you improve it.
              </span>
            </p>
          </div>

          {/* CTA */}
          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={handleCtaClick}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-base font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 cursor-pointer border-0"
            >
              See My AI Visibility Score
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}
