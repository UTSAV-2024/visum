"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../lib/auth-context";
import { useAccount } from "../../lib/account-context";
import { cn } from "../../lib/utils";

/**
 * The signed-in control in the marketing header: who you are, how many scans
 * you have left, and the way out.
 *
 * The sidebar has its own version of this, but the marketing pages don't render
 * the sidebar — without this there is no way to sign out from the home page.
 */
export function AccountMenu() {
  const { user, signOut } = useAuth();
  const { account } = useAccount();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [avatarBroken, setAvatarBroken] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickAway(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) {
      document.addEventListener("mousedown", onClickAway);
      document.addEventListener("keydown", onEscape);
    }
    return () => {
      document.removeEventListener("mousedown", onClickAway);
      document.removeEventListener("keydown", onEscape);
    };
  }, [open]);

  if (!user) return null;

  const meta = (user.user_metadata || {}) as Record<string, string>;
  const email = account?.profile?.email || user.email || "";
  const name =
    account?.profile?.fullName ||
    meta.full_name ||
    meta.name ||
    (email ? email.split("@")[0] : "Account");
  const avatar = account?.profile?.avatarUrl || meta.avatar_url || meta.picture || "";
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const remaining = account?.usage?.scansRemaining;
  const limit = account?.subscription?.scanLimit;

  async function handleSignOut() {
    setSigningOut(true);
    setOpen(false);
    await signOut();
    // Back to the landing page rather than the sign-in screen: signing out from
    // a marketing page shouldn't feel like being kicked into a login wall.
    router.replace("/");
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        className="flex cursor-pointer items-center gap-2 rounded-lg border-0 bg-transparent px-1.5 py-1 transition-colors hover:bg-muted/20"
      >
        {avatar && !avatarBroken ? (
          // A 28px avatar from an arbitrary identity provider: not worth
          // next/image plus a remotePatterns entry per provider.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatar}
            alt=""
            referrerPolicy="no-referrer"
            onError={() => setAvatarBroken(true)}
            className="h-7 w-7 shrink-0 rounded-full object-cover"
          />
        ) : (
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
            {initials}
          </span>
        )}
        <span className="hidden max-w-[10ch] truncate text-sm font-medium text-foreground sm:inline">
          {name}
        </span>
        <svg
          className={cn(
            "h-3 w-3 shrink-0 text-muted-foreground transition-transform duration-200",
            open && "rotate-180"
          )}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.22 8.22a.75.75 0 011.06 0L10 11.94l3.72-3.72a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.22 9.28a.75.75 0 010-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 top-full z-50 mt-2 w-60 overflow-hidden rounded-xl border border-border bg-card shadow-xl"
          >
            <div className="border-b border-border px-3 py-2.5">
              <p className="truncate text-sm font-semibold text-foreground">{name}</p>
              <p className="truncate text-xs text-muted-foreground">{email}</p>
              {typeof remaining === "number" && (
                <p className="mt-1.5 text-[11px] text-muted-foreground">
                  <span className="font-semibold text-primary">{remaining}</span> of {limit}{" "}
                  scans left · {account?.subscription?.planName}
                </p>
              )}
            </div>

            <div className="py-1">
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="block px-3 py-2 text-sm text-muted-foreground no-underline transition-colors hover:bg-muted/20 hover:text-foreground"
              >
                Dashboard
              </Link>
              <Link
                href="/pricing"
                onClick={() => setOpen(false)}
                className="block px-3 py-2 text-sm text-muted-foreground no-underline transition-colors hover:bg-muted/20 hover:text-foreground"
              >
                Plans &amp; billing
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                disabled={signingOut}
                className="flex w-full cursor-pointer items-center gap-2 border-0 bg-transparent px-3 py-2 text-left text-sm text-red-500 transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                {signingOut ? "Signing out…" : "Log out"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
