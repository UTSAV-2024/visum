"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wrench,
  Search,
  ToggleLeft,
  ToggleRight,
  Shield,
  ChevronDown,
  Terminal,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { MCP_TOOLS, type MCPTool } from "./data";

function HealthDot({ status }: { status: string }) {
  const colors: Record<string, string> = {
    healthy: "bg-green-500",
    warning: "bg-orange-500",
    critical: "bg-red-500",
  };
  return <span className={cn("inline-block h-1.5 w-1.5 rounded-full", colors[status] || "bg-muted-foreground")} />;
}

export function ToolsPanel() {
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  useEffect(() => setMounted(true), []);

  const filtered = MCP_TOOLS.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Wrench className="h-3.5 w-3.5 text-accent" />
        <p className="text-[10px] font-semibold uppercase tracking-widest text-foreground">Registered Tools</p>
        <span className="text-[9px] text-muted-foreground/40 ml-auto">{MCP_TOOLS.filter((t) => t.enabled).length} active</span>
      </div>

      {/* Search */}
      <div className="relative mb-3">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground/40 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tools..."
          className="w-full h-8 rounded-lg border border-border bg-muted/5 pl-8 pr-3 text-[11px] text-foreground placeholder:text-muted-foreground/30 outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all"
        />
      </div>

      <div className="space-y-1.5">
        {filtered.map((tool, i) => (
          <motion.div
            key={tool.id}
            initial={mounted ? { opacity: 0, y: 4 } : undefined}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15, delay: 0.02 * i }}
          >
            <div
              onClick={() => setExpanded(expanded === tool.id ? null : tool.id)}
              className={cn(
                "rounded-xl border transition-all cursor-pointer",
                expanded === tool.id ? "border-accent/30 bg-accent/[0.02]" : "border-border bg-card hover:border-accent/20"
              )}
            >
              <div className="flex items-center gap-3 p-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted/10">
                  <Wrench className="h-3.5 w-3.5 text-muted-foreground/60" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <code className="text-[11px] font-semibold text-foreground font-mono">{tool.name}</code>
                    <HealthDot status={tool.health} />
                    <span className={cn("text-[9px]", tool.health === "healthy" ? "text-green-500" : tool.health === "warning" ? "text-orange-500" : "text-red-500")}>
                      {tool.health}
                    </span>
                  </div>
                  <p className="text-[9px] text-muted-foreground/60 mt-0.5">{tool.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] text-muted-foreground/50 font-mono">{tool.avgLatency}</span>
                  <span className="text-[9px] text-muted-foreground/50">{tool.enabled ? <ToggleRight className="h-4 w-4 text-green-500" /> : <ToggleLeft className="h-4 w-4 text-muted-foreground/30" />}</span>
                </div>
                <ChevronDown className={cn("h-3 w-3 text-muted-foreground/30 transition-transform shrink-0", expanded === tool.id && "rotate-180")} />
              </div>

              <AnimatePresence>
                {expanded === tool.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-3 pb-3 pt-0 space-y-2 border-t border-border/50">
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        <div className="rounded-lg bg-muted/5 border border-border/40 p-2">
                          <span className="text-[8px] text-muted-foreground/50 block">Invocations</span>
                          <span className="text-[10px] font-semibold text-foreground font-mono">{tool.invocationCount.toLocaleString()}</span>
                        </div>
                        <div className="rounded-lg bg-muted/5 border border-border/40 p-2">
                          <span className="text-[8px] text-muted-foreground/50 block">Last Used</span>
                          <span className="text-[10px] font-semibold text-foreground">{tool.lastUsed}</span>
                        </div>
                        <div className="rounded-lg bg-muted/5 border border-border/40 p-2">
                          <span className="text-[8px] text-muted-foreground/50 block">Version</span>
                          <span className="text-[10px] font-semibold text-foreground font-mono">{tool.version}</span>
                        </div>
                      </div>

                      <div className="rounded-lg bg-muted/5 border border-border/40 p-2">
                        <span className="text-[8px] text-muted-foreground/50 block mb-1">Input Schema</span>
                        <code className="text-[9px] font-mono text-muted-foreground/70">{tool.schema}</code>
                      </div>

                      <div className="flex items-center gap-2">
                        {tool.requiresAuth && <span className="flex items-center gap-1 text-[8px] text-accent"><Shield className="h-2.5 w-2.5" /> Auth Required</span>}
                        <button className="flex items-center gap-1 ml-auto rounded-md bg-accent/10 px-2 py-1 text-[8px] font-semibold text-accent hover:bg-accent/20 transition-colors">
                          <Terminal className="h-2.5 w-2.5" />
                          Test
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
