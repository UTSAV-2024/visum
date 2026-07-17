"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Server,
  MessageSquare,
  UserPlus,
  TrendingUp,
  GitPullRequest,
  ScanLine,
  Activity,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { ACTIVITY_ITEMS, type ActivityItem } from "./data";

const ACTIVITY_ICONS: Record<string, React.ReactNode> = {
  completed: <CheckCircle2 className="h-3 w-3 text-green-500" />,
  deployment: <Server className="h-3 w-3 text-blue-500" />,
  comment: <MessageSquare className="h-3 w-3 text-accent" />,
  assignment: <UserPlus className="h-3 w-3 text-orange-500" />,
  visibility: <TrendingUp className="h-3 w-3 text-green-500" />,
  pr: <GitPullRequest className="h-3 w-3 text-accent" />,
  scan: <ScanLine className="h-3 w-3 text-cyan-500" />,
};

export function ActivityFeed() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Activity className="h-3.5 w-3.5 text-accent" />
        <p className="text-[10px] font-semibold uppercase tracking-widest text-foreground">Activity</p>
        <span className="text-[9px] text-muted-foreground/40 ml-auto">{ACTIVITY_ITEMS.length} events</span>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-[9px] top-1 bottom-1 w-px bg-border/50" />

        <div className="space-y-1">
          {ACTIVITY_ITEMS.map((item, i) => (
            <motion.div
              key={item.id}
              initial={mounted ? { opacity: 0, x: -8 } : undefined}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: 0.03 * i }}
              className="relative flex items-start gap-3 py-1.5 pl-1"
            >
              {/* Timeline dot */}
              <div className="relative z-10 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-background border border-border/60">
                {ACTIVITY_ICONS[item.type] || <Activity className="h-2.5 w-2.5 text-muted-foreground/50" />}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pt-0.5">
                <p className="text-[10px] text-muted-foreground/80 leading-relaxed">
                  <span className="font-medium text-foreground">{item.user}</span>{" "}
                  {item.message}
                </p>
                <span className="text-[8px] text-muted-foreground/40">{item.time}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
