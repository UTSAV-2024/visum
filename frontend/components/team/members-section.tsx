import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";
import { TEAM_MEMBERS } from "./data";

export function MembersSection({ onInvite, className }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const roleColors = {
    Owner: "bg-amber-500/10 text-amber-500",
    Admin: "bg-accent/10 text-accent",
    Member: "bg-blue-500/10 text-blue-500",
    Viewer: "bg-muted/20 text-muted-foreground",
  };

  const statusDots = {
    active: "bg-green-500",
    idle: "bg-orange-500",
    away: "bg-muted-foreground/50",
  };

  return (
    <div className={cn("relative rounded-2xl border border-border bg-card transition-all duration-500", isVisible ? "opacity-100" : "opacity-0", className)}>
      <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.02] to-transparent pointer-events-none rounded-2xl" />
      <div className="relative z-10 p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 text-accent" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
            </svg>
            <p className="text-xs font-semibold uppercase tracking-widest text-foreground">Team Members</p>
            <span className="rounded-full bg-accent/10 px-1.5 py-0.5 text-[9px] font-bold text-accent">{TEAM_MEMBERS.length}</span>
          </div>
          <button onClick={onInvite} className="inline-flex items-center gap-1 rounded-lg bg-accent/10 px-2.5 py-1.5 text-[10px] font-semibold text-accent hover:bg-accent/20 transition-all">
            <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.362 1.093a.75.75 0 00-.724 0L2.523 5.018 10 9.143l7.477-4.125-7.115-3.925zM18 6.443l-7.25 4v8.25l6.862-3.786A.75.75 0 0018 14.25V6.443zm-8.75 12.25v-8.25l-7.25-4v7.807a.75.75 0 00.388.657l6.862 3.786z" />
            </svg>
            Invite
          </button>
        </div>

        <div className="space-y-2">
          {TEAM_MEMBERS.map((member) => (
            <div key={member.id} className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-muted/10 transition-colors group">
              <div className="relative shrink-0">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/10 text-[11px] font-bold text-accent">
                  {member.avatar}
                </div>
                <span className={cn("absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card", statusDots[member.status])} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-semibold text-foreground">{member.name}</p>
                  <span className={cn("rounded px-1.5 py-px text-[8px] font-semibold", roleColors[member.role])}>{member.role}</span>
                </div>
                <p className="text-[10px] text-muted-foreground/60 mt-0.5">{member.email} · {member.scans} scans</p>
              </div>
              <span className="text-[9px] text-muted-foreground/40 group-hover:text-muted-foreground/60 transition-colors">{member.lastActive}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
