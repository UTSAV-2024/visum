import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";

const trafficData = [
  { day: "Mon", value: 45, ai: 12 },
  { day: "Tue", value: 52, ai: 18 },
  { day: "Wed", value: 48, ai: 15 },
  { day: "Thu", value: 70, ai: 28 },
  { day: "Fri", value: 65, ai: 24 },
  { day: "Sat", value: 58, ai: 22 },
  { day: "Sun", value: 72, ai: 30 },
];

interface AITrafficTrendProps {
  className?: string;
}

export function AITrafficTrend({ className }: AITrafficTrendProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedBars, setAnimatedBars] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timeout = setTimeout(() => setAnimatedBars(true), 400);
    return () => clearTimeout(timeout);
  }, []);

  const maxValue = Math.max(...trafficData.map((d) => d.value));

  return (
    <div
      className={cn(
        "relative rounded-2xl border border-border bg-card p-5 transition-all duration-500 hover:border-accent/30 group",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.02] to-transparent pointer-events-none rounded-2xl" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              AI Traffic Trend
            </p>
            <p className="text-[10px] text-muted-foreground/60 mt-0.5">
              Last 7 days
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-accent" />
              <span className="text-[10px] text-muted-foreground">AI Traffic</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-muted-foreground/30" />
              <span className="text-[10px] text-muted-foreground">Total</span>
            </div>
          </div>
        </div>

        {/* Chart area */}
        <div className="flex items-end gap-2 sm:gap-3 h-28 sm:h-32">
          {trafficData.map((item, idx) => (
            <div key={item.day} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
              <div className="relative w-full flex items-end justify-center gap-[2px] h-full">
                {/* AI traffic bar (front) */}
                <div
                  className="w-full max-w-[24px] rounded-t-sm bg-gradient-to-t from-accent/80 to-accent/40 transition-all duration-700 ease-out"
                  style={{
                    height: animatedBars
                      ? `${(item.ai / maxValue) * 100}%`
                      : "0%",
                    transitionDelay: `${idx * 80}ms`,
                  }}
                />
                {/* Total traffic bar (back) */}
                <div
                  className="w-full max-w-[24px] rounded-t-sm bg-muted-foreground/20 transition-all duration-700 ease-out absolute bottom-0"
                  style={{
                    height: animatedBars
                      ? `${(item.value / maxValue) * 100}%`
                      : "0%",
                    transitionDelay: `${idx * 80 + 40}ms`,
                    zIndex: 0,
                  }}
                />
              </div>
              <span className="text-[9px] font-medium text-muted-foreground/60 mt-1">
                {item.day}
              </span>
            </div>
          ))}
        </div>

        {/* Summary stats */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <svg className="h-3.5 w-3.5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.563a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-3.95V16.25A.75.75 0 0110 17z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium text-green-500">+18%</span>
            <span className="text-muted-foreground/60">this week</span>
          </div>
          <div className="text-xs text-muted-foreground">
            Total AI visits:{" "}
            <span className="font-mono font-semibold text-foreground tabular-nums">
              {trafficData.reduce((s, d) => s + d.ai, 0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
