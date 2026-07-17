import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";
import { WEEKLY_SCORES, MONTHLY_SCORES } from "./data";

export function ScoreEvolution({ className }) {
  const [isVisible, setIsVisible] = useState(false);
  const [animated, setAnimated] = useState(false);
  const [view, setView] = useState("weekly");
  const [hovered, setHovered] = useState(null);

  const data = view === "weekly" ? WEEKLY_SCORES : MONTHLY_SCORES;

  useEffect(() => {
    setIsVisible(true);
    const t = setTimeout(() => setAnimated(true), 300);
    return () => clearTimeout(t);
  }, [view]);

  const maxVal = 100;
  const minVal = 30;
  const range = maxVal - minVal;

  const width = 500;
  const height = 180;
  const pad = { top: 20, right: 16, bottom: 28, left: 36 };
  const cw = width - pad.left - pad.right;
  const ch = height - pad.top - pad.bottom;

  const getX = (i) => pad.left + (i / (data.length - 1)) * cw;
  const getY = (v) => pad.top + ch - ((v - minVal) / range) * ch;

  const currentLine = data.map((d, i) => `${getX(i)},${animated ? getY(d.score) : getY(minVal)}`).join(" ");
  const prevLine = data.map((d, i) => `${getX(i)},${animated ? getY(d.previous) : getY(minVal)}`).join(" ");

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
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 text-accent" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M1.693 9.597a.75.75 0 01.21 1.04L2.25 9.5l-.347.137-.001.001-.004.002-.013.007a4.19 4.19 0 01-.215.106 9.86 9.86 0 01-1.765.718.75.75 0 01-.453-1.43 12.39 12.39 0 002.155-.885l.014-.007.004-.002.003-.001.75-.35a.75.75 0 011.04.21l.693 1.02.692-1.02a.75.75 0 011.25.83l-.693 1.02.693-1.02.693 1.02a.75.75 0 01-1.25.83l-.692-1.02-.693 1.02a.75.75 0 01-1.04-.21L3.5 10.5l.347-.137v-.001l.004-.002.013-.007a3.98 3.98 0 01.215-.106 10.53 10.53 0 011.765-.718.75.75 0 01.453 1.43 12.39 12.39 0 00-2.155.885l-.014.007-.004.002-.003.001-.75.35a.75.75 0 01-1.04-.21l-.692-1.02-.693 1.02a.75.75 0 01-1.25-.83l.693-1.02-.693 1.02z" clipRule="evenodd" />
            </svg>
            <p className="text-xs font-semibold uppercase tracking-widest text-foreground">Score Evolution</p>
          </div>
          <div className="flex rounded-lg bg-muted/20 p-0.5">
            {["weekly", "monthly"].map((v) => (
              <button key={v} onClick={() => setView(v)}
                className={cn("rounded-md px-2.5 py-1 text-[10px] font-semibold transition-all",
                  view === v ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}>
                {v === "weekly" ? "Weekly" : "Monthly"}
              </button>
            ))}
          </div>
        </div>

        <div className="relative w-full" style={{ aspectRatio: "500/180" }}>
          <svg className="w-full h-full" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
            {[40, 60, 80, 100].map((v) => (
              <g key={v}>
                <line x1={pad.left} y1={getY(v)} x2={width - pad.right} y2={getY(v)} stroke="currentColor" className="text-border/30" strokeWidth="0.5" strokeDasharray="3 3" />
                <text x={pad.left - 4} y={getY(v) + 3} className="fill-muted-foreground/40" fontSize="7" textAnchor="end">{v}</text>
              </g>
            ))}
            <defs><linearGradient id="evoGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7c3aed" stopOpacity="0.15" /><stop offset="100%" stopColor="#7c3aed" stopOpacity="0" /></linearGradient></defs>
            <path d={`${currentLine} ${getX(data.length - 1)},${getY(minVal)} ${getX(0)},${getY(minVal)}`} fill="url(#evoGrad)" className="transition-all duration-1000 ease-out" />
            <polyline points={prevLine} fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 3" className="transition-all duration-1000 ease-out" style={{ opacity: animated ? 0.5 : 0 }} />
            <polyline points={currentLine} fill="none" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-all duration-1000 ease-out" />
            {data.map((d, i) => {
              const x = getX(i);
              const y = animated ? getY(d.score) : getY(minVal);
              const isHovered = hovered === i;
              return (
                <g key={i}>
                  <circle cx={x} cy={y} r={isHovered ? 5 : 0} fill="#7c3aed" className="transition-all duration-200 cursor-pointer" />
                  <rect x={x - 12} y={y - 12} width="24" height="24" fill="transparent" onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)} />
                </g>
              );
            })}
            {data.map((d, i) => (
              <text key={i} x={getX(i)} y={height - 4} textAnchor="middle" className="fill-muted-foreground/40" fontSize="7">{d[view === "weekly" ? "week" : "month"]}</text>
            ))}
          </svg>
          {hovered !== null && (
            <div className="absolute bg-card border border-border rounded-lg px-3 py-2 shadow-lg pointer-events-none z-10" style={{ left: `${(hovered / (data.length - 1)) * 100}%`, top: "0%", transform: "translate(-50%, -120%)" }}>
              <p className="text-[9px] text-muted-foreground">{data[hovered][view === "weekly" ? "week" : "month"]}</p>
              <p className="text-xs font-bold text-foreground">{data[hovered].score}</p>
              <p className="text-[9px] text-muted-foreground/60">Prev: {data[hovered].previous}</p>
            </div>
          )}
        </div>

        <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-[10px] text-muted-foreground/60">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-accent" /> Current</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-orange-500" /> Previous</span>
          </div>
          <span>+{data[data.length - 1].score - data[0].score} pts growth</span>
        </div>
      </div>
    </div>
  );
}
