import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";
import { BILLING } from "./data";

export function BillingSummary({ className }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scanPct = Math.round((BILLING.scansThisMonth / BILLING.scanLimit) * 100);
  const memberPct = Math.round((BILLING.members / BILLING.memberLimit) * 100);

  return (
    <div className={cn("relative rounded-2xl border border-border bg-card transition-all duration-500", isVisible ? "opacity-100" : "opacity-0", className)}>
      <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.02] to-transparent pointer-events-none rounded-2xl" />
      <div className="relative z-10 p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 text-accent" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 1a4.5 4.5 0 00-4.5 4.5v2.5a2 2 0 00-2 2v4a2 2 0 002 2h9a2 2 0 002-2v-4a2 2 0 00-2-2v-2.5A4.5 4.5 0 0010 1zm-2.5 7V5.5a2.5 2.5 0 015 0V8h-5z" />
            </svg>
            <p className="text-xs font-semibold uppercase tracking-widest text-foreground">Billing</p>
          </div>
          <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-[10px] font-bold text-accent">
            {BILLING.plan}
          </span>
        </div>

        {/* Plan info */}
        <div className="flex items-baseline gap-1 mb-4">
          <span className="font-mono text-2xl font-bold tabular-nums text-foreground">{BILLING.price}</span>
          <span className="text-xs text-muted-foreground">{BILLING.period}</span>
          <span className="text-[10px] text-muted-foreground/60 ml-auto">Next billing: {BILLING.nextBilling}</span>
        </div>

        {/* Usage meters */}
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-muted-foreground">Scan Usage</span>
              <span className="font-mono text-[10px] tabular-nums text-foreground">{BILLING.scansThisMonth.toLocaleString()} / {BILLING.scanLimit.toLocaleString()}</span>
            </div>
            <div className="h-2 rounded-full bg-muted/20 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-accent to-accent/60" style={{ width: `${scanPct}%` }} />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-muted-foreground">Team Members</span>
              <span className="font-mono text-[10px] tabular-nums text-foreground">{BILLING.members} / {BILLING.memberLimit}</span>
            </div>
            <div className="h-2 rounded-full bg-muted/20 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-green-500 to-green-400" style={{ width: `${memberPct}%` }} />
            </div>
          </div>
        </div>

        {/* Invoice history */}
        <div className="mt-4 pt-3 border-t border-border">
          <p className="text-[9px] font-medium text-muted-foreground/60 uppercase tracking-wider mb-2">Invoice History</p>
          <div className="space-y-1">
            {BILLING.invoices.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between py-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground">{inv.date}</span>
                  <span className="text-[10px] font-medium text-foreground">{inv.id}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] tabular-nums text-foreground">{inv.amount}</span>
                  <span className={cn("text-[9px] font-medium", inv.status === "paid" ? "text-green-500" : "text-red-500")}>
                    {inv.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
