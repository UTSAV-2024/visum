"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Bot,
  Loader2,
  CheckCircle2,
  XCircle,
  ChevronRight,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { LIVE_ACTIVITY, type LiveActivityItem } from "./data";

const STATUS_CONFIG: Record<string, { icon: React.ReactNode; color: string }> = {
  processing: { icon: <Loader2 className="h-2.5 w-2.5 animate-spin" />, color: "text-accent" },
  completed: { icon: <CheckCircle2 className="h-2.5 w-2.5" />, color: "text-green-500" },
  failed: { icon: <XCircle className="h-2.5 w-2.5" />, color: "text-red-500" },
};

const ENGINE_COLORS: Record<string, string> = {
  ChatGPT: "#10a37f",
  Claude: "#6a4fc9",
  Gemini: "#4285f4",
  Perplexity: "#1f1f1f",
  DeepSeek: "#4f46e5",
  Mistral: "#ff6600",
};

export function LiveActivity() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-3">
        <Activity className="h-3.5 w-3.5 text-accent" />
        <p className="text-[10px] font-semibold uppercase tracking-widest text-foreground">Live Activity</p>
        <span className="ml-auto flex items-center gap-1 text-[9px] text-green-500">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
          Live
        </span>
      </div>

      <div className="flex-1 space-y-1.5 overflow-y-auto scrollbar-thin pr-1">
        {LIVE_ACTIVITY.map((item, i) => {
          const config = STATUS_CONFIG[item.status];
          const engineColor = ENGINE_COLORS[item.engine] || "#888";
          return (
            <motion.div
              key={item.id}
              initial={mounted ? { opacity: 0, y: 6 } : undefined}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.03 * i }}
              className="flex items-start gap-2.5 rounded-lg px-3 py-2 hover:bg-muted/10 transition-colors cursor-pointer group"
            >
              <div
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md mt-0.5"
                style={{ backgroundColor: `${engineColor}15`, color: engineColor }}
              >
                <Bot className="h-2.5 w-2.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-medium" style={{ color: engineColor }}>
                    {item.engine}
                  </span>
                  <span className={cn("ml-auto", config.color)}>{config.icon}</span>
                </div>
                <p className="text-[10px] text-muted-foreground/70 mt-0.5 truncate leading-relaxed">
                  &ldquo;{item.question}&rdquo;
                </p>
                <span className="text-[8px] text-muted-foreground/40">{item.time}</span>
              </div>
              <ChevronRight className="h-3 w-3 text-muted-foreground/20 group-hover:text-muted-foreground/50 transition-colors mt-1 shrink-0" />
            </motion.div>
          );
        })}
      </div>

      {/* View all */}
      <button className="flex items-center justify-center gap-1 mt-3 py-2 rounded-lg border border-dashed border-border/50 text-[10px] font-medium text-muted-foreground/50 hover:text-foreground hover:border-accent/30 hover:bg-muted/5 transition-all">
        View All Activity
      </button>
    </div>
  );
}
