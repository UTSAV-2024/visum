import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";
import { COMPETITORS, FEATURE_COMPARISON, YOUR_SITE } from "./data";

export function FeatureComparison({ className }) {
  const [isVisible, setIsVisible] = useState(false);
  const competitorNames = COMPETITORS.filter((c) => c.name !== "Your Site").map((c) => c.name);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const total = FEATURE_COMPARISON.length;
  const yoursDone = FEATURE_COMPARISON.filter((f) => f.yours).length;

  return (
    <div className={cn("relative rounded-2xl border border-border bg-card transition-all duration-500", isVisible ? "opacity-100" : "opacity-0", className)}>
      <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.02] to-transparent pointer-events-none rounded-2xl" />
      <div className="relative z-10 p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 text-accent" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M1 2.75A.75.75 0 011.75 2h16.5a.75.75 0 010 1.5H1.75A.75.75 0 011 2.75zm0 5A.75.75 0 011.75 7h16.5a.75.75 0 010 1.5H1.75A.75.75 0 011 7.75zm0 5a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H1.75a.75.75 0 01-.75-.75zm0 5a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H1.75a.75.75 0 01-.75-.75z" clipRule="evenodd" />
            </svg>
            <p className="text-xs font-semibold uppercase tracking-widest text-foreground">Feature Comparison</p>
          </div>
          <span className="text-[10px] text-muted-foreground/60">{yoursDone}/{total} features</span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto -mx-5">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left font-semibold text-muted-foreground/70 uppercase tracking-wider text-[9px] pb-2 px-5 sticky left-0 bg-card">Feature</th>
                <th className="text-center font-semibold text-accent uppercase tracking-wider text-[9px] pb-2 px-3">You</th>
                {competitorNames.map((name) => (
                  <th key={name} className="text-center font-semibold text-muted-foreground/70 uppercase tracking-wider text-[9px] pb-2 px-3">{name}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {FEATURE_COMPARISON.map((f) => (
                <tr key={f.feature} className="hover:bg-muted/10 transition-colors">
                  <td className="py-2.5 px-5 sticky left-0 bg-card text-foreground font-medium">{f.feature}</td>
                  <td className="text-center py-2.5 px-3">
                    {f.yours ? <CheckIcon color="text-green-500" /> : <XIcon />}
                  </td>
                  {competitorNames.map((name) => (
                    <td key={name} className="text-center py-2.5 px-3">
                      {f.competitors[name] !== undefined ? (
                        f.competitors[name] ? <CheckIcon color="text-green-500" /> : <XIcon />
                      ) : <span className="text-muted-foreground/30">—</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-[10px] text-muted-foreground/60">
          <span>Your site covers {yoursDone}/{total} features</span>
          <span className="text-accent">
            Leader covers {Math.max(...competitorNames.map((n) => FEATURE_COMPARISON.filter((f) => f.competitors[n]).length))}/{total}
          </span>
        </div>
      </div>
    </div>
  );
}

function CheckIcon({ color = "text-green-500" }) {
  return <svg className={cn("h-4 w-4 mx-auto", color)} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
  </svg>;
}

function XIcon() {
  return <svg className="h-4 w-4 mx-auto text-red-500/70" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
  </svg>;
}
