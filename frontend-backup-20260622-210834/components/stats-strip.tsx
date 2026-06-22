const stats = [
  {
    value: "393%",
    label: "AI traffic growth",
    detail: "Year-over-year increase in visits from AI assistants and agents.",
  },
  {
    value: "42%",
    label: "Better conversion",
    detail: "Higher conversion when content is machine-readable to agents.",
  },
  {
    value: "8",
    label: "Readiness checks",
    detail: "Core signals we test, from structured data to agent access.",
  },
];

export function StatsStrip() {
  return (
    <section aria-label="Key statistics" className="border-y border-slate-200 bg-navy">
      <div className="mx-auto grid max-w-6xl grid-cols-1 divide-y divide-white/10 px-4 sm:px-6 md:grid-cols-3 md:divide-x md:divide-y-0">
        {stats.map((stat) => (
          <div key={stat.label} className="px-2 py-10 text-center md:px-8">
            <div className="text-4xl font-bold tracking-tight text-brand sm:text-5xl">
              {stat.value}
            </div>
            <div className="mt-2 text-sm font-semibold uppercase tracking-wide text-white/90">
              {stat.label}
            </div>
            <p className="mx-auto mt-2 max-w-xs text-pretty text-sm leading-relaxed text-slate-400">
              {stat.detail}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
