"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  FileJson,
  Code2,
  Hash,
  Link2,
  Globe,
  Languages,
  Sparkles,
  FileText,
  AlertTriangle,
  CheckCircle2,
  X,
  ExternalLink,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { TabBar, Badge } from "./shared";
import type { CrawlPage } from "./data";

const INSPECTOR_TABS = [
  { id: "preview", label: "Preview" },
  { id: "metadata", label: "Metadata" },
  { id: "headers", label: "Headers" },
  { id: "schema", label: "Schema" },
  { id: "jsonld", label: "JSON-LD" },
  { id: "og", label: "Open Graph" },
  { id: "summary", label: "AI Summary" },
];

interface InspectorProps {
  page: CrawlPage | null;
  onClose: () => void;
}

export function Inspector({ page, onClose }: InspectorProps) {
  const [activeTab, setActiveTab] = useState("preview");

  if (!page) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center px-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 mb-3">
          <Eye className="h-5 w-5 text-accent/60" />
        </div>
        <p className="text-xs font-medium text-muted-foreground">Select a page</p>
        <p className="text-[10px] text-muted-foreground/40 mt-1 max-w-[180px]">
          Click any node in the crawl graph to inspect its full details
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border flex items-center justify-between shrink-0">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full shrink-0"
              style={{
                backgroundColor:
                  page.status === "success"
                    ? "#22c55e"
                    : page.status === "partial"
                    ? "#eab308"
                    : page.status === "failed"
                    ? "#ef4444"
                    : "#f97316",
              }}
            />
            <p className="text-xs font-semibold text-foreground truncate">{page.path}</p>
          </div>
          <p className="text-[9px] text-muted-foreground/50 mt-0.5 truncate">{page.url}</p>
        </div>
        <button
          onClick={onClose}
          className="flex items-center justify-center w-6 h-6 rounded-md text-muted-foreground/40 hover:text-foreground hover:bg-muted/20 transition-colors shrink-0"
          aria-label="Close inspector"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Tabs */}
      <TabBar tabs={INSPECTOR_TABS} active={activeTab} onChange={setActiveTab} />

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.12 }}
            className="p-4 space-y-3"
          >
            {activeTab === "preview" && <PreviewTab page={page} />}
            {activeTab === "metadata" && <MetadataTab page={page} />}
            {activeTab === "headers" && <HeadersTab page={page} />}
            {activeTab === "schema" && <SchemaTab page={page} />}
            {activeTab === "jsonld" && <JSONLDTab page={page} />}
            {activeTab === "og" && <OpenGraphTab page={page} />}
            {activeTab === "summary" && <AISummaryTab page={page} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ── Tab: Preview ────────────────────────────────────────────────

function PreviewTab({ page }: { page: CrawlPage }) {
  return (
    <>
      <Section title="Page Preview">
        <div className="rounded-lg border border-border bg-muted/10 p-3">
          <p className="text-xs font-semibold text-foreground">{page.title}</p>
          <p className="text-[10px] text-muted-foreground/60 mt-0.5 line-clamp-3">
            {page.path === "/"
              ? "Welcome to Acme Inc. We provide enterprise-grade solutions for modern businesses. Our platform helps teams collaborate, build, and scale."
              : page.path === "/products"
              ? "Explore our product suite: Analytics Platform ($49/mo), Developer SDK ($99/mo), Enterprise Suite (Custom pricing). All products include 14-day free trial."
              : page.path === "/pricing"
              ? "[Content rendered via JavaScript] Pricing information is loaded dynamically and may not be fully accessible to AI crawlers. Consider adding structured data."
              : "Content extracted successfully."}
          </p>
        </div>
      </Section>

      <Section title="AI Visibility">
        <div className="space-y-2">
          <MetricRow label="AI Score" value={`${page.aiScore}/100`} color={page.aiScore >= 80 ? "text-green-500" : page.aiScore >= 50 ? "text-orange-500" : "text-red-500"} />
          <MetricRow label="Token Count" value={page.tokenCount.toLocaleString()} />
          <MetricRow label="Content Size" value={page.contentSize} />
          <MetricRow label="Response Time" value={page.responseTime} />
        </div>
      </Section>

      <Section title="Prompt Readiness">
        <div className="flex items-center gap-2">
          {page.structuredData ? (
            <Badge variant="success">Ready for prompts</Badge>
          ) : (
            <Badge variant="warning">Missing schema</Badge>
          )}
          {page.hasJSONLD && <Badge variant="success">JSON-LD</Badge>}
          {page.hasOG && <Badge variant="success">Open Graph</Badge>}
          <Badge variant={page.status === "success" ? "success" : "error"}>{page.statusCode > 0 ? `${page.statusCode}` : "N/A"}</Badge>
        </div>
        {page.status === "failed" && (
          <p className="text-[10px] text-red-500/80 mt-1">This page returned an error and could not be fully analyzed.</p>
        )}
        {page.status === "partial" && (
          <p className="text-[10px] text-orange-500/80 mt-1">Content was partially extracted. Some information may be missing.</p>
        )}
        {page.status === "skipped" && (
          <p className="text-[10px] text-orange-500/80 mt-1">This page was skipped due to JavaScript rendering requirements.</p>
        )}
      </Section>
    </>
  );
}

// ── Tab: Metadata ───────────────────────────────────────────────

function MetadataTab({ page }: { page: CrawlPage }) {
  return (
    <Section title="Page Metadata">
      <div className="space-y-2">
        <MetricRow label="URL" value={page.url} mono />
        <MetricRow label="Path" value={page.path} mono />
        <MetricRow label="Title" value={page.title} />
        <MetricRow label="Content Type" value={page.contentType} />
        <MetricRow label="Language" value={page.language} />
        <MetricRow label="Status Code" value={`${page.statusCode}`} color={page.statusCode >= 400 ? "text-red-500" : page.statusCode >= 300 ? "text-orange-500" : "text-green-500"} />
        <MetricRow label="Last Updated" value={page.lastUpdated} />
        <MetricRow label="Internal Links" value={`${page.internalLinks}`} />
        <MetricRow label="Outbound Links" value={`${page.outboundLinks}`} />
      </div>
    </Section>
  );
}

// ── Tab: Headers ────────────────────────────────────────────────

function HeadersTab({ page }: { page: CrawlPage }) {
  const headers = [
    ["content-type", page.contentType],
    ["cache-control", page.status === "success" ? "public, max-age=3600" : "no-cache"],
    ["x-robots-tag", page.status === "skipped" ? "noindex, nofollow" : "all"],
    ["x-frame-options", "SAMEORIGIN"],
    ["content-language", page.language],
    ["strict-transport-security", "max-age=31536000"],
    ["x-content-type-options", "nosniff"],
    ["referrer-policy", "strict-origin-when-cross-origin"],
  ];

  return (
    <Section title="HTTP Headers">
      <div className="space-y-1">
        {headers.map(([key, value]) => (
          <div key={key} className="flex items-start gap-2 py-1.5 border-b border-border/30 last:border-0">
            <span className="text-[9px] font-mono text-accent/80 shrink-0 min-w-[120px]">{key}:</span>
            <span className="text-[9px] font-mono text-muted-foreground/60 break-all">{value}</span>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ── Tab: Schema ─────────────────────────────────────────────────

function SchemaTab({ page }: { page: CrawlPage }) {
  if (!page.hasSchema) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <AlertTriangle className="h-8 w-8 text-orange-500/50 mb-2" />
        <p className="text-xs font-medium text-muted-foreground">No schema found</p>
        <p className="text-[10px] text-muted-foreground/40 mt-1">Add structured data to improve AI understanding.</p>
      </div>
    );
  }

  return (
    <Section title="Schema.org Markup">
      <div className="space-y-2">
        <div className="rounded-lg border border-border bg-muted/10 p-2.5">
          <pre className="text-[9px] font-mono text-muted-foreground/70 leading-relaxed overflow-x-auto">
{`{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "${page.title}",
  "description": "Page description for ${page.path}",
  "url": "${page.url}",
  "inLanguage": "${page.language}"
}`}
          </pre>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success">WebPage</Badge>
          {page.path === "/products" && <Badge variant="success">Product</Badge>}
          {page.path === "/blog" && <Badge variant="success">BlogPosting</Badge>}
          {page.path === "/contact" && <Badge variant="success">ContactPoint</Badge>}
        </div>
      </div>
    </Section>
  );
}

// ── Tab: JSON-LD ────────────────────────────────────────────────

function JSONLDTab({ page }: { page: CrawlPage }) {
  if (!page.hasJSONLD) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <FileJson className="h-8 w-8 text-muted-foreground/20 mb-2" />
        <p className="text-xs font-medium text-muted-foreground">No JSON-LD detected</p>
        <p className="text-[10px] text-muted-foreground/40 mt-1">JSON-LD helps AI systems understand your content structure.</p>
      </div>
    );
  }

  return (
    <Section title="JSON-LD Structured Data">
      <div className="rounded-lg border border-border bg-muted/10 p-2.5">
        <pre className="text-[9px] font-mono text-muted-foreground/70 leading-relaxed overflow-x-auto">
{`{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Acme Inc.",
  "url": "https://acme.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://acme.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}`}
        </pre>
      </div>
    </Section>
  );
}

// ── Tab: Open Graph ─────────────────────────────────────────────

function OpenGraphTab({ page }: { page: CrawlPage }) {
  if (!page.hasOG) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <Link2 className="h-8 w-8 text-muted-foreground/20 mb-2" />
        <p className="text-xs font-medium text-muted-foreground">No Open Graph tags</p>
        <p className="text-[10px] text-muted-foreground/40 mt-1">Add OG tags for better link previews on social platforms and AI chat.</p>
      </div>
    );
  }

  const ogTags = [
    ["og:title", `${page.title} — Acme Inc.`],
    ["og:description", `Learn more about ${page.title.toLowerCase()} on Acme Inc.`],
    ["og:url", page.url],
    ["og:type", "website"],
    ["og:site_name", "Acme Inc."],
    ["og:locale", page.language],
  ];

  return (
    <Section title="Open Graph Tags">
      <div className="space-y-1">
        {ogTags.map(([prop, content]) => (
          <div key={prop} className="flex items-start gap-2 py-1.5 border-b border-border/30 last:border-0">
            <span className="text-[9px] font-mono text-accent/80 shrink-0 min-w-[100px]">{prop}</span>
            <span className="text-[9px] font-mono text-muted-foreground/60 break-all">{content}</span>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ── Tab: AI Summary ─────────────────────────────────────────────

function AISummaryTab({ page }: { page: CrawlPage }) {
  const issues: string[] = [];
  if (!page.structuredData) issues.push("Missing structured data — AI cannot extract key information");
  if (page.status === "failed") issues.push("Page returned error — content not accessible");
  if (page.status === "partial") issues.push("Partial content — JS-rendered sections may be missing");
  if (page.status === "skipped") issues.push("Page was skipped — consider server-side rendering");
  if (!page.hasJSONLD) issues.push("No JSON-LD — add structured JSON-LD markup");
  if (!page.hasOG) issues.push("No Open Graph tags — add for better AI link understanding");

  const positives: string[] = [];
  if (page.status === "success") positives.push("Successfully crawled");
  if (page.structuredData) positives.push("Structured data present");
  if (page.hasJSONLD) positives.push("JSON-LD markup found");
  if (page.hasOG) positives.push("Open Graph tags configured");
  if (page.hasCanonical) positives.push("Canonical URL set");

  return (
    <div className="space-y-3">
      <Section title="AI Understanding">
        <p className="text-[10px] text-muted-foreground/70 leading-relaxed">
          {page.status === "success"
            ? `I successfully read and understood this page. The content is ${page.aiScore >= 80 ? "well-structured and easily parsed" : "partially accessible"}. ${page.structuredData ? "Structured data helps me answer questions accurately." : "Without structured data, my answers may be less precise."}`
            : page.status === "partial"
            ? `I could only partially understand this page. Some content requires JavaScript execution to render. ${page.structuredData ? "The structured data helps but core content may be missing." : "Missing structured data makes it harder to extract key information."}`
            : page.status === "failed"
            ? `I could not access this page. It returned a ${page.statusCode} error. This means I cannot answer questions about this content.`
            : `I skipped this page because it requires JavaScript rendering. Consider pre-rendering content on the server.`}
        </p>
      </Section>

      {positives.length > 0 && (
        <Section title="What Works">
          <div className="space-y-1">
            {positives.map((p) => (
              <div key={p} className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3 w-3 text-green-500 shrink-0" />
                <span className="text-[10px] text-green-500/80">{p}</span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {issues.length > 0 && (
        <Section title="Issues Detected">
          <div className="space-y-1">
            {issues.map((issue) => (
              <div key={issue} className="flex items-start gap-1.5">
                <AlertTriangle className="h-3 w-3 text-orange-500 shrink-0 mt-0.5" />
                <span className="text-[10px] text-orange-500/80">{issue}</span>
              </div>
            ))}
          </div>
        </Section>
      )}

      <Section title="Suggested Fixes">
        <div className="space-y-1.5">
          {!page.structuredData && (
            <FixItem action="Add structured data" impact="+6 Visibility" time="15 min" />
          )}
          {!page.hasJSONLD && (
            <FixItem action="Include JSON-LD markup" impact="+4 Visibility" time="10 min" />
          )}
          {page.status === "failed" && (
            <FixItem action={`Fix ${page.statusCode} error`} impact="+12 Visibility" time="30 min" />
          )}
          {page.status === "partial" && (
            <FixItem action="Pre-render critical content" impact="+8 Visibility" time="2 hours" />
          )}
          {page.status === "skipped" && (
            <FixItem action="Enable server-side rendering" impact="+10 Visibility" time="4 hours" />
          )}
        </div>
      </Section>
    </div>
  );
}

// ── Helpers ─────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/50 mb-2">{title}</p>
      {children}
    </div>
  );
}

function MetricRow({ label, value, color, mono }: { label: string; value: string; color?: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-[10px] text-muted-foreground/60">{label}</span>
      <span className={cn("text-[10px] font-medium", mono && "font-mono", color || "text-foreground")}>{value}</span>
    </div>
  );
}

function FixItem({ action, impact, time }: { action: string; impact: string; time: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/5 px-2.5 py-1.5">
      <span className="text-[10px] font-medium text-foreground">{action}</span>
      <div className="flex items-center gap-2">
        <Badge variant="success">{impact}</Badge>
        <span className="text-[9px] text-muted-foreground/40">{time}</span>
      </div>
    </div>
  );
}
