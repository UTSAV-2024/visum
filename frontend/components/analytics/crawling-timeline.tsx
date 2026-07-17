import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";

const events = [
  { time: "00:00", bots: ["GPTBot"], intensity: 1 },
  { time: "02:00", bots: ["Claude-Web"], intensity: 2 },
  { time: "04:00", bots: ["GPTBot", "Google-Extended"], intensity: 3 },
  { time: "06:00", bots: ["PerplexityBot"], intensity: 1 },
  { time: "08:00", bots: ["GPTBot", "Claude-Web", "Google-Extended"], intensity: 5 },
  { time: "10:00", bots: ["GPTBot", "Claude-Web", "PerplexityBot", "Gemini"], intensity: 7 },
  { time: "12:00", bots: ["GPTBot", "Google-Extended", "Claude-Web"], intensity: 6 },
  { time: "14:00", bots: ["GPTBot", "PerplexityBot"], intensity: 4 },
  { time: "16:00", bots: ["GPTBot", "Claude-Web", "Google-Extended"], intensity: 5 },
  { time: "18:00", bots: ["Claude-Web", "Gemini"], intensity: 3 },
  { time: "20:00", bots: ["GPTBot"], intensity: 2 },
  { time: "22:00", bots: ["Google-Extended"], intensity: 1 },
];

const botColorsMap: Record<string, string> = {
  GPTBot: "#7c3aed",
  "Claude-Web": "#6366f1",
  "Google-Extended": "#3b82f6",
  PerplexityBot: "#06b6d4",
  Gemini: "#f59e0b",
};

export function CrawlingTimeline({ className }: { className?: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const t = setTimeout(() => setAnimated(true), 300);
    return () => clearTimeout(t);
  }, []);

  const maxIntensity = Math.max(...events.map((e) => e.intensity));

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
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 text-accent" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-xs font-semibold uppercase tracking-widest text-foreground">
              Crawling Timeline
            </p>
          </div>
          <span className="text-[10px] text-muted-foreground/60">Last 24 hours</span>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Baseline */}
          <div className="absolute left-0 right-0 top-1/2 h-px bg-border -translate-y-1/2" />

          <div className="flex items-end justify-between gap-1 h-24 sm:h-28">
            {events.map((event, idx) => {
              const heightPercent = animated ? (event.intensity / maxIntensity) * 100 : 0;

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                  {/* Bar */}
                  <div className="relative w-full max-w-[28px] group">
                    <div
                      className="w-full rounded-t-sm transition-all duration-700 ease-out"
                      style={{
                        height: `${heightPercent}%`,
                        minHeight: animated ? "4px" : "0px",
                        background: `linear-gradient(to top, ${botColorsMap[event.bots[0]] || "#7c3aed"}, ${botColorsMap[event.bots[event.bots.length - 1]] || "#6366f1"})`,
                        transitionDelay: `${idx * 40}ms`,
                      }}
                    />
                    {/* Tooltip on hover */}
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 -translate-y-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                      <div className="bg-card border border-border rounded-lg px-2.5 py-1.5 shadow-lg whitespace-nowrap">
                        <p className="text-[10px] font-medium text-foreground">
                          {event.bots.join(", ")}
                        </p>
                        <p className="text-[9px] text-muted-foreground">{event.time}</p>
                      </div>
                    </div>
                  </div>

                  {/* Time label */}
                  <span className="text-[8px] text-muted-foreground/50 mt-1">
                    {event.time}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bot legend */}
        <div className="mt-4 pt-3 border-t border-border flex flex-wrap gap-3">
          {Object.entries(botColorsMap).map(([name, color]) => (
            <div key={name} className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-[9px] text-muted-foreground">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
