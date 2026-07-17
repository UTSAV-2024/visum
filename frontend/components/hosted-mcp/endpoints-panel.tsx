"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Server,
  Copy,
  ExternalLink,
  Globe,
  Shield,
  Wifi,
  AlertTriangle,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { MCP_ENDPOINTS } from "./data";

function StatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = {
    healthy: "bg-green-500",
    warning: "bg-orange-500",
    critical: "bg-red-500",
    down: "bg-red-500",
  };
  return <span className={cn("inline-block h-1.5 w-1.5 rounded-full animate-pulse", colors[status] || "bg-muted-foreground")} />;
}

export function EndpointsPanel() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Server className="h-3.5 w-3.5 text-accent" />
        <p className="text-[10px] font-semibold uppercase tracking-widest text-foreground">Endpoints</p>
      </div>

      <div className="space-y-2">
        {MCP_ENDPOINTS.map((ep, i) => (
          <motion.div
            key={ep.id}
            initial={mounted ? { opacity: 0, y: 6 } : undefined}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.03 * i }}
            className="rounded-xl border border-border bg-card p-3 hover:border-accent/20 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <StatusDot status={ep.status} />
                <span className="text-[11px] font-semibold text-foreground">{ep.name}</span>
                <span className={cn(
                  "text-[9px] px-1.5 py-0.5 rounded-full font-medium",
                  ep.environment === "Production" ? "bg-green-500/10 text-green-500" :
                  ep.environment === "Preview" ? "bg-orange-500/10 text-orange-500" :
                  ep.environment === "Development" ? "bg-blue-500/10 text-blue-500" :
                  "bg-muted/10 text-muted-foreground"
                )}>{ep.environment}</span>
              </div>
              <button className="flex items-center gap-1 text-[8px] text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors">
                <Copy className="h-3 w-3" />
              </button>
            </div>

            <code className="block text-[9px] font-mono text-muted-foreground/60 mb-2 truncate">{ep.url}</code>

            <div className="grid grid-cols-4 gap-2 text-[9px]">
              <div>
                <span className="text-muted-foreground/40 block">Latency</span>
                <span className={cn("font-mono font-semibold", ep.status === "down" ? "text-muted-foreground/40" : "text-foreground")}>{ep.latency}</span>
              </div>
              <div>
                <span className="text-muted-foreground/40 block">Region</span>
                <span className="font-medium text-foreground">{ep.region}</span>
              </div>
              <div>
                <span className="text-muted-foreground/40 block">SSL</span>
                <span className={cn("font-medium", ep.ssl ? "text-green-500" : "text-red-500")}>{ep.ssl ? "Valid" : "N/A"}</span>
              </div>
              <div>
                <span className="text-muted-foreground/40 block">Errors</span>
                <span className={cn("font-mono font-semibold", ep.errors > 0 ? "text-red-500" : "text-green-500")}>{ep.errors}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
