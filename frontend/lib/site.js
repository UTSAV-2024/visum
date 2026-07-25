/**
 * Single source of truth for URLs the frontend needs to know about itself.
 *
 * Previously the production domain was a literal string repeated ~20 times
 * across _document.js, canonical links, JSON-LD, OG tags and the CSP header —
 * a domain change meant hunting down every occurrence. Now it's one env-backed
 * constant with the current production domain as the fallback.
 */

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://visum-eight.vercel.app";

/**
 * Resolves the scan backend URL from the env var chain the codebase already
 * uses (VISUM_API_URL, then API_URL, then NEXT_PUBLIC_API_URL), falling back
 * to `fallback` when none are set. Callers pass their own fallback because
 * server-only routes should fail safe to the real backend while anything
 * that could run against a local dev backend should default to localhost.
 */
export function getBackendUrl(fallback) {
  return (
    process.env.VISUM_API_URL ||
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    fallback
  );
}
