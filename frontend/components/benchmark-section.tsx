import { Container } from "./container";

const benchmarks = [
  { name: "Anthropic", score: 40, color: "text-red-500", barColor: "bg-red-500" },
  { name: "WooCommerce", score: 65, color: "text-orange-500", barColor: "bg-orange-500" },
  { name: "Shopify", score: 72, color: "text-accent", barColor: "bg-accent" },
  { name: "GitHub", score: 78, color: "text-green-500", barColor: "bg-green-500" },
];

export function BenchmarkSection() {
  return (
    <section id="benchmarks" className="py-24 bg-secondary/10">
      <Container>
        <div className="mx-auto max-w-2xl text-center mb-14">
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">Reference Scores</p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            How Sample Sites Score
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            Reference examples only. Scan your site for an accurate result.
          </p>
        </div>

        <div className="mx-auto max-w-2xl">
          <div className="rounded-xl border border-border bg-card p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col gap-5">
              {benchmarks.map((item) => (
                <div key={item.name} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{item.name}</span>
                    <span className={`font-mono text-sm font-bold ${item.color}`}>{item.score}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${item.barColor}`}
                      style={{ width: `${item.score}%` }}
                      role="progressbar"
                      aria-valuenow={item.score}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${item.name} score`}
                    />
                  </div>
                </div>
              ))}
            </div>

            <p className="text-center text-xs text-muted-foreground/60">
              Reference scores — scan your site to compare.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
