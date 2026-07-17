// ── Server Status ──────────────────────────────────────────────

export type HealthStatus = "healthy" | "warning" | "critical" | "down";
export type DeploymentStatus = "deploying" | "running" | "failed" | "rolled-back";

export interface MCPServer {
  id: string;
  name: string;
  version: string;
  status: HealthStatus;
  region: string;
  environment: string;
  deployedAt: string;
  uptime: string;
  latency: string;
  cpu: number;
  memory: number;
  storage: number;
  bandwidth: string;
  concurrentConnections: number;
  queueDepth: number;
  responseTime: string;
  network: string;
  requestSuccess: number;
}

export const MCP_SERVER: MCPServer = {
  id: "mcp-prod-1",
  name: "mcp-production-us-east",
  version: "v2.1.4",
  status: "healthy",
  region: "us-east-1",
  environment: "Production",
  deployedAt: "2 hours ago",
  uptime: "99.97%",
  latency: "42ms",
  cpu: 34,
  memory: 62,
  storage: 2.4,
  bandwidth: "1.2 Gbps",
  concurrentConnections: 128,
  queueDepth: 3,
  responseTime: "38ms",
  network: "1.2 Gbps",
  requestSuccess: 99.8,
};

// ── Deployments ────────────────────────────────────────────────

export interface Deployment {
  id: string;
  version: string;
  commitSha: string;
  status: DeploymentStatus;
  environment: string;
  triggeredBy: string;
  duration: string;
  buildTime: string;
  healthCheck: boolean;
  rollbackAvailable: boolean;
  releaseNotes: string;
  errors: number;
  traffic: string;
  timestamp: string;
}

export const DEPLOYMENTS: Deployment[] = [
  { id: "d1", version: "v2.1.4", commitSha: "a7f3e92", status: "running", environment: "Production", triggeredBy: "Utsav", duration: "2m 34s", buildTime: "1m 12s", healthCheck: true, rollbackAvailable: true, releaseNotes: "Added product lookup tool. Fixed authentication timeout. Improved error handling.", errors: 0, traffic: "2.4k req/min", timestamp: "2h ago" },
  { id: "d2", version: "v2.1.3", commitSha: "b8e2d71", status: "running", environment: "Production", triggeredBy: "Alex", duration: "3m 12s", buildTime: "1m 45s", healthCheck: true, rollbackAvailable: true, releaseNotes: "Performance improvements for pricing tool. Reduced latency by 35%.", errors: 2, traffic: "2.3k req/min", timestamp: "1d ago" },
  { id: "d3", version: "v2.1.2", commitSha: "c4f1a63", status: "rolled-back", environment: "Production", triggeredBy: "Deploy Bot", duration: "2m 18s", buildTime: "58s", healthCheck: false, rollbackAvailable: false, releaseNotes: "Rolled back due to connection timeout issues with Claude.", errors: 12, traffic: "1.9k req/min", timestamp: "3d ago" },
  { id: "d4", version: "v2.1.1", commitSha: "d9e0b54", status: "running", environment: "Production", triggeredBy: "Priya", duration: "4m 02s", buildTime: "2m 10s", healthCheck: true, rollbackAvailable: true, releaseNotes: "Added inventory check tool. Updated schema validation.", errors: 0, traffic: "2.1k req/min", timestamp: "5d ago" },
  { id: "d5", version: "v2.1.0", commitSha: "e5f7c85", status: "running", environment: "Staging", triggeredBy: "Utsav", duration: "2m 45s", buildTime: "1m 30s", healthCheck: true, rollbackAvailable: true, releaseNotes: "Initial v2.1 release with new authentication middleware.", errors: 1, traffic: "200 req/min", timestamp: "1w ago" },
];

// ── Registered Tools ───────────────────────────────────────────

export interface MCPTool {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  health: HealthStatus;
  invocationCount: number;
  avgLatency: string;
  lastUsed: string;
  version: string;
  requiresAuth: boolean;
  permissions: string[];
  schema: string;
  input: string;
  output: string;
}

export const MCP_TOOLS: MCPTool[] = [
  { id: "t1", name: "product-lookup", description: "Retrieve product details by SKU or ID", enabled: true, health: "healthy", invocationCount: 12450, avgLatency: "28ms", lastUsed: "just now", version: "v2", requiresAuth: true, permissions: ["products:read"], schema: "{ sku: string }", input: '{ "sku": "NK-001" }', output: '{ "name": "Air Max 90", "price": 150 }' },
  { id: "t2", name: "pricing-check", description: "Get current pricing for any product", enabled: true, health: "healthy", invocationCount: 8920, avgLatency: "35ms", lastUsed: "2 min ago", version: "v2", requiresAuth: true, permissions: ["pricing:read"], schema: "{ productId: string }", input: '{ "productId": "PM-892" }', output: '{ "price": 150, "currency": "USD" }' },
  { id: "t3", name: "inventory-check", description: "Check product inventory and availability", enabled: true, health: "warning", invocationCount: 5670, avgLatency: "120ms", lastUsed: "5 min ago", version: "v1", requiresAuth: true, permissions: ["inventory:read"], schema: "{ sku: string, region?: string }", input: '{ "sku": "NK-001", "region": "us-east" }', output: '{ "available": true, "quantity": 42 }' },
  { id: "t4", name: "order-status", description: "Retrieve order tracking information", enabled: true, health: "healthy", invocationCount: 3450, avgLatency: "45ms", lastUsed: "8 min ago", version: "v2", requiresAuth: true, permissions: ["orders:read"], schema: "{ orderId: string }", input: '{ "orderId": "ORD-789" }', output: '{ "status": "shipped", "eta": "2026-07-20" }' },
  { id: "t5", name: "faq-search", description: "Search FAQ content for answers", enabled: true, health: "healthy", invocationCount: 7890, avgLatency: "22ms", lastUsed: "1 min ago", version: "v1", requiresAuth: false, permissions: ["content:read"], schema: "{ query: string }", input: '{ "query": "return policy" }', output: '{ "answer": "60-day return policy...", "source": "/faq" }' },
  { id: "t6", name: "size-guide", description: "Get size recommendations and charts", enabled: false, health: "healthy", invocationCount: 2100, avgLatency: "18ms", lastUsed: "1h ago", version: "v1", requiresAuth: false, permissions: ["content:read"], schema: "{ productId: string, region?: string }", input: '{ "productId": "PM-892" }', output: '{ "sizes": ["US 6-18"], "guide": "/size-guide" }' },
  { id: "t7", name: "shipping-estimate", description: "Estimate shipping costs and delivery times", enabled: true, health: "critical", invocationCount: 4300, avgLatency: "450ms", lastUsed: "12 min ago", version: "v1", requiresAuth: false, permissions: ["shipping:read"], schema: "{ zip: string, items: Item[] }", input: '{ "zip": "10001", "items": [{"sku": "NK-001"}] }', output: '{ "cost": 12.99, "eta": "3-5 business days" }' },
  { id: "t8", name: "store-locator", description: "Find nearby retail stores", enabled: true, health: "healthy", invocationCount: 210, avgLatency: "15ms", lastUsed: "45 min ago", version: "v1", requiresAuth: false, permissions: ["stores:read"], schema: "{ lat: number, lng: number, radius?: number }", input: '{ "lat": 40.7128, "lng": -74.006 }', output: '{ "stores": [{ "name": "Nike NYC", "distance": "0.5mi" }] }' },
];

// ── Endpoints ──────────────────────────────────────────────────

export interface MCPEndpoint {
  id: string;
  name: string;
  url: string;
  environment: string;
  status: HealthStatus;
  latency: string;
  region: string;
  ssl: boolean;
  requests: number;
  errors: number;
  bandwidth: string;
}

export const MCP_ENDPOINTS: MCPEndpoint[] = [
  { id: "e1", name: "Production API", url: "https://mcp.nike.com/api/v2", environment: "Production", status: "healthy", latency: "38ms", region: "us-east-1", ssl: true, requests: 12450, errors: 2, bandwidth: "1.2 Gbps" },
  { id: "e2", name: "Preview API", url: "https://preview-mcp.nike.com/api/v2", environment: "Preview", status: "healthy", latency: "42ms", region: "us-east-1", ssl: true, requests: 3400, errors: 0, bandwidth: "400 Mbps" },
  { id: "e3", name: "Development API", url: "https://dev-mcp.nike.com/api/v2", environment: "Development", status: "warning", latency: "85ms", region: "eu-west-1", ssl: true, requests: 1200, errors: 8, bandwidth: "200 Mbps" },
  { id: "e4", name: "Local API", url: "http://localhost:8080/api/v2", environment: "Local", status: "down", latency: "—", region: "local", ssl: false, requests: 0, errors: 0, bandwidth: "—" },
];

// ── Live Connections ───────────────────────────────────────────

export interface LiveConnection {
  id: string;
  client: string;
  icon: string;
  status: "connected" | "disconnected";
  requests: number;
  sessionDuration: string;
  currentTool: string;
  region: string;
}

export const LIVE_CONNECTIONS: LiveConnection[] = [
  { id: "c1", client: "ChatGPT", icon: "brain", status: "connected", requests: 4580, sessionDuration: "2h 14m", currentTool: "product-lookup", region: "us-east" },
  { id: "c2", client: "Claude", icon: "bot", status: "connected", requests: 2340, sessionDuration: "1h 48m", currentTool: "pricing-check", region: "us-west" },
  { id: "c3", client: "Gemini", icon: "sparkles", status: "connected", requests: 1890, sessionDuration: "56m", currentTool: "faq-search", region: "eu-west" },
  { id: "c4", client: "Cursor", icon: "code", status: "connected", requests: 890, sessionDuration: "3h 22m", currentTool: "product-lookup", region: "us-east" },
  { id: "c5", client: "Windsurf", icon: "wind", status: "connected", requests: 560, sessionDuration: "1h 05m", currentTool: "order-status", region: "us-east" },
  { id: "c6", client: "VS Code", icon: "terminal", status: "disconnected", requests: 320, sessionDuration: "12m", currentTool: "size-guide", region: "eu-west" },
  { id: "c7", client: "OpenAI API", icon: "zap", status: "connected", requests: 12000, sessionDuration: "4h 30m", currentTool: "pricing-check", region: "us-east" },
  { id: "c8", client: "Anthropic API", icon: "shield", status: "connected", requests: 6700, sessionDuration: "3h 15m", currentTool: "inventory-check", region: "us-west" },
];

// ── Logs ───────────────────────────────────────────────────────

export interface MCPLog {
  id: string;
  timestamp: string;
  type: "request" | "response" | "info" | "warning" | "error";
  method: string;
  path: string;
  duration: string;
  status: number;
  tool: string;
  client: string;
  message: string;
}

export const MCP_LOGS: MCPLog[] = [
  { id: "l01", timestamp: "14:32:18.042", type: "request", method: "POST", path: "/api/v2/tools/product-lookup", duration: "24ms", status: 200, tool: "product-lookup", client: "ChatGPT", message: "GET product by SKU: NK-001" },
  { id: "l02", timestamp: "14:32:18.066", type: "response", method: "POST", path: "/api/v2/tools/product-lookup", duration: "24ms", status: 200, tool: "product-lookup", client: "ChatGPT", message: "200 OK · 1.2KB" },
  { id: "l03", timestamp: "14:32:19.112", type: "request", method: "POST", path: "/api/v2/tools/pricing-check", duration: "31ms", status: 200, tool: "pricing-check", client: "Claude", message: "GET pricing for PM-892" },
  { id: "l04", timestamp: "14:32:19.143", type: "response", method: "POST", path: "/api/v2/tools/pricing-check", duration: "31ms", status: 200, tool: "pricing-check", client: "Claude", message: "200 OK · 0.8KB" },
  { id: "l05", timestamp: "14:32:20.401", type: "request", method: "POST", path: "/api/v2/tools/inventory-check", duration: "118ms", status: 200, tool: "inventory-check", client: "Anthropic API", message: "Check inventory NK-001 (us-east)" },
  { id: "l06", timestamp: "14:32:20.519", type: "response", method: "POST", path: "/api/v2/tools/inventory-check", duration: "118ms", status: 200, tool: "inventory-check", client: "Anthropic API", message: "200 OK · 0.5KB (high latency)" },
  { id: "l07", timestamp: "14:32:21.003", type: "request", method: "POST", path: "/api/v2/tools/faq-search", duration: "18ms", status: 200, tool: "faq-search", client: "Gemini", message: "Search: return policy" },
  { id: "l08", timestamp: "14:32:22.455", type: "error", method: "POST", path: "/api/v2/tools/shipping-estimate", duration: "452ms", status: 504, tool: "shipping-estimate", client: "OpenAI API", message: "504 Gateway Timeout · upstream timeout" },
  { id: "l09", timestamp: "14:32:23.102", type: "warning", method: "POST", path: "/api/v2/tools/inventory-check", duration: "98ms", status: 200, tool: "inventory-check", client: "Claude", message: "High latency: 98ms (threshold: 80ms)" },
  { id: "l10", timestamp: "14:32:24.001", type: "info", method: "GET", path: "/api/v2/health", duration: "4ms", status: 200, tool: "system", client: "Monitor", message: "Health check OK" },
  { id: "l11", timestamp: "14:32:25.330", type: "request", method: "POST", path: "/api/v2/tools/order-status", duration: "42ms", status: 200, tool: "order-status", client: "Windsurf", message: "Get order ORD-789" },
  { id: "l12", timestamp: "14:32:26.100", type: "request", method: "POST", path: "/api/v2/tools/product-lookup", duration: "22ms", status: 200, tool: "product-lookup", client: "Cursor", message: "GET product by SKU: NK-003" },
  { id: "l13", timestamp: "14:32:27.050", type: "info", method: "GET", path: "/api/v2/metrics", duration: "8ms", status: 200, tool: "system", client: "Monitor", message: "Metrics collected" },
  { id: "l14", timestamp: "14:32:28.201", type: "error", method: "POST", path: "/api/v2/tools/shipping-estimate", duration: "480ms", status: 504, tool: "shipping-estimate", client: "ChatGPT", message: "504 Gateway Timeout · upstream timeout" },
];

// ── Authentication ─────────────────────────────────────────────

export interface AuthConfig {
  oauthEnabled: boolean;
  bearerTokens: number;
  apiKeys: number;
  allowedDomains: string[];
  permissions: string[];
  activeSessions: number;
  connectedClients: number;
  rotationHistory: string;
}

export const AUTH_CONFIG: AuthConfig = {
  oauthEnabled: true,
  bearerTokens: 24,
  apiKeys: 8,
  allowedDomains: ["nike.com", "nike.org", "*.vercel.app"],
  permissions: ["products:read", "pricing:read", "inventory:read", "orders:read", "content:read", "shipping:read", "stores:read"],
  activeSessions: 128,
  connectedClients: 12,
  rotationHistory: "Last rotated 14 days ago",
};

// ── Security Alerts ────────────────────────────────────────────

export interface SecurityAlert {
  id: string;
  type: "threat" | "rate-limit" | "abuse" | "failed-auth" | "token-expiry";
  message: string;
  severity: "low" | "medium" | "high" | "critical";
  count: number;
  time: string;
}

export const SECURITY_ALERTS: SecurityAlert[] = [
  { id: "s1", type: "rate-limit", message: "Rate limit triggered for IP 192.168.1.50", severity: "low", count: 24, time: "5 min ago" },
  { id: "s2", type: "failed-auth", message: "Failed authentication attempts from unknown client", severity: "medium", count: 12, time: "15 min ago" },
  { id: "s3", type: "abuse", message: "Abuse detection: rapid tool invocation pattern", severity: "high", count: 3, time: "1h ago" },
  { id: "s4", type: "token-expiry", message: "API key expiring in 48 hours (key: prod-8a3f)", severity: "medium", count: 1, time: "2h ago" },
  { id: "s5", type: "threat", message: "Blocked request from known malicious IP range", severity: "critical", count: 2, time: "4h ago" },
];

// ── Monitoring ─────────────────────────────────────────────────

export interface MonitoringMetric {
  label: string;
  value: string;
  status: HealthStatus;
  trend: "up" | "down" | "stable";
}

export const MONITORING_METRICS: MonitoringMetric[] = [
  { label: "Availability", value: "99.97%", status: "healthy", trend: "stable" },
  { label: "Error Rate", value: "0.02%", status: "healthy", trend: "down" },
  { label: "Slow Requests", value: "0.8%", status: "warning", trend: "up" },
  { label: "Timeouts", value: "0.3%", status: "warning", trend: "stable" },
  { label: "Retries", value: "1.2%", status: "healthy", trend: "down" },
  { label: "Success Rate", value: "99.8%", status: "healthy", trend: "up" },
  { label: "Queue Length", value: "3", status: "healthy", trend: "stable" },
  { label: "Avg Response Time", value: "38ms", status: "healthy", trend: "stable" },
];

// ── Quick Actions ──────────────────────────────────────────────

export const QUICK_ACTIONS = [
  { id: "qa1", label: "Deploy New Version", icon: "rocket", primary: true },
  { id: "qa2", label: "Rollback", icon: "undo", primary: false },
  { id: "qa3", label: "Restart Server", icon: "refresh", primary: false },
  { id: "qa4", label: "Rotate Keys", icon: "key", primary: false },
  { id: "qa5", label: "Enable Maintenance", icon: "wrench", primary: false },
  { id: "qa6", label: "Generate Endpoint", icon: "plus", primary: false },
  { id: "qa7", label: "Add Tool", icon: "plus-circle", primary: false },
  { id: "qa8", label: "Open Playground", icon: "terminal", primary: false },
];

// ── Sidebar sections ───────────────────────────────────────────

export const MCP_SECTIONS = [
  { id: "overview", label: "Overview", icon: "layout-dashboard" },
  { id: "deployments", label: "Deployments", icon: "git-branch" },
  { id: "endpoints", label: "Endpoints", icon: "server" },
  { id: "tools", label: "Tools", icon: "wrench" },
  { id: "authentication", label: "Authentication", icon: "shield" },
  { id: "env-vars", label: "Environment Variables", icon: "file-json" },
  { id: "logs", label: "Logs", icon: "terminal" },
  { id: "usage", label: "Usage", icon: "bar-chart" },
  { id: "analytics", label: "Analytics", icon: "chart-line" },
  { id: "scaling", label: "Scaling", icon: "trending-up" },
  { id: "monitoring", label: "Monitoring", icon: "activity" },
  { id: "domains", label: "Domains", icon: "globe" },
  { id: "security", label: "Security", icon: "shield-alert" },
  { id: "webhooks", label: "Webhooks", icon: "webhook" },
  { id: "audit-logs", label: "Audit Logs", icon: "scroll-text" },
];
