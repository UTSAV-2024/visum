import { Container } from "./container";

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
];

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
    <section id="checks" className="py-24 bg-secondary/20">
      <Container>
        <div className="mx-auto max-w-2xl text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">8 readiness checks</p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Everything we test for AI visibility
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            Each scan runs eight focused checks to score how prepared your site is for the agent-driven web.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {checks.map((check) => (
            <div
              key={check.title}
              className="flex flex-col rounded-lg border border-border bg-card p-6 transition-colors hover:border-accent/50 group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                <CheckIcon className="h-5 w-5 text-accent" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-foreground group-hover:text-accent transition-colors">{check.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground flex-1">{check.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
