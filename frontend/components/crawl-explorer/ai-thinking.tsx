"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ChevronDown, Bot, MessageSquare, Copy, CheckCheck } from "lucide-react";
import { cn } from "../../lib/utils";
import { Panel, Badge } from "./shared";
import { getAIThinking, type EngineInfo } from "./data";

interface AIThinkingProps {
  engine: EngineInfo;
}

export function AIThinking({ engine }: AIThinkingProps) {
  const [expanded, setExpanded] = useState(true);
  const [copied, setCopied] = useState(false);
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  const fullText = getAIThinking(engine.id);

  // Typewriter effect
  useEffect(() => {
    if (!expanded) return;
    setIsTyping(true);
    setText("");
    let i = 0;
    const interval = setInterval(() => {
      if (i < fullText.length) {
        setText(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 8);
    return () => clearInterval(interval);
  }, [engine.id, expanded, fullText]);

  const handleCopy = () => {
    navigator.clipboard.writeText(fullText).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Panel className="shrink-0">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full px-4 py-2.5 border-b border-border bg-muted/5 hover:bg-muted/10 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Bot className="h-3.5 w-3.5 text-accent" />
          <p className="text-[10px] font-semibold uppercase tracking-widest text-foreground">
            AI Thinking — {engine.name}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isTyping && (
            <span className="flex items-center gap-1 text-[9px] text-accent/60">
              <span className="h-1 w-1 rounded-full bg-accent animate-pulse" />
              Thinking
            </span>
          )}
          <ChevronDown
            className={cn(
              "h-3 w-3 text-muted-foreground/40 transition-transform duration-200",
              expanded && "rotate-180"
            )}
          />
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="relative p-4">
              {/* Engine indicator */}
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: engine.color }}
                />
                <span className="text-[10px] font-semibold text-foreground">{engine.name}</span>
                <Badge variant={engine.status === "healthy" ? "success" : "warning"}>
                  {engine.avgSuccess}% success
                </Badge>
              </div>

              {/* Conversation bubble */}
              <div className="relative rounded-xl border border-accent/10 bg-gradient-to-br from-accent/[0.03] to-transparent p-4">
                <div className="absolute top-3 right-3">
                  <MessageSquare className="h-3.5 w-3.5 text-accent/30" />
                </div>

                <div className="pr-6">
                  <p className="text-[11px] leading-relaxed text-muted-foreground/80">
                    {text}
                    {isTyping && (
                      <motion.span
                        animate={{ opacity: [0, 1] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                        className="inline-block w-1.5 h-3.5 bg-accent/60 ml-0.5 rounded-sm align-text-bottom"
                      />
                    )}
                  </p>
                </div>
              </div>

              {/* Copy button */}
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 mt-2 text-[9px] text-muted-foreground/40 hover:text-foreground transition-colors"
              >
                {copied ? (
                  <>
                    <CheckCheck className="h-3 w-3 text-green-500" />
                    <span className="text-green-500">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    Copy analysis
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Panel>
  );
}
