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
