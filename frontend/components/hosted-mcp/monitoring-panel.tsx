"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { MONITORING_METRICS, SECURITY_ALERTS } from "./data";

function HealthDot({ status }: { status: string }) {
  const colors: Record<string, string> = {
    healthy: "bg-green-500",
    warning: "bg-orange-500",
    critical: "bg-red-500",
    down: "bg-red-500",
  };
  return <span className={cn("inline-block h-1.5 w-1.5 rounded-full", colors[status] || "bg-muted-foreground")} />;
}

function TrendIcon({ trend }: { trend: string }) {
  if (trend === "up") return <TrendingUp className="h-2.5 w-2.5 text-red-500" />;
  if (trend === "down") return <TrendingDown className="h-2.5 w-2.5 text-green-500" />;
  return <Minus className="h-2.5 w-2.5 text-muted-foreground/40" />;
}

export function MonitoringPanel() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Activity className="h-3.5 w-3.5 text-accent" />
        <p className="text-[10px] font-semibold uppercase tracking-widest text-foreground">Monitoring</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        {MONITORING_METRICS.map((m, i) => (
          <motion.div
            key={m.label}
            initial={mounted ? { opacity: 0, y: 4 } : undefined}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15, delay: 0.02 * i }}
            className="rounded-lg border border-border/60 bg-muted/5 p-2.5"
          >
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-[8px] text-muted-foreground/50">{m.label}</span>
              <HealthDot status={m.status} />
            </div>
            <div className="flex items-center gap-1">
              <span className={cn(
                "text-xs font-bold font-mono tabular-nums",
                m.status === "warning" ? "text-orange-500" :
                m.status === "critical" ? "text-red-500" :
                "text-foreground"
              )}>{m.value}</span>
              <TrendIcon trend={m.trend} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Security Alerts */}
      <div className="mt-3">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="h-3 w-3 text-orange-500" />
          <span className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/50">Security Alerts</span>
          <span className="text-[8px] text-muted-foreground/40 ml-auto">{SECURITY_ALERTS.length} alerts</span>
        </div>
        <div className="space-y-1">
          {SECURITY_ALERTS.map((alert, i) => (
            <motion.div
              key={alert.id}
              initial={mounted ? { opacity: 0, x: -4 } : undefined}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.15, delay: 0.02 * i }}
              className="flex items-start gap-2 rounded-lg px-2.5 py-1.5 hover:bg-muted/10 transition-colors"
            >
              <div className={cn(
                "flex h-4 w-4 shrink-0 items-center justify-center rounded",
                alert.severity === "critical" ? "bg-red-500/10" :
                alert.severity === "high" ? "bg-orange-500/10" :
                "bg-muted/10"
              )}>
                <AlertTriangle className={cn(
                  "h-2.5 w-2.5",
                  alert.severity === "critical" ? "text-red-500" :
                  alert.severity === "high" ? "text-orange-500" :
                  "text-muted-foreground/50"
                )} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[9px] text-muted-foreground/80 leading-relaxed">{alert.message}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={cn(
                    "text-[8px] font-semibold uppercase",
                    alert.severity === "critical" ? "text-red-500" :
                    alert.severity === "high" ? "text-orange-500" :
                    "text-muted-foreground/50"
                  )}>{alert.severity}</span>
                  <span className="text-[8px] text-muted-foreground/40">· {alert.count} events</span>
                  <span className="text-[8px] text-muted-foreground/40">· {alert.time}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
