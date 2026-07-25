/**
 * Turn Supabase auth errors into something a person can act on.
 *
 * The client returns network failures as an ordinary error object, so passing
 * `error.message` straight to the UI is how a blocked request surfaced to users
 * as a bare "Failed to fetch" — which reads like the site is broken and gives
 * them nothing to do about it.
 *
 * Note on wrong-password vs no-account: Supabase answers both with "Invalid
 * login credentials" on purpose, so an attacker can't discover which addresses
 * are registered. We can't truthfully say "no account exists", so the copy
 * covers both cases and offers sign-up as the next step.
 */

/** The sign-in failure that should offer account creation. */
export const CREDENTIALS_REJECTED = "credentials_rejected";

const NETWORK_HINTS = ["failed to fetch", "networkerror", "load failed", "fetch failed"];

function isNetworkError(message) {
  const m = message.toLowerCase();
  return NETWORK_HINTS.some((hint) => m.includes(hint));
}

/**
 * @returns {{ message: string, code?: string }}
 */
export function describeAuthError(error, { context = "signin" } = {}) {
  const raw = (error?.message || "").trim();
  const lower = raw.toLowerCase();

  if (!raw) {
    return { message: "Something went wrong. Please try again." };
  }

  if (isNetworkError(raw)) {
    return {
      message:
        "We couldn't reach the sign-in service. Check your connection and try again — if it keeps happening, it's on our side.",
    };
  }

  if (lower.includes("invalid login credentials")) {
    return {
      message: "That email and password don't match an account.",
      code: CREDENTIALS_REJECTED,
    };
  }

  if (lower.includes("email not confirmed")) {
    return {
      message: "Confirm your email first — check your inbox for the link we sent.",
    };
  }

  if (lower.includes("already registered") || lower.includes("already been registered")) {
    return { message: "That email already has an account. Try signing in instead." };
  }

  if (lower.includes("rate limit") || lower.includes("too many")) {
    return { message: "Too many attempts. Wait a minute and try again." };
  }

  if (lower.includes("password") && lower.includes("should be")) {
    // Supabase's own length/strength wording is already clear.
    return { message: raw };
  }

  // Unrecognised: show it, but framed so it doesn't read as a dead end.
  return {
    message:
      context === "signup"
        ? `Could not create your account. ${raw}`
        : `Could not sign you in. ${raw}`,
  };
}
