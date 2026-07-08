import { Container } from "./container";
import { hasPaymentLink, STRIPE_PAYMENT_LINK } from "../lib/config";
import { track } from "../lib/analytics";

export function UpgradeCta() {
  const stripeHref = STRIPE_PAYMENT_LINK;

  function handleClick(action) {
    track("clicked_upgrade", {
      action,
      has_payment_link: hasPaymentLink,
      source: "landing_page_cta",
    });
  }

  return (
    <section id="pricing" className="py-24">
      <Container>
        <div className="rounded-2xl border border-border bg-card p-8 sm:p-10">
          {hasPaymentLink ? (
            /* Mode 1 — Stripe Payment Link is configured */
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                  Visum Pro
                </span>
                <h2 className="text-xl font-semibold text-balance text-foreground sm:text-2xl">
                  Fix every issue and become Agent-Ready
                </h2>
                <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
                  Get step-by-step remediation, continuous monitoring, and re-scans so AI agents
                  can find, read, and recommend your site.
                </p>
                <p className="text-xs text-muted-foreground/60">
                  $149/month &middot; Hosted MCP server + weekly AI monitoring
                </p>
              </div>

              <a
                href={stripeHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleClick("subscribe")}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Subscribe Now
                <svg className="size-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          ) : (
            /* Mode 2 — No payment link configured: fallback CTA */
            <div className="text-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                Visum Pro
              </span>
              <h2 className="mt-3 text-xl font-semibold text-balance text-foreground sm:text-2xl">
                Interested? We're Building Something Great
              </h2>
              <p className="mt-2 mx-auto max-w-md text-sm leading-relaxed text-muted-foreground">
                Visum Pro is in early access. Join the waitlist to get priority access, weekly
                monitoring updates, and the hosted MCP server when it launches.
              </p>
              <p className="mt-1 text-xs text-muted-foreground/60">
                $149/month &middot; Hosted MCP server + weekly AI monitoring
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <a
                  href="mailto:utsav@visum.io?subject=Visum Pro Interest"
                  onClick={() => handleClick("early_access")}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Get Early Access
                  <svg className="size-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="mailto:utsav@visum.io?subject=Visum Pro Waitlist"
                  onClick={() => handleClick("join_waitlist")}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
                >
                  Join Waitlist
                </a>
                <a
                  href="mailto:utsav@visum.io?subject=Visum Pro Inquiry"
                  onClick={() => handleClick("contact_sales")}
                  className="inline-flex shrink-0 items-center justify-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
                >
                  Contact Sales
                  <svg className="size-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
