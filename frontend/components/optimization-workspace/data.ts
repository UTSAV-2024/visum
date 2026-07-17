// ── Status ─────────────────────────────────────────────────────

export type Priority = "critical" | "high" | "medium" | "low";
export type Difficulty = "easy" | "medium" | "hard";
export type Status = "backlog" | "todo" | "in-progress" | "review" | "done";
export type Category =
  | "Content"
  | "Schema"
  | "Technical SEO"
  | "AI Crawling"
  | "Hosted MCP"
  | "Performance"
  | "Metadata"
  | "Security";

// ── Recommendation Work Item ───────────────────────────────────

export interface WorkItem {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  category: Category;
  scoreImprovement: number;
  trafficImprovement: number;
  difficulty: Difficulty;
  implementationTime: string;
  dependencies: string[];
  fixAvailable: boolean;
  completed: boolean;
  status: Status;
  assignee: string | null;
  labels: string[];
  dueDate: string | null;
  createdAt: string;
  // Inspector detail
  businessImpact: string;
  technicalExplanation: string;
  aiExplanation: string;
  affectedPages: string[];
  estimatedTrafficImpact: string;
  estimatedVisibilityGain: string;
  filesToModify: string[];
  implementationGuide: string[];
  codePreview: string | null;
  documentation: { label: string; url: string }[];
  relatedRecs: string[];
  comments: Comment[];
}

export interface Comment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  timestamp: string;
}

// ── Category Group ─────────────────────────────────────────────

export interface CategoryGroup {
  id: Category;
  label: string;
  color: string;
  openTasks: number;
  completed: number;
  estimatedScoreGain: number;
}

// ── Activity Item ──────────────────────────────────────────────

export interface ActivityItem {
  id: string;
  type: "completed" | "deployment" | "comment" | "assignment" | "visibility" | "pr" | "scan";
  message: string;
  time: string;
  user: string;
}

// ── Sprint Progress ────────────────────────────────────────────

export interface SprintProgress {
  currentSprint: string;
  tasksCompleted: number;
  totalTasks: number;
  visibilityGained: number;
  remainingImpact: number;
  projectedScore: number;
  velocity: number;
  completionForecast: string;
}

// ── Mock Data ──────────────────────────────────────────────────

export const CATEGORY_GROUPS: CategoryGroup[] = [
  { id: "Schema", label: "Schema", color: "bg-purple-500", openTasks: 3, completed: 1, estimatedScoreGain: 24 },
  { id: "AI Crawling", label: "AI Crawling", color: "bg-blue-500", openTasks: 2, completed: 0, estimatedScoreGain: 20 },
  { id: "Performance", label: "Performance", color: "bg-orange-500", openTasks: 2, completed: 0, estimatedScoreGain: 22 },
  { id: "Content", label: "Content", color: "bg-green-500", openTasks: 1, completed: 1, estimatedScoreGain: 8 },
  { id: "Metadata", label: "Metadata", color: "bg-cyan-500", openTasks: 1, completed: 0, estimatedScoreGain: 8 },
  { id: "Technical SEO", label: "Technical SEO", color: "bg-yellow-500", openTasks: 2, completed: 0, estimatedScoreGain: 14 },
  { id: "Hosted MCP", label: "Hosted MCP", color: "bg-indigo-500", openTasks: 1, completed: 0, estimatedScoreGain: 10 },
  { id: "Security", label: "Security", color: "bg-red-500", openTasks: 1, completed: 0, estimatedScoreGain: 15 },
];

export const WORK_ITEMS: WorkItem[] = [
  {
    id: "rec-1",
    title: "Unblock GPTBot and Claude-Web in robots.txt",
    description: "Your robots.txt currently blocks GPTBot and Claude-Web from crawling your site. AI systems cannot access any content on pages where these crawlers are disallowed.",
    priority: "critical",
    category: "AI Crawling",
    scoreImprovement: 15,
    trafficImprovement: 25,
    difficulty: "easy",
    implementationTime: "5 min",
    dependencies: [],
    fixAvailable: true,
    completed: false,
    status: "todo",
    assignee: "Utsav",
    labels: ["quick-win", "crawling"],
    dueDate: "2026-07-22",
    createdAt: "2026-07-17",
    businessImpact: "AI chatbots cannot answer any questions about your site because they cannot access it. This is the single biggest blocker to AI visibility.",
    technicalExplanation: "GPTBot (ChatGPT) and Claude-Web (Anthropic) are User-Agent tokens in robots.txt. When they encounter 'Disallow: /', they skip the entire site. Changing to 'Allow: /' for these bots enables full crawling.",
    aiExplanation: "Without access to your site, I can only tell users generic information. Once unblocked, I can reference your actual content — products, pricing, support articles — in my responses.",
    affectedPages: ["/", "/products", "/pricing", "/blog"],
    estimatedTrafficImpact: "+25% AI referral traffic",
    estimatedVisibilityGain: "+15 points",
    filesToModify: ["robots.txt"],
    implementationGuide: [
      "Open your robots.txt file via FTP or hosting panel",
      "Locate the 'User-agent: GPTBot' section",
      "Change 'Disallow: /' to 'Allow: /'",
      "Add 'User-agent: Claude-Web' followed by 'Allow: /'",
      "Save and upload",
      "Verify with the Crawl Explorer tool",
    ],
    codePreview: "User-agent: GPTBot\nAllow: /\n\nUser-agent: Claude-Web\nAllow: /",
    documentation: [
      { label: "OpenAI Crawler Docs", url: "#" },
      { label: "Anthropic Crawler Docs", url: "#" },
    ],
    relatedRecs: ["rec-3", "rec-4"],
    comments: [
      { id: "c1", author: "Utsav", avatar: "U", text: "I'll handle this today. Need to check with DevOps about FTP access.", timestamp: "2h ago" },
    ],
  },
  {
    id: "rec-2",
    title: "Add JSON-LD structured data to homepage",
    description: "Your homepage lacks JSON-LD structured data. AI systems have no reliable way to determine what your pages are about, leading to poor citation quality.",
    priority: "critical",
    category: "Schema",
    scoreImprovement: 12,
    trafficImprovement: 20,
    difficulty: "medium",
    implementationTime: "30 min",
    dependencies: ["rec-4"],
    fixAvailable: true,
    completed: true,
    status: "done",
    assignee: "Priya",
    labels: ["schema", "homepage"],
    dueDate: "2026-07-20",
    createdAt: "2026-07-17",
    businessImpact: "AI systems that understand your page structure can cite it accurately. Missing schema means lower citation quality and visibility.",
    technicalExplanation: "JSON-LD is structured data embedded in <script> tags. It tells AI systems exactly what type of content is on each page (WebPage, Article, Product, etc.).",
    aiExplanation: "With schema markup, I can understand your page is a product page about running shoes, not just generic HTML. This helps me answer 'What shoes does Nike offer?' correctly.",
    affectedPages: ["/", "/products", "/blog"],
    estimatedTrafficImpact: "+20% AI referral traffic",
    estimatedVisibilityGain: "+12 points",
    filesToModify: ["index.html", "components/Head.tsx"],
    implementationGuide: [
      "Generate JSON-LD for your homepage using schema.org/WebPage",
      "Add Organization schema with logo, name, and social profiles",
      "Embed in <script type='application/ld+json'> tag in <head>",
      "Validate with Google's Rich Results Test",
      "Repeat for key landing pages",
    ],
    codePreview: `<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "WebPage",\n  "name": "Nike - Just Do It",\n  "description": "Official Nike site"\n}\n</script>`,
    documentation: [
      { label: "Schema.org WebPage", url: "#" },
      { label: "Google Rich Results Test", url: "#" },
    ],
    relatedRecs: ["rec-1", "rec-4"],
    comments: [],
  },
  {
    id: "rec-3",
    title: "Optimize page load speed for AI crawlers",
    description: "Your pages take 4.2s to load. AI agents operate under strict timeouts (5-10s). Slow pages are often abandoned before content fully renders.",
    priority: "high",
    category: "Performance",
    scoreImprovement: 10,
    trafficImprovement: 15,
    difficulty: "medium",
    implementationTime: "2 hours",
    dependencies: [],
    fixAvailable: true,
    completed: false,
    status: "in-progress",
    assignee: "Alex",
    labels: ["performance", "core-web-vitals"],
    dueDate: "2026-07-25",
    createdAt: "2026-07-17",
    businessImpact: "AI agents timeout on slow pages. Your content never reaches AI responses, even if it's valuable. This affects all engines but especially Gemini which has strict timeout limits.",
    technicalExplanation: "First Contentful Paint (FCP) of 4.2s exceeds AI crawler timeouts. Key issues: large hero images, render-blocking CSS, and unoptimized JavaScript bundles.",
    aiExplanation: "I tried to read your pricing page but it was still loading when my timeout expired. I had to skip it entirely, so I couldn't get pricing information for users.",
    affectedPages: ["/pricing", "/products", "/checkout"],
    estimatedTrafficImpact: "+15% AI referral traffic",
    estimatedVisibilityGain: "+10 points",
    filesToModify: ["next.config.js", "components/HeroImage.tsx"],
    implementationGuide: [
      "Optimize hero images with next/image and WebP format",
      "Implement code splitting for below-fold content",
      "Defer non-critical JavaScript",
      "Add resource hints (preconnect, prefetch)",
      "Enable CDN caching for static assets",
    ],
    codePreview: "// next.config.js\nmodule.exports = {\n  images: {\n    formats: ['image/webp'],\n    deviceSizes: [640, 750, 1080, 1200],\n  },\n}",
    documentation: [
      { label: "Web Vitals Guide", url: "#" },
      { label: "Next.js Image Optimization", url: "#" },
    ],
    relatedRecs: ["rec-1"],
    comments: [
      { id: "c2", author: "Alex", avatar: "A", text: "Working on image optimization now. The hero image is 2.4MB — cutting to WebP should help significantly.", timestamp: "4h ago" },
      { id: "c3", author: "Utsav", avatar: "U", text: "Great catch. Let me know if you need help with the code splitting.", timestamp: "3h ago" },
    ],
  },
  {
    id: "rec-4",
    title: "Create llms.txt file for AI assistants",
    description: "No llms.txt file found. AI coding assistants have no structured guidance about your project, limiting their ability to reference your documentation.",
    priority: "medium",
    category: "Content",
    scoreImprovement: 8,
    trafficImprovement: 10,
    difficulty: "easy",
    implementationTime: "15 min",
    dependencies: [],
    fixAvailable: true,
    completed: false,
    status: "todo",
    assignee: null,
    labels: ["documentation", "llms"],
    dueDate: null,
    createdAt: "2026-07-17",
    businessImpact: "AI coding assistants (Cursor, Copilot, Windsurf) cannot find your documentation. This means developers using AI tools get less accurate help with your platform.",
    technicalExplanation: "llms.txt is a proposed standard file that sits at the root of your domain and provides AI assistants with structured guidance: key pages, API docs, and code conventions.",
    aiExplanation: "I couldn't find an llms.txt file, so I don't have a quick reference for your project structure. I'll have to browse your entire site to find relevant pages, which takes longer and may miss things.",
    affectedPages: ["/llms.txt"],
    estimatedTrafficImpact: "+10% AI tool traffic",
    estimatedVisibilityGain: "+8 points",
    filesToModify: ["public/llms.txt"],
    implementationGuide: [
      "Create a new file at /public/llms.txt",
      "Add your project name, description, and key URL structure",
      "List important pages: API docs, guides, reference materials",
      "Add optional sections for code conventions",
      "Deploy to /llms.txt",
    ],
    codePreview: "# Acme Inc.\n> AI-powered visibility platform\n\n## Docs\n- API Reference: https://acme.com/docs/api\n- Getting Started: https://acme.com/docs/guide\n\n## Core Pages\n- Products: /products\n- Pricing: /pricing",
    documentation: [
      { label: "llms.txt Specification", url: "#" },
    ],
    relatedRecs: ["rec-2"],
    comments: [],
  },
  {
    id: "rec-5",
    title: "Implement MCP endpoint for AI agents",
    description: "AI agents can only read your static pages. An MCP endpoint allows them to query your data directly — checking pricing, inventory, or availability in real-time.",
    priority: "medium",
    category: "Hosted MCP",
    scoreImprovement: 10,
    trafficImprovement: 18,
    difficulty: "hard",
    implementationTime: "4 hours",
    dependencies: ["rec-1"],
    fixAvailable: false,
    completed: false,
    status: "backlog",
    assignee: null,
    labels: ["mcp", "api"],
    dueDate: null,
    createdAt: "2026-07-17",
    businessImpact: "Without an MCP endpoint, AI agents have stale, static information. Dynamic queries (pricing, inventory, availability) are answered from cached content rather than live data.",
    technicalExplanation: "MCP (Model Context Protocol) is a standard for AI agents to query data sources directly. An MCP server exposes tools that agents can call in real-time.",
    aiExplanation: "I can only read your pre-cached pages. If a user asks about current inventory or real-time pricing, I have to guess based on what I last saw. With MCP, I could check live data instantly.",
    affectedPages: ["/api/mcp"],
    estimatedTrafficImpact: "+18% AI agent interactions",
    estimatedVisibilityGain: "+10 points",
    filesToModify: ["pages/api/mcp.ts", "mcp.config.js"],
    implementationGuide: [
      "Set up MCP server using the MCP SDK",
      "Define tools for product lookup, pricing, and inventory",
      "Implement authentication using API keys",
      "Deploy to production environment",
      "Test with Claude Desktop or Cursor",
    ],
    codePreview: null,
    documentation: [
      { label: "MCP Specification", url: "#" },
      { label: "MCP TypeScript SDK", url: "#" },
    ],
    relatedRecs: ["rec-1"],
    comments: [],
  },
  {
    id: "rec-6",
    title: "Improve meta tags and Open Graph descriptions",
    description: "Critical meta tags are incomplete. AI summarization tools rely on meta descriptions when citing your site — missing tags result in generic snippets.",
    priority: "low",
    category: "Metadata",
    scoreImprovement: 8,
    trafficImprovement: 12,
    difficulty: "easy",
    implementationTime: "10 min",
    dependencies: [],
    fixAvailable: true,
    completed: false,
    status: "backlog",
    assignee: null,
    labels: ["meta", "og"],
    dueDate: null,
    createdAt: "2026-07-17",
    businessImpact: "When AI systems cite your site, they use meta descriptions. Missing or poor descriptions mean generic, less compelling citations that users are less likely to click.",
    technicalExplanation: "Meta tags go in the HTML <head>. Key tags for AI: meta description, OG title, OG description, Twitter card. These are used by most AI engines when generating citations.",
    aiExplanation: "I want to cite your blog post about running shoes, but your meta description is missing. I'll have to summarize the page myself, which may not match your intended message.",
    affectedPages: ["/", "/blog", "/products"],
    estimatedTrafficImpact: "+12% AI citation click-through",
    estimatedVisibilityGain: "+8 points",
    filesToModify: ["components/SeoHead.tsx", "pages/index.tsx"],
    implementationGuide: [
      "Audit current meta tags using the Inspector panel",
      "Write compelling meta descriptions for each page (120-160 chars)",
      "Add OG:title, OG:description, OG:image for all pages",
      "Add Twitter card tags",
      "Use unique descriptions per page — no duplicates",
    ],
    codePreview: `<meta name="description" content="Browse Nike's latest running shoes featuring advanced cushioning technology. Free shipping on orders over $50." />\n<meta property="og:title" content="Running Shoes | Nike" />\n<meta property="og:description" content="Browse Nike's latest running shoes featuring advanced cushioning technology." />`,
    documentation: [
      { label: "Open Graph Protocol", url: "#" },
      { label: "Twitter Card Docs", url: "#" },
    ],
    relatedRecs: ["rec-2"],
    comments: [],
  },
  {
    id: "rec-7",
    title: "Fix JavaScript rendering for critical pages",
    description: "Your content depends heavily on JavaScript. AI crawlers that don't run JS see almost nothing on your pages, missing products, articles, and CTAs.",
    priority: "high",
    category: "Performance",
    scoreImprovement: 12,
    trafficImprovement: 22,
    difficulty: "hard",
    implementationTime: "3 hours",
    dependencies: ["rec-3"],
    fixAvailable: true,
    completed: false,
    status: "todo",
    assignee: "Priya",
    labels: ["rendering", "ssr"],
    dueDate: "2026-07-28",
    createdAt: "2026-07-17",
    businessImpact: "AI agents that don't run JavaScript see empty pages. ChatGPT and Gemini can't read your product descriptions or CTAs, leading to poor answers.",
    technicalExplanation: "Server-Side Rendering (SSR) or Static Site Generation (SSG) pre-renders HTML so AI crawlers get complete content without executing JS. Key pages to fix: products, pricing, checkout.",
    aiExplanation: "When I visited your product page, all I got was a loading spinner. Because my crawler didn't execute the JavaScript, I couldn't read any product information or images.",
    affectedPages: ["/products", "/pricing", "/checkout"],
    estimatedTrafficImpact: "+22% AI crawl success rate",
    estimatedVisibilityGain: "+12 points",
    filesToModify: ["pages/products.tsx", "pages/pricing.tsx"],
    implementationGuide: [
      "Identify pages that depend on client-side rendering",
      "Implement SSR using getServerSideProps or getStaticProps",
      "Ensure critical content renders without JavaScript",
      "Test with JavaScript disabled in browser DevTools",
      "Verify using Visum's Crawl Explorer",
    ],
    codePreview: "export async function getServerSideProps() {\n  const products = await fetchProducts();\n  return { props: { products } };\n}",
    documentation: [
      { label: "Next.js SSR Guide", url: "#" },
      { label: "Rendering on the Web", url: "#" },
    ],
    relatedRecs: ["rec-3"],
    comments: [],
  },
  {
    id: "rec-8",
    title: "Enable MCP Authentication",
    description: "Your MCP server lacks authentication. Any AI agent can access your tools. Add bearer token authentication to secure your endpoints.",
    priority: "critical",
    category: "Security",
    scoreImprovement: 0,
    trafficImprovement: 0,
    difficulty: "medium",
    implementationTime: "30 min",
    dependencies: ["rec-5"],
    fixAvailable: true,
    completed: false,
    status: "backlog",
    assignee: null,
    labels: ["security", "mcp"],
    dueDate: null,
    createdAt: "2026-07-17",
    businessImpact: "Security vulnerability — any AI agent can query your tools without authorization. Risk of data scraping and unauthorized access.",
    technicalExplanation: "MCP authentication uses bearer tokens passed in HTTP headers. Implement token verification middleware on your MCP endpoint.",
    aiExplanation: "I can access your MCP tools without any authentication. This means anyone could query your inventory and pricing data without restrictions.",
    affectedPages: ["MCP Server"],
    estimatedTrafficImpact: "Security improvement",
    estimatedVisibilityGain: "Security improvement",
    filesToModify: ["pages/api/mcp.ts"],
    implementationGuide: [
      "Generate API keys using the dashboard",
      "Add token verification middleware",
      "Update MCP client configuration with tokens",
      "Test authentication with invalid token",
      "Rotate keys regularly",
    ],
    codePreview: "const apiKey = req.headers['authorization']?.replace('Bearer ', '');\nif (!apiKey || !validateApiKey(apiKey)) {\n  return res.status(401).json({ error: 'Unauthorized' });\n}",
    documentation: [
      { label: "MCP Authentication Docs", url: "#" },
    ],
    relatedRecs: ["rec-5"],
    comments: [],
  },
];

// ── Activity Feed Data ─────────────────────────────────────────

export const ACTIVITY_ITEMS: ActivityItem[] = [
  { id: "a1", type: "completed", message: "JSON-LD structured data implemented on homepage", time: "2h ago", user: "Priya" },
  { id: "a2", type: "comment", message: "Alex commented on 'Optimize page load speed'", time: "3h ago", user: "Alex" },
  { id: "a3", type: "assignment", message: "'Fix JavaScript rendering' assigned to Priya", time: "5h ago", user: "Utsav" },
  { id: "a4", type: "visibility", message: "AI Visibility Score increased by 12 points", time: "6h ago", user: "System" },
  { id: "a5", type: "scan", message: "New scan completed — 3 new issues detected", time: "8h ago", user: "System" },
  { id: "a6", type: "deployment", message: "MCP server v2.1 deployed to production", time: "10h ago", user: "Alex" },
  { id: "a7", type: "pr", message: "PR #142: Add JSON-LD schema to product pages", time: "12h ago", user: "Priya" },
  { id: "a8", type: "completed", message: "llms.txt file created and deployed", time: "1d ago", user: "Utsav" },
];

// ── Sprint Progress ────────────────────────────────────────────

export const SPRINT_PROGRESS: SprintProgress = {
  currentSprint: "Sprint 4 · July 14-27",
  tasksCompleted: 1,
  totalTasks: 8,
  visibilityGained: 12,
  remainingImpact: 63,
  projectedScore: 91,
  velocity: 7,
  completionForecast: "Aug 3, 2026",
};

// ── Dependency Graph Links ─────────────────────────────────────

export interface DepEdge {
  source: string;
  target: string;
}

export const DEPENDENCY_EDGES: DepEdge[] = [
  { source: "rec-4", target: "rec-2" },
  { source: "rec-1", target: "rec-5" },
  { source: "rec-5", target: "rec-8" },
  { source: "rec-3", target: "rec-7" },
];

// ── AI Project Manager Messages ─────────────────────────────────

export const AI_PM_MESSAGES = {
  morning: "Good morning! If you only have one hour today, implement the robots.txt fix and create llms.txt. Combined, these changes are estimated to increase your AI Visibility Score by approximately 23 points. Both are quick wins that take under 20 minutes total.",
  afternoon: "You've made great progress this week! The JSON-LD implementation is paying off — your citation rate improved 15%. Next priority: fix the JavaScript rendering issues on product pages. This is blocking 40% of your potential visibility gains.",
  weekend: "End-of-week summary: 1 task completed, 12 points gained. Your projected score is now 91/100 if all remaining items are completed by Aug 3. Focus on the critical and high-priority items first — they account for 65% of remaining impact.",
};

// ── Filter/View Options ────────────────────────────────────────

export const VIEW_OPTIONS = [
  { id: "table", label: "Table" },
  { id: "board", label: "Board" },
  { id: "roadmap", label: "Roadmap" },
];

export const SORT_OPTIONS = [
  { id: "priority", label: "Priority" },
  { id: "score", label: "Score Impact" },
  { id: "difficulty", label: "Difficulty" },
  { id: "time", label: "Time" },
  { id: "status", label: "Status" },
];

// ── Assignees ──────────────────────────────────────────────────

export const ASSIGNEES = [
  { id: "all", label: "All Assignees" },
  { id: "utsav", label: "Utsav" },
  { id: "priya", label: "Priya" },
  { id: "alex", label: "Alex" },
  { id: "unassigned", label: "Unassigned" },
];

// ── Priority Config ────────────────────────────────────────────

export const PRIORITY_CONFIG: Record<Priority, { label: string; color: string; bg: string; text: string; border: string }> = {
  critical: { label: "Critical", color: "bg-red-500", bg: "bg-red-500/10", text: "text-red-500", border: "border-l-red-500/40" },
  high: { label: "High", color: "bg-orange-500", bg: "bg-orange-500/10", text: "text-orange-500", border: "border-l-orange-500/40" },
  medium: { label: "Medium", color: "bg-accent", bg: "bg-accent/10", text: "text-accent", border: "border-l-accent/40" },
  low: { label: "Low", color: "bg-green-500", bg: "bg-green-500/10", text: "text-green-500", border: "border-l-green-500/40" },
};

export const PRIORITY_ORDER: Record<Priority, number> = { critical: 0, high: 1, medium: 2, low: 3 };
export const DIFFICULTY_ORDER: Record<Difficulty, number> = { easy: 0, medium: 1, hard: 2 };
