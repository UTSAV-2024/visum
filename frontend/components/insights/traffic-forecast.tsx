import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";
import { FORECAST_DATA } from "./data";

export function TrafficForecast({ className }) {
  const [isVisible, setIsVisible] = useState(false);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const t = setTimeout(() => setAnimated(true), 300);
    return () => clearTimeout(t);
  }, []);

  const maxVal = Math.max(...FORECAST_DATA.map((d) => Math.max(d.actual || 0, d.predicted)));
  const pad = { top: 20, right: 16, bottom: 28, left: 40 };
  const width = 500;
  const height = 160;
  const cw = width - pad.left - pad.right;
  const ch = height - pad.top - pad.bottom;

  const getX = (i) => pad.left + (i / (FORECAST_DATA.length - 1)) * cw;
  const getY = (v) => pad.top + ch - (v / maxVal) * ch;

  // Actual line (solid)
  const actualPoints = FORECAST_DATA.filter((d) => d.actual !== undefined);
  const actualLine = actualPoints.map((d, i) => {
    const idx = FORECAST_DATA.indexOf(d);
    return `${getX(idx)},${animated ? getY(d.actual) : getY(0)}`;
  }).join(" ");

  // Predicted line (dashed)
  const predictedLine = FORECAST_DATA.map((d, i) => `${getX(i)},${animated ? getY(d.predicted) : getY(0)}`).join(" ");

  // Divider between actual and forecast
  const dividerIdx = actualPoints.length - 1;
  const dividerX = getX(dividerIdx);

  return (
    <div className={cn("relative rounded-2xl border border-border bg-card transition-all duration-500", isVisible ? "opacity-100" : "opacity-0", className)}>
      <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.02] to-transparent pointer-events-none rounded-2xl" />
      <div className="relative z-10 p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 text-accent" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M1.693 9.597a.75.75 0 01.21 1.04L2.25 9.5l-.347.137-.001.001-.004.002-.013.007a4.19 4.19 0 01-.215.106 9.86 9.86 0 01-1.765.718.75.75 0 01-.453-1.43 12.39 12.39 0 002.155-.885l.014-.007.004-.002.003-.001.75-.35a.75.75 0 011.04.21l.693 1.02.692-1.02a.75.75 0 011.25.83l-.693 1.02.693-1.02.693 1.02a.75.75 0 01-1.25.83l-.692-1.02-.693 1.02a.75.75 0 01-1.04-.21L3.5 10.5l.347-.137v-.001l.004-.002.013-.007a3.98 3.98 0 01.215-.106 10.53 10.53 0 011.765-.718.75.75 0 01.453 1.43 12.39 12.39 0 00-2.155.885l-.014.007-.004.002-.003.001-.75.35a.75.75 0 01-1.04-.21l-.692-1.02-.693 1.02a.75.75 0 01-1.25-.83l.693-1.02-.693 1.02z" clipRule="evenodd" />
            </svg>
            <p className="text-xs font-semibold uppercase tracking-widest text-foreground">Traffic Forecast</p>
          </div>
          <div className="flex items-center gap-2 text-[9px] text-muted-foreground/60">
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-accent" />Actual</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-orange-500" />Predicted</span>
          </div>
        </div>

        <div className="relative w-full" style={{ aspectRatio: "500/160" }}>
          <svg className="w-full h-full" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[2000, 4000, 6000, 8000].map((v) => (
              <g key={v}>
                <line x1={pad.left} y1={getY(v)} x2={width - pad.right} y2={getY(v)} stroke="currentColor" className="text-border/30" strokeWidth="0.5" strokeDasharray="3 3" />
                <text x={pad.left - 4} y={getY(v) + 3} className="fill-muted-foreground/40" fontSize="7" textAnchor="end">{v.toLocaleString()}</text>
              </g>
            ))}

            {/* Area fill for predicted */}
            <path d={`${predictedLine} ${getX(FORECAST_DATA.length - 1)},${getY(0)} ${getX(0)},${getY(0)}`} fill="url(#forecastGrad)" className="transition-all duration-1000 ease-out" />

            {/* Predicted line (dashed) */}
            <polyline points={predictedLine} fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="6 3" strokeLinecap="round" strokeLinejoin="round" className="transition-all duration-1000 ease-out" />

            {/* Actual line (solid) */}
            <polyline points={actualLine} fill="none" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-all duration-1000 ease-out" />

            {/* Divider */}
            <line x1={dividerX} y1={pad.top} x2={dividerX} y2={height - pad.bottom} stroke="currentColor" className="text-border/50" strokeWidth="1" strokeDasharray="4 4" />
            <text x={dividerX} y={height - pad.bottom + 12} textAnchor="middle" className="fill-muted-foreground/40" fontSize="6">Now</text>

            {/* Labels */}
            {FORECAST_DATA.map((d, i) => (
              <text key={i} x={getX(i)} y={height - 4} textAnchor="middle" className="fill-muted-foreground/40" fontSize="6">{d.week}</text>
            ))}
          </svg>
        </div>

        <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-[10px] text-muted-foreground/60">
          <span>Current: <span className="font-mono font-bold text-foreground">6,258</span></span>
          <span className="text-green-500">Forecast: +32%</span>
          <span>Projected: <span className="font-mono font-bold text-foreground">8,250</span></span>
        </div>
      </div>
    </div>
  );
}
