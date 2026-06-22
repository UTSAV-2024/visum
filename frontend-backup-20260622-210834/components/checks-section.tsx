const checks = [
  {
    title: "Structured data",
    description: "Validates schema.org markup so agents understand your products, pages, and entities.",
  },
  {
    title: "Crawlability",
    description: "Confirms agents and bots can reach key pages without being blocked or rate-limited.",
  },
  {
    title: "Content clarity",
    description: "Measures how easily machines can extract your core value proposition and offerings.",
  },
  {
    title: "Agent access policy",
    description: "Reviews robots.txt and llms.txt directives that control AI agent permissions.",
  },
  {
    title: "Metadata quality",
    description: "Checks titles, descriptions, and Open Graph tags used by assistants to summarize you.",
  },
  {
    title: "Performance signals",
    description: "Assesses load speed and rendering that affect whether agents can parse your pages.",
  },
  {
    title: "Action readiness",
    description: "Detects forms, APIs, and flows agents can complete on a user's behalf.",
  },
  {
    title: "Trust & freshness",
    description: "Evaluates citations, authorship, and update signals that build agent confidence.",
  },
]

function CheckIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m5 13 4 4L19 7" />
    </svg>
  );
}

export function ChecksSection() {
  return (
    <section id="checks" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand">8 readiness checks</p>
        <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-navy sm:text-4xl">
          Everything we test for AI visibility
        </h2>
        <p className="mt-4 text-pretty text-lg leading-relaxed text-slate-600">
          Each scan runs eight focused checks to score how prepared your site is for the agent-driven web.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {checks.map((check) => (
          <div
            key={check.title}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50">
              <CheckIcon className="h-5 w-5 text-brand" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-slate-900">{check.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">{check.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
