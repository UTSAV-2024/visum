import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";

const SCAN_STEPS = [
  { id: "connect", label: "Connecting to site", duration: "0.3s" },
  { id: "robots", label: "Checking robots.txt", duration: "0.8s" },
  { id: "sitemap", label: "Fetching sitemap.xml", duration: "1.2s" },
  { id: "meta", label: "Analyzing meta tags", duration: "0.5s" },
  { id: "jsonld", label: "Parsing JSON-LD", duration: "0.7s" },
  { id: "llms", label: "Checking llms.txt", duration: "0.4s" },
  { id: "mcp", label: "Scanning MCP endpoint", duration: "1.1s" },
  { id: "js", label: "Evaluating JS rendering", duration: "2.0s" },
  { id: "speed", label: "Measuring page speed", duration: "1.5s" },
  { id: "scoring", label: "Calculating scores", duration: "0.3s" },
];

export function Timeline({ scanTimeMs, className }) {
  const [isVisible, setIsVisible] = useState(false);
  const [animStep, setAnimStep] = useState(-1);

  useEffect(() => {
    setIsVisible(true);
    // Animate steps sequentially
    SCAN_STEPS.forEach((_, idx) => {
      setTimeout(() => setAnimStep(idx), 100 + idx * 120);
    });
  }, []);

  const totalTime = scanTimeMs ? `${(scanTimeMs / 1000).toFixed(1)}s` : "8.8s";

  return (
    <div
      className={cn(
        "relative rounded-2xl border border-border bg-card transition-all duration-500",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.02] to-transparent pointer-events-none rounded-2xl" />

      <div className="relative z-10 p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 text-accent" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
            </svg>
            <p className="text-xs font-semibold uppercase tracking-widest text-foreground">
              Scan Timeline
            </p>
          </div>
          <span className="text-[10px] text-muted-foreground/60">
            Total: {totalTime}
          </span>
        </div>

        <div className="relative">
          {/* Progress line */}
          <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-border rounded-full overflow-hidden">
            <div
              className="w-full bg-accent transition-all duration-700 rounded-full"
              style={{
                height: `${((animStep + 1) / SCAN_STEPS.length) * 100}%`,
              }}
            />
          </div>

          <div className="space-y-0">
            {SCAN_STEPS.map((step, idx) => {
              const isComplete = idx <= animStep;
              const isCurrent = idx === animStep;

              return (
                <div
                  key={step.id}
                  className="relative flex items-start gap-3 py-2"
                >
                  {/* Dot */}
                  <div className="relative z-10 mt-0.5">
                    <div
                      className={cn(
                        "h-[18px] w-[18px] rounded-full border-2 flex items-center justify-center transition-all duration-300",
                        isComplete
                          ? "border-accent bg-accent"
                          : "border-border bg-card"
                      )}
                    >
                      {isComplete && (
                        <svg className="h-2.5 w-2.5 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                        </svg>
                      )}
                      {isCurrent && !isComplete && (
                        <span className="h-2 w-2 rounded-full bg-accent animate-pulse-dot" />
                      )}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 flex items-center justify-between">
                    <p className={cn(
                      "text-xs font-medium transition-all duration-300",
                      isComplete ? "text-foreground" : "text-muted-foreground/40"
                    )}>
                      {step.label}
                    </p>
                    {isComplete && (
                      <span className="text-[9px] text-muted-foreground/60 shrink-0">
                        {step.duration}
                      </span>
                    )}
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
