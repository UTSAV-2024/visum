"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Pause,
  Play,
  Terminal,
  ArrowDown,
  X,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { CRAWL_LOGS, type CrawlLog } from "./data";
import { StatusDot, Panel } from "./shared";

const LOG_TYPE_ICONS: Record<string, string> = {
  request: "→",
  discovery: "◎",
  success: "✓",
  warning: "⚠",
  error: "✕",
  info: "i",
};

const LOG_TYPE_COLORS: Record<string, string> = {
  request: "text-blue-500",
  discovery: "text-accent",
  success: "text-green-500",
  warning: "text-orange-500",
  error: "text-red-500",
  info: "text-blue-500/70",
};

const LOG_FILTERS = [
  { id: "all", label: "All" },
  { id: "error", label: "Errors" },
  { id: "warning", label: "Warnings" },
  { id: "success", label: "Success" },
  { id: "request", label: "Requests" },
];

interface CrawlLogsProps {
  className?: string;
}

export function CrawlLogs({ className }: CrawlLogsProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [paused, setPaused] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(50);

  const filtered = useMemo(() => {
    let result = CRAWL_LOGS;
    if (filter !== "all") {
      result = result.filter((log) => log.type === filter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (log) =>
          log.message.toLowerCase().includes(q) ||
          log.detail?.toLowerCase().includes(q) ||
          log.time.includes(q)
      );
    }
    return result;
  }, [filter, search]);

  const displayed = useMemo(() => filtered.slice(0, visibleCount), [filtered, visibleCount]);

  // Auto-scroll
  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [displayed, autoScroll]);

  // Intersection observer for virtual loading
  const observerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = observerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < filtered.length) {
          setVisibleCount((prev) => Math.min(prev + 30, filtered.length));
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [filtered.length, visibleCount]);

  return (
    <Panel
      title="Crawl Logs"
      className={cn("flex flex-col", className)}
      actions={
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] font-mono tabular-nums text-muted-foreground/40">
            {filtered.length} events
          </span>
          <button
            onClick={() => setPaused(!paused)}
            className="flex items-center justify-center w-5 h-5 rounded text-muted-foreground/40 hover:text-foreground hover:bg-muted/20 transition-colors"
            aria-label={paused ? "Resume" : "Pause"}
          >
            {paused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
          </button>
        </div>
      }
    >
      {/* Search + filter bar */}
      <div className="px-3 py-2 border-b border-border flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground/30" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter logs..."
            className="w-full bg-muted/10 border border-border rounded-md pl-7 pr-2 py-1.5 text-[10px] font-mono text-foreground placeholder:text-muted-foreground/30 outline-none focus:border-accent/50 transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground/30 hover:text-foreground"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* Filter pills */}
      <div className="flex gap-1 px-3 py-1.5 border-b border-border/50 overflow-x-auto scrollbar-none">
        {LOG_FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={cn(
              "px-2 py-0.5 rounded text-[9px] font-medium transition-colors whitespace-nowrap",
              filter === f.id
                ? "bg-accent/10 text-accent"
                : "text-muted-foreground/50 hover:text-muted-foreground hover:bg-muted/10"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Log entries */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto font-mono scrollbar-thin"
        onScroll={() => {
          if (scrollRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
            const isAtBottom = scrollHeight - scrollTop - clientHeight < 30;
            if (isAtBottom !== autoScroll) setAutoScroll(isAtBottom);
          }
        }}
      >
        <div className="p-1.5 space-y-0.5 min-h-full">
          <AnimatePresence>
            {displayed.map((log, i) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.15, delay: Math.min(i * 0.01, 0.3) }}
                className="flex items-start gap-2 px-2 py-1.5 rounded hover:bg-muted/10 transition-colors group"
              >
                <span className="text-[9px] text-muted-foreground/30 shrink-0 w-14 tabular-nums">
                  {log.time}
                </span>
                <span className={cn("text-[10px] font-bold shrink-0 w-4", LOG_TYPE_COLORS[log.type])}>
                  {LOG_TYPE_ICONS[log.type]}
                </span>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] text-muted-foreground/80 group-hover:text-foreground transition-colors">
                    {log.message}
                  </span>
                  {log.detail && (
                    <span className="text-[9px] text-muted-foreground/40 ml-1.5">{log.detail}</span>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Infinite scroll sentinel */}
          <div ref={observerRef} className="h-2" />

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Terminal className="h-6 w-6 text-muted-foreground/20 mb-2" />
              <p className="text-[10px] text-muted-foreground/40">No logs match your filter</p>
            </div>
          )}
        </div>
      </div>

      {/* Auto-scroll indicator */}
      {!autoScroll && filtered.length > 0 && (
        <button
          onClick={() => {
            setAutoScroll(true);
            scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
          }}
          className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-accent/20 border border-accent/30 px-2.5 py-1 text-[9px] text-accent hover:bg-accent/30 transition-colors"
        >
          <ArrowDown className="h-3 w-3" />
          New logs
        </button>
      )}
    </Panel>
  );
}
