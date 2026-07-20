import {
  LayoutDashboard,
  Eye,
  ScanLine,
  BarChart3,
  Sparkles,
  Server,
  Radar,
  FileText,
  Users,
  CreditCard,
  KeyRound,
  Puzzle,
  Settings,
  GitGraph,
  MessageSquare,
  ListChecks,
  Building2,
  type LucideIcon,
} from "lucide-react";
import type { NavGroup, NavItem } from "./types";

// ── Primary Navigation ──────────────────────────────────────────

export const PRIMARY_NAV: (NavGroup | NavItem)[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "ai-visibility",
    label: "AI Visibility",
    href: "/dashboard",
    icon: Eye,
  },
  {
    id: "scan-results",
    label: "Scan Results",
    icon: ScanLine,
    items: [
      { id: "crawl-explorer", label: "Crawl Explorer", href: "/crawl-explorer", icon: GitGraph, isNew: true },
      { id: "recent-scans", label: "Recent Scans", href: "/result", icon: ScanLine },
      { id: "issues", label: "Issues", href: "/result#issues", icon: ScanLine },
      { id: "reports", label: "Reports", href: "/reports", icon: FileText },
      { id: "comparisons", label: "Comparisons", href: "/reports", icon: BarChart3 },
    ],
  },
  {
    id: "ai-analytics",
    label: "AI Analytics",
    href: "/analytics",
    icon: BarChart3,
    badge: "Live",
    badgeColor: "text-green-500",
  },
  {
    id: "recommendations",
    label: "Recommendations",
    href: "/recommendations",
    icon: Sparkles,
  },
  {
    id: "hosted-mcp",
    label: "Hosted MCP",
    href: "/hosted-mcp",
    icon: Server,
    badge: "Live",
    badgeColor: "text-green-500",
  },
  {
    id: "competitors",
    label: "Competitors",
    href: "/competitors",
    icon: Radar,
  },
  {
    id: "org-command-center",
    label: "Organization",
    href: "/org-command-center",
    icon: Building2,
  },
  {
    id: "optimization-workspace",
    label: "Optimization",
    href: "/optimization-workspace",
    icon: ListChecks,
  },
  {
    id: "prompt-intelligence",
    label: "Prompt Intelligence",
    href: "/prompt-intelligence",
    icon: MessageSquare,
    badge: "New",
    badgeColor: "text-accent",
  },
  {
    id: "insights",
    label: "Insights",
    href: "/insights",
    icon: Sparkles,
  },
];

// ── Secondary Navigation ─────────────────────────────────────────

export const SECONDARY_NAV: NavGroup[] = [
  {
    id: "team",
    label: "Team",
    icon: Users,
    items: [
      { id: "members", label: "Members", href: "/team", icon: Users },
      { id: "roles", label: "Roles", href: "/team", icon: Users },
      { id: "permissions", label: "Permissions", href: "/team", icon: Users },
    ],
  },
  // Billing / API / Integrations / Settings are not built yet. Rather than
  // sending users to unrelated pages (they previously all pointed at /team) or
  // dead "#" anchors, these are marked disabled and rendered with a "Soon" tag.
  {
    id: "billing",
    label: "Billing",
    icon: CreditCard,
    items: [
      { id: "usage", label: "Usage", href: "#", icon: CreditCard, disabled: true },
      { id: "invoices", label: "Invoices", href: "#", icon: CreditCard, disabled: true },
    ],
  },
  {
    id: "api",
    label: "API",
    icon: KeyRound,
    items: [
      { id: "api-keys", label: "Keys", href: "#", icon: KeyRound, disabled: true },
      { id: "tokens", label: "Tokens", href: "#", icon: KeyRound, disabled: true },
      { id: "webhooks", label: "Webhooks", href: "#", icon: KeyRound, disabled: true },
    ],
  },
  {
    id: "integrations",
    label: "Integrations",
    icon: Puzzle,
    items: [
      { id: "int-slack", label: "Slack", href: "#", icon: Puzzle, disabled: true },
      { id: "int-github", label: "GitHub", href: "#", icon: Puzzle, disabled: true },
      { id: "int-notion", label: "Notion", href: "#", icon: Puzzle, disabled: true },
      { id: "int-shopify", label: "Shopify", href: "#", icon: Puzzle, disabled: true },
      { id: "int-wordpress", label: "WordPress", href: "#", icon: Puzzle, disabled: true },
    ],
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    items: [
      { id: "general", label: "General", href: "#", icon: Settings, disabled: true },
      { id: "notifications", label: "Notifications", href: "#", icon: Settings, disabled: true },
      { id: "security", label: "Security", href: "#", icon: Settings, disabled: true },
      { id: "appearance", label: "Appearance", href: "#", icon: Settings, disabled: true },
    ],
  },
];

// ── Help & Support ──────────────────────────────────────────────

export const HELP_LINKS: NavItem[] = [
  { id: "docs", label: "Documentation", href: "#", icon: FileText, disabled: true },
  { id: "discord", label: "Discord", href: "#", icon: FileText, disabled: true },
  { id: "support", label: "Contact Support", href: "/contact", icon: FileText },
];

// ── Route mapping for active detection ──────────────────────────

export const ROUTE_MAP: Record<string, string> = {
  "/dashboard": "dashboard",
  "/analytics": "ai-analytics",
  "/insights": "insights",
  "/recommendations": "recommendations",
  "/competitors": "competitors",
  "/crawl-explorer": "scan-results",
  "/result": "scan-results",
  "/reports": "scan-results",
  "/team": "team",
  "/prompt-intelligence": "prompt-intelligence",
  "/optimization-workspace": "optimization-workspace",
  "/org-command-center": "org-command-center",
  "/hosted-mcp": "hosted-mcp",
};

export const APP_ROUTES = new Set([
  "/dashboard",
  "/analytics",
  "/insights",
  "/recommendations",
  "/competitors",
  "/crawl-explorer",
  "/result",
  "/reports",
  "/team",
  "/prompt-intelligence",
  "/optimization-workspace",
  "/org-command-center",
  "/hosted-mcp",
]);
