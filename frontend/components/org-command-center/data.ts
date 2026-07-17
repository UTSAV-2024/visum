// ── Website Status ─────────────────────────────────────────────

export type HealthStatus = "healthy" | "warning" | "critical" | "down";
export type Environment = "production" | "staging" | "development";
export type Region = "na" | "eu" | "apac" | "latam" | "mea";

// ── Website Entry ──────────────────────────────────────────────

export interface Website {
  id: string;
  name: string;
  domain: string;
  environment: Environment;
  region: Region;
  country: string;
  team: string;
  businessUnit: string;
  owner: string;
  aiVisibilityScore: number;
  health: HealthStatus;
  trend: "up" | "down" | "stable";
  openIssues: number;
  criticalIssues: number;
  mcpStatus: HealthStatus;
  lastScan: string;
  traffic: number;
  aiRequests: number;
  lastDeployment: string;
  technology: string;
  lat: number;
  lng: number;
}

// ── Org Activity ───────────────────────────────────────────────

export interface OrgActivity {
  id: string;
  type: "scan" | "improvement" | "deployment" | "regression" | "invite" | "spike" | "alert";
  message: string;
  site: string;
  time: string;
}

// ── Org Stats ──────────────────────────────────────────────────

export interface OrgStats {
  totalSites: number;
  healthySites: number;
  warningSites: number;
  criticalSites: number;
  avgScore: number;
  scoreTrend: number;
  totalIssues: number;
  criticalIssues: number;
  regions: number;
  teams: number;
}

// ── Mock Data ──────────────────────────────────────────────────

export const ORG_STATS: OrgStats = {
  totalSites: 42,
  healthySites: 31,
  warningSites: 8,
  criticalSites: 3,
  avgScore: 78,
  scoreTrend: 3.4,
  totalIssues: 147,
  criticalIssues: 12,
  regions: 5,
  teams: 8,
};

export const WEBSITES: Website[] = [
  // ── North America ─────────────────────────────────────────
  { id: "w1", name: "Nike US", domain: "nike.com", environment: "production", region: "na", country: "United States", team: "Core Brands", businessUnit: "DTC", owner: "Sarah Chen", aiVisibilityScore: 92, health: "healthy", trend: "up", openIssues: 3, criticalIssues: 0, mcpStatus: "healthy", lastScan: "12 min ago", traffic: 284000, aiRequests: 12450, lastDeployment: "2h ago", technology: "Next.js", lat: 40.7128, lng: -74.006 },
  { id: "w2", name: "Nike CA", domain: "nike.ca", environment: "production", region: "na", country: "Canada", team: "Core Brands", businessUnit: "DTC", owner: "Sarah Chen", aiVisibilityScore: 85, health: "healthy", trend: "stable", openIssues: 5, criticalIssues: 0, mcpStatus: "healthy", lastScan: "45 min ago", traffic: 89000, aiRequests: 3200, lastDeployment: "6h ago", technology: "Next.js", lat: 43.6532, lng: -79.3832 },
  { id: "w3", name: "Nike MX", domain: "nike.mx", environment: "production", region: "na", country: "Mexico", team: "LATAM", businessUnit: "DTC", owner: "Carlos Ruiz", aiVisibilityScore: 72, health: "warning", trend: "down", openIssues: 8, criticalIssues: 2, mcpStatus: "warning", lastScan: "3h ago", traffic: 34000, aiRequests: 1200, lastDeployment: "1d ago", technology: "Vue.js", lat: 19.4326, lng: -99.1332 },
  { id: "w4", name: "Nike US Staging", domain: "staging.nike.com", environment: "staging", region: "na", country: "United States", team: "Engineering", businessUnit: "Platform", owner: "Alex Kim", aiVisibilityScore: 65, health: "warning", trend: "up", openIssues: 12, criticalIssues: 1, mcpStatus: "healthy", lastScan: "1h ago", traffic: 1200, aiRequests: 45, lastDeployment: "30 min ago", technology: "Next.js", lat: 37.7749, lng: -122.4194 },

  // ── Europe ────────────────────────────────────────────────
  { id: "w5", name: "Nike UK", domain: "nike.co.uk", environment: "production", region: "eu", country: "United Kingdom", team: "Core Brands", businessUnit: "DTC", owner: "James Wilson", aiVisibilityScore: 88, health: "healthy", trend: "up", openIssues: 4, criticalIssues: 0, mcpStatus: "healthy", lastScan: "22 min ago", traffic: 156000, aiRequests: 6780, lastDeployment: "4h ago", technology: "Next.js", lat: 51.5074, lng: -0.1278 },
  { id: "w6", name: "Nike DE", domain: "nike.de", environment: "production", region: "eu", country: "Germany", team: "Core Brands", businessUnit: "DTC", owner: "Lena Müller", aiVisibilityScore: 82, health: "healthy", trend: "stable", openIssues: 6, criticalIssues: 0, mcpStatus: "healthy", lastScan: "1h ago", traffic: 98000, aiRequests: 4100, lastDeployment: "8h ago", technology: "Next.js", lat: 52.52, lng: 13.405 },
  { id: "w7", name: "Nike FR", domain: "nike.fr", environment: "production", region: "eu", country: "France", team: "Core Brands", businessUnit: "DTC", owner: "Pierre Dubois", aiVisibilityScore: 79, health: "healthy", trend: "down", openIssues: 7, criticalIssues: 1, mcpStatus: "healthy", lastScan: "2h ago", traffic: 72000, aiRequests: 3100, lastDeployment: "12h ago", technology: "Next.js", lat: 48.8566, lng: 2.3522 },
  { id: "w8", name: "Nike IT", domain: "nike.it", environment: "production", region: "eu", country: "Italy", team: "Core Brands", businessUnit: "DTC", owner: "Marco Rossi", aiVisibilityScore: 74, health: "warning", trend: "stable", openIssues: 9, criticalIssues: 1, mcpStatus: "warning", lastScan: "4h ago", traffic: 45000, aiRequests: 1900, lastDeployment: "1d ago", technology: "Next.js", lat: 41.9028, lng: 12.4964 },
  { id: "w9", name: "Nike ES", domain: "nike.es", environment: "production", region: "eu", country: "Spain", team: "Southern EU", businessUnit: "DTC", owner: "Ana García", aiVisibilityScore: 71, health: "warning", trend: "down", openIssues: 11, criticalIssues: 2, mcpStatus: "critical", lastScan: "6h ago", traffic: 38000, aiRequests: 1600, lastDeployment: "2d ago", technology: "Next.js", lat: 40.4168, lng: -3.7038 },
  { id: "w10", name: "Nike NL", domain: "nike.nl", environment: "production", region: "eu", country: "Netherlands", team: "Northern EU", businessUnit: "DTC", owner: "Emma van Dijk", aiVisibilityScore: 86, health: "healthy", trend: "up", openIssues: 3, criticalIssues: 0, mcpStatus: "healthy", lastScan: "30 min ago", traffic: 52000, aiRequests: 2400, lastDeployment: "3h ago", technology: "Next.js", lat: 52.3676, lng: 4.9041 },
  { id: "w11", name: "Nike SE", domain: "nike.se", environment: "production", region: "eu", country: "Sweden", team: "Northern EU", businessUnit: "DTC", owner: "Erik Johansson", aiVisibilityScore: 83, health: "healthy", trend: "stable", openIssues: 4, criticalIssues: 0, mcpStatus: "healthy", lastScan: "1h ago", traffic: 29000, aiRequests: 1300, lastDeployment: "5h ago", technology: "Next.js", lat: 59.3293, lng: 18.0686 },
  { id: "w12", name: "Nike EU Dev", domain: "dev.nike.eu", environment: "development", region: "eu", country: "Ireland", team: "Engineering", businessUnit: "Platform", owner: "Alex Kim", aiVisibilityScore: 45, health: "critical", trend: "down", openIssues: 24, criticalIssues: 5, mcpStatus: "down", lastScan: "2h ago", traffic: 500, aiRequests: 20, lastDeployment: "10 min ago", technology: "Next.js", lat: 53.3498, lng: -6.2603 },

  // ── APAC ──────────────────────────────────────────────────
  { id: "w13", name: "Nike JP", domain: "nike.jp", environment: "production", region: "apac", country: "Japan", team: "APAC", businessUnit: "DTC", owner: "Yuki Tanaka", aiVisibilityScore: 90, health: "healthy", trend: "up", openIssues: 2, criticalIssues: 0, mcpStatus: "healthy", lastScan: "15 min ago", traffic: 124000, aiRequests: 5600, lastDeployment: "3h ago", technology: "Remix", lat: 35.6762, lng: 139.6503 },
  { id: "w14", name: "Nike AU", domain: "nike.com.au", environment: "production", region: "apac", country: "Australia", team: "APAC", businessUnit: "DTC", owner: "Jack Thompson", aiVisibilityScore: 81, health: "healthy", trend: "stable", openIssues: 5, criticalIssues: 0, mcpStatus: "healthy", lastScan: "50 min ago", traffic: 63000, aiRequests: 2800, lastDeployment: "7h ago", technology: "Next.js", lat: -33.8688, lng: 151.2093 },
  { id: "w15", name: "Nike KR", domain: "nike.kr", environment: "production", region: "apac", country: "South Korea", team: "APAC", businessUnit: "DTC", owner: "Min-ji Park", aiVisibilityScore: 87, health: "healthy", trend: "up", openIssues: 4, criticalIssues: 0, mcpStatus: "healthy", lastScan: "25 min ago", traffic: 78000, aiRequests: 3400, lastDeployment: "4h ago", technology: "Next.js", lat: 37.5665, lng: 126.978 },
  { id: "w16", name: "Nike CN", domain: "nike.cn", environment: "production", region: "apac", country: "China", team: "APAC", businessUnit: "DTC", owner: "Wei Zhang", aiVisibilityScore: 58, health: "critical", trend: "down", openIssues: 18, criticalIssues: 4, mcpStatus: "warning", lastScan: "8h ago", traffic: 210000, aiRequests: 8900, lastDeployment: "3d ago", technology: "Custom", lat: 31.2304, lng: 121.4737 },
  { id: "w17", name: "Nike IN", domain: "nike.in", environment: "production", region: "apac", country: "India", team: "APAC", businessUnit: "DTC", owner: "Priya Sharma", aiVisibilityScore: 76, health: "warning", trend: "up", openIssues: 7, criticalIssues: 1, mcpStatus: "healthy", lastScan: "3h ago", traffic: 56000, aiRequests: 2100, lastDeployment: "1d ago", technology: "Next.js", lat: 19.076, lng: 72.8777 },
  { id: "w18", name: "Nike SG", domain: "nike.sg", environment: "production", region: "apac", country: "Singapore", team: "APAC", businessUnit: "DTC", owner: "Lim Wei Ming", aiVisibilityScore: 84, health: "healthy", trend: "stable", openIssues: 3, criticalIssues: 0, mcpStatus: "healthy", lastScan: "40 min ago", traffic: 34000, aiRequests: 1500, lastDeployment: "6h ago", technology: "Next.js", lat: 1.3521, lng: 103.8198 },

  // ── LATAM ─────────────────────────────────────────────────
  { id: "w19", name: "Nike BR", domain: "nike.com.br", environment: "production", region: "latam", country: "Brazil", team: "LATAM", businessUnit: "DTC", owner: "Carlos Ruiz", aiVisibilityScore: 69, health: "warning", trend: "down", openIssues: 10, criticalIssues: 2, mcpStatus: "warning", lastScan: "5h ago", traffic: 87000, aiRequests: 3800, lastDeployment: "2d ago", technology: "Next.js", lat: -23.5505, lng: -46.6333 },
  { id: "w20", name: "Nike AR", domain: "nike.com.ar", environment: "production", region: "latam", country: "Argentina", team: "LATAM", businessUnit: "DTC", owner: "Carlos Ruiz", aiVisibilityScore: 63, health: "warning", trend: "stable", openIssues: 9, criticalIssues: 1, mcpStatus: "healthy", lastScan: "6h ago", traffic: 22000, aiRequests: 900, lastDeployment: "1d ago", technology: "Vue.js", lat: -34.6037, lng: -58.3816 },
  { id: "w21", name: "Nike CO", domain: "nike.co", environment: "production", region: "latam", country: "Colombia", team: "LATAM", businessUnit: "DTC", owner: "Carlos Ruiz", aiVisibilityScore: 67, health: "warning", trend: "up", openIssues: 6, criticalIssues: 1, mcpStatus: "healthy", lastScan: "4h ago", traffic: 18000, aiRequests: 800, lastDeployment: "12h ago", technology: "Vue.js", lat: 4.711, lng: -74.0721 },
  { id: "w22", name: "Nike CL", domain: "nike.cl", environment: "production", region: "latam", country: "Chile", team: "LATAM", businessUnit: "DTC", owner: "Carlos Ruiz", aiVisibilityScore: 70, health: "healthy", trend: "stable", openIssues: 5, criticalIssues: 0, mcpStatus: "healthy", lastScan: "3h ago", traffic: 14000, aiRequests: 600, lastDeployment: "1d ago", technology: "Vue.js", lat: -33.4489, lng: -70.6693 },

  // ── MEA ───────────────────────────────────────────────────
  { id: "w23", name: "Nike AE", domain: "nike.ae", environment: "production", region: "mea", country: "UAE", team: "MEA", businessUnit: "DTC", owner: "Omar Hassan", aiVisibilityScore: 80, health: "healthy", trend: "up", openIssues: 4, criticalIssues: 0, mcpStatus: "healthy", lastScan: "1h ago", traffic: 42000, aiRequests: 1800, lastDeployment: "6h ago", technology: "Next.js", lat: 25.2048, lng: 55.2708 },
  { id: "w24", name: "Nike ZA", domain: "nike.co.za", environment: "production", region: "mea", country: "South Africa", team: "MEA", businessUnit: "DTC", owner: "Thabo Molefe", aiVisibilityScore: 73, health: "warning", trend: "stable", openIssues: 7, criticalIssues: 1, mcpStatus: "warning", lastScan: "5h ago", traffic: 15000, aiRequests: 650, lastDeployment: "2d ago", technology: "Next.js", lat: -26.2041, lng: 28.0473 },
  { id: "w25", name: "Nike SA", domain: "nike.com.sa", environment: "production", region: "mea", country: "Saudi Arabia", team: "MEA", businessUnit: "DTC", owner: "Omar Hassan", aiVisibilityScore: 77, health: "healthy", trend: "up", openIssues: 3, criticalIssues: 0, mcpStatus: "healthy", lastScan: "2h ago", traffic: 28000, aiRequests: 1200, lastDeployment: "8h ago", technology: "Next.js", lat: 24.7136, lng: 46.6753 },

  // ── Subdomains & Special Sites ────────────────────────────
  { id: "w26", name: "Nike Blog", domain: "blog.nike.com", environment: "production", region: "na", country: "United States", team: "Content", businessUnit: "Marketing", owner: "Emma Richards", aiVisibilityScore: 94, health: "healthy", trend: "up", openIssues: 1, criticalIssues: 0, mcpStatus: "healthy", lastScan: "10 min ago", traffic: 89000, aiRequests: 4200, lastDeployment: "1d ago", technology: "WordPress", lat: 40.7128, lng: -74.006 },
  { id: "w27", name: "Nike Docs", domain: "docs.nike.com", environment: "production", region: "na", country: "United States", team: "Engineering", businessUnit: "Platform", owner: "Alex Kim", aiVisibilityScore: 91, health: "healthy", trend: "stable", openIssues: 2, criticalIssues: 0, mcpStatus: "healthy", lastScan: "20 min ago", traffic: 24000, aiRequests: 1800, lastDeployment: "2d ago", technology: "Next.js", lat: 37.7749, lng: -122.4194 },
  { id: "w28", name: "Nike Developer Portal", domain: "developer.nike.com", environment: "production", region: "na", country: "United States", team: "Engineering", businessUnit: "Platform", owner: "Alex Kim", aiVisibilityScore: 88, health: "healthy", trend: "up", openIssues: 3, criticalIssues: 0, mcpStatus: "healthy", lastScan: "30 min ago", traffic: 12000, aiRequests: 980, lastDeployment: "4h ago", technology: "Next.js", lat: 37.7749, lng: -122.4194 },
  { id: "w29", name: "Nike Careers", domain: "careers.nike.com", environment: "production", region: "na", country: "United States", team: "HR Tech", businessUnit: "Internal", owner: "Lisa Park", aiVisibilityScore: 76, health: "healthy", trend: "stable", openIssues: 4, criticalIssues: 0, mcpStatus: "healthy", lastScan: "2h ago", traffic: 18000, aiRequests: 450, lastDeployment: "1w ago", technology: "Next.js", lat: 40.7128, lng: -74.006 },
  { id: "w30", name: "Nike EU Blog", domain: "blog.nike.eu", environment: "production", region: "eu", country: "Ireland", team: "Content", businessUnit: "Marketing", owner: "Emma Richards", aiVisibilityScore: 87, health: "healthy", trend: "up", openIssues: 2, criticalIssues: 0, mcpStatus: "healthy", lastScan: "1h ago", traffic: 45000, aiRequests: 2100, lastDeployment: "3d ago", technology: "WordPress", lat: 53.3498, lng: -6.2603 },

  // ── Marketing & Landing Pages ─────────────────────────────
  { id: "w31", name: "Nike Air Max Launch", domain: "airmax.nike.com", environment: "production", region: "na", country: "United States", team: "Campaigns", businessUnit: "Marketing", owner: "David Park", aiVisibilityScore: 95, health: "healthy", trend: "up", openIssues: 1, criticalIssues: 0, mcpStatus: "healthy", lastScan: "5 min ago", traffic: 145000, aiRequests: 7800, lastDeployment: "1h ago", technology: "Next.js", lat: 34.0522, lng: -118.2437 },
  { id: "w32", name: "Nike Member Day", domain: "memberday.nike.com", environment: "production", region: "na", country: "United States", team: "Campaigns", businessUnit: "Marketing", owner: "David Park", aiVisibilityScore: 93, health: "healthy", trend: "up", openIssues: 2, criticalIssues: 0, mcpStatus: "healthy", lastScan: "15 min ago", traffic: 98000, aiRequests: 5400, lastDeployment: "3h ago", technology: "Next.js", lat: 34.0522, lng: -118.2437 },

  // ── E-commerce Stores ─────────────────────────────────────
  { id: "w33", name: "Nike Outlet", domain: "outlet.nike.com", environment: "production", region: "na", country: "United States", team: "Commerce", businessUnit: "DTC", owner: "Sarah Chen", aiVisibilityScore: 86, health: "healthy", trend: "stable", openIssues: 4, criticalIssues: 0, mcpStatus: "healthy", lastScan: "40 min ago", traffic: 67000, aiRequests: 2900, lastDeployment: "1d ago", technology: "Next.js", lat: 40.7128, lng: -74.006 },
  { id: "w34", name: "Nike SNKRS", domain: "snkrs.nike.com", environment: "production", region: "na", country: "United States", team: "Commerce", businessUnit: "DTC", owner: "Sarah Chen", aiVisibilityScore: 96, health: "healthy", trend: "up", openIssues: 2, criticalIssues: 0, mcpStatus: "healthy", lastScan: "8 min ago", traffic: 234000, aiRequests: 12000, lastDeployment: "2h ago", technology: "Next.js", lat: 40.7128, lng: -74.006 },

  // ── Staging & Dev ─────────────────────────────────────────
  { id: "w35", name: "Nike Staging - EU", domain: "staging-eu.nike.com", environment: "staging", region: "eu", country: "Ireland", team: "Engineering", businessUnit: "Platform", owner: "Alex Kim", aiVisibilityScore: 62, health: "warning", trend: "stable", openIssues: 14, criticalIssues: 2, mcpStatus: "healthy", lastScan: "3h ago", traffic: 800, aiRequests: 30, lastDeployment: "20 min ago", technology: "Next.js", lat: 53.3498, lng: -6.2603 },
  { id: "w36", name: "Nike Staging - APAC", domain: "staging-apac.nike.com", environment: "staging", region: "apac", country: "Singapore", team: "Engineering", businessUnit: "Platform", owner: "Alex Kim", aiVisibilityScore: 58, health: "critical", trend: "down", openIssues: 16, criticalIssues: 3, mcpStatus: "warning", lastScan: "4h ago", traffic: 600, aiRequests: 25, lastDeployment: "1h ago", technology: "Next.js", lat: 1.3521, lng: 103.8198 },

  // ── Microsites ────────────────────────────────────────────
  { id: "w37", name: "Nike Just Do It", domain: "justdoit.nike.com", environment: "production", region: "na", country: "United States", team: "Brand", businessUnit: "Marketing", owner: "David Park", aiVisibilityScore: 97, health: "healthy", trend: "up", openIssues: 0, criticalIssues: 0, mcpStatus: "healthy", lastScan: "5 min ago", traffic: 189000, aiRequests: 10200, lastDeployment: "1d ago", technology: "Next.js", lat: 40.7128, lng: -74.006 },
  { id: "w38", name: "Nike Run Club", domain: "nrc.nike.com", environment: "production", region: "na", country: "United States", team: "Digital Products", businessUnit: "DTC", owner: "Michael Torres", aiVisibilityScore: 90, health: "healthy", trend: "stable", openIssues: 3, criticalIssues: 0, mcpStatus: "healthy", lastScan: "25 min ago", traffic: 78000, aiRequests: 3400, lastDeployment: "1w ago", technology: "React", lat: 40.7128, lng: -74.006 },
  { id: "w39", name: "Nike Training Club", domain: "ntc.nike.com", environment: "production", region: "na", country: "United States", team: "Digital Products", businessUnit: "DTC", owner: "Michael Torres", aiVisibilityScore: 89, health: "healthy", trend: "stable", openIssues: 4, criticalIssues: 0, mcpStatus: "healthy", lastScan: "30 min ago", traffic: 65000, aiRequests: 2900, lastDeployment: "1w ago", technology: "React", lat: 40.7128, lng: -74.006 },

  // ── API & Infrastructure ──────────────────────────────────
  { id: "w40", name: "Nike API Gateway", domain: "api.nike.com", environment: "production", region: "na", country: "United States", team: "Platform Engineering", businessUnit: "Infrastructure", owner: "Raj Patel", aiVisibilityScore: 99, health: "healthy", trend: "stable", openIssues: 1, criticalIssues: 0, mcpStatus: "healthy", lastScan: "10 min ago", traffic: 4500000, aiRequests: 89000, lastDeployment: "30 min ago", technology: "Go", lat: 40.7128, lng: -74.006 },
  { id: "w41", name: "Nike Status Page", domain: "status.nike.com", environment: "production", region: "na", country: "United States", team: "Platform Engineering", businessUnit: "Infrastructure", owner: "Raj Patel", aiVisibilityScore: 100, health: "healthy", trend: "stable", openIssues: 0, criticalIssues: 0, mcpStatus: "healthy", lastScan: "2 min ago", traffic: 12000, aiRequests: 200, lastDeployment: "1m ago", technology: "Next.js", lat: 40.7128, lng: -74.006 },
  { id: "w42", name: "Nike MCP Staging", domain: "mcp-staging.nike.com", environment: "staging", region: "na", country: "United States", team: "Platform Engineering", businessUnit: "Infrastructure", owner: "Raj Patel", aiVisibilityScore: 52, health: "critical", trend: "down", openIssues: 20, criticalIssues: 4, mcpStatus: "down", lastScan: "1h ago", traffic: 300, aiRequests: 10, lastDeployment: "5 min ago", technology: "TypeScript", lat: 37.7749, lng: -122.4194 },
];

// ── Activity Timeline ──────────────────────────────────────────

export const ACTIVITY: OrgActivity[] = [
  { id: "a1", type: "scan", message: "completed scan", site: "Nike US", time: "12 min ago" },
  { id: "a2", type: "improvement", message: "AI Visibility Score improved by 5 points", site: "Nike JP", time: "1h ago" },
  { id: "a3", type: "deployment", message: "MCP server deployed to production", site: "Nike UK", time: "2h ago" },
  { id: "a4", type: "regression", message: "schema regression detected", site: "Nike MX", time: "3h ago" },
  { id: "a5", type: "invite", message: "joined the team", site: "Organization", time: "4h ago" },
  { id: "a6", type: "spike", message: "prompt spike detected (+340%)", site: "Nike SNKRS", time: "5h ago" },
  { id: "a7", type: "alert", message: "critical issue opened: checkout failing", site: "Nike CN", time: "6h ago" },
  { id: "a8", type: "scan", message: "completed scan — 4 issues found", site: "Nike DE", time: "7h ago" },
  { id: "a9", type: "improvement", message: "AI Visibility Score improved by 8 points", site: "Nike FR", time: "8h ago" },
  { id: "a10", type: "deployment", message: "new schema deployed to all EU sites", site: "Europe", time: "10h ago" },
  { id: "a11", type: "alert", message: "MCP endpoint latency increased to 2.3s", site: "Nike ES", time: "12h ago" },
  { id: "a12", type: "spike", message: "AI request volume up 215%", site: "Nike AU", time: "14h ago" },
];

// ── Executive Summary ──────────────────────────────────────────

export const EXECUTIVE_SUMMARY =
  "Across 42 websites, overall AI Visibility increased 3.4% this week. Three production sites require immediate attention due to schema regressions: Nike MX (72, down 4 pts), Nike CN (58, down 6 pts), and Nike ES (71, down 2 pts). Hosted MCP infrastructure remains healthy across all regions except LATAM where 2 sites show warning status. The APAC region shows the strongest growth at 8.2% week-over-week. Recommend prioritizing schema fixes for the 3 critical sites before running the weekly executive report.";

// ── Group Options ──────────────────────────────────────────────

export const GROUP_OPTIONS = [
  { id: "none", label: "No Grouping" },
  { id: "region", label: "Region" },
  { id: "team", label: "Team" },
  { id: "environment", label: "Environment" },
  { id: "businessUnit", label: "Business Unit" },
];

export const ENVIRONMENTS: Environment[] = ["production", "staging", "development"];
export const REGIONS: { id: Region; label: string }[] = [
  { id: "na", label: "North America" },
  { id: "eu", label: "Europe" },
  { id: "apac", label: "APAC" },
  { id: "latam", label: "LATAM" },
  { id: "mea", label: "MEA" },
];
