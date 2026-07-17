"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Terminal,
  Search,
  Pause,
  Play,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { MCP_LOGS } from "./data";

const TYPE_STYLES: Record<string, { dot: string; label: string }> = {
  request: { dot: "bg-blue-500", label: "REQ" },
  response: { dot: "bg-green-500", label: "RES" },
  info: { dot: "bg-accent", label: "INF" },
  warning: { dot: "bg-orange-500", label: "WRN" },
  error: { dot: "bg-red-500", label: "ERR" },
};

export function LogsPanel() {
  const [mounted, setMounted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  useEffect(() => setMounted(true), []);

  const filtered = MCP_LOGS.filter((log) => {
    if (filter !== "all" && log.type !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        log.message.toLowerCase().includes(q) ||
        log.tool.toLowerCase().includes(q) ||
        log.client.toLowerCase().includes(q) ||
        log.path.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Auto-scroll
  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [filtered, autoScroll]);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    setAutoScroll(scrollHeight - scrollTop - clientHeight < 30);
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Terminal className="h-3.5 w-3.5 text-accent" />
        <p className="text-[10px] font-semibold uppercase tracking-widest text-foreground">Logs</p>
        <span className="text-[9px] text-muted-foreground/40 ml-auto">{MCP_LOGS.length} events</span>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-1.5 mb-2 flex-wrap">
        <div className="relative flex-1 sm:flex-none sm:w-44">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground/40 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search logs..."
            className="w-full h-7 rounded-md border border-border bg-muted/5 pl-7 pr-2 text-[10px] text-foreground placeholder:text-muted-foreground/30 outline-none focus:border-accent/50 transition-all"
          />
        </div>
        <div className="flex items-center gap-0.5 rounded-md border border-border bg-muted/5 p-0.5">
          {["all", "request", "response", "error", "warning"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-1.5 py-0.5 text-[9px] rounded transition-all",
                filter === f ? "bg-accent text-white" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {f === "all" ? "All" : f.slice(0, 3).toUpperCase()}
            </button>
          ))}
        </div>
        <button
          onClick={() => setPaused(!paused)}
          className="flex items-center gap-1 h-7 rounded-md border border-border bg-muted/5 px-2 text-[9px] text-muted-foreground hover:text-foreground transition-colors"
        >
          {paused ? <Play className="h-2.5 w-2.5" /> : <Pause className="h-2.5 w-2.5" />}
        </button>
      </div>

      {/* Log list */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="rounded-xl border border-border bg-[#0a0a0f] overflow-hidden"
        style={{ maxHeight: "400px" }}
      >
        <div className="p-2 font-mono text-[10px] leading-relaxed space-y-0.5">
          {filtered.length === 0 ? (
            <p className="text-muted-foreground/40 text-center py-8 text-[11px]">No logs match your filters</p>
          ) : (
            filtered.map((log) => {
              const style = TYPE_STYLES[log.type];
              return (
                <motion.div
                  key={log.id}
                  initial={mounted ? { opacity: 0 } : undefined}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.1 }}
                  className={cn(
                    "flex items-start gap-2 px-2 py-1 rounded hover:bg-white/[0.02] transition-colors",
                    log.type === "error" && "bg-red-500/5",
                    log.type === "warning" && "bg-orange-500/5"
                  )}
                >
                  {/* Timestamp */}
                  <span className="text-[8px] text-muted-foreground/30 shrink-0 w-16 tabular-nums">{log.timestamp}</span>

                  {/* Type badge */}
                  <span className={cn("text-[8px] font-semibold uppercase shrink-0 w-7", style.dot.replace("bg-", "text-").replace("-500", "-500/80"))}>
                    {style.label}
                  </span>

                  {/* Status code */}
                  <span className={cn(
                    "text-[9px] font-semibold w-8 shrink-0 tabular-nums",
                    log.status >= 200 && log.status < 300 ? "text-green-500/70" :
                    log.status >= 400 && log.status < 500 ? "text-orange-500/70" :
                    log.status >= 500 ? "text-red-500/70" :
                    "text-muted-foreground/40"
                  )}>
                    {log.status}
                  </span>

                  {/* Duration */}
                  <span className="text-[8px] text-muted-foreground/30 w-12 shrink-0 tabular-nums">{log.duration}</span>

                  {/* Message */}
                  <span className={cn(
                    "flex-1 truncate text-[9px]",
                    log.type === "error" ? "text-red-400/80" :
                    log.type === "warning" ? "text-orange-400/80" :
                    "text-muted-foreground/70"
                  )}>
                    {log.message}
                  </span>

                  {/* Client */}
                  <span className="text-[8px] text-muted-foreground/30 shrink-0 hidden sm:inline">{log.client}</span>
                </motion.div>
              );
            })
          )}
        </div>
      </div>

      {/* Log count */}
      <div className="flex items-center justify-between mt-1.5 text-[8px] text-muted-foreground/40">
        <span>{filtered.length} of {MCP_LOGS.length} events</span>
        {!autoScroll && (
          <button
            onClick={() => { setAutoScroll(true); scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight); }}
            className="text-accent hover:text-accent/80 transition-colors"
          >
            Scroll to latest
          </button>
        )}
      </div>
    </div>
  );
}
