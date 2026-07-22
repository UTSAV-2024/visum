"use client";

import Link from "next/link";
import { useRouter } from "next/router";
import { Logo } from "./logo";
import { Container } from "./container";
import { isAuthEnabled } from "../lib/config";
import { useAuth } from "../lib/auth-context";
import { AccountMenu } from "./auth/account-menu";
import { SCAN_NEXT } from "../lib/safe-next";

const navLinks = [
  { label: "How it works", href: "/#how-it-works" },
  { label: "The 8 checks", href: "/#checks" },
  { label: "Pricing", href: "/pricing" },
];

/** Scroll the scan form into view and put the cursor in it. */
function focusScanForm() {
  const target = document.getElementById("scan-url") || document.getElementById("scan");
  if (!target) return false;
  target.scrollIntoView({ behavior: "smooth", block: "center" });
  requestAnimationFrame(() => {
    document.getElementById("scan-url")?.focus({ preventScroll: true });
  });
  return true;
}

export function SiteHeader() {
  const router = useRouter();
  const { user, loading, authEnabled } = useAuth();
  const signedIn = !!user;

  /**
   * "Run a scan" always ends up at the scan form.
   *
   * Signed out, that means signing in first — and `next` carries the
   * destination through, so the visitor lands back on the form rather than the
   * dashboard. Signed in, it scrolls if the form is on this page and navigates
   * to it if it isn't.
   */
  function handleRunScan() {
    if (authEnabled && !loading && !signedIn) {
      router.push(`/login?next=${encodeURIComponent(SCAN_NEXT)}`);
      return;
    }
    if (focusScanForm()) return;
    router.push(SCAN_NEXT);
  }

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur-md">
      <Container>
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo — left */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0" aria-label="Visum home">
            <Logo className="h-6 w-6 text-primary" />
            <span className="text-[17px] font-bold tracking-tight text-foreground">Visum</span>
          </Link>

          {/* Nav — center */}
          <nav aria-label="Primary" className="mx-auto hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-muted-foreground no-underline transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA — right */}
          <div className="flex shrink-0 items-center gap-2">
            {/* Marketing pages are statically served, so the session is only
                known once the client resolves it. Holding the space until then
                avoids flashing "Sign in" at someone who is already signed in. */}
            {isAuthEnabled &&
              (loading ? (
                <span className="hidden h-9 w-20 sm:block" aria-hidden="true" />
              ) : signedIn ? (
                // No sidebar out here, so this is the only way to reach your
                // account — or sign out — from the home page.
                <AccountMenu />
              ) : (
                <Link
                  href="/login"
                  className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-muted-foreground no-underline transition-colors hover:text-foreground sm:inline-flex"
                >
                  Sign in
                </Link>
              ))}
            <button
              type="button"
              onClick={handleRunScan}
              className="cursor-pointer rounded-lg border-0 bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-colors hover:bg-brand-200"
            >
              Run a scan
            </button>
          </div>
        </div>
      </Container>
    </header>
  );
}
