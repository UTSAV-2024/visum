import { useEffect, useState, useMemo } from "react";
import { cn } from "../../lib/utils";

const tokenData = [
  { label: "GPT-4o", tokens: 2450000, color: "#7c3aed" },
  { label: "Claude 3.5", tokens: 1820000, color: "#6366f1" },
  { label: "Gemini Pro", tokens: 980000, color: "#3b82f6" },
  { label: "Perplexity", tokens: 650000, color: "#06b6d4" },
  { label: "Others", tokens: 420000, color: "#10b981" },
];

const totalTokens = tokenData.reduce((s, t) => s + t.tokens, 0);

export function TokenConsumption({ className }: { className?: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const [animated, setAnimated] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    setIsVisible(true);
    const t = setTimeout(() => setAnimated(true), 300);
    return () => clearTimeout(t);
  }, []);

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const sorted = [...tokenData].sort((a, b) => b.tokens - a.tokens);

  const segments = useMemo(() => {
    let cum = 0;
    return sorted.map((item) => {
      const percent = item.tokens / totalTokens;
      const offset = cum;
      cum += percent;
      return { percent, dashArray: percent * circumference, dashOffset: offset * circumference };
    });
  }, []);

  return (
    <div
      className={cn(
        "relative rounded-2xl border border-border bg-card transition-all duration-500 hover:shadow-[0_0_40px_-16px_rgba(124,58,237,0.12)]",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.02] to-transparent pointer-events-none rounded-2xl" />

      <div className="relative z-10 p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 text-accent" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.362 1.093a.75.75 0 00-.724 0L2.523 5.018 10 9.143l7.477-4.125-7.115-3.925zM18 6.443l-7.25 4v8.25l6.862-3.786A.75.75 0 0018 14.25V6.443zm-8.75 12.25v-8.25l-7.25-4v7.807a.75.75 0 00.388.657l6.862 3.786z" />
            </svg>
            <p className="text-xs font-semibold uppercase tracking-widest text-foreground">
              Token Consumption
            </p>
          </div>
          <span className="text-[10px] text-muted-foreground/60">
            {(totalTokens / 1000000).toFixed(1)}M total
          </span>
        </div>

        <div className="flex flex-col items-center">
          {/* Donut chart */}
          <div className="relative w-44 h-44">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
              {sorted.map((item, idx) => {
                const seg = segments[idx];
                const dashOffset = animated ? -seg.dashOffset : 0;

                return (
                  <circle
                    key={item.label}
                    cx="80"
                    cy="80"
                    r={radius}
                    fill="none"
                    stroke={item.color}
                    strokeWidth="20"
                    strokeDasharray={`${seg.dashArray} ${circumference - seg.dashArray}`}
                    strokeDashoffset={dashOffset}
                    className="transition-all duration-1000 ease-out"
                    style={{
                      opacity: hovered === null || hovered === idx ? 1 : 0.3,
                      transition: `stroke-dashoffset 1.2s ease-out ${idx * 100}ms, opacity 0.2s`,
                      strokeLinecap: "round",
                    }}
                    onMouseEnter={() => setHovered(idx)}
                    onMouseLeave={() => setHovered(null)}
                  />
                );
              })}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-mono text-2xl font-bold tabular-nums text-foreground">
                {(totalTokens / 1000000).toFixed(1)}M
              </span>
              <span className="text-[10px] text-muted-foreground">tokens</span>
            </div>
          </div>

          {/* Legend */}
          <div className="w-full mt-4 space-y-2">
            {sorted.map((item, idx) => {
              const percent = ((item.tokens / totalTokens) * 100).toFixed(1);
              return (
                <div
                  key={item.label}
                  className={cn(
                    "flex items-center justify-between px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer",
                    hovered === idx ? "bg-muted/30" : "hover:bg-muted/10"
                  )}
                  onMouseEnter={() => setHovered(idx)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-xs text-foreground">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs tabular-nums text-muted-foreground">
                      {(item.tokens / 1000000).toFixed(1)}M
                    </span>
                    <span className="text-[10px] font-medium text-muted-foreground/60 w-10 text-right">
                      {percent}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
