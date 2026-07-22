import { Container } from "./container";

export function SocialProof() {
  return (
    <section id="social-proof" className="py-24 border-y border-border">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex self-center rounded-full bg-accent/10 px-3 py-1 text-xs text-accent mb-6">
            Why Visum Is Different
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground text-balance">
            Your SEO Tools Don't Measure AI Visibility. Visum Does.
          </h2>

          <p className="mt-5 text-base sm:text-lg leading-relaxed text-muted-foreground max-w-2xl mx-auto">
            Visum runs 8 automated checks based on the technical signals documented by OpenAI, Anthropic, Google, and Perplexity for how their AI systems discover and evaluate web content.
          </p>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            {[
              {
                title: "Beyond Google Rankings",
                desc: "AI assistants like ChatGPT and Perplexity don't rank pages the way Google does. They cite sources based on technical signals — structured data, crawl permissions, and content accessibility.",
              },
              {
                title: "Every Result Includes the Raw Evidence",
                desc: "Each failed check shows you exactly what we found — the blocked bot, the missing schema field, the timeout duration. You don't have to trust our opinion; you can see the data.",
              },
              {
                title: "3 Free Scans, No Credit Card, Instant Results",
                desc: "Create a free account and enter any public URL. Get a full AI readiness report in about 20 seconds. No credit card required.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-lg border border-border bg-card p-5 transition-colors hover:border-accent/50"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 mb-3">
                  <svg className="h-4 w-4 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 2a10 10 0 1 0 10 10h-10V2Z" />
                    <path d="M12 12 2.93 17.08" />
                    <path d="M14.5 9.5 21 7l-2.5 6.5" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
