import { Container } from "./container";

export function SocialProof() {
  return (
    <section id="social-proof" className="py-24 border-y border-border">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex self-center rounded-full bg-accent/10 px-3 py-1 text-xs text-accent mb-6">
            Built for the agentic web
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground text-balance">
            Websites are increasingly optimizing for AI agents
          </h2>

          <p className="mt-5 text-base sm:text-lg leading-relaxed text-muted-foreground max-w-2xl mx-auto">
            See how your site performs compared to modern standards. Visum evaluates your
            visibility to ChatGPT, Claude, Gemini, and AI-powered search — so you can fix
            gaps before they cost you traffic.
          </p>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            {[
              {
                title: "AI Search Visibility",
                desc: "AI-powered search engines and assistants increasingly drive referral traffic. Ensure your content is discoverable and usable by these new interfaces.",
              },
              {
                title: "Agent Readiness",
                desc: "Autonomous agents can browse, evaluate, and act on your site — but only if it's structured, crawlable, and machine-readable.",
              },
              {
                title: "Competitive Edge",
                desc: "Most sites are not yet optimized for AI agents. Early adopters gain a meaningful advantage in visibility and AI-driven conversions.",
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
