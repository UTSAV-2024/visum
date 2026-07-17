import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";
import { COMPETITORS, INDUSTRY_AVG, METRICS, METRIC_LABELS, YOUR_SITE } from "./data";

export function RadarChart({ className }) {
  const [isVisible, setIsVisible] = useState(false);
  const [animated, setAnimated] = useState(false);
  const [selectedComp, setSelectedComp] = useState(COMPETITORS[0].name);

  useEffect(() => {
    setIsVisible(true);
    const t = setTimeout(() => setAnimated(true), 400);
    return () => clearTimeout(t);
  }, []);

  const competitor = COMPETITORS.find((c) => c.name === selectedComp) || COMPETITORS[0];
  const levels = 5;
  const size = 220;
  const center = size / 2;
  const radius = size / 2 - 24;
  const angleStep = (2 * Math.PI) / METRICS.length;

  const polypoint = (val, idx) => {
    const angle = angleStep * idx - Math.PI / 2;
    const r = (val / 100) * radius;
    return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
  };

  const gridPoints = (level) => Array.from({ length: METRICS.length }, (_, i) => polypoint((level / levels) * 100, i)).join(" ");
  const buildPoly = (vals, enabled) => vals.map((v, i) => polypoint(enabled ? v : 0, i)).join(" ");

  return (
    <div className={cn("relative rounded-2xl border border-border bg-card transition-all duration-500", isVisible ? "opacity-100" : "opacity-0", className)}>
      <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.02] to-transparent pointer-events-none rounded-2xl" />
      <div className="relative z-10 p-5">
        <div className="flex items-center gap-2 mb-4">
          <svg className="h-4 w-4 text-accent" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z" clipRule="evenodd" />
          </svg>
          <p className="text-xs font-semibold uppercase tracking-widest text-foreground">AI Visibility Radar</p>
        </div>

        <div className="flex flex-col items-center">
          <svg className="w-[220px] h-[220px]" viewBox={`0 0 ${size} ${size}`}>
            {Array.from({ length: levels }, (_, i) => (
              <polygon key={i} points={gridPoints(i + 1)} fill="none" stroke="currentColor" className="text-border/30" strokeWidth="0.5" />
            ))}
            {METRICS.map((_, i) => {
              const angle = angleStep * i - Math.PI / 2;
              return <line key={i} x1={center} y1={center} x2={center + radius * Math.cos(angle)} y2={center + radius * Math.sin(angle)} stroke="currentColor" className="text-border/20" strokeWidth="0.5" />;
            })}
            {METRICS.map((m, i) => {
              const angle = angleStep * i - Math.PI / 2;
              return <text key={m} x={center + (radius + 18) * Math.cos(angle)} y={center + (radius + 18) * Math.sin(angle)} textAnchor="middle" dominantBaseline="middle" className="fill-muted-foreground/50" fontSize="7">{METRIC_LABELS[m]}</text>;
            })}

            {/* Industry avg */}
            <polygon points={buildPoly(METRICS.map((m) => INDUSTRY_AVG[m]), animated)} fill="#f59e0b" fillOpacity={0.08} stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 3" className="transition-all duration-1000 ease-out" />

            {/* Competitor */}
            <polygon points={buildPoly(METRICS.map((m) => competitor[m]), animated)} fill="#6366f1" fillOpacity={0.08} stroke="#6366f1" strokeWidth="2" className="transition-all duration-1000 ease-out" />

            {/* Your site */}
            <polygon points={buildPoly(METRICS.map((m) => YOUR_SITE[m]), animated)} fill="#7c3aed" fillOpacity={0.12} stroke="#7c3aed" strokeWidth="2.5" className="transition-all duration-1000 ease-out" />
          </svg>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-3 mt-3">
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-[#7c3aed]" /><span className="text-[10px] text-muted-foreground">You</span></span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-[#6366f1]" /><span className="text-[10px] text-muted-foreground">{competitor.name}</span></span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-[#f59e0b]" /><span className="text-[10px] text-muted-foreground">Industry Avg</span></span>
          </div>

          {/* Competitor selector */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {COMPETITORS.filter((c) => c.name !== "Your Site").map((c) => (
              <button key={c.name} onClick={() => setSelectedComp(c.name)}
                className={cn("rounded-lg px-2 py-1 text-[9px] font-semibold transition-all",
                  selectedComp === c.name ? "bg-accent/10 text-accent" : "bg-muted/10 text-muted-foreground hover:text-foreground"
                )}>{c.name}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
