/**
 * Shared runtime configuration.
 *
 * All environment variables are read here so the rest of the app
 * uses a single source of truth rather than scattering `process.env` calls.
 */

// ── Site identity ─────────────────────────────────────────────────
/**
 * The public origin of the deployed frontend. Canonical links, JSON-LD, OG
 * tags and the CSP all derive from this, so the domain is stated once rather
 * than repeated as a literal in every page head.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://visum-eight.vercel.app";

// ── Scan backend ──────────────────────────────────────────────────
/**
 * Resolves the scan backend URL from the env chain the app already uses,
 * falling back to `fallback` when none are set. Callers pass their own
 * fallback: server-only routes that may run against a local dev backend want
 * localhost, while the MCP endpoint and CSP want the real deployment.
 */
export function getBackendUrl(fallback) {
  return (
    process.env.VISUM_API_URL ||
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    fallback
  );
}

// ── Stripe ────────────────────────────────────────────────────────
export const STRIPE_PAYMENT_LINK =
  process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK || "";

/** True when a Stripe Payment Link has been configured */
export const hasPaymentLink = STRIPE_PAYMENT_LINK.length > 0;

/** Server-side only — never prefixed NEXT_PUBLIC_, so it stays out of the bundle. */
export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "";
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";

/**
 * Price IDs per paid tier. Set these once the products exist in Stripe; a tier
 * with no price ID simply can't be checked out, which is deliberate — better a
 * clear "not configured" than a checkout that charges the wrong amount.
 */
export const STRIPE_PRICE_IDS = {
  pro: process.env.STRIPE_PRICE_PRO || "",
  ultimate: process.env.STRIPE_PRICE_ULTIMATE || "",
};

/**
 * True when real card checkout can run. Both halves matter: the secret key
 * signs the session, and the webhook secret is what lets us trust the
 * completion callback. Without the webhook we could create a checkout we can
 * never safely fulfil, so checkout stays off until both are present.
 */
export const isStripeEnabled =
  STRIPE_SECRET_KEY.length > 0 && STRIPE_WEBHOOK_SECRET.length > 0;

// ── Supabase auth ─────────────────────────────────────────────────
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

/**
 * True only when both public Supabase credentials are present. When false the
 * app runs exactly as before (no auth) instead of crashing — auth activates the
 * moment the two NEXT_PUBLIC_SUPABASE_* env vars are set.
 */
export const isAuthEnabled = SUPABASE_URL.length > 0 && SUPABASE_ANON_KEY.length > 0;
