"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  Gauge,
  Cpu,
  Database,
  HardDrive,
  Wifi,
  Users,
  GitCommit,
  Timer,
  Network,
  CheckCircle2,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { MCP_SERVER } from "./data";

function AnimatedGauge({ value, label, icon, unit, status }: { value: number; label: string; icon: React.ReactNode; unit: string; status?: string }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => setDisplay(value), 300);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div className="rounded-lg border border-border/60 bg-muted/5 p-3">
      <div className="flex items-center gap-1.5 mb-2">
        <span className={cn("text-muted-foreground/60", status === "warning" && "text-orange-500", status === "critical" && "text-red-500")}>
          {icon}
        </span>
        <span className="text-[9px] font-medium text-muted-foreground/60">{label}</span>
      </div>
      <div className="flex items-baseline gap-0.5">
        <span className={cn(
          "text-lg font-bold font-mono tabular-nums",
          value >= 80 ? "text-red-500" : value >= 60 ? "text-orange-500" : "text-foreground"
        )}>
          {display}{unit}
        </span>
      </div>
      {/* Mini bar */}
      <div className="mt-1.5 h-1 rounded-full bg-muted/10 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${display}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={cn(
            "h-full rounded-full",
            value >= 80 ? "bg-red-500" : value >= 60 ? "bg-orange-500" : "bg-green-500/60"
          )}
        />
      </div>
    </div>
  );
}

export function ServerStatus() {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Activity className="h-3.5 w-3.5 text-accent" />
        <p className="text-[10px] font-semibold uppercase tracking-widest text-foreground">Server Health</p>
        <span className="ml-auto inline-flex items-center gap-1 text-[9px] text-green-500">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
          Live
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <AnimatedGauge value={MCP_SERVER.cpu} label="CPU" icon={<Cpu className="h-3.5 w-3.5" />} unit="%" />
        <AnimatedGauge value={MCP_SERVER.memory} label="Memory" icon={<Database className="h-3.5 w-3.5" />} unit="%" status={MCP_SERVER.memory >= 60 ? "warning" : undefined} />
        <AnimatedGauge value={MCP_SERVER.storage * 10} label="Storage" icon={<HardDrive className="h-3.5 w-3.5" />} unit="%" />
        <AnimatedGauge value={MCP_SERVER.concurrentConnections} label="Connections" icon={<Users className="h-3.5 w-3.5" />} unit="" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
        <div className="rounded-lg border border-border/60 bg-muted/5 p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <Timer className="h-3 w-3 text-muted-foreground/50" />
            <span className="text-[9px] text-muted-foreground/50">Latency</span>
          </div>
          <p className="text-sm font-bold text-green-500 font-mono">{MCP_SERVER.latency}</p>
        </div>
        <div className="rounded-lg border border-border/60 bg-muted/5 p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <Wifi className="h-3 w-3 text-muted-foreground/50" />
            <span className="text-[9px] text-muted-foreground/50">Network</span>
          </div>
          <p className="text-sm font-bold text-foreground font-mono">{MCP_SERVER.network}</p>
        </div>
        <div className="rounded-lg border border-border/60 bg-muted/5 p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <CheckCircle2 className="h-3 w-3 text-muted-foreground/50" />
            <span className="text-[9px] text-muted-foreground/50">Success</span>
          </div>
          <p className="text-sm font-bold text-green-500 font-mono">{MCP_SERVER.requestSuccess}%</p>
        </div>
        <div className="rounded-lg border border-border/60 bg-muted/5 p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <Network className="h-3 w-3 text-muted-foreground/50" />
            <span className="text-[9px] text-muted-foreground/50">Queue</span>
          </div>
          <p className="text-sm font-bold text-foreground font-mono">{MCP_SERVER.queueDepth}</p>
        </div>
      </div>
    </div>
  );
}
