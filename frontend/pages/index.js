import { useRouter } from "next/router";
import { SiteHeader } from "../components/site-header";
import { Hero } from "../components/hero";
import { StatsStrip } from "../components/stats-strip";
import { ChecksSection } from "../components/checks-section";
import { UpgradeCta } from "../components/upgrade-cta";
import { SiteFooter } from "../components/site-footer";
import { Container } from "../components/container";

export default function Home() {
  const router = useRouter();

  function handleScanStart() {
    // Optional pre-scan logic
  }

  function handleScanEnd(data) {
    router.push("/result");
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
        <ChecksSection />
        <UpgradeCta />
      </main>
      <SiteFooter />
    </div>
  );
}
