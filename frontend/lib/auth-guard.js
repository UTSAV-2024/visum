/**
 * Server-side route protection.
 *
 * This is the real gate. The client-side RouteGuard and the proxy cookie check
 * only smooth over the UI; they can both be bypassed by typing a URL. A page
 * that wraps its getServerSideProps in `withAuthRequired` never reaches an
 * unauthenticated browser at all, because the session is verified against the
 * Supabase auth server before any props are produced.
 */
import { getSupabaseServerClient } from "./supabase/server";
import { isAuthEnabled } from "./config";
import { loadAccountSummary } from "./server/account";

/**
 * Verify the session for a getServerSideProps context.
 *
 * @returns {Promise<{user: object|null, redirect: object|null, supabase: object|null}>}
 */
export async function requireUser(ctx) {
  // Auth not configured — the deployment has no way to sign anyone in, so the
  // app behaves as it did before auth existed rather than locking everyone out.
  if (!isAuthEnabled) return { user: null, redirect: null, supabase: null };

  const supabase = getSupabaseServerClient(ctx);
  const { data, error } = await supabase.auth.getUser();
  const user = error ? null : data?.user ?? null;

  if (!user) {
    const destination = ctx.resolvedUrl || "/dashboard";
    return {
      user: null,
      supabase: null,
      redirect: {
        destination: `/login?next=${encodeURIComponent(destination)}`,
        permanent: false,
      },
    };
  }

  return { user, redirect: null, supabase };
}

/**
 * Build a getServerSideProps that requires a signed-in user.
 *
 * @param {(ctx: object, session: {user: object, supabase: object}) => Promise<object>} [getProps]
 *   Optional loader for page-specific props, run only once the user is known.
 */
export function withAuthRequired(getProps) {
  return async function getServerSideProps(ctx) {
    const { user, redirect, supabase } = await requireUser(ctx);
    if (redirect) return { redirect };

    // Ship the account with the page so the sidebar shows the right name, plan
    // and usage on first paint instead of after a client round-trip.
    const account = user ? await loadAccountSummary(user).catch(() => null) : null;

    const baseProps = {
      authEnabled: isAuthEnabled,
      userEmail: user?.email ?? null,
      account,
    };

    if (!getProps) return { props: baseProps };

    const result = await getProps(ctx, { user, supabase });
    // Pass through redirects/notFound a loader may return.
    if (result && (result.redirect || result.notFound)) return result;

    return { props: { ...baseProps, ...(result?.props ?? {}) } };
  };
}
