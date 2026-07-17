// ── Engine types ────────────────────────────────────────────────

export interface EngineInfo {
  id: string;
  name: string;
  status: "healthy" | "warning" | "critical";
  lastCrawl: string;
  avgSuccess: number;
  totalRequests: number;
  color: string;
}

export const ENGINES: EngineInfo[] = [
  { id: "chatgpt", name: "ChatGPT", status: "healthy", lastCrawl: "12 min ago", avgSuccess: 94, totalRequests: 2847, color: "#10a37f" },
  { id: "claude", name: "Claude", status: "warning", lastCrawl: "45 min ago", avgSuccess: 72, totalRequests: 1892, color: "#6a4fc9" },
  { id: "gemini", name: "Gemini", status: "healthy", lastCrawl: "8 min ago", avgSuccess: 91, totalRequests: 3123, color: "#4285f4" },
  { id: "perplexity", name: "Perplexity", status: "healthy", lastCrawl: "22 min ago", avgSuccess: 88, totalRequests: 1456, color: "#1f1f1f" },
  { id: "deepseek", name: "DeepSeek", status: "healthy", lastCrawl: "18 min ago", avgSuccess: 85, totalRequests: 987, color: "#4f46e5" },
  { id: "mistral", name: "Mistral", status: "healthy", lastCrawl: "30 min ago", avgSuccess: 79, totalRequests: 654, color: "#ff6600" },
];

// ── Crawl page / node types ────────────────────────────────────

export type CrawlStatus = "success" | "partial" | "skipped" | "failed" | "unvisited";

export interface CrawlPage {
  id: string;
  url: string;
  path: string;
  title: string;
  status: CrawlStatus;
  responseTime: string;
  statusCode: number;
  contentType: string;
  structuredData: boolean;
  tokenCount: number;
  aiScore: number;
  lastUpdated: string;
  contentSize: string;
  internalLinks: number;
  outboundLinks: number;
  hasSchema: boolean;
  hasOG: boolean;
  hasJSONLD: boolean;
  hasCanonical: boolean;
  language: string;
  // For graph layout
  depth: number;
}

export const CRAWL_PAGES: CrawlPage[] = [
  { id: "homepage", url: "https://acme.com/", path: "/", title: "Homepage", status: "success", responseTime: "1.2s", statusCode: 200, contentType: "text/html", structuredData: true, tokenCount: 1240, aiScore: 92, lastUpdated: "2h ago", contentSize: "48KB", internalLinks: 24, outboundLinks: 6, hasSchema: true, hasOG: true, hasJSONLD: true, hasCanonical: true, language: "en", depth: 0 },
  { id: "robots", url: "https://acme.com/robots.txt", path: "/robots.txt", title: "robots.txt", status: "success", responseTime: "0.4s", statusCode: 200, contentType: "text/plain", structuredData: false, tokenCount: 120, aiScore: 100, lastUpdated: "2h ago", contentSize: "2KB", internalLinks: 0, outboundLinks: 0, hasSchema: false, hasOG: false, hasJSONLD: false, hasCanonical: false, language: "en", depth: 1 },
  { id: "sitemap", url: "https://acme.com/sitemap.xml", path: "/sitemap.xml", title: "Sitemap", status: "success", responseTime: "0.6s", statusCode: 200, contentType: "application/xml", structuredData: false, tokenCount: 890, aiScore: 100, lastUpdated: "2h ago", contentSize: "12KB", internalLinks: 42, outboundLinks: 0, hasSchema: false, hasOG: false, hasJSONLD: false, hasCanonical: false, language: "en", depth: 1 },
  { id: "products", url: "https://acme.com/products", path: "/products", title: "Products", status: "success", responseTime: "2.1s", statusCode: 200, contentType: "text/html", structuredData: true, tokenCount: 3450, aiScore: 85, lastUpdated: "2h ago", contentSize: "128KB", internalLinks: 18, outboundLinks: 3, hasSchema: true, hasOG: true, hasJSONLD: true, hasCanonical: true, language: "en", depth: 2 },
  { id: "pricing", url: "https://acme.com/pricing", path: "/pricing", title: "Pricing", status: "partial", responseTime: "3.5s", statusCode: 200, contentType: "text/html", structuredData: false, tokenCount: 2100, aiScore: 58, lastUpdated: "2h ago", contentSize: "96KB", internalLinks: 12, outboundLinks: 2, hasSchema: false, hasOG: true, hasJSONLD: false, hasCanonical: true, language: "en", depth: 2 },
  { id: "blog", url: "https://acme.com/blog", path: "/blog", title: "Blog", status: "success", responseTime: "1.8s", statusCode: 200, contentType: "text/html", structuredData: true, tokenCount: 5600, aiScore: 90, lastUpdated: "2h ago", contentSize: "192KB", internalLinks: 36, outboundLinks: 4, hasSchema: true, hasOG: true, hasJSONLD: true, hasCanonical: true, language: "en", depth: 2 },
  { id: "contact", url: "https://acme.com/contact", path: "/contact", title: "Contact", status: "success", responseTime: "1.1s", statusCode: 200, contentType: "text/html", structuredData: true, tokenCount: 680, aiScore: 95, lastUpdated: "2h ago", contentSize: "32KB", internalLinks: 6, outboundLinks: 1, hasSchema: true, hasOG: false, hasJSONLD: false, hasCanonical: true, language: "en", depth: 2 },
  { id: "checkout", url: "https://acme.com/checkout", path: "/checkout", title: "Checkout", status: "failed", responseTime: "5.2s", statusCode: 403, contentType: "text/html", structuredData: false, tokenCount: 0, aiScore: 12, lastUpdated: "2h ago", contentSize: "4KB", internalLinks: 2, outboundLinks: 0, hasSchema: false, hasOG: false, hasJSONLD: false, hasCanonical: false, language: "en", depth: 3 },
  { id: "api-docs", url: "https://acme.com/docs/api", path: "/docs/api", title: "API Docs", status: "skipped", responseTime: "—", statusCode: 0, contentType: "application/javascript", structuredData: false, tokenCount: 0, aiScore: 0, lastUpdated: "—", contentSize: "—", internalLinks: 0, outboundLinks: 0, hasSchema: false, hasOG: false, hasJSONLD: false, hasCanonical: false, language: "en", depth: 3 },
  { id: "notfound", url: "https://acme.com/404", path: "/404", title: "404", status: "failed", responseTime: "0.3s", statusCode: 404, contentType: "text/html", structuredData: false, tokenCount: 45, aiScore: 25, lastUpdated: "2h ago", contentSize: "1KB", internalLinks: 1, outboundLinks: 0, hasSchema: false, hasOG: false, hasJSONLD: false, hasCanonical: false, language: "en", depth: 3 },
];

// ── Edge definitions for graph ─────────────────────────────────

export interface CrawlEdge {
  id: string;
  source: string;
  target: string;
  status: CrawlStatus;
  label?: string;
}

export const CRAWL_EDGES: CrawlEdge[] = [
  { id: "e-homepage-robots", source: "homepage", target: "robots", status: "success", label: "discover" },
  { id: "e-homepage-sitemap", source: "homepage", target: "sitemap", status: "success", label: "discover" },
  { id: "e-sitemap-products", source: "sitemap", target: "products", status: "success", label: "crawl" },
  { id: "e-sitemap-pricing", source: "sitemap", target: "pricing", status: "partial", label: "crawl" },
  { id: "e-sitemap-blog", source: "sitemap", target: "blog", status: "success", label: "crawl" },
  { id: "e-sitemap-contact", source: "sitemap", target: "contact", status: "success", label: "crawl" },
  { id: "e-products-checkout", source: "products", target: "checkout", status: "failed", label: "follow" },
  { id: "e-products-api", source: "products", target: "api-docs", status: "skipped", label: "skip" },
  { id: "e-products-404", source: "products", target: "notfound", status: "failed", label: "broken" },
];

// ── Crawl logs ─────────────────────────────────────────────────

export interface CrawlLog {
  id: string;
  time: string;
  type: "request" | "discovery" | "success" | "warning" | "error" | "info";
  message: string;
  detail?: string;
}

export const CRAWL_LOGS: CrawlLog[] = [
  { id: "l01", time: "08:22:14", type: "info", message: "Starting crawl for acme.com", detail: "Engine: ChatGPT-4o" },
  { id: "l02", time: "08:22:15", type: "request", message: "GET / → 200", detail: "1.2s · 48KB · text/html" },
  { id: "l03", time: "08:22:16", type: "discovery", message: "robots.txt found — parsing rules", detail: "2 rules, 1 disallow" },
  { id: "l04", time: "08:22:17", type: "success", message: "Sitemap discovered: sitemap.xml", detail: "42 URLs found" },
  { id: "l05", time: "08:22:18", type: "request", message: "GET /products → 200", detail: "2.1s · 128KB · text/html" },
  { id: "l06", time: "08:22:19", type: "success", message: "Structured data found on /products", detail: "Product schema valid" },
  { id: "l07", time: "08:22:20", type: "request", message: "GET /blog → 200", detail: "1.8s · 192KB · text/html" },
  { id: "l08", time: "08:22:21", type: "request", message: "GET /contact → 200", detail: "1.1s · 32KB · text/html" },
  { id: "l09", time: "08:22:23", type: "warning", message: "GET /pricing → 200 (partial content)", detail: "3.5s · JS-rendered content incomplete" },
  { id: "l10", time: "08:22:24", type: "warning", message: "Structured data missing on /pricing", detail: "No Product or Offer schema" },
  { id: "l11", time: "08:22:25", type: "error", message: "GET /checkout → 403 Forbidden", detail: "Authentication required" },
  { id: "l12", time: "08:22:25", type: "error", message: "Prompt extraction failed on /checkout", detail: "HTML: 'Access Denied'" },
  { id: "l13", time: "08:22:26", type: "info", message: "Skipped JavaScript-heavy content", detail: "3 pages deferred" },
  { id: "l14", time: "08:22:26", type: "request", message: "GET /docs/api → 200 (no render)", detail: "0.8s · application/javascript" },
  { id: "l15", time: "08:22:27", type: "error", message: "GET /404 → 404 Not Found", detail: "Broken link from /products" },
  { id: "l16", time: "08:22:28", type: "info", message: "Crawl complete: 10 pages, 3 issues", detail: "Duration: 14.2s" },
];

// ── AI Thinking summary ────────────────────────────────────────

export function getAIThinking(engineId: string): string {
  const summaries: Record<string, string> = {
    chatgpt: "I successfully crawled your homepage and discovered your sitemap with 42 URLs. Your product pages have excellent structured data — I can answer detailed product questions. However, I could not understand your pricing page because critical pricing information was rendered only after JavaScript execution. Product schema was missing on 17 pages. Because of this, I may answer pricing questions incorrectly. Your checkout page returned a 403 error, so I cannot help users complete purchases.",
    claude: "I analyzed your website structure and found good documentation standards. Your robots.txt allows AI crawling, which is excellent. However, your sitemap references several pages that return errors or require authentication. I was able to read your homepage and blog content clearly, but the pricing page uses client-side rendering that prevents me from extracting structured pricing data. I recommend adding server-side rendered schema markup for your product offerings.",
    gemini: "Your site has strong discoverability signals. The sitemap is well-formed and your canonical URLs are properly configured. I found structured data on most pages with good coverage. The main concern is your checkout flow — since I cannot access authenticated pages, I cannot verify the purchase process. Consider adding structured data for your checkout steps to improve conversion visibility.",
    perplexity: "I crawled your website and found clean HTML with good meta tags. Your Open Graph tags are properly implemented which helps with link previews. The blog content extracts well and would make good citation sources. Pricing page remains problematic — I can see the page title and description but cannot extract the actual pricing table. This means my answers about your pricing may be vague.",
    deepseek: "Your technical SEO foundations are solid. robots.txt, sitemap.xml, and canonical URLs are all properly configured. JavaScript rendering identified as a potential issue on 3 pages. The pricing page is the main gap — without structured pricing data, I cannot provide accurate cost information in responses. Product schema is well-implemented on your catalog pages.",
    mistral: "Crawl completed with 70% success rate. Your core content pages (homepage, blog, contact) are fully accessible and parse well. The main improvement opportunities are: 1) Add structured data to pricing page, 2) Fix 403 error on checkout, 3) Reduce JavaScript dependency for critical content. Your sitemap-based discovery is working correctly.",
  };
  return summaries[engineId] || summaries.chatgpt;
}

// ── Heatmap data ───────────────────────────────────────────────

export type HeatmapMode = "visibility" | "understanding" | "frequency" | "confidence";

export const HEATMAP_MODES: { id: HeatmapMode; label: string }[] = [
  { id: "visibility", label: "Visibility" },
  { id: "understanding", label: "Understanding" },
  { id: "frequency", label: "Crawl Frequency" },
  { id: "confidence", label: "AI Confidence" },
];

// ── Node positions for React Flow ──────────────────────────────

export function getNodePositions() {
  const positions: Record<string, { x: number; y: number }> = {
    homepage: { x: 300, y: 0 },
    robots: { x: 100, y: 140 },
    sitemap: { x: 500, y: 140 },
    products: { x: 200, y: 280 },
    pricing: { x: 400, y: 280 },
    blog: { x: 600, y: 280 },
    contact: { x: 800, y: 280 },
    checkout: { x: 100, y: 420 },
    "api-docs": { x: 300, y: 420 },
    notfound: { x: 500, y: 420 },
  };
  return positions;
}

// ── Status color helpers ───────────────────────────────────────

export const STATUS_COLORS: Record<CrawlStatus, string> = {
  success: "#22c55e",
  partial: "#eab308",
  skipped: "#f97316",
  failed: "#ef4444",
  unvisited: "#404040",
};

export const STATUS_BG: Record<CrawlStatus, string> = {
  success: "rgba(34,197,94,0.1)",
  partial: "rgba(234,179,8,0.1)",
  skipped: "rgba(249,115,22,0.1)",
  failed: "rgba(239,68,68,0.1)",
  unvisited: "rgba(64,64,64,0.1)",
};

export const STATUS_LABELS: Record<CrawlStatus, string> = {
  success: "Successfully crawled",
  partial: "Partially understood",
  skipped: "Skipped",
  failed: "Failed",
  unvisited: "Never visited",
};
