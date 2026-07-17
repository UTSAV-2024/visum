import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";

const ACHIEVEMENTS = [
  { id: "first-fix", label: "First Fix", description: "Complete your first recommendation", icon: "M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z", threshold: 1, completed: true },
  { id: "quarter", label: "Quarter Way", description: "Complete 25% of all recommendations", icon: "M10 1a4.5 4.5 0 00-4.5 4.5v2.5a2 2 0 00-2 2v4a2 2 0 002 2h9a2 2 0 002-2v-4a2 2 0 00-2-2v-2.5A4.5 4.5 0 0010 1zm-2.5 7V5.5a2.5 2.5 0 015 0V8h-5z", threshold: 25, completed: false },
  { id: "halfway", label: "Halfway There", description: "Complete 50% of all recommendations", icon: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z", threshold: 50, completed: false },
  { id: "crawling", label: "Crawl Master", description: "Fix all crawlablity issues", icon: "M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z", threshold: 100, completed: false },
  { id: "perfectionist", label: "Perfectionist", description: "Complete all recommendations", icon: "M10 1a4.5 4.5 0 00-4.5 4.5v2.5a2 2 0 00-2 2v4a2 2 0 002 2h9a2 2 0 002-2v-4a2 2 0 00-2-2v-2.5A4.5 4.5 0 0010 1zm-2.5 7V5.5a2.5 2.5 0 015 0V8h-5z", threshold: 100, completed: false },
];

export function AchievementSystem({ completionPct, fixedCategories, className }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const achievements = ACHIEVEMENTS.map((a) => ({
    ...a,
    unlocked: a.id === "first-fix" ? true : a.id === "crawling" ? false : a.id === "perfectionist" ? completionPct >= 100 : completionPct >= a.threshold,
  }));

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

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
            <svg className="h-4 w-4 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5v2.5a2 2 0 00-2 2v4a2 2 0 002 2h9a2 2 0 002-2v-4a2 2 0 00-2-2v-2.5A4.5 4.5 0 0010 1zm-2.5 7V5.5a2.5 2.5 0 015 0V8h-5z" />
            </svg>
            <p className="text-xs font-semibold uppercase tracking-widest text-foreground">
              Achievements
            </p>
          </div>
          <span className="text-[10px] text-muted-foreground">{unlockedCount}/{achievements.length}</span>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={cn(
                "flex flex-col items-center gap-1.5 rounded-xl p-2.5 text-center transition-all duration-300",
                ach.unlocked
                  ? "bg-amber-500/10 border border-amber-500/20"
                  : "bg-muted/5 border border-border/50 opacity-50"
              )}
            >
              <div className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg",
                ach.unlocked ? "bg-amber-500/20 text-amber-500" : "bg-muted/20 text-muted-foreground"
              )}>
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d={ach.icon} clipRule="evenodd" />
                </svg>
              </div>
              <p className={cn(
                "text-[9px] font-semibold leading-tight",
                ach.unlocked ? "text-amber-500" : "text-muted-foreground"
              )}>
                {ach.label}
              </p>
              {/* Tooltip area */}
              <p className="text-[7px] text-muted-foreground/60 leading-tight hidden sm:block">
                {ach.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
