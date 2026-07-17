"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { OBSERVATIONS, type AIObservation } from "./data";

const TYPE_CONFIG: Record<string, { icon: React.ReactNode; border: string; badge: string }> = {
  trend: {
    icon: <TrendingUp className="h-3 w-3" />,
    border: "border-l-blue-500/40 bg-blue-500/[0.02]",
    badge: "bg-blue-500/10 text-blue-500",
  },
  warning: {
    icon: <AlertTriangle className="h-3 w-3" />,
    border: "border-l-orange-500/40 bg-orange-500/[0.02]",
    badge: "bg-orange-500/10 text-orange-500",
  },
  opportunity: {
    icon: <Lightbulb className="h-3 w-3" />,
    border: "border-l-green-500/40 bg-green-500/[0.02]",
    badge: "bg-green-500/10 text-green-500",
  },
  insight: {
    icon: <Sparkles className="h-3 w-3" />,
    border: "border-l-accent/40 bg-accent/[0.02]",
    badge: "bg-accent/10 text-accent",
  },
};

export function InsightsPanel() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="h-3.5 w-3.5 text-accent" />
        <p className="text-[10px] font-semibold uppercase tracking-widest text-foreground">AI Observations</p>
        <span className="text-[9px] text-muted-foreground/40 ml-auto">{OBSERVATIONS.length} insights</span>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto scrollbar-thin pr-1">
        {OBSERVATIONS.map((obs, i) => {
          const config = TYPE_CONFIG[obs.type];
          return (
            <motion.div
              key={obs.id}
              initial={mounted ? { opacity: 0, x: 8 } : undefined}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.05 * i }}
              className={cn("rounded-lg border-l-2 p-3 cursor-default transition-colors hover:bg-muted/5", config.border)}
            >
              <div className="flex items-start gap-2">
                <div className={cn("flex h-5 w-5 shrink-0 items-center justify-center rounded", config.badge)}>
                  {config.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{obs.message}</p>
                  <span className="text-[8px] text-muted-foreground/40 mt-1 block">{obs.time}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* View all link */}
      <button className="flex items-center gap-1 mt-3 text-[10px] font-medium text-accent hover:text-accent/80 transition-colors">
        View all insights
        <ArrowRight className="h-3 w-3" />
      </button>
    </div>
  );
}
