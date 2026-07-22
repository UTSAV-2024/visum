// Resolve the signed-in user from request cookies.
//
// getUser() validates the JWT against the Supabase auth server, so the result
// is trustworthy in a way that a decoded-but-unverified token or a user id in
// a request body never is. Every server-side check goes through here.
import { getSupabaseServerClient } from "./server";

/**
 * @returns {Promise<import('@supabase/supabase-js').User | null>}
 */
export async function getAuthedUser({ req, res }) {
  try {
    const client = getSupabaseServerClient({ req, res });
    if (!client) return null;
    const { data, error } = await client.auth.getUser();
    if (error) return null;
    return data?.user ?? null;
  } catch {
    return null;
  }
}
