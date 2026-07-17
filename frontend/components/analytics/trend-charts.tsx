import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";

interface DataPoint {
  label: string;
  value: number;
  prev?: number;
}

const dailyData: DataPoint[] = [
  { label: "Mon", value: 65, prev: 60 },
  { label: "Tue", value: 72, prev: 63 },
  { label: "Wed", value: 68, prev: 65 },
  { label: "Thu", value: 78, prev: 68 },
  { label: "Fri", value: 82, prev: 70 },
  { label: "Sat", value: 85, prev: 72 },
  { label: "Sun", value: 80, prev: 71 },
];

const weeklyData: DataPoint[] = [
  { label: "W1", value: 62, prev: 55 },
  { label: "W2", value: 68, prev: 58 },
  { label: "W3", value: 72, prev: 62 },
  { label: "W4", value: 78, prev: 65 },
  { label: "W5", value: 82, prev: 68 },
];

const monthlyData: DataPoint[] = [
  { label: "Jan", value: 45, prev: 38 },
  { label: "Feb", value: 50, prev: 42 },
  { label: "Mar", value: 55, prev: 45 },
  { label: "Apr", value: 62, prev: 50 },
  { label: "May", value: 68, prev: 55 },
  { label: "Jun", value: 75, prev: 58 },
  { label: "Jul", value: 80, prev: 62 },
];

const views = ["Daily", "Weekly", "Monthly"] as const;

export function TrendCharts({ className }: { className?: string }) {
  const [activeView, setActiveView] = useState<string>("Daily");
  const [isVisible, setIsVisible] = useState(false);
  const [animated, setAnimated] = useState(false);
  const [comparePrev, setComparePrev] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    setIsVisible(true);
    const t = setTimeout(() => setAnimated(true), 300);
    return () => clearTimeout(t);
  }, [activeView]);

  const data = activeView === "Daily" ? dailyData : activeView === "Weekly" ? weeklyData : monthlyData;
  const maxVal = Math.max(...data.map((d) => Math.max(d.value, d.prev || 0)));
  const minVal = 0;
  const range = maxVal - minVal || 1;

  const width = 500;
  const height = 160;
  const pad = { top: 20, right: 16, bottom: 28, left: 36 };
  const chartW = width - pad.left - pad.right;
  const chartH = height - pad.top - pad.bottom;

  const getX = (i: number) => pad.left + (i / (data.length - 1)) * chartW;
  const getY = (v: number) => pad.top + chartH - ((v - minVal) / range) * chartH;

  const currentLine = data.map((d, i) => `${getX(i)},${animated ? getY(d.value) : getY(minVal)}`).join(" ");
  const prevLine = data.map((d, i) => `${getX(i)},${animated ? getY(d.prev || minVal) : getY(minVal)}`).join(" ");

  const avg = data.reduce((s, d) => s + d.value, 0) / data.length;
  const prevAvg = data.reduce((s, d) => s + (d.prev || 0), 0) / data.length;

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
            <svg className="h-4 w-4 text-accent" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M1.693 9.597a.75.75 0 01.21 1.04L2.25 9.5l-.347.137-.001.001-.004.002-.013.007a4.19 4.19 0 01-.215.106 9.86 9.86 0 01-1.765.718.75.75 0 01-.453-1.43 12.39 12.39 0 002.155-.885l.014-.007.004-.002.003-.001.75-.35a.75.75 0 011.04.21l.693 1.02.692-1.02a.75.75 0 011.25.83l-.693 1.02.693-1.02.693 1.02a.75.75 0 01-1.25.83l-.692-1.02-.693 1.02a.75.75 0 01-1.04-.21L3.5 10.5l.347-.137v-.001l.004-.002.013-.007a3.98 3.98 0 01.215-.106 10.53 10.53 0 011.765-.718.75.75 0 01.453 1.43 12.39 12.39 0 00-2.155.885l-.014.007-.004.002-.003.001-.75.35a.75.75 0 01-1.04-.21l-.692-1.02-.693 1.02a.75.75 0 01-1.25-.83l.693-1.02-.693 1.02z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-xs font-semibold uppercase tracking-widest text-foreground">
              Trends
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* View toggle */}
            <div className="flex rounded-lg bg-muted/20 p-0.5">
              {views.map((v) => (
                <button
                  key={v}
                  onClick={() => setActiveView(v)}
                  className={cn(
                    "rounded-md px-2.5 py-1 text-[10px] font-semibold transition-all",
                    activeView === v
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {v}
                </button>
              ))}
            </div>
            {/* Compare toggle */}
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={comparePrev}
                onChange={() => setComparePrev(!comparePrev)}
                className="h-3 w-3 rounded border-border bg-muted text-accent focus:ring-accent"
              />
              <span className="text-[9px] text-muted-foreground">Compare</span>
            </label>
          </div>
        </div>

        {/* Chart */}
        <div className="relative w-full" style={{ aspectRatio: "500/160" }}>
          <svg className="w-full h-full" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
            {/* Y-axis grid */}
            {[0, 25, 50, 75, 100].map((v) => (
              <g key={v}>
                <line
                  x1={pad.left}
                  y1={getY(v)}
                  x2={width - pad.right}
                  y2={getY(v)}
                  stroke="currentColor"
                  className="text-border/30"
                  strokeWidth="0.5"
                  strokeDasharray="3 3"
                />
                <text
                  x={pad.left - 4}
                  y={getY(v) + 3}
                  className="fill-muted-foreground/40"
                  fontSize="7"
                  textAnchor="end"
                >
                  {v}
                </text>
              </g>
            ))}

            {/* Previous period line */}
            {comparePrev && (
              <polyline
                points={prevLine}
                fill="none"
                stroke="#f59e0b"
                strokeWidth="1.5"
                strokeDasharray="4 3"
                className="transition-all duration-1000 ease-out"
                style={{ opacity: animated ? 0.6 : 0 }}
              />
            )}

            {/* Gradient def */}
            <defs>
              <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Area */}
            <path
              d={`${currentLine} ${getX(data.length - 1)},${getY(minVal)} ${getX(0)},${getY(minVal)}`}
              fill="url(#trendGradient)"
              className="transition-all duration-1000 ease-out"
            />

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

            {/* Data points */}
            {data.map((d, i) => {
              const x = getX(i);
              const y = animated ? getY(d.value) : getY(minVal);
              const isHovered = hovered === i;
              return (
                <g key={i}>
                  <circle
                    cx={x}
                    cy={y}
                    r={isHovered ? 6 : 0}
                    fill="#7c3aed"
                    className="transition-all duration-200 cursor-pointer"
                  />
                  <circle
                    cx={x}
                    cy={y}
                    r="10"
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                  />
                  {/* Invisible larger hit area */}
                  <rect
                    x={x - 15}
                    y={y - 15}
                    width="30"
                    height="30"
                    fill="transparent"
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                  />
                </g>
              );
            })}

            {/* X labels */}
            {data.map((d, i) => (
              <text
                key={i}
                x={getX(i)}
                y={height - 4}
                textAnchor="middle"
                className="fill-muted-foreground/40"
                fontSize="7"
              >
                {d.label}
              </text>
            ))}
          </svg>

          {/* Hover tooltip */}
          {hovered !== null && (
            <div
              className="absolute bg-card border border-border rounded-lg px-3 py-2 shadow-lg pointer-events-none z-10"
              style={{
                left: `${(hovered / (data.length - 1)) * 100}%`,
                top: "0%",
                transform: "translate(-50%, -120%)",
              }}
            >
              <p className="text-[9px] text-muted-foreground">{data[hovered].label}</p>
              <p className="text-xs font-bold text-foreground">{data[hovered].value}</p>
              {comparePrev && data[hovered].prev !== undefined && (
                <p className="text-[9px] text-muted-foreground/60">
                  Prev: {data[hovered].prev}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Stats footer */}
        <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-[10px] text-muted-foreground/60">
          <div className="flex items-center gap-3">
            <span>
              Avg: <span className="font-mono font-bold text-foreground">{avg.toFixed(0)}</span>
            </span>
            {comparePrev && (
              <span className={cn(avg > prevAvg ? "text-green-500" : "text-red-500")}>
                {avg > prevAvg ? "+" : ""}{(avg - prevAvg).toFixed(0)} vs prev
              </span>
            )}
          </div>
          <span className="text-[9px]">{activeView} trend • Updated today</span>
        </div>
      </div>
    </div>
  );
}
