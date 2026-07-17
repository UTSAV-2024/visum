// ── User data ───────────────────────────────────────────────────

export const USER = {
  firstName: "Utsav",
  company: "Acme Inc.",
  domain: "acme.com",
};

// ── AI Visibility Score ─────────────────────────────────────────

export const VISIBILITY_SCORE = {
  score: 89,
  previousScore: 82,
  trend: "+7",
  periodLabel: "Last 30 days",
  percentile: "Top 8%",
  health: "healthy" as const,
};

// ── Executive Summary ──────────────────────────────────────────

export const EXECUTIVE_SUMMARY =
  "Your AI visibility increased 6% this week. Claude and Gemini are indexing more product pages, but ChatGPT is still missing structured data for 12 important URLs. Your hosted MCP server is healthy.";

// ── Today's Highlights ──────────────────────────────────────────

export interface Highlight {
  id: string;
  type: "positive" | "warning" | "neutral";
  icon: string;
  message: string;
  time: string;
  href?: string;
}

export const HIGHLIGHTS: Highlight[] = [
  {
    id: "h1",
    type: "positive",
    icon: "check",
    message: "ChatGPT indexed 42 new pages",
    time: "2h ago",
    href: "/analytics",
  },
  {
    id: "h2",
    type: "warning",
    icon: "alert",
    message: "Claude couldn't access pricing page",
    time: "3h ago",
    href: "/result#issues",
  },
  {
    id: "h3",
    type: "positive",
    icon: "check",
    message: "Hosted MCP deployed successfully",
    time: "5h ago",
    href: "/dashboard",
  },
  {
    id: "h4",
    type: "positive",
    icon: "check",
    message: "AI visibility increased after schema update",
    time: "1d ago",
    href: "/reports",
  },
  {
    id: "h5",
    type: "warning",
    icon: "alert",
    message: "Two structured-data regressions detected",
    time: "1d ago",
    href: "/result#issues",
  },
];

// ── AI Health Summary ───────────────────────────────────────────

export interface AIEngineHealth {
  id: string;
  name: string;
  status: "healthy" | "warning" | "critical";
  responseTime: string;
  visibility: number;
  lastCrawl: string;
}

export const AI_ENGINES: AIEngineHealth[] = [
  { id: "chatgpt", name: "ChatGPT", status: "healthy", responseTime: "1.2s", visibility: 92, lastCrawl: "12 min ago" },
  { id: "claude", name: "Claude", status: "warning", responseTime: "2.8s", visibility: 64, lastCrawl: "45 min ago" },
  { id: "gemini", name: "Gemini", status: "healthy", responseTime: "0.9s", visibility: 88, lastCrawl: "8 min ago" },
  { id: "perplexity", name: "Perplexity", status: "healthy", responseTime: "1.5s", visibility: 85, lastCrawl: "22 min ago" },
  { id: "mistral", name: "Mistral", status: "healthy", responseTime: "1.1s", visibility: 79, lastCrawl: "18 min ago" },
];

// ── Live Infrastructure ─────────────────────────────────────────

export interface InfrastructureMetric {
  id: string;
  label: string;
  value: string;
  status: "healthy" | "warning" | "critical";
  trend?: "up" | "down" | "stable";
}

export const INFRASTRUCTURE: InfrastructureMetric[] = [
  { id: "infra-status", label: "Hosted MCP", value: "Healthy", status: "healthy" },
  { id: "infra-latency", label: "Latency", value: "42ms", status: "healthy", trend: "stable" },
  { id: "infra-requests", label: "Requests", value: "12.4k", status: "healthy", trend: "up" },
  { id: "infra-deployments", label: "Deployments", value: "8 live", status: "healthy" },
  { id: "infra-errors", label: "Errors", value: "0.02%", status: "healthy", trend: "down" },
  { id: "infra-storage", label: "Storage", value: "2.4TB", status: "healthy" },
  { id: "infra-api", label: "API Usage", value: "84%", status: "warning", trend: "up" },
];

// ── Recommended Actions ─────────────────────────────────────────

export interface RecommendedAction {
  id: string;
  title: string;
  impact: number;
  time: string;
  priority: "critical" | "high" | "medium" | "low";
  completed?: boolean;
  href: string;
}

export const RECOMMENDED_ACTIONS: RecommendedAction[] = [
  { id: "ra1", title: "Generate llms.txt", impact: 8, time: "5 min", priority: "high", href: "/recommendations" },
  { id: "ra2", title: "Fix Product Schema", impact: 6, time: "12 min", priority: "high", href: "/recommendations" },
  { id: "ra3", title: "Enable MCP Authentication", impact: 0, time: "", priority: "critical", href: "/recommendations" },
  { id: "ra4", title: "Deploy Sitemap Update", impact: 0, time: "", priority: "medium", completed: true, href: "/recommendations" },
];

// ── Quick Actions ───────────────────────────────────────────────

export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  href: string;
  primary?: boolean;
}

export const QUICK_ACTIONS: QuickAction[] = [
  { id: "qa1", label: "Run Scan", icon: "scan", href: "/", primary: true },
  { id: "qa2", label: "Deploy MCP", icon: "server", href: "#" },
  { id: "qa3", label: "View Analytics", icon: "chart", href: "/analytics" },
  { id: "qa4", label: "Generate AI Report", icon: "file", href: "/reports" },
  { id: "qa5", label: "Invite Team", icon: "users", href: "/team" },
  { id: "qa6", label: "Manage Domains", icon: "globe", href: "#" },
];
