import { Container } from "./container";

const checks = [
  {
    title: "AI Crawl Permissions",
    description: "We check whether your robots.txt allows AI crawlers from ChatGPT, Claude, Perplexity, and Google to access your content.",
  },
  {
    title: "Structured Data Validation",
    description: "We verify that your JSON-LD markup contains complete, valid schema types that AI systems use to understand your products, articles, and organization.",
  },
  {
    title: "JavaScript-Free Content",
    description: "We test whether your core content is visible in the raw HTML that AI crawlers receive — before any JavaScript executes.",
  },
  {
    title: "Meta Tags & Open Graph",
    description: "We scan your page titles, meta descriptions, and Open Graph tags — the metadata AI systems use when citing your site in search results and link previews.",
  },
  {
    title: "Sitemap Health",
    description: "We verify that your sitemap.xml exists, includes all your pages, and contains lastmod dates so AI crawlers can prioritize fresh content.",
  },
  {
    title: "Page Speed & Timeout Risk",
    description: "We measure your page load time and assess whether AI agents — which operate under strict 5–10 second timeouts — are likely to skip your content.",
  },
  {
    title: "MCP & API Accessibility",
    description: "We check whether your site exposes endpoints that AI agents can query directly — enabling real-time access to your pricing, inventory, or content without web browsing.",
  },
  {
    title: "LLM Guidance (llms.txt)",
    description: "We check for an llms.txt file — a standard that helps AI coding assistants and developer tools understand your project structure and documentation.",
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
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">What We Check</p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            The 8 Signals AI Systems Use to Evaluate Your Site
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            Every check targets a specific technical factor that affects whether AI systems can find, read, and recommend your content.
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
