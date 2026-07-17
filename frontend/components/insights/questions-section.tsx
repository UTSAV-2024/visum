import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";
import { CHAT_SUGGESTIONS } from "./data";

export function QuestionsSection({ onQuestionClick, className }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className={cn("relative rounded-2xl border border-border bg-card p-5 transition-all duration-500", isVisible ? "opacity-100" : "opacity-0", className)}>
      <div className="flex items-center gap-2 mb-3">
        <svg className="h-4 w-4 text-accent" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
        </svg>
        <p className="text-xs font-semibold uppercase tracking-widest text-foreground">Questions AI Can Answer</p>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {CHAT_SUGGESTIONS.map((q) => (
          <button
            key={q}
            onClick={() => onQuestionClick?.(q)}
            className="rounded-full border border-border bg-muted/5 px-3 py-1.5 text-[10px] text-muted-foreground hover:text-foreground hover:border-accent/30 hover:bg-accent/[0.02] transition-all"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
