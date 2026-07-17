import { useEffect, useState, useRef } from "react";
import { cn } from "../../lib/utils";
import { CHAT_SUGGESTIONS } from "./data";

export function ChatInterface({ className, onExternalInput }) {
  // Accept external input setter from parent for question chips
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I'm your AI visibility assistant. Ask me anything about your site's AI readiness, issues, or recommendations.", id: "welcome" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = (text) => {
    const msg = (text ?? input).trim();
    if (!msg) return;

    setMessages((prev) => [...prev, { role: "user", content: msg, id: String(Date.now()) }]);
    setInput("");
    setIsTyping(true);

    const responses = {
      "what's blocking my site from appearing in chatgpt": "Your robots.txt file is blocking GPTBot. Fix this by adding 'Allow: GPTBot' to your robots.txt. This alone could improve your score by 15 points.",
      "how can i improve my structured data": "Add JSON-LD structured data to your homepage and key pages. Use schema.org types like WebPage, Article, or Product depending on your content. This could boost your score by 12 points.",
      "which fix will give me the biggest score boost": "Unblocking GPTBot in robots.txt gives the biggest single boost (+15 pts), followed by adding JSON-LD (+12 pts). I'd recommend starting with robots.txt.",
      "how does my site compare to competitors": "Your site ranks #3 out of 5 competitors with a score of 78. The market leader (Competitor A) scores 92. Your main gaps are structured data and page speed.",
      "what's the ai traffic forecast for next month": "Based on current trends, we project your AI traffic to grow from 6,258 to ~8,250 monthly visits — a 32% increase — if you resolve the 3 remaining critical issues.",
      "show me the most critical issues right now": "1. Robots.txt blocks GPTBot (Critical) 2. Missing JSON-LD (Critical) 3. Slow page load speed (High) 4. No llms.txt (Medium) 5. Incomplete meta tags (Low)",
    };

    setTimeout(() => {
      const lower = msg.toLowerCase().trim();
      const reply = Object.entries(responses).find(([key]) => lower.includes(key));
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: reply ? reply[1] : "I'm analyzing your data… Based on your scan results, I recommend starting with the critical issues: unblocking GPTBot in robots.txt and adding JSON-LD structured data. These two fixes alone could improve your score by 27 points.",
        id: String(Date.now() + 1),
      }]);
      setIsTyping(false);
    }, 1200);
  };

  // Sync external input from parent (question chips)
  useEffect(() => {
    if (onExternalInput) {
      setInput(onExternalInput);
    }
  }, [onExternalInput]);

  return (
    <div className={cn("relative rounded-2xl border border-border bg-card flex flex-col transition-all duration-500", isVisible ? "opacity-100" : "opacity-0", className)}>
      <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.02] to-transparent pointer-events-none rounded-2xl" />
      <div className="relative z-10 flex flex-col h-full min-h-[400px]">
        {/* Header */}
        <div className="flex items-center gap-2 px-5 pt-5 pb-3 border-b border-border">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
            <svg className="h-4 w-4 text-accent" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 1a4.5 4.5 0 00-4.5 4.5v2.5a2 2 0 00-2 2v4a2 2 0 002 2h9a2 2 0 002-2v-4a2 2 0 00-2-2v-2.5A4.5 4.5 0 0010 1zm-2.5 7V5.5a2.5 2.5 0 015 0V8h-5z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">AI Assistant</p>
            <p className="text-[10px] text-muted-foreground/60">Ask anything about your AI visibility</p>
          </div>
          <span className="ml-auto flex items-center gap-1.5 text-[10px] text-muted-foreground/60">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse-dot" />
            Online
          </span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
          {messages.map((msg) => (
            <div key={msg.id} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
              <div className={cn(
                "max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed",
                msg.role === "user"
                  ? "bg-accent text-white"
                  : "bg-muted/10 border border-border text-foreground"
              )}>
                {msg.content}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-muted/10 border border-border rounded-2xl px-4 py-3 flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-accent/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="h-2 w-2 rounded-full bg-accent/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="h-2 w-2 rounded-full bg-accent/60 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Suggestions */}
        {messages.length <= 2 && (
          <div className="px-4 pb-2">
            <div className="flex flex-wrap gap-1.5">
              {CHAT_SUGGESTIONS.slice(0, 3).map((s) => (
                <button key={s} onClick={() => handleSend(s)}
                  className="rounded-full border border-border bg-muted/5 px-3 py-1 text-[9px] text-muted-foreground hover:text-foreground hover:border-accent/30 transition-all">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 pt-2 border-t border-border">
          <div className="flex gap-2">              <input data-insight-chat-input
              type="text" value={input} onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend(undefined)}
              placeholder="Ask about your AI visibility..."
              className="flex-1 h-9 rounded-lg border border-border bg-muted/10 px-3 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-accent focus:ring-1 focus:ring-accent"
            />
            <button onClick={() => handleSend(undefined)} disabled={!input.trim() || isTyping}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-white hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.897 28.897 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
