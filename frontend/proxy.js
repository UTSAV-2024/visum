import { NextResponse } from "next/server";

// Optimistic auth guard (this version of Next.js calls middleware "proxy").
//
// Per the Next.js docs, proxy should be used for fast optimistic checks, not
// full session validation. So we only check for the *presence* of a Supabase
// auth cookie here (no network call); the real enforcement is the client-side
// RouteGuard plus server-side session checks. This just avoids briefly showing
// a protected page's shell to a signed-out visitor, and bounces signed-in
// users away from the auth pages.

const AUTH_ENABLED =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/analytics",
  "/insights",
  "/recommendations",
  "/competitors",
  "/reports",
  "/team",
];

const AUTH_PAGES = ["/login", "/signup"];

function hasSupabaseSession(request) {
  // Supabase stores the session in cookies named `sb-<ref>-auth-token`
  // (sometimes chunked with a `.0`/`.1` suffix).
  return request.cookies
    .getAll()
    .some((c) => /^sb-.*-auth-token(\.\d+)?$/.test(c.name) && c.value);
}

export function proxy(request) {
  if (!AUTH_ENABLED) return NextResponse.next();

  const { pathname } = request.nextUrl;
  const signedIn = hasSupabaseSession(request);

  const isProtected = PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
  if (isProtected && !signedIn) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = `?next=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(url);
  }

  if (AUTH_PAGES.includes(pathname) && signedIn) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Run on the app pages and auth pages; skip static assets and API routes.
  matcher: [
    "/dashboard/:path*",
    "/analytics/:path*",
    "/insights/:path*",
    "/recommendations/:path*",
    "/competitors/:path*",
    "/reports/:path*",
    "/team/:path*",
    "/login",
    "/signup",
  ],
};
