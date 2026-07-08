import { hasPaymentLink, STRIPE_PAYMENT_LINK } from "../lib/config";
import { track } from "../lib/analytics";

export default function UpgradePrompt({ cta }) {
  const stripeHref = STRIPE_PAYMENT_LINK;

  function handleClick(action) {
    track("clicked_upgrade", {
      action,
      has_payment_link: hasPaymentLink,
      cta,
    });
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6 sm:p-8 mb-6 text-center">
      {hasPaymentLink ? (
        /* Mode 1 — Stripe Payment Link is configured */
        <>
          <p className="text-base sm:text-lg text-foreground font-semibold mb-2 leading-snug">
            {cta}
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground mb-4">
            Visum Pro &middot; $149/month &middot; Hosted MCP server + weekly AI monitoring
          </p>
          <a
            href={stripeHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleClick("subscribe")}
            className="inline-block bg-primary text-primary-foreground font-semibold text-sm px-7 py-2.5 rounded-lg hover:bg-primary/90 transition-colors no-underline"
          >
            Subscribe Now
          </a>
        </>
      ) : (
        /* Mode 2 — No payment link configured: fallback CTA */
        <>
          <p className="text-base sm:text-lg text-foreground font-semibold mb-2 leading-snug">
            Interested? Visum Pro is in early access.
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground mb-4">
            {cta}
          </p>
          <p className="text-xs text-muted-foreground/60 mb-4">
            $149/month &middot; Hosted MCP server + weekly AI monitoring
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="mailto:utsav@visum.io?subject=Visum Pro Interest"
              onClick={() => handleClick("early_access")}
              className="inline-block bg-primary text-primary-foreground font-semibold text-sm px-7 py-2.5 rounded-lg hover:bg-primary/90 transition-colors no-underline"
            >
              Get Early Access
            </a>
            <a
              href="mailto:utsav@visum.io?subject=Visum Pro Waitlist"
              onClick={() => handleClick("join_waitlist")}
              className="inline-block border border-border bg-card text-foreground font-semibold text-sm px-7 py-2.5 rounded-lg hover:bg-secondary transition-colors no-underline"
            >
              Join Waitlist
            </a>
            <a
              href="mailto:utsav@visum.io?subject=Visum Pro Inquiry"
              onClick={() => handleClick("contact_sales")}
              className="inline-block text-muted-foreground font-semibold text-sm hover:text-foreground transition-colors no-underline"
            >
              Contact Sales &rarr;
            </a>
          </div>
        </>
      )}
    </div>
  );
}
