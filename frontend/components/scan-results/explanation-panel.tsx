import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";

const CATEGORY_INFO = {
  "AI Bot Permissions (robots.txt)": {
    summary: "Controls which AI crawlers can access your site",
    sections: [
      { title: "What this checks", content: "Visum checks your robots.txt file to determine if AI crawlers like GPTBot, Claude-Web, Google-Extended, and PerplexityBot are allowed to access your content." },
      { title: "Why it matters", content: "Your robots.txt is the first thing AI crawlers check. If it blocks them, they leave immediately and none of your content gets indexed or cited in AI responses." },
      { title: "Best practice", content: "Keep robots.txt open to AI crawlers unless you have specific content you need to protect. Use selective disallow for private sections rather than blocking entire crawlers." },
    ],
  },
  "JSON-LD Structured Data": {
    summary: "Helps AI systems understand your content structure",
    sections: [
      { title: "What this checks", content: "Visum scans your HTML for JSON-LD script tags with schema.org markup. It checks for completeness of required and recommended fields." },
      { title: "Why it matters", content: "JSON-LD is the primary way AI systems understand what your content means. Without it, AI must guess the type, author, date, and purpose of your pages." },
      { title: "Best practice", content: "Use schema.org types relevant to your content (WebPage, Article, Product, etc.) and include all recommended properties for maximum AI comprehension." },
    ],
  },
  "llms.txt File": {
    summary: "Provides structured guidance for AI coding assistants",
    sections: [
      { title: "What this checks", content: "Visum looks for an llms.txt file at your domain root. This file helps AI coding assistants understand your project structure, API, and documentation." },
      { title: "Why it matters", content: "AI coding tools like Cursor, Copilot, and Claude's Code feature use llms.txt to get context about your project. Without it, they lack structured guidance." },
      { title: "Best practice", content: "Include your project name, description, key documentation links, and API references in llms.txt. Keep it concise and well-structured." },
    ],
  },
  "MCP Endpoint": {
    summary: "Enables AI agents to interact with your data directly",
    sections: [
      { title: "What this checks", content: "Visum checks for a Model Context Protocol (MCP) endpoint that allows AI agents to query your data in real-time rather than just reading static pages." },
      { title: "Why it matters", content: "MCP endpoints transform your site from a read-only reference into an interactive data source. AI agents can check prices, inventory, or availability directly." },
      { title: "Best practice", content: "Start with a simple MCP endpoint exposing your most-requested data. Focus on queries that AI users would naturally ask, like pricing or product details." },
    ],
  },
  "JavaScript Rendering": {
    summary: "Determines if AI crawlers can see your full content",
    sections: [
      { title: "What this checks", content: "Visum checks whether your critical content is visible without JavaScript execution. Many AI crawlers don't run JavaScript and see only the initial HTML." },
      { title: "Why it matters", content: "Content that only appears after JavaScript runs is invisible to many AI crawlers. Your products, articles, and key messages may not exist to AI systems." },
      { title: "Best practice", content: "Use server-side rendering (SSR) or static generation (SSG) for critical content. Ensure key information is in the initial HTML response." },
    ],
  },
  "Meta Tags and Open Graph": {
    summary: "Controls how AI summarization tools describe your site",
    sections: [
      { title: "What this checks", content: "Visum checks for proper meta description, title tags, and Open Graph protocol tags that AI systems use when citing or describing your content." },
      { title: "Why it matters", content: "AI tools extract meta descriptions to summarize your site in search results and citations. Missing or short tags result in generic, auto-generated snippets." },
      { title: "Best practice", content: "Write compelling meta descriptions (120-160 characters) and complete Open Graph tags including og:title, og:description, and og:image." },
    ],
  },
  "Sitemap.xml": {
    summary: "Helps AI crawlers discover all your pages efficiently",
    sections: [
      { title: "What this checks", content: "Visum checks for a sitemap.xml file and verifies it includes proper lastmod dates and covers your important pages." },
      { title: "Why it matters", content: "Sitemaps give AI crawlers a complete roadmap of your site. Without one, only externally-linked pages get discovered, delaying indexing by weeks." },
      { title: "Best practice", content: "Keep your sitemap up to date with current lastmod dates. Include all pages you want indexed, and reference it in robots.txt." },
    ],
  },
  "Page Load Speed": {
    summary: "Measures how fast AI agents can access your content",
    sections: [
      { title: "What this checks", content: "Visum measures how quickly your pages load from the perspective of AI crawlers, which often have stricter timeouts than human users." },
      { title: "Why it matters", content: "AI agents operate under strict timeouts (5-10 seconds). Slow-loading pages are abandoned before content finishes rendering, especially on mobile connections." },
      { title: "Best practice", content: "Target <2 second load time for optimal AI crawler access. Use CDN, optimize images, minimize JavaScript, and enable compression." },
    ],
  },
};

export function ExplanationPanel({ checkName, className }) {
  const [isVisible, setIsVisible] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);

  const info = CATEGORY_INFO[checkName];

  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (!info) return null;

  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card transition-all duration-500",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        className
      )}
    >
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <svg className="h-4 w-4 text-accent" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-xs font-semibold uppercase tracking-widest text-foreground">
            About This Check
          </p>
        </div>

        <p className="text-xs text-muted-foreground mb-3">{info.summary}</p>

        <div className="space-y-1">
          {info.sections.map((section, idx) => (
            <div key={idx} className="border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => setExpandedSection(expandedSection === idx ? null : idx)}
                className="flex items-center justify-between w-full px-3 py-2 text-left text-[11px] font-semibold text-foreground hover:bg-muted/10 transition-colors"
              >
                {section.title}
                <svg
                  className={cn("h-3 w-3 text-muted-foreground transition-transform", expandedSection === idx && "rotate-180")}
                  viewBox="0 0 20 20" fill="currentColor"
                >
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </button>
              <div
                className={cn(
                  "overflow-hidden transition-all duration-200",
                  expandedSection === idx ? "max-h-40" : "max-h-0"
                )}
              >
                <p className="px-3 pb-2 text-[11px] text-muted-foreground leading-relaxed">
                  {section.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
