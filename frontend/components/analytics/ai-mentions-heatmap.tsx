import { useEffect, useState, useMemo } from "react";
import { cn } from "../../lib/utils";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const hours = ["0h", "4h", "8h", "12h", "16h", "20h"];

// Stable seed-based heatmap generation
function seededRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function getHeatColor(value: number): string {
  if (value >= 80) return "bg-accent";
  if (value >= 60) return "bg-accent/70";
  if (value >= 40) return "bg-accent/50";
  if (value >= 20) return "bg-accent/30";
  return "bg-accent/10";
}

export function AiMentionsHeatmap({ className }: { className?: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCell, setHoveredCell] = useState(null);

  const heatData = useMemo(() =>
    days.map((_, dayIdx) =>
      hours.map((_, hourIdx) => Math.floor(seededRandom(dayIdx * 10 + hourIdx + 42) * 100))
    ),
    []
  );

  useEffect(() => {
    setIsVisible(true);
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
              <path d="M10 1a4.5 4.5 0 00-4.5 4.5v2.5a2 2 0 00-2 2v4a2 2 0 002 2h9a2 2 0 002-2v-4a2 2 0 00-2-2v-2.5A4.5 4.5 0 0010 1zm-2.5 7V5.5a2.5 2.5 0 015 0V8h-5z" />
            </svg>
            <p className="text-xs font-semibold uppercase tracking-widest text-foreground">
              AI Mentions Heatmap
            </p>
          </div>
          <span className="text-[10px] text-muted-foreground/60">Last 7 days</span>
        </div>

        {/* Heatmap grid */}
        <div className="flex gap-2">
          {/* Hour labels */}
          <div className="flex flex-col gap-1 pt-6">
            {days.map((_, i) => (
              <div key={i} className="h-6 sm:h-7" />
            ))}
          </div>

          <div className="flex-1">
            {/* Hour headers */}
            <div className="flex gap-1 mb-1">
              {hours.map((hour) => (
                <div key={hour} className="flex-1 text-center">
                  <span className="text-[8px] text-muted-foreground/50">{hour}</span>
                </div>
              ))}
            </div>

            {/* Grid */}
            <div className="space-y-1">
              {heatData.map((row, dayIdx) => (
                <div key={dayIdx} className="flex items-center gap-2">
                  <span className="text-[9px] text-muted-foreground/60 w-8 text-right shrink-0">
                    {days[dayIdx]}
                  </span>
                  <div className="flex gap-1 flex-1">
                    {row.map((value, hourIdx) => {
                      const isHovered = hoveredCell?.day === dayIdx && hoveredCell?.hour === hourIdx;
                      return (
                        <div
                          key={hourIdx}
                          className={cn(
                            "flex-1 aspect-square rounded-md transition-all duration-200 cursor-pointer",
                            getHeatColor(value),
                            isHovered && "ring-2 ring-accent scale-110 z-10"
                          )}
                          onMouseEnter={() => setHoveredCell({ day: dayIdx, hour: hourIdx })}
                          onMouseLeave={() => setHoveredCell(null)}
                        >
                          {/* Tooltip */}
                          {isHovered && (
                            <div className="absolute -translate-y-full -translate-x-1/2 left-1/2 top-0 bg-card border border-border rounded-lg px-2 py-1 shadow-lg z-20 whitespace-nowrap pointer-events-none">
                              <p className="text-[9px] font-medium text-foreground">
                                {days[dayIdx]} {hours[hourIdx]}
                              </p>
                              <p className="text-[8px] text-muted-foreground">{value} mentions</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[9px] text-muted-foreground">Low</span>
            <div className="flex gap-0.5">
              {[10, 30, 50, 70, 90].map((v) => (
                <div key={v} className={cn("h-3 w-3 rounded-sm", getHeatColor(v))} />
              ))}
            </div>
            <span className="text-[9px] text-muted-foreground">High</span>
          </div>
          <span className="text-[10px] text-muted-foreground/60">
            Total: {heatData.flat().reduce((s, v) => s + v, 0)} mentions
          </span>
        </div>
      </div>
    </div>
  );
}
