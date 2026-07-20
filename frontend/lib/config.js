/**
 * Shared runtime configuration.
 *
 * All environment variables are read here so the rest of the app
 * uses a single source of truth rather than scattering `process.env` calls.
 */

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
