import Head from "next/head";
import Link from "next/link";
import { SiteHeader } from "../components/site-header";
import { SiteFooter } from "../components/site-footer";
import { Container } from "../components/container";

const milestones = [
  { year: "2024", event: "Visum founded to solve AI visibility for the modern web" },
  { year: "2025", event: "Launched 8-point AI readiness scan with real-time scoring" },
  { year: "2026", event: "Added MCP endpoint detection, llms.txt validation, and industry benchmarking" },
  { year: "Q3 2026", event: "Planned: Continuous monitoring, team dashboards, and API access" },
];

const values = [
  {
    title: "Transparency",
    desc: "Clear, honest assessments with no fluff. Every check is explained and actionable.",
    icon: "lightbulb",
  },
  {
    title: "Practicality",
    desc: "We focus on fixes you can actually implement. No academic theory — just working solutions.",
    icon: "wrench",
  },
  {
    title: "Independence",
    desc: "We are not affiliated with any AI platform. Our assessments are unbiased and data-driven.",
    icon: "shield",
  },
  {
    title: "Accessibility",
    desc: "AI readiness should not require a PhD. We make it understandable for everyone.",
    icon: "users",
  },
];

function ValueIcon({ type }) {
  const paths = {
    lightbulb: "M15 14s.5-1 1-2a6 6 0 1 0-12 0c.5 1 1 2 1 2",
    wrench: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z",
    shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    users: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75",
  };

  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={paths[type] || paths.lightbulb} />
    </svg>
  );
}

export default function About() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Head>
        <title>About — Visum AI Agent Readiness Scanner</title>
        <meta
          name="description"
          content="Learn about Visum — the AI agent readiness scanner that helps you understand how AI systems like ChatGPT, Claude, and Perplexity see your website."
        />
        <link rel="canonical" href="https://visum-eight.vercel.app/about" />
        <meta property="og:title" content="About — Visum AI Agent Readiness Scanner" />
        <meta
          property="og:description"
          content="Learn about Visum — the AI agent readiness scanner that helps you understand how AI systems see your website."
        />
        <meta name="twitter:title" content="About — Visum AI Agent Readiness Scanner" />
        <meta
          name="twitter:description"
          content="Learn about Visum — the AI agent readiness scanner."
        />
        <meta name="robots" content="index, follow" />
      </Head>

      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="py-24 bg-gradient-to-b from-background to-secondary/5">
          <Container>
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex self-center rounded-full bg-accent/10 px-3 py-1 text-xs text-accent mb-4">
                About Visum
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground text-balance leading-[1.1]">
                Making the Web{" "}
                <span className="text-accent">Understandable</span> by AI
              </h1>
              <p className="mt-6 text-base sm:text-lg leading-relaxed text-muted-foreground max-w-2xl mx-auto">
                Visum was built to solve a growing problem: AI agents are becoming the primary way people
                discover and interact with content, but most websites are not ready for them. We measure
                that readiness and help you fix it.
              </p>
            </div>
          </Container>
        </section>

        {/* What is Visum */}
        <section className="py-24 border-t border-border">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-6">
                What Is Visum?
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground mb-4">
                Visum is an AI agent readiness scanner. We analyze how AI systems — including ChatGPT,
                Claude, Perplexity, Gemini, and AI-powered search engines — can discover, access, and
                understand your website.
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground mb-4">
                Unlike traditional SEO tools that focus on human search behavior, Visum focuses on the
                technical signals that matter to AI agents: structured data, crawl permissions, JavaScript
                rendering, llms.txt files, MCP endpoints, page speed, metadata quality, and sitemap
                health.
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                When you scan a URL, we run 8 automated checks and generate a score out of 100, along
                with clear, prioritized recommendations for improvement.
              </p>
            </div>
          </Container>
        </section>

        {/* Why It Was Built */}
        <section className="py-24 bg-secondary/20 border-t border-border">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-6">
                Why We Built It
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground mb-4">
                In 2024, we noticed a fundamental shift in how people discover content. Instead of typing
                queries into Google, more users were asking ChatGPT, Claude, and Perplexity for
                recommendations. And those AI systems were making decisions based on whether a website was
                technically accessible — not just whether it had great content.
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground mb-4">
                Most website owners had no idea their site was invisible to AI agents. Traditional SEO
                tools did not measure this. We saw an opportunity to build the first dedicated tool for
                AI agent readiness — a tool that does not just tell you something is wrong, but explains
                why it matters and how to fix it.
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Visum was born from the belief that the open web should remain accessible to everyone —
                including autonomous AI agents.
              </p>
            </div>
          </Container>
        </section>

        {/* How It Works */}
        <section className="py-24 border-t border-border">
          <Container>
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-12">
                How It Works
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-left">
                {[
                  { step: "01", title: "Enter a URL", desc: "Sign in, then type in any public website URL — yours or a competitor's." },
                  { step: "02", title: "Automated Scan", desc: "We run 8 AI readiness checks in under 30 seconds, testing everything from robots.txt to page speed." },
                  { step: "03", title: "Actionable Report", desc: "Get a score, detailed findings, and prioritized fixes — written for real humans." },
                ].map((item) => (
                  <div key={item.step}>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent font-bold text-sm mb-4">
                      {item.step}
                    </div>
                    <h3 className="text-base font-semibold text-foreground mb-2">{item.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* Values */}
        <section className="py-24 bg-secondary/20 border-y border-border">
          <Container>
            <div className="mx-auto max-w-3xl">
              <div className="text-center mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  Our Values
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {values.map((value) => (
                  <div key={value.title} className="rounded-lg border border-border bg-card p-5 transition-colors hover:border-accent/50">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent mb-3">
                      <ValueIcon type={value.icon} />
                    </div>
                    <h3 className="text-sm font-semibold text-foreground mb-1">{value.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{value.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* Roadmap */}
        <section id="roadmap" className="py-24">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-8 text-center">
                Our Journey
              </h2>
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-5 top-0 bottom-0 w-px bg-border" aria-hidden="true" />
                <div className="space-y-8">
                  {milestones.map((item, i) => (
                    <div key={i} className="relative pl-12">
                      <div className="absolute left-3.5 top-1.5 h-3 w-3 rounded-full bg-accent ring-4 ring-background" aria-hidden="true" />
                      <span className="text-xs font-semibold text-accent uppercase tracking-wide">{item.year}</span>
                      <p className="text-sm text-muted-foreground mt-1">{item.event}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* CTA */}
        <section className="pb-24">
          <Container>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-bold tracking-tight text-foreground mb-4">
                Ready to Check Your AI Readiness?
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                It takes 30 seconds, and a free account comes with 3 scans.
              </p>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 no-underline"
              >
                Scan Your Website
                <svg className="size-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </Container>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
