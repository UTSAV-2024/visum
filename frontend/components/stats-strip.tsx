import { Container } from "./container";

const stats = [
  {
    value: "8",
    label: "Visibility checks",
    detail: "Focused diagnostics from structured data to agent interaction readiness, scored in seconds.",
  },
  {
    value: "~20s",
    label: "Scan duration",
    detail: "Most scans complete in under 20 seconds, including JavaScript rendering and performance measurement.",
  },
  {
    value: "Free",
    label: "No signup required",
    detail: "Enter any public URL and get a full AI readiness report instantly — no account needed.",
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
