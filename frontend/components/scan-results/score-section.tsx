import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "../../lib/utils";
import { getBand, getGrade } from "../../lib/scan-data";

/*
  The score reveal — Visum's signature moment.
  The gauge draws in like an instrument needle settling while the number
  counts up. Reduced motion: everything renders at its final state.
*/

function useCountUp(target, duration = 1400, enabled = true) {
  const [value, setValue] = useState(enabled ? 0 : target);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!enabled) {
      setValue(target);
      return;
    }
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      // ease-out-expo
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setValue(Math.round(eased * target));
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration, enabled]);

  return value;
}

export function ScoreSection({ score, url, checks, className }) {
  const reduce = useReducedMotion();
  const [isVisible, setIsVisible] = useState(false);
  const [animated, setAnimated] = useState(false);
  const band = getBand(score);
  const grade = getGrade(score);
  const displayScore = useCountUp(score, 1400, !reduce);

  const totalChecks = checks?.length || 0;
  const passedChecks = checks?.filter((c) => c.passed).length || 0;
  const failedChecks = checks?.filter((c) => !c.passed && !c.partial).length || 0;
  const partialChecks = checks?.filter((c) => c.partial).length || 0;

  const circumference = 2 * Math.PI * 80;

  useEffect(() => {
    setIsVisible(true);
    const t = setTimeout(() => setAnimated(true), 150);
    return () => clearTimeout(t);
  }, []);

  const drawn = reduce ? true : animated;
  const offset = circumference - (drawn ? score / 100 : 0) * circumference;

  // Verdict per check for the readout ledger (real data, no filler)
  const verdictFor = (c) =>
    c.passed
      ? { text: "pass", cls: "text-green-500" }
      : c.partial
      ? { text: "warn", cls: "text-orange-500" }
      : { text: "fail", cls: "text-red-500" };

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-5 transition-all duration-500",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        className
      )}
    >
      {/* The reveal — spans 3 cols */}
      <div className="scan-sweep relative overflow-hidden rounded-2xl border border-border bg-card p-6 sm:p-8 lg:col-span-3">
        <div className="relative z-10 flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:gap-8">
          {/* Gauge */}
          <div className="relative shrink-0">
            <svg className="h-40 w-40 -rotate-90 sm:h-48 sm:w-48" viewBox="0 0 200 200">
              <circle
                cx="100" cy="100" r="80" fill="none"
                stroke="currentColor" strokeWidth="7" className="text-muted/60"
              />
              <circle
                cx="100" cy="100" r="80" fill="none"
                stroke="currentColor"
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                className={band.text}
                style={{ transition: reduce ? "none" : "stroke-dashoffset 1.5s cubic-bezier(0.16, 1, 0.3, 1)" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={cn("font-mono text-5xl font-bold leading-none tabular-nums sm:text-6xl", band.text)}>
                {displayScore}
              </span>
              <span className="mt-1 font-mono text-xs text-muted-foreground">/ 100</span>
            </div>
          </div>

          {/* Verdict details */}
          <div className="flex min-w-0 flex-col gap-4">
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-xl text-lg font-extrabold ring-1",
                  grade.bg, grade.ring, grade.color
                )}
              >
                {grade.letter}
              </span>
              <div>
                <p className="text-sm font-bold text-foreground">{band.label}</p>
                <p className="text-xs text-muted-foreground">{grade.label}</p>
              </div>
            </div>

            <p className="max-w-[280px] truncate font-mono text-xs text-muted-foreground sm:max-w-[340px]">
              {url}
            </p>

            {/* Verdict breakdown */}
            <div className="mt-1 space-y-2">
              {[
                { label: "Passed", count: passedChecks, color: "bg-green-500" },
                { label: "Warnings", count: partialChecks, color: "bg-orange-500" },
                { label: "Failed", count: failedChecks, color: "bg-red-500" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2.5">
                  <span className="w-16 text-[11px] text-muted-foreground">{item.label}</span>
                  <div className="h-1.5 w-32 overflow-hidden rounded-full bg-muted/40 sm:w-44">
                    <div
                      className={cn("h-full rounded-full", item.color)}
                      style={{
                        width: `${totalChecks > 0 ? (item.count / totalChecks) * 100 : 0}%`,
                        transition: reduce ? "none" : "width 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.5s",
                      }}
                    />
                  </div>
                  <span className="w-6 text-right font-mono text-[11px] font-bold tabular-nums text-foreground">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* The readout ledger — real per-check data, spans 2 cols */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card lg:col-span-2">
        <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
          <span className="font-mono text-[11px] text-muted-foreground">scan readout</span>
          <span className="font-mono text-[11px] text-primary">{totalChecks} checks</span>
        </div>
        <div className="px-4 py-3 font-mono text-[12px] leading-[2.05]">
          {(checks || []).map((c) => {
            const v = verdictFor(c);
            return (
              <div key={c.name} className="flex items-baseline justify-between gap-3">
                <span className="truncate text-muted-foreground">{c.name}</span>
                <span className="flex shrink-0 items-baseline gap-2.5">
                  <span className="tabular-nums text-foreground/80">
                    {c.score}/{c.max_score}
                  </span>
                  <span className={cn("w-9 text-right", v.cls)}>{v.text}</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
