/**
 * Account state — the profile, plan and quota behind every signed-in user.
 *
 * Server-only: everything here runs with the service-role key. The browser
 * receives the *result* of these reads through /api/account, never the ability
 * to write them, which is what stops quota from being edited client-side.
 */
import { getSupabaseAdminClient } from "../supabase/admin";
import { getPlan, DEFAULT_TIER } from "../plans";

/**
 * Make sure the user has the three rows every account needs.
 *
 * The database trigger creates these at sign-up; this is the safety net for
 * accounts that predate the trigger, so a returning user never hits a page
 * that assumes a plan row exists.
 */
export async function ensureAccountRows(admin, user) {
  if (!admin || !user?.id) return;

  const meta = user.user_metadata || {};
  await Promise.all([
    admin.from("profiles").upsert(
      {
        id: user.id,
        email: user.email ?? null,
        full_name: meta.full_name || meta.name || null,
        avatar_url: meta.avatar_url || meta.picture || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id", ignoreDuplicates: true }
    ),
    admin
      .from("subscriptions")
      .upsert({ user_id: user.id }, { onConflict: "user_id", ignoreDuplicates: true }),
    admin
      .from("usage")
      .upsert({ user_id: user.id }, { onConflict: "user_id", ignoreDuplicates: true }),
  ]);
}

/**
 * Everything the UI needs to render a real account: who you are, what plan
 * you're on, and how much of it you've used.
 *
 * Storage is summed from the scans themselves (via the storage_usage view)
 * rather than kept in a counter, so it can't drift away from reality.
 */
export async function loadAccountSummary(user) {
  const admin = getSupabaseAdminClient();
  if (!admin || !user?.id) return null;

  await ensureAccountRows(admin, user);

  // Who backs this account's quota, and which team (if any) it belongs to.
  // Solo → the user themselves, no org. Member → the team owner's pool.
  const { data: billingRows } = await admin.rpc("resolve_billing", { p_user_id: user.id });
  const billing = billingRows?.[0] || { billing_user_id: user.id, org_id: null };
  const billingUserId = billing.billing_user_id || user.id;
  const orgId = billing.org_id || null;

  // Subscription and usage come from the billing owner (the shared pool);
  // the profile is always the user's own. Storage is the whole team's when
  // there's a team, otherwise just this user's.
  const [subRes, usageRes, profileRes, storageRes] = await Promise.all([
    admin.from("subscriptions").select("*").eq("user_id", billingUserId).maybeSingle(),
    admin.from("usage").select("*").eq("user_id", billingUserId).maybeSingle(),
    admin.from("profiles").select("*").eq("id", user.id).maybeSingle(),
    orgId
      ? admin.from("scans").select("storage_bytes").eq("org_id", orgId)
      : admin
          .from("storage_usage")
          .select("storage_used_bytes, scan_count")
          .eq("user_id", user.id)
          .maybeSingle(),
  ]);

  const sub = subRes.data;
  const usage = usageRes.data;
  const profile = profileRes.data;
  // Team storage is summed across the org's scans; solo comes from the view.
  const storage = orgId
    ? {
        storage_used_bytes: (storageRes.data || []).reduce(
          (s, r) => s + Number(r.storage_bytes || 0),
          0
        ),
        scan_count: (storageRes.data || []).length,
      }
    : storageRes.data;

  const tier = sub?.tier || DEFAULT_TIER;
  const plan = getPlan(tier);

  // A lapsed paid plan falls back to the Free allowance — the same rule the
  // consume_scan_quota function applies, kept in step so the meter never
  // promises scans the database will refuse.
  const active = (sub?.status || "active") === "active";
  const scanLimit = active ? sub?.scan_limit ?? plan.scanLimit : getPlan("free").scanLimit;
  const storageLimitBytes = active
    ? Number(sub?.storage_limit_bytes ?? plan.storageBytes)
    : getPlan("free").storageBytes;

  const scansUsed = usage?.scans_used ?? 0;
  const storageUsedBytes = Number(storage?.storage_used_bytes ?? 0);

  const meta = user.user_metadata || {};

  return {
    profile: {
      id: user.id,
      email: profile?.email || user.email || "",
      fullName: profile?.full_name || meta.full_name || meta.name || "",
      avatarUrl: profile?.avatar_url || meta.avatar_url || meta.picture || "",
    },
    subscription: {
      tier,
      planName: plan.name,
      status: sub?.status || "active",
      scanLimit,
      storageLimitBytes,
      periodDays: sub?.period_days ?? plan.periodDays,
      renewalDate: sub?.renewal_date ?? null,
      periodStart: sub?.period_start ?? null,
    },
    usage: {
      scansUsed,
      scansRemaining: Math.max(scanLimit - scansUsed, 0),
      storageUsedBytes,
      storageRemainingBytes: Math.max(storageLimitBytes - storageUsedBytes, 0),
      scanCount: storage?.scan_count ?? 0,
    },
    // Present when the account is part of a team, so the UI can note that the
    // quota shown is a shared pool.
    team: orgId ? { orgId, shared: true } : null,
  };
}

/**
 * Who pays for a user's scans, and which org the scan belongs to.
 * Solo → (self, null). Team member → (owner, org). Used by the scan endpoints.
 */
export async function resolveBilling(admin, userId) {
  const { data, error } = await admin.rpc("resolve_billing", { p_user_id: userId });
  if (error || !data?.[0]) return { billingUserId: userId, orgId: null };
  return { billingUserId: data[0].billing_user_id || userId, orgId: data[0].org_id || null };
}

/**
 * Move a user onto a plan and provision its quota in one write.
 *
 * Called after a successful purchase. Limits come from the plan catalogue, so
 * what was advertised is exactly what gets provisioned, and the renewal date
 * is what the weekly reset in consume_scan_quota counts from.
 */
export async function applyPlan(userId, tier, { provider = null, providerCustomerId = null, providerSubscriptionId = null, status = "active" } = {}) {
  const admin = getSupabaseAdminClient();
  if (!admin) throw new Error("Storage is not configured");

  const plan = getPlan(tier);
  const now = new Date();
  const renewal = plan.periodDays
    ? new Date(now.getTime() + plan.periodDays * 86400_000).toISOString()
    : null;

  const { error: subError } = await admin.from("subscriptions").upsert(
    {
      user_id: userId,
      tier: plan.id,
      status,
      scan_limit: plan.scanLimit,
      storage_limit_bytes: plan.storageBytes,
      period_days: plan.periodDays,
      period_start: now.toISOString(),
      renewal_date: renewal,
      provider,
      provider_customer_id: providerCustomerId,
      provider_subscription_id: providerSubscriptionId,
      updated_at: now.toISOString(),
    },
    { onConflict: "user_id" }
  );
  if (subError) throw new Error(subError.message);

  // A new plan starts a fresh window: the scans you just paid for are all
  // available immediately, not reduced by what you used on the old plan.
  const { error: usageError } = await admin.from("usage").upsert(
    {
      user_id: userId,
      scans_used: 0,
      period_start: now.toISOString(),
      updated_at: now.toISOString(),
    },
    { onConflict: "user_id" }
  );
  if (usageError) throw new Error(usageError.message);

  return { tier: plan.id, renewalDate: renewal, scanLimit: plan.scanLimit };
}
