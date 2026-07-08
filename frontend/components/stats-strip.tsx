import { Container } from "./container";

const stats = [
  {
    value: "8",
    label: "Technical Checks",
    detail: "robots.txt, JSON-LD, metadata, sitemap, page speed, JavaScript rendering, llms.txt, and MCP endpoint.",
  },
  {
    value: "20s",
    label: "Scan Duration",
    detail: "Average scan time across all site types, including JavaScript rendering and performance measurement.",
  },
  {
    value: "0",
    label: "Cost to Start",
    detail: "No account, no credit card, no email. Just paste your URL and see your results.",
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
