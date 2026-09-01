"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, ChevronUp, HelpCircle } from "lucide-react";
import { cn } from "../../lib/utils";
import { useSidebar } from "./sidebar-context";
import { useAuth } from "../../lib/auth-context";
import { useAccount } from "../../lib/account-context";
import type { UserProfile } from "./types";

/**
 * The display identity for the signed-in user.
 *
 * The stored profile wins (it is what the Google sign-in or the sign-up form
 * recorded); the live session's metadata is the fallback for the moment before
 * the account has loaded. Someone who signed up with email and never set a
 * name is shown the local part of their address rather than a placeholder.
 */
function deriveProfile(profile: any, authUser: any): UserProfile | null {
  if (!profile && !authUser) return null;
  const meta = authUser?.user_metadata || {};
  const email: string = profile?.email || authUser?.email || "";
  const name: string =
    profile?.fullName ||
    meta.full_name ||
    meta.name ||
    (email ? email.split("@")[0] : "Account");
  const avatar: string = profile?.avatarUrl || meta.avatar_url || meta.picture || "";
  return { name, email, avatar, company: email ? email.split("@")[1] || "" : "" };
}

interface UserSectionProps {
  user?: UserProfile;
}

export function UserSection({ user: userProp }: UserSectionProps) {
  const { expanded } = useSidebar();
  const { user: authUser, authEnabled, signOut } = useAuth();
  const { account } = useAccount();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [avatarBroken, setAvatarBroken] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const user =
    userProp ?? deriveProfile(account?.profile, authEnabled ? authUser : null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  async function handleLogout() {
    setSigningOut(true);
    setOpen(false);
    await signOut();
    router.replace("/login");
  }

  if (!user) return null;

  const initials = (user.name || "?")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => expanded && setOpen(!open)}
        className={cn(
          "flex items-center gap-3 w-full px-3 py-2 rounded-lg transition-all duration-150",
          "text-muted-foreground hover:text-foreground hover:bg-muted/20",
          "outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
          !expanded && "justify-center"
        )}
        aria-label="User menu"
        aria-haspopup="true"
        aria-expanded={open}
      >
        {/* Avatar — the provider's picture when there is one, initials when not */}
        {user.avatar && !avatarBroken ? (
          // A 28px avatar from an arbitrary identity provider: not worth
          // next/image plus a remotePatterns entry per provider.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.avatar}
            alt=""
            referrerPolicy="no-referrer"
            onError={() => setAvatarBroken(true)}
            className="w-7 h-7 rounded-full object-cover shrink-0"
          />
        ) : (
          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-accent/10 text-accent text-xs font-bold shrink-0">
            {initials}
          </div>
        )}

        <motion.div
          className="flex items-center gap-2 min-w-0 flex-1"
          animate={{ opacity: expanded ? 1 : 0, width: expanded ? "auto" : 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          <div className="min-w-0 flex-1 text-left">
            <p className="text-sm font-medium truncate text-foreground">{user.name}</p>
            <p className="text-[10px] text-muted-foreground/60 truncate">{user.company}</p>
          </div>
          <ChevronUp
            className={cn(
              "w-3 h-3 shrink-0 text-muted-foreground/40 transition-transform duration-200",
              open && "rotate-180"
            )}
          />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && expanded && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute left-2 right-2 bottom-full mb-1 z-50 rounded-xl border border-border bg-popover shadow-xl backdrop-blur-xl overflow-hidden"
          >
            <div className="py-1">
              <div className="px-3 py-2 border-b border-border">
                <p className="text-xs font-medium text-foreground">{user.name}</p>
                <p className="text-[10px] text-muted-foreground/60">{user.email}</p>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 w-full px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/20 transition-colors"
              >
                <HelpCircle className="w-4 h-4" />
                Help & Support
              </button>

              {authEnabled && (
                <button
                  onClick={handleLogout}
                  disabled={signingOut}
                  className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-500 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <LogOut className="w-4 h-4" />
                  {signingOut ? "Signing out…" : "Log out"}
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
