"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ExternalLink,
  FileText,
  GitBranch,
  Users,
  Clock,
  AlertTriangle,
  TrendingUp,
  Target,
  Server,
  BookOpen,
  Code,
  Link,
  MessageSquare,
  Copy,
  CheckCircle2,
  Lightbulb,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { WORK_ITEMS, PRIORITY_CONFIG, type WorkItem } from "./data";

interface InspectorPanelProps {
  item: WorkItem | null;
  onClose: () => void;
  onToggleComplete: (id: string) => void;
}

export function InspectorPanel({ item, onClose, onToggleComplete }: InspectorPanelProps) {
  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-16 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted/10 mb-3">
          <Lightbulb className="h-5 w-5 text-muted-foreground/30" />
        </div>
        <p className="text-sm font-medium text-foreground">Select a task</p>
        <p className="text-xs text-muted-foreground/60 mt-1 max-w-[200px]">
          Click any recommendation to inspect details, implementation guide, and AI analysis
        </p>
      </div>
    );
  }

  const pc = PRIORITY_CONFIG[item.priority];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="h-full flex flex-col"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={cn("text-[9px] font-semibold px-1.5 py-0.5 rounded", pc.bg, pc.text)}>
              {item.priority}
            </span>
            <span className="text-[9px] text-muted-foreground/60 bg-muted/10 px-1.5 py-0.5 rounded">
              {item.category}
            </span>
          </div>
          <h3 className="text-sm font-bold text-foreground leading-snug">{item.title}</h3>
        </div>
        <button
          onClick={onClose}
          className="flex h-6 w-6 items-center justify-center rounded-md hover:bg-muted/10 text-muted-foreground hover:text-foreground transition-colors shrink-0"
          aria-label="Close inspector"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin space-y-4 pr-1">
        {/* Description */}
        <p className="text-[11px] text-muted-foreground/80 leading-relaxed">{item.description}</p>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg border border-border/60 bg-muted/5 p-2.5">
            <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground/50 mb-1">
              <TrendingUp className="h-3 w-3" />
              Score Impact
            </div>
            <p className="text-sm font-bold text-green-500 font-mono tabular-nums">+{item.scoreImprovement} pts</p>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/5 p-2.5">
            <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground/50 mb-1">
              <Target className="h-3 w-3" />
              Traffic Impact
            </div>
            <p className="text-sm font-bold text-accent font-mono tabular-nums">+{item.trafficImprovement}%</p>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/5 p-2.5">
            <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground/50 mb-1">
              <Clock className="h-3 w-3" />
              Time
            </div>
            <p className="text-xs font-semibold text-foreground font-mono">{item.implementationTime}</p>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/5 p-2.5">
            <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground/50 mb-1">
              <Users className="h-3 w-3" />
              Assignee
            </div>
            <p className="text-xs font-semibold text-foreground">{item.assignee || "Unassigned"}</p>
          </div>
        </div>

        {/* Business Impact */}
        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <AlertTriangle className="h-3 w-3 text-orange-500" />
            <span className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/50">Business Impact</span>
          </div>
          <p className="text-[11px] text-muted-foreground/70 leading-relaxed">{item.businessImpact}</p>
        </div>

        {/* Technical Explanation */}
        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <Code className="h-3 w-3 text-accent" />
            <span className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/50">Technical</span>
          </div>
          <p className="text-[11px] text-muted-foreground/70 leading-relaxed">{item.technicalExplanation}</p>
        </div>

        {/* AI Explanation */}
        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <Target className="h-3 w-3 text-accent" />
            <span className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/50">AI Explanation</span>
          </div>
          <div className="rounded-lg border border-accent/10 bg-accent/[0.02] p-3">
            <p className="text-[11px] text-muted-foreground/80 leading-relaxed italic">
              &ldquo;{item.aiExplanation}&rdquo;
            </p>
          </div>
        </div>

        {/* Affected Pages */}
        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <Server className="h-3 w-3 text-accent" />
            <span className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/50">Affected Pages</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {item.affectedPages.map((p) => (
              <span key={p} className="rounded-md bg-muted/10 border border-border/60 px-2 py-0.5 text-[9px] font-mono text-muted-foreground/70">
                {p}
              </span>
            ))}
          </div>
        </div>

        {/* Implementation Guide */}
        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <BookOpen className="h-3 w-3 text-green-500" />
            <span className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/50">Implementation Guide</span>
          </div>
          <ol className="space-y-1">
            {item.implementationGuide.map((step, i) => (
              <li key={i} className="flex items-start gap-2 text-[10px] text-muted-foreground/70">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-muted/10 text-[8px] font-mono font-bold text-muted-foreground/50 shrink-0 mt-0.5">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        {/* Files to Modify */}
        {item.filesToModify.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <GitBranch className="h-3 w-3 text-accent" />
              <span className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/50">Files to Modify</span>
            </div>
            <div className="space-y-1">
              {item.filesToModify.map((f) => (
                <div key={f} className="flex items-center gap-2 rounded-lg bg-muted/5 border border-border/40 px-2.5 py-1.5">
                  <FileText className="h-3 w-3 text-accent/60" />
                  <code className="text-[10px] font-mono text-foreground/80">{f}</code>
                  <button className="ml-auto text-muted-foreground/30 hover:text-muted-foreground/60 transition-colors" aria-label={`Copy ${f}`}>
                    <Copy className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Code Preview */}
        {item.codePreview && (
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <Code className="h-3 w-3 text-accent" />
              <span className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/50">Code Preview</span>
            </div>
            <pre className="rounded-lg bg-muted/10 border border-border/60 p-3 text-[10px] font-mono leading-relaxed text-foreground/70 overflow-x-auto">
              {item.codePreview}
            </pre>
          </div>
        )}

        {/* Documentation */}
        {item.documentation.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <Link className="h-3 w-3 text-accent" />
              <span className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/50">Documentation</span>
            </div>
            <div className="space-y-1">
              {item.documentation.map((doc, i) => (
                <a
                  key={i}
                  href={doc.url}
                  className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-muted/10 transition-colors group"
                >
                  <ExternalLink className="h-3 w-3 text-accent/60" />
                  <span className="text-[10px] text-muted-foreground/70 group-hover:text-foreground transition-colors">{doc.label}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Comments */}
        {item.comments.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <MessageSquare className="h-3 w-3 text-accent" />
              <span className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/50">Comments</span>
            </div>
            <div className="space-y-2">
              {item.comments.map((c) => (
                <div key={c.id} className="flex items-start gap-2 rounded-lg bg-muted/5 border border-border/40 p-2.5">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 text-[8px] font-semibold text-accent">
                    {c.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-semibold text-foreground">{c.author}</span>
                      <span className="text-[8px] text-muted-foreground/40">{c.timestamp}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground/70 mt-0.5">{c.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-2 pt-2 pb-4 sticky bottom-0 bg-background">
          {!item.completed && (
            <button
              onClick={() => onToggleComplete(item.id)}
              className="flex items-center gap-1.5 rounded-lg bg-green-500/10 px-4 py-2 text-[11px] font-semibold text-green-500 hover:bg-green-500/20 transition-colors"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Mark Complete
            </button>
          )}
          <button className="flex items-center gap-1.5 rounded-lg bg-accent/10 px-4 py-2 text-[11px] font-semibold text-accent hover:bg-accent/20 transition-colors">
            <GitBranch className="h-3.5 w-3.5" />
            Generate PR
          </button>
          <button className="flex items-center gap-1.5 rounded-lg border border-border bg-muted/5 px-4 py-2 text-[11px] text-muted-foreground hover:text-foreground transition-colors">
            <Copy className="h-3.5 w-3.5" />
            Copy
          </button>
        </div>
      </div>
    </motion.div>
  );
}
