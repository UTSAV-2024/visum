"use client";

import { cn } from "../../lib/utils";

// ── Status Dot ──────────────────────────────────────────────────

export function StatusDot({ status, size = "sm" }: { status: string; size?: "sm" | "xs" }) {
  const colors: Record<string, string> = {
    healthy: "bg-green-500",
    warning: "bg-orange-500",
    critical: "bg-red-500",
    success: "bg-green-500",
    partial: "bg-yellow-500",
    skipped: "bg-orange-500",
    failed: "bg-red-500",
    unvisited: "bg-muted-foreground/30",
    request: "bg-blue-500",
    discovery: "bg-accent",
    info: "bg-blue-500",
    error: "bg-red-500",
  };

  return (
    <span className={cn("relative inline-flex shrink-0", size === "xs" ? "h-1.5 w-1.5" : "h-2 w-2")}>
      <span
        className={cn(
          "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
          colors[status] || "bg-muted-foreground"
        )}
      />
      <span
        className={cn("relative inline-flex h-full w-full rounded-full", colors[status] || "bg-muted-foreground")}
      />
    </span>
  );
}

// ── Badge ───────────────────────────────────────────────────────

export function Badge({ children, variant = "default", className }: {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "error" | "accent";
  className?: string;
}) {
  const variants: Record<string, string> = {
    default: "bg-muted/20 text-muted-foreground",
    success: "bg-green-500/10 text-green-500",
    warning: "bg-orange-500/10 text-orange-500",
    error: "bg-red-500/10 text-red-500",
    accent: "bg-accent/10 text-accent",
  };

  return (
    <span className={cn("inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[9px] font-semibold", variants[variant], className)}>
      {children}
    </span>
  );
}

// ── Panel ───────────────────────────────────────────────────────

export function Panel({ children, title, actions, className }: {
  children: React.ReactNode;
  title?: string;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-xl border border-border bg-card overflow-hidden", className)}>
      {title && (
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">{title}</p>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

// ── Tab bar ─────────────────────────────────────────────────────

export function TabBar({ tabs, active, onChange }: {
  tabs: { id: string; label: string }[];
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex border-b border-border overflow-x-auto scrollbar-none">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            "px-3 py-2 text-[10px] font-medium whitespace-nowrap transition-colors border-b-2 -mb-[1px] outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-inset",
            active === tab.id
              ? "border-accent text-foreground"
              : "border-transparent text-muted-foreground/60 hover:text-muted-foreground hover:border-muted-foreground/20"
          )}
          role="tab"
          aria-selected={active === tab.id}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
