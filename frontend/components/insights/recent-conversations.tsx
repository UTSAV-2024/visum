import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";
import { RECENT_CONVERSATIONS } from "./data";

export function RecentConversations({ onSelectConversation, className }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className={cn("relative rounded-2xl border border-border bg-card p-5 transition-all duration-500", isVisible ? "opacity-100" : "opacity-0", className)}>
      <div className="flex items-center gap-2 mb-3">
        <svg className="h-4 w-4 text-accent" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3.43 2.524A41.29 41.29 0 0110 2c2.236 0 4.43.18 6.57.524 1.437.231 2.43 1.49 2.43 2.902v5.148c0 1.413-.993 2.67-2.43 2.902a41.202 41.202 0 01-5.183.501.78.78 0 00-.528.224l-3.579 3.58A.75.75 0 016 17.25v-3.443a41.033 41.033 0 01-2.57-.33C2.08 13.244 1 11.986 1 10.573V5.426c0-1.413.993-2.67 2.43-2.902z" clipRule="evenodd" />
        </svg>
        <p className="text-xs font-semibold uppercase tracking-widest text-foreground">Recent Conversations</p>
      </div>

      <div className="space-y-1">
        {RECENT_CONVERSATIONS.map((conv) => (
          <button
            key={conv.id}
            onClick={() => onSelectConversation?.(conv.id)}
            className="w-full text-left rounded-xl px-3 py-2.5 hover:bg-muted/10 transition-colors group"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-foreground group-hover:text-accent transition-colors">{conv.title}</p>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] text-muted-foreground/50">{conv.date}</span>
                <span className="rounded-full bg-accent/10 px-1.5 py-px text-[8px] font-medium text-accent">{conv.messages}</span>
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground/60 mt-0.5 line-clamp-1">{conv.preview}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
