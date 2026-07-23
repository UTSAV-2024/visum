"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Activity,
  Server,
  Zap,
  BarChart3,
  FileText,
  Users,
  Globe,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Target,
  Gauge,
} from "lucide-react";
import { cn } from "../../lib/utils";

// ── Shapes fed from real scan-derived data (lib/derive-from-scans.js) ──

interface Highlight {
  id: string;
  type: "positive" | "warning" | "neutral";
  message: string;
  time: string;
  href?: string;
}

interface RecommendedAction {
  id: string;
  title: string;
  impact: number;
  priority: "critical" | "high" | "medium" | "low";
  completed?: boolean;
  href: string;
}

export interface HeroData {
  firstName: string;
  domain: string;
  score: number;
  previousScore: number | null;
  delta: number | null;
  band: string;
  health: "healthy" | "warning" | "critical";
  lastScanLabel: string;
  executiveSummary: string;
  highlights: Highlight[];
  recommendedActions: RecommendedAction[];
}

const QUICK_ACTIONS: {
  id: string;
  label: string;
  icon: string;
  href: string;
  primary?: boolean;
}[] = [
  { id: "qa1", label: "Run a scan", icon: "scan", href: "/#scan", primary: true },
  { id: "qa2", label: "View reports", icon: "chart", href: "/reports" },
  { id: "qa3", label: "Recommendations", icon: "file", href: "/recommendations" },
  { id: "qa4", label: "Compare competitors", icon: "globe", href: "/competitors" },
];

// ── Utility ─────────────────────────────────────────────────────

function getTimeGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

const greeting = getTimeGreeting();

// ── Status Dot ──────────────────────────────────────────────────

function StatusDot({ status, size = "sm" }: { status: string; size?: "sm" | "xs" }) {
  const colors: Record<string, string> = {
    healthy: "bg-green-500",
    warning: "bg-orange-500",
    critical: "bg-red-500",
    online: "bg-green-500",
    up: "bg-green-500",
    down: "bg-red-500",
    stable: "bg-blue-500",
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
        className={cn(
          "relative inline-flex h-full w-full rounded-full",
          colors[status] || "bg-muted-foreground"
        )}
      />
    </span>
  );
}

// ── Animated Counter ────────────────────────────────────────────

function AnimatedNumber({ value, duration = 1500 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<number | null>(null);

  useEffect(() => {
    const start = performance.now();
    function animate(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(0 + (value - 0) * eased));
      if (progress < 1) {
        ref.current = requestAnimationFrame(animate);
      }
    }
    ref.current = requestAnimationFrame(animate);
    return () => {
      if (ref.current) cancelAnimationFrame(ref.current);
    };
  }, [value, duration]);

  return <>{display}</>;
}

// ── Highlight Icon ──────────────────────────────────────────────

function HighlightIcon({ type }: { type: string }) {
  if (type === "positive") {
    return (
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-500/10">
        <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
      </div>
    );
  }
  return (
    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-500/10">
      <AlertTriangle className="h-3.5 w-3.5 text-orange-500" />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════
//  LEFT SECTION – Greeting + Executive Summary
// ═════════════════════════════════════════════════════════════════

function GreetingSection({
  firstName,
  domain,
  summary,
}: {
  firstName: string;
  domain: string;
  summary: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-3"
    >
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          {greeting}
          {firstName ? `, ${firstName}` : ""}.
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground/70 mt-1">
          Here&apos;s your AI-readiness overview for{" "}
          <span className="font-medium text-foreground/80">{domain}</span>
        </p>
      </div>

      {/* Executive Summary — built from the real scan numbers */}
      <div className="relative rounded-xl border border-accent/10 bg-gradient-to-br from-accent/[0.03] to-transparent p-4">
        <div className="absolute top-3 right-3">
          <Sparkles className="h-3.5 w-3.5 text-accent/40" />
        </div>
        <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground/80 pr-6">
          {summary}
        </p>
      </div>
    </motion.div>
  );
}

// ═════════════════════════════════════════════════════════════════
//  CENTERPIECE – AI Visibility Score (NO gauge — premium stat block)
// ═════════════════════════════════════════════════════════════════

function ScoreCenterpiece({ data }: { data: HeroData }) {
  const { score, delta, band, health, lastScanLabel } = data;
  const isUp = (delta ?? 0) > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
      className="relative overflow-hidden rounded-2xl border border-border bg-card"
    >
      {/* Ambient glow */}
      <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-accent/5 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-green-500/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-accent" />
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
              AI Visibility Score
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-green-500">
            <StatusDot status={health} size="xs" />
            {health.charAt(0).toUpperCase() + health.slice(1)}
          </span>
        </div>

        {/* Premium stat block — no gauge */}
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-8">
          {/* Large score */}
          <div className="flex items-baseline gap-0">
            <span className="font-mono text-5xl sm:text-6xl lg:text-7xl font-bold leading-none tabular-nums text-foreground">
              <AnimatedNumber value={score} duration={1800} />
            </span>
            <span className="font-mono text-lg sm:text-xl text-muted-foreground/30 ml-1">/100</span>
          </div>

          {/* Score details */}
          <div className="flex flex-wrap items-center gap-2.5 pb-1">
            {/* Trend badge — only when we have a prior scan to compare against */}
            {delta != null && (
              <div
                className={cn(
                  "inline-flex items-center gap-1 rounded-lg px-2.5 py-1",
                  isUp ? "bg-green-500/10" : delta < 0 ? "bg-red-500/10" : "bg-muted/20"
                )}
              >
                <TrendingUp
                  className={cn(
                    "h-3.5 w-3.5",
                    isUp ? "text-green-500" : delta < 0 ? "text-red-500" : "text-muted-foreground"
                  )}
                />
                <span
                  className={cn(
                    "text-xs font-semibold tabular-nums",
                    isUp ? "text-green-500" : delta < 0 ? "text-red-500" : "text-muted-foreground"
                  )}
                >
                  {isUp ? "+" : ""}
                  {delta}
                </span>
              </div>
            )}

            {/* Band */}
            <div className="inline-flex items-center gap-1 rounded-lg bg-accent/10 px-2.5 py-1">
              <Gauge className="h-3.5 w-3.5 text-accent" />
              <span className="text-xs font-semibold text-accent">{band}</span>
            </div>

            {/* Last scan */}
            <div className="inline-flex items-center gap-1 text-[10px] text-muted-foreground/60 px-1">
              <Clock className="h-3 w-3" />
              <span>{lastScanLabel}</span>
            </div>
          </div>
        </div>

        {/* Delta bar */}
        <div className="mt-4 flex items-center gap-3">
          {delta != null && (
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-muted-foreground/50">Change from last scan:</span>
              <span
                className={cn(
                  "font-semibold tabular-nums",
                  isUp ? "text-green-500" : delta < 0 ? "text-red-500" : "text-muted-foreground"
                )}
              >
                {isUp ? "+" : ""}
                {delta} pts
              </span>
              {isUp ? (
                <ArrowUpRight className="h-3.5 w-3.5 text-green-500" />
              ) : delta < 0 ? (
                <ArrowDownRight className="h-3.5 w-3.5 text-red-500" />
              ) : null}
            </div>
          )}

          {/* Progress bar */}
          <div className="flex-1 max-w-[200px] h-1 rounded-full bg-border/60 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${score}%` }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
              className="h-full rounded-full bg-gradient-to-r from-accent to-green-500"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ═════════════════════════════════════════════════════════════════
//  TODAY'S HIGHLIGHTS
// ═════════════════════════════════════════════════════════════════

function TodaysHighlights({ highlights }: { highlights: Highlight[] }) {
  if (highlights.length === 0) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
      className="rounded-xl border border-border bg-card overflow-hidden"
    >
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-3.5 w-3.5 text-accent" />
            <p className="text-[10px] font-semibold uppercase tracking-widest text-foreground">
              Highlights
            </p>
          </div>
          <span className="text-[9px] text-muted-foreground/40">{highlights.length} events</span>
        </div>
      </div>

      <div className="divide-y divide-border/50">
        <AnimatePresence>
          {highlights.map((h: Highlight, i: number) => (
            <motion.div
              key={h.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 + i * 0.08 }}
            >
              <Link
                href={h.href || "#"}
                aria-label={`View highlight: ${h.message}`}
                className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/15 transition-colors group focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-1 focus-visible:ring-offset-background outline-none"
              >
                <HighlightIcon type={h.type} />
                <p className="flex-1 text-xs text-muted-foreground group-hover:text-foreground transition-colors truncate">
                  {h.message}
                </p>
                <span className="text-[9px] text-muted-foreground/40 shrink-0">{h.time}</span>
                <ChevronRight className="h-3 w-3 text-muted-foreground/20 group-hover:text-muted-foreground/60 transition-colors shrink-0" />
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ═════════════════════════════════════════════════════════════════
//  RIGHT PANEL – Recommended Actions
// ═════════════════════════════════════════════════════════════════

function RecommendedActions({ actions }: { actions: RecommendedAction[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.25 }}
      className="rounded-xl border border-border bg-card overflow-hidden h-full flex flex-col"
    >
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-3.5 w-3.5 text-accent" />
            <p className="text-[10px] font-semibold uppercase tracking-widest text-foreground">
              Recommended
            </p>
          </div>
          <Link
            href="/recommendations"
            className="text-[9px] text-accent hover:text-accent/80 transition-colors"
          >
            View all
          </Link>
        </div>
      </div>

      {actions.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center px-4 py-8 text-center">
          <CheckCircle2 className="h-7 w-7 text-green-500/60 mb-2" />
          <p className="text-xs font-medium text-muted-foreground">Nothing outstanding</p>
          <p className="text-[10px] text-muted-foreground/60 mt-0.5">
            You&apos;re passing every measured check
          </p>
        </div>
      ) : (
      <div className="flex-1 divide-y divide-border/50">
        {actions.map((action: RecommendedAction, i: number) => (
          <motion.div
            key={action.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 + i * 0.08 }}
          >
            <Link
              href={action.href}
              className={cn(
                "flex items-start gap-3 px-4 py-3 hover:bg-muted/10 transition-colors group",
                action.completed && "opacity-60"
              )}
              aria-label={action.completed ? `${action.title} — Completed` : action.title}
            >
              {/* Priority indicator */}
              <div
                className={cn(
                  "mt-1 h-2 w-2 shrink-0 rounded-full",
                  action.completed
                    ? "bg-green-500"
                    : action.priority === "critical"
                    ? "bg-red-500"
                    : action.priority === "high"
                    ? "bg-orange-500"
                    : action.priority === "medium"
                    ? "bg-accent"
                    : "bg-blue-500"
                )}
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p
                    className={cn(
                      "text-xs font-medium",
                      action.completed ? "text-muted-foreground line-through" : "text-foreground"
                    )}
                  >
                    {action.title}
                  </p>
                  {action.completed && (
                    <CheckCircle2 className="h-3 w-3 text-green-500 shrink-0" />
                  )}
                </div>

                <div className="flex items-center gap-2 mt-0.5">
                  {!action.completed && action.impact > 0 && (
                    <span className="inline-flex items-center gap-0.5 rounded bg-green-500/10 px-1.5 py-0.5 text-[8px] font-semibold text-green-500">
                      +{action.impact} pts to recover
                    </span>
                  )}
                  {!action.completed && action.impact === 0 && (
                    <span className="text-[8px] font-semibold text-muted-foreground/50 uppercase tracking-wider">
                      {action.priority} priority
                    </span>
                  )}
                  {action.completed && (
                    <span className="text-[9px] text-muted-foreground/40">Completed</span>
                  )}
                </div>
              </div>

              {/* CTA button */}
              {!action.completed && (
                <span className="inline-flex items-center gap-1 rounded-md bg-accent/10 px-2 py-1 text-[9px] font-semibold text-accent opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5">
                  View
                  <ArrowRight className="h-2.5 w-2.5" />
                </span>
              )}
            </Link>
          </motion.div>
        ))}
      </div>
      )}
    </motion.div>
  );
}

// ═════════════════════════════════════════════════════════════════
//  QUICK ACTIONS BAR
// ═════════════════════════════════════════════════════════════════

function QuickActionsBar() {
  const iconMap: Record<string, React.ReactNode> = {
    scan: <Zap className="h-4 w-4" />,
    chart: <BarChart3 className="h-4 w-4" />,
    file: <FileText className="h-4 w-4" />,
    globe: <Globe className="h-4 w-4" />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
      className="flex flex-wrap gap-2"
    >
      {QUICK_ACTIONS.map((action) => (
        <Link
          key={action.id}
          href={action.href}
          className={cn(
            "inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-semibold transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-1 focus-visible:ring-offset-background",
            action.primary
              ? "bg-accent text-white hover:bg-accent/90 shadow-sm hover:shadow-[0_0_20px_-8px_rgba(124,58,237,0.4)]"
              : "border border-border bg-card text-muted-foreground hover:text-foreground hover:border-accent/30 hover:bg-muted/20"
          )}
          aria-label={action.label}
        >
          {iconMap[action.icon]}
          {action.label}
        </Link>
      ))}
    </motion.div>
  );
}

// ═════════════════════════════════════════════════════════════════
//  HERO SKELETON
// ═════════════════════════════════════════════════════════════════

function HeroSkeleton() {
  return (
    <div className="space-y-4 sm:space-y-5 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-5">
        <div className="md:col-span-1 lg:col-span-3 space-y-4">
          <div className="rounded-xl bg-card border border-border h-24 animate-pulse" />
          <div className="rounded-xl bg-card border border-border h-44 animate-pulse" />
        </div>
        <div className="md:col-span-1 lg:col-span-6 space-y-4">
          <div className="rounded-2xl bg-card border border-border h-36 animate-pulse" />
          <div className="rounded-xl bg-card border border-border h-52 animate-pulse" />
          <div className="rounded-xl bg-card border border-border h-32 animate-pulse" />
        </div>
        <div className="lg:col-span-3">
          <div className="rounded-xl bg-card border border-border h-[380px] animate-pulse" />
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="rounded-lg bg-card border border-border h-9 w-28 animate-pulse" />
        ))}
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════
//  MAIN EXPORT
// ═════════════════════════════════════════════════════════════════

interface CommandCenterHeroProps {
  loading?: boolean;
  data?: HeroData | null;
}

export function CommandCenterHero({ loading, data }: CommandCenterHeroProps) {
  if (loading) return <HeroSkeleton />;

  // No scans yet — an honest onboarding prompt rather than a wall of zeros.
  if (!data) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center sm:p-12">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
          <Target className="h-6 w-6 text-accent" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          {greeting}. Let&apos;s see how AI reads your site.
        </h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Run your first scan and this dashboard fills with your real score, issues, and
          the fixes that move it — all from your own site.
        </p>
        <Link
          href="/#scan"
          className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground no-underline transition-colors hover:bg-primary/90"
        >
          <Zap className="h-4 w-4" />
          Run your first scan
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Main grid — tablet: 2-col, desktop: 3-col */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-5">
        {/* ── Left Column: Greeting + Summary ────────────────── */}
        <div className="md:col-span-1 lg:col-span-3 space-y-4">
          <GreetingSection
            firstName={data.firstName}
            domain={data.domain}
            summary={data.executiveSummary}
          />
        </div>

        {/* ── Center Column: Score + Highlights ──────────────── */}
        <div className="md:col-span-1 lg:col-span-6 space-y-4">
          <ScoreCenterpiece data={data} />
          <TodaysHighlights highlights={data.highlights} />
        </div>

        {/* ── Right Column: Recommended Actions ─────────────── */}
        <div className="md:col-span-2 lg:col-span-3 flex flex-col">
          <RecommendedActions actions={data.recommendedActions} />
        </div>
      </div>

      {/* ── Quick Actions ─────────────────────────────────────── */}
      <QuickActionsBar />
    </div>
  );
}
