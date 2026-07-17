"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Target,
  Clock,
  Zap,
  BarChart3,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { SPRINT_PROGRESS, WORK_ITEMS } from "./data";

export function ProgressPanel() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const sp = SPRINT_PROGRESS;
  const pct = sp.totalTasks > 0 ? Math.round((sp.tasksCompleted / sp.totalTasks) * 100) : 0;

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <BarChart3 className="h-3.5 w-3.5 text-accent" />
        <p className="text-[10px] font-semibold uppercase tracking-widest text-foreground">Sprint Progress</p>
      </div>

      {/* Sprint name */}
      <p className="text-[11px] font-medium text-foreground mb-3">{sp.currentSprint}</p>

      {/* Main progress bar */}
      <div className="h-2 rounded-full bg-muted/20 overflow-hidden mb-1">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${mounted ? pct : 0}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full rounded-full bg-gradient-to-r from-accent to-green-500"
        />
      </div>
      <div className="flex items-center justify-between text-[9px] text-muted-foreground/50 mb-4">
        <span>{sp.tasksCompleted}/{sp.totalTasks} tasks</span>
        <span>{pct}% complete</span>
      </div>

      {/* Grid stats */}
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-lg border border-border/60 bg-muted/5 p-2.5">
          <div className="flex items-center gap-1.5 text-[8px] text-muted-foreground/50 mb-0.5">
            <TrendingUp className="h-2.5 w-2.5" />
            Visibility Gained
          </div>
          <p className="text-sm font-bold text-green-500 font-mono tabular-nums">+{sp.visibilityGained}</p>
        </div>
        <div className="rounded-lg border border-border/60 bg-muted/5 p-2.5">
          <div className="flex items-center gap-1.5 text-[8px] text-muted-foreground/50 mb-0.5">
            <Zap className="h-2.5 w-2.5" />
            Remaining Impact
          </div>
          <p className="text-sm font-bold text-accent font-mono tabular-nums">+{sp.remainingImpact}</p>
        </div>
        <div className="rounded-lg border border-border/60 bg-muted/5 p-2.5">
          <div className="flex items-center gap-1.5 text-[8px] text-muted-foreground/50 mb-0.5">
            <Target className="h-2.5 w-2.5" />
            Projected Score
          </div>
          <p className="text-sm font-bold text-foreground font-mono tabular-nums">{sp.projectedScore}</p>
        </div>
        <div className="rounded-lg border border-border/60 bg-muted/5 p-2.5">
          <div className="flex items-center gap-1.5 text-[8px] text-muted-foreground/50 mb-0.5">
            <Clock className="h-2.5 w-2.5" />
            Velocity
          </div>
          <p className="text-sm font-bold text-foreground font-mono tabular-nums">{sp.velocity}/sprint</p>
        </div>
      </div>

      {/* Forecast */}
      <div className="mt-3 rounded-lg border border-accent/10 bg-accent/[0.02] p-2.5">
        <div className="flex items-center gap-1.5 text-[8px] text-muted-foreground/50 mb-0.5">
          <Clock className="h-2.5 w-2.5" />
          Completion Forecast
        </div>
        <p className="text-[11px] font-semibold text-foreground font-mono">{sp.completionForecast}</p>
      </div>
    </div>
  );
}
