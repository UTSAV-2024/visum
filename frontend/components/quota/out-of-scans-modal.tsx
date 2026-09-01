"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import { track } from "../../lib/analytics";

interface Quota {
  tier?: string;
  scanLimit?: number;
  scansUsed?: number;
  renewalDate?: string | null;
}

interface OutOfScansModalProps {
  open: boolean;
  onClose: () => void;
  quota?: Quota | null;
}

function formatRenewal(iso?: string | null) {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Shown when a scan is refused for want of quota.
 *
 * The free plan's allowance is spent for good, so it asks for an upgrade. A
 * paid plan's is spent until the week turns over, so it says when scans come
 * back instead of pushing a purchase the user doesn't need.
 */
export function OutOfScansModal({ open, onClose, quota }: OutOfScansModalProps) {
  const router = useRouter();
  const closeRef = useRef<HTMLButtonElement>(null);

  const tier = quota?.tier || "free";
  const isFree = tier === "free";
  const limit = quota?.scanLimit ?? 3;
  const renewal = formatRenewal(quota?.renewalDate);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    // Move focus into the dialog so keyboard and screen-reader users land here
    // rather than continuing behind the overlay.
    closeRef.current?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) track("quota_exhausted_modal_shown", { tier, scan_limit: limit });
  }, [open, tier, limit]);

  function handleUpgrade() {
    track("clicked_upgrade", { action: "upgrade_to_pro", source: "out_of_scans_modal", tier });
    onClose();
    router.push("/pricing");
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="out-of-scans-title"
              aria-describedby="out-of-scans-body"
              initial={{ opacity: 0, y: 12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.97 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="pointer-events-auto w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl sm:p-7"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-primary/10">
                <svg
                  className="h-5 w-5 text-primary"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                  <line x1="3" y1="3" x2="21" y2="21" />
                </svg>
              </div>

              <h2
                id="out-of-scans-title"
                className="text-xl font-bold tracking-tight text-foreground"
              >
                {isFree ? "Out of Free Scans" : "Out of scans this week"}
              </h2>

              <p
                id="out-of-scans-body"
                className="mt-2 text-sm leading-relaxed text-muted-foreground"
              >
                {isFree ? (
                  <>
                    You&apos;ve used all {limit} free scans.
                    <br />
                    Upgrade to continue scanning websites.
                  </>
                ) : (
                  <>
                    You&apos;ve used all {limit} scans in your current week.
                    {renewal
                      ? ` Your allowance resets on ${renewal}.`
                      : " Your allowance resets at the start of your next billing week."}
                  </>
                )}
              </p>

              <div className="mt-6 flex flex-col gap-2 sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleUpgrade}
                  className="inline-flex h-11 flex-1 items-center justify-center rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  {isFree ? "Upgrade to Pro" : "See plans"}
                </button>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={onClose}
                  className="inline-flex h-11 flex-1 items-center justify-center rounded-xl border border-border bg-transparent px-6 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted/20 hover:text-foreground"
                >
                  Maybe Later
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
