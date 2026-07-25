import Head from "next/head";
import Link from "next/link";
import { SiteHeader } from "../components/site-header";
import { SiteFooter } from "../components/site-footer";
import { Container } from "../components/container";
import { Reveal } from "../components/motion";
import { PlansGrid } from "../components/pricing/plans-grid";

const faqs = [
  {
    q: "What counts as a scan?",
    a: "One complete run of all 8 checks against one URL. Failed scans don't count — if we can't reach a site, the scan is returned to your allowance.",
  },
  {
    q: "When do weekly scans reset?",
    a: "Paid plans run on a 7-day cycle that starts the moment you subscribe. Your allowance returns to full on each renewal date, whether or not you used it.",
  },
  {
    q: "What is storage used for?",
    a: "Every completed scan keeps its full report — each check, its finding, and the raw evidence — so you can reopen it later and compare scores over time. Storage is what those reports occupy.",
  },
  {
    q: "Do the 3 free scans reset?",
    a: "No. The Free plan's 3 scans are a lifetime allowance, meant for seeing what Visum finds on your site. Continuous monitoring is what the paid plans are for.",
  },
  {
    q: "Can I change plans later?",
    a: "Yes. Moving to a new plan starts a fresh weekly cycle immediately, with the new allowance available straight away.",
  },
];

export default function Pricing() {
  return (
    <>
      <Head>
        <title>Pricing — Visum</title>
        <meta
          name="description"
          content="Visum pricing: start free with 3 scans, or get 30 scans a week on Pro ($15) and 100 a week on Ultimate ($70). See how AI systems read your site."
        />
        <link rel="canonical" href="https://visum-eight.vercel.app/pricing" />
      </Head>

      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <SiteHeader />

        <main className="flex-1">
          <section className="border-b border-border py-16 sm:py-20">
            <Container>
              <Reveal className="mx-auto max-w-2xl text-center">
                <h1
                  className="font-bold tracking-[-0.02em] text-foreground"
                  style={{ fontSize: "var(--text-h1)" }}
                >
                  Start free. Scale when AI matters.
                </h1>
                <p className="mx-auto mt-4 max-w-[52ch] text-base leading-relaxed text-muted-foreground">
                  Every account gets 3 scans to see what machines can and can&apos;t read on
                  your site. Paid plans are for the sites you keep readable week after week.
                </p>
              </Reveal>
            </Container>
          </section>

          <section id="plans" className="py-16 sm:py-20">
            <Container>
              <PlansGrid />
              <p className="mt-8 text-center text-[13px] text-muted-foreground">
                All plans include every one of the 8 checks and the full evidence-backed
                report. No credit card needed to start.
              </p>
            </Container>
          </section>

          <section className="border-t border-border py-16 sm:py-20">
            <Container>
              <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 lg:grid-cols-[1fr_2fr]">
                <Reveal>
                  <h2
                    className="font-bold tracking-[-0.02em] text-foreground"
                    style={{ fontSize: "var(--text-h2)" }}
                  >
                    What you&apos;re paying for
                  </h2>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    Still unsure?{" "}
                    <Link href="/contact" className="text-primary hover:underline">
                      Ask us anything
                    </Link>
                    .
                  </p>
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
        </main>

        <SiteFooter />
      </div>
    </>
  );
}
