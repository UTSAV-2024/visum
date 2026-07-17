export const TEAM_MEMBERS = [
  { id: "u1", name: "Sarah Chen", email: "sarah@example.com", role: "Owner", avatar: "SC", status: "active", lastActive: "2 min ago", scans: 847 },
  { id: "u2", name: "Marcus Johnson", email: "marcus@example.com", role: "Admin", avatar: "MJ", status: "active", lastActive: "15 min ago", scans: 312 },
  { id: "u3", name: "Emily Rodriguez", email: "emily@example.com", role: "Member", avatar: "ER", status: "active", lastActive: "1h ago", scans: 156 },
  { id: "u4", name: "David Kim", email: "david@example.com", role: "Member", avatar: "DK", status: "idle", lastActive: "3h ago", scans: 89 },
  { id: "u5", name: "Lisa Thompson", email: "lisa@example.com", role: "Viewer", avatar: "LT", status: "away", lastActive: "Yesterday", scans: 12 },
];

export const INVITE_LINK = "https://visum.io/invite/abc123def";

export const ACTIVITY_LOG = [
  { id: "a1", user: "Sarah Chen", action: "completed scan", target: "example.com", time: "2 min ago", type: "scan" },
  { id: "a2", user: "Marcus Johnson", action: "exported report", target: "Q3 Analysis", time: "15 min ago", type: "export" },
  { id: "a3", user: "Emily Rodriguez", action: "updated workspace", target: "Settings", time: "1h ago", type: "settings" },
  { id: "a4", user: "Sarah Chen", action: "invited member", target: "david@example.com", time: "3h ago", type: "invite" },
  { id: "a5", user: "David Kim", action: "ran comparison", target: "Competitor A vs Your Site", time: "5h ago", type: "comparison" },
  { id: "a6", user: "System", action: "generated report", target: "Weekly Summary", time: "8h ago", type: "system" },
  { id: "a7", user: "Lisa Thompson", action: "downloaded CSV", target: "Scan Data Export", time: "1d ago", type: "export" },
  { id: "a8", user: "Marcus Johnson", action: "modified alerts", target: "Score Drop Alert", time: "1d ago", type: "settings" },
];

export const NOTIFICATION_CHANNELS = [
  { id: "email", label: "Email", description: "Receive notifications via email", enabled: true },
  { id: "slack", label: "Slack", description: "Post updates to Slack channel", enabled: false },
  { id: "webhook", label: "Webhook", description: "Send notifications to a custom endpoint", enabled: true },
];

export const NOTIFICATION_EVENTS = [
  { id: "score_change", label: "Score Changes", description: "When your AI visibility score changes", channels: { email: true, slack: false, webhook: true } },
  { id: "scan_complete", label: "Scan Complete", description: "When a scan finishes processing", channels: { email: true, slack: true, webhook: true } },
  { id: "new_issue", label: "New Issues Detected", description: "When new issues are found", channels: { email: true, slack: true, webhook: false } },
  { id: "issue_resolved", label: "Issues Resolved", description: "When issues get fixed automatically", channels: { email: false, slack: true, webhook: false } },
  { id: "weekly_report", label: "Weekly Report", description: "Weekly AI visibility summary", channels: { email: true, slack: false, webhook: false } },
  { id: "competitor_alert", label: "Competitor Alerts", description: "When competitors make changes", channels: { email: true, slack: true, webhook: true } },
];

export const API_KEYS = [
  { id: "k1", name: "Production API", key: "vis_prod_a1b2c3d4e5f6...", created: "Jul 10, 2026", lastUsed: "2 min ago", permissions: ["read", "write"], active: true },
  { id: "k2", name: "Staging API", key: "vis_stag_6f5e4d3c2b1a...", created: "Jun 15, 2026", lastUsed: "1h ago", permissions: ["read"], active: true },
  { id: "k3", name: "Development", key: "vis_dev_9x8y7z6w5v4u...", created: "May 20, 2026", lastUsed: "3 days ago", permissions: ["read", "write", "admin"], active: false },
];

export const BILLING = {
  plan: "Team",
  price: "$49",
  period: "/month",
  scansThisMonth: 2847,
  scanLimit: 5000,
  members: 5,
  memberLimit: 10,
  nextBilling: "Aug 17, 2026",
  invoices: [
    { id: "INV-001", date: "Jul 17, 2026", amount: "$49.00", status: "paid" },
    { id: "INV-002", date: "Jun 17, 2026", amount: "$49.00", status: "paid" },
    { id: "INV-003", date: "May 17, 2026", amount: "$29.00", status: "paid" },
  ],
};

export const WORKSPACE = {
  name: "Visum Team",
  slug: "visum-team",
  domain: "visum.io",
  createdAt: "Jan 2026",
  timezone: "UTC",
  defaultRole: "Member",
  ssoEnabled: false,
};

export const ORG_ANALYTICS = {
  totalScans: 1423,
  scansThisWeek: 89,
  activeMembers: 4,
  avgScore: 74,
  totalIssuesResolved: 156,
  topPerformer: { name: "Sarah Chen", scans: 847 },
};
