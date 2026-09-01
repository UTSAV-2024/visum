/**
 * Start a Stripe Checkout session for a paid plan.
 *
 * This endpoint deliberately does *not* grant anything. It creates a session
 * and hands back its URL; the plan is provisioned only when Stripe tells us
 * the payment succeeded, in the webhook. That split is what stops a user from
 * getting a plan by replaying a request the payment never backed.
 *
 * The user's id rides along in `client_reference_id` (and metadata) so the
 * webhook can attribute the payment without trusting anything the browser says.
 */
import { getAuthedUser } from "../../../lib/supabase/auth";
import { getStripeClient } from "../../../lib/server/stripe";
import { PAID_TIERS, getPlan } from "../../../lib/plans";
import { SITE_URL, STRIPE_PRICE_IDS, isStripeEnabled } from "../../../lib/config";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const user = await getAuthedUser({ req, res });
  if (!user) {
    return res.status(401).json({ error: "Sign in first.", code: "unauthenticated" });
  }

  const { tier } = req.body || {};
  if (!PAID_TIERS.includes(tier)) {
    return res.status(400).json({ error: "Unknown plan." });
  }

  if (!isStripeEnabled) {
    return res.status(501).json({
      error:
        "Card payments aren't switched on yet. Get in touch and we'll set your plan up manually.",
      code: "payments_not_configured",
    });
  }

  const priceId = STRIPE_PRICE_IDS[tier];
  if (!priceId) {
    // Configured Stripe but no price for this tier — a setup gap, not a user
    // error. Say so plainly rather than starting a checkout we can't price.
    console.error(`[api/subscription/checkout] no Stripe price ID configured for tier "${tier}"`);
    return res.status(501).json({
      error: "That plan isn't available for purchase yet. Please get in touch.",
      code: "price_not_configured",
    });
  }

  const stripe = getStripeClient();
  if (!stripe) {
    return res.status(503).json({ error: "Payments are temporarily unavailable." });
  }

  const plan = getPlan(tier);

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      // How the webhook knows who to provision. client_reference_id survives
      // the whole session; metadata is duplicated onto the subscription so
      // later lifecycle events (renewal, cancellation) can be attributed too.
      client_reference_id: user.id,
      customer_email: user.email || undefined,
      metadata: { user_id: user.id, tier: plan.id },
      subscription_data: { metadata: { user_id: user.id, tier: plan.id } },
      success_url: `${SITE_URL}/dashboard?upgraded=${plan.id}`,
      cancel_url: `${SITE_URL}/pricing?checkout=cancelled`,
      allow_promotion_codes: true,
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("[api/subscription/checkout] failed:", err?.message || err);
    return res.status(502).json({ error: "Could not start checkout. Please try again." });
  }
}
