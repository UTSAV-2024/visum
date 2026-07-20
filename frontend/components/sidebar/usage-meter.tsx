"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, HardDrive, ScanLine } from "lucide-react";
import { cn } from "../../lib/utils";
import { useSidebar } from "./sidebar-context";
import type { UsageData } from "./types";

const MOCK_USAGE: UsageData = {
  storageUsed: 2.4,
  storageLimit: 10,
  scansUsed: 142,
  scansLimit: 500,
};

interface UsageMeterProps {
  usage?: UsageData;
}

export function UsageMeter({ usage = MOCK_USAGE }: UsageMeterProps) {
  const { expanded } = useSidebar();

  const storagePct = Math.round((usage.storageUsed / usage.storageLimit) * 100);
  const scansPct = Math.round((usage.scansUsed / usage.scansLimit) * 100);

  return (
    <motion.div
      animate={{ opacity: expanded ? 1 : 0, height: expanded ? "auto" : 0 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="overflow-hidden"
    >
      <div className="space-y-3 px-3 py-2">
        {/* Storage */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <HardDrive className="w-3 h-3 text-muted-foreground/60" />
              <span className="text-[10px] text-muted-foreground/60">Storage</span>
            </div>
            <span className="text-[10px] font-medium tabular-nums text-muted-foreground">
              {usage.storageUsed}GB / {usage.storageLimit}GB
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-muted/20 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${storagePct}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={cn(
                "h-full rounded-full",
                storagePct > 90
                  ? "bg-red-500"
                  : storagePct > 70
                  ? "bg-orange-500"
                  : "bg-accent"
              )}
            />
          </div>
        </div>

        {/* Scans */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <ScanLine className="w-3 h-3 text-muted-foreground/60" />
              <span className="text-[10px] text-muted-foreground/60">Scans</span>
            </div>
            <span className="text-[10px] font-medium tabular-nums text-muted-foreground">
              {usage.scansUsed} / {usage.scansLimit}
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-muted/20 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${scansPct}%` }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
              className={cn(
                "h-full rounded-full",
                scansPct > 90
                  ? "bg-red-500"
                  : scansPct > 70
                  ? "bg-orange-500"
                  : "bg-accent"
              )}
            />
          </div>
        </div>

        {/* Plan + Upgrade */}
        <div className="flex items-center justify-between pt-1">
          <div>
            <p className="text-[10px] font-medium text-foreground">Pro Plan</p>
            <p className="text-[9px] text-muted-foreground/60">Active</p>
          </div>
          <button
            className="inline-flex items-center gap-1 text-[10px] font-semibold text-accent hover:text-accent/80 transition-colors"
          >
            Upgrade
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
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
