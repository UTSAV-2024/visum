"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, HardDrive, ScanLine } from "lucide-react";
import { cn } from "../../lib/utils";
import { useSidebar } from "./sidebar-context";
import { useAccount } from "../../lib/account-context";
import { formatBytes } from "../../lib/plans";

/** Bar colour tracks how close to the limit you are. */
function barTone(pct: number) {
  if (pct >= 90) return "bg-red-500";
  if (pct >= 70) return "bg-orange-500";
  return "bg-accent";
}

function pctOf(used: number, limit: number) {
  if (!limit || limit <= 0) return 0;
  return Math.min(Math.round((used / limit) * 100), 100);
}

function formatRenewal(iso?: string | null) {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function Meter({
  icon,
  label,
  value,
  pct,
  delay = 0,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  pct: number;
  delay?: number;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          {icon}
          <span className="text-[10px] text-muted-foreground/60">{label}</span>
        </div>
        <span className="text-[10px] font-medium tabular-nums text-muted-foreground">
          {value}
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-muted/20 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut", delay }}
          className={cn("h-full rounded-full", barTone(pct))}
        />
      </div>
    </div>
  );
}

/**
 * Real usage for the signed-in account: scans spent against the plan's
 * allowance, and storage consumed by the scans actually kept.
 */
export function UsageMeter() {
  const { expanded } = useSidebar();
  const { account, loading } = useAccount();

  const subscription = account?.subscription;
  const usage = account?.usage;

  const scansUsed = usage?.scansUsed ?? 0;
  const scanLimit = subscription?.scanLimit ?? 0;
  const storageUsed = usage?.storageUsedBytes ?? 0;
  const storageLimit = subscription?.storageLimitBytes ?? 0;
  const renewal = formatRenewal(subscription?.renewalDate);
  const canUpgrade = (subscription?.tier ?? "free") !== "ultimate";

  return (
    <motion.div
      animate={{ opacity: expanded ? 1 : 0, height: expanded ? "auto" : 0 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="overflow-hidden"
    >
      <div className="space-y-3 px-3 py-2">
        {!account ? (
          // Loading, or a deployment without auth configured — show inert
          // placeholders rather than numbers we can't stand behind.
          <div className="space-y-3">
            <div className="h-1.5 rounded-full bg-muted/20" aria-hidden="true" />
            <div className="h-1.5 rounded-full bg-muted/20" aria-hidden="true" />
            <p className="text-[10px] text-muted-foreground/50">
              {loading ? "Loading usage…" : "Sign in to see your usage"}
            </p>
          </div>
        ) : (
          <>
            <Meter
              icon={<HardDrive className="w-3 h-3 text-muted-foreground/60" />}
              label="Storage"
              value={`${formatBytes(storageUsed)} / ${formatBytes(storageLimit)}`}
              pct={pctOf(storageUsed, storageLimit)}
            />

            <Meter
              icon={<ScanLine className="w-3 h-3 text-muted-foreground/60" />}
              label="Scans"
              value={`${scansUsed} / ${scanLimit}`}
              pct={pctOf(scansUsed, scanLimit)}
              delay={0.1}
            />

            {/* Plan + Upgrade */}
            <div className="flex items-center justify-between pt-1">
              <div>
                <p className="text-[10px] font-medium text-foreground">
                  {subscription?.planName} Plan
                </p>
                <p className="text-[9px] capitalize text-muted-foreground/60">
                  {subscription?.status === "active"
                    ? renewal
                      ? `Renews ${renewal}`
                      : "Active"
                    : subscription?.status?.replace("_", " ")}
                </p>
              </div>
              {canUpgrade && (
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-1 text-[10px] font-semibold text-accent no-underline transition-colors hover:text-accent/80"
                >
                  Upgrade
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              )}
            </div>
          </>
        )}
      </div>

      {/* Divider */}
      <div className="mx-3 my-2 h-px bg-border/50" />

      {/* Help links — Documentation/Discord aren't live yet, so they render as
          non-clickable "Soon" labels instead of dead "#" anchors. */}
      <div className="px-3 pb-2 space-y-1">
        {[
          { label: "Documentation", href: "#", disabled: true },
          { label: "Discord", href: "#", disabled: true },
          { label: "Contact Support", href: "/contact", disabled: false },
        ].map((link) =>
          link.disabled ? (
            <span
              key={link.label}
              className="flex items-center gap-1.5 text-[11px] text-muted-foreground/30 py-0.5 cursor-default select-none"
            >
              {link.label}
              <span className="text-[8px] font-semibold uppercase tracking-wider text-muted-foreground/30">
                Soon
              </span>
            </span>
          ) : (
            <a
              key={link.label}
              href={link.href}
              className="block text-[11px] text-muted-foreground/50 hover:text-muted-foreground transition-colors py-0.5"
            >
              {link.label}
            </a>
          )
        )}
      </div>
    </motion.div>
  );
}
