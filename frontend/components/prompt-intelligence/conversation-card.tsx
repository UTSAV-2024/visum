"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Quote,
  BookOpen,
  Hash,
  Brain,
  Lightbulb,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  FileText,
  Eye,
  Gauge,
  Clock,
  MessageSquare,
  Bot,
  Target,
} from "lucide-react";
import { cn } from "../../lib/utils";
import type { ConversationPrompt } from "./data";
import { ENGINE_COLORS, ENGINE_NAMES, JOURNEY_STEPS } from "./data";

interface ConversationCardProps {
  conversation: ConversationPrompt;
  isExpanded: boolean;
  onToggle: () => void;
}

function QualityBadge({ quality }: { quality: string }) {
  const colors: Record<string, string> = {
    excellent: "bg-green-500/10 text-green-500 border-green-500/20",
    good: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    fair: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    poor: "bg-red-500/10 text-red-500 border-red-500/20",
  };
  return (
    <span className={cn("rounded-full border px-2 py-0.5 text-[9px] font-semibold", colors[quality] || "")}>
      {quality.charAt(0).toUpperCase() + quality.slice(1)}
    </span>
  );
}

function RiskBadge({ risk }: { risk: string }) {
  const colors: Record<string, string> = {
    low: "bg-green-500/10 text-green-500 border-green-500/20",
    medium: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    high: "bg-red-500/10 text-red-500 border-red-500/20",
  };
  return (
    <span className={cn("rounded-full border px-2 py-0.5 text-[9px] font-semibold", colors[risk] || "")}>
      {risk === "low" ? "Low Risk" : risk === "medium" ? "Medium Risk" : "High Risk"}
    </span>
  );
}

// Journey visualization
function PromptJourney() {
  return (
    <div className="flex items-center gap-1.5 py-3 overflow-x-auto scrollbar-none">
      {JOURNEY_STEPS.map((step, i) => (
        <div key={step.id} className="flex items-center gap-1.5 shrink-0">
          <div className="group relative">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/10 text-accent">
              {step.icon === "message-square" && <MessageSquare className="h-3 w-3" />}
              {step.icon === "search" && <Search className="h-3 w-3" />}
              {step.icon === "arrow-up-down" && <ArrowUpRight className="h-3 w-3" />}
              {step.icon === "file-text" && <FileText className="h-3 w-3" />}
              {step.icon === "bot" && <Bot className="h-3 w-3" />}
              {step.icon === "quote" && <Quote className="h-3 w-3" />}
              {step.icon === "gauge" && <Gauge className="h-3 w-3" />}
            </div>
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              <span className="text-[8px] text-muted-foreground/60 bg-card border border-border rounded px-1.5 py-0.5">
                {step.description}
              </span>
            </div>
          </div>
          {i < JOURNEY_STEPS.length - 1 && (
            <div className="flex items-center">
              <div className="h-px w-4 bg-muted-foreground/20" />
              <ChevronDown className="h-2.5 w-2.5 -ml-1 text-muted-foreground/20 -rotate-90" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function ConversationCard({ conversation, isExpanded, onToggle }: ConversationCardProps) {
  const conv = conversation;
  const engineColor = ENGINE_COLORS[conv.engine] || "#888";
  const engineName = ENGINE_NAMES[conv.engine] || conv.engine;
  const isHighRisk = conv.hallucinationRisk === "high";
  const isLowConfidence = conv.confidence < 60;

  return (
    <motion.div
      layout
      className={cn(
        "rounded-xl border transition-all duration-200",
        isHighRisk
          ? "border-red-500/20 bg-red-500/[0.02]"
          : isLowConfidence
          ? "border-orange-500/20 bg-orange-500/[0.02]"
          : "border-border bg-card hover:border-accent/20"
      )}
    >
      {/* Header / Main Row */}
      <button
        onClick={onToggle}
        className="w-full text-left p-4 focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-1 focus-visible:ring-offset-background outline-none rounded-xl"
        aria-expanded={isExpanded}
      >
        <div className="flex items-start gap-3">
          {/* Engine indicator */}
          <div
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
            style={{ backgroundColor: `${engineColor}15`, color: engineColor }}
          >
            <Brain className="h-3.5 w-3.5" />
          </div>

          <div className="flex-1 min-w-0">
            {/* Top row: engine + confidence + time */}
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-[10px] font-semibold" style={{ color: engineColor }}>
                {engineName}
              </span>
              <span className="flex items-center gap-1 text-[10px] font-mono tabular-nums text-muted-foreground/60">
                <Target className="h-2.5 w-2.5" />
                {conv.confidence}%
              </span>
              <QualityBadge quality={conv.answerQuality} />
              {isHighRisk && <RiskBadge risk="high" />}
              <span className="text-[9px] text-muted-foreground/40 ml-auto">{conv.time}</span>
            </div>

            {/* Question */}
            <p className="text-xs sm:text-sm font-semibold text-foreground leading-snug">
              &ldquo;{conv.question}&rdquo;
            </p>

            {/* Quick stats row */}
            <div className="flex items-center gap-3 mt-2">
              <span className="flex items-center gap-1 text-[9px] text-muted-foreground/50">
                <BookOpen className="h-2.5 w-2.5" />
                {conv.retrievedPages.length} pages
              </span>
              <span className="flex items-center gap-1 text-[9px] text-muted-foreground/50">
                <Quote className="h-2.5 w-2.5" />
                {conv.citations.length} citations
              </span>
              <span className="flex items-center gap-1 text-[9px] text-muted-foreground/50">
                <Hash className="h-2.5 w-2.5" />
                {conv.estimatedTokens} tokens
              </span>
              <span className="flex items-center gap-1 text-[9px] text-muted-foreground/50">
                <Eye className="h-2.5 w-2.5" />
                {conv.visibilityScore}
              </span>
            </div>
          </div>

          {/* Expand icon */}
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground/30 mt-1 shrink-0 transition-transform duration-200",
              isExpanded && "rotate-180"
            )}
          />
        </div>
      </button>

      {/* Expanded Detail */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-0 space-y-4 border-t border-border/50">
              {/* AI Answer */}
              <div className="mt-3">
                <div className="flex items-center gap-2 mb-2">
                  <Bot className="h-3 w-3 text-accent" />
                  <span className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/50">AI Answer</span>
                </div>
                <div className="rounded-lg border border-border/60 bg-muted/5 p-3">
                  <p className="text-xs text-muted-foreground leading-relaxed">{conv.answer}</p>
                </div>
              </div>

              {/* Prompt Journey */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <ArrowUpRight className="h-3 w-3 text-accent" />
                  <span className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/50">Prompt Journey</span>
                </div>
                <PromptJourney />
              </div>

              {/* Two-column layout for details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Retrieved Pages */}
                <div>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                    <span className="text-[9px] font-semibold text-green-500/80">Retrieved</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {conv.retrievedPages.map((p) => (
                      <span
                        key={p}
                        className="rounded-md border border-green-500/20 bg-green-500/5 px-2 py-0.5 text-[9px] font-medium text-green-500/80"
                      >
                        /{p}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Ignored Pages */}
                <div>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <XCircle className="h-3 w-3 text-muted-foreground/40" />
                    <span className="text-[9px] font-semibold text-muted-foreground/40">Ignored</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {conv.ignoredPages.map((p) => (
                      <span
                        key={p}
                        className="rounded-md border border-border bg-muted/5 px-2 py-0.5 text-[9px] font-medium text-muted-foreground/50"
                      >
                        /{p}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Citations */}
                <div>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Quote className="h-3 w-3 text-accent" />
                    <span className="text-[9px] font-semibold text-muted-foreground/50">Citations</span>
                  </div>
                  <div className="space-y-1">
                    {conv.citations.map((c, i) => (
                      <div
                        key={i}
                        className="rounded-lg border border-border/40 bg-muted/5 p-2"
                      >
                        <span className="text-[9px] font-medium text-accent">{c.page}</span>
                        <p className="text-[9px] text-muted-foreground/60 mt-0.5 leading-relaxed">
                          &ldquo;{c.snippet}&rdquo;
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Meta Stats */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5">
                    <Target className="h-3 w-3 text-accent" />
                    <span className="text-[9px] font-semibold text-muted-foreground/50">Details</span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-muted-foreground/60">Visibility Score</span>
                      <span className="text-[10px] font-mono font-semibold tabular-nums text-foreground">{conv.visibilityScore}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-muted-foreground/60">Structured Data</span>
                      <span className={cn("text-[10px] font-semibold", conv.structuredDataUsed ? "text-green-500" : "text-red-500")}>
                        {conv.structuredDataUsed ? "Used" : "Missing"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-muted-foreground/60">MCP Tool Used</span>
                      <span className={cn("text-[10px] font-mono tabular-nums", conv.mcpToolUsed ? "text-accent" : "text-muted-foreground/50")}>
                        {conv.mcpToolUsed || "None"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-muted-foreground/60">Estimated Tokens</span>
                      <span className="text-[10px] font-mono tabular-nums text-foreground">{conv.estimatedTokens.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-muted-foreground/60">Hallucination Risk</span>
                      <span className={cn(
                        "text-[10px] font-semibold",
                        conv.hallucinationRisk === "low" ? "text-green-500" :
                        conv.hallucinationRisk === "medium" ? "text-orange-500" : "text-red-500"
                      )}>
                        {conv.hallucinationRisk.charAt(0).toUpperCase() + conv.hallucinationRisk.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reasoning Summary */}
              <div>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Brain className="h-3 w-3 text-accent" />
                  <span className="text-[9px] font-semibold text-muted-foreground/50">AI Reasoning</span>
                </div>
                <p className="text-[10px] text-muted-foreground/70 leading-relaxed italic">
                  {conv.reasoningSummary}
                </p>
              </div>

              {/* Suggested Improvements */}
              {conv.suggestedImprovements.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Lightbulb className="h-3 w-3 text-orange-500" />
                    <span className="text-[9px] font-semibold text-orange-500/80">Suggested Improvements</span>
                  </div>
                  <div className="space-y-1">
                    {conv.suggestedImprovements.map((imp, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="text-orange-500/60 mt-0.5 text-[9px]">→</span>
                        <span className="text-[10px] text-muted-foreground/70">{imp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
