"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Bot,
  Send,
  Lightbulb,
  Clock,
  ChevronRight,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { AI_PM_MESSAGES } from "./data";

export function AIProjectManager() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", content: AI_PM_MESSAGES.morning, id: "welcome" },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg) return;

    setMessages((prev) => [...prev, { role: "user", content: msg, id: String(Date.now()) }]);
    setInput("");

    const responses: Record<string, string> = {
      "what should I do first": "Based on impact and effort, I recommend starting with the robots.txt fix (critical, 5 minutes, +15 points) followed by JSON-LD schema (critical, 30 min, +12 points). These two items alone will unlock 70% of your total potential gain.",
      "how much time do i need": "To complete all 8 open tasks, you'll need approximately 10 hours of engineering work. However, you can achieve 65% of your visibility gains in just 2.5 hours by focusing on the 4 quickest wins first.",
      "what if i only have one hour": "If you only have one hour today: 1) Fix robots.txt (5 min, +15 pts) 2) Create llms.txt (15 min, +8 pts) 3) Improve meta tags (10 min, +8 pts). Total: 30 minutes, +31 visibility points. That's 49% of your total remaining impact in just 30 minutes.",
    };

    setIsTyping(true);
    setTimeout(() => {
      const lower = msg.toLowerCase();
      let reply = "";
      for (const [key, val] of Object.entries(responses)) {
        if (lower.includes(key)) { reply = val; break; }
      }
      if (!reply) {
        reply = "Great question! Based on your current backlog, I'd recommend prioritizing critical and high-priority items first. The robots.txt fix offers the highest ROI at +15 points for just 5 minutes of work. Would you like me to create a detailed implementation plan for any specific task?";
      }
      setMessages((prev) => [...prev, { role: "assistant", content: reply, id: String(Date.now() + 1) }]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-accent/10">
          <Bot className="h-3.5 w-3.5 text-accent" />
        </div>
        <div>
          <p className="text-[11px] font-semibold text-foreground">AI Project Manager</p>
          <p className="text-[8px] text-muted-foreground/50">Your technical lead · Ask anything</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-3 overflow-y-auto scrollbar-thin pr-1 mb-3">
        {messages.map((msg) => (
          <div key={msg.id} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
            <div
              className={cn(
                "max-w-[90%] rounded-xl px-3 py-2 text-[10px] leading-relaxed",
                msg.role === "user"
                  ? "bg-accent/10 text-accent"
                  : "bg-muted/10 border border-border/60 text-muted-foreground/80"
              )}
            >
              {msg.role === "assistant" && (
                <div className="flex items-center gap-1.5 mb-1">
                  <Bot className="h-2.5 w-2.5 text-accent" />
                  <span className="text-[8px] font-semibold text-accent">AI PM</span>
                </div>
              )}
              {msg.content}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-muted/10 border border-border/60 rounded-xl px-3 py-2 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-accent/60 animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="h-1.5 w-1.5 rounded-full bg-accent/60 animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="h-1.5 w-1.5 rounded-full bg-accent/60 animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
      </div>

      {/* Quick Questions */}
      <div className="flex flex-wrap gap-1 mb-2">
        {["What should I do first?", "How much time do I need?", "What if I only have one hour?"].map((q) => (
          <button
            key={q}
            onClick={() => handleSend(q)}
            className="rounded-full border border-border/50 bg-muted/5 px-2 py-1 text-[8px] text-muted-foreground/60 hover:text-foreground hover:border-accent/30 transition-all"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask about your backlog..."
          className="flex-1 h-8 rounded-lg border border-border bg-muted/5 px-3 text-[10px] text-foreground placeholder:text-muted-foreground/30 outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all"
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || isTyping}
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-white hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shrink-0"
        >
          <Send className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
