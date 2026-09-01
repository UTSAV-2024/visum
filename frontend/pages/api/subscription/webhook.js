/**
 * Stripe webhook — the only thing that may grant a paid plan.
 *
 * Everything here hangs off the signature check: an unsigned or badly-signed
 * request is rejected before a single field is read, because the body is
 * otherwise entirely attacker-controlled and a forged
 * `checkout.session.completed` would hand out plans for free.
 *
 * Handled events:
 *   checkout.session.completed        → provision the plan
 *   customer.subscription.deleted     → drop back to Free
 *   customer.subscription.updated     → follow Stripe's status (past_due, etc.)
 *
 * Anything else is acknowledged and ignored: returning a non-2xx makes Stripe
 * retry an event we were never going to act on.
 */
import { getStripeClient } from "../../../lib/server/stripe";
import { getSupabaseAdminClient } from "../../../lib/supabase/admin";
import { applyPlan } from "../../../lib/server/account";
import { getPlan, PAID_TIERS, DEFAULT_TIER } from "../../../lib/plans";
import { STRIPE_WEBHOOK_SECRET, isStripeEnabled } from "../../../lib/config";

// Stripe signs the raw bytes. Next's JSON parser would reserialize the body and
// change them, so the signature would never verify — the parser must be off.
export const config = { api: { bodyParser: false } };

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

/** Resolve which user an event belongs to, preferring the most specific source. */
function userIdFrom(object) {
  return (
    object?.client_reference_id ||
    object?.metadata?.user_id ||
    null
  );
}

async function recordPayment(admin, { userId, tier, amountCents, currency, providerPaymentId }) {
  const { error } = await admin.from("payments").insert({
    user_id: userId,
    tier,
    amount_cents: amountCents,
    currency: currency || "usd",
    status: "succeeded",
    provider: "stripe",
    provider_payment_id: providerPaymentId ?? null,
  });
  // A missing ledger row must not fail the webhook — Stripe would retry and
  // re-provision a plan the user already has. Log it and move on.
  if (error) console.error("[webhook] payment record failed:", error.message);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!isStripeEnabled) {
    return res.status(501).json({ error: "Payments are not configured." });
  }

  const stripe = getStripeClient();
  const signature = req.headers["stripe-signature"];
  if (!stripe || !signature) {
    return res.status(400).json({ error: "Missing signature." });
  }

  let event;
  try {
    const raw = await readRawBody(req);
    event = stripe.webhooks.constructEvent(raw, signature, STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    // Includes replayed events outside Stripe's tolerance window.
    console.error("[webhook] signature verification failed:", err?.message || err);
    return res.status(400).json({ error: "Invalid signature." });
  }

  const admin = getSupabaseAdminClient();
  if (!admin) {
    // 503 so Stripe retries — the event is valid, we just can't act on it yet.
    console.error("[webhook] storage unavailable, asking Stripe to retry");
    return res.status(503).json({ error: "Storage unavailable." });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;

        // Only fulfil once the money is actually there. Async payment methods
        // complete the session first and pay later.
        if (session.payment_status !== "paid") {
          console.warn(
            `[webhook] session ${session.id} completed but payment_status=${session.payment_status}; not provisioning`
          );
          break;
        }

        const userId = userIdFrom(session);
        const tier = session.metadata?.tier;
        if (!userId || !PAID_TIERS.includes(tier)) {
          console.error(
            `[webhook] session ${session.id} has no usable user_id/tier (user=${userId}, tier=${tier})`
          );
          break;
        }

        // Stripe delivers at least once, so the same session can arrive twice.
        // Re-running applyPlan would reset scans_used to 0 — handing out a
        // fresh allowance for free — and double-count the payment. The ledger
        // row is the record of "already fulfilled", so check it first.
        const { data: seen, error: seenError } = await admin
          .from("payments")
          .select("id")
          .eq("provider", "stripe")
          .eq("provider_payment_id", session.id)
          .maybeSingle();
        if (seenError) {
          // Can't prove it's new — ask Stripe to retry rather than risk
          // provisioning twice.
          console.error("[webhook] idempotency check failed:", seenError.message);
          return res.status(503).json({ error: "Could not verify event." });
        }
        if (seen) {
          console.log(`[webhook] session ${session.id} already fulfilled; ignoring replay`);
          break;
        }

        await applyPlan(userId, tier, {
          provider: "stripe",
          providerCustomerId: session.customer ?? null,
          providerSubscriptionId: session.subscription ?? null,
          status: "active",
        });

        const plan = getPlan(tier);
        await recordPayment(admin, {
          userId,
          tier: plan.id,
          amountCents: session.amount_total ?? plan.priceCents,
          currency: session.currency,
          providerPaymentId: session.id,
        });
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object;
        const userId = userIdFrom(sub);
        if (!userId) {
          console.error(`[webhook] subscription ${sub.id} deleted with no user_id in metadata`);
          break;
        }
        // Back to Free rather than leaving a paid row marked inactive, so the
        // quota the database enforces matches what the user actually has.
        await applyPlan(userId, DEFAULT_TIER, { provider: "stripe", status: "active" });
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object;
        const userId = userIdFrom(sub);
        const tier = sub.metadata?.tier;
        if (!userId || !PAID_TIERS.includes(tier)) break;

        // Stripe's status is the source of truth for whether the plan is good
        // to use; loadAccountSummary already falls back to the Free allowance
        // for anything that isn't "active".
        const { error } = await admin
          .from("subscriptions")
          .update({ status: sub.status, updated_at: new Date().toISOString() })
          .eq("user_id", userId);
        if (error) console.error("[webhook] status update failed:", error.message);
        break;
      }

      default:
        // Acknowledged, intentionally unhandled.
        break;
    }
  } catch (err) {
    // 500 tells Stripe to retry, which is what we want for a transient failure
    // mid-provisioning.
    console.error(`[webhook] handling ${event.type} failed:`, err?.message || err);
    return res.status(500).json({ error: "Handler failed." });
  }

  return res.status(200).json({ received: true });
}
