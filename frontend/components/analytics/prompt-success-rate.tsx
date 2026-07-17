import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";

const engines = ["GPT-4o", "Claude 3.5", "Gemini Pro", "Perplexity", "Cohere"];
const successData = [94, 91, 87, 92, 85];
const volumeData = [1250, 980, 720, 540, 310];

export function PromptSuccessRate({ className }: { className?: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const t = setTimeout(() => setAnimated(true), 300);
    return () => clearTimeout(t);
  }, []);

  const maxVal = 100;
  const maxVolume = Math.max(...volumeData);
  const overallAvg = successData.reduce((s, v) => s + v, 0) / successData.length;

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
              Prompt Success Rate
            </p>
          </div>
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground/60">
            <span className="font-mono font-bold text-accent">{overallAvg.toFixed(0)}%</span> avg
          </span>
        </div>

        {/* Chart area */}
        <div className="flex items-end gap-3 h-36 sm:h-40">
          {engines.map((engine, idx) => {
            const barHeight = animated ? (successData[idx] / maxVal) * 100 : 0;
            const volumeHeight = animated ? (volumeData[idx] / maxVolume) * 100 : 0;

            return (
              <div key={engine} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                {/* Success rate bar + volume line */}
                <div className="relative w-full flex flex-col items-center h-full justify-end">
                  {/* Volume marker dot */}
                  <div
                    className="absolute w-2 h-2 rounded-full bg-accent transition-all duration-700 ease-out z-10"
                    style={{
                      bottom: `${volumeHeight}%`,
                      transitionDelay: `${idx * 100 + 200}ms`,
                      opacity: animated ? 1 : 0,
                    }}
                  />
                  {/* Volume line */}
                  <div
                    className="absolute w-px bg-accent/30 transition-all duration-700 ease-out"
                    style={{
                      height: `${volumeHeight}%`,
                      bottom: "0%",
                      transitionDelay: `${idx * 100 + 200}ms`,
                      opacity: animated ? 0.5 : 0,
                    }}
                  />
                  {/* Success bar */}
                  <div
                    className="w-full max-w-[32px] rounded-t-sm transition-all duration-700 ease-out"
                    style={{
                      height: `${barHeight}%`,
                      background: `linear-gradient(to top, 
                        ${successData[idx] >= 90 ? "#10b981" : successData[idx] >= 80 ? "#7c3aed" : "#f59e0b"}, 
                        ${successData[idx] >= 90 ? "#34d399" : successData[idx] >= 80 ? "#a78bfa" : "#fbbf24"})`,
                      transitionDelay: `${idx * 100}ms`,
                    }}
                  />
                </div>

                {/* Percentage */}
                <span className="font-mono text-[10px] font-bold tabular-nums text-foreground mt-1">
                  {successData[idx]}%
                </span>
                {/* Label */}
                <span className="text-[8px] text-muted-foreground/60 text-center leading-tight max-w-full truncate">
                  {engine}
                </span>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-[10px] text-muted-foreground/60">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-3 rounded-sm bg-gradient-to-t from-[#10b981] to-[#34d399]" />
              <span>Success rate</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-3 rounded-full bg-accent/50" />
              <span>Volume</span>
            </div>
          </div>
          <span>{volumeData.reduce((s, v) => s + v, 0).toLocaleString()} total prompts</span>
        </div>
      </div>
    </div>
  );
}
