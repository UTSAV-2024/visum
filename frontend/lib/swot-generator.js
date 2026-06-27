/**
 * SWOT Generator — converts scan result checks into an AI Visibility Summary.
 *
 * Takes the `checks` array from a scan result and produces:
 *   { strengths: [], weaknesses: [], opportunities: [], risks: [] }
 *
 * Each entry: { id, message, priority: "critical"|"high"|"medium" }
 *
 * Priority mapping (by check name):
 *   Critical — JavaScript Rendering, AI Bot Permissions
 *   High     — JSON-LD Structured Data, MCP Endpoint
 *   Medium   — llms.txt File, Sitemap.xml, Meta Tags and Open Graph, Page Load Speed
 */

const PRIORITY_ORDER = { critical: 0, high: 1, medium: 2 };

const CHECK_PRIORITY = {
  "JavaScript Rendering": "critical",
  "AI Bot Permissions (robots.txt)": "critical",
  "JSON-LD Structured Data": "high",
  "MCP Endpoint": "high",
  "llms.txt File": "medium",
  "Sitemap.xml": "medium",
  "Meta Tags and Open Graph": "medium",
  "Page Load Speed": "medium",
};

/**
 * Generate strength messages from passed checks.
 */
function generateStrengths(checks) {
  const passed = checks.filter((c) => c.passed);
  const messages = [];

  for (const check of passed) {
    switch (check.name) {
      case "AI Bot Permissions (robots.txt)":
        messages.push({
          id: "robots-accessible",
          message: "AI crawlers can access your site",
          priority: "critical",
        });
        break;
      case "JSON-LD Structured Data":
        messages.push({
          id: "schema-valid",
          message: "Structured data helps AI understand your content",
          priority: "high",
        });
        break;
      case "llms.txt File":
        messages.push({
          id: "llms-txt-present",
          message: "LLM-specific content file is available for AI assistants",
          priority: "medium",
        });
        break;
      case "MCP Endpoint":
        messages.push({
          id: "mcp-present",
          message: "AI agents can interact with your site programmatically",
          priority: "high",
        });
        break;
      case "JavaScript Rendering":
        messages.push({
          id: "ssr-valid",
          message: "Content is accessible without JavaScript execution",
          priority: "critical",
        });
        break;
      case "Meta Tags and Open Graph":
        messages.push({
          id: "meta-complete",
          message: "Complete metadata for AI engine understanding",
          priority: "medium",
        });
        break;
      case "Sitemap.xml":
        messages.push({
          id: "sitemap-present",
          message: "Sitemap is available for AI crawler discovery",
          priority: "medium",
        });
        break;
      case "Page Load Speed":
        messages.push({
          id: "speed-fast",
          message: "Fast page load speed reduces AI agent timeout risk",
          priority: "medium",
        });
        break;
    }
  }

  // Sort by priority, then limit to top 3
  return messages
    .sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority])
    .slice(0, 3);
}

/**
 * Generate weakness messages from failed checks.
 */
function generateWeaknesses(checks) {
  const failed = checks.filter((c) => !c.passed && !c.partial);
  const messages = [];

  for (const check of failed) {
    switch (check.name) {
      case "AI Bot Permissions (robots.txt)":
        messages.push({
          id: "robots-blocked",
          message: "AI crawlers are blocked from accessing your site",
          priority: "critical",
        });
        break;
      case "JSON-LD Structured Data":
        messages.push({
          id: "schema-missing",
          message: "No structured data markup — AI agents must guess what your site offers",
          priority: "high",
        });
        break;
      case "llms.txt File":
        messages.push({
          id: "llms-txt-missing",
          message: "No llms.txt file for AI coding assistants to discover",
          priority: "medium",
        });
        break;
      case "MCP Endpoint":
        messages.push({
          id: "mcp-missing",
          message: "No MCP endpoint for AI agents to interact with your site",
          priority: "high",
        });
        break;
      case "JavaScript Rendering":
        messages.push({
          id: "js-heavy",
          message: "Heavy JavaScript dependency — non-JS AI crawlers see almost nothing",
          priority: "critical",
        });
        break;
      case "Meta Tags and Open Graph":
        messages.push({
          id: "meta-incomplete",
          message: "Incomplete meta tags reduce AI engine understanding",
          priority: "medium",
        });
        break;
      case "Sitemap.xml":
        messages.push({
          id: "sitemap-missing",
          message: "No sitemap — AI crawlers may miss important pages",
          priority: "medium",
        });
        break;
      case "Page Load Speed":
        messages.push({
          id: "speed-slow",
          message: "Slow page load increases AI agent timeout risk",
          priority: "medium",
        });
        break;
    }
  }

  return messages
    .sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority])
    .slice(0, 3);
}

/**
 * Generate opportunity messages from partial checks and other
 * improvement areas.
 */
function generateOpportunities(checks) {
  const partial = checks.filter((c) => c.partial);
  const messages = [];

  for (const check of partial) {
    switch (check.name) {
      case "JSON-LD Structured Data":
        messages.push({
          id: "schema-improve",
          message: "Add complete JSON-LD schema markup (Product, LocalBusiness, FAQ)",
          priority: "high",
        });
        break;
      case "MCP Endpoint":
        messages.push({
          id: "mcp-add",
          message: "Add MCP endpoint for AI agents to query your site",
          priority: "high",
        });
        break;
      case "JavaScript Rendering":
        messages.push({
          id: "ssr-improve",
          message: "Improve server-side rendering so AI crawlers can read all content",
          priority: "critical",
        });
        break;
      case "Meta Tags and Open Graph":
        messages.push({
          id: "meta-fill-gaps",
          message: "Add missing meta tags and Open Graph properties",
          priority: "medium",
        });
        break;
      case "Sitemap.xml":
        messages.push({
          id: "sitemap-lastmod",
          message: "Add lastmod dates to sitemap for better crawler prioritisation",
          priority: "medium",
        });
        break;
      case "Page Load Speed":
        messages.push({
          id: "speed-optimize",
          message: "Optimise page speed to reduce AI agent timeout risk",
          priority: "medium",
        });
        break;
      case "llms.txt File":
        messages.push({
          id: "llms-txt-complete",
          message: "Complete llms.txt with project name, description, and documentation URLs",
          priority: "medium",
        });
        break;
    }
  }

  // Also add opportunities for failed checks that weren't already covered
  const failed = checks.filter((c) => !c.passed && !c.partial);
  for (const check of failed) {
    switch (check.name) {
      case "JSON-LD Structured Data":
        if (!messages.some((m) => m.id === "schema-improve")) {
          messages.push({
            id: "schema-add",
            message: "Add JSON-LD schema markup so AI agents understand your content",
            priority: "high",
          });
        }
        break;
      case "llms.txt File":
        if (!messages.some((m) => m.id === "llms-txt-complete")) {
          messages.push({
            id: "llms-txt-create",
            message: "Create an llms.txt file for AI coding assistants",
            priority: "medium",
          });
        }
        break;
      case "MCP Endpoint":
        if (!messages.some((m) => m.id === "mcp-add")) {
          messages.push({
            id: "mcp-create",
            message: "Enable MCP support so AI agents can take actions on your site",
            priority: "high",
          });
        }
        break;
      case "Sitemap.xml":
        if (!messages.some((m) => m.id === "sitemap-lastmod")) {
          messages.push({
            id: "sitemap-create",
            message: "Generate a sitemap.xml so AI crawlers discover all your pages",
            priority: "medium",
          });
        }
        break;
      case "JavaScript Rendering":
        if (!messages.some((m) => m.id === "ssr-improve")) {
          messages.push({
            id: "ssr-add",
            message: "Implement server-side rendering so AI crawlers can read your content",
            priority: "critical",
          });
        }
        break;
      case "Page Load Speed":
        if (!messages.some((m) => m.id === "speed-optimize")) {
          messages.push({
            id: "speed-improve",
            message: "Optimise page speed to reduce AI agent timeout risk",
            priority: "medium",
          });
        }
        break;
    }
  }

  return messages
    .sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority])
    .slice(0, 3);
}

/**
 * Generate risk messages — consequences of failed or partial checks.
 */
function generateRisks(checks) {
  const weakOrFailed = checks.filter((c) => !c.passed);
  const messages = [];

  // Collect risks based on what's failing
  for (const check of weakOrFailed) {
    switch (check.name) {
      case "JavaScript Rendering":
        messages.push({
          id: "risk-js-crawling",
          message:
            "AI crawlers may fail to access important content if it requires JavaScript execution",
          priority: "critical",
        });
        break;
      case "AI Bot Permissions (robots.txt)":
        if (!check.partial && !check.passed) {
          messages.push({
            id: "risk-robots-blocked",
            message:
              "AI systems are blocked from crawling your site, reducing AI-driven traffic",
            priority: "critical",
          });
        }
        break;
      case "JSON-LD Structured Data":
        messages.push({
          id: "risk-no-schema",
          message:
            "AI systems may misunderstand your content without structured data",
          priority: "high",
        });
        break;
      case "MCP Endpoint":
        messages.push({
          id: "risk-no-mcp",
          message:
            "Future AI agents may be unable to interact with or query your site",
          priority: "high",
        });
        break;
      case "llms.txt File":
        messages.push({
          id: "risk-no-llms",
          message:
            "AI coding assistants cannot discover your project without llms.txt",
          priority: "medium",
        });
        break;
      case "Page Load Speed":
        if (!check.partial && !check.passed) {
          messages.push({
            id: "risk-slow-speed",
            message:
              "AI agents may time out before your page finishes loading",
            priority: "medium",
          });
        }
        break;
    }
  }

  return messages
    .sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority])
    .slice(0, 2);
}

/**
 * Main entry point.
 *
 * @param {Array} checks — the `checks` array from a scan result
 * @returns {{ strengths: Array, weaknesses: Array, opportunities: Array, risks: Array }}
 *
 * Each array entry: { id: string, message: string, priority: "critical"|"high"|"medium" }
 */
export function generateSwot(checks) {
  if (!Array.isArray(checks) || checks.length === 0) {
    return { strengths: [], weaknesses: [], opportunities: [], risks: [] };
  }

  return {
    strengths: generateStrengths(checks),
    weaknesses: generateWeaknesses(checks),
    opportunities: generateOpportunities(checks),
    risks: generateRisks(checks),
  };
}
