/**
 * Visum's brand tokens, converted from the site's OKLCH values to sRGB hex.
 *
 * Kept as one object so the video reads as the same product as the site. If
 * the site's palette changes, re-derive these from
 * `frontend/styles/globals.css` rather than eyeballing new values.
 */
export const C = {
  bg: "#040909",
  card: "#091111",
  secondary: "#111a1a",
  border: "#1d2929",
  fg: "#e6edec",
  muted: "#99a8a6",
  accent: "#52cfba",
  copper: "#e09865",
  pass: "#49d3a1",
  warn: "#e4ac59",
  fail: "#f3625d",
} as const;

/**
 * The site's signature easing — a long, decelerating ease-out. Reused
 * everywhere so motion in the video feels like motion in the product.
 */
export const EASE = [0.16, 1, 0.3, 1] as const;

/** A softer curve for continuous/ambient motion that shouldn't snap. */
export const EASE_SOFT = [0.4, 0, 0.2, 1] as const;

/** The eight checks, with the weights the real scorer uses. */
export const CHECKS = [
  { name: "JSON-LD Structured Data", weight: 20, score: 20 },
  { name: "AI Bot Permissions", weight: 15, score: 13 },
  { name: "llms.txt File", weight: 10, score: 10 },
  { name: "MCP Endpoint", weight: 10, score: 10 },
  { name: "JavaScript Rendering", weight: 10, score: 10 },
  { name: "Meta Tags & Open Graph", weight: 10, score: 8 },
  { name: "Page Load Speed", weight: 10, score: 10 },
  { name: "Sitemap.xml", weight: 5, score: 5 },
] as const;

/** Crawlers named in the analytics scene, with their real vendors. */
export const CRAWLERS = [
  { name: "GPTBot", vendor: "OpenAI", value: 0.92 },
  { name: "ClaudeBot", vendor: "Anthropic", value: 0.74 },
  { name: "PerplexityBot", vendor: "Perplexity", value: 0.58 },
  { name: "Google-Extended", vendor: "Google", value: 0.41 },
  { name: "CCBot", vendor: "Common Crawl", value: 0.27 },
] as const;
