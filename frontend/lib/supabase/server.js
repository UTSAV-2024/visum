// Server-side Supabase client for the Pages Router (getServerSideProps and API
// routes). Reads/writes the auth session from the request/response cookies.
//
// Returns null when auth is not configured so callers can degrade gracefully.
import { createServerClient, serializeCookieHeader } from "@supabase/ssr";
import { SUPABASE_URL, SUPABASE_ANON_KEY, isAuthEnabled } from "../config";

/**
 * @param {import('next').GetServerSidePropsContext | { req: any, res: any }} ctx
 */
export function getSupabaseServerClient({ req, res }) {
  if (!isAuthEnabled) return null;

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return Object.entries(req.cookies || {}).map(([name, value]) => ({
          name,
          value,
        }));
      },
      setAll(cookiesToSet) {
        res.setHeader(
          "Set-Cookie",
          cookiesToSet.map(({ name, value, options }) =>
            serializeCookieHeader(name, value, options)
          )
        );
      },
    },
  });
}
