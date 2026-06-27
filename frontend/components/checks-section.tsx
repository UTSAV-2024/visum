import { Container } from "./container";

const checks = [
  {
    title: "LLM discoverability",
    description: "Discover why AI systems cannot find or cite your content in chat responses.",
  },
  {
    title: "Barrier detection",
    description: "Find technical barriers that prevent ChatGPT, Claude, and Perplexity from accessing your pages.",
  },
  {
    title: "Content readability",
    description: "Check whether AI agents can extract meaning from your pages without JavaScript.",
  },
  {
    title: "Agent permissions",
    description: "Reveal how your robots.txt and access rules are blocking AI crawlers.",
  },
  {
    title: "AI metadata quality",
    description: "See if your titles and Open Graph tags help or hurt your AI visibility.",
  },
  {
    title: "Speed impact",
    description: "Understand how page speed affects whether AI agents wait for your content.",
  },
  {
    title: "Agent interaction",
    description: "Discover if AI agents can perform actions on your site or just read it.",
  },
  {
    title: "Trust signals",
    description: "Get clear actions to improve citations, authorship, and AI confidence in your site.",
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
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">8 visibility checks</p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Why AI Agents Ignore Your Site
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            We run eight focused checks to surface exactly what&rsquo;s blocking AI systems from finding, understanding, and citing your content.
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
