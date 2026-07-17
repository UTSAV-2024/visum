"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GitBranch,
  GitCommit,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  ChevronDown,
  RotateCcw,
  Terminal,
  AlertTriangle,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { DEPLOYMENTS, type Deployment, type DeploymentStatus } from "./data";

const STATUS_CONFIG: Record<DeploymentStatus, { icon: React.ReactNode; label: string; color: string }> = {
  deploying: { icon: <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />, label: "Deploying", color: "text-blue-500" },
  running: { icon: <CheckCircle2 className="h-3.5 w-3.5" />, label: "Running", color: "text-green-500" },
  failed: { icon: <XCircle className="h-3.5 w-3.5" />, label: "Failed", color: "text-red-500" },
  "rolled-back": { icon: <RotateCcw className="h-3.5 w-3.5" />, label: "Rolled Back", color: "text-orange-500" },
};

export function DeploymentTimeline() {
  const [mounted, setMounted] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  useEffect(() => setMounted(true), []);

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <GitBranch className="h-3.5 w-3.5 text-accent" />
        <p className="text-[10px] font-semibold uppercase tracking-widest text-foreground">Deployments</p>
        <span className="text-[9px] text-muted-foreground/40 ml-auto">{DEPLOYMENTS.length} total</span>
      </div>

      <div className="space-y-2">
        {DEPLOYMENTS.map((dep, i) => {
          const config = STATUS_CONFIG[dep.status];
          const isExpanded = expanded === dep.id;

          return (
            <motion.div
              key={dep.id}
              initial={mounted ? { opacity: 0, y: 6 } : undefined}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.04 * i }}
            >
              <div
                onClick={() => setExpanded(isExpanded ? null : dep.id)}
                className={cn(
                  "rounded-xl border transition-all cursor-pointer group",
                  isExpanded ? "border-accent/30 bg-accent/[0.02]" : "border-border bg-card hover:border-accent/20"
                )}
              >
                {/* Main row */}
                <div className="flex items-center gap-3 p-3">
                  {/* Status indicator */}
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted/10">
                    {config.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-foreground">{dep.version}</span>
                      <code className="text-[9px] font-mono text-muted-foreground/60 bg-muted/10 px-1 py-0.5 rounded">{dep.commitSha}</code>
                      <span className={cn("text-[9px] font-medium", config.color)}>{config.label}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 text-[9px] text-muted-foreground/60">
                      <span>{dep.environment}</span>
                      <span>·</span>
                      <span>{dep.triggeredBy}</span>
                      <span>·</span>
                      <span>{dep.timestamp}</span>
                    </div>
                  </div>

                  {/* Error indicator */}
                  {dep.errors > 0 && (
                    <div className="flex items-center gap-1 text-[9px] text-red-500">
                      <AlertTriangle className="h-3 w-3" />
                      <span>{dep.errors}</span>
                    </div>
                  )}

                  <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground/30 transition-transform", isExpanded && "rotate-180")} />
                </div>

                {/* Expanded detail */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-3 pb-3 pt-0 space-y-2 border-t border-border/50">
                        <div className="grid grid-cols-4 gap-2 mt-2">
                          <div className="rounded-lg bg-muted/5 border border-border/40 p-2">
                            <span className="text-[8px] text-muted-foreground/50 block">Duration</span>
                            <span className="text-[10px] font-semibold text-foreground font-mono">{dep.duration}</span>
                          </div>
                          <div className="rounded-lg bg-muted/5 border border-border/40 p-2">
                            <span className="text-[8px] text-muted-foreground/50 block">Build Time</span>
                            <span className="text-[10px] font-semibold text-foreground font-mono">{dep.buildTime}</span>
                          </div>
                          <div className="rounded-lg bg-muted/5 border border-border/40 p-2">
                            <span className="text-[8px] text-muted-foreground/50 block">Health</span>
                            <span className={cn("text-[10px] font-semibold font-mono", dep.healthCheck ? "text-green-500" : "text-red-500")}>
                              {dep.healthCheck ? "Passed" : "Failed"}
                            </span>
                          </div>
                          <div className="rounded-lg bg-muted/5 border border-border/40 p-2">
                            <span className="text-[8px] text-muted-foreground/50 block">Rollback</span>
                            <span className={cn("text-[10px] font-semibold font-mono", dep.rollbackAvailable ? "text-orange-500" : "text-muted-foreground/50")}>
                              {dep.rollbackAvailable ? "Available" : "N/A"}
                            </span>
                          </div>
                        </div>

                        <div className="rounded-lg bg-muted/5 border border-border/40 p-2">
                          <span className="text-[8px] text-muted-foreground/50 block mb-1">Release Notes</span>
                          <p className="text-[10px] text-muted-foreground/70">{dep.releaseNotes}</p>
                        </div>

                        <div className="flex gap-2">
                          <button className="flex items-center gap-1 rounded-md bg-red-500/10 px-2.5 py-1.5 text-[9px] font-semibold text-red-500 hover:bg-red-500/20 transition-colors">
                            <RotateCcw className="h-3 w-3" />
                            Rollback
                          </button>
                          <button className="flex items-center gap-1 rounded-md bg-muted/10 px-2.5 py-1.5 text-[9px] text-muted-foreground hover:text-foreground hover:bg-muted/20 transition-colors">
                            <Terminal className="h-3 w-3" />
                            View Logs
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
