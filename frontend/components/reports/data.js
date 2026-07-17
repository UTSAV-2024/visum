export const SCAN_HISTORY = [
  { id: "scan-1", date: "Jul 17, 2026", score: 78, issues: 12, resolved: 3, regressions: 0, changes: "Robots.txt updated, Meta tags improved" },
  { id: "scan-2", date: "Jul 10, 2026", score: 73, issues: 14, resolved: 1, regressions: 1, changes: "JSON-LD added" },
  { id: "scan-3", date: "Jul 3, 2026", score: 71, issues: 15, resolved: 0, regressions: 0, changes: "Performance optimization" },
  { id: "scan-4", date: "Jun 26, 2026", score: 68, issues: 16, resolved: 2, regressions: 1, changes: "Sitemap submitted" },
  { id: "scan-5", date: "Jun 19, 2026", score: 65, issues: 18, resolved: 0, regressions: 0, changes: "Initial scan" },
];

export const HISTORICAL_ISSUES = [
  { id: "h-1", name: "Robots.txt blocks GPTBot", severity: "critical", firstSeen: "Jun 19", resolved: false },
  { id: "h-2", name: "Missing JSON-LD structured data", severity: "critical", firstSeen: "Jun 19", resolved: true, resolvedAt: "Jul 10" },
  { id: "h-3", name: "Slow page load speed", severity: "high", firstSeen: "Jun 19", resolved: true, resolvedAt: "Jul 3" },
  { id: "h-4", name: "Incomplete meta tags", severity: "medium", firstSeen: "Jun 19", resolved: false },
  { id: "h-5", name: "No llms.txt file", severity: "medium", firstSeen: "Jun 26", resolved: false },
  { id: "h-6", name: "Missing sitemap lastmod dates", severity: "low", firstSeen: "Jun 19", resolved: true, resolvedAt: "Jun 26" },
  { id: "h-7", name: "JavaScript rendering dependency", severity: "high", firstSeen: "Jul 10", resolved: false },
];

export const WEEKLY_SCORES = [
  { week: "W1", score: 62, previous: 55 },
  { week: "W2", score: 68, previous: 58 },
  { week: "W3", score: 71, previous: 62 },
  { week: "W4", score: 73, previous: 65 },
  { week: "W5", score: 78, previous: 68 },
];

export const MONTHLY_SCORES = [
  { month: "Mar", score: 45, previous: 38 },
  { month: "Apr", score: 55, previous: 42 },
  { month: "May", score: 62, previous: 48 },
  { month: "Jun", score: 71, previous: 55 },
  { month: "Jul", score: 78, previous: 62 },
];

export const GROWTH_DATA = {
  aiVisits: { current: 6258, previous: 5120, change: "+22%" },
  tokensConsumed: { current: "6.3M", previous: "5.1M", change: "+23%" },
  pagesIndexed: { current: 2847, previous: 2100, change: "+36%" },
  retrievalRate: { current: "86%", previous: "72%", change: "+14%" },
  promptSuccess: { current: "91%", previous: "85%", change: "+6%" },
};
