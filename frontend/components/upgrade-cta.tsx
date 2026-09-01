import Link from "next/link";
import { Container } from "./container";
import { PLANS, PLAN_ORDER } from "../lib/plans";
import { track } from "../lib/analytics";

/**
 * Landing-page plan teaser.
 *
 * Deliberately thin: it states the three prices and their scan limits, and
 * sends people to /pricing for the detail. Prices come from the shared plan
 * catalogue so this can't drift out of step with what's actually sold.
 */
export function UpgradeCta() {
  return (
    <section id="pricing" className="border-t border-border py-20 sm:py-24">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-accent">
            Plans
          </span>
          <h2
            className="mt-3 font-bold tracking-[-0.02em] text-balance text-foreground"
            style={{ fontSize: "var(--text-h2)" }}
          >
            Three scans free. Then as many as you need.
          </h2>
          <p className="mx-auto mt-4 max-w-[52ch] text-base leading-relaxed text-muted-foreground">
            Fixing what a scan finds takes a few rounds. Paid plans give you the weekly
            allowance to check your work.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3">
          {PLAN_ORDER.map((id) => {
            const plan = PLANS[id];
            return (
              <div key={id} className="bg-card px-5 py-6 text-center">
                <p className="text-sm font-semibold text-foreground">{plan.name}</p>
                <p className="mt-2 text-2xl font-extrabold tracking-tight text-foreground">
                  {plan.priceLabel}
                  {plan.priceCents > 0 && (
                    <span className="ml-1 text-xs font-medium text-muted-foreground">/mo</span>
                  )}
                </p>
                <p className="mt-1.5 text-[13px] text-muted-foreground">
                  {plan.scanLimitLabel}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/pricing"
            onClick={() =>
              track("clicked_upgrade", { action: "view_pricing", source: "landing_page_cta" })
            }
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground no-underline transition-colors hover:bg-primary/90"
          >
            Compare plans
            <svg className="size-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
      </Container>
    </section>
  );
}
