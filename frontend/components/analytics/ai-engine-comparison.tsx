import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";

const metrics = ["Readability", "Crawlability", "Structured Data", "Speed", "Reliability"];
const engines = [
  { name: "GPT-4o", color: "#7c3aed", values: [92, 88, 85, 78, 95], visits: 2843 },
  { name: "Claude 3.5", color: "#6366f1", values: [88, 85, 90, 72, 91], visits: 1950 },
  { name: "Gemini Pro", color: "#3b82f6", values: [85, 80, 82, 90, 88], visits: 423 },
  { name: "Perplexity", color: "#06b6d4", values: [90, 82, 78, 85, 85], visits: 987 },
];

export function AiEngineComparison({ className }: { className?: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const [animated, setAnimated] = useState(false);
  const [selected, setSelected] = useState<number>(0);

  useEffect(() => {
    setIsVisible(true);
    const t = setTimeout(() => setAnimated(true), 400);
    return () => clearTimeout(t);
  }, []);

  const selectedEngine = engines[selected];
  const levels = 5;
  const size = 180;
  const center = size / 2;
  const radius = size / 2 - 20;
  const angleStep = (2 * Math.PI) / metrics.length;

  const polygonPoint = (value: number, index: number) => {
    const angle = angleStep * index - Math.PI / 2;
    const r = (value / 100) * radius;
    return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
  };

  const gridPoints = (level: number) => {
    return Array.from({ length: metrics.length }, (_, i) =>
      polygonPoint((level / levels) * 100, i)
    ).join(" ");
  };

  const enginePolygon = (engine: typeof engines[0]) => {
    return engine.values
      .map((v, i) => polygonPoint(animated ? v : 0, i))
      .join(" ");
  };

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
        <div className="flex items-center gap-2 mb-4">
          <svg className="h-4 w-4 text-accent" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-xs font-semibold uppercase tracking-widest text-foreground">
            AI Engine Comparison
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-6">
          {/* Radar chart */}
          <div className="shrink-0">
            <svg className="w-[180px] h-[180px]" viewBox={`0 0 ${size} ${size}`}>
              {/* Grid */}
              {Array.from({ length: levels }, (_, i) => (
                <polygon
                  key={i}
                  points={gridPoints(i + 1)}
                  fill="none"
                  stroke="currentColor"
                  className="text-border/30"
                  strokeWidth="0.5"
                />
              ))}

              {/* Axis lines */}
              {metrics.map((_, i) => {
                const angle = angleStep * i - Math.PI / 2;
                const x = center + radius * Math.cos(angle);
                const y = center + radius * Math.sin(angle);
                return (
                  <line
                    key={i}
                    x1={center}
                    y1={center}
                    x2={x}
                    y2={y}
                    stroke="currentColor"
                    className="text-border/30"
                    strokeWidth="0.5"
                  />
                );
              })}

              {/* Metric labels */}
              {metrics.map((m, i) => {
                const angle = angleStep * i - Math.PI / 2;
                const x = center + (radius + 16) * Math.cos(angle);
                const y = center + (radius + 16) * Math.sin(angle);
                return (
                  <text
                    key={m}
                    x={x}
                    y={y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-muted-foreground/60"
                    fontSize="8"
                  >
                    {m}
                  </text>
                );
              })}

              {/* Only show selected engine polygon (cleaner) */}
              <polygon
                points={enginePolygon(selectedEngine)}
                fill={selectedEngine.color}
                fillOpacity={0.1}
                stroke={selectedEngine.color}
                strokeWidth="2"
                className="transition-all duration-1000 ease-out"
              />

              {/* Points */}
              {selectedEngine.values.map((v, i) => {
                const [px, py] = polygonPoint(animated ? v : 0, i).split(",");
                return (
                  <circle
                    key={i}
                    cx={px}
                    cy={py}
                    r="3"
                    fill={selectedEngine.color}
                    className="transition-all duration-700"
                    style={{ transitionDelay: `${i * 80}ms` }}
                  />
                );
              })}
            </svg>
          </div>

          {/* Engine selector + stats */}
          <div className="flex-1 w-full">
            <div className="flex flex-wrap gap-2 mb-4">
              {engines.map((engine, idx) => (
                <button
                  key={engine.name}
                  onClick={() => setSelected(idx)}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-[11px] font-semibold transition-all duration-200",
                    selected === idx
                      ? "border-accent/50 bg-accent/10 text-accent"
                      : "border-border bg-card text-muted-foreground hover:border-accent/30 hover:text-foreground"
                  )}
                >
                  {engine.name}
                </button>
              ))}
            </div>

            {/* Scores */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {metrics.map((m, i) => (
                <div
                  key={m}
                  className="rounded-lg bg-muted/10 px-3 py-2"
                >
                  <p className="text-[9px] text-muted-foreground/60">{m}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="flex-1 h-1.5 rounded-full bg-muted/20">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${animated ? selectedEngine.values[i] : 0}%`,
                          backgroundColor: selectedEngine.color,
                        }}
                      />
                    </div>
                    <span className="font-mono text-[10px] font-bold tabular-nums text-foreground">
                      {selectedEngine.values[i]}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Visit stats */}
            <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-[10px] text-muted-foreground/60">
              <span>
                Total visits:{" "}
                <span className="font-mono font-bold text-foreground">
                  {engines.reduce((s, e) => s + e.visits, 0).toLocaleString()}
                </span>
              </span>
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse-dot" />
                {selectedEngine.name}: {selectedEngine.visits.toLocaleString()} visits
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
