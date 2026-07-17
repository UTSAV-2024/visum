import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";

const chartData = [
  { date: "Jul 10", current: 72, previous: 68 },
  { date: "Jul 11", current: 75, previous: 69 },
  { date: "Jul 12", current: 78, previous: 70 },
  { date: "Jul 13", current: 74, previous: 67 },
  { date: "Jul 14", current: 80, previous: 71 },
  { date: "Jul 15", current: 85, previous: 72 },
  { date: "Jul 16", current: 88, previous: 73 },
  { date: "Jul 17", current: 86, previous: 74 },
];

export function RetrievalSuccess({ className }: { className?: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const [animated, setAnimated] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  useEffect(() => {
    setIsVisible(true);
    const t = setTimeout(() => setAnimated(true), 400);
    return () => clearTimeout(t);
  }, []);

  const width = 400;
  const height = 160;
  const padding = { top: 20, right: 20, bottom: 30, left: 30 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const maxVal = 100;
  const minVal = 60;

  const getX = (i: number) => padding.left + (i / (chartData.length - 1)) * chartW;
  const getY = (val: number) => padding.top + chartH - ((val - minVal) / (maxVal - minVal)) * chartH;

  const currentLine = chartData.map((d, i) => `${getX(i)},${animated ? getY(d.current) : getY(minVal)}`).join(" ");
  const prevLine = chartData.map((d, i) => `${getX(i)},${animated ? getY(d.previous) : getY(minVal)}`).join(" ");

  const avgRate = chartData.reduce((s, d) => s + d.current, 0) / chartData.length;
  const prevAvg = chartData.reduce((s, d) => s + d.previous, 0) / chartData.length;

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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-xs font-semibold uppercase tracking-widest text-foreground">
              Retrieval Success
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-accent" />
              <span className="text-[9px] text-muted-foreground">Current</span>
            </div>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={showComparison}
                onChange={() => setShowComparison(!showComparison)}
                className="h-3 w-3 rounded border-border bg-muted text-accent focus:ring-accent"
              />
              <span className="text-[9px] text-muted-foreground">Compare</span>
            </label>
          </div>
        </div>

        {/* Chart */}
        <div className="relative w-full" style={{ aspectRatio: "400/160" }}>
          <svg className="w-full h-full" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
            {/* Grid lines */}
            {[60, 70, 80, 90, 100].map((v) => (
              <g key={v}>
                <line
                  x1={padding.left}
                  y1={getY(v)}
                  x2={width - padding.right}
                  y2={getY(v)}
                  stroke="currentColor"
                  className="text-border/50"
                  strokeWidth="0.5"
                  strokeDasharray="4 4"
                />
                <text
                  x={padding.left - 4}
                  y={getY(v) + 3}
                  className="fill-muted-foreground/50"
                  fontSize="8"
                  textAnchor="end"
                >
                  {v}%
                </text>
              </g>
            ))}

            {/* Previous period line */}
            {showComparison && (
              <polyline
                points={prevLine}
                fill="none"
                stroke="#f59e0b"
                strokeWidth="1.5"
                strokeDasharray="6 3"
                className="transition-all duration-1000 ease-out"
                style={{ opacity: animated ? 0.5 : 0 }}
              />
            )}

            {/* Current line */}
            <polyline
              points={currentLine}
              fill="none"
              stroke="#7c3aed"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-all duration-1000 ease-out"
              style={{ opacity: animated ? 1 : 0 }}
            />

            {/* Area fill */}
            <path
              d={`${currentLine} ${getX(chartData.length - 1)},${getY(minVal)} ${getX(0)},${getY(minVal)}`}
              fill="url(#retrievalGradient)"
              className="transition-all duration-1000 ease-out"
              style={{ opacity: animated ? 0.15 : 0 }}
            />
            <defs>
              <linearGradient id="retrievalGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7c3aed" />
                <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Data points */}
            {chartData.map((d, i) => {
              const x = getX(i);
              const y = animated ? getY(d.current) : getY(minVal);
              return (
                <g
                  key={i}
                  className="transition-all duration-200 cursor-pointer"
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                >
                  <circle
                    cx={x}
                    cy={y}
                    r={hoveredIdx === i ? 5 : 3}
                    fill={hoveredIdx === i ? "#7c3aed" : "currentColor"}
                    className={cn(
                      "transition-all duration-200",
                      hoveredIdx === i ? "text-accent" : "text-card stroke-2 stroke-accent"
                    )}
                    style={{ fill: hoveredIdx === i ? "#7c3aed" : "var(--color-card)" }}
                  />
                </g>
              );
            })}
          </svg>

          {/* Hover tooltip */}
          {hoveredIdx !== null && (
            <div
              className="absolute bg-card border border-border rounded-lg px-2.5 py-1.5 shadow-lg pointer-events-none z-10"
              style={{
                left: `${(hoveredIdx / (chartData.length - 1)) * 100}%`,
                top: "0%",
                transform: "translate(-50%, -110%)",
              }}
            >
              <p className="text-[9px] text-muted-foreground">{chartData[hoveredIdx].date}</p>
              <p className="text-[10px] font-bold text-foreground">
                {chartData[hoveredIdx].current}%
              </p>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="font-mono text-sm font-bold tabular-nums text-green-500">
              {avgRate.toFixed(1)}%
            </span>
            <span className="text-[10px] text-muted-foreground/60">avg</span>
          </div>
          <div className={cn("flex items-center gap-1", avgRate > prevAvg ? "text-green-500" : "text-red-500")}>
            <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.563a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-3.95V16.25A.75.75 0 0110 17z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-[10px] font-semibold">
              +{(avgRate - prevAvg).toFixed(1)}% vs prev period
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
