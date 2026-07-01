import { useRouter } from "next/router";
import { SiteHeader } from "../components/site-header";
import { Hero } from "../components/hero";
import { StatsStrip } from "../components/stats-strip";
import { ChecksSection } from "../components/checks-section";
import { SocialProof } from "../components/social-proof";
import { ComparisonSection } from "../components/comparison-section";
import { UpgradeCta } from "../components/upgrade-cta";
import { SiteFooter } from "../components/site-footer";
import { Container } from "../components/container";

export default function Home() {
  const router = useRouter();

  function handleScanStart() {
    // Optional pre-scan logic
  }

  function handleScanEnd(data) {
    router.push("/email-gate");
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Hero onScanStart={handleScanStart} onScanEnd={handleScanEnd} />

        {/* How it works section */}
        <section
          id="how-it-works"
          className="py-24"
        >
          <Container>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                How it works
              </h2>
              <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
                Enter your URL, and we run 8 checks in under 30 seconds. You get a clear score
                showing how AI agents see your site.
              </p>
            </div>
            <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-3">
              {[
                { step: "01", title: "Enter your URL", desc: "Type in your website address — any platform works." },
                { step: "02", title: "Automated scan", desc: "We run 8 AI readiness checks against your site in real time." },
                { step: "03", title: "Get your report", desc: "Receive a detailed score with actionable fixes for each issue." },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent font-bold text-lg">
                    {item.step}
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        <StatsStrip />

        <ComparisonSection />

        <ChecksSection />
        <SocialProof />

        {/* Why AI Visibility Matters */}
        <section className="py-24 bg-secondary/10">
          <Container>
            <div className="mx-auto max-w-3xl">
              <div className="text-center mb-12">
                <div className="inline-flex self-center rounded-full bg-accent/10 px-3 py-1 text-xs text-accent mb-4">
                  The Big Picture
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground text-balance">
                  Why AI Visibility Matters Now
                </h2>
                <p className="mt-3 text-base leading-relaxed text-muted-foreground max-w-lg mx-auto">
                  The way people find information is changing faster than most websites can keep up.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  {
                    title: "AI-powered search is growing",
                    desc: "ChatGPT, Perplexity, and Gemini now handle billions of queries. These systems cite and recommend websites — but only if they can read them.",
                  },
                  {
                    title: "Traditional SEO is not enough",
                    desc: "Keyword optimization and backlinks do not guarantee AI visibility. AI agents require machine-readable structure, fast load times, and clear crawl permissions.",
                  },
                  {
                    title: "Most sites are invisible to AI",
                    desc: "Our scans show that over 60% of websites fail fundamental AI readability checks. Common issues include poor structured data, JavaScript-dependent content, and missing sitemaps.",
                  },
                  {
                    title: "Early movers gain advantage",
                    desc: "As AI-driven traffic grows, websites optimized for agent readiness will capture disproportionate visibility. Waiting means falling behind.",
                  },
                ].map((item) => (
                  <div key={item.title} className="rounded-lg border border-border bg-card p-5 transition-colors hover:border-accent/50">
                    <h3 className="text-sm font-semibold text-foreground mb-1.5">{item.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-24">
          <Container>
            <div className="mx-auto max-w-3xl">
              <div className="text-center mb-12">
                <div className="inline-flex self-center rounded-full bg-accent/10 px-3 py-1 text-xs text-accent mb-4">
                  FAQ
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground text-balance">
                  Frequently Asked Questions
                </h2>
              </div>

              <div className="space-y-4">
                {[
                  {
                    q: "What is AI visibility?",
                    a: "AI visibility measures how well AI systems — like ChatGPT, Claude, Perplexity, and AI-powered search engines — can discover, access, and understand your website. It goes beyond traditional SEO to include technical factors like structured data, JavaScript rendering, and crawl permissions.",
                  },
                  {
                    q: "How does the scan work?",
                    a: "Enter any public URL, and we run 8 automated checks against your website. We test AI bot permissions, structured data, llms.txt files, MCP endpoints, JavaScript rendering, meta tags, sitemap health, and page speed. Results are ready in under 30 seconds.",
                  },
                  {
                    q: "Is the scan free?",
                    a: "Yes, the initial scan is completely free. You get a full AI readiness score and detailed findings for any public website. No signup is required to start a scan.",
                  },
                  {
                    q: "Do I need to sign up?",
                    a: "No signup is needed to run a scan. We ask for your email only when you want to unlock the full detailed report and receive a copy.",
                  },
                  {
                    q: "What AI systems do you test for?",
                    a: "We evaluate your site against the technical requirements of major AI systems including ChatGPT (OpenAI), Claude (Anthropic), Perplexity, Google Gemini, and various AI-powered search engines.",
                  },
                  {
                    q: "Can I scan any website?",
                    a: "Yes, you can scan any public website. This includes your own site, competitor sites, or any URL you want to evaluate. We recommend scanning your own site first to identify improvement opportunities.",
                  },
                  {
                    q: "How long does a scan take?",
                    a: "Most scans complete in 20-30 seconds. The scan includes JavaScript rendering, page speed measurement, and multiple technical checks performed in parallel.",
                  },
                  {
                    q: "Will fixing issues guarantee AI visibility?",
                    a: "Fixing the issues identified by our scan significantly improves your chances of being discovered and understood by AI systems. However, we cannot guarantee specific outcomes as AI systems evolve and use different criteria.",
                  },
                ].map((faq) => (
                  <details key={faq.q} className="group rounded-lg border border-border bg-card overflow-hidden">
                    <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-sm font-semibold text-foreground list-none hover:bg-secondary/30 transition-colors">
                      {faq.q}
                      <svg className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                      </svg>
                    </summary>
                    <div className="px-5 pb-4">
                      <p className="text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </Container>
        </section>

        <UpgradeCta />
      </main>
      <SiteFooter />
    </div>
  );
}
