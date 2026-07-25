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

// ── Supabase auth ─────────────────────────────────────────────────
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

/**
 * True only when both public Supabase credentials are present. When false the
 * app runs exactly as before (no auth) instead of crashing — auth activates the
 * moment the two NEXT_PUBLIC_SUPABASE_* env vars are set.
 */
export const isAuthEnabled = SUPABASE_URL.length > 0 && SUPABASE_ANON_KEY.length > 0;
