export const YOUR_SITE = {
  name: "Your Site",
  domain: "example.com",
  score: 78,
  rank: 3,
  readability: 85,
  crawlability: 72,
  structuredData: 68,
  performance: 65,
  reliability: 82,
  totalPages: 2847,
  aiTraffic: 6258,
  change: "+5",
};

export const COMPETITORS = [
  { name: "Competitor A", domain: "comp-a.com", score: 92, rank: 1, readability: 94, crawlability: 90, structuredData: 88, performance: 85, reliability: 96, totalPages: 15200, aiTraffic: 12450, change: "+8" },
  { name: "Competitor B", domain: "comp-b.com", score: 85, rank: 2, readability: 88, crawlability: 85, structuredData: 82, performance: 78, reliability: 90, totalPages: 8900, aiTraffic: 9820, change: "+3" },
  { name: "Your Site", domain: "example.com", score: 78, rank: 3, readability: 85, crawlability: 72, structuredData: 68, performance: 65, reliability: 82, totalPages: 2847, aiTraffic: 6258, change: "+5" },
  { name: "Competitor C", domain: "comp-c.com", score: 72, rank: 4, readability: 75, crawlability: 70, structuredData: 65, performance: 60, reliability: 78, totalPages: 4200, aiTraffic: 4100, change: "+2" },
  { name: "Competitor D", domain: "comp-d.com", score: 65, rank: 5, readability: 68, crawlability: 62, structuredData: 55, performance: 58, reliability: 70, totalPages: 1800, aiTraffic: 2850, change: "-1" },
];

export const INDUSTRY_AVG = {
  score: 70,
  readability: 72,
  crawlability: 68,
  structuredData: 60,
  performance: 62,
  reliability: 75,
};

export const METRICS = ["readability", "crawlability", "structuredData", "performance", "reliability"];

export const METRIC_LABELS = {
  readability: "Readability",
  crawlability: "Crawlability",
  structuredData: "Structured Data",
  performance: "Performance",
  reliability: "Reliability",
};

export const FEATURE_COMPARISON = [
  { feature: "Robots.txt AI Access", yours: true, competitors: { "Competitor A": true, "Competitor B": true, "Competitor C": false, "Competitor D": false } },
  { feature: "JSON-LD Structured Data", yours: false, competitors: { "Competitor A": true, "Competitor B": true, "Competitor C": false, "Competitor D": false } },
  { feature: "llms.txt File", yours: false, competitors: { "Competitor A": true, "Competitor B": false, "Competitor C": false, "Competitor D": false } },
  { feature: "MCP Endpoint", yours: false, competitors: { "Competitor A": true, "Competitor B": false, "Competitor C": false, "Competitor D": false } },
  { feature: "JS Server-Side Rendering", yours: true, competitors: { "Competitor A": true, "Competitor B": true, "Competitor C": true, "Competitor D": false } },
  { feature: "Meta Tags Optimized", yours: true, competitors: { "Competitor A": true, "Competitor B": true, "Competitor C": true, "Competitor D": true } },
  { feature: "Sitemap.xml", yours: true, competitors: { "Competitor A": true, "Competitor B": true, "Competitor C": true, "Competitor D": false } },
  { feature: "Page Speed < 2s", yours: false, competitors: { "Competitor A": true, "Competitor B": false, "Competitor C": false, "Competitor D": false } },
];

export const RECOMMENDATIONS_COMPARISON = {
  yours: [
    { text: "Unblock GPTBot in robots.txt", priority: "critical", gain: 15 },
    { text: "Add JSON-LD structured data", priority: "critical", gain: 12 },
    { text: "Optimize page load speed", priority: "high", gain: 10 },
    { text: "Create llms.txt file", priority: "medium", gain: 8 },
  ],
  competitors: {
    "Competitor A": [
      { text: "Add MCP endpoint", priority: "medium", gain: 8 },
      { text: "Implement llms.txt", priority: "low", gain: 5 },
    ],
    "Competitor B": [
      { text: "Implement MCP endpoint", priority: "medium", gain: 10 },
      { text: "Optimize page speed", priority: "high", gain: 12 },
      { text: "Add llms.txt file", priority: "low", gain: 5 },
    ],
    "Competitor C": [
      { text: "Unblock GPTBot", priority: "critical", gain: 18 },
      { text: "Add JSON-LD structured data", priority: "critical", gain: 15 },
      { text: "Optimize meta tags", priority: "medium", gain: 8 },
      { text: "Create sitemap.xml", priority: "high", gain: 10 },
    ],
    "Competitor D": [
      { text: "Unblock AI crawlers", priority: "critical", gain: 20 },
      { text: "Add structured data", priority: "critical", gain: 15 },
      { text: "Implement SSR", priority: "high", gain: 12 },
      { text: "Create sitemap.xml", priority: "high", gain: 10 },
      { text: "Optimize page speed", priority: "medium", gain: 8 },
    ],
  },
};
