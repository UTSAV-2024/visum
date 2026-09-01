/**
 * Stripe client — server-only.
 *
 * Constructed lazily so the app boots fine without Stripe configured: every
 * caller checks `isStripeEnabled` first and degrades to the manual-grant path
 * rather than throwing at import time.
 */
import Stripe from "stripe";
import { STRIPE_SECRET_KEY } from "../config";

let client = null;

export function getStripeClient() {
  if (!STRIPE_SECRET_KEY) return null;
  if (!client) {
    client = new Stripe(STRIPE_SECRET_KEY, {
      // Pinned rather than floating: an account-level API version change should
      // never silently alter the shape of the webhook payloads we parse.
      // Must match the version this SDK generates against — see
      // node_modules/stripe/cjs/apiVersion.js when upgrading the package.
      apiVersion: "2026-06-24.dahlia",
    });
  }
  return client;
}
