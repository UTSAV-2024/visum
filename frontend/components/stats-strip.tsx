import { Container } from "./container";

const stats = [
  {
    value: "393%",
    label: "AI traffic growth",
    detail: "Year-over-year increase in visits to websites from AI assistants and agent platforms.",
  },
  {
    value: "42%",
    label: "Higher conversion rate",
    detail: "Referral traffic from AI answers converts at significantly higher rates than traditional search.",
  },
  {
    value: "8",
    label: "Visibility checks",
    detail: "Focused diagnostics from structured data to agent interaction readiness, scored in seconds.",
  },
];

export function StatsStrip() {
  return (
    <section aria-label="Key statistics" className="border-y border-border bg-card">
      <Container>
        <div className="grid grid-cols-1 divide-y divide-border md:grid-cols-3 md:divide-x md:divide-y-0">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center justify-center px-6 py-12 text-center">
              <div className="text-4xl font-bold tracking-tight text-accent sm:text-5xl">
                {stat.value}
              </div>
              <div className="mt-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                {stat.label}
              </div>
              <p className="mx-auto mt-2 max-w-xs text-pretty text-sm leading-relaxed text-muted-foreground/70">
                {stat.detail}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
