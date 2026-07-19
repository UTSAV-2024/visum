import { useEffect } from "react";
import { useRouter } from "next/router";
import { SiteHeader } from "../components/site-header";
import { Hero } from "../components/hero";
import { track } from "../lib/posthog";
import { UpgradeCta } from "../components/upgrade-cta";
import { SiteFooter } from "../components/site-footer";
import { Container } from "../components/container";
import { Reveal, Stagger, StaggerItem } from "../components/motion";

const steps = [
  {
    n: "1",
    title: "Paste your address",
    desc: "Any public site — Shopify, WordPress, Webflow, or custom. No account, no email.",
  },
  {
    n: "2",
    title: "We read it like a machine",
    desc: "Eight checks against the signals AI systems actually parse: robots.txt, JSON-LD, metadata, sitemap, rendering, speed, llms.txt, MCP.",
  },
  {
    n: "3",
    title: "You get the diagnosis",
    desc: "A 0–100 score, what passed, what failed, and the exact fix for each finding — with the raw evidence attached.",
  },
];

const checks = [
  {
    name: "robots.txt",
    label: "AI crawl permissions",
    desc: "Whether GPTBot, ClaudeBot, PerplexityBot, and Google-Extended are allowed to read your content at all.",
  },
  {
    name: "json-ld",
    label: "Structured data",
    desc: "Valid schema markup that tells machines what your products, articles, and organization actually are.",
  },
  {
    name: "render",
    label: "JavaScript-free content",
    desc: "Whether your content exists in the raw HTML — or only appears after JavaScript that many crawlers never run.",
  },
  {
    name: "meta/og",
    label: "Meta tags & Open Graph",
    desc: "The titles and descriptions AI systems quote when they cite your site in an answer.",
  },
  {
    name: "sitemap",
    label: "Sitemap health",
    desc: "A current sitemap.xml with lastmod dates, so crawlers find every page and know what's fresh.",
  },
  {
    name: "speed",
    label: "Timeout risk",
    desc: "Load time measured against the 5–10 second budget AI agents give a page before abandoning it.",
  },
  {
    name: "llms.txt",
    label: "LLM guidance",
    desc: "The plain-text map that tells AI assistants where your docs and key pages live.",
  },
  {
    name: "mcp",
    label: "Agent endpoint",
    desc: "Whether agents can query your data directly instead of scraping — the frontier, where almost every site still fails.",
  },
];

const faqs = [
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
    q: "Will fixing issues guarantee AI visibility?",
    a: "Fixing the issues identified by our scan significantly improves your chances of being discovered and understood by AI systems. However, we cannot guarantee specific outcomes as AI systems evolve and use different criteria.",
  },
];

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    track("landing_viewed", {
      path: window.location.pathname,
      referrer: document.referrer || "direct",
    });
  }, []);

  function handleScanStart() {
    // Optional pre-scan logic
  }

  function handleScanEnd(data) {
    router.push("/result");
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />
      <main className="flex-1">
        <Hero onScanStart={handleScanStart} onScanEnd={handleScanEnd} />

        {/* ── How the scan works: a real sequence, numbered because it is one ── */}
        <section id="how-it-works" className="border-t border-border py-20 sm:py-28">
          <Container>
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-[2fr_3fr] lg:gap-20">
              <Reveal>
                <h2
                  className="font-bold tracking-[-0.02em] text-foreground"
                  style={{ fontSize: "var(--text-h2)" }}
                >
                  Twenty seconds from URL to diagnosis
                </h2>
                <p className="mt-4 max-w-[48ch] text-base leading-relaxed text-muted-foreground">
                  No crawl queue, no report by email three days later. The scan runs while
                  you watch.
                </p>
              </Reveal>
              <Stagger className="flex flex-col" gap={0.12}>
                {steps.map((step, i) => (
                  <StaggerItem
                    key={step.n}
                    className={`flex gap-5 py-6 ${i > 0 ? "border-t border-border" : ""}`}
                  >
                    <span className="font-mono text-sm leading-7 text-primary">
                      {step.n} /
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
                      <p className="mt-1.5 max-w-[58ch] text-[15px] leading-relaxed text-muted-foreground">
                        {step.desc}
                      </p>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          </Container>
        </section>

        {/* ── The 8 checks: a diagnostic ledger, not a card grid ── */}
        <section id="checks" className="border-t border-border bg-card/40 py-20 sm:py-28">
          <Container>
            <Reveal className="max-w-2xl">
              <h2
                className="font-bold tracking-[-0.02em] text-foreground"
                style={{ fontSize: "var(--text-h2)" }}
              >
                The eight signals machines check before they trust you
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                Every check maps to a documented technical factor in how AI systems find,
                parse, and cite web content. No vibes — each result comes with the raw
                evidence we found.
              </p>
            </Reveal>

            <Stagger className="mt-12 grid grid-cols-1 md:grid-cols-2" gap={0.05}>
              {checks.map((check, i) => (
                <StaggerItem
                  key={check.name}
                  y={14}
                  className={`group flex gap-5 border-t border-border py-6 ${
                    i % 2 === 0 ? "md:pr-10" : "md:pl-10"
                  }`}
                >
                  <span className="w-24 shrink-0 pt-0.5 font-mono text-[13px] text-primary transition-colors group-hover:text-brand-200">
                    {check.name}
                  </span>
                  <div>
                    <h3 className="text-[15px] font-semibold text-foreground">{check.label}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {check.desc}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </Container>
        </section>

        {/* ── Positioning: rankings vs readability ── */}
        <section className="border-t border-border py-20 sm:py-28">
          <Container>
            <div className="mx-auto max-w-3xl">
              <Reveal>
                <h2
                  className="font-bold tracking-[-0.02em] text-foreground"
                  style={{ fontSize: "var(--text-h2)" }}
                >
                  SEO tools measure rankings.
                  <br />
                  <span className="text-primary">Visum measures readability.</span>
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <div className="mt-8 space-y-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
                  <p>
                    People increasingly ask ChatGPT and Perplexity instead of searching Google.
                    Those assistants don&apos;t browse your site the way a person does — they
                    parse your robots.txt, your JSON-LD, your raw HTML. If those are broken,
                    you aren&apos;t ranked lower. You&apos;re invisible.
                  </p>
                  <p>
                    Keyword tools can&apos;t see this. Visum reads your site exactly the way a
                    crawler does and shows you the difference between what you published and
                    what a machine can actually understand — then tells you how to close the
                    gap, check by check.
                  </p>
                </div>
              </Reveal>
              <Reveal delay={0.18} className="mt-10">
                <a
                  href="#scan"
                  className="inline-flex items-center gap-2 rounded-xl border border-primary/40 px-6 py-3 text-[15px] font-semibold text-primary transition-colors hover:border-primary hover:bg-primary/10"
                >
                  See what AI sees on your site
                  <span aria-hidden="true">→</span>
                </a>
              </Reveal>
            </div>
          </Container>
        </section>

        {/* ── FAQ ── */}
        <section id="faq" className="border-t border-border py-20 sm:py-28">
          <Container>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 lg:grid-cols-[1fr_2fr]">
              <Reveal>
                <h2
                  className="font-bold tracking-[-0.02em] text-foreground"
                  style={{ fontSize: "var(--text-h2)" }}
                >
                  Questions, answered plainly
                </h2>
              </Reveal>
              <div>
                {faqs.map((faq, i) => (
                  <Reveal key={faq.q} delay={Math.min(i * 0.04, 0.2)} y={12}>
                    <details className={`group py-1 ${i > 0 ? "border-t border-border" : ""}`}>
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-[15px] font-semibold text-foreground transition-colors hover:text-primary">
                        {faq.q}
                        <span
                          aria-hidden="true"
                          className="shrink-0 font-mono text-primary transition-transform duration-300 group-open:rotate-45"
                        >
                          +
                        </span>
                      </summary>
                      <p className="max-w-[65ch] pb-5 text-sm leading-relaxed text-muted-foreground">
                        {faq.a}
                      </p>
                    </details>
                  </Reveal>
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
