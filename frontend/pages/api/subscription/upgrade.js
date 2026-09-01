/**
 * Activate a paid plan for the signed-in user.
 *
 * This is the seam a payment provider plugs into. It does the whole
 * provisioning job — tier, scan limit, storage allowance, renewal date,
 * billing status, and a payments record — but it will not hand out a plan it
 * cannot attribute to a payment.
 *
 * Until a provider is wired up, activation is refused unless
 * ALLOW_UNVERIFIED_UPGRADES is explicitly set (for manual grants and local
 * testing). A Stripe webhook would call `applyPlan` the same way, keyed on the
 * checkout session instead of that flag.
 */
import { getAuthedUser } from "../../../lib/supabase/auth";
import { getSupabaseAdminClient } from "../../../lib/supabase/admin";
import { applyPlan, loadAccountSummary } from "../../../lib/server/account";
import { PAID_TIERS, getPlan } from "../../../lib/plans";

const ALLOW_UNVERIFIED_UPGRADES = process.env.ALLOW_UNVERIFIED_UPGRADES === "true";

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

  if (!ALLOW_UNVERIFIED_UPGRADES) {
    return res.status(501).json({
      error:
        "Card payments aren't switched on yet. Get in touch and we'll set your plan up manually.",
      code: "payments_not_configured",
    });
  }

  const plan = getPlan(tier);

  try {
    const result = await applyPlan(user.id, tier, {
      provider: "manual",
      status: "active",
    });

    // Record what the plan change was worth, so revenue has a ledger from day
    // one rather than being reconstructed later.
    const admin = getSupabaseAdminClient();
    const { error: paymentError } = await admin.from("payments").insert({
      user_id: user.id,
      tier: plan.id,
      amount_cents: plan.priceCents,
      currency: "usd",
      status: "succeeded",
      provider: "manual",
    });
    if (paymentError) {
      console.error("[api/subscription/upgrade] payment record failed:", paymentError.message);
    }

    const account = await loadAccountSummary(user).catch(() => null);
    return res.status(200).json({ ok: true, ...result, account });
  } catch (err) {
    console.error("[api/subscription/upgrade] failed:", err?.message || err);
    return res.status(500).json({ error: "Could not update your plan. Please try again." });
  }
}
