/**
 * Sanitise a post-login destination.
 *
 * `next` arrives from the query string, so it is attacker-controllable: an
 * absolute URL here would turn our own sign-in into an open redirect. Only
 * same-origin paths survive.
 */
export const DEFAULT_NEXT = "/dashboard";

/** Where the "Run a scan" flow returns to — the scan form on the homepage. */
export const SCAN_NEXT = "/#scan";

export function safeNext(next, fallback = DEFAULT_NEXT) {
  if (typeof next !== "string" || next.length === 0) return fallback;
  // Must be a rooted path. "//evil.com" and "/\evil.com" are protocol-relative
  // URLs that browsers happily follow off-site.
  if (!next.startsWith("/")) return fallback;
  if (next.startsWith("//") || next.startsWith("/\\")) return fallback;
  return next;
}
